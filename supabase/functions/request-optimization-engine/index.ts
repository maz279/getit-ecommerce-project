import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OptimizationRequest {
  action: 'optimize' | 'deduplicate' | 'compress' | 'batch' | 'stream' | 'adapt'
  request_data?: any
  user_id?: string
  content_type?: string
  bandwidth_info?: {
    connection_type: string
    bandwidth_estimate: number
    latency_ms: number
  }
  batch_config?: {
    batch_size: number
    delay_ms: number
  }
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

    const requestData: OptimizationRequest = await req.json()
    const { action } = requestData

    switch (action) {
      case 'optimize':
        return await optimizeRequest(supabase, requestData, req)
      
      case 'deduplicate':
        return await deduplicateRequest(supabase, requestData)
      
      case 'compress':
        return await compressResponse(supabase, requestData)
      
      case 'batch':
        return await batchRequests(supabase, requestData)
      
      case 'stream':
        return await streamResponse(supabase, requestData)
      
      case 'adapt':
        return await adaptToBandwidth(supabase, requestData)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Request Optimization Engine Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function optimizeRequest(supabase: any, requestData: any, originalReq: Request) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()
  
  // Get user bandwidth profile
  const { data: bandwidthProfile } = await supabase
    .from('bandwidth_adaptation_profiles')
    .select('*')
    .eq('user_id', requestData.user_id)
    .order('last_updated', { ascending: false })
    .limit(1)
    .single()

  // Determine optimization strategy
  const strategy = determineOptimizationStrategy(requestData, bandwidthProfile)
  
  let optimizedResponse = requestData.request_data
  let optimizations = []
  
  // Apply optimizations based on strategy
  if (strategy.includes('deduplication')) {
    const dedupResult = await performDeduplication(supabase, requestData)
    if (dedupResult.deduplicated) {
      optimizedResponse = dedupResult.response
      optimizations.push('deduplication')
    }
  }
  
  if (strategy.includes('compression')) {
    const compressResult = await performCompression(supabase, optimizedResponse, requestData.content_type)
    optimizedResponse = compressResult.compressed_data
    optimizations.push(`compression_${compressResult.algorithm}`)
  }
  
  if (strategy.includes('batching')) {
    const batchResult = await performBatching(supabase, requestData)
    if (batchResult.batched) {
      optimizations.push('batching')
    }
  }
  
  const processingTime = Date.now() - startTime
  const originalSize = JSON.stringify(requestData.request_data).length
  const optimizedSize = JSON.stringify(optimizedResponse).length
  
  // Log optimization metrics
  await supabase
    .from('request_optimization_logs')
    .insert({
      request_id: requestId,
      original_size: originalSize,
      optimized_size: optimizedSize,
      compression_ratio: originalSize > 0 ? optimizedSize / originalSize : 1,
      optimization_type: optimizations.join(','),
      processing_time_ms: processingTime,
      bandwidth_saved: originalSize - optimizedSize,
      user_id: requestData.user_id,
      endpoint: originalReq.url,
      user_agent: originalReq.headers.get('user-agent')
    })

  return new Response(
    JSON.stringify({
      success: true,
      request_id: requestId,
      optimizations_applied: optimizations,
      original_size: originalSize,
      optimized_size: optimizedSize,
      compression_ratio: optimizedSize / originalSize,
      processing_time_ms: processingTime,
      bandwidth_saved: originalSize - optimizedSize,
      optimized_response: optimizedResponse
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function deduplicateRequest(supabase: any, requestData: any) {
  const requestHash = await generateRequestHash(requestData.request_data)
  
  // Check if request already exists
  const { data: existingRequest } = await supabase
    .from('request_deduplication_cache')
    .select('*')
    .eq('request_hash', requestHash)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (existingRequest) {
    // Update access count
    await supabase
      .from('request_deduplication_cache')
      .update({
        request_count: existingRequest.request_count + 1,
        last_accessed: new Date().toISOString()
      })
      .eq('request_hash', requestHash)

    return new Response(
      JSON.stringify({
        success: true,
        deduplicated: true,
        cached_response: existingRequest.response_data,
        cache_hit: true,
        request_count: existingRequest.request_count + 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Store new request for future deduplication
  const responseData = await processNewRequest(requestData.request_data)
  
  await supabase
    .from('request_deduplication_cache')
    .insert({
      request_hash: requestHash,
      response_data: responseData,
      expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour TTL
    })

  return new Response(
    JSON.stringify({
      success: true,
      deduplicated: false,
      response_data: responseData,
      cache_hit: false,
      request_count: 1
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function compressResponse(supabase: any, requestData: any) {
  const { content_type = 'application/json', request_data } = requestData
  
  // Get compression rules
  const { data: compressionRules } = await supabase
    .from('compression_optimization_rules')
    .select('*')
    .eq('content_type', content_type)
    .eq('is_active', true)
    .order('compression_level', { ascending: false })
    .limit(1)
    .single()

  const rule = compressionRules || {
    compression_algorithm: 'gzip',
    compression_level: 6,
    min_size_threshold: 1024
  }

  const originalData = JSON.stringify(request_data)
  const originalSize = originalData.length

  if (originalSize < rule.min_size_threshold) {
    return new Response(
      JSON.stringify({
        success: true,
        compressed: false,
        reason: 'Below size threshold',
        original_size: originalSize,
        data: request_data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Perform compression (simulated)
  const compressionResult = await performActualCompression(originalData, rule)
  
  return new Response(
    JSON.stringify({
      success: true,
      compressed: true,
      algorithm: rule.compression_algorithm,
      original_size: originalSize,
      compressed_size: compressionResult.compressed_size,
      compression_ratio: compressionResult.compression_ratio,
      compressed_data: compressionResult.compressed_data
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function batchRequests(supabase: any, requestData: any) {
  const { user_id, request_data, batch_config } = requestData
  const batchId = crypto.randomUUID()

  // Get optimal batch configuration
  const optimalConfig = await supabase.rpc('optimize_request_batching', {
    p_user_id: user_id,
    p_request_type: request_data.type || 'generic'
  })

  const config = batch_config || optimalConfig || { batch_size: 10, processing_delay_ms: 100 }

  // Add request to batch queue
  await supabase
    .from('request_batching_queues')
    .insert({
      batch_id: batchId,
      user_id,
      request_type: request_data.type || 'generic',
      request_data,
      priority: request_data.priority || 5,
      batch_size: config.batch_size,
      processing_delay_ms: config.processing_delay_ms
    })

  // Check if batch is ready for processing
  const { data: queuedRequests } = await supabase
    .from('request_batching_queues')
    .select('*')
    .eq('user_id', user_id)
    .eq('request_type', request_data.type || 'generic')
    .eq('status', 'queued')

  const shouldProcessBatch = queuedRequests.length >= config.batch_size

  if (shouldProcessBatch) {
    // Process batch
    const batchResult = await processBatch(supabase, queuedRequests, config)
    
    return new Response(
      JSON.stringify({
        success: true,
        batched: true,
        batch_processed: true,
        batch_id: batchId,
        batch_size: queuedRequests.length,
        processing_result: batchResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({
      success: true,
      batched: true,
      batch_processed: false,
      batch_id: batchId,
      queued_requests: queuedRequests.length,
      estimated_processing_time: config.processing_delay_ms
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function streamResponse(supabase: any, requestData: any) {
  const { request_data, user_id } = requestData
  
  // Simulate streaming response
  const chunks = chunkData(request_data, 1024) // 1KB chunks
  const streamId = crypto.randomUUID()
  
  // Store streaming metadata
  await supabase
    .from('request_optimization_logs')
    .insert({
      request_id: streamId,
      original_size: JSON.stringify(request_data).length,
      optimized_size: JSON.stringify(request_data).length,
      compression_ratio: 1,
      optimization_type: 'streaming',
      processing_time_ms: 0,
      user_id,
      endpoint: 'streaming'
    })

  return new Response(
    JSON.stringify({
      success: true,
      streaming: true,
      stream_id: streamId,
      total_chunks: chunks.length,
      chunk_size: 1024,
      chunks: chunks
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function adaptToBandwidth(supabase: any, requestData: any) {
  const { bandwidth_info, user_id, request_data } = requestData
  
  if (!bandwidth_info) {
    return new Response(
      JSON.stringify({ error: 'Bandwidth information required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Update or create bandwidth profile
  await supabase
    .from('bandwidth_adaptation_profiles')
    .upsert({
      user_id,
      connection_type: bandwidth_info.connection_type,
      bandwidth_estimate: bandwidth_info.bandwidth_estimate,
      latency_ms: bandwidth_info.latency_ms,
      adaptation_rules: generateAdaptationRules(bandwidth_info),
      last_updated: new Date().toISOString()
    })

  // Adapt content based on bandwidth
  const adaptedContent = adaptContentToBandwidth(request_data, bandwidth_info)
  
  return new Response(
    JSON.stringify({
      success: true,
      adapted: true,
      bandwidth_info,
      adaptation_applied: adaptedContent.adaptations,
      original_size: JSON.stringify(request_data).length,
      adapted_size: JSON.stringify(adaptedContent.data).length,
      adapted_content: adaptedContent.data
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function determineOptimizationStrategy(requestData: any, bandwidthProfile: any): string[] {
  const strategy = []
  
  // Always try deduplication
  strategy.push('deduplication')
  
  // Compression for larger requests
  if (JSON.stringify(requestData.request_data).length > 1024) {
    strategy.push('compression')
  }
  
  // Batching for frequent requests
  if (requestData.request_data?.type && requestData.user_id) {
    strategy.push('batching')
  }
  
  // Low bandwidth adaptations
  if (bandwidthProfile?.bandwidth_estimate < 1000) { // < 1 Mbps
    strategy.push('streaming', 'bandwidth_adaptation')
  }
  
  return strategy
}

async function performDeduplication(supabase: any, requestData: any) {
  const requestHash = await generateRequestHash(requestData.request_data)
  
  const { data: cachedResponse } = await supabase
    .from('request_deduplication_cache')
    .select('response_data')
    .eq('request_hash', requestHash)
    .gt('expires_at', new Date().toISOString())
    .single()

  return {
    deduplicated: !!cachedResponse,
    response: cachedResponse?.response_data || requestData.request_data
  }
}

async function performCompression(supabase: any, data: any, contentType: string) {
  // Simplified compression simulation
  const originalSize = JSON.stringify(data).length
  const compressionRatio = 0.7 // 30% compression
  const compressedSize = Math.floor(originalSize * compressionRatio)
  
  return {
    compressed_data: data, // In reality, this would be compressed
    algorithm: 'gzip',
    original_size: originalSize,
    compressed_size: compressedSize,
    compression_ratio: compressionRatio
  }
}

async function performBatching(supabase: any, requestData: any) {
  // Check if there are enough requests to batch
  const { data: queuedRequests } = await supabase
    .from('request_batching_queues')
    .select('count(*)')
    .eq('user_id', requestData.user_id)
    .eq('status', 'queued')

  return {
    batched: queuedRequests?.[0]?.count > 5
  }
}

async function generateRequestHash(requestData: any): Promise<string> {
  const dataString = JSON.stringify(requestData, Object.keys(requestData).sort())
  const encoder = new TextEncoder()
  const data = encoder.encode(dataString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function processNewRequest(requestData: any) {
  // Simulate processing new request
  return {
    processed: true,
    timestamp: new Date().toISOString(),
    data: requestData
  }
}

async function performActualCompression(data: string, rule: any) {
  // Simulate compression
  const compressionRatio = rule.compression_level / 10 // Simplified
  const compressedSize = Math.floor(data.length * compressionRatio)
  
  return {
    compressed_data: data, // In reality, this would be compressed
    compressed_size: compressedSize,
    compression_ratio: compressionRatio
  }
}

async function processBatch(supabase: any, requests: any[], config: any) {
  // Update all requests to processing
  const requestIds = requests.map(r => r.id)
  
  await supabase
    .from('request_batching_queues')
    .update({ 
      status: 'processing',
      processed_at: new Date().toISOString()
    })
    .in('id', requestIds)

  // Simulate batch processing
  await new Promise(resolve => setTimeout(resolve, config.processing_delay_ms))

  // Update all requests to completed
  await supabase
    .from('request_batching_queues')
    .update({ status: 'completed' })
    .in('id', requestIds)

  return {
    processed_count: requests.length,
    processing_time_ms: config.processing_delay_ms
  }
}

function chunkData(data: any, chunkSize: number): any[] {
  const dataString = JSON.stringify(data)
  const chunks = []
  
  for (let i = 0; i < dataString.length; i += chunkSize) {
    chunks.push(dataString.substring(i, i + chunkSize))
  }
  
  return chunks
}

function generateAdaptationRules(bandwidthInfo: any) {
  const rules = {
    image_quality: 'medium',
    video_quality: 'medium',
    prefetch_enabled: true,
    compression_level: 6
  }

  if (bandwidthInfo.bandwidth_estimate < 500) { // < 500 kbps
    rules.image_quality = 'low'
    rules.video_quality = 'low'
    rules.prefetch_enabled = false
    rules.compression_level = 9
  } else if (bandwidthInfo.bandwidth_estimate < 1000) { // < 1 Mbps
    rules.image_quality = 'medium'
    rules.video_quality = 'medium'
    rules.compression_level = 7
  }

  if (bandwidthInfo.latency_ms > 200) {
    rules.prefetch_enabled = false
  }

  return rules
}

function adaptContentToBandwidth(data: any, bandwidthInfo: any) {
  const adaptations = []
  let adaptedData = { ...data }

  if (bandwidthInfo.bandwidth_estimate < 1000) {
    // Remove high-resolution images
    if (adaptedData.images) {
      adaptedData.images = adaptedData.images.map((img: any) => ({
        ...img,
        url: img.url?.replace('_high', '_low'),
        quality: 'low'
      }))
      adaptations.push('image_quality_reduction')
    }

    // Reduce data payload
    if (adaptedData.metadata) {
      delete adaptedData.metadata.detailed_analytics
      adaptations.push('metadata_reduction')
    }
  }

  if (bandwidthInfo.latency_ms > 200) {
    // Prioritize critical data
    adaptedData = {
      critical: adaptedData.critical || {},
      // Remove non-critical data
    }
    adaptations.push('latency_optimization')
  }

  return {
    data: adaptedData,
    adaptations
  }
}