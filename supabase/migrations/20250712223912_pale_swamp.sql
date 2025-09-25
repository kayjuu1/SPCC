/*
  # Create Admin Action Logs Table

  1. New Tables
    - `admin_logs`
      - `id` (uuid, primary key)
      - `admin_id` (uuid, reference to auth.users)
      - `admin_email` (text, admin email for reference)
      - `action` (text, action performed)
      - `table_name` (text, affected table)
      - `record_id` (uuid, affected record id)
      - `old_values` (jsonb, previous values)
      - `new_values` (jsonb, new values)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admin_logs` table
    - Add policies for authenticated users to read their own logs
    - Add policies for authenticated users to insert logs
*/

-- Create admin_logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id),
  admin_email text,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all logs
CREATE POLICY "Admins can read all logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to insert logs
CREATE POLICY "Admins can insert logs"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id);