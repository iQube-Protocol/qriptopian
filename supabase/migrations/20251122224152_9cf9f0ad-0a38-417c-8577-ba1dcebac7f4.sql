-- Fix infinite recursion in content table RLS policies
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can manage all content" ON public.content;

-- Recreate the policy using the security definer function
CREATE POLICY "Admins can manage all content" 
ON public.content 
FOR ALL 
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

-- Also update the content_revisions policy
DROP POLICY IF EXISTS "Admins can manage revisions" ON public.content_revisions;

CREATE POLICY "Admins can manage revisions" 
ON public.content_revisions 
FOR ALL 
USING (public.has_admin_role());