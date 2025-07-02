import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { route_path, services, user_context } = await req.json()

    // Get current service health metrics
    const { data: healthMetrics } = await supabase
      .from('service_health_metrics')
      .select('*')
      .in('service_name', services)
      .order('last_health_check', { ascending: false })

    // Simple AI routing logic based on health scores and load
    let selectedService = services[0]
    let highestScore = 0
    let routingDecision = {
      confidence_score: 0,
      load_balancing_factor: 0,
      performance_prediction: 0
    }

    for (const metric of healthMetrics || []) {
      // Calculate routing score based on multiple factors
      const healthWeight = metric.health_score * 0.4
      const responseTimeWeight = (1000 - metric.response_time_avg) / 1000 * 0.3
      const errorRateWeight = (1 - metric.error_rate) * 0.2
      const utilizationWeight = (1 - Math.max(metric.cpu_utilization, metric.memory_utilization)) * 0.1

      const totalScore = healthWeight + responseTimeWeight + errorRateWeight + utilizationWeight

      if (totalScore > highestScore) {
        highestScore = totalScore
        selectedService = metric.service_name
        routingDecision = {
          confidence_score: totalScore,
          load_balancing_factor: 1 - Math.max(metric.cpu_utilization, metric.memory_utilization),
          performance_prediction: metric.response_time_avg
        }
      }
    }

    // Log routing analytics
    await supabase.from('ai_routing_analytics').insert({
      request_id: crypto.randomUUID(),
      route_path,
      selected_service: selectedService,
      confidence_score: routingDecision.confidence_score,
      response_time_ms: 0, // Will be updated after request completion
      success_rate: 1.0,
      load_score: routingDecision.load_balancing_factor,
      ai_decision_data: routingDecision,
      actual_performance: {}
    })

    console.log(`AI Router: Selected ${selectedService} for ${route_path} with confidence ${routingDecision.confidence_score}`)

    return new Response(
      JSON.stringify({
        selected_service: selectedService,
        routing_decision: routingDecision,
        confidence_score: routingDecision.confidence_score
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Intelligent Router Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})