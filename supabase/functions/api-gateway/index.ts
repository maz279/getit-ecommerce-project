import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Service Registry
const serviceRegistry = new Map([
  ['user-management-api', { baseUrl: '/functions/v1/user-management-api', authRequired: true }],
  ['vendor-management-api', { baseUrl: '/functions/v1/vendor-management-api', authRequired: true }],
  ['product-service', { baseUrl: '/functions/v1/product-service', authRequired: true }],
  ['payment-processing', { baseUrl: '/functions/v1/payment-processing', authRequired: true }],
  ['orders-api', { baseUrl: '/functions/v1/orders-api', authRequired: true }],
  ['notification-system', { baseUrl: '/functions/v1/notification-system', authRequired: true }],
  ['ai-enhanced-search', { baseUrl: '/functions/v1/ai-enhanced-search', authRequired: false }],
  ['ai-recommendation-engine', { baseUrl: '/functions/v1/ai-recommendation-engine', authRequired: false }],
  ['platform-monitoring', { baseUrl: '/functions/v1/platform-monitoring', authRequired: true }],
  ['ml-analytics-dashboard', { baseUrl: '/functions/v1/ml-analytics-dashboard', authRequired: true }],
  ['financial-management-service', { baseUrl: '/functions/v1/financial-management-service', authRequired: true }],
  ['advanced-fraud-detection', { baseUrl: '/functions/v1/advanced-fraud-prevention', authRequired: true }],
  ['supply-chain-optimizer', { baseUrl: '/functions/v1/supply-chain-optimizer', authRequired: true }],
  ['voice-search-engine', { baseUrl: '/functions/v1/voice-search-engine', authRequired: false }],
  ['ar-vr-engine', { baseUrl: '/functions/v1/ar-vr-engine', authRequired: false }],
  ['performance-monitor', { baseUrl: '/functions/v1/performance-monitor', authRequired: true }],
  ['realtime-event-gateway', { baseUrl: '/functions/v1/realtime-hub', authRequired: true }],
  ['infrastructure-manager', { baseUrl: '/functions/v1/infrastructure-manager', authRequired: true }],
]);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const { service, endpoint, method = 'GET', body: requestBody, headers = {} } = body;

    // Validate service exists
    const serviceConfig = serviceRegistry.get(service);
    if (!serviceConfig) {
      return new Response(
        JSON.stringify({ error: `Service ${service} not found` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Authentication check
    if (serviceConfig.authRequired) {
      const authHeader = headers['Authorization'];
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Route to appropriate service
    const serviceUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/${service}`;
    
    const response = await fetch(serviceUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        ...headers
      },
      body: requestBody ? JSON.stringify({ endpoint, data: requestBody }) : JSON.stringify({ endpoint })
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Gateway error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});