

## Problem

The wallet's default mode is **narrow**, not wide. The current code correctly starts with `isWide = false`, but the 3-second safety timeout on line 52-60 forces it to wide even when the wallet hasn't requested it. This causes the narrow→wide flash.

## Fix

**Remove the safety timeout entirely.** The drawer should:
1. Start narrow (`isWide = false`) — correct, already in place
2. Only switch to wide when the iframe explicitly sends `{ type: 'wallet-layout-change', layout: 'wide' }`
3. Never auto-expand

### Changes to `WalletDrawer.tsx`

- Delete the `WIDE_DEFAULT_TIMEOUT_MS` constant (line 12)
- Delete the `receivedMessage` ref (line 21) — only used by the timeout
- Delete the timeout block (lines 52-60) and its cleanup (`clearTimeout`) on line 64
- Delete the `receivedMessage.current = false` reset on line 27 and line 72
- Keep everything else as-is: the `postMessage` listener, the `isWide` state starting at `false`, the reset to `false` on close

