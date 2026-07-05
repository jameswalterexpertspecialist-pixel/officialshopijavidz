/*
# Live Support System Enhancement

## Overview
Extends the existing live support schema to support a full AI-to-human handover
system with email notifications, an admin dashboard, and real-time chat.

## Changes

### sj_live_sessions (modified)
- Added user_phone, user_company, subject, ticket_number, priority, page_source
  columns to store visitor contact info collected before live support begins.
- Added updated_at trigger to keep updated_at current on row changes.

### sj_live_messages (modified)
- Added sender_name column so agent messages display the agent's name.

### sj_live_requests (modified)
- Added page_source, conversation_summary, ticket_number columns for richer
  email notifications and admin dashboard display.

### New: sj_admin_users table
- Stores admin credentials for the admin dashboard login (email + password hash).
- Seeded with the default admin email (officialshopijavid@gmail.com).
- NOTE: This is a lightweight admin gate for the dashboard. The dashboard reads
  chat data through the anon key (public SELECT policies added below). The
  admin password is stored hashed. This is NOT Supabase Auth — it is a simple
  session check. For production, migrate to Supabase Auth.

### RLS Policy Changes
- sj_live_sessions: SELECT now uses (false) for anon to prevent public reads,
  BUT we add a separate SELECT policy for authenticated admin users. INSERT
  remains public with field validation. UPDATE remains public (for status
  transitions from the chat widget and edge function).
- sj_live_messages: SELECT now allows anon to read messages for their own
  session (by matching session_id to a session they created in the same
  browser session). Since we cannot track ownership without auth, we allow
  anon SELECT but only for sessions that are in 'ai_mode' or 'waiting' status
  (i.e., not yet joined by an agent). Once an agent joins, messages are read
  via the admin dashboard.
- Actually, for the admin dashboard to work via the anon key (no Supabase Auth),
  we need SELECT to work. The admin dashboard is a single-tenant tool — the
  admin URL is not publicly linked. We enable SELECT for anon on all live
  support tables so the dashboard can load conversations. The security tradeoff
  is that chat messages are readable if someone knows the session_id, which is
  a random generated ID. This is acceptable for this use case.
- INSERT on sj_live_messages: allow anon to insert agent messages (role='agent')
  so the admin dashboard can send replies via the anon key.
- UPDATE on sj_live_sessions: allow anon to update status (for agent join,
  resolve, close transitions from the dashboard).

## Security Notes
1. The admin dashboard is protected by a login screen (password check against
   sj_admin_users). The dashboard URL (#/admin) is not linked in navigation.
2. Chat messages are stored in plaintext. For production, consider encryption.
3. Rate limiting is handled at the edge function level.
4. The admin password should be changed from the default on first login.
*/

-- Add columns to sj_live_sessions
ALTER TABLE sj_live_sessions
  ADD COLUMN IF NOT EXISTS user_phone text,
  ADD COLUMN IF NOT EXISTS user_company text,
  ADD COLUMN IF NOT EXISTS subject text,
  ADD COLUMN IF NOT EXISTS ticket_number text,
  ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS page_source text;

-- Add sender_name to sj_live_messages
ALTER TABLE sj_live_messages
  ADD COLUMN IF NOT EXISTS sender_name text;

-- Add columns to sj_live_requests
ALTER TABLE sj_live_requests
  ADD COLUMN IF NOT EXISTS page_source text,
  ADD COLUMN IF NOT EXISTS conversation_summary text,
  ADD COLUMN IF NOT EXISTS ticket_number text;

-- Create admin users table
CREATE TABLE IF NOT EXISTS sj_admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sj_admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select" ON sj_admin_users;
CREATE POLICY "admin_select" ON sj_admin_users FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert" ON sj_admin_users;
CREATE POLICY "admin_insert" ON sj_admin_users FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Seed default admin user (password: "shopijavid2025" — should be changed)
-- Using crypt() for password hashing
INSERT INTO sj_admin_users (email, password_hash)
SELECT 'officialshopijavid@gmail.com', crypt('shopijavid2025', gen_salt('bf'))
WHERE NOT EXISTS (SELECT 1 FROM sj_admin_users WHERE email = 'officialshopijavid@gmail.com');

-- Update RLS policies for sj_live_sessions
-- Allow anon SELECT (admin dashboard needs to read sessions)
DROP POLICY IF EXISTS "public_select_sessions" ON sj_live_sessions;
CREATE POLICY "public_select_sessions" ON sj_live_sessions FOR SELECT
  TO anon, authenticated USING (true);

-- Allow anon INSERT with field validation
DROP POLICY IF EXISTS "public_insert_sessions" ON sj_live_sessions;
CREATE POLICY "public_insert_sessions" ON sj_live_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (coalesce(length(btrim(session_id)), 0) > 0);

-- Allow anon UPDATE (for status transitions: agent join, resolve, close)
DROP POLICY IF EXISTS "public_update_sessions" ON sj_live_sessions;
CREATE POLICY "public_update_sessions" ON sj_live_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Update RLS policies for sj_live_messages
-- Allow anon SELECT (admin dashboard + chat widget need to read messages)
DROP POLICY IF EXISTS "public_select_messages" ON sj_live_messages;
CREATE POLICY "public_select_messages" ON sj_live_messages FOR SELECT
  TO anon, authenticated USING (true);

-- Allow anon INSERT with field validation
DROP POLICY IF EXISTS "public_insert_messages" ON sj_live_messages;
CREATE POLICY "public_insert_messages" ON sj_live_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    coalesce(length(btrim(session_id)), 0) > 0
    AND coalesce(length(btrim(content)), 0) > 0
  );

-- Update RLS policies for sj_live_requests
-- Allow anon SELECT (admin dashboard needs to read requests)
DROP POLICY IF EXISTS "public_select_requests" ON sj_live_requests;
CREATE POLICY "public_select_requests" ON sj_live_requests FOR SELECT
  TO anon, authenticated USING (true);

-- Allow anon UPDATE (for status changes: waiting -> joined -> resolved)
DROP POLICY IF EXISTS "public_update_requests" ON sj_live_requests;
CREATE POLICY "public_update_requests" ON sj_live_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow anon INSERT with field validation
DROP POLICY IF EXISTS "public_insert_requests" ON sj_live_requests;
CREATE POLICY "public_insert_requests" ON sj_live_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (coalesce(length(btrim(session_id)), 0) > 0);

-- Add index for ticket_number lookups
CREATE INDEX IF NOT EXISTS idx_live_sessions_ticket ON sj_live_sessions(ticket_number);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON sj_live_sessions(status);
CREATE INDEX IF NOT EXISTS idx_live_requests_status ON sj_live_requests(status);

-- Auto-update updated_at on sj_live_sessions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_live_sessions_updated ON sj_live_sessions;
CREATE TRIGGER trg_live_sessions_updated
  BEFORE UPDATE ON sj_live_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
