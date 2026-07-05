/*
# Fix verify_password: add extensions schema to search_path

The pgcrypto extension installs crypt() in the "extensions" schema, not
"public". With SECURITY INVOKER, the function runs with the caller's
search_path which doesn't include "extensions". This caused:
  ERROR: function crypt(text, text) does not exist

Fix: set the function's search_path to include "extensions" so crypt()
is resolvable regardless of the caller's search_path.
*/

CREATE OR REPLACE FUNCTION public.verify_password(input_password text, input_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  RETURN crypt(input_password, input_hash) = input_hash;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_password(text, text) TO anon, authenticated;
