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

    const { action, event_data } = await req.json()

    switch (action) {
      case 'publish_event':
        return await publishEvent(event_data, supabase)
      case 'process_events':
        return await processEvents(supabase)
      case 'get_metrics':
        return await getRealtimeMetrics(supabase)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Event Gateway Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function publishEvent(eventData: any, supabase: any) {
  const eventId = crypto.randomUUID()
  
  // Store event in stream
  const { data, error } = await supabase.from('event_streams').insert({
    event_id: eventId,
    event_type: eventData.type,
    source_service: eventData.source || 'api-gateway',
    event_payload: eventData.payload || {},
    routing_key: eventData.routing_key || 'default',
    correlation_id: eventData.correlation_id
  })

  if (error) throw error

  // Process business metrics
  if (eventData.type === 'order_completed' || eventData.type === 'payment_processed') {
    await updateBusinessMetrics(eventData, supabase)
  }

  // Track customer journey
  if (eventData.customer_id) {
    await trackCustomerJourney(eventData, supabase)
  }

  // Broadcast to active WebSocket sessions if needed
  if (eventData.broadcast) {
    await broadcastToSessions(eventData, supabase)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      event_id: eventId,
      processed_at: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function processEvents(supabase: any) {
  // Get pending events
  const { data: events } = await supabase
    .from('event_streams')
    .select('*')
    .eq('processing_status', 'pending')
    .order('event_timestamp', { ascending: true })
    .limit(100)

  const processed = []
  
  for (const event of events || []) {
    try {
      // Mark as processing
      await supabase.from('event_streams')
        .update({ processing_status: 'processing' })
        .eq('id', event.id)

      // Process based on event type
      await processEventByType(event, supabase)

      // Mark as completed
      await supabase.from('event_streams')
        .update({ 
          processing_status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', event.id)

      processed.push(event.event_id)

    } catch (error) {
      console.error(`Failed to process event ${event.event_id}:`, error)
      
      // Mark as failed and increment retry count
      await supabase.from('event_streams')
        .update({ 
          processing_status: 'failed',
          retry_count: event.retry_count + 1
        })
        .eq('id', event.id)
    }
  }

  return new Response(
    JSON.stringify({ 
      processed_count: processed.length,
      processed_events: processed
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function processEventByType(event: any, supabase: any) {
  const { event_type, event_payload } = event

  switch (event_type) {
    case 'user_registered':
      await handleUserRegistration(event_payload, supabase)
      break
    case 'order_placed':
      await handleOrderPlaced(event_payload, supabase)
      break
    case 'payment_processed':
      await handlePaymentProcessed(event_payload, supabase)
      break
    case 'product_viewed':
      await handleProductViewed(event_payload, supabase)
      break
    default:
      console.log(`No specific handler for event type: ${event_type}`)
  }
}

async function updateBusinessMetrics(eventData: any, supabase: any) {
  const timeWindow = new Date()
  timeWindow.setMinutes(Math.floor(timeWindow.getMinutes() / 5) * 5, 0, 0) // 5-minute windows

  const metrics = []

  if (eventData.type === 'order_completed') {
    metrics.push({
      metric_name: 'orders_completed',
      metric_value: 1,
      metric_type: 'counter',
      time_window: timeWindow.toISOString(),
      dimensions: {
        vendor_id: eventData.payload.vendor_id,
        order_value: eventData.payload.total_amount
      }
    })

    if (eventData.payload.total_amount) {
      metrics.push({
        metric_name: 'revenue',
        metric_value: eventData.payload.total_amount,
        metric_type: 'gauge',
        time_window: timeWindow.toISOString(),
        vendor_id: eventData.payload.vendor_id
      })
    }
  }

  if (metrics.length > 0) {
    await supabase.from('realtime_business_metrics').insert(metrics)
  }
}

async function trackCustomerJourney(eventData: any, supabase: any) {
  await supabase.from('customer_journey_events').insert({
    customer_id: eventData.customer_id,
    session_id: eventData.session_id || crypto.randomUUID(),
    event_name: eventData.type,
    event_category: getEventCategory(eventData.type),
    page_url: eventData.payload.page_url,
    event_properties: eventData.payload,
    journey_stage: determineJourneyStage(eventData.type),
    funnel_step: getFunnelStep(eventData.type),
    conversion_value: eventData.payload.value || 0
  })
}

async function broadcastToSessions(eventData: any, supabase: any) {
  // Get active WebSocket sessions that should receive this event
  const { data: sessions } = await supabase
    .from('websocket_sessions')
    .select('*')
    .eq('connection_status', 'active')

  // In a real implementation, you would need a way to send messages to active WebSocket connections
  // This would typically involve a Redis pub/sub or similar mechanism
  console.log(`Would broadcast to ${sessions?.length || 0} active sessions`)
}

async function getRealtimeMetrics(supabase: any) {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  const { data: metrics } = await supabase
    .from('realtime_business_metrics')
    .select('*')
    .gte('time_window', fiveMinutesAgo)
    .order('time_window', { ascending: false })

  return new Response(
    JSON.stringify({ 
      metrics: metrics || [],
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function getEventCategory(eventType: string): string {
  if (eventType.includes('product')) return 'product'
  if (eventType.includes('order')) return 'transaction'
  if (eventType.includes('user')) return 'user'
  if (eventType.includes('payment')) return 'payment'
  return 'general'
}

function determineJourneyStage(eventType: string): string {
  switch (eventType) {
    case 'user_registered': return 'awareness'
    case 'product_viewed': return 'consideration'
    case 'cart_added': return 'intent'
    case 'checkout_started': return 'purchase'
    case 'order_completed': return 'retention'
    default: return 'unknown'
  }
}

function getFunnelStep(eventType: string): number {
  switch (eventType) {
    case 'user_registered': return 1
    case 'product_viewed': return 2
    case 'cart_added': return 3
    case 'checkout_started': return 4
    case 'order_completed': return 5
    default: return 0
  }
}

async function handleUserRegistration(payload: any, supabase: any) {
  // Handle user registration logic
  console.log('Processing user registration:', payload.user_id)
}

async function handleOrderPlaced(payload: any, supabase: any) {
  // Handle order placement logic
  console.log('Processing order placement:', payload.order_id)
}

async function handlePaymentProcessed(payload: any, supabase: any) {
  // Handle payment processing logic
  console.log('Processing payment:', payload.payment_id)
}

async function handleProductViewed(payload: any, supabase: any) {
  // Handle product view logic
  console.log('Processing product view:', payload.product_id)
}