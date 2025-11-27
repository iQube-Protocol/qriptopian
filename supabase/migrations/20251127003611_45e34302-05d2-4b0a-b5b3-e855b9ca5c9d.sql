-- Update content-media bucket to allow larger file uploads (500MB limit for videos)
UPDATE storage.buckets 
SET file_size_limit = 524288000 
WHERE id = 'content-media';