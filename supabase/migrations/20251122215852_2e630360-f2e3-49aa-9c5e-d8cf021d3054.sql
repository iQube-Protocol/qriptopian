-- Allow anon role (editor in preview) to create Qriptopian content
DROP POLICY IF EXISTS "Anon can create qriptopian content" ON public.content;

CREATE POLICY "Anon can create qriptopian content"
ON public.content
FOR INSERT
TO anon
WITH CHECK (domain = 'qriptopian');