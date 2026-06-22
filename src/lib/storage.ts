import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, { url: string; exp: number }>();

export async function getSignedFileUrl(
  bucket: "portfolios" | "avatars",
  path: string | null | undefined,
  expiresIn = 60 * 60,
): Promise<string | null> {
  if (!path) return null;
  const key = `${bucket}:${path}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.exp > now + 30_000) return hit.url;

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) return null;
  cache.set(key, { url: data.signedUrl, exp: now + expiresIn * 1000 });
  return data.signedUrl;
}
