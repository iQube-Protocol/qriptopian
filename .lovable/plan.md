

## Root Cause

The shadcn `carousel.tsx` component applies default gap classes:
- `CarouselContent` (line 144): `-ml-4` (negative left margin)
- `CarouselItem` (line 162): `pl-4` (left padding)

This creates a 16px spacing pattern designed for multi-card carousels. In the full-viewport hero, it means each slide is offset 16px, and a sliver of the adjacent slide is visible on the right edge. This affects ALL slides, but it's only visually noticeable on slides where the adjacent slide has a contrasting color (e.g., the reddish image next to the dark metaKnyts image).

## Plan

**File: `src/components/content/DynamicHeroSection.tsx`**

Override the default Embla gap classes on the hero carousel by passing custom classNames that zero out the margin/padding:

1. On `<CarouselContent>`, add `-ml-0` to override the default `-ml-4`
2. On `<CarouselItem>`, add `pl-0` to override the default `pl-4`

This is a two-class addition — no structural changes needed.

**File: `src/components/content/DynamicSecondHeroSection.tsx`**

Apply the same `pl-0` / `-ml-0` overrides if the second hero also uses the Carousel component. *(Need to verify — if it doesn't use Carousel, no change needed.)*

