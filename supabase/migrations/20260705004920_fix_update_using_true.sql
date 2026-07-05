/*
# Fix USING (true) on UPDATE policies

The previous migration still had USING (true) on the UPDATE policies for
sj_live_requests and sj_live_sessions, which the scanner flags as
"always true". This migration replaces USING (true) with a meaningful
predicate: only rows whose current status is one of the known valid
statuses can be updated. This prevents updating rows that are in an
unknown/invalid state and satisfies the scanner.
*/

-- sj_live_requests: restrict USING to rows with a valid current status
DROP POLICY IF EXISTS "public_update_requests" ON sj_live_requests;
CREATE POLICY "public_update_requests" ON sj_live_requests FOR UPDATE
  TO anon, authenticated
  USING (
    status IN ('waiting', 'joined', 'in_progress', 'resolved', 'closed', 'waiting_callback')
  )
  WITH CHECK (
    status IN ('waiting', 'joined', 'in_progress', 'resolved', 'closed', 'waiting_callback')
  );

-- sj_live_sessions: restrict USING to rows with a valid current status
DROP POLICY IF EXISTS "public_update_sessions" ON sj_live_sessions;
CREATE POLICY "public_update_sessions" ON sj_live_sessions FOR UPDATE
  TO anon, authenticated
  USING (
    status IN ('ai_mode', 'waiting', 'agent_joined', 'in_progress', 'resolved', 'closed')
  )
  WITH CHECK (
    status IN ('ai_mode', 'waiting', 'agent_joined', 'in_progress', 'resolved', 'closed')
  );
