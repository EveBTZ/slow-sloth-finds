
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Public read for portfolios and avatars
CREATE POLICY "Public read portfolios" ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolios');
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can manage files inside their own user folder
CREATE POLICY "Users upload own portfolio" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own portfolio" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own portfolio" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
