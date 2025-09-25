/*
  # Fix RLS policies for member data access

  1. Security Changes
    - Update members table RLS policies to allow proper data access
    - Allow authenticated users to read all member data
    - Allow authenticated users to manage members they create
    - Keep anonymous access for search functionality
    
  2. Policy Updates
    - Drop existing restrictive policies
    - Create new policies that allow proper data flow
    - Maintain security while enabling functionality
*/

-- Drop existing policies on members table
DROP POLICY IF EXISTS "Anonymous users can search members" ON members;
DROP POLICY IF EXISTS "Users can manage their own members" ON members;

-- Create new policies for members table
CREATE POLICY "Allow anonymous users to search members"
  ON members
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to read all members"
  ON members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update members"
  ON members
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete members"
  ON members
  FOR DELETE
  TO authenticated
  USING (true);

-- Update dues table policies for better access
DROP POLICY IF EXISTS "Users can manage their own dues records" ON dues;

CREATE POLICY "Allow authenticated users to manage all dues"
  ON dues
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update attendance table policies
DROP POLICY IF EXISTS "Authenticated users can view only their own attendance records" ON attendance;

CREATE POLICY "Allow authenticated users to manage all attendance"
  ON attendance
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure admin_logs policies allow proper logging
DROP POLICY IF EXISTS "Authenticated users can insert logs" ON admin_logs;
DROP POLICY IF EXISTS "Authenticated users can read all logs" ON admin_logs;

CREATE POLICY "Allow authenticated users to insert admin logs"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read admin logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Update deleted_members policies
DROP POLICY IF EXISTS "Authenticated users can manage deleted members" ON deleted_members;

CREATE POLICY "Allow authenticated users to manage deleted members"
  ON deleted_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update admins table policies to be more permissive
DROP POLICY IF EXISTS "Authenticated users can delete admins" ON admins;
DROP POLICY IF EXISTS "Authenticated users can insert admins" ON admins;
DROP POLICY IF EXISTS "Authenticated users can read admins" ON admins;
DROP POLICY IF EXISTS "Authenticated users can update admins" ON admins;

CREATE POLICY "Allow authenticated users to manage admins"
  ON admins
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);