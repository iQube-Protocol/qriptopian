-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can upload content media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update content media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete content media" ON storage.objects;

-- Create more permissive policies for authenticated users
CREATE POLICY "Authenticated users can upload content media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-media');

CREATE POLICY "Authenticated users can update content media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-media');

CREATE POLICY "Authenticated users can delete content media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-media');