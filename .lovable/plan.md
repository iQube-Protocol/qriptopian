

## Problem Diagnosis

The Home screen hero sections have two rendering bugs:

1. **Tablet portrait (820px)**: The hero image appears duplicated. The Embla carousel's internal flex container doesn't properly constrain `CarouselItem` children to the declared height. The `h-[calc(100svh-64px)]` is applied to multiple nested elements (`Carousel`, `CarouselContent`, `CarouselItem`), but Embla's flex layout overrides height constraints, causing items to overflow and the background-image to tile/repeat visually.

2. **Mobile (390px)**: Similar overflow issue -- the title, excerpt, dots, and smart action icons extend beyond the hero image boundary, pushing content below and making the layout appear broken.

The **reference** (Kn0wdZ drawer screenshot) shows the correct pattern: a single full-viewport portrait image with title/excerpt overlaid at the bottom-left, smart action icon at top-right, all contained within a single viewport-height container. The Latest News carousel should appear below, accessed by scrolling down.

## Root Cause

Both `DynamicHeroSection` and `DynamicSecondHeroSection` use the same flawed pattern:
- `background-image` on an `absolute inset-0` div inside each `CarouselItem`
- `heroHeight` class applied redundantly to `Carousel`, `CarouselContent`, AND `CarouselItem`
- Embla's flex container for `CarouselContent` doesn't respect `height` constraints -- it sizes to content, causing overflow
- No `overflow-hidden` on the constraining container

## Plan

### 1. Fix `DynamicHeroSection.tsx`

**Constrain the outer wrapper**:
- Add `overflow-hidden` to the outermost `div` that declares `heroHeight`
- Remove redundant `heroHeight` from `CarouselContent` (Embla manages this internally)
- Ensure `CarouselItem` uses `min-h-0` + `h-full` instead of the explicit calc height to work with Embla's flex model
- Alternatively, simplify: set `h-full` on `Carousel`, `CarouselContent`, and `CarouselItem`, and let the outer container's fixed height be the single source of truth with `overflow-hidden`

**Specific changes** (lines 87-94):
- Outer div: add `overflow-hidden`
- `Carousel` className: change from `heroHeight` to `h-full`
- `CarouselContent` className: change from `heroHeight` to `h-full`
- `CarouselItem` className: change from `heroHeight` to `h-full`

### 2. Fix `DynamicSecondHeroSection.tsx`

Identical changes as above (same pattern, lines 89-96).

### 3. Fix `QriptopianHero.tsx`

The parent container uses `overflow-y-auto` which allows all three sections to stack vertically and scroll. This is correct for the desired behavior (hero fills viewport, scroll down for Latest News, scroll more for Second Hero). No changes needed here.

### Summary of Changes

| File | Change |
|------|--------|
| `DynamicHeroSection.tsx` | Add `overflow-hidden` to outer wrapper; change inner Carousel/CarouselContent/CarouselItem from explicit `heroHeight` to `h-full` |
| `DynamicSecondHeroSection.tsx` | Same fix as above |

Two files, surgical changes to CSS classes only. No structural or logic changes.

