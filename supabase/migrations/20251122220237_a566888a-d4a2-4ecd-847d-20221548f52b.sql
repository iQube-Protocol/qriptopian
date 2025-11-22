-- Check current domain constraint
DO $$ 
BEGIN
  -- Drop existing domain check constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'content_domain_check' 
    AND conrelid = 'public.content'::regclass
  ) THEN
    ALTER TABLE public.content DROP CONSTRAINT content_domain_check;
  END IF;
END $$;

-- Add updated domain check constraint that includes 'qriptopian'
ALTER TABLE public.content 
ADD CONSTRAINT content_domain_check 
CHECK (domain IN ('qriptopian', 'aigent', 'nakamoto', 'default'));