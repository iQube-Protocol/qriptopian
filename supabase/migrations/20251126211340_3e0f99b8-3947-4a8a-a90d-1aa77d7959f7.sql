-- Move existing KNYT Rise content to Scrolls section with metaKnyts tab
UPDATE content
SET placement = jsonb_set(
  jsonb_set(
    COALESCE(placement, '{}'::jsonb),
    '{section}',
    '"scrolls"'::jsonb
  ),
  '{tab}',
  '"metaknyts"'::jsonb
)
WHERE placement->>'section' = 'knytrise';