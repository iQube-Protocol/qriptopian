

## Problem

Looking at the screenshots and code, the issue is clear: the container is anchored by its **left** edge (default for `fixed` elements with only `right` set), so when width increases, it grows **rightward** (toward the nav bar) instead of leftward (into the content area). The `right-[46px]` positions the right edge, but CSS `width` expansion on a `right`-anchored element should expand left — except the current code doesn't behave that way because the `right` property positions the right edge while width grows from the left edge of the element.

Actually, re-reading: with `fixed` + `right-[46px]` + no `left`, the element IS right-anchored — the right edge stays 46px from the viewport right. Width changes SHOULD expand leftward. But the screenshots show the opposite.

Wait — looking more carefully at the screenshots: the first shows narrow mode (Copilot tab visible, content fits ~356px). The second shows expanded mode (MoneyPenny tab, content wider) but the LEFT edge hasn't moved — meaning the panel expanded to the RIGHT, pushing content behind the nav bar.

The issue: `right-[46px]` keeps the right edge 46px from viewport right. The nav sidebar (`QriptopianNav`) is `w-14` (56px) positioned at `right-[2px]`. So `right-[46px]` puts the wallet panel's right edge partially under the nav. When width grows, it grows LEFT — which is correct. But the screenshots suggest otherwise.

Let me reconsider: maybe the `right-[46px]` value is wrong. The nav is 56px wide at `right-[2px]`, so the nav occupies roughly 2px to 58px from the right edge. The wallet should sit to the LEFT of the nav, meaning `right` should be at least 58px. With `right-[46px]`, the wallet's right edge is only 46px in — meaning it overlaps the nav by ~12px.

But more importantly — the real problem from the screenshots is that the iframe CONTENT is expanding but the container isn't tracking it. The `wallet-layout-change` postMessage may never fire from the iframe (it's an external embed at dev-beta.aigentz.me). The `ResizeObserver` fallback observes the container div itself, not the iframe content (cross-origin iframes don't expose scrollWidth). So `wide` stays `false` and the container stays at 356px while the iframe content overflows or gets clipped.

From screenshot 2: the panel appears wider on the RIGHT side but the LEFT edge didn't move. This means the container IS staying at 356px but the iframe content is rendering wider and overflowing to the right (despite `overflow-hidden`). Or the iframe itself is wider than the container.

**Root cause**: Neither detection mechanism works reliably:
1. `wallet-layout-change` postMessage — requires the iframe app to send it (may not be implemented)
2. `ResizeObserver` on the container — observes the container, not the cross-origin iframe content

The fix should be simpler: since we know the two fixed widths (356px narrow, 516px wide), and the iframe app switches between them, we should detect the switch differently. But without a reliable signal from the iframe, we can't.

**Practical fix**: The immediate visual problem is that when the container doesn't resize, iframe content bleeds to the right. We need to ensure `overflow-hidden` actually clips, AND that the right anchor works correctly so expansion goes LEFT.

Let me verify the CSS behavior: `position: fixed; right: 46px; width: 356px` — this means:
- Right edge at 46px from viewport right
- Left edge at `viewport_width - 46 - 356` from viewport left
- When width changes to 516px: left edge moves to `viewport_width - 46 - 516`

So width expansion DOES go left. The right edge stays fixed. This is correct behavior.

The real issue from the screenshots must be that `wide` never becomes `true`, so the container stays 356px while the iframe content wants 516px. The content overflows or the iframe scrollbar appears.

**Plan**: Since the postMessage approach is unreliable (the iframe may not send `wallet-layout-change`), and ResizeObserver can't observe cross-origin iframe internals, we should simply **default to the wider width (516px)** and let the iframe content sit comfortably within it. The narrow wallet content will just have some padding, which is fine. This eliminates the entire resize detection problem.

Alternatively, we could set the container to a width that accommodates both modes and let the iframe content determine its own width within that space.

## Changes

**File: `src/components/navigation/drawers/WalletDrawer.tsx`**

1. Remove the `wide` state, `ResizeObserver` callback, and `postMessage` listener — they don't work reliably since the iframe doesn't send `wallet-layout-change`.
2. Set the container to a fixed width of **516px** (the wider mode) so it always accommodates both narrow and wide iframe content.
3. The iframe content will naturally render at its own width within the 516px container.

This is the simplest, most reliable fix. The narrow wallet view (356px content) will have ~160px of empty space on the left, but this is far better than broken overflow behavior.

