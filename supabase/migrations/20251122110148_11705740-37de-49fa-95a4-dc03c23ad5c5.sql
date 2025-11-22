-- Create a security definer function to check if the current user has admin role
create or replace function public.has_admin_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    join public.tenants t on r.tenant_id = t.id
    where ur.user_id = auth.uid()
      and r.name = 'admin'
      and t.name = 'default'
  );
$$;