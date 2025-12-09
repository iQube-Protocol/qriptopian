# User Registration & Identity System

## Overview

This document describes the complete user registration, authentication, identity management, and admin authorization system. The architecture supports dual authentication paths (standard Supabase auth and DID-based AA-API auth) with a layered identity model.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Frontend (Vite/React)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   Auth.tsx      │  │  SetupDID.tsx   │  │   useIsAdminAA.tsx         │ │
│  │  Email/Password │  │  DID Linking    │  │   Admin Status Hook        │ │
│  └────────┬────────┘  └────────┬────────┘  └─────────────┬───────────────┘ │
└───────────┼────────────────────┼─────────────────────────┼─────────────────┘
            │                    │                         │
            ▼                    ▼                         ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         Supabase Edge Functions                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐│
│  │  check-admin    │  │ check-admin-aa  │  │   aa-auth-challenge        ││
│  │  (Legacy)       │  │ (DID + Legacy)  │  │   aa-auth-verify           ││
│  └────────┬────────┘  └────────┬────────┘  └─────────────┬───────────────┘│
└───────────┼────────────────────┼─────────────────────────┼─────────────────┘
            │                    │                         │
            ▼                    ▼                         ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                            QubeBase (Supabase)                             │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │ profiles │  │ persona  │  │ user_did_mapping│  │    user_roles     │  │
│  └──────────┘  └──────────┘  └────────────────┘  └────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
            │                         │
            │                         ▼
            │         ┌─────────────────────────────────────┐
            │         │            AA-API Server            │
            │         │  (External Express Service)         │
            │         │  - /aa/v1/auth/challenge            │
            │         │  - /aa/v1/auth/verify               │
            │         │  - /aa/v1/entitlements/*            │
            │         └─────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          FIO Protocol (Optional)                           │
│                    Human-readable wallet addresses                         │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Key Files Reference

### Frontend Components

| File | Purpose |
|------|---------|
| `src/pages/Auth.tsx` | Email/password sign-in and sign-up UI |
| `src/pages/admin/SetupDID.tsx` | DID generation and linking UI |
| `src/hooks/useIsAdmin.tsx` | Legacy admin status check |
| `src/hooks/useIsAdminAA.tsx` | AA-API enhanced admin check |
| `src/components/PersonaSelector.tsx` | Persona switching dropdown |
| `src/lib/aigentz-client.ts` | AA-API client library |

### Edge Functions

| File | Purpose |
|------|---------|
| `supabase/functions/check-admin/index.ts` | Legacy role-based admin check |
| `supabase/functions/check-admin-aa/index.ts` | DID + AA-API admin verification |

### Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | Basic user profile data |
| `persona` | DiDQube identity personas |
| `user_did_mapping` | Links Supabase users to DIDs |
| `user_roles` | Role assignments (admin, etc.) |
| `roles` | Role definitions |
| `tenants` | Multi-tenant organization |

---

## Authentication Flows

### Flow 1: Standard Email/Password Authentication

```
User                    Auth.tsx              Supabase Auth         profiles table
  │                        │                       │                      │
  │─── Enter credentials ──►                       │                      │
  │                        │── signUp/signIn ─────►│                      │
  │                        │                       │── Create auth.user ──►
  │                        │                       │                      │
  │                        │◄── Session + User ────│                      │
  │                        │                       │                      │
  │◄── Redirect to home ───│                       │                      │
  │                        │                       │                      │
```

**Implementation (`src/pages/Auth.tsx`):**

```typescript
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const redirectUrl = `${window.location.origin}/`;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl  // CRITICAL: Always set this
    }
  });

  if (error) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  } else {
    toast({ title: "Success", description: "Check your email for confirmation" });
  }
  
  setLoading(false);
};

const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  } else {
    navigate('/');
  }
  
  setLoading(false);
};
```

### Flow 2: DID-Based AA-API Authentication

```
User        SetupDID.tsx      AigentZClient       AA-API Server      user_did_mapping
  │              │                  │                   │                   │
  │── Enter DID ─►                  │                   │                   │
  │              │── authenticate() ►                   │                   │
  │              │                  │── POST /challenge ►                   │
  │              │                  │◄── { nonce } ──────                   │
  │              │                  │                   │                   │
  │              │                  │── Sign nonce ─────►                   │
  │              │                  │── POST /verify ───►                   │
  │              │                  │◄── { aa_token } ──│                   │
  │              │◄── { aa_token } ─│                   │                   │
  │              │                  │                   │                   │
  │              │── Save mapping ──────────────────────────────────────────►
  │◄── Success ──│                  │                   │                   │
```

**Implementation (`src/pages/admin/SetupDID.tsx`):**

```typescript
const handleVerifyAndSave = async () => {
  setLoading(true);
  setStatus(null);
  setErrorMessage(null);

  try {
    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('You must be logged in to set up DID');
    }

    // 2. Authenticate with AA-API
    const client = new AigentZClient({
      did: didInput,
      signNonce: async (nonce) => nonce,  // Placeholder - real impl signs with key
    });

    const aaToken = await client.getToken();
    if (!aaToken) {
      throw new Error('Failed to authenticate with AA-API');
    }

    // 3. Save DID mapping to Supabase
    const { error: mappingError } = await supabase
      .from('user_did_mapping')
      .upsert({
        user_id: user.id,
        did: didInput,
        verified_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (mappingError) throw mappingError;

    setStatus('success');
  } catch (error) {
    setStatus('error');
    setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    setLoading(false);
  }
};
```

---

## Database Schema

### Core Tables

```sql
-- User profiles (created automatically on signup)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  persona_id UUID REFERENCES persona(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- DiDQube Identity Personas
CREATE TABLE public.persona (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_id UUID REFERENCES root_identity(id),
  fio_handle TEXT,
  fio_handle_verified BOOLEAN DEFAULT false,
  fio_last_verified_at TIMESTAMPTZ,
  fio_expiration TIMESTAMPTZ,
  default_identity_state JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- DID to Supabase user mapping
CREATE TABLE public.user_did_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  did TEXT NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Role definitions
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User role assignments
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role_id)
);
```

### Automatic User Provisioning

```sql
-- Trigger: Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Auto-Assign Admin Role

```sql
-- Trigger: Auto-assign admin role to approved emails
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER AS $$
DECLARE
  admin_role_id UUID;
  approved_emails TEXT[] := ARRAY[
    'cd@cryptopolitics.us',
    'dele@metame.cm',
    'kt@cryptopolitics.us',
    'lisawattslimitless@gmail.com'
  ];
BEGIN
  IF NEW.email = ANY(approved_emails) THEN
    SELECT r.id INTO admin_role_id
    FROM roles r
    JOIN tenants t ON r.tenant_id = t.id
    WHERE r.name = 'admin' AND t.name = 'default'
    LIMIT 1;

    IF admin_role_id IS NOT NULL THEN
      INSERT INTO user_roles (user_id, role_id)
      VALUES (NEW.id, admin_role_id)
      ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin_role();
```

---

## Identity Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        kybe_identity                             │
│  (Root cryptographic identity - owns DIDs)                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ id: uuid                                                    ││
│  │ kybe_did: "did:kybe:abc123..."                             ││
│  │ public_key: "0x..."                                         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        root_identity                             │
│  (Delegated identity under a kybe_identity)                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ id: uuid                                                    ││
│  │ kybe_id: uuid (FK to kybe_identity)                        ││
│  │ did_uri: "did:root:xyz789..."                              ││
│  │ controller_did: "did:kybe:abc123..."                       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          persona                                 │
│  (User-facing identity with FIO handle)                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ id: uuid                                                    ││
│  │ root_id: uuid (FK to root_identity)                        ││
│  │ fio_handle: "@alice.fio"                                   ││
│  │ fio_handle_verified: true                                   ││
│  │ default_identity_state: { preferences... }                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         agent_keys                               │
│  (Blockchain wallet keys for a persona)                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ id: uuid                                                    ││
│  │ persona_id: uuid (FK to persona)                           ││
│  │ agent_id: "aigent-z"                                        ││
│  │ evm_address: "0x..."                                        ││
│  │ btc_address: "bc1..."                                       ││
│  │ solana_address: "..."                                       ││
│  │ *_private_key_encrypted: "..."                              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Admin Authorization

### Dual-Path Admin Check

The system supports two admin verification methods:

1. **Legacy (Role-Based)**: Checks `user_roles` table via Supabase
2. **AA-API (DID-Based)**: Authenticates with external AA-API server

```typescript
// src/hooks/useIsAdminAA.tsx
export function useIsAdminAA(): AdminStatus {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<AdminCheckMethod>(null);
  const [did, setDid] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Call edge function that tries AA-API first, falls back to legacy
        const { data, error } = await supabase.functions.invoke('check-admin-aa');

        if (error) {
          setIsAdmin(false);
          setMethod(null);
        } else {
          setIsAdmin(Boolean(data?.isAdmin));
          setMethod(data?.method || null);  // 'aa-api' or 'legacy'
          setDid(data?.did);
        }
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  return { isAdmin, loading, method, did };
}
```

### Edge Function Implementation

```typescript
// supabase/functions/check-admin-aa/index.ts

// AA-API URLs with fallback
const AA_BASE_PRIMARY = 'https://aa.dev-beta.aigentz.me';
const AA_BASE_FALLBACK = 'https://aigentzbeta-production.up.railway.app';

async function authenticateWithAAAPI(did: string): Promise<AuthTokens | null> {
  const bases = [AA_BASE_PRIMARY, AA_BASE_FALLBACK];
  
  for (const base of bases) {
    try {
      // 1. Get challenge
      const challengeRes = await fetch(`${base}/aa/v1/auth/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did }),
      });
      
      if (!challengeRes.ok) continue;
      const { nonce } = await challengeRes.json();

      // 2. Verify (placeholder signature)
      const verifyRes = await fetch(`${base}/aa/v1/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did, signature: nonce }),
      });
      
      if (!verifyRes.ok) continue;
      return await verifyRes.json();
    } catch {
      continue;  // Try fallback
    }
  }
  return null;
}

async function checkAdminLegacy(supabaseAdmin: any, userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('user_roles')
    .select(`
      role_id,
      roles!inner(name, tenants!inner(name))
    `)
    .eq('user_id', userId)
    .eq('roles.name', 'admin')
    .eq('roles.tenants.name', 'default')
    .maybeSingle();

  return !!data;
}

Deno.serve(async (req) => {
  // ... CORS handling ...

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Get user from JWT
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) {
    return new Response(JSON.stringify({ isAdmin: false }), { status: 401 });
  }

  // Check for DID mapping
  const { data: didMapping } = await supabaseAdmin
    .from('user_did_mapping')
    .select('did')
    .eq('user_id', user.id)
    .maybeSingle();

  if (didMapping?.did) {
    // Try AA-API authentication
    const tokens = await authenticateWithAAAPI(didMapping.did);
    if (tokens?.aa_token) {
      // TODO: Check entitlements via AA-API
      return new Response(JSON.stringify({
        isAdmin: true,
        method: 'aa-api',
        did: didMapping.did,
      }));
    }
  }

  // Fallback to legacy check
  const isAdmin = await checkAdminLegacy(supabaseAdmin, user.id);
  return new Response(JSON.stringify({
    isAdmin,
    method: 'legacy',
  }));
});
```

---

## FIO Key Management

FIO Protocol provides human-readable wallet addresses (e.g., `@alice@domain`).

### Database Schema

```sql
-- FIO fields in persona table
ALTER TABLE persona ADD COLUMN fio_handle TEXT;
ALTER TABLE persona ADD COLUMN fio_handle_verified BOOLEAN DEFAULT false;
ALTER TABLE persona ADD COLUMN fio_last_verified_at TIMESTAMPTZ;
ALTER TABLE persona ADD COLUMN fio_expiration TIMESTAMPTZ;

-- Helper functions
CREATE FUNCTION is_fio_handle_expired(expiration TIMESTAMPTZ)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN expiration IS NOT NULL AND expiration < now();
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE FUNCTION days_until_fio_expiration(expiration TIMESTAMPTZ)
RETURNS INTEGER AS $$
BEGIN
  IF expiration IS NULL THEN RETURN NULL; END IF;
  RETURN EXTRACT(DAY FROM (expiration - now()))::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-update verification timestamp
CREATE FUNCTION update_fio_verified()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fio_handle_verified = true AND 
     (OLD.fio_handle_verified IS NULL OR OLD.fio_handle_verified = false) THEN
    NEW.fio_last_verified_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER fio_verification_timestamp
  BEFORE UPDATE ON persona
  FOR EACH ROW EXECUTE FUNCTION update_fio_verified();
```

### Views for FIO Status

```sql
CREATE VIEW persona_with_fio_status AS
SELECT 
  p.*,
  is_fio_handle_expired(p.fio_expiration) as fio_is_expired,
  days_until_fio_expiration(p.fio_expiration) as fio_days_until_expiration,
  CASE 
    WHEN p.fio_handle IS NULL THEN 'none'
    WHEN NOT p.fio_handle_verified THEN 'unverified'
    WHEN is_fio_handle_expired(p.fio_expiration) THEN 'expired'
    WHEN days_until_fio_expiration(p.fio_expiration) <= 30 THEN 'expiring_soon'
    ELSE 'active'
  END as fio_status
FROM persona p;
```

### Secrets Required

| Secret Name | Purpose |
|-------------|---------|
| `FIO_API_URL` | FIO Protocol API endpoint |
| `FIO_PRIVATE_KEY` | Key for FIO transactions |

---

## API Keys & Secrets

### Frontend Environment Variables

```env
# D-ID Avatar SDK
VITE_DID_CLIENT_KEY=your-d-id-client-key
VITE_DID_AGENT_ID=your-d-id-agent-id
```

### Edge Function Secrets (Supabase Dashboard)

| Secret | Purpose | Used By |
|--------|---------|---------|
| `SUPABASE_URL` | Database connection | All edge functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin database access | Admin checks |
| `SUPABASE_ANON_KEY` | Public database access | Client operations |
| `FIO_API_URL` | FIO Protocol API | FIO verification |
| `FIO_PRIVATE_KEY` | FIO transactions | FIO registration |
| `OPENAI_API_KEY` | AI features | Chat, content |
| `ANTHROPIC_API_KEY` | AI features | Alternate AI provider |
| `LOVABLE_API_KEY` | Lovable AI Gateway | AI gateway access |

---

## OAuth Configuration

OAuth is **configured but not actively implemented** in the current codebase.

### Available Providers (Supabase Dashboard)

- Google
- LinkedIn (secrets configured: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`)
- GitHub

### To Enable OAuth

1. Configure provider in Supabase Dashboard → Authentication → Providers
2. Add redirect URLs for your domains
3. Update `Auth.tsx` to include OAuth buttons:

```typescript
const handleOAuthSignIn = async (provider: 'google' | 'linkedin' | 'github') => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  }
};
```

---

## Security Considerations

### Role Storage

**CRITICAL**: Roles are stored in a separate `user_roles` table, NOT on the user profile. This prevents privilege escalation attacks.

```sql
-- CORRECT: Separate roles table with RLS
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  role_id UUID REFERENCES roles(id),
  UNIQUE(user_id, role_id)
);

-- WRONG: Do NOT do this
-- ALTER TABLE profiles ADD COLUMN role TEXT;
```

### RLS Policies

```sql
-- Allow users to read their own roles
CREATE POLICY "Users can view own roles"
ON user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can modify roles (using security definer function)
CREATE FUNCTION has_admin_role()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    JOIN tenants t ON r.tenant_id = t.id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
      AND t.name = 'default'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
```

### Admin Verification

**NEVER** check admin status using:
- ❌ localStorage/sessionStorage
- ❌ Hardcoded email lists in frontend
- ❌ Client-side role checks

**ALWAYS** use:
- ✅ Server-side edge function verification
- ✅ Database role lookups with RLS
- ✅ JWT claims from trusted auth provider

---

## Troubleshooting

### User Not Getting Admin Role

1. Check if email is in `auto_assign_admin_role` approved list
2. Verify `roles` table has 'admin' role for 'default' tenant
3. Check `user_roles` table for the assignment

```sql
-- Debug query
SELECT u.email, r.name as role, t.name as tenant
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
LEFT JOIN tenants t ON r.tenant_id = t.id
WHERE u.email = 'user@example.com';
```

### DID Authentication Failing

1. Check AA-API server is reachable
2. Verify `user_did_mapping` has correct DID format
3. Check edge function logs for errors

### FIO Handle Not Verifying

1. Check `FIO_API_URL` and `FIO_PRIVATE_KEY` secrets are set
2. Verify FIO handle format is correct
3. Check FIO Protocol API status

---

## Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Email Auth** | Supabase Auth | Standard user registration |
| **DID Auth** | AA-API | Decentralized identity verification |
| **Profiles** | Supabase DB | User metadata storage |
| **Personas** | DiDQube | Multi-identity management |
| **FIO** | FIO Protocol | Human-readable addresses |
| **Roles** | Supabase + RLS | Access control |
| **Admin Check** | Edge Functions | Server-side authorization |
