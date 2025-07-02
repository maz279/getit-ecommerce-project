import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CacheEntry {
  cache_key: string
  cache_value: any
  cache_type: 'user_behavior' | 'predictive' | 'geographic'
  user_id?: string
  geographic_region?: string
  prediction_score?: number
  expires_at: string
  metadata?: any
}

interface CacheOptimizationRequest {
  action: 'optimize' | 'predict' | 'invalidate' | 'analyze'
  cache_key?: string
  user_id?: string
  geographic_region?: string
  cache_type?: string
  data?: any
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, cache_key, user_id, geographic_region, cache_type, data }: CacheOptimizationRequest = await req.json()

    switch (action) {
      case 'optimize':
        return await optimizeCache(supabase, { cache_key, user_id, geographic_region, cache_type })
      
      case 'predict':
        return await predictCacheNeeds(supabase, { user_id, geographic_region })
      
      case 'invalidate':
        return await intelligentInvalidation(supabase, { cache_key, cache_type })
      
      case 'analyze':
        return await analyzeCachePerformance(supabase, { cache_key, cache_type })
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Intelligent Cache Optimizer Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function optimizeCache(supabase: any, params: any) {
  const { cache_key, user_id, geographic_region, cache_type } = params

  // Get user behavior patterns
  const { data: behaviorProfile } = await supabase
    .from('user_behavior_cache_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single()

  // Get cache metrics
  const { data: metrics } = await supabase
    .from('cache_optimization_metrics')
    .select('*')
    .eq('cache_key', cache_key)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // AI-powered optimization logic
  const optimizationScore = calculateOptimizationScore(behaviorProfile, metrics)
  const recommendations = generateOptimizationRecommendations(behaviorProfile, metrics)

  // Update cache entry with optimization
  const optimizedEntry = {
    cache_type: determineBestCacheType(behaviorProfile, geographic_region),
    prediction_score: optimizationScore,
    expires_at: calculateOptimalTTL(behaviorProfile, metrics),
    metadata: {
      optimization_applied: true,
      recommendations,
      optimized_at: new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('intelligent_cache_entries')
    .upsert({
      cache_key,
      user_id,
      geographic_region,
      ...optimizedEntry
    })

  return new Response(
    JSON.stringify({
      success: true,
      optimization_score: optimizationScore,
      recommendations,
      cache_entry: data
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function predictCacheNeeds(supabase: any, params: any) {
  const { user_id, geographic_region } = params

  // Get user behavior patterns
  const { data: behaviorProfile } = await supabase
    .from('user_behavior_cache_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single()

  // Get predictive models
  const { data: models } = await supabase
    .from('predictive_cache_models')
    .select('*')
    .eq('is_active', true)
    .order('accuracy_score', { ascending: false })

  const predictions = []

  for (const model of models || []) {
    const prediction = await runPredictiveModel(model, behaviorProfile, geographic_region)
    predictions.push(prediction)
  }

  // Pre-cache predicted content
  for (const prediction of predictions) {
    if (prediction.confidence > 0.7) {
      await preCacheContent(supabase, prediction, user_id, geographic_region)
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      predictions,
      pre_cached_items: predictions.filter(p => p.confidence > 0.7).length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function intelligentInvalidation(supabase: any, params: any) {
  const { cache_key, cache_type } = params

  // Get cache dependencies and impact analysis
  const { data: relatedEntries } = await supabase
    .from('intelligent_cache_entries')
    .select('*')
    .or(`cache_key.ilike.%${cache_key}%,metadata->>related_keys.cs.{${cache_key}}`)

  const invalidationPlan = {
    direct_invalidations: [],
    cascading_invalidations: [],
    selective_updates: []
  }

  for (const entry of relatedEntries || []) {
    const impact = calculateInvalidationImpact(entry, cache_key)
    
    if (impact.type === 'direct') {
      invalidationPlan.direct_invalidations.push(entry.cache_key)
    } else if (impact.type === 'cascading') {
      invalidationPlan.cascading_invalidations.push(entry.cache_key)
    } else if (impact.type === 'selective') {
      invalidationPlan.selective_updates.push({
        cache_key: entry.cache_key,
        update_fields: impact.fields
      })
    }
  }

  // Execute invalidation plan
  for (const key of invalidationPlan.direct_invalidations) {
    await supabase
      .from('intelligent_cache_entries')
      .delete()
      .eq('cache_key', key)
  }

  for (const key of invalidationPlan.cascading_invalidations) {
    await supabase
      .from('intelligent_cache_entries')
      .update({ expires_at: new Date().toISOString() })
      .eq('cache_key', key)
  }

  return new Response(
    JSON.stringify({
      success: true,
      invalidation_plan,
      items_invalidated: invalidationPlan.direct_invalidations.length + invalidationPlan.cascading_invalidations.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function analyzeCachePerformance(supabase: any, params: any) {
  const { cache_key, cache_type } = params

  const analysis = {
    hit_rate: 0,
    miss_rate: 0,
    access_patterns: {},
    optimization_opportunities: [],
    performance_score: 0
  }

  // Calculate cache metrics
  const { data: entries } = await supabase
    .from('intelligent_cache_entries')
    .select('*')
    .eq('cache_key', cache_key)

  if (entries && entries.length > 0) {
    const totalAccesses = entries.reduce((sum, entry) => sum + (entry.access_frequency || 0), 0)
    analysis.hit_rate = totalAccesses > 0 ? (entries.length / totalAccesses) * 100 : 0
    analysis.miss_rate = 100 - analysis.hit_rate
  }

  // Analyze access patterns
  analysis.access_patterns = analyzeAccessPatterns(entries)
  
  // Generate optimization opportunities
  analysis.optimization_opportunities = generateOptimizationOpportunities(analysis)
  
  // Calculate performance score
  analysis.performance_score = await supabase.rpc('calculate_cache_optimization_score', {
    p_cache_key: cache_key,
    p_hit_rate: analysis.hit_rate / 100,
    p_access_frequency: entries?.[0]?.access_frequency || 0
  })

  // Store analysis results
  await supabase
    .from('cache_optimization_metrics')
    .insert({
      cache_key,
      hit_rate: analysis.hit_rate / 100,
      miss_rate: analysis.miss_rate / 100,
      access_pattern: analysis.access_patterns,
      optimization_score: analysis.performance_score,
      recommendations: analysis.optimization_opportunities
    })

  return new Response(
    JSON.stringify({
      success: true,
      analysis
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function calculateOptimizationScore(behaviorProfile: any, metrics: any): number {
  let score = 50 // Base score

  if (behaviorProfile) {
    const patterns = behaviorProfile.behavior_patterns || {}
    if (patterns.frequency === 'high') score += 20
    if (patterns.consistency === 'high') score += 15
    if (patterns.geographic_stability === 'high') score += 10
  }

  if (metrics) {
    score += (metrics.hit_rate || 0) * 30
    score -= (metrics.miss_rate || 0) * 20
  }

  return Math.min(100, Math.max(0, score))
}

function generateOptimizationRecommendations(behaviorProfile: any, metrics: any): string[] {
  const recommendations = []

  if (metrics?.hit_rate < 0.6) {
    recommendations.push('Increase cache TTL for better hit rate')
  }

  if (behaviorProfile?.behavior_patterns?.frequency === 'high') {
    recommendations.push('Enable predictive caching for this user')
  }

  if (behaviorProfile?.geographic_preferences) {
    recommendations.push('Implement geographic-specific caching')
  }

  return recommendations
}

function determineBestCacheType(behaviorProfile: any, geographic_region: string): string {
  if (behaviorProfile?.behavior_patterns?.consistency === 'high') {
    return 'user_behavior'
  }
  
  if (geographic_region) {
    return 'geographic'
  }
  
  return 'predictive'
}

function calculateOptimalTTL(behaviorProfile: any, metrics: any): string {
  let ttlHours = 24 // Default 24 hours

  if (behaviorProfile?.behavior_patterns?.frequency === 'high') {
    ttlHours = 72 // 3 days for frequent users
  }

  if (metrics?.hit_rate > 0.8) {
    ttlHours *= 1.5 // Extend TTL for high-performing cache
  }

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + ttlHours)
  return expiresAt.toISOString()
}

async function runPredictiveModel(model: any, behaviorProfile: any, geographic_region: string) {
  // Simplified predictive modeling logic
  const features = extractFeatures(behaviorProfile, geographic_region)
  const confidence = calculateModelConfidence(model, features)
  
  return {
    model_name: model.model_name,
    predicted_content: generatePredictedContent(features),
    confidence,
    cache_recommendations: generateCacheRecommendations(features, confidence)
  }
}

function extractFeatures(behaviorProfile: any, geographic_region: string) {
  return {
    access_frequency: behaviorProfile?.access_frequency_map || {},
    geographic_region,
    time_patterns: behaviorProfile?.behavior_patterns?.time_patterns || {},
    content_preferences: behaviorProfile?.cache_preferences || {}
  }
}

function calculateModelConfidence(model: any, features: any): number {
  // Simplified confidence calculation
  return Math.min(0.95, (model.accuracy_score || 0.5) * (1 + Math.random() * 0.2))
}

function generatePredictedContent(features: any): string[] {
  // Generate predicted cache keys based on features
  return Object.keys(features.access_frequency || {})
    .filter(key => (features.access_frequency[key] || 0) > 5)
    .slice(0, 10)
}

function generateCacheRecommendations(features: any, confidence: number): string[] {
  const recommendations = []
  
  if (confidence > 0.8) {
    recommendations.push('High confidence prediction - enable aggressive pre-caching')
  }
  
  if (features.geographic_region) {
    recommendations.push(`Optimize for ${features.geographic_region} region`)
  }
  
  return recommendations
}

async function preCacheContent(supabase: any, prediction: any, user_id: string, geographic_region: string) {
  for (const content_key of prediction.predicted_content) {
    await supabase
      .from('intelligent_cache_entries')
      .insert({
        cache_key: content_key,
        cache_value: { pre_cached: true, prediction_source: prediction.model_name },
        cache_type: 'predictive',
        user_id,
        geographic_region,
        prediction_score: prediction.confidence,
        expires_at: calculateOptimalTTL(null, null),
        metadata: {
          pre_cached: true,
          prediction_model: prediction.model_name,
          confidence: prediction.confidence
        }
      })
  }
}

function calculateInvalidationImpact(entry: any, target_key: string) {
  if (entry.cache_key === target_key) {
    return { type: 'direct' }
  }
  
  if (entry.metadata?.related_keys?.includes(target_key)) {
    return { type: 'cascading' }
  }
  
  if (entry.cache_key.includes(target_key)) {
    return { type: 'selective', fields: ['cache_value'] }
  }
  
  return { type: 'none' }
}

function analyzeAccessPatterns(entries: any[]) {
  if (!entries || entries.length === 0) return {}
  
  const patterns = {
    total_accesses: 0,
    unique_users: new Set(),
    geographic_distribution: {},
    time_distribution: {}
  }
  
  for (const entry of entries) {
    patterns.total_accesses += entry.access_frequency || 0
    if (entry.user_id) patterns.unique_users.add(entry.user_id)
    if (entry.geographic_region) {
      patterns.geographic_distribution[entry.geographic_region] = 
        (patterns.geographic_distribution[entry.geographic_region] || 0) + 1
    }
  }
  
  patterns.unique_users = patterns.unique_users.size
  return patterns
}

function generateOptimizationOpportunities(analysis: any): string[] {
  const opportunities = []
  
  if (analysis.hit_rate < 60) {
    opportunities.push('Low hit rate detected - consider increasing cache TTL')
  }
  
  if (analysis.access_patterns.unique_users > 100) {
    opportunities.push('High user volume - implement user-specific caching strategies')
  }
  
  if (Object.keys(analysis.access_patterns.geographic_distribution || {}).length > 3) {
    opportunities.push('Multi-region usage - implement geographic caching')
  }
  
  return opportunities
}