import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  text: z.string().min(20).max(80_000),
});

const PdfInputSchema = z.object({
  filename: z.string().min(1).max(180),
  fileData: z
    .string()
    .min("data:application/pdf;base64,".length + 100)
    .max(16_000_000)
    .refine((value) => value.startsWith("data:application/pdf;base64,"), {
      message: "Invalid PDF data",
    }),
});

const TagsOutputSchema = z.object({
  tags: z
    .array(z.string().min(1).max(40))
    .max(30)
    .describe(
      "Short tags representing skills, tools, programming languages, design tools, methodologies, business sectors. Each 1-3 words, Title Case where appropriate."
    ),
});

function normalizeTags(rawTags: unknown) {
  if (!Array.isArray(rawTags)) return [];
  return Array.from(
    new Set(
      rawTags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && tag.length <= 40)
    )
  ).slice(0, 30);
}

function parseTagsJson(content: string) {
  const withoutFence = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return [];
  const parsed = JSON.parse(withoutFence.slice(start, end + 1)) as { tags?: unknown };
  return normalizeTags(parsed.tags);
}

export const extractTagsFromText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const truncated = data.text.slice(0, 40_000);

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      experimental_output: Output.object({
        schema: TagsOutputSchema,
      }),
      system:
        "You extract a concise list of professional tags from a freelancer's skills dossier. Tags must cover: hard skills, tools, technologies, languages, methodologies, and business sectors. Avoid duplicates and overly generic words like 'work' or 'project'. Keep tags short (1-3 words). Return fewer than 3 tags if the source does not support more.",
      prompt: `Extract 8–20 useful tags from this freelancer skills dossier text:\n\n${truncated}`,
    });

    const tags = normalizeTags(experimental_output.tags);

    return { tags, source: "text" as const };
  });

export const extractTagsFromPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PdfInputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "direct-pdf-tags",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        temperature: 0.1,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "You extract concise professional skill tags from a freelancer skills dossier PDF. Read visual pages, scanned text, and layouts. Return only a JSON object with a tags array. Tags must be concrete skills, tools, technologies, methodologies, languages, or business sectors. Avoid duplicates and generic words.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Analyze this PDF visually and extract 8-20 useful short tags. Return exactly: {"tags":["Tag"]}. Return an empty tags array if no professional skills are visible.',
              },
              {
                type: "file",
                file: {
                  filename: data.filename,
                  file_data: data.fileData,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("PDF visual tag extraction failed", response.status, details.slice(0, 1200));
      throw new Error("L'analyse visuelle du PDF a échoué");
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    const text = Array.isArray(content)
      ? content
          .map((part) =>
            part && typeof part === "object" && "text" in part ? String(part.text ?? "") : ""
          )
          .join("\n")
      : typeof content === "string"
        ? content
        : "";

    let tags: string[] = [];
    try {
      tags = parseTagsJson(text);
    } catch (error) {
      console.error("PDF tag JSON parsing failed", error, text.slice(0, 1200));
    }

    return { tags, source: "visual" as const };
  });
