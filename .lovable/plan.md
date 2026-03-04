
You’re right to be frustrated. Here is the plain reason it still looks wrong:

1) Host shell and iframe runtime are changing layout asynchronously  
- The drawer width is controlled by React state in the host app.  
- The wallet mode is controlled inside the iframe and reported later via `postMessage`.  
- That creates a race on open: host renders narrow first, then receives a mode update and animates, which can look like “opening the wrong way.”

2) The current CSS still mixes competing width rules on the animated element  
- Inner panel has `w-full` plus `md:w[...]` variants.  
- Depending on timing/breakpoint evaluation, the browser can compute a full-width baseline before the md width takes over, so the first transition is visually janky.

3) Message handling is too broad  
- Wallet listener accepts any `wallet-layout-change` without strict origin/source checks.  
- Extra or duplicate messages during iframe boot can retrigger width transitions and make motion appear inconsistent.

Why this is “harder than simple”  
- It’s not one static div animation; it’s cross-context synchronization (parent React + remote iframe + responsive CSS breakpoint logic) during initial mount.

What I would implement next (deterministic fix)
- Make width single-source-of-truth with explicit pixel styles for desktop (`356px`/`516px`) instead of mixed utility classes on the animated node.  
- Remove `w-full` from desktop animated panel entirely.  
- Keep right edge hard-locked (`absolute right-0`) and animate only `width`.  
- Gate first layout update: apply first iframe mode without animation, animate only subsequent user-driven mode changes.  
- Strictly validate `postMessage` by both allowed origin and `event.source === iframe.contentWindow`.

Expected result
- No rightward “pop” on open.  
- First render stable in narrow mode.  
- Wide/narrow transitions animate leftward only, every time.
