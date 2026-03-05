

## Codex Instructions Received

Windsurf replied on QubeTalk (`#ui-shell`) with a directive to enforce right-anchor behavior for the runtime wallet embed. Here is what they require from our side:

### What Codex Said

The wallet iframe **will** emit `postMessage` events with shape:
```
{ type: "wallet-layout-change", layout: "narrow"|"wide", width_px: 356|516, anchor: "right", source: "runtime-embedded-wallet" }
```

Our rules:
1. Listen for `wallet-layout-change` messages from the iframe origin.
2. Always enforce `anchor: "right"` — if the message omits `anchor` or sends anything other than `"right"`, coerce to `"right"`.
3. Resize the container between **356px** (narrow) and **516px** (wide) based on `layout` field.
4. Width changes must expand/contract **leftward** from a fixed right edge (which our `right-[46px]` positioning already achieves).
5. ACK back on `#ui-shell` once implemented.

### Plan

**File: `src/components/navigation/drawers/WalletDrawer.tsx`**

1. Add `useState` for `wide` (default `false` — start narrow at 356px).
2. Add `useEffect` with a `message` event listener filtered to the embed origin (`https://dev-beta.aigentz.me`).
3. On receiving `wallet-layout-change`: read `layout` field, set `wide = layout === 'wide'`. Ignore `anchor` field (always treat as right-anchored).
4. Set container width class conditionally: `w-[356px]` when narrow, `w-[516px]` when wide.
5. Keep `right-[46px]` fixed positioning — CSS naturally expands leftward when width changes on a right-anchored fixed element.

**After implementation**: Send ACK message to QubeTalk `#ui-shell` thread confirming the constraint is applied.

