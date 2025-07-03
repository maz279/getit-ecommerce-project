import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { type, data } = await req.json()

    switch (type) {
      case 'track_event':
        return await trackEvent(supabaseClient, data)
      case 'get_analytics':
        return await getAnalytics(supabaseClient, data)
      case 'get_real_time_metrics':
        return await getRealTimeMetrics(supabaseClient, data)
      case 'customer_journey':
        return await trackCustomerJourney(supabaseClient, data)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid request type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Real-time analytics error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function trackEvent(supabase: any, eventData: any) {
  // Enhanced event tracking with real-time processing
  const event = {
    event_name: eventData.event_name,
    event_category: eventData.event_category,
    event_action: eventData.event_action,
    event_label: eventData.event_label,
    event_value: eventData.event_value,
    user_id: eventData.user_id,
    session_id: eventData.session_id,
    page_url: eventData.page_url,
    referrer: eventData.referrer,
    user_agent: eventData.user_agent,
    ip_address: eventData.ip_address,
    custom_properties: eventData.custom_properties || {}
  }

  // Store in analytics_events table
  const { data: storedEvent, error } = await supabase
    .from('analytics_events')
    .insert(event)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to store event: ${error.message}`)
  }

  // Process real-time aggregations
  await processRealTimeAggregations(supabase, event)

  // Trigger ML analysis for user behavior
  if (event.user_id) {
    await triggerBehaviorAnalysis(supabase, event)
  }

  return new Response(
    JSON.stringify({ success: true, eventId: storedEvent.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function processRealTimeAggregations(supabase: any, event: any) {
  const today = new Date().toISOString().split('T')[0]
  const currentHour = new Date().getHours()

  // Update real-time metrics
  await supabase
    .from('real_time_metrics')
    .upsert({
      metric_type: 'user_activity',
      metric_key: event.event_category,
      metric_value: { count: 1, event_name: event.event_name },
      date: today,
      hour: currentHour
    }, {
      onConflict: 'metric_type,metric_key,date,hour',
      ignoreDuplicates: false
    })

  // Product-specific metrics
  if (event.custom_properties?.product_id) {
    await supabase
      .from('real_time_metrics')
      .upsert({
        metric_type: 'product_activity',
        metric_key: event.custom_properties.product_id,
        metric_value: { 
          event_type: event.event_name,
          count: 1,
          user_id: event.user_id 
        },
        date: today,
        hour: currentHour
      })
  }

  // Revenue tracking
  if (event.event_name === 'purchase' && event.event_value) {
    await supabase
      .from('real_time_metrics')
      .upsert({
        metric_type: 'revenue',
        metric_key: 'total_revenue',
        metric_value: { amount: event.event_value, currency: 'BDT' },
        date: today,
        hour: currentHour
      })
  }
}

async function triggerBehaviorAnalysis(supabase: any, event: any) {
  // Update user behavioral profile
  const behaviorData = {
    user_id: event.user_id,
    activity_type: event.event_name,
    page_category: event.event_category,
    session_id: event.session_id,
    timestamp: new Date().toISOString(),
    context_data: {
      page_url: event.page_url,
      referrer: event.referrer,
      custom_properties: event.custom_properties
    }
  }

  await supabase
    .from('user_behaviors')
    .insert(behaviorData)

  // Trigger AI analysis for personalization
  if (shouldTriggerAIAnalysis(event)) {
    await supabase.functions.invoke('ai-behavior-analysis', {
      body: { userId: event.user_id, recentEvent: event }
    })
  }
}

function shouldTriggerAIAnalysis(event: any): boolean {
  // Trigger AI analysis for high-value events
  const highValueEvents = ['purchase', 'add_to_cart', 'product_view', 'search']
  return highValueEvents.includes(event.event_name)
}

async function getAnalytics(supabase: any, params: any) {
  const { type, timeRange, filters } = params

  let query = supabase.from('analytics_events').select('*')

  // Apply time range filter
  if (timeRange?.start) {
    query = query.gte('created_at', timeRange.start)
  }
  if (timeRange?.end) {
    query = query.lte('created_at', timeRange.end)
  }

  // Apply additional filters
  if (filters?.event_category) {
    query = query.eq('event_category', filters.event_category)
  }
  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id)
  }

  const { data, error } = await query.limit(1000)

  if (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`)
  }

  // Process and aggregate data based on type
  const processedData = await processAnalyticsData(data, type)

  return new Response(
    JSON.stringify({ data: processedData }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function processAnalyticsData(rawData: any[], type: string) {
  switch (type) {
    case 'pageviews':
      return aggregatePageViews(rawData)
    case 'user_engagement':
      return aggregateUserEngagement(rawData)
    case 'conversion_funnel':
      return buildConversionFunnel(rawData)
    case 'real_time_activity':
      return getRealTimeActivity(rawData)
    default:
      return rawData
  }
}

function aggregatePageViews(data: any[]) {
  const pageViews = data
    .filter(event => event.event_name === 'page_view')
    .reduce((acc: any, event) => {
      const page = event.page_url
      acc[page] = (acc[page] || 0) + 1
      return acc
    }, {})

  return Object.entries(pageViews).map(([page, views]) => ({ page, views }))
}

function aggregateUserEngagement(data: any[]) {
  const userSessions = data.reduce((acc: any, event) => {
    const sessionId = event.session_id
    if (!acc[sessionId]) {
      acc[sessionId] = {
        sessionId,
        userId: event.user_id,
        events: [],
        startTime: event.created_at,
        endTime: event.created_at
      }
    }
    acc[sessionId].events.push(event)
    if (event.created_at > acc[sessionId].endTime) {
      acc[sessionId].endTime = event.created_at
    }
    return acc
  }, {})

  return Object.values(userSessions).map((session: any) => ({
    ...session,
    duration: new Date(session.endTime).getTime() - new Date(session.startTime).getTime(),
    eventCount: session.events.length
  }))
}

function buildConversionFunnel(data: any[]) {
  const funnelSteps = ['page_view', 'product_view', 'add_to_cart', 'checkout', 'purchase']
  const userJourneys = new Map()

  data.forEach(event => {
    if (!userJourneys.has(event.user_id)) {
      userJourneys.set(event.user_id, new Set())
    }
    userJourneys.get(event.user_id).add(event.event_name)
  })

  const funnelData = funnelSteps.map(step => {
    const usersAtStep = Array.from(userJourneys.values())
      .filter((userEvents: any) => userEvents.has(step)).length
    return { step, userCount: usersAtStep }
  })

  return funnelData
}

function getRealTimeActivity(data: any[]) {
  const now = new Date()
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000)

  return data
    .filter(event => new Date(event.created_at) > lastHour)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

async function getRealTimeMetrics(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('real_time_metrics')
    .select('*')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch real-time metrics: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ metrics: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function trackCustomerJourney(supabase: any, journeyData: any) {
  const { data, error } = await supabase
    .from('customer_journey_events')
    .insert({
      customer_id: journeyData.customer_id,
      event_type: journeyData.event_type,
      event_data: journeyData.event_data,
      stage_id: journeyData.stage_id,
      timestamp: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to track journey: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ success: true, journeyEventId: data.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}