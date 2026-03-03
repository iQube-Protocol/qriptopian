

## Problem

The container uses `right-[46px]` which fixes its **right** edge. When CSS applies `w-[22.25rem]`, the element is anchored at the right and expands leftward — correct. But the issue is that the **iframe content itself** (the wallet embed) switches to its wide layout internally, and the container stays at `w-[22.25rem]` (356px). The wallet's wide content (516px) overflows or renders partially hidden behind the nav bar.

The container width needs to dynamically match the wallet's current mode. Since the wallet switches between narrow/wide internally within the iframe, we need to:

1. **Listen for a `postMessage`** from the wallet iframe indicating its current width/mode
2. **Toggle the container width** between `22.25rem` (narrow) and `32.25rem` (wide) accordingly

However, the positioning with `right-[46px]` already anchors the right edge — so when width increases, it **should** expand left. This is correct CSS behavior. The fact that it's expanding right instead suggests the wallet embed might be using a different mechanism, or perhaps the `right-[46px]` isn't actually being applied on desktop.

Wait — re-reading the code: `right-[46px]` is applied unconditionally (no `md:` prefix), and `w-full` on mobile would fill the screen. On desktop `md:w-[22.25rem]` kicks in. With `right` fixed, increasing width expands left. This should work.

The real issue: **the container width is fixed at 22.25rem and doesn't grow to 32.25rem when the wallet goes wide**. The wallet content overflows to the right (behind the nav bar) because the container clips it.

## Plan

1. **Add state for wallet width mode** — default to narrow (`22.25rem`), switch to wide (`32.25rem`) when the wallet iframe sends a resize message.

2. **Add a `postMessage` listener** in `WalletDrawer` that listens for messages from the wallet iframe indicating width change. If the wallet doesn't send such messages, we can alternatively just set the container to the wide width (`32.25rem`) and let the narrow wallet center/align within it.

3. **Simpler alternative**: Just use `md:w-[32.25rem]` (the wide size) as the fixed width. The narrow wallet (356px) will render fine inside a 516px container — there may be some extra space, but the right edge stays flush and wide mode won't overflow.

**Recommended approach**: Use the wide width `md:w-[32.25rem]` as the container size so both modes render correctly without overflow. If the user wants the container to shrink-wrap to the narrow wallet, we'd need iframe-to-parent messaging which depends on the wallet embed supporting `postMessage`.

