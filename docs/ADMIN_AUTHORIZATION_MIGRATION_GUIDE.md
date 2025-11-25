# Admin Authorization System - Migration Guide

## Overview

This guide explains how to replicate the admin authorization system used in this application. The system uses Supabase for role-based access control (RBAC) with a hierarchical role structure.

## Architecture Principles

1. **Database-First Authorization**: All role checks are performed against Supabase tables
2. **Security Definer Functions**: Role checks use SECURITY DEFINER to bypass RLS recursion
3. **Hierarchical Roles**: Roles have numeric ranks (uber_admin: 100, super_admin: 50, etc.)
4. **Site-Scoped Roles**: Roles can be scoped to specific agent sites
5. **Uber Admin Override**: System-wide admins bypass site-scoping

---

## Step 1: Database Schema Setup

### Create the Role Enum

```sql
-- Create enum for admin roles
CREATE TYPE public.admin_role AS ENUM (
  'uber_admin',     -- System-wide access (rank: 100)
  'super_admin',    -- Site owner (rank: 50)
  'content_admin',  -- Content management (rank: 40)
  'social_admin',   -- Social features (rank: 30)
  'moderator'       -- Basic moderation (rank: 20)
);
```

### Create user_roles Table

```sql
-- Table for role assignments
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.admin_role NOT NULL,
  agent_site_id uuid, -- NULL for system-wide roles
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid, -- Who assigned this role
  UNIQUE(user_id, role, agent_site_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Index for faster lookups
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_site_id ON public.user_roles(agent_site_id);
```

### Create mm_super_admins Table

```sql
-- Table for uber admins (system-wide access)
CREATE TABLE public.mm_super_admins (
  user_id uuid,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT mm_super_admins_check CHECK (
    (user_id IS NOT NULL) OR (email IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.mm_super_admins ENABLE ROW LEVEL SECURITY;

-- Index for lookups
CREATE INDEX idx_mm_super_admins_user_id ON public.mm_super_admins(user_id);
CREATE INDEX idx_mm_super_admins_email ON public.mm_super_admins(email);
```

---

## Step 2: Database Functions

### is_mm_super_admin Function

```sql
CREATE OR REPLACE FUNCTION public.is_mm_super_admin(uid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  -- Direct user_id match
  IF EXISTS (
    SELECT 1 FROM public.mm_super_admins 
    WHERE user_id = uid
  ) THEN
    RETURN true;
  END IF;

  -- Email-based match
  SELECT email INTO user_email 
  FROM auth.users 
  WHERE id = uid;

  IF user_email IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.mm_super_admins 
    WHERE email = user_email
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;
```

### is_uber_admin Function

```sql
CREATE OR REPLACE FUNCTION public.is_uber_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_mm_super_admin(uid);
$$;
```

### has_min_role Function

```sql
CREATE OR REPLACE FUNCTION public.has_min_role(
  site_id uuid,
  min_role public.admin_role,
  uid uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  role_ranks jsonb := '{
    "uber_admin": 100,
    "super_admin": 50,
    "content_admin": 40,
    "social_admin": 30,
    "moderator": 20
  }'::jsonb;
  user_rank integer;
  required_rank integer;
BEGIN
  -- Uber admins bypass everything
  IF public.is_mm_super_admin(uid) THEN
    RETURN true;
  END IF;

  -- Get user's highest rank for this site
  SELECT MAX((role_ranks->>role::text)::integer)
  INTO user_rank
  FROM public.user_roles
  WHERE user_id = uid
    AND (agent_site_id = site_id OR agent_site_id IS NULL);

  -- Get required rank
  required_rank := (role_ranks->>min_role::text)::integer;

  RETURN COALESCE(user_rank, 0) >= required_rank;
END;
$$;
```

### user_role_rank Function

```sql
CREATE OR REPLACE FUNCTION public.user_role_rank(
  site_id uuid,
  uid uuid DEFAULT auth.uid()
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  role_ranks jsonb := '{
    "uber_admin": 100,
    "super_admin": 50,
    "content_admin": 40,
    "social_admin": 30,
    "moderator": 20
  }'::jsonb;
BEGIN
  -- Uber admins get max rank
  IF public.is_mm_super_admin(uid) THEN
    RETURN 100;
  END IF;

  -- Get user's highest rank for this site
  RETURN COALESCE(
    (SELECT MAX((role_ranks->>role::text)::integer)
     FROM public.user_roles
     WHERE user_id = uid
       AND (agent_site_id = site_id OR agent_site_id IS NULL)),
    0
  );
END;
$$;
```

---

## Step 3: RLS Policies

### user_roles Table Policies

```sql
-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Uber admins can view all roles
CREATE POLICY "Uber admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_mm_super_admin(auth.uid()));

-- Admins can insert roles for their sites
CREATE POLICY "Admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_min_role(agent_site_id, 'super_admin'::admin_role, auth.uid())
);

-- Admins can update roles for their sites
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  public.has_min_role(agent_site_id, 'super_admin'::admin_role, auth.uid())
);

-- Admins can delete roles for their sites
CREATE POLICY "Admins can remove roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.has_min_role(agent_site_id, 'super_admin'::admin_role, auth.uid())
);
```

### mm_super_admins Table Policies

```sql
-- Only uber admins can view
CREATE POLICY "Only uber admins can view"
ON public.mm_super_admins
FOR SELECT
TO authenticated
USING (public.is_mm_super_admin(auth.uid()));

-- Only uber admins can insert
CREATE POLICY "Only uber admins can insert"
ON public.mm_super_admins
FOR INSERT
TO authenticated
WITH CHECK (public.is_mm_super_admin(auth.uid()));

-- Only uber admins can delete
CREATE POLICY "Only uber admins can delete"
ON public.mm_super_admins
FOR DELETE
TO authenticated
USING (public.is_mm_super_admin(auth.uid()));
```

