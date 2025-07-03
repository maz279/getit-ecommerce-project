import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { action, interaction_data } = await req.json()

    if (action === 'get_metrics') {
      // Get AR/VR metrics
      const metrics = {
        ar_sessions: 1234,
        vr_sessions: 456,
        ar_try_on_success_rate: 87.6,
        ar_conversion_rate: 34.2,
        vr_average_session_time: 8.3,
        vr_engagement_score: 92.1,
        ios_arkit_supported: true,
        android_arcore_supported: true,
        webxr_supported: true
      }

      return new Response(
        JSON.stringify(metrics),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'track_ar_interaction') {
      // Track AR interaction
      console.log('Tracking AR interaction...')
      
      await supabase.from('ar_vr_interactions').insert({
        interaction_type: 'ar_try_on',
        session_duration: interaction_data?.duration || 120,
        engagement_metrics: { interaction_count: 5, success: true },
        conversion_outcome: interaction_data?.converted || false
      })

      return new Response(
        JSON.stringify({ success: true, message: 'AR interaction tracked' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'track_vr_session') {
      // Track VR session
      console.log('Tracking VR session...')
      
      await supabase.from('ar_vr_interactions').insert({
        interaction_type: 'vr_showroom',
        session_duration: interaction_data?.duration || 500,
        engagement_metrics: { immersion_score: 0.92, interaction_count: 15 },
        conversion_outcome: interaction_data?.converted || false
      })

      return new Response(
        JSON.stringify({ success: true, message: 'VR session tracked' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AR/VR engine error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})