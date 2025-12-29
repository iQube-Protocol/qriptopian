// src/config/embed.ts
// Centralized embed configuration for SmartTriad panels

const DEFAULT_TRIAD_EMBED_BASE = "https://dev-beta.aigentz.me";

// Get env value and validate - reject any netlify.app URLs
const envBase = import.meta.env.VITE_TRIAD_EMBED_BASE;
const isNetlifyUrl = envBase && /\.netlify\.app/i.test(envBase);

// Use env value only if it's set AND not a Netlify URL
export const TRIAD_EMBED_BASE = (envBase && !isNetlifyUrl) 
  ? envBase 
  : DEFAULT_TRIAD_EMBED_BASE;

// Log warning in dev if Netlify URL was rejected
if (import.meta.env.DEV && isNetlifyUrl) {
  console.warn(
    `[embed.ts] Ignoring VITE_TRIAD_EMBED_BASE="${envBase}" (Netlify URLs not allowed). Using default: ${DEFAULT_TRIAD_EMBED_BASE}`
  );
}

export const WALLET_EMBED_URL = `${TRIAD_EMBED_BASE}/triad/embed/wallet`;
export const CODEX_EMBED_URL = `${TRIAD_EMBED_BASE}/triad/embed/codex?tab=scrolls`;
export const ADMIN_CODEX_EMBED_URL = `${TRIAD_EMBED_BASE}/triad/embed/admin/codex`;
