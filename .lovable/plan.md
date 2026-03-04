
I hear you. We’ll force a deterministic right-anchored layout so the wallet can only grow leftward on desktop.

## What’s actually going wrong
From current code in `WalletDrawer.tsx`, the same element mixes:
- `w-full`
- `md:w-[22.25rem]` / `md:w-[32.25rem]`
- `max-w-[calc(100vw-60px)]`
- animated `transition-[width]`

Even though `right-[46px]` is set, mixing full-width + breakpoint widths on the animated element can create perceived right-edge drift/jank during transitions.

You also confirmed: keep animation.

## Implementation plan
1. **Split drawer into two layers (critical fix)**
   - **Outer shell**: fixed position and fixed-right anchor only (never animates width).
   - **Inner panel**: right-aligned inside shell and this is the only element whose width animates.
   - Result: right edge is mathematically locked; only left edge moves.

2. **Desktop-only animated widths**
   - Inner panel width classes:
     - narrow: `md:w-[22.25rem]`
     - wide: `md:w-[32.25rem]`
   - Add `origin-right` and keep `transition-[width] duration-300 ease-out`.

3. **Remove conflicting width behavior from animated element**
   - Remove `w-full` from the animated desktop panel.
   - Keep mobile behavior explicit on shell/panel so desktop rules are isolated.

4. **Keep message-driven state only**
   - Preserve current `wallet-layout-change` listener.
   - No auto-forcing width; only postMessage changes `isWide`.

5. **Hard guard against rightward movement**
   - Use `absolute right-0 top-0 h-full` for the animated inner panel.
   - Keep shell at `right-[46px]` and desktop max width equal to wide panel width (or viewport cap), so the right edge can’t shift.

## Technical details (exact structure)
Target structure in `src/components/navigation/drawers/WalletDrawer.tsx`:
- Outer shell (fixed anchor):
  - `fixed top-[88px] right-[46px] z-50 h-[calc(100vh-100px)] md:w-[32.25rem] max-w-[calc(100vw-60px)]`
- Inner animated panel (right-aligned):
  - `absolute right-0 top-0 h-full`
  - `md:transition-[width] md:duration-300 md:ease-out origin-right`
  - `md:w-[22.25rem]` or `md:w-[32.25rem]` from `isWide`
- Move border/shadow/rounded/overflow classes to inner panel (visual box that resizes).

This guarantees desktop expansion is always leftward.

## Validation checklist
1. Open SmartWallet on desktop:
   - Right edge stays flush at the same x-position.
   - Narrow opens without drifting right.
2. Trigger wallet wide mode:
   - Width animates smoothly; only left edge moves.
3. Toggle narrow/wide repeatedly:
   - No right-edge movement, no clipping behind icon rail.
4. Reopen drawer:
   - Starts in narrow (your required default), then only changes when iframe sends layout event.
