/*
  # Create Super Admin User

  1. New Functions
    - `create_super_admin()` - Creates the initial super admin user
    - `is_super_admin()` - Checks if a user is a super admin
  
  2. Security
    - Creates admin@spcc.com as super admin
    - Sets up proper RLS policies for admin creation
  
  3. Initial Setup
    - Inserts super admin record with predefined credentials
*/

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.user_id = $1 AND role = 'super_admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create super admin (run once)
CREATE OR REPLACE FUNCTION create_super_admin()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if super admin already exists
  IF EXISTS (SELECT 1 FROM admins WHERE email = 'admin@spcc.com') THEN
    RAISE NOTICE 'Super admin already exists';
    RETURN;
  END IF;

  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@spcc.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO admin_user_id;

  -- Create admin record
  INSERT INTO admins (
    user_id,
    email,
    name,
    role,
    status
  ) VALUES (
    admin_user_id,
    'admin@spcc.com',
    'Super Administrator',
    'super_admin',
    'active'
  );

  RAISE NOTICE 'Super admin created successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the super admin
SELECT create_super_admin();

-- Update RLS policies for admin creation
DROP POLICY IF EXISTS "Allow authenticated users to manage admins" ON admins;

CREATE POLICY "Allow super admins to manage all admins"
  ON admins
  FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Allow admins to read their own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());