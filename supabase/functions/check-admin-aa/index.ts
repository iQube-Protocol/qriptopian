import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AA-API configuration
const AA_BASE_PRIMARY = 'https://aa.dev-beta.aigentz.me/aa/v1';
const AA_BASE_FALLBACK = 'https://aigentzbeta-production.up.railway.app/aa/v1';

interface AuthTokens {
  aa_token: string;
  tenant_id: string;
}

// Authenticate with AA-API
async function authenticateWithAAAPI(did: string): Promise<AuthTokens | null> {
  try {
    // Step 1: Get challenge nonce
    const challengeRes = await fetch(`${AA_BASE_PRIMARY}/auth/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did }),
    }).catch(() =>
      fetch(`${AA_BASE_FALLBACK}/auth/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did }),
      })
    );

    if (!challengeRes.ok) {
      console.error('[check-admin-aa] Challenge failed:', await challengeRes.text());
      return null;
    }

    const { nonce } = await challengeRes.json();

    // Step 2: Verify with signature (Phase 1: any signature accepted)
    const verifyRes = await fetch(`${AA_BASE_PRIMARY}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did, signature: nonce }), // Phase 1: stub signature
    }).catch(() =>
      fetch(`${AA_BASE_FALLBACK}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did, signature: nonce }),
      })
    );

    if (!verifyRes.ok) {
      console.error('[check-admin-aa] Verify failed:', await verifyRes.text());
      return null;
    }

    const tokens = await verifyRes.json();
    return tokens;
  } catch (error) {
    console.error('[check-admin-aa] AA-API authentication error:', error);
    return null;
  }
}

// Check admin status via AA-API entitlements
async function checkAdminViaAAAPI(aaToken: string): Promise<boolean> {
  try {
    // For Phase 1: Simple token validation means admin
    // In future phases, check specific entitlements
    return aaToken ? true : false;
    
    /* Phase 2+ implementation:
    const entitlementRes = await fetch(`${AA_BASE_PRIMARY}/entitlements/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aaToken}`,
      },
      body: JSON.stringify({
        assetId: 'admin-console',
        action: 'access',
      }),
    });

    if (!entitlementRes.ok) return false;
    const { allowed } = await entitlementRes.json();
    return allowed;
    */
  } catch (error) {
    console.error('[check-admin-aa] Entitlement check error:', error);
    return false;
  }
}

// Legacy admin check via user_roles
async function checkAdminLegacy(supabaseAdmin: any, userId: string): Promise<boolean> {
  try {
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select(`
        role_id,
        roles!inner(
          name,
          tenant_id,
          tenants!inner(
            name
          )
        )
      `)
      .eq('user_id', userId)
      .eq('roles.name', 'admin')
      .eq('roles.tenants.name', 'default')
      .maybeSingle();

    if (roleError) {
      console.error('[check-admin-aa] Legacy check error:', roleError);
      return false;
    }

    return roleData !== null;
  } catch (error) {
    console.error('[check-admin-aa] Legacy check error:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.log('[check-admin-aa] No authorization header');
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.log('[check-admin-aa] Failed to get user:', userError);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('[check-admin-aa] Checking admin status for user:', user.id);

    // Look up user's DID mapping
    const { data: didMapping, error: didError } = await supabaseAdmin
      .from('user_did_mapping')
      .select('did, verified_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (didError && didError.code !== 'PGRST116') {
      console.error('[check-admin-aa] DID mapping lookup error:', didError);
    }

    // If user has a DID, try AA-API authentication
    if (didMapping?.did) {
      console.log('[check-admin-aa] Found DID:', didMapping.did, '- attempting AA-API auth');
      
      const tokens = await authenticateWithAAAPI(didMapping.did);
      
      if (tokens?.aa_token) {
        const isAdminViaAAAPI = await checkAdminViaAAAPI(tokens.aa_token);
        
        if (isAdminViaAAAPI) {
          console.log('[check-admin-aa] Admin verified via AA-API');
          return new Response(
            JSON.stringify({ 
              isAdmin: true, 
              method: 'aa-api',
              did: didMapping.did,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      console.log('[check-admin-aa] AA-API auth failed, falling back to legacy');
    }

    // Fallback to legacy check
    console.log('[check-admin-aa] Using legacy admin check');
    const isAdminLegacy = await checkAdminLegacy(supabaseAdmin, user.id);

    console.log('[check-admin-aa] Admin status (legacy):', isAdminLegacy);

    return new Response(
      JSON.stringify({ 
        isAdmin: isAdminLegacy, 
        method: 'legacy',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[check-admin-aa] Unexpected error:', error);
    return new Response(
      JSON.stringify({ isAdmin: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
