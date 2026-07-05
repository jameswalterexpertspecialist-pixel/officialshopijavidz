/*
# SHOPIJAVID Full Schema

Public-facing agency website. No sign-in. All tables public read, public insert for contacts.

New Tables:
- sj_contacts: contact form submissions with consultation code
- sj_newsletter: newsletter subscribers

All tables use anon + authenticated RLS (public site, no login).
*/

CREATE TABLE IF NOT EXISTS sj_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  services text[],
  budget text,
  message text NOT NULL,
  consultation_code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sj_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contacts" ON sj_contacts;
CREATE POLICY "public_insert_contacts" ON sj_contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_select_contacts" ON sj_contacts;
CREATE POLICY "public_select_contacts" ON sj_contacts FOR SELECT
  TO anon, authenticated USING (false);

CREATE TABLE IF NOT EXISTS sj_newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sj_newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_newsletter" ON sj_newsletter;
CREATE POLICY "public_insert_newsletter" ON sj_newsletter FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_select_newsletter" ON sj_newsletter;
CREATE POLICY "public_select_newsletter" ON sj_newsletter FOR SELECT
  TO anon, authenticated USING (false);
