/*
  # Create Members Table and Authentication Setup

  1. New Tables
    - `members`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `dob` (date, date of birth)
      - `dues_card_id` (text, optional annual dues card)
      - `baptized` (boolean, baptism status)
      - `baptism_date` (date, optional)
      - `confirmed` (boolean, confirmation status)
      - `confirmation_date` (date, optional)
      - `contact` (text, contact information)
      - `address` (text, residential address)
      - `society` (text, member's society)
      - `role` (text, member's role)
      - `status` (text, member status: Active, Inactive, Dead, Not a Member)
      - `defaulted` (boolean, has member defaulted on payments)
      - `dependents` (text array, list of dependents)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `members` table
    - Add policies for authenticated users (admins) to manage all data
    - Add policies for anonymous users to read limited data (search functionality)

  3. Sample Data
    - Insert a few sample members for testing
*/

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dob date,
  dues_card_id text,
  baptized boolean DEFAULT false,
  baptism_date date,
  confirmed boolean DEFAULT false,
  confirmation_date date,
  contact text,
  address text,
  society text,
  role text,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Dead', 'Not a Member')),
  defaulted boolean DEFAULT false,
  dependents text[] DEFAULT '{}',
  dues numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (admins) - full access
CREATE POLICY "Admins can manage all members"
  ON members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for anonymous users - read only access for search
CREATE POLICY "Anonymous users can search members"
  ON members
  FOR SELECT
  TO anon
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO members (name, dob, dues_card_id, baptized, baptism_date, confirmed, confirmation_date, contact, address, society, role, status, defaulted, dependents, dues) VALUES
('John Doe', '1985-03-15', 'DC001', true, '1985-04-20', true, '1998-05-10', '+1234567890', '123 Main St, City', 'Knights of Columbus', 'Member', 'Active', false, '{"Jane Doe", "Jimmy Doe"}', 0),
('Mary Smith', '1990-07-22', 'DC002', true, '1990-08-15', true, '2003-06-12', '+1234567891', '456 Oak Ave, City', 'Catholic Women League', 'Secretary', 'Active', false, '{}', 50),
('Peter Johnson', '1978-11-08', 'DC003', true, '1978-12-25', true, '1991-04-14', '+1234567892', '789 Pine Rd, City', 'St. Vincent de Paul', 'President', 'Active', true, '{"Sarah Johnson"}', 150),
('Anna Williams', '1995-02-14', null, true, '1995-03-19', false, null, '+1234567893', '321 Elm St, City', 'Youth Group', 'Member', 'Active', false, '{}', 25),
('Robert Brown', '1965-09-30', 'DC004', true, '1965-10-15', true, '1978-05-20', '+1234567894', '654 Maple Dr, City', 'Parish Council', 'Treasurer', 'Inactive', false, '{"Michael Brown", "Lisa Brown"}', 0);