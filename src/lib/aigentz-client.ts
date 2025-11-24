/**
 * Aigent Z AA-API Client
 * 
 * Thin client for authenticating with and calling the Aigent Z Application API.
 * Implements challenge-verify authentication and provides typed helpers for AA-API routes.
 * Includes automatic fallback from custom domain to Railway direct URL.
 */

const AA_BASE_PRIMARY = import.meta.env.VITE_AIGENT_Z_AA_BASE;
const AA_BASE_FALLBACK = import.meta.env.VITE_AIGENT_Z_AA_FALLBACK;

let currentBase = AA_BASE_PRIMARY;
let hasFailedPrimary = false;

/**
 * Build a full AA-API URL with automatic fallback handling
 */
function aaUrl(path: string): string {
  if (!currentBase) {
    throw new Error('AA-API base URL not configured. Set VITE_AIGENT_Z_AA_BASE.');
  }
  const base = new URL(currentBase);
  return new URL(path, base).toString();
}

/**
 * Fetch with automatic fallback to Railway URL if custom domain fails
 */
async function fetchWithFallback(url: string, init?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, init);
    
    // If using primary and we get a network error or timeout, try fallback
    if (!response.ok && currentBase === AA_BASE_PRIMARY && !hasFailedPrimary) {
      throw new Error(`Primary URL failed with status ${response.status}`);
    }
    
    return response;
  } catch (error) {
    // If primary failed and we haven't tried fallback yet
    if (currentBase === AA_BASE_PRIMARY && !hasFailedPrimary && AA_BASE_FALLBACK) {
      console.warn('Primary AA-API URL failed, falling back to Railway direct URL', error);
      hasFailedPrimary = true;
      currentBase = AA_BASE_FALLBACK;
      
      // Rebuild URL with fallback base and retry
      const path = url.replace(AA_BASE_PRIMARY, '');
      const fallbackUrl = aaUrl(path);
      return fetch(fallbackUrl, init);
    }
    
    throw error;
  }
}

export interface AigentZClientOptions {
  did: string;
  signNonce: (nonce: string) => Promise<string> | string;
}

export interface AuthTokens {
  aa_token: string;
  tenant_id: string;
}

export class AigentZClient {
  private did: string;
  private signNonce: (nonce: string) => Promise<string>;
  private aaToken: string | null = null;
  private tenantId: string | null = null;

  constructor(opts: AigentZClientOptions) {
    this.did = opts.did;
    this.signNonce = async (nonce) => Promise.resolve(opts.signNonce(nonce));
  }

  /**
   * Authenticate with AA-API using challenge-verify flow
   */
  async authenticate(): Promise<AuthTokens> {
    // Step 1: Get challenge nonce
    const challengeRes = await fetchWithFallback(aaUrl('auth/challenge'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did: this.did }),
    });

    if (!challengeRes.ok) {
      const errorText = await challengeRes.text();
      throw new Error(`AA-API challenge failed: ${challengeRes.status} ${errorText}`);
    }

    const { nonce } = await challengeRes.json();

    // Step 2: Sign the nonce
    const signature = await this.signNonce(nonce);

    // Step 3: Verify signature and get token
    const verifyRes = await fetchWithFallback(aaUrl('auth/verify'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did: this.did, signature }),
    });

    if (!verifyRes.ok) {
      const errorText = await verifyRes.text();
      throw new Error(`AA-API verify failed: ${verifyRes.status} ${errorText}`);
    }

    const { aa_token, tenant_id } = await verifyRes.json();
    this.aaToken = aa_token;
    this.tenantId = tenant_id;

    return { aa_token, tenant_id };
  }

  /**
   * Get the current aa_token, authenticating if needed
   */
  async getToken(): Promise<string> {
    if (this.aaToken) return this.aaToken;
    const { aa_token } = await this.authenticate();
    return aa_token;
  }

  /**
   * Make an authenticated request to AA-API
   */
  async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${token}`,
    };
    return fetchWithFallback(aaUrl(path), { ...init, headers });
  }

  /**
   * Transfer Q¢ between agents
   */
  async transferQct(params: {
    fromAgentId: string;
    toAgentId: string;
    amountQct: number;
  }): Promise<Response> {
    return this.fetch('payments/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }

  /**
   * Check entitlement for an asset
   */
  async checkEntitlement(params: {
    assetId: string;
    action: string;
    holderDid?: string;
  }): Promise<Response> {
    return this.fetch('entitlements/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }

  /**
   * Register a new asset
   */
  async registerAsset(asset: {
    ownerDid: string;
    storageUri: string;
    title?: string;
    description?: string;
    mediaKind?: string;
    tags?: string[];
  }): Promise<Response> {
    return this.fetch('assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
  }

  /**
   * Query assets
   */
  async queryAssets(filters?: {
    ownerDid?: string;
    tags?: string[];
    status?: string;
  }): Promise<Response> {
    const params = new URLSearchParams();
    if (filters?.ownerDid) params.append('ownerDid', filters.ownerDid);
    if (filters?.tags) params.append('tags', filters.tags.join(','));
    if (filters?.status) params.append('status', filters.status);
    
    const queryString = params.toString();
    const path = queryString ? `assets?${queryString}` : 'assets';
    
    return this.fetch(path, { method: 'GET' });
  }

  /**
   * Get current tenant ID
   */
  getTenantId(): string | null {
    return this.tenantId;
  }

  /**
   * Clear cached authentication
   */
  clearAuth(): void {
    this.aaToken = null;
    this.tenantId = null;
  }
}

/**
 * Get the current active AA-API base URL (primary or fallback)
 */
export function getCurrentAABase(): string {
  return currentBase;
}

/**
 * Check if we're using the fallback URL
 */
export function isUsingFallback(): boolean {
  return hasFailedPrimary && currentBase === AA_BASE_FALLBACK;
}
