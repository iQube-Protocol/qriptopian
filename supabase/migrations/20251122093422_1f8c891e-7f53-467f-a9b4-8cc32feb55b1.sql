-- Enhance content table with new columns for content management
alter table public.content 
add column if not exists layout_type text check (layout_type in ('hero', 'card', 'thumbnail-large', 'thumbnail-small', 'grid')),
add column if not exists placement jsonb default '{}',
add column if not exists modalities jsonb default '{}',
add column if not exists ai_metadata jsonb default '{}',
add column if not exists duration text;

-- Create content_revisions table
create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.content(id) on delete cascade,
  version integer not null,
  data jsonb not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Enable RLS on content_revisions
alter table public.content_revisions enable row level security;

-- RLS policies for content_revisions (admins only)
drop policy if exists "Admins can manage revisions" on public.content_revisions;
create policy "Admins can manage revisions"
on public.content_revisions
for all
to authenticated
using (
  exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    where ur.user_id = auth.uid() and r.name = 'admin'
  )
);

-- Update content RLS policies for admin access
drop policy if exists "Admins can manage all content" on public.content;
create policy "Admins can manage all content"
on public.content
for all
to authenticated
using (
  exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    where ur.user_id = auth.uid() and r.name = 'admin'
  )
)
with check (
  exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    where ur.user_id = auth.uid() and r.name = 'admin'
  )
);

-- Create indexes for better query performance
create index if not exists idx_content_placement on public.content using gin(placement);
create index if not exists idx_content_status on public.content(status);
create index if not exists idx_content_layout on public.content(layout_type);