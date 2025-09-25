/*
  # Create deleted_members table for tracking deleted members

  1. New Tables
    - `deleted_members`
      - `id` (uuid, primary key)
      - `original_member_id` (uuid)
      - `member_data` (jsonb, stores all original member data)
      - `deleted_by` (uuid, foreign key to auth.users)
      - `deleted_at` (timestamp)
      - `reason` (text, optional deletion reason)

  2. Security
    - Enable RLS on `deleted_members` table
    - Add policies for authenticated users to read deleted members
*/

CREATE TABLE IF NOT EXISTS deleted_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_member_id uuid NOT NULL,
  member_data jsonb NOT NULL,
  deleted_by uuid REFERENCES auth.users(id),
  deleted_at timestamptz DEFAULT now(),
  reason text
);

ALTER TABLE deleted_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read deleted members"
  ON deleted_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert deleted members"
  ON deleted_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);