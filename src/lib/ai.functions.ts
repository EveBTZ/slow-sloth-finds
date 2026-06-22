import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  text: z.string().min(20).max(80_000),
});

export const extractTagsFromText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const truncated = data.text.slice(0, 40_000);

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      experimental_output: Output.object({
        schema: z.object({
          tags: z
            .array(z.string().min(1).max(40))
            .min(3)
            .max(30)
            .describe(
              "Short tags representing skills, tools, programming languages, design tools, methodologies, business sectors. Each 1-3 words, Title Case where appropriate."
            ),
        }),
      }),
      system:
        "You extract a concise list of professional tags from a freelancer's portfolio. Tags must cover: hard skills, tools, technologies, languages, methodologies, and business sectors. Avoid duplicates and overly generic words like 'work' or 'project'. Keep tags short (1-3 words).",
      prompt: `Extract 8–20 useful tags from this freelancer portfolio text:\n\n${truncated}`,
    });

    const tags = Array.from(
      new Set(
        (experimental_output.tags ?? [])
          .map((t) => t.trim())
          .filter((t) => t.length > 0 && t.length <= 40)
      )
    );

    return { tags };
  });
