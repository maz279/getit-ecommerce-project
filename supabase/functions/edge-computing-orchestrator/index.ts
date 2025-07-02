import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EdgeRequest {
  content_type: string;
  content_key: string;
  user_location?: {
    country: string;
    region: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  };
  bandwidth_info?: {
    speed_kbps: number;
    stability_score: number;
  };
  device_info?: {
    type: string;
    capabilities: string[];
  };
}

interface EdgeNode {
  id: string;
  node_name: string;
  geographic_region: string;
  country_code: string;
  city: string;
  coordinates: { lat: number; lng: number };
  current_load: number;
  health_status: string;
  optimization_config: any;
  rural_optimization_enabled: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { content_type, content_key, user_location, bandwidth_info, device_info }: EdgeRequest = await req.json();

    // Get optimal edge node based on location and load
    const optimalNode = await selectOptimalEdgeNode(
      user_location,
      bandwidth_info,
      supabaseClient
    );

    if (!optimalNode) {
      return new Response(JSON.stringify({
        error: 'No suitable edge node found',
        fallback_strategy: 'use_origin_server'
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if content is already cached at the edge
    const { data: cachedContent } = await supabaseClient
      .from('content_optimization_cache')
      .select('*')
      .eq('content_key', content_key)
      .eq('edge_node_id', optimalNode.id)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedContent) {
      // Content found in edge cache
      const response = await serveFromEdgeCache(cachedContent, optimalNode);
      
      // Update edge node load
      await updateEdgeNodeLoad(optimalNode.id, supabaseClient);
      
      return response;
    }

    // Content not in edge cache - fetch, optimize, and cache
    const optimizedContent = await fetchOptimizeAndCache(
      content_key,
      content_type,
      optimalNode,
      bandwidth_info,
      device_info,
      supabaseClient
    );

    return new Response(JSON.stringify({
      content: optimizedContent.content,
      edge_node: optimalNode.node_name,
      optimization_applied: optimizedContent.optimizations,
      cache_status: 'miss',
      rural_optimized: optimizedContent.rural_optimized
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Edge orchestrator error:', error);
    return new Response(JSON.stringify({
      error: 'Edge processing failed',
      fallback_strategy: 'use_origin_server'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function selectOptimalEdgeNode(
  userLocation: any,
  bandwidthInfo: any,
  supabaseClient: any
): Promise<EdgeNode | null> {
  let query = supabaseClient
    .from('edge_nodes')
    .select('*')
    .eq('health_status', 'healthy')
    .lt('current_load', 80); // Don't use overloaded nodes

  // Prefer nodes in same country
  if (userLocation?.country) {
    query = query.eq('country_code', userLocation.country);
  }

  // Enable rural optimization for low bandwidth
  if (bandwidthInfo?.speed_kbps < 512) {
    query = query.eq('rural_optimization_enabled', true);
  }

  const { data: nodes } = await query;

  if (!nodes || nodes.length === 0) {
    // Fallback to any healthy node
    const { data: fallbackNodes } = await supabaseClient
      .from('edge_nodes')
      .select('*')
      .eq('health_status', 'healthy')
      .order('current_load', { ascending: true })
      .limit(1);

    return fallbackNodes?.[0] || null;
  }

  // Calculate distance-based scores if coordinates available
  if (userLocation?.coordinates) {
    const scoredNodes = nodes.map(node => ({
      ...node,
      score: calculateNodeScore(node, userLocation, bandwidthInfo)
    }));

    scoredNodes.sort((a, b) => b.score - a.score);
    return scoredNodes[0];
  }

  // Return node with lowest load
  nodes.sort((a, b) => a.current_load - b.current_load);
  return nodes[0];
}

function calculateNodeScore(
  node: EdgeNode,
  userLocation: any,
  bandwidthInfo: any
): number {
  let score = 100;

  // Distance penalty
  if (userLocation.coordinates && node.coordinates) {
    const distance = calculateDistance(
      userLocation.coordinates,
      node.coordinates
    );
    score -= Math.min(distance * 0.01, 50); // Max 50 point penalty for distance
  }

  // Load penalty
  score -= node.current_load * 0.5;

  // Rural optimization bonus
  if (bandwidthInfo?.speed_kbps < 512 && node.rural_optimization_enabled) {
    score += 20;
  }

  // Same country bonus
  if (userLocation.country === node.country_code) {
    score += 15;
  }

  return Math.max(score, 0);
}

function calculateDistance(coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}): number {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function serveFromEdgeCache(cachedContent: any, node: EdgeNode): Promise<Response> {
  return new Response(JSON.stringify({
    content: cachedContent.optimized_content,
    edge_node: node.node_name,
    cache_status: 'hit',
    compression_ratio: cachedContent.compression_ratio,
    rural_optimized: cachedContent.rural_optimized
  }), {
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json',
      'X-Edge-Cache': 'HIT',
      'X-Edge-Node': node.node_name
    }
  });
}

async function fetchOptimizeAndCache(
  contentKey: string,
  contentType: string,
  node: EdgeNode,
  bandwidthInfo: any,
  deviceInfo: any,
  supabaseClient: any
): Promise<any> {
  // Simulate fetching content from origin
  const originalContent = await fetchFromOrigin(contentKey, contentType);
  
  // Apply optimizations based on node config and user constraints
  const optimizedContent = await applyOptimizations(
    originalContent,
    contentType,
    node.optimization_config,
    bandwidthInfo,
    deviceInfo,
    node.rural_optimization_enabled
  );

  // Cache the optimized content
  const cacheExpiry = new Date();
  cacheExpiry.setHours(cacheExpiry.getHours() + 24); // Cache for 24 hours

  await supabaseClient
    .from('content_optimization_cache')
    .insert({
      content_key: contentKey,
      content_type: contentType,
      original_size_bytes: originalContent.length,
      optimized_size_bytes: optimizedContent.content.length,
      compression_ratio: optimizedContent.content.length / originalContent.length,
      edge_node_id: node.id,
      geographic_region: node.geographic_region,
      rural_optimized: node.rural_optimization_enabled && (bandwidthInfo?.speed_kbps < 512),
      expires_at: cacheExpiry.toISOString()
    });

  return optimizedContent;
}

async function fetchFromOrigin(contentKey: string, contentType: string): Promise<string> {
  // In production, would fetch from actual origin servers
  // For now, return mock content
  const mockContent = {
    'image': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//2Q==', // Mock image
    'api_response': JSON.stringify({ data: 'sample api response', items: [1,2,3] }),
    'html': '<html><body><h1>Sample HTML Content</h1></body></html>',
    'json': JSON.stringify({ message: 'Sample JSON content', timestamp: Date.now() })
  };

  return mockContent[contentType as keyof typeof mockContent] || 'Sample content';
}

async function applyOptimizations(
  content: string,
  contentType: string,
  nodeConfig: any,
  bandwidthInfo: any,
  deviceInfo: any,
  ruralOptimization: boolean
): Promise<{ content: string; optimizations: string[]; rural_optimized: boolean }> {
  let optimizedContent = content;
  const optimizations: string[] = [];
  const isLowBandwidth = bandwidthInfo?.speed_kbps < 512;
  
  if (contentType === 'image') {
    // Image optimizations
    if (isLowBandwidth || ruralOptimization) {
      optimizedContent = optimizedContent.substring(0, Math.floor(optimizedContent.length * 0.3));
      optimizations.push('aggressive_compression', 'resolution_reduction');
    } else {
      optimizedContent = optimizedContent.substring(0, Math.floor(optimizedContent.length * 0.7));
      optimizations.push('standard_compression');
    }
  }

  if (contentType === 'json' || contentType === 'api_response') {
    // JSON minification and field filtering
    try {
      const parsed = JSON.parse(optimizedContent);
      if (isLowBandwidth) {
        // Remove non-essential fields for low bandwidth
        delete parsed.metadata;
        delete parsed.debug_info;
        optimizations.push('field_reduction');
      }
      optimizedContent = JSON.stringify(parsed);
      optimizations.push('minification');
    } catch (e) {
      // If not valid JSON, apply string compression
      optimizations.push('string_compression');
    }
  }

  if (contentType === 'html') {
    // HTML optimizations
    optimizedContent = optimizedContent
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/<!--.*?-->/g, ''); // Remove comments
    
    if (isLowBandwidth) {
      // Remove non-essential elements
      optimizedContent = optimizedContent.replace(/<script.*?<\/script>/g, '');
      optimizations.push('script_removal');
    }
    
    optimizations.push('minification', 'comment_removal');
  }

  // Apply gzip-like compression simulation
  if (ruralOptimization) {
    optimizedContent = optimizedContent.substring(0, Math.floor(optimizedContent.length * 0.6));
    optimizations.push('rural_compression');
  }

  return {
    content: optimizedContent,
    optimizations,
    rural_optimized: ruralOptimization && isLowBandwidth
  };
}

async function updateEdgeNodeLoad(nodeId: string, supabaseClient: any): Promise<void> {
  // Call the database function to update load
  await supabaseClient.rpc('calculate_edge_node_load', {
    p_node_id: nodeId
  });
}