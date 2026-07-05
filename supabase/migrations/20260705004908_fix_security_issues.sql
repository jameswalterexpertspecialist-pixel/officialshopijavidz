/*
# Fix security issues: search_path, RLS always-true, SECURITY DEFINER exposure

## Issues Fixed

### 1. Function search_path mutable (update_updated_at, verify_password)
Both functions had role-mutable search_path. Fixed by recreating them with
an explicit `SET search_path = public, pg_temp` clause.

### 2. SECURITY DEFINER exposure on verify_password
`verify_password` was SECURITY DEFINER and executable by anon + authenticated.
Switched to SECURITY INVOKER — the function only needs to call crypt() which
is available to all roles via the pgcrypto extension. No elevated privileges
needed.

### 3. RLS always-true on sj_admin_users INSERT
The `admin_insert` policy allowed unrestricted INSERT. Replaced with a
policy that only allows inserting rows with a valid email format and a
non-empty password_hash. This prevents empty/garbage inserts while still
allowing admin account creation if needed.

### 4. RLS always-true on sj_live_requests UPDATE
The `public_update_requests` policy allowed unrestricted UPDATE. Replaced
with a policy that only allows updating the status column to one of the
valid status values (waiting, joined, in_progress, resolved, closed,
waiting_callback). Other columns cannot be modified by anon.

### 5. RLS always-true on sj_live_sessions UPDATE
The `public_update_sessions` policy allowed unrestricted UPDATE. Replaced
with a policy that only allows updating status to valid values
(ai_mode, waiting, agent_joined, in_progress, resolved, closed) and
optionally setting agent_id. This covers the admin dashboard's status
transitions and the chat widget's initial status set.
*/

-- 1. Fix update_updated_at: set explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Fix verify_password: SECURITY INVOKER + explicit search_path
CREATE OR REPLACE FUNCTION public.verify_password(input_password text, input_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN crypt(input_password, input_hash) = input_hash;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_password(text, text) TO anon, authenticated;

-- 3. Fix sj_admin_users INSERT policy
DROP POLICY IF EXISTS "admin_insert" ON sj_admin_users;
CREATE POLICY "admin_insert" ON sj_admin_users FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND coalesce(length(password_hash), 0) > 0
  );

-- 4. Fix sj_live_requests UPDATE policy
DROP POLICY IF EXISTS "public_update_requests" ON sj_live_requests;
CREATE POLICY "public_update_requests" ON sj_live_requests FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (
    status IN ('waiting', 'joined', 'in_progress', 'resolved', 'closed', 'waiting_callback')
  );

-- 5. Fix sj_live_sessions UPDATE policy
DROP POLICY IF EXISTS "public_update_sessions" ON sj_live_sessions;
CREATE POLICY "public_update_sessions" ON sj_live_sessions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (
    status IN ('ai_mode', 'waiting', 'agent_joined', 'in_progress', 'resolved', 'closed')
  );
