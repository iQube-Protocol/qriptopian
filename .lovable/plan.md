

## Problem

The last edit changed `CarouselContent` and `CarouselItem` from explicit `heroHeight` (`h-[calc(100svh-64px)]`) to `h-full`. But Embla's `CarouselContent` component has an intermediate wrapper div (`<div ref={carouselRef} className="overflow-hidden">`) with no height set. This breaks the `h-full` chain, causing all carousel items to collapse to 0 height -- hence no images.

## Fix

Keep the `overflow-hidden` on the outermost container (that fixed the duplication bug), but revert `CarouselContent` and `CarouselItem` back to the explicit `heroHeight` class. This bypasses Embla's intermediate wrapper by giving each element an absolute height reference.

### Changes

**`src/components/content/DynamicHeroSection.tsx`**
- Line 94: `CarouselContent className="h-full"` → `CarouselContent className={heroHeight}`
- Line 102: `CarouselItem className="h-full relative"` → `CarouselItem className={`${heroHeight} relative`}`

**`src/components/content/DynamicSecondHeroSection.tsx`**
- Same two changes (CarouselContent and CarouselItem back to explicit `heroHeight`)

The Carousel wrapper itself can stay as `h-full` since it's a direct child of the outer fixed-height div. Only CarouselContent and CarouselItem need explicit heights because they're downstream of Embla's intermediate wrapper.

Four line changes across two files. The `overflow-hidden` on the outer container stays to prevent the original duplication bug.

