import { supabase } from "@/integrations/supabase/client";
import { getSignedFileUrlFn } from "@/lib/storage.functions";

const cache = new Map<string, { url: string; exp: number }>();

/**
 * Public signed URL for files referenced by a published freelancer profile.
 * Goes through a server function that validates the file is publicly
 * referenced before signing — so anonymous visitors can render avatars and
 * portfolios without granting blanket public read on the storage bucket.
 */
export async function getSignedFileUrl(
  bucket: "portfolios" | "avatars",
  path: string | null | undefined,
  expiresIn = 60 * 60,
): Promise<string | null> {
  if (!path) return null;
  const key = `pub:${bucket}:${path}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.exp > now + 30_000) return hit.url;

  try {
    const res = await getSignedFileUrlFn({ data: { bucket, path, expiresIn } });
    cache.set(key, { url: res.url, exp: now + expiresIn * 1000 });
    return res.url;
  } catch {
    return null;
  }
}

/**
 * Owner signed URL — used in the dashboard for the signed-in user's own
 * files (including unpublished ones). Relies on the owner-scoped SELECT
 * policy on storage.objects.
 */
export async function getOwnerSignedFileUrl(
  bucket: "portfolios" | "avatars",
  path: string | null | undefined,
  expiresIn = 60 * 60,
): Promise<string | null> {
  if (!path) return null;
  const key = `own:${bucket}:${path}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.exp > now + 30_000) return hit.url;

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) return null;
  cache.set(key, { url: data.signedUrl, exp: now + expiresIn * 1000 });
  return data.signedUrl;
}
