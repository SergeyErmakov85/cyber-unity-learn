-- 1. Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role is called from RLS policies under SECURITY DEFINER; authenticated does not need direct EXECUTE
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;

-- 2. Storage: avatars bucket
-- Drop overly broad SELECT policy (bucket is public, direct URLs still work without RLS SELECT)
DROP POLICY IF EXISTS "Public avatar read" ON storage.objects;

-- Add DELETE policy scoped to the file owner
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Tighten newsletter INSERT policy
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_subscriptions;

CREATE POLICY "Anyone can subscribe"
ON public.email_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) <= 254
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);