

# Fix 500 Internal Server Error on SmartTriad Embeds

## Problem Identified

The 500 Internal Server Error is caused by a **malformed URL** in `SmartTriadCodexManager.tsx`. The cache-busting timestamp is being appended with `?` instead of `&`, creating a double question mark in the URL.

### Current (Broken) URL Structure
```
https://dev-beta.aigentz.me/triad/embed/admin/codex?v=2025-12-30-01?_t=1234567890
                                                                    ^ WRONG - should be &
```

The Next.js server on AigentiQ cannot parse this malformed URL and returns a 500 error.

## Implementation Plan

### Step 1: Fix the malformed URL in SmartTriadCodexManager.tsx

**File:** `src/pages/admin/SmartTriadCodexManager.tsx`

**Change on line 60:**
```tsx
// BEFORE (broken)
src={`${ADMIN_CODEX_EMBED_URL}?_t=${Date.now()}`}

// AFTER (fixed)
src={`${ADMIN_CODEX_EMBED_URL}&_t=${Date.now()}`}
```

### Step 2: Apply consistent cache-busting to WalletDrawer (optional enhancement)

**File:** `src/components/navigation/drawers/WalletDrawer.tsx`

For consistency and to ensure fresh content on each drawer open:
```tsx
// BEFORE
src={WALLET_EMBED_URL}

// AFTER (with cache-busting)
src={`${WALLET_EMBED_URL}&_t=${Date.now()}`}
```

### Step 3: Verify the fix using the Embed Health Check page

Navigate to `/admin/embed-health` after the fix to confirm:
- All three endpoints (Wallet, Codex, Admin Codex) show as reachable
- The iframe load test section displays actual content from AigentiQ

## Technical Details

### Why This Happened

The embed URLs are constructed in `src/config/embed.ts`:

```typescript
export const WALLET_EMBED_URL =
  `${TRIAD_EMBED_BASE}/triad/embed/wallet?v=${TRIAD_EMBED_VERSION}`;

export const CODEX_EMBED_URL =
  `${TRIAD_EMBED_BASE}/triad/embed/codex` +
  `?tab=scrolls&theme=light&density=wide&v=${TRIAD_EMBED_VERSION}`;

export const ADMIN_CODEX_EMBED_URL =
  `${TRIAD_EMBED_BASE}/triad/embed/admin/codex?v=${TRIAD_EMBED_VERSION}`;
```

All three URLs already contain a `?` for the version parameter. When adding additional query parameters (like cache-busting `_t`), you must use `&` to continue the query string, not `?` which starts a new one.

### URL Query String Rules
- First parameter: use `?` (e.g., `?v=1.0`)
- Additional parameters: use `&` (e.g., `?v=1.0&_t=12345`)

### Files to Modify

1. **`src/pages/admin/SmartTriadCodexManager.tsx`** - Critical fix (line 60)
2. **`src/components/navigation/drawers/WalletDrawer.tsx`** - Optional enhancement for consistency

## Expected Result

After this fix:
- SmartWallet drawer loads wallet content from AigentiQ iframe
- KNYT Codex drawer loads codex content from AigentiQ iframe
- Admin Codex Manager page loads admin codex content from AigentiQ iframe
- No more 500 Internal Server Errors
- Cache-busting ensures fresh content is loaded each time

## Future Prevention

When adding cache-busting or any additional query parameters to embed URLs:
1. Always check if the base URL already contains `?`
2. If it does, use `&` to append new parameters
3. Consider creating a utility function to handle this automatically:

```typescript
// Example utility (optional future enhancement)
function addQueryParam(url: string, key: string, value: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${key}=${value}`;
}
```

