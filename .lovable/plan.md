

## Analysis

The container div in `WalletDrawer.tsx` (line 47) does have dynamic width classes toggling between 356px (narrow) and 516px (wide) based on the `wide` state. However, this state change depends entirely on receiving a `wallet-layout-change` postMessage from the iframe content. If that message isn't fired (or is missed during initial load), the container stays stuck at 356px while the iframe content renders wider, causing overflow/clipping.

Two issues to fix:

1. **Missing `overflow-hidden`** on the container — if the iframe content renders wider before/without the postMessage, it bleeds out of the container.
2. **No fallback resize detection** — relying solely on postMessage is fragile. We should also observe the iframe's content width via a `ResizeObserver` on the iframe element itself, or at minimum handle the case where the iframe loads in wide mode but the message arrives before the listener is attached (race condition: the `if (!isOpen) return null` means the listener only attaches when the drawer opens, but the iframe may have already sent its layout message during probe/load).

## Plan

**File: `src/components/navigation/drawers/WalletDrawer.tsx`**

1. Add `overflow-hidden` to the container div to prevent bleed while the width transition catches up.
2. Move the `useEffect` for the message listener above the early return (`if (!isOpen) return null`) so it's always active — this prevents the race condition where the iframe sends `wallet-layout-change` before the component mounts the listener.
3. Add a secondary detection: attach a `ResizeObserver` to the iframe element that checks its `scrollWidth` and toggles `wide` if it exceeds 400px (the threshold between narrow/wide). This acts as a fallback when postMessage isn't available.

These are small additions — no changes to positioning, z-index, or layout structure.

