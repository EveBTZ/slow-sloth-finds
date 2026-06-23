import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { extractKnownSkillTags, mergeSkillTags, SKILL_REFERENCE_TAGS } from "./skill-tags";

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

const ImageInputSchema = z.object({
  filename: z.string().min(1).max(180),
  images: z
    .array(
      z
        .string()
        .min("data:image/jpeg;base64,".length + 100)
        .max(2_500_000)
        .refine((value) => value.startsWith("data:image/jpeg;base64,"), {
          message: "Invalid image data",
        })
    )
    .min(1)
    .max(6),
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
  return mergeSkillTags(
    rawTags
      .filter((tag): tag is string => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0 && tag.length <= 40),
    30
  );
}

function parseTagsJson(content: string) {
  const withoutFence = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return [];
  try {
    const parsed = JSON.parse(withoutFence.slice(start, end + 1)) as { tags?: unknown };
    return normalizeTags(parsed.tags);
  } catch {
    return [];
  }
}

function parseLooseTags(content: string) {
  return mergeSkillTags(
    content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .split(/[\n,;|•]+/g)
      .map((part) =>
        part
          .replace(/^\s*[-*\d.)]+\s*/, "")
          .replace(/^["'\[]+|["'\].]+$/g, "")
          .trim()
      )
      .filter((part) => part.length > 1 && part.length <= 40 && part.split(/\s+/).length <= 4)
      .filter((part) => !/^(tags?|skills?|competences?|compétences?)$/i.test(part)),
    30
  );
}

function readMessageContent(content: unknown) {
  return Array.isArray(content)
    ? content
        .map((part) =>
          part && typeof part === "object" && "text" in part ? String(part.text ?? "") : ""
        )
        .join("\n")
    : typeof content === "string"
      ? content
      : "";
}

async function extractTagsFromVisionBlocks(
  key: string,
  text: string,
  blocks: Array<Record<string, unknown>>,
  sdk: string
) {
  const referenceTags = SKILL_REFERENCE_TAGS.slice(0, 140).join(", ");
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": sdk,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      temperature: 0.1,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            `You extract concise professional skill tags from a freelancer skills dossier. Read visual pages, scanned text, and layouts. First identify all visible words, tools, technologies, methods, sectors, and languages, then infer tags from them. Return only a JSON object with a tags array. Tags must be concrete skills, tools, technologies, methodologies, languages, or business sectors. Avoid duplicates and generic words. Prefer these canonical tags when they match the dossier: ${referenceTags}.`,
        },
        {
          role: "user",
          content: [{ type: "text", text }, ...blocks],
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Visual tag extraction failed", response.status, details.slice(0, 1200));
    throw new Error("L'analyse visuelle du dossier a échoué");
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  const messageText = readMessageContent(content);

  const parsedTags = parseTagsJson(messageText);
  const looseTags = parsedTags.length > 0 ? [] : parseLooseTags(messageText);
  const referenceMatches = extractKnownSkillTags(messageText);

  return mergeSkillTags([...parsedTags, ...looseTags, ...referenceMatches], 30);
}

export const extractTagsFromText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const referenceTags = extractKnownSkillTags(data.text);
    const gateway = createLovableAiGatewayProvider(key);

    const truncated = data.text.slice(0, 40_000);

    try {
      const { experimental_output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        experimental_output: Output.object({
          schema: TagsOutputSchema,
        }),
        system:
          "You extract a concise list of professional tags from a freelancer's skills dossier. Tags must cover: hard skills, tools, technologies, languages, methodologies, and business sectors. Avoid duplicates and overly generic words like 'work' or 'project'. Keep tags short (1-3 words). Return fewer than 3 tags if the source does not support more.",
        prompt: `Extract 8–20 useful tags from this freelancer skills dossier text. Prefer these canonical tags when they are supported by the text: ${SKILL_REFERENCE_TAGS.join(", ")}\n\n${truncated}`,
      });

      const tags = mergeSkillTags([...referenceTags, ...normalizeTags(experimental_output.tags)], 30);

      return { tags, source: "text" as const };
    } catch (error) {
      if (referenceTags.length > 0) {
        console.error("AI text tag extraction failed; using reference matches", error);
        return { tags: referenceTags, source: "reference" as const };
      }
      throw error;
    }
  });

export const extractTagsFromPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PdfInputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const tags = await extractTagsFromVisionBlocks(
      key,
      'Analyze this PDF visually and extract 8-20 useful short tags. Return exactly: {"tags":["Tag"]}. Return an empty tags array if no professional skills are visible.',
      [
        {
          type: "file",
          file: {
            filename: data.filename,
            file_data: data.fileData,
          },
        },
      ],
      "direct-pdf-tags"
    );

    return { tags, source: "visual" as const };
  });

export const extractTagsFromImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ImageInputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const tags = await extractTagsFromVisionBlocks(
      key,
      `Analyze these rendered pages from the PDF dossier "${data.filename}" and extract 8-20 useful short professional skill tags. Return exactly: {"tags":["Tag"]}.`,
      data.images.map((url) => ({ type: "image_url", image_url: { url } })),
      "rendered-page-tags"
    );

    return { tags, source: "images" as const };
  });
