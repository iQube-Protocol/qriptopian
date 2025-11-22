-- Create storage bucket for content media
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-media', 'content-media', true);

-- Create RLS policies for content-media bucket
CREATE POLICY "Admins can upload content media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'content-media' AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  )
);

CREATE POLICY "Anyone can view content media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-media');

CREATE POLICY "Admins can update content media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'content-media' AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can delete content media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'content-media' AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  )
);

-- Add issue_ref column to content table
ALTER TABLE content ADD COLUMN IF NOT EXISTS issue_ref TEXT;

-- Create index for faster issue queries
CREATE INDEX IF NOT EXISTS idx_content_issue_ref ON content(issue_ref);