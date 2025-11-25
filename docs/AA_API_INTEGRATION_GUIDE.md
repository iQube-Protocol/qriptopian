# AA-API Integration Guide

## Overview

The AA-API (Aigent Z Application API) integration provides DID-based wallet authentication and agent-to-agent payment capabilities. This is **separate and independent** from the Supabase-based admin authorization system.

## Architecture

```
┌─────────────────────┐
│   Frontend (Vite)   │
│                     │
│  ┌───────────────┐  │
│  │ WalletContext │  │
│  │  (React)      │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │ AaApiClient   │  │
│  └───────┬───────┘  │
│          │          │
└──────────┼──────────┘
           │ supabase.functions.invoke()
           │
┌──────────▼──────────┐
│  Supabase Edge      │
│  Functions          │
│                     │
│  ┌──────────────┐   │
│  │ aa-auth-     │   │
│  │ challenge    │   │
│  └──────┬───────┘   │
│         │           │
│  ┌──────▼───────┐   │
│  │ aa-auth-     │   │
│  │ verify       │   │
│  └──────┬───────┘   │
│         │           │
│  ┌──────▼───────┐   │
│  │ _shared/     │   │
│  │ aaClient.ts  │   │
│  └──────┬───────┘   │
└─────────┼───────────┘
          │ fetch()
          │
┌─────────▼───────────┐
│   AA-API Server     │
│   (Express)         │
│                     │
│   /aa/v1/auth/*     │
│   /aa/v1/assets/*   │
│   /aa/v1/payments/* │
└─────────────────────┘
```

---

## Key Principles

1. **DID-Based Identity**: Uses Decentralized Identifiers for authentication
2. **Proxied Access**: Frontend never calls AA-API directly
3. **Edge Function Gateway**: Supabase functions proxy requests
4. **Token Management**: aa_token is managed by frontend client
5. **Independent from Supabase Auth**: AA-API auth ≠ Supabase auth

---

## Step 1: Environment Configuration

### Frontend Environment Variables

Add to `.env`:

```bash
# AA-API Base URL (with /aa/v1 path)
VITE_AIGENT_Z_AA_BASE=https://aa.dev-beta.aigentz.me/aa/v1

# Fallback URL (Railway direct)
VITE_AIGENT_Z_AA_FALLBACK=https://aigentzbeta-production.up.railway.app/aa/v1

# AigentIQ API URL (for identity/reputation)
VITE_AIGENTIQ_API_URL=https://dev-beta.aigentz.me
```

### Edge Function Secrets

Set in Supabase:

```bash
# AA-API base URL (backend use)
AIGENT_Z_AA_BASE=https://aa.dev-beta.aigentz.me/aa/v1

# Fallback URL
AIGENT_Z_AA_FALLBACK=https://aigentzbeta-production.up.railway.app/aa/v1
```

---

## Step 2: Shared AA-API Client (Edge Functions)

Create `supabase/functions/_shared/aaClient.ts`:

```typescript
/**
 * Shared AA-API client for edge functions
 * Handles URL construction and API calls with fallback
 */

const AA_BASE_PRIMARY = Deno.env.get('AIGENT_Z_AA_BASE');
const AA_BASE_FALLBACK = Deno.env.get('AIGENT_Z_AA_FALLBACK');

let currentBase = AA_BASE_PRIMARY;
let hasFailedPrimary = false;

/**
 * Build AA-API URL with fallback handling
 */
export function aaUrl(path: string): string {
  if (!currentBase) {
    throw new Error('AA-API base URL not configured');
  }
  const base = new URL(currentBase);
  return new URL(path, base).toString();
}

/**
 * Fetch with automatic fallback
 */
export async function fetchWithFallback(
  url: string,
  init?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, init);
    
    if (!response.ok && currentBase === AA_BASE_PRIMARY && !hasFailedPrimary) {
      throw new Error(`Primary URL failed: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (currentBase === AA_BASE_PRIMARY && !hasFailedPrimary && AA_BASE_FALLBACK) {
      console.warn('Falling back to Railway URL', error);
      hasFailedPrimary = true;
      currentBase = AA_BASE_FALLBACK;
      
      const path = url.replace(AA_BASE_PRIMARY, '');
      const fallbackUrl = aaUrl(path);
      return fetch(fallbackUrl, init);
    }
    
    throw error;
  }
}

