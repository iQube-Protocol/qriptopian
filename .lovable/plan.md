
Root cause (why you still see double images on tablet portrait)
- The duplication is coming from CSS background tiling, not from Embla rendering two slides.
- In both hero components, the image layer uses:
  - `bg-cover bg-center` (base)
  - `md:bg-[length:var(--scale)] md:bg-[position:var(--x)_var(--y)]` (tablet+ override)
- At `md` breakpoint (768px+, includes tablet portrait), `md:bg-[length:var(--scale)]` overrides `bg-cover`.
- With `imageScale` around 100–120%, that becomes a width-driven background size on a tall portrait viewport, so one tile doesn’t fill the full height.
- Since `background-repeat` is not disabled in these hero layers, the browser repeats the background image vertically, which looks like “double images”.
- Recent `dvh` updates made the hero taller on toolbar hide, which makes this repetition even more visible.

Implementation plan
1) Replace background-image div rendering with object-cover image rendering in both dynamic hero sections
- Files:
  - `src/components/content/DynamicHeroSection.tsx`
  - `src/components/content/DynamicSecondHeroSection.tsx`
- Replace the current absolute background `<div>` (with `md:bg-[length:var(--scale)]`) with an absolute `<img>`.
- Use:
  - `className="absolute inset-0 w-full h-full object-cover"`
  - `style={{ objectPosition: \`${imageX}% ${imageY}%\`, transform: \`scale(${imageScale / 100})\`, transformOrigin: \`${imageX}% ${imageY}%\` }}`
- Keep existing gradient overlay and text/action layers unchanged.
- This preserves:
  - full-bleed behavior (`object-cover`)
  - admin X/Y focus controls (`objectPosition`)
  - zoom behavior (`scale` transform)
- This removes background tiling entirely because we’re no longer relying on repeating CSS backgrounds.

2) Keep existing height-chain and overflow fixes exactly as-is
- Do not change:
  - `heroHeight` (`h-[calc(100dvh-64px)] md:h-[calc(100dvh-88px)]`)
  - explicit `CarouselContent` and `CarouselItem` hero-height classes
  - outer `overflow-hidden`
- Those fixes address previous collapse/bleed issues and should remain intact.

3) Align admin “Live Preview” with runtime behavior (recommended)
- File:
  - `src/pages/admin/content/ContentEditor.tsx`
- Update the preview card image rendering to use the same `object-cover + objectPosition + transform: scale(...)` pattern.
- Reason: prevents editor/view mismatch, so admins won’t think an image looks right in editor but tiles/crops differently on site.

4) Verification checklist
- Tablet portrait (`md`): confirm no duplicated/stacked image tiles in:
  - top hero
  - second hero
- Test with toolbar visible and hidden (dynamic viewport change).
- Confirm desktop landscape and mobile still render full-bleed with no regression.
- Confirm carousel slide navigation still works and no clipping artifacts appear.
- Confirm image focus controls (`imageX`, `imageY`) still shift focal point as expected.

Technical details
- Current problematic classes:
  - `md:bg-[length:var(--scale)]` + no explicit `background-repeat: no-repeat`
- Why this is fragile:
  - width-based background scaling on portrait aspect ratios leaves uncovered vertical area
  - uncovered area gets filled by repeated tiles by default
- Why `<img object-cover>` is safer:
  - `object-cover` is purpose-built for full-bleed media fitting across changing aspect ratios
  - no background-repeat behavior involved
  - transform zoom + object-position gives equivalent editorial control without tiling side effects

Expected outcome after implementation
- No more “double image” effect on tablet portrait in either hero section.
- Hero and second hero remain full-screen beneath header as toolbars expand/collapse.
- Existing carousel and overlay behavior remains unchanged.
