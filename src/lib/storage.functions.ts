import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  bucket: z.enum(["portfolios", "avatars"]),
  path: z.string().min(1).max(512),
  expiresIn: z.number().int().min(30).max(60 * 60 * 24).default(3600),
});

export const getSignedFileUrlFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Authorize: the requested file path MUST be referenced by a published
    // freelancer profile (avatar_url or portfolio_url). Owner-uploaded but
    // unpublished files are not exposed via this public endpoint.
    const column = data.bucket === "avatars" ? "avatar_url" : "portfolio_url";
    const { data: row, error: lookupError } = await supabaseAdmin
      .from("freelancer_profiles")
      .select("id")
      .eq(column, data.path)
      .eq("published", true)
      .maybeSingle();

    if (lookupError) throw new Error("Lookup failed");
    if (!row) throw new Response("Not found", { status: 404 });

    const { data: signed, error } = await supabaseAdmin.storage
      .from(data.bucket)
      .createSignedUrl(data.path, data.expiresIn);
    if (error || !signed?.signedUrl) throw new Error("Failed to sign URL");
    return { url: signed.signedUrl, expiresIn: data.expiresIn };
  });