/**
 * Call AA-API endpoint
 */
export async function callAaApi(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = aaUrl(path);
  return fetchWithFallback(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
```

---

## Step 3: Edge Functions

### aa-auth-challenge

Create `supabase/functions/aa-auth-challenge/index.ts`:

```typescript
import { callAaApi } from '../_shared/aaClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { did } = await req.json();
    
    if (!did) {
      return new Response(
        JSON.stringify({ error: 'DID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Proxy to AA-API
    const response = await callAaApi('auth/challenge', {
      method: 'POST',
      body: JSON.stringify({ did }),
    });

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { 
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Challenge error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### aa-auth-verify

Create `supabase/functions/aa-auth-verify/index.ts`:

```typescript
import { callAaApi } from '../_shared/aaClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { did, signature } = await req.json();
    
    if (!did || !signature) {
      return new Response(
        JSON.stringify({ error: 'DID and signature required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Proxy to AA-API
    const response = await callAaApi('auth/verify', {
      method: 'POST',
      body: JSON.stringify({ did, signature }),
    });

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { 
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## Step 4: Frontend Client Library

Use the existing `src/lib/aigentz-client.ts` which includes:

- `AigentZClient` class for authentication and API calls
- `getReputationBucket()` for DiDQube reputation
- `createReputationBucket()` for creating reputation records
- Automatic fallback URL handling

**Key Features:**
```typescript
// Initialize client
const client = new AigentZClient({
  did: 'did:example:aigent-z',
  signNonce: async (nonce) => {
    // Sign with your DID key
    return signature;
  },
});

// Authenticate
const { aa_token, tenant_id } = await client.authenticate();

// Call AA-API
const response = await client.fetch('assets', { method: 'GET' });

// Transfer Q¢
await client.transferQct({
  fromAgentId: 'aigent-z',
  toAgentId: 'aigent-moneypenny',
  amountQct: 100,
});

// Check entitlement
await client.checkEntitlement({
  assetId: 'asset-uuid',
  action: 'view',
});
```

---

## Step 5: Wallet Context (React Integration)

Create `src/contexts/WalletContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WalletState {
  initialized: boolean;
  address: string | null;
  did: string | null;
  aa_token: string | null;
  balances: {
    qct: number;
    btc: number;
    eth: number;
  };
}

interface WalletContextType {
  wallet: WalletState;
  initializeWallet: (did: string) => Promise<void>;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletState>({
    initialized: false,
    address: null,
    did: null,
    aa_token: null,
    balances: { qct: 0, btc: 0, eth: 0 },
  });

  const initializeWallet = async (did: string) => {
    try {
      // Get challenge
      const { data: challengeData, error: challengeError } = 
        await supabase.functions.invoke('aa-auth-challenge', {
          body: { did },
        });

      if (challengeError) throw challengeError;

      const { nonce } = challengeData;

      // Sign challenge (implement your signing logic)
      const signature = await signChallenge(nonce, did);

      // Verify and get token
      const { data: verifyData, error: verifyError } = 
        await supabase.functions.invoke('aa-auth-verify', {
          body: { did, signature },
        });

      if (verifyError) throw verifyError;

      const { aa_token } = verifyData;

      setWallet({
        initialized: true,
        address: did,
        did,
        aa_token,
        balances: { qct: 0, btc: 0, eth: 0 }, // Fetch real balances
      });
    } catch (error) {
      console.error('Wallet initialization failed:', error);
      throw error;
    }
  };

  const refreshBalances = async () => {
    // Implement balance fetching logic
  };

  // Auto-initialize when user logs in
  useEffect(() => {
    if (user && !wallet.initialized) {
      // Auto-generate or load DID
      const did = `did:example:${user.id}`;
      initializeWallet(did).catch(console.error);
    }
  }, [user]);

  return (
    <WalletContext.Provider value={{ wallet, initializeWallet, refreshBalances }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

// Helper function - implement based on your DID method
async function signChallenge(nonce: string, did: string): Promise<string> {
  // Implement signing logic
  // For Phase 1 dev, you can return the nonce as signature is not checked
  return nonce;
}
```

---

## Step 6: Integration with App

Update `src/App.tsx` or main entry point:

```tsx
import { WalletProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext'; // If you create one

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        {/* Your app routes */}
      </WalletProvider>
    </AuthProvider>
  );
}
```

---

## Authentication Flow Diagram

```
sequenceDiagram
    participant User
    participant Frontend
    participant EdgeFn as Edge Function
    participant AAAPI as AA-API

    User->>Frontend: Click "Connect Wallet"
    Frontend->>Frontend: Generate/Load DID
    Frontend->>EdgeFn: invoke('aa-auth-challenge', {did})
    EdgeFn->>AAAPI: POST /aa/v1/auth/challenge
    AAAPI-->>EdgeFn: {nonce}
    EdgeFn-->>Frontend: {nonce}
    Frontend->>Frontend: Sign nonce with DID key
    Frontend->>EdgeFn: invoke('aa-auth-verify', {did, signature})
    EdgeFn->>AAAPI: POST /aa/v1/auth/verify
    AAAPI-->>EdgeFn: {aa_token, tenant_id}
    EdgeFn-->>Frontend: {aa_token, tenant_id}
    Frontend->>Frontend: Store aa_token
    Frontend-->>User: Wallet Connected
```

---

## Key Differences from Supabase Auth

| Aspect | Supabase Auth | AA-API Auth |
|--------|--------------|-------------|
| Purpose | User authentication & authorization | Agent/wallet identity & payments |
| Identity | Email/OAuth | DID (Decentralized Identifier) |
| Token | JWT (auth.session) | aa_token (AA-API JWT) |
| Storage | `auth.users` table | External AA-API service |
| Scope | App-wide user sessions | Agent-to-agent operations |
| Admin Check | `user_roles` table + RLS | Not used for admin auth |

---

## Testing Checklist

- [ ] Edge functions deploy successfully
- [ ] Challenge endpoint returns nonce
- [ ] Verify endpoint returns aa_token
- [ ] Fallback URL works when primary fails
- [ ] Wallet context initializes on login
- [ ] aa_token persists across page reloads
- [ ] Payment transfers work with aa_token
- [ ] Reputation queries work via HTTP routes

---

## Security Considerations

1. **Never expose AA-API directly** - Always use edge function proxy
2. **Validate DIDs** - Implement proper DID verification in production
3. **Secure nonce signing** - Use secure key storage for DID keys
4. **Token expiry** - Implement aa_token refresh logic
5. **Rate limiting** - Add rate limits to edge functions

---

## Common Issues

**Issue**: CORS errors when calling AA-API
**Solution**: AA-API should never be called directly from frontend; use edge functions

**Issue**: aa_token not working
**Solution**: Check token format and ensure it's included in Authorization header

**Issue**: Fallback URL not working
**Solution**: Verify both URLs are set in environment variables

---

## Production Deployment

1. Set production AA-API URL in environment variables
2. Implement proper DID key management
3. Add monitoring for edge function performance
4. Set up alerts for AA-API connectivity issues
5. Implement aa_token refresh logic
6. Add comprehensive error handling

---

## Additional Resources

- [Aigent Z AA-API Documentation](https://docs.aigentz.me/aa-api)
- [DID Specification](https://www.w3.org/TR/did-core/)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
