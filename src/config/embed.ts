// src/config/embed.ts
// Centralized embed configuration for SmartTriad panels

const DEFAULT_TRIAD_EMBED_BASE = "https://dev-beta.aigentz.me";

// Allow override from env, but fall back to the AigentiQ host
export const TRIAD_EMBED_BASE =
  import.meta.env.VITE_TRIAD_EMBED_BASE || DEFAULT_TRIAD_EMBED_BASE;

// 🔑 bump this when you change Codex templates in AigentiQ
export const TRIAD_EMBED_VERSION = "2025-12-30-01";

export const WALLET_EMBED_URL =
  `${TRIAD_EMBED_BASE}/triad/embed/wallet?v=${TRIAD_EMBED_VERSION}`;

export const CODEX_EMBED_URL =
  `${TRIAD_EMBED_BASE}/triad/embed/codex` +
  `?tab=scrolls&theme=light&density=wide&v=${TRIAD_EMBED_VERSION}`;

export const ADMIN_CODEX_EMBED_URL =
  `${TRIAD_EMBED_BASE}/triad/embed/admin/codex?v=${TRIAD_EMBED_VERSION}`;

// Sanity check - log URLs in dev
if (import.meta.env.DEV) {
  console.log("TRIAD_EMBED_BASE", TRIAD_EMBED_BASE);
  console.log("CODEX_EMBED_URL", CODEX_EMBED_URL);
}
