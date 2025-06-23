
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { 
      user_id, 
      session_id, 
      event_type, 
      event_data, 
      product_id, 
      category_id,
      ip_address,
      user_agent 
    } = await req.json()

    // Create or update user session
    if (session_id && user_id) {
      const { error: sessionError } = await supabaseClient
        .from('user_sessions')
        .upsert({
          id: session_id,
          user_id,
          ip_address,
          user_agent,
          session_data: event_data?.session_data || {},
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })

      if (sessionError) console.error('Session upsert error:', sessionError)
    }

    // Record user behavior
    const { data, error } = await supabaseClient
      .from('user_behaviors')
      .insert({
        user_id,
        session_id,
        event_type,
        event_data: event_data || {},
        product_id,
        category_id
      })

    if (error) throw error

    // Cache to Redis if available
    try {
      const redisResponse = await fetch(`${req.url.split('/behavior-tracking')[0]}/redis-cache`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set',
          key: `user_behavior:${user_id}:latest`,
          value: { event_type, timestamp: new Date().toISOString() },
          ttl: 3600
        })
      })
    } catch (redisError) {
      console.log('Redis cache failed:', redisError)
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
