// src/config/embed.ts
// Centralized embed configuration for SmartTriad panels

const DEFAULT_TRIAD_EMBED_BASE = "https://theqriptopian.netlify.app";
// TODO: Update default to AigentiQ host when ready

export const TRIAD_EMBED_BASE =
  import.meta.env.VITE_TRIAD_EMBED_BASE || DEFAULT_TRIAD_EMBED_BASE;

export const WALLET_EMBED_URL = `${TRIAD_EMBED_BASE}/triad/embed/wallet`;
export const CODEX_EMBED_URL = `${TRIAD_EMBED_BASE}/triad/embed/codex?tab=scrolls`;
export const ADMIN_CODEX_EMBED_URL = `${TRIAD_EMBED_BASE}/triad/admin/codex`;
