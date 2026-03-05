
Goal: Make wallet expansion visibly and behaviorally leftward every time, with no apparent right-side growth.

What’s actually causing “it grows right”:
1) The panel is offset at `right-[46px]` while the right nav occupies about 58px (`w-14` + `right-[2px]`), so the wallet overlaps under nav; this makes expansion look rightward/incorrect.
2) Width switching depends on `postMessage`; if message timing/origin/layout payload is missed, iframe content can visually overflow/misalign and look like right-side growth.

Implementation plan:

1. Harden right-anchor geometry
- In `WalletDrawer.tsx`, replace `right-[46px]` with a nav-safe offset (>= 60px), e.g. `right-[60px]`.
- Add explicit `left-auto` so only right edge is constrained.
- Keep `fixed` + width transition so width changes can only move the left edge.

2. Make resize logic deterministic
- Keep listener for `wallet-layout-change`, but normalize payload:
  - accept both `layout` and `width_px`
  - map only to `{356, 516}` (clamp anything else)
- Track numeric width state (`panelWidthPx`) instead of boolean `wide` to avoid ambiguous transitions.

3. Add fail-safe behavior when message is absent
- Start at 516px until first valid layout message arrives, then obey message updates.
- This prevents embedded “wide” content from appearing to spill/right-grow when event handshake lags.

4. Preserve transparent/non-blocking behavior
- Keep no-backdrop behavior.
- Keep transparent iframe/container styling as-is.
- Maintain page scrollability behind panel.

5. Verification checklist (after implement)
- Open wallet narrow → confirm right edge stays fixed and left edge moves only.
- Trigger wide mode in iframe → confirm expansion occurs only leftward.
- Confirm no overlap under right nav icons.
- Confirm background page remains scrollable while wallet is open.
- Confirm transparent surround remains transparent.

Technical details:
- Files to update: `src/components/navigation/drawers/WalletDrawer.tsx` only.
- Expected class/state pattern:
  - position: `fixed top-0 right-[60px] left-auto ...`
  - width class/style driven by normalized `panelWidthPx` (356/516)
  - transition on width retained.
