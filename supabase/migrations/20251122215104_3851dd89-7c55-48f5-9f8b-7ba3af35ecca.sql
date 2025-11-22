-- Drop and recreate with correct syntax (IF NOT EXISTS not supported for policies)
DROP POLICY IF EXISTS "Public can upload content media" ON storage.objects;

-- Allow public uploads to content-media bucket
CREATE POLICY "Public can upload content media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'content-media');