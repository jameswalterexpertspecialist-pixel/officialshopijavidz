/*
# Portfolio & Services Marketplace Schema

1. Overview
This is a multi-user portfolio + services marketplace. Users sign up, create a
profile, list services they offer, showcase portfolio projects, and receive
inquiries from visitors. Auth is required (sign-in screen built in frontend).

2. New Tables
- `profiles` — extends auth.users with public display info (full name, bio, avatar, title, location, social links).
- `services` — services offered by a user (title, description, category, price, delivery time, featured flag).
- `projects` — portfolio projects (title, description, category, image url, live url, featured flag).
- `inquiries` — messages from visitors to a service owner (name, email, message, service_id).

3. Security
- RLS enabled on all tables.
- profiles: owner can read/update own; anyone can read (public profiles).
- services: owner full CRUD; anyone can read (public marketplace).
- projects: owner full CRUD; anyone can read (public portfolio).
- inquiries: owner can read/delete inquiries on their services; anyone authenticated or anon can insert (contact form).
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  website_url text NOT NULL DEFAULT '',
  twitter_url text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  github_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_update_profile" ON profiles;
CREATE POLICY "owner_update_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "owner_insert_profile" ON profiles;
CREATE POLICY "owner_insert_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  price numeric(10,2) NOT NULL DEFAULT 0,
  delivery_days integer NOT NULL DEFAULT 7,
  image_url text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_service" ON services;
CREATE POLICY "owner_insert_service" ON services FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_service" ON services;
CREATE POLICY "owner_update_service" ON services FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_service" ON services;
CREATE POLICY "owner_delete_service" ON services FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  image_url text NOT NULL DEFAULT '',
  live_url text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_project" ON projects;
CREATE POLICY "owner_insert_project" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_project" ON projects;
CREATE POLICY "owner_update_project" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_project" ON projects;
CREATE POLICY "owner_delete_project" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_inquiries" ON inquiries;
CREATE POLICY "public_insert_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "recipient_read_inquiries" ON inquiries;
CREATE POLICY "recipient_read_inquiries" ON inquiries FOR SELECT
  TO authenticated USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "recipient_delete_inquiries" ON inquiries;
CREATE POLICY "recipient_delete_inquiries" ON inquiries FOR DELETE
  TO authenticated USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "recipient_update_inquiry_status" ON inquiries;
CREATE POLICY "recipient_update_inquiry_status" ON inquiries FOR UPDATE
  TO authenticated USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

-- indexes
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_recipient_id ON inquiries(recipient_id);
