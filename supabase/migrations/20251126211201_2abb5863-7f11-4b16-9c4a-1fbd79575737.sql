-- Update all existing knytrise content to scrolls domain with metaknyts tab
UPDATE content 
SET 
  domain = 'scrolls',
  placement = jsonb_set(
    jsonb_set(
      COALESCE(placement, '{}'::jsonb),
      '{section}',
      '"scrolls"'::jsonb
    ),
    '{tab}',
    '"metaknyts"'::jsonb
  )
WHERE domain = 'knytrise';

-- Add a comment to track the migration
COMMENT ON COLUMN content.domain IS 'Content domain - knytrise was renamed to scrolls with tabs (metaknyts, synthsims)';