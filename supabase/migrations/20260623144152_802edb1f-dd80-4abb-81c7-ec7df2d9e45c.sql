CREATE POLICY "Public can view avatars of published profiles"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'avatars'
  AND EXISTS (
    SELECT 1 FROM public.freelancer_profiles fp
    WHERE fp.published = true
      AND fp.id::text = (storage.foldername(name))[1]
  )
);