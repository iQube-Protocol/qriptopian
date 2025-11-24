
-- Assign admin role to existing user cd@cryptopolitics.us
INSERT INTO user_roles (user_id, role_id)
SELECT 
  '060f04df-e22d-4b1c-88a2-7d2a1ada85e9'::uuid,
  r.id
FROM roles r
JOIN tenants t ON r.tenant_id = t.id
WHERE r.name = 'admin' AND t.name = 'default'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Create function to auto-assign admin role to approved emails
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
    'chris@cryptopolitics.us',
    'cdavis@cryptopolitics.us',
    'admin@cryptopolitics.us'
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

-- Create trigger to auto-assign admin on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_admin_role();

-- Also run the function for any existing users who should be admins
DO $$
DECLARE
  user_record RECORD;
  admin_role_id uuid;
BEGIN
  -- Get admin role ID
  SELECT r.id INTO admin_role_id
  FROM roles r
  JOIN tenants t ON r.tenant_id = t.id
  WHERE r.name = 'admin' AND t.name = 'default'
  LIMIT 1;
  
  -- Assign admin to all approved emails that exist
  FOR user_record IN 
    SELECT id FROM auth.users 
    WHERE email IN (
      'cd@cryptopolitics.us',
      'chris@cryptopolitics.us', 
      'cdavis@cryptopolitics.us',
      'admin@cryptopolitics.us'
    )
  LOOP
    INSERT INTO user_roles (user_id, role_id)
    VALUES (user_record.id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END LOOP;
END;
$$;
