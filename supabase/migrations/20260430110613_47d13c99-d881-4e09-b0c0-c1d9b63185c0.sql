-- Explicit INSERT policy: only admins can insert via client/API
CREATE POLICY "user_roles admin insert only"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Restrictive policy: blocks ALL client-side inserts regardless of other policies.
-- The handle_new_user() trigger runs as SECURITY DEFINER and bypasses RLS,
-- so initial role assignment on signup continues to work.
CREATE POLICY "user_roles block client insert"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);
