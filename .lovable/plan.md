

# Onboarding Brief for metaMe Runtime Thin Client (New Lovable Project)

This is not an implementation plan for this project -- it is a **handoff document / bootstrap brief** you will paste into a new Lovable project's **Custom Knowledge** (Settings > Manage Knowledge) and initial prompt to give the new agent full context from day one.

---

## What to Do

1. **Create a new Lovable project** called `metaMe Runtime Shell`
2. **Paste the Custom Knowledge block below** into the project's Settings > Manage Knowledge
3. **Send the Initial Prompt** (below) as your first message to the new agent

---

## Custom Knowledge (paste into Settings > Manage Knowledge)

```
# metaMe Runtime Shell -- Platform Context & Integration Guide

## 1. Architecture Role

This project is a **thin client shell** for the metaMe Runtime. It does NOT contain business logic.
It provides: a header (trust indicators, Aigent/LLM selectors), a SmartMenu (Earn/Play/Make + edge items Be/Share), and an iframe that embeds the real metaMe runtime UI. All dynamic data is hydrated from the AA-API.

## 2. AigentiQ Platform & AA-API

The AA-API (Aigent Z Application API) is an Express service exposing HTTP endpoints under `/aa/v1/*`:
- `/aa/v1/auth/challenge` (POST) -- returns `{ nonce }` for a given `{ did }`
- `/aa/v1/auth/verify` (POST) -- accepts `{ did, signature }`, returns `{ aa_token, tenant_id }`
- `/aa/v1/assets/*` -- asset registration and queries
- `/aa/v1/payments/*` -- Q-cent transfers and funding
- `/aa/v1/entitlements/*` -- access control checks
- `/aa/v1/runtime/shell-config` (GET) -- **new endpoint** that returns full shell hydration payload (trust, selectors, menu, iframe config)
- `/aa/v1/runtime/selectors` (POST) -- update Aigent/LLM selection
- `/aa/v1/runtime/menu-action` (POST) -- handle menu interactions

All authenticated requests use `Authorization: Bearer <aa_token>`.

### Base URLs
- Primary: `https://aa.dev-beta.aigentz.me/aa/v1`
- Fallback (Railway direct, always available): `https://aigentzbeta-production.up.railway.app/aa/v1`
- AigentiQ App (for identity/reputation routes): `https://dev-beta.aigentz.me`

### Authentication Flow
1. `POST /aa/v1/auth/challenge` with `{ did }` --> get `{ nonce }`
2. Sign nonce with agent key (Phase 1: any non-empty string accepted)
3. `POST /aa/v1/auth/verify` with `{ did, signature }` --> get `{ aa_token, tenant_id }`
4. Cache `aa_token`, attach as Bearer on all subsequent calls

### Environment Variables
```
VITE_AIGENT_Z_AA_BASE=https://aa.dev-beta.aigentz.me/aa/v1
VITE_AIGENT_Z_AA_FALLBACK=https://aigentzbeta-production.up.railway.app/aa/v1
VITE_AIGENTIQ_API_URL=https://dev-beta.aigentz.me
VITE_TRIAD_EMBED_BASE=https://dev-beta.aigentz.me
VITE_RUNTIME_IFRAME_URL=<to-be-provided>
VITE_RUNTIME_IFRAME_ORIGIN=<to-be-provided>
```

## 3. iframe Integration Patterns (PROVEN -- reuse these)

### EmbedFrame Component Pattern
Use a reusable `EmbedFrame` component that:
- Probes the embed URL via an edge function (`triad-embed-probe`) before loading
- Supports multi-base fallback (comma-separated `VITE_TRIAD_EMBED_BASES`)
- Stores last-known-good base in localStorage
- Shows loading, error, and "blocked by CSP" states with "Open in New Tab" fallback
- Appends cache-busting `_t` timestamps

### postMessage Auth Handshake Protocol
The iframe expects a two-step handshake:
1. iframe sends: `{ type: 'aa-auth-context-ready-v1' }` to parent
2. Parent responds: `{ type: 'aa-auth-context-v1', personaId, authProfileId }` to iframe origin

For the metaMe shell, extend this with the new handshake:
- Shell --> iframe: `SHELL_READY`
- Shell --> iframe: `HANDOFF` (with `handoff_token` + context from shell-config)
- iframe --> Shell: `RUNTIME_READY`
- iframe --> Shell: `NAVIGATE`, `REQUEST_TRUST_REFRESH`, `TOAST`, `OPEN_CAPSULE`
- Shell --> iframe: `MENU_ACTION`, `SELECTOR_CHANGE`, `CONTEXT_UPDATE`

### CSP / X-Frame-Options
The upstream AigentiQ server must include these domains in `frame-ancestors`:
`frame-ancestors 'self' https://qriptopian.lovable.app https://*.lovable.app https://*.lovableproject.com;`

## 4. QubeTalk Coordination

QubeTalk is the inter-agent messaging system stored in the `qubetalk_messages` table in QubeBase (Supabase).

### Sending Messages
Use a Supabase edge function `send-qubetalk` with payload:
```json
{
  "channel_id": "metame-runtime-thinclient",
  "content": "message text",
  "from_agent": "lovable-metame",
  "type": "text",
  "metadata": { "thread": "ui-shell", "severity": "info" }
}
```

### Channel: `metame-runtime-thinclient`
Participants: ChatGPT (orchestrator), Aigent Z (owner), Lovable Agent (UI), Windsurf agents (executors)
Threads: #spec, #api-wiring, #ui-shell, #dev-exec, #ops

## 5. DiDQube Identity & Reputation

- Personas: `GET/POST /api/identity/persona` on the AigentiQ app
- Reputation buckets: `GET /api/identity/reputation/bucket?partitionId=agent:<id>`
- Create bucket: `POST /api/identity/reputation/bucket` with `{ partitionId, skillCategory, initialScore }`
- RQH Canister ID (reference): `zdjf3-2qaaa-aaaas-qck4q-cai`

## 6. Key Constraints

- **Pure thin client**: NO business logic in this shell. All state comes from AA-API.
- **Never call AA-API directly from browser**: Use Supabase edge functions as proxies.
- **Never expose service keys**: `QUBEBASE_SERVICE_ROLE_KEY` is server-side only.
- **Payments always via AA-API**: Never write directly to payment tables.
- **URL building**: Keep `/aa/v1` handling consistent. Don't mix base-with-path and absolute paths.
- **Mobile-first**: All UI must be responsive, mobile-first design.
```

---

## Initial Prompt (send as first message to the new agent)

```
Set up a metaMe Runtime Thin Client shell application. This is a Vite + React + TypeScript + Tailwind + shadcn/ui project (Lovable's default stack).

The app is a thin client shell with three zones:
1. **Header**: Trust indicators (verified/unverified/warning), an Aigent selector dropdown, and an LLM selector dropdown
2. **SmartMenu**: Menu items for Earn, Play, Make (primary triad) plus edge items Be and Share, with collapse-to-single-button behavior on mobile
3. **iframe Runtime**: A full-viewport iframe that embeds the metaMe runtime UI

All UI state is hydrated from the AA-API endpoint `GET /aa/v1/runtime/shell-config` (see Custom Knowledge for the full response shape). The app authenticates using the DID challenge-verify flow described in Custom Knowledge.

Please create:

1. **Environment variables** in `.env`:
   - VITE_AIGENT_Z_AA_BASE=https://aa.dev-beta.aigentz.me/aa/v1
   - VITE_AIGENT_Z_AA_FALLBACK=https://aigentzbeta-production.up.railway.app/aa/v1
   - VITE_AIGENTIQ_API_URL=https://dev-beta.aigentz.me
   - VITE_TRIAD_EMBED_BASE=https://dev-beta.aigentz.me
   - VITE_RUNTIME_IFRAME_URL=https://dev-beta.aigentz.me/runtime

2. **`src/lib/aa-client.ts`**: AA-API client with:
   - URL builder with automatic primary/fallback handling
   - `authenticate(did, signNonce)` using challenge-verify flow
   - `fetchShellConfig()` calling GET /aa/v1/runtime/shell-config
   - `updateSelector(type, id)` calling POST /aa/v1/runtime/selectors
   - Generic `aaFetch(path, init)` with Bearer token

3. **`src/lib/embed-utils.ts`**: Embed utilities with:
   - `probeEmbedUrl()` via edge function
   - `withCacheBust()` for timestamp appending
   - `getOrderedBases()` with localStorage last-known-good
   - `buildEmbedUrl()` helper

4. **`src/components/EmbedFrame.tsx`**: Reusable iframe wrapper with:
   - Pre-flight probe before loading
   - Multi-base fallback support
   - Loading/error/blocked states with "Open in New Tab" fallback
   - postMessage listener for `RUNTIME_READY` event

5. **`src/contexts/ShellContext.tsx`**: React context providing:
   - Shell config state (trust, selectors, menu items, iframe config)
   - `hydrate()` to fetch shell-config from AA-API
   - `selectAigent(id)` and `selectLLM(id)` actions
   - `handleMenuAction(itemId)` action
   - Authentication state (aa_token, did, tenant_id)

6. **`src/components/RuntimeHeader.tsx`**: Header bar with:
   - Trust level badge (green/yellow/red based on trust_level)
   - Trust signal indicators
   - Aigent selector dropdown (populated from selectors.aigent.options)
   - LLM selector dropdown (populated from selectors.llm.options)

7. **`src/components/SmartMenu.tsx`**: Smart menu with:
   - Primary triad: Earn, Play, Make buttons
   - Edge items: Be, Share (shown conditionally per policy)
   - Collapse to single metaMe button on mobile when policy says so
   - Menu actions forwarded via ShellContext

8. **`src/components/RuntimeFrame.tsx`**: Main iframe area using EmbedFrame with:
   - postMessage handshake (SHELL_READY -> HANDOFF with handoff_token)
   - Listener for iframe events (NAVIGATE, TOAST, OPEN_CAPSULE)
   - Full viewport height minus header and menu

9. **`src/pages/Index.tsx`**: Main page composing Header + SmartMenu + RuntimeFrame

10. **`supabase/functions/send-qubetalk/index.ts`**: Edge function to insert messages into `qubetalk_messages` table with fields: message_id, channel_id, content, from_agent, type, metadata.

Use shadcn/ui components (Badge, Button, Select, DropdownMenu). Mobile-first responsive design. Dark theme default.
```

---

## Summary

- **Custom Knowledge** gives the agent all AA-API endpoints, authentication flows, iframe patterns, QubeTalk schema, and architectural constraints
- **Initial Prompt** requests the complete scaffold in one shot: client library, embed utilities, shell context, header, menu, iframe frame, and QubeTalk edge function
- The new agent will have everything it needs to build the metaMe Runtime shell without reverse-engineering the Qriptopian codebase
