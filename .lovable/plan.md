

## Analysis

The current `heroHeight` in both `DynamicHeroSection.tsx` and `DynamicSecondHeroSection.tsx` is:

```
h-[calc(100dvh-64px)] md:h-[calc(100vh-88px)]
```

The `md:` breakpoint (768px+) covers tablets, but uses `100vh` which is the static viewport height. When a tablet browser in portrait mode hides its toolbar, the hero won't expand to fill the newly available space — same issue that was just fixed for mobile with `dvh`.

## Plan

### Changes

**`src/components/content/DynamicHeroSection.tsx`** (line 57)
- Change `md:h-[calc(100vh-88px)]` → `md:h-[calc(100dvh-88px)]`

**`src/components/content/DynamicSecondHeroSection.tsx`** (line 59)
- Same change: `md:h-[calc(100vh-88px)]` → `md:h-[calc(100dvh-88px)]`

Two single-character changes (`vh` → `dvh`) across two files. This makes the tablet portrait hero sections dynamically expand when the browser chrome retracts, matching the mobile behavior.