---

## Step 4: Frontend Hooks

### useAuth Hook

Create `src/hooks/useAuth.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isUberAdmin, setIsUberAdmin] = useState(false);
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
        checkUberAdmin(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRoles(session.user.id);
          checkUberAdmin(session.user.id);
        } else {
          setUserRoles([]);
          setIsUberAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (!error && data) {
      setUserRoles(data.map(r => r.role));
    }
  };

  const checkUberAdmin = async (userId: string) => {
    const { data, error } = await supabase
      .rpc('is_mm_super_admin', { uid: userId });

    if (!error) {
      setIsUberAdmin(data === true);
    }
  };

  // Computed values
  const isAdmin = userRoles.length > 0 || isUberAdmin;
  const hasAgentSite = false; // Implement based on your agent_sites table

  return {
    user,
    session,
    loading,
    userRoles,
    isAdmin,
    isUberAdmin,
    hasAgentSite,
    currentSiteId,
    setCurrentSiteId,
  };
}
```

### useRoleHierarchy Hook

Create `src/hooks/useRoleHierarchy.tsx`:

```typescript
import { useAuth } from './useAuth';

const ROLE_RANKS = {
  uber_admin: 100,
  super_admin: 50,
  content_admin: 40,
  social_admin: 30,
  moderator: 20,
} as const;

export type AdminRole = keyof typeof ROLE_RANKS;

export function useRoleHierarchy() {
  const { userRoles, isUberAdmin } = useAuth();

  const getRoleRank = (role: string): number => {
    return ROLE_RANKS[role as AdminRole] || 0;
  };

  const getCurrentUserRank = (): number => {
    if (isUberAdmin) return 100;
    return Math.max(...userRoles.map(getRoleRank), 0);
  };

  const canAssignRole = (targetRole: string): boolean => {
    const targetRank = getRoleRank(targetRole);
    const userRank = getCurrentUserRank();
    return userRank > targetRank;
  };

  const canRemoveRole = (targetRole: string): boolean => {
    return canAssignRole(targetRole);
  };

  const getAssignableRoles = (): AdminRole[] => {
    const userRank = getCurrentUserRank();
    return Object.keys(ROLE_RANKS).filter(
      role => ROLE_RANKS[role as AdminRole] < userRank
    ) as AdminRole[];
  };

  return {
    getRoleRank,
    getCurrentUserRank,
    canAssignRole,
    canRemoveRole,
    getAssignableRoles,
  };
}
```

---

## Step 5: Admin UI Components

### Admin Button (Add to your main app page)

```tsx
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function AdminButton() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <button
      onClick={() => navigate('/admin')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 
                 px-4 py-2 rounded-lg bg-primary/10 backdrop-blur-sm
                 border border-primary/20 hover:bg-primary/20 
                 transition-all duration-200 shadow-lg hover:shadow-xl"
      title="Admin Panel"
    >
      <Shield className="w-5 h-5 text-primary" />
    </button>
  );
}
```

### Admin Layout with Access Control

```tsx
import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Crown } from 'lucide-react';

export function AdminLayout() {
  const { user, loading, isAdmin, isUberAdmin, userRoles } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin && userRoles.length === 0) {
        navigate('/app');
      }
    }
  }, [loading, user, isAdmin, userRoles, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin && userRoles.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          {isUberAdmin && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full 
                           bg-amber-500/10 border border-amber-500/20">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">
                UBER ADMIN
              </span>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
```

---

## Step 6: Seeding Initial Uber Admins

```sql
-- Insert initial uber admins
INSERT INTO public.mm_super_admins (email, created_at)
VALUES 
  ('admin@yourdomain.com', now()),
  ('superadmin@yourdomain.com', now())
ON CONFLICT DO NOTHING;
```

---

## Testing Checklist

- [ ] Uber admin can view all roles across all sites
- [ ] Uber admin can assign/remove any role
- [ ] Super admin can only manage roles for their site
- [ ] Content admin cannot assign super_admin role
- [ ] Non-admins cannot access admin routes
- [ ] Role hierarchy is enforced (can't assign higher rank)
- [ ] RLS policies prevent unauthorized access
- [ ] Admin button only shows for authorized users
- [ ] Uber admin badge displays correctly

---

## Security Considerations

1. **Never check admin status client-side only** - Always validate with RLS
2. **Use SECURITY DEFINER carefully** - Only for role checking functions
3. **Audit role assignments** - Store `created_by` for accountability
4. **Limit uber admin accounts** - Reserve for system administrators
5. **Regular security reviews** - Audit `mm_super_admins` table periodically

---

## Migration from Existing System

If you have an existing admin system:

1. Export existing admin users/emails
2. Run the schema setup scripts
3. Populate `mm_super_admins` with existing admins
4. Migrate role assignments to `user_roles` table
5. Update frontend components to use new hooks
6. Test thoroughly before removing old system
7. Update RLS policies on protected tables

---

## Common Issues

**Issue**: Recursive RLS errors
**Solution**: Ensure functions use `SECURITY DEFINER` and `SET search_path = public`

**Issue**: Admin can't see their own roles
**Solution**: Check RLS policy includes `user_id = auth.uid()` clause

**Issue**: Uber admin changes not reflecting
**Solution**: Clear auth session and re-login to refresh RPC results

---

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL SECURITY DEFINER](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Role-Based Access Control Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
