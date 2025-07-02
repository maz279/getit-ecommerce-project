import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GRPCTranscodeRequest {
  service: string;
  method: string;
  data: any;
  headers?: Record<string, string>;
}

interface GRPCService {
  id: string;
  service_name: string;
  endpoint_url: string;
  proto_definition: string;
  health_check_config: any;
  load_balancing_config: any;
  is_active: boolean;
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

    const { service, method, data, headers: requestHeaders }: GRPCTranscodeRequest = await req.json();

    // Get gRPC service configuration
    const { data: grpcService } = await supabaseClient
      .from('grpc_services')
      .select('*')
      .eq('service_name', service)
      .eq('is_active', true)
      .single();

    if (!grpcService) {
      return new Response(JSON.stringify({
        error: 'Service not found',
        code: 'SERVICE_NOT_FOUND'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check service health
    const healthStatus = await checkServiceHealth(grpcService);
    if (healthStatus.status !== 'healthy') {
      return new Response(JSON.stringify({
        error: 'Service unavailable',
        code: 'SERVICE_UNAVAILABLE',
        health: healthStatus
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();

    // Load balance if multiple endpoints
    const selectedEndpoint = await selectHealthyEndpoint(grpcService, supabaseClient);
    
    // Transcode HTTP to gRPC
    const grpcResult = await transcodeHttpToGrpc(
      selectedEndpoint,
      service,
      method,
      data,
      requestHeaders || {}
    );

    const executionTime = Date.now() - startTime;

    // Log metrics
    await Promise.all([
      // Update load balancing metrics
      supabaseClient
        .from('grpc_load_balancing_metrics')
        .upsert({
          service_id: grpcService.id,
          endpoint_url: selectedEndpoint,
          request_count: 1,
          success_rate: grpcResult.success ? 100 : 0,
          avg_response_time_ms: executionTime,
          current_load_score: calculateLoadScore(executionTime)
        }),
      
      // Log health check
      supabaseClient
        .from('grpc_health_checks')
        .insert({
          service_id: grpcService.id,
          status: grpcResult.success ? 'healthy' : 'unhealthy',
          response_time_ms: executionTime,
          error_message: grpcResult.error
        })
    ]);

    if (!grpcResult.success) {
      return new Response(JSON.stringify({
        error: grpcResult.error,
        code: 'GRPC_ERROR'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(grpcResult.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('gRPC Gateway error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function checkServiceHealth(service: GRPCService): Promise<{ status: string; responseTime?: number }> {
  try {
    const startTime = Date.now();
    
    // In production, would make actual gRPC health check
    // For now, simulate health check
    const healthEndpoint = `${service.endpoint_url}/health`;
    
    const response = await fetch(healthEndpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    }).catch(() => null);

    const responseTime = Date.now() - startTime;

    if (response && response.ok) {
      return { status: 'healthy', responseTime };
    }

    return { status: 'unhealthy', responseTime };
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unknown' };
  }
}

async function selectHealthyEndpoint(service: GRPCService, supabaseClient: any): Promise<string> {
  // Get load balancing metrics
  const { data: metrics } = await supabaseClient
    .from('grpc_load_balancing_metrics')
    .select('*')
    .eq('service_id', service.id)
    .order('current_load_score', { ascending: true })
    .limit(1);

  if (metrics && metrics.length > 0) {
    return metrics[0].endpoint_url;
  }

  // Default to main endpoint
  return service.endpoint_url;
}

async function transcodeHttpToGrpc(
  endpoint: string,
  service: string,
  method: string,
  data: any,
  headers: Record<string, string>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // In production, would use actual gRPC client libraries
    // For now, simulate gRPC call with HTTP
    
    const grpcEndpoint = `${endpoint}/${service}/${method}`;
    
    const response = await fetch(grpcEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GRPC-Transcoded': 'true',
        ...headers
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();
    
    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('gRPC transcoding error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function calculateLoadScore(responseTime: number): number {
  // Simple load score calculation
  // Lower response time = lower load score (better)
  if (responseTime < 100) return 10;
  if (responseTime < 500) return 30;
  if (responseTime < 1000) return 60;
  if (responseTime < 2000) return 80;
  return 100;
}

// Health check endpoint
serve(async (req) => {
  if (req.url.includes('/health')) {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'grpc-gateway'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  // Main handler logic above...
});