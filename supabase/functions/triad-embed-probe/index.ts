// supabase/functions/triad-embed-probe/index.ts
// Server-side probe to check embed URL status without CORS restrictions

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Allowed URL patterns (SSRF protection)
const ALLOWED_PATTERNS = [
  /^https:\/\/dev-beta\.aigentz\.me\/triad\/embed\//,
  /^https:\/\/aa\.dev-beta\.aigentz\.me\/triad\/embed\//,
  /^https:\/\/aigentzbeta-production\.up\.railway\.app\/triad\/embed\//,
  /^https:\/\/aigentz\.me\/triad\/embed\//,
  /^https:\/\/[a-z0-9-]+\.aigentz\.me\/triad\/embed\//,
];

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Must be HTTPS
    if (parsed.protocol !== 'https:') return false;
    // Must not have credentials
    if (parsed.username || parsed.password) return false;
    // Check against allowed patterns
    return ALLOWED_PATTERNS.some(pattern => pattern.test(url));
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid "url" parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SSRF protection
    if (!isAllowedUrl(url)) {
      return new Response(
        JSON.stringify({ error: 'URL not in allowed list', url }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Probing URL: ${url}`);

    // Perform the probe request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'TriadEmbedProbe/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Fetch failed';
      console.error(`Fetch error: ${errorMessage}`);
      
      return new Response(
        JSON.stringify({
          url,
          status: 0,
          statusText: 'Network Error',
          headers: {
            xFrameOptions: null,
            csp: null,
            contentType: null,
          },
          snippet: null,
          iframeCompatible: false,
          error: errorMessage,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    clearTimeout(timeoutId);

    // Extract relevant headers
    const xFrameOptions = response.headers.get('X-Frame-Options');
    const csp = response.headers.get('Content-Security-Policy');
    const contentType = response.headers.get('Content-Type');

    // Check iframe compatibility
    let iframeCompatible = true;
    if (xFrameOptions) {
      const xfo = xFrameOptions.toLowerCase();
      if (xfo === 'deny' || xfo === 'sameorigin') {
        iframeCompatible = false;
      }
    }
    if (csp) {
      const frameAncestors = csp.match(/frame-ancestors\s+([^;]+)/i);
      if (frameAncestors) {
        const ancestors = frameAncestors[1].toLowerCase().trim();
        if (ancestors === "'none'" || ancestors === "'self'") {
          iframeCompatible = false;
        }
      }
    }

    // Get response snippet for non-200 responses
    let snippet: string | null = null;
    if (response.status !== 200) {
      try {
        const text = await response.text();
        snippet = text.slice(0, 500);
      } catch {
        snippet = '[Could not read response body]';
      }
    }

    const result = {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: {
        xFrameOptions,
        csp: csp ? (csp.length > 200 ? csp.slice(0, 200) + '...' : csp) : null,
        contentType,
      },
      snippet,
      iframeCompatible: response.status === 200 && iframeCompatible,
      error: null,
    };

    console.log(`Probe result: status=${result.status}, iframeCompatible=${result.iframeCompatible}`);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Probe error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        url: null,
        status: 0,
        statusText: 'Error',
        headers: { xFrameOptions: null, csp: null, contentType: null },
        snippet: null,
        iframeCompatible: false,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
