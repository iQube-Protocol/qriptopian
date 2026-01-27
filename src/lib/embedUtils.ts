// src/lib/embedUtils.ts
// Centralized embed URL utilities with multi-base fallback support

/**
 * Safely append query parameters to a URL, handling existing query strings
 */
export function withQuery(
  url: string,
  params: Record<string, string | number | boolean>
): string {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, String(value));
  });
  return urlObj.toString();
}

/**
 * Add a cache-busting timestamp to a URL
 */
export function withCacheBust(url: string): string {
  return withQuery(url, { _t: Date.now() });
}

/**
 * Build a complete embed URL with version and cache bust
 */
export function buildEmbedUrl(
  baseUrl: string,
  path: string,
  params: Record<string, string | number | boolean> = {},
  version?: string
): string {
  const fullUrl = `${baseUrl}${path}`;
  const allParams: Record<string, string | number | boolean> = {
    ...params,
    _t: Date.now(),
  };
  if (version) {
    allParams.v = version;
  }
  return withQuery(fullUrl, allParams);
}

// Storage key for last known good base
const LAST_GOOD_BASE_KEY = 'triad_embed_last_good_base';

/**
 * Get the last known good embed base from localStorage
 */
export function getLastGoodBase(): string | null {
  try {
    return localStorage.getItem(LAST_GOOD_BASE_KEY);
  } catch {
    return null;
  }
}

/**
 * Store the last known good embed base
 */
export function setLastGoodBase(base: string): void {
  try {
    localStorage.setItem(LAST_GOOD_BASE_KEY, base);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Parse embed bases from environment variable (comma-separated)
 */
export function getEmbedBases(): string[] {
  const basesEnv = import.meta.env.VITE_TRIAD_EMBED_BASES as string | undefined;
  const singleBase = import.meta.env.VITE_TRIAD_EMBED_BASE as string | undefined;
  
  if (basesEnv) {
    return basesEnv.split(',').map(b => b.trim()).filter(Boolean);
  }
  
  if (singleBase) {
    return [singleBase];
  }
  
  // Default fallback
  return ['https://dev-beta.aigentz.me'];
}

/**
 * Get ordered list of bases to try (last good first, then others)
 */
export function getOrderedBases(): string[] {
  const bases = getEmbedBases();
  const lastGood = getLastGoodBase();
  
  if (lastGood && bases.includes(lastGood)) {
    // Move last good to front
    return [lastGood, ...bases.filter(b => b !== lastGood)];
  }
  
  return bases;
}

export interface ProbeResult {
  url: string;
  status: number;
  statusText: string;
  headers: {
    xFrameOptions: string | null;
    csp: string | null;
    contentType: string | null;
  };
  snippet: string | null;
  iframeCompatible: boolean;
  error: string | null;
}

/**
 * Call the triad-embed-probe edge function to check an embed URL
 */
export async function probeEmbedUrl(url: string): Promise<ProbeResult> {
  try {
    const response = await fetch(
      `https://bsjhfvctmduxhohtllly.supabase.co/functions/v1/triad-embed-probe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzamhmdmN0bWR1eGhvaHRsbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDgyNTgsImV4cCI6MjA3MzEyNDI1OH0.JVDp4-F6EEXqVQ8sts2Z8KQg168aZ1YdtY53RRM_s7M`,
        },
        body: JSON.stringify({ url }),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: { xFrameOptions: null, csp: null, contentType: null },
        snippet: errorText.slice(0, 200),
        iframeCompatible: false,
        error: `Probe failed: ${response.status}`,
      };
    }
    
    return await response.json();
  } catch (err) {
    return {
      url,
      status: 0,
      statusText: 'Network Error',
      headers: { xFrameOptions: null, csp: null, contentType: null },
      snippet: null,
      iframeCompatible: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Find a working embed base by probing each in order
 */
export async function findWorkingBase(
  path: string,
  params: Record<string, string | number | boolean> = {}
): Promise<{ base: string; url: string; result: ProbeResult } | null> {
  const bases = getOrderedBases();
  
  for (const base of bases) {
    const url = buildEmbedUrl(base, path, params);
    const result = await probeEmbedUrl(url);
    
    if (result.status === 200) {
      setLastGoodBase(base);
      return { base, url, result };
    }
  }
  
  // Return the first base's result even if failed (for diagnostics)
  if (bases.length > 0) {
    const url = buildEmbedUrl(bases[0], path, params);
    const result = await probeEmbedUrl(url);
    return { base: bases[0], url, result };
  }
  
  return null;
}
