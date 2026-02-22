// supabase/functions/send-qubetalk/index.ts
// Send a message via QubeTalk (insert into qubetalk_messages)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { channel_id, content, from_agent, type, metadata } = await req.json()

    if (!channel_id || !content || !from_agent) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: channel_id, content, from_agent' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const message_id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    const { data, error } = await supabase
      .from('qubetalk_messages')
      .insert({
        message_id,
        channel_id,
        content,
        from_agent,
        type: type || 'text',
        metadata: metadata || null,
      })
      .select()
      .single()

    if (error) {
      console.error('QubeTalk insert error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ ok: true, message_id, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('send-qubetalk error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
