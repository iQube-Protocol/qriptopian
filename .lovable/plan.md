

## Problem

In the desktop Scrolls drawer, each article card renders smart action icons **twice**:

1. **Inside `Kn0w1Viewer`** (line 330-342) -- the `smartActions` prop is passed, and `Kn0w1Viewer` renders icons in its top-right corner (persistent)
2. **Outside `Kn0w1Viewer`** (lines 344-370) -- a second set of icons is rendered as a hover overlay (`opacity-0 group-hover:opacity-100`) on top of the same card

These are both calling the same `getSmartActions()` function, producing identical icon sets -- one always visible, one appearing on hover.

## Fix

**Remove the duplicate hover overlay** (lines 344-370 in `KnytRiseDrawer.tsx`). The `Kn0w1Viewer` component already correctly renders the smart action icons via its `smartActions` prop. The overlay block is redundant legacy code that was left behind when the `smartActions` prop was added to `Kn0w1Viewer`.

### Single change

In `src/components/navigation/drawers/KnytRiseDrawer.tsx`, remove the `{/* Modality Buttons Overlay */}` block (lines 344-370) that wraps the second set of icons inside each `CarouselItem`. The `<Kn0w1Viewer>` call at line 330 with `smartActions={...}` already handles this correctly.

No other files need changes. The mobile hero and thumbnail sections each have only one set of icons and are not affected.

