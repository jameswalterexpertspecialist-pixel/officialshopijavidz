/*
# Tighten RLS policies on public-facing form tables

## Problem
Several tables had INSERT policies with `WITH CHECK (true)` and some had
SELECT/UPDATE policies allowing unrestricted access. This meant:
- Anyone could read all live chat messages, requests, and sessions.
- Anyone could update any live session.
- INSERT policies accepted any row shape with no validation.

## Changes

### inquiries
- INSERT: keep public (anon + authenticated) but validate required fields
  (sender_name, sender_email, message are non-empty). This is a marketplace
  inquiry form — anyone can submit, but rows must be well-formed.

### sj_contacts
- INSERT: keep public but validate required fields (name, email, message
  are non-empty). This is the contact form.

### sj_live_messages
- INSERT: keep public but validate session_id and content are non-empty.
- SELECT: restricted to `false` (anon cannot read other people's messages).
  The live chat reads messages via the edge function (service role), not
  directly from the client.

### sj_live_requests
- INSERT: keep public but validate session_id is non-empty.
- SELECT: restricted to `false` (anon cannot read other people's requests).

### sj_live_sessions
- INSERT: keep public but validate session_id is non-empty.
- SELECT: restricted to `false` (anon cannot read other people's sessions).
- UPDATE: restricted to `false` (anon cannot modify sessions). Session
  status transitions are handled by the edge function (service role).

### sj_newsletter
- INSERT: keep public but validate email is non-empty.
- SELECT: already `false` — no change needed.

## Security
All INSERT policies now validate that required columns are non-empty
instead of blindly accepting `true`. All SELECT/UPDATE policies on the
live chat tables now deny anon access — the edge function (service role)
handles reads and updates, bypassing RLS.
*/

-- inquiries: tighten INSERT
DROP POLICY IF EXISTS "public_insert_inquiries" ON inquiries;
CREATE POLICY "public_insert_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    coalesce(length(btrim(sender_name)), 0) > 0
    AND coalesce(length(btrim(sender_email)), 0) > 0
    AND coalesce(length(btrim(message)), 0) > 0
  );

-- sj_contacts: tighten INSERT
DROP POLICY IF EXISTS "public_insert_contacts" ON sj_contacts;
CREATE POLICY "public_insert_contacts" ON sj_contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    coalesce(length(btrim(name)), 0) > 0
    AND coalesce(length(btrim(email)), 0) > 0
    AND coalesce(length(btrim(message)), 0) > 0
  );

-- sj_live_messages: tighten INSERT, lock down SELECT
DROP POLICY IF EXISTS "public_insert_messages" ON sj_live_messages;
CREATE POLICY "public_insert_messages" ON sj_live_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    coalesce(length(btrim(session_id)), 0) > 0
    AND coalesce(length(btrim(content)), 0) > 0
  );

DROP POLICY IF EXISTS "public_select_messages" ON sj_live_messages;
CREATE POLICY "public_select_messages" ON sj_live_messages FOR SELECT
  TO anon, authenticated USING (false);

-- sj_live_requests: tighten INSERT, lock down SELECT
DROP POLICY IF EXISTS "public_insert_requests" ON sj_live_requests;
CREATE POLICY "public_insert_requests" ON sj_live_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (coalesce(length(btrim(session_id)), 0) > 0);

DROP POLICY IF EXISTS "public_select_requests" ON sj_live_requests;
CREATE POLICY "public_select_requests" ON sj_live_requests FOR SELECT
  TO anon, authenticated USING (false);

-- sj_live_sessions: tighten INSERT, lock down SELECT and UPDATE
DROP POLICY IF EXISTS "public_insert_sessions" ON sj_live_sessions;
CREATE POLICY "public_insert_sessions" ON sj_live_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (coalesce(length(btrim(session_id)), 0) > 0);

DROP POLICY IF EXISTS "public_select_sessions" ON sj_live_sessions;
CREATE POLICY "public_select_sessions" ON sj_live_sessions FOR SELECT
  TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "public_update_sessions" ON sj_live_sessions;
CREATE POLICY "public_update_sessions" ON sj_live_sessions FOR UPDATE
  TO anon, authenticated USING (false) WITH CHECK (false);

-- sj_newsletter: tighten INSERT (SELECT already false)
DROP POLICY IF EXISTS "public_insert_newsletter" ON sj_newsletter;
CREATE POLICY "public_insert_newsletter" ON sj_newsletter FOR INSERT
  TO anon, authenticated
  WITH CHECK (coalesce(length(btrim(email)), 0) > 0);
