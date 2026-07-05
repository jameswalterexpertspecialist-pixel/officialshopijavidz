/*
# Admin password verification function

Creates a PostgreSQL function that verifies a plaintext password against
a bcrypt hash stored in sj_admin_users. This is called from the admin
dashboard login via supabase.rpc().

## Security
- The function uses pgcrypto's crypt() for bcrypt verification.
- It takes the plaintext password and the stored hash as arguments.
- It returns true/false. It does NOT expose the hash.
- SECURITY DEFINER is used so the function runs with elevated privileges,
  allowing it to access pgcrypto even if the calling role cannot.
*/

CREATE OR REPLACE FUNCTION verify_password(input_password text, input_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(input_password, input_hash) = input_hash;
END;
$$;

GRANT EXECUTE ON FUNCTION verify_password(text, text) TO anon, authenticated;
