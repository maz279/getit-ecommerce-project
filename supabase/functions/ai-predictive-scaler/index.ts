import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts"

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

    const { service_name, current_metrics, historical_data } = await req.json()

    // Get historical traffic patterns
    const { data: trafficPatterns } = await supabase
      .from('traffic_patterns')
      .select('*')
      .gte('time_window', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('time_window', { ascending: false })
      .limit(24)

    // Simple predictive scaling algorithm
    let predictedDemand = 1.0
    let recommendedInstances = current_metrics?.current_instances || 1
    let scalingReason = 'maintaining_current_capacity'

    if (trafficPatterns && trafficPatterns.length > 0) {
      // Calculate average request growth rate
      const totalRequests = trafficPatterns.reduce((sum, pattern) => sum + pattern.request_count, 0)
      const avgRequestsPerHour = totalRequests / trafficPatterns.length
      const recentHourRequests = trafficPatterns[0]?.request_count || 0

      // Predict demand based on recent trends
      const demandGrowthRate = recentHourRequests / (avgRequestsPerHour || 1)
      predictedDemand = Math.max(0.5, Math.min(3.0, demandGrowthRate))

      // Calculate resource utilization score
      const avgResponseTime = trafficPatterns.reduce((sum, p) => sum + p.avg_response_time, 0) / trafficPatterns.length
      const avgErrorRate = trafficPatterns.reduce((sum, p) => sum + p.error_rate, 0) / trafficPatterns.length

      // Scaling decision logic
      if (predictedDemand > 1.5 || avgResponseTime > 1000 || avgErrorRate > 0.05) {
        recommendedInstances = Math.ceil((current_metrics?.current_instances || 1) * predictedDemand)
        scalingReason = 'high_demand_predicted'
      } else if (predictedDemand < 0.7 && avgResponseTime < 300 && avgErrorRate < 0.01) {
        recommendedInstances = Math.max(1, Math.floor((current_metrics?.current_instances || 1) * predictedDemand))
        scalingReason = 'low_demand_predicted'
      }
    }

    const confidenceLevel = Math.min(0.95, 0.6 + (trafficPatterns?.length || 0) * 0.02)

    // Calculate cost implications
    const costImplications = {
      current_cost_per_hour: (current_metrics?.current_instances || 1) * 0.10,
      predicted_cost_per_hour: recommendedInstances * 0.10,
      potential_savings: ((current_metrics?.current_instances || 1) - recommendedInstances) * 0.10
    }

    const resourceUtilization = {
      cpu_prediction: Math.min(80, 30 + predictedDemand * 20),
      memory_prediction: Math.min(85, 25 + predictedDemand * 25),
      network_prediction: Math.min(70, 20 + predictedDemand * 15)
    }

    // Log predictive scaling metrics
    await supabase.from('predictive_scaling_metrics').insert({
      service_name,
      current_instances: current_metrics?.current_instances || 1,
      predicted_demand: predictedDemand,
      recommended_instances: recommendedInstances,
      confidence_level: confidenceLevel,
      scaling_trigger_reason: scalingReason,
      resource_utilization: resourceUtilization,
      cost_implications: costImplications
    })

    console.log(`Predictive Scaler: ${service_name} - Current: ${current_metrics?.current_instances || 1}, Recommended: ${recommendedInstances}, Confidence: ${confidenceLevel}`)

    return new Response(
      JSON.stringify({
        service_name,
        current_instances: current_metrics?.current_instances || 1,
        recommended_instances: recommendedInstances,
        predicted_demand: predictedDemand,
        confidence_level: confidenceLevel,
        scaling_reason: scalingReason,
        cost_implications: costImplications,
        resource_utilization: resourceUtilization
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Predictive Scaler Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})