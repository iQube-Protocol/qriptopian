-- Create a default tenant for the application
INSERT INTO public.tenants (name, display_name, status)
VALUES ('default', 'Default Tenant', 'active')
ON CONFLICT DO NOTHING;

-- Create admin role
INSERT INTO public.roles (name, tenant_id)
SELECT 'admin', id FROM public.tenants WHERE name = 'default'
ON CONFLICT DO NOTHING;

-- Assign admin role to dele@metame.com (super admin)
INSERT INTO public.user_roles (user_id, role_id)
SELECT '3cda62fc-63d5-427f-8bda-977f9829941b', r.id
FROM public.roles r
JOIN public.tenants t ON r.tenant_id = t.id
WHERE r.name = 'admin' AND t.name = 'default'
ON CONFLICT DO NOTHING;

-- Create a function to easily assign admin roles to new users
CREATE OR REPLACE FUNCTION public.assign_admin_role(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role_id uuid;
BEGIN
  -- Get user id from email
  SELECT id INTO v_user_id FROM auth.users WHERE email = user_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Get admin role id
  SELECT r.id INTO v_role_id 
  FROM public.roles r
  JOIN public.tenants t ON r.tenant_id = t.id
  WHERE r.name = 'admin' AND t.name = 'default';
  
  -- Assign role
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (v_user_id, v_role_id)
  ON CONFLICT DO NOTHING;
END;
$$;