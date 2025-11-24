-- Update the auto-assign function to include all confirmed admin team members
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
    'dele@metame.cm',
    'kt@cryptopolitics.us',
    'lisawattslimitless@gmail.com'
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

-- Assign admin role to kt@cryptopolitics.us and lisawattslimitless@gmail.com if they exist
DO $$
DECLARE
  admin_role_id uuid;
BEGIN
  -- Get admin role ID
  SELECT r.id INTO admin_role_id
  FROM roles r
  JOIN tenants t ON r.tenant_id = t.id
  WHERE r.name = 'admin' AND t.name = 'default'
  LIMIT 1;
  
  -- Assign admin to the new approved emails if they exist
  INSERT INTO user_roles (user_id, role_id)
  SELECT u.id, admin_role_id
  FROM auth.users u
  WHERE u.email IN ('kt@cryptopolitics.us', 'lisawattslimitless@gmail.com')
    AND admin_role_id IS NOT NULL
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$;