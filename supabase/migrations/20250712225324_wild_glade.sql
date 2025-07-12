/*
  # Create admins table for admin management

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text, default 'admin')
      - `status` (text, default 'active')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `admins` table
    - Add policies for authenticated users to manage admins
*/

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert admins"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update admins"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete admins"
  ON admins
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();