-- Revoke admin role from chris@cryptopolitics.us and cdavis@cryptopolitics.us
DELETE FROM user_roles
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('chris@cryptopolitics.us', 'cdavis@cryptopolitics.us')
)
AND role_id IN (
  SELECT r.id FROM roles r
  JOIN tenants t ON r.tenant_id = t.id
  WHERE r.name = 'admin' AND t.name = 'default'
);

-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;

-- Update the auto-assign function to only include confirmed admin team
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_role_id uuid;
  approved_emails text[] := ARRAY[
    'cd@cryptopolitics.us',
    'dele@metame.cm'
  ];
BEGIN
  -- Check if user email is in approved list
  IF NEW.email = ANY(approved_emails) THEN
    -- Get admin role ID for default tenant
    SELECT r.id INTO admin_role_id
    FROM roles r
    JOIN tenants t ON r.tenant_id = t.id
    WHERE r.name = 'admin' AND t.name = 'default'
    LIMIT 1;
    
    -- Assign admin role if found
    IF admin_role_id IS NOT NULL THEN
      INSERT INTO user_roles (user_id, role_id)
      VALUES (NEW.id, admin_role_id)
      ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_admin_role();

-- Ensure dele@metame.cm has admin role if account exists
DO $$
DECLARE
  admin_role_id uuid;
  dele_user_id uuid;
BEGIN
  -- Get admin role ID
  SELECT r.id INTO admin_role_id
  FROM roles r
  JOIN tenants t ON r.tenant_id = t.id
  WHERE r.name = 'admin' AND t.name = 'default'
  LIMIT 1;
  
  -- Check if dele@metame.cm exists and assign admin
  SELECT id INTO dele_user_id FROM auth.users WHERE email = 'dele@metame.cm';
  
  IF dele_user_id IS NOT NULL AND admin_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id)
    VALUES (dele_user_id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;
END;
$$;