
# Embed Diagnostics & Fallback System - IMPLEMENTED

## Problem Confirmed

The 500 Internal Server Error is **upstream** in the AigentiQ Next.js app:
- `https://dev-beta.aigentz.me/triad/embed/wallet` → 500
- `https://dev-beta.aigentz.me/triad/embed/codex` → 500
- `https://dev-beta.aigentz.me/triad/embed/admin/codex` → 500

This is NOT caused by the Qriptopian thin client.

## Implementation Complete

### ✅ 1. Centralized Embed URL Builder
**File:** `src/lib/embedUtils.ts`
- `withQuery(url, params)` - safely appends query params
- `withCacheBust(url)` - adds `_t` timestamp
- `buildEmbedUrl(base, path, params, version)` - complete URL builder
- Multi-base support via `getOrderedBases()` with localStorage persistence

### ✅ 2. Server-Side Probe (CORS-safe)
**File:** `supabase/functions/triad-embed-probe/index.ts`
- Accepts `{ url }` and performs server-side fetch
- SSRF protection with strict URL allowlist
- Returns: status, headers (X-Frame-Options, CSP), response snippet
- Provides undeniable root cause even with CORS restrictions

### ✅ 3. EmbedFrame Component
**File:** `src/components/EmbedFrame.tsx`
- Probes before rendering iframe
- Shows friendly error panel when status ≠ 200:
  - Status code + endpoint
  - Response snippet
  - "Retry" / "Open in New Tab" / "Health Check" buttons
- Supports fallback bases
- Prevents blank 500 error pages

### ✅ 4. Updated Drawers
- `src/components/navigation/drawers/WalletDrawer.tsx` - uses EmbedFrame
- `src/components/navigation/drawers/CodexDrawer.tsx` - uses EmbedFrame
- `src/pages/admin/SmartTriadCodexManager.tsx` - uses EmbedFrame

### ✅ 5. Upgraded Health Check
**File:** `src/pages/admin/EmbedHealthCheck.tsx`
- Uses server-side probe for accurate diagnostics
- Shows final URL + status + headers + snippet per endpoint
- **"Copy Debug Report" button** for ops team
- Keeps iframe load test for correlation

### ✅ 6. Multi-Base Fallback Support
**Environment variable:** `VITE_TRIAD_EMBED_BASES`
- Comma-separated list of base URLs
- Probes in order, selects first working base
- Stores last-known-good base in localStorage

## How to Use

### Immediate Fix (when AigentiQ is fixed)
No code change needed - embeds will automatically work when upstream returns 200.

### Alternative Host (if available)
Add to `.env`:
```
VITE_TRIAD_EMBED_BASES="https://working-host.aigentz.me,https://dev-beta.aigentz.me"
```

### Debug Upstream Issues
1. Open `/admin/embed-health`
2. Click "Copy Debug Report"
3. Share JSON with AigentiQ ops team

## Files Modified/Added

| File | Action |
|------|--------|
| `src/lib/embedUtils.ts` | Created |
| `src/components/EmbedFrame.tsx` | Created |
| `supabase/functions/triad-embed-probe/index.ts` | Created |
| `supabase/config.toml` | Updated |
| `src/components/navigation/drawers/WalletDrawer.tsx` | Updated |
| `src/components/navigation/drawers/CodexDrawer.tsx` | Updated |
| `src/pages/admin/SmartTriadCodexManager.tsx` | Updated |
| `src/pages/admin/EmbedHealthCheck.tsx` | Rewritten |
