

## Problem

The `loop` toggle in the admin ContentEditor correctly persists `modalities.watch.loop` to the database, but none of the video rendering components read or apply this flag. Every `<video>` and YouTube `<iframe>` across 7 files ignores it.

## Plan

Add the `loop` attribute to all video players across 7 files, reading from `currentModalities.watch.loop`:

### 1. `DynamicHeroSection.tsx` and `DynamicSecondHeroSection.tsx`
- On `<video>`: add `loop={currentModalities.watch.loop || false}`
- On YouTube `<iframe>`: append `&loop=1` to embed URL when `currentModalities.watch.loop` is true

### 2. `DynamicLatestNewsCarousel.tsx`
- Need to read `loop` from the article's modalities and apply to `<video>` element
- For YouTube embeds (if present), append `&loop=1`

### 3. Drawer players: `Kn0wdZDrawer.tsx`, `PennyDropsDrawer.tsx`, `StayBullDrawer.tsx`, `KnytRiseDrawer.tsx`
- Same pattern: read `modalities.watch.loop` and apply `loop` attribute to `<video>`, `&loop=1` to YouTube iframe URLs

### 4. `videoUtils.ts`
- Update `getYouTubeEmbedUrl` to accept an optional `loop` parameter and append `?loop=1` when true

All changes are purely additive -- adding one boolean prop to existing `<video>` tags and one query param to YouTube URLs.

