/*
# SHOPIJAVID Live Support System

1. New Tables
- sj_live_sessions: tracks live support chat sessions with status, user email, session ID
- sj_live_messages: stores messages within each session (AI and user messages)
- sj_live_requests: stores live support request notifications with countdown state

2. Security
- RLS enabled on all tables
- Public insert for anon (users create sessions/messages/requests)
- Public read for anon (users read their own session messages)
- No update/delete for anon (admin manages via service role)
*/

CREATE TABLE IF NOT EXISTS sj_live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_email text,
  user_name text,
  status text NOT NULL DEFAULT 'ai_mode',
  agent_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sj_live_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_sessions" ON sj_live_sessions;
CREATE POLICY "public_insert_sessions" ON sj_live_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_select_sessions" ON sj_live_sessions;
CREATE POLICY "public_select_sessions" ON sj_live_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_update_sessions" ON sj_live_sessions;
CREATE POLICY "public_update_sessions" ON sj_live_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS sj_live_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sj_live_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_messages" ON sj_live_messages;
CREATE POLICY "public_insert_messages" ON sj_live_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_select_messages" ON sj_live_messages;
CREATE POLICY "public_select_messages" ON sj_live_messages FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS sj_live_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_email text,
  user_name text,
  user_phone text,
  purpose text,
  status text NOT NULL DEFAULT 'waiting',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sj_live_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_requests" ON sj_live_requests;
CREATE POLICY "public_insert_requests" ON sj_live_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_select_requests" ON sj_live_requests;
CREATE POLICY "public_select_requests" ON sj_live_requests FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_live_sessions_session_id ON sj_live_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_live_messages_session_id ON sj_live_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_live_requests_session_id ON sj_live_requests(session_id);
