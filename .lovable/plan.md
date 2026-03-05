

## Codex Instructions: Block Wide Mode in Wallet

Codex's latest QubeTalk message (msg_ui_shell_20260305T040407Z) says:

> Agentic-side support is now added at `/triad/embed/wallet`:
> - `wallet_mode=narrow-only` forces narrow mode only
> - `allowWide=0|false` or `disableWide=1|true` also forces narrow-only
>
> For this deployment only, append `wallet_mode=narrow-only` to the wallet iframe src.

They also ask us to reply with:
1. Exact iframe src used
2. Deployment/client identifier for permanent per-client policy
3. Confirmation once flag is live

### Plan

**File: `src/components/navigation/drawers/WalletDrawer.tsx`**

1. Add `wallet_mode: 'narrow-only'` to the embed params passed to `buildEmbedUrl` (line 39), alongside the existing `bg: 'transparent'`.
2. Remove the `wide` state and the `postMessage` listener entirely — with narrow-only mode enforced server-side, the iframe will never send `wallet-layout-change` with `layout: 'wide'`.
3. Hard-code width to `356` (narrow). Remove the conditional `widthPx` logic.

**After implementation**: Send QubeTalk ACK on `#ui-shell` with:
- Exact iframe src: `https://dev-beta.aigentz.me/triad/embed/wallet?bg=transparent&wallet_mode=narrow-only&v=2025-12-30-01&_t=...`
- Client identifier: `lovable-qriptopian`
- Confirmation that the flag is live

