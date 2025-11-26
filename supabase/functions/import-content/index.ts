import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { content_items } = await req.json();

    if (!Array.isArray(content_items) || content_items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'content_items must be a non-empty array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate each item has required fields
    const errors: string[] = [];
    content_items.forEach((item, index) => {
      if (!item.title) errors.push(`Item ${index}: missing title`);
      if (!item.domain) errors.push(`Item ${index}: missing domain`);
      if (!item.format) errors.push(`Item ${index}: missing format`);
      if (!item.type) errors.push(`Item ${index}: missing type`);
      // content field is optional, defaults to empty object in database
    });

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert all items
    const { data, error } = await supabaseClient
      .from('content')
      .insert(content_items.map(item => ({
        ...item,
        content: item.content || {}, // Provide default empty object if not present
        author_id: user.id,
        author_type: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })))
      .select();

    if (error) {
      console.error('Insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Database insert failed', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: data.length,
        items: data,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
