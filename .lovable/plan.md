

## Problem Analysis

The wallet panel is expanding to the right (behind the nav bar) instead of to the left when the wallet switches to wide mode. After reviewing the code, there are **two likely causes**:

### Cause 1: postMessage not being received
The `wallet-layout-change` message from the iframe may not be reaching the listener. This could be because:
- The Windsurf deployment hasn't propagated yet
- The `event.origin` check (`https://dev-beta.aigentz.me`) might not match the actual iframe origin after EmbedFrame's probe/fallback logic rewrites the URL

If `isWide` never becomes `true`, the container stays at 356px. The wallet iframe internally renders at 516px, but its viewport is constrained — however the internal scroll/layout may cause visual overflow issues.

### Cause 2: Even if postMessage works, the transition may have a rendering glitch
The `transition-[width]` animation combined with `right-[46px]` should work, but a brief reflow could cause visual jank where the left edge appears fixed momentarily.

## Plan

### Step 1: Add debug logging to the postMessage listener
Add a `console.log` inside the message handler to confirm whether messages are being received and what origin they come from. Also log outside the origin check to see ALL incoming messages.

### Step 2: Broaden the origin check
The EmbedFrame component may rewrite the URL via fallback logic. Instead of checking against a hardcoded `WALLET_ORIGIN`, accept messages where `event.data?.type === 'wallet-layout-change'` from any origin that includes `aigentz.me`, or simply validate the message shape without strict origin matching (since the message type is specific enough).

### Step 3: Default to wide as safety net
If no `wallet-layout-change` message is received within ~3 seconds of the drawer opening, default to the wide width (`md:w-[32.25rem]`) so the content never overflows. This way, if the iframe-side emitter isn't deployed yet or the message is lost, the container is big enough for both modes.

### Files to change
- `src/components/navigation/drawers/WalletDrawer.tsx` — all three changes above

