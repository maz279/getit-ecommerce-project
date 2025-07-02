import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

interface GraphQLSchema {
  id: string;
  service_name: string;
  schema_definition: string;
  federation_config: any;
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

    const { query, variables, operationName }: GraphQLRequest = await req.json();
    
    // Generate query hash for caching
    const queryHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(query + JSON.stringify(variables || {}))
    );
    const queryHashString = Array.from(new Uint8Array(queryHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Check cache first
    const { data: cachedResult } = await supabaseClient
      .from('graphql_query_cache')
      .select('*')
      .eq('query_hash', queryHashString)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedResult) {
      // Log cache hit
      await supabaseClient
        .from('graphql_federation_metrics')
        .insert({
          service_name: 'federation-gateway',
          operation_type: operationName || 'query',
          query_complexity: estimateQueryComplexity(query),
          execution_time_ms: 0,
          cache_hit: true
        });

      return new Response(JSON.stringify(cachedResult.cached_result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get active GraphQL schemas
    const { data: schemas } = await supabaseClient
      .from('graphql_schemas')
      .select('*')
      .eq('is_active', true);

    if (!schemas || schemas.length === 0) {
      return new Response(JSON.stringify({
        errors: [{ message: 'No active GraphQL schemas found' }]
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();
    
    // Federation logic - route query to appropriate services
    const federatedResult = await federateQuery(query, variables, schemas);
    
    const executionTime = Date.now() - startTime;
    
    // Cache the result
    const cacheExpiry = new Date();
    cacheExpiry.setMinutes(cacheExpiry.getMinutes() + 5); // Cache for 5 minutes
    
    await supabaseClient
      .from('graphql_query_cache')
      .upsert({
        query_hash: queryHashString,
        query_text: query,
        cached_result: federatedResult,
        ttl_seconds: 300,
        expires_at: cacheExpiry.toISOString()
      });

    // Log metrics
    await supabaseClient
      .from('graphql_federation_metrics')
      .insert({
        service_name: 'federation-gateway',
        operation_type: operationName || 'query',
        query_complexity: estimateQueryComplexity(query),
        execution_time_ms: executionTime,
        cache_hit: false,
        error_count: federatedResult.errors ? federatedResult.errors.length : 0
      });

    return new Response(JSON.stringify(federatedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('GraphQL Federation error:', error);
    return new Response(JSON.stringify({
      errors: [{ message: 'Internal server error', extensions: { code: 'INTERNAL_ERROR' } }]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function federateQuery(
  query: string, 
  variables: any, 
  schemas: GraphQLSchema[]
): Promise<any> {
  // Parse query to determine which services are needed
  const requiredServices = analyzeQueryForServices(query, schemas);
  
  if (requiredServices.length === 0) {
    return { errors: [{ message: 'No services found for this query' }] };
  }

  if (requiredServices.length === 1) {
    // Single service query
    return await executeServiceQuery(requiredServices[0], query, variables);
  }

  // Multi-service federation
  const results = await Promise.all(
    requiredServices.map(service => 
      executeServiceQuery(service, extractServiceQuery(query, service), variables)
    )
  );

  // Stitch results together
  return stitchResults(results, requiredServices);
}

function analyzeQueryForServices(query: string, schemas: GraphQLSchema[]): string[] {
  // Simple analysis - in production, would use proper GraphQL parsing
  const services: string[] = [];
  
  for (const schema of schemas) {
    const config = schema.federation_config;
    if (config.types) {
      for (const type of config.types) {
        if (query.includes(type)) {
          services.push(schema.service_name);
          break;
        }
      }
    }
  }

  return [...new Set(services)]; // Remove duplicates
}

async function executeServiceQuery(serviceName: string, query: string, variables: any): Promise<any> {
  // In production, this would make actual GraphQL requests to services
  // For now, return mock data based on service
  
  const mockData = {
    'product-service': {
      data: {
        products: [
          { id: '1', name: 'Sample Product', price: 1000 },
          { id: '2', name: 'Another Product', price: 1500 }
        ]
      }
    },
    'user-service': {
      data: {
        users: [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
        ]
      }
    },
    'order-service': {
      data: {
        orders: [
          { id: '1', userId: '1', productId: '1', quantity: 2, total: 2000 }
        ]
      }
    }
  };

  return mockData[serviceName as keyof typeof mockData] || { data: null };
}

function extractServiceQuery(fullQuery: string, serviceName: string): string {
  // In production, would extract relevant parts of the query for specific service
  return fullQuery;
}

function stitchResults(results: any[], services: string[]): any {
  // Simple stitching - in production would be more sophisticated
  const data: any = {};
  
  results.forEach((result, index) => {
    if (result.data) {
      Object.assign(data, result.data);
    }
  });

  return { data };
}

function estimateQueryComplexity(query: string): number {
  // Simple complexity estimation
  const fieldCount = (query.match(/\w+\s*\{/g) || []).length;
  const depthEstimate = (query.match(/\{/g) || []).length;
  return fieldCount + depthEstimate * 2;
}