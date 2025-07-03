import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ServiceRegistry {
  [key: string]: {
    endpoint: string;
    health: boolean;
    lastCheck: number;
    loadScore: number;
    version: string;
  };
}

interface RoutingConfig {
  [key: string]: {
    services: string[];
    strategy: 'round-robin' | 'least-connections' | 'weighted';
    circuitBreaker: {
      failureThreshold: number;
      timeout: number;
      monitorWindow: number;
    };
  };
}

// Global service registry
const serviceRegistry: ServiceRegistry = {};
const routingConfig: RoutingConfig = {
  '/products': {
    services: ['product-service', 'enhanced-products-api'],
    strategy: 'round-robin',
    circuitBreaker: { failureThreshold: 5, timeout: 30000, monitorWindow: 60000 }
  },
  '/orders': {
    services: ['order-service', 'orders-api'],
    strategy: 'least-connections',
    circuitBreaker: { failureThreshold: 3, timeout: 15000, monitorWindow: 30000 }
  },
  '/payments': {
    services: ['payment-processing', 'bangladesh-payment-gateway'],
    strategy: 'weighted',
    circuitBreaker: { failureThreshold: 2, timeout: 10000, monitorWindow: 20000 }
  },
  '/users': {
    services: ['user-management-api', 'auth-api'],
    strategy: 'round-robin',
    circuitBreaker: { failureThreshold: 5, timeout: 20000, monitorWindow: 40000 }
  },
  '/vendors': {
    services: ['vendor-management-api', 'vendor-financial-management'],
    strategy: 'least-connections',
    circuitBreaker: { failureThreshold: 4, timeout: 25000, monitorWindow: 50000 }
  },
  '/search': {
    services: ['enhanced-search-service', 'ai-enhanced-search'],
    strategy: 'weighted',
    circuitBreaker: { failureThreshold: 3, timeout: 20000, monitorWindow: 30000 }
  },
  '/analytics': {
    services: ['analytics-engine', 'advanced-analytics-service'],
    strategy: 'round-robin',
    circuitBreaker: { failureThreshold: 5, timeout: 30000, monitorWindow: 60000 }
  },
  '/ml': {
    services: ['ml-recommendation-engine', 'ai-recommendation-engine'],
    strategy: 'least-connections',
    circuitBreaker: { failureThreshold: 3, timeout: 25000, monitorWindow: 45000 }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // Health check endpoint
    if (path === '/health') {
      return await handleHealthCheck();
    }

    // Service discovery endpoint
    if (path === '/discovery') {
      return await handleServiceDiscovery();
    }

    // Route request to appropriate microservice
    const response = await routeRequest(req, path);
    
    // Log request metrics
    await logRequestMetrics(req, response, Date.now() - startTime);
    
    return response;
    
  } catch (error) {
    console.error('API Gateway Error:', error);
    
    // Circuit breaker fallback
    const fallbackResponse = await handleFallback(path, error);
    return fallbackResponse;
  }
});

async function routeRequest(req: Request, path: string): Promise<Response> {
  const route = findMatchingRoute(path);
  if (!route) {
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const config = routingConfig[route];
  const availableServices = await getHealthyServices(config.services);
  
  if (availableServices.length === 0) {
    return new Response(JSON.stringify({ error: 'No healthy services available' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const targetService = selectService(availableServices, config.strategy);
  
  // Forward request to selected service
  try {
    const serviceResponse = await forwardRequest(req, targetService);
    
    // Update service health based on response
    await updateServiceHealth(targetService, true, Date.now());
    
    return serviceResponse;
    
  } catch (error) {
    // Update service health and apply circuit breaker
    await updateServiceHealth(targetService, false, Date.now());
    
    // Check circuit breaker
    if (await isCircuitBreakerOpen(targetService, config.circuitBreaker)) {
      throw new Error(`Circuit breaker open for ${targetService}`);
    }
    
    throw error;
  }
}

function findMatchingRoute(path: string): string | null {
  for (const route of Object.keys(routingConfig)) {
    if (path.startsWith(route)) {
      return route;
    }
  }
  return null;
}

async function getHealthyServices(services: string[]): Promise<string[]> {
  const healthy: string[] = [];
  
  for (const service of services) {
    const registration = serviceRegistry[service];
    if (registration && registration.health) {
      healthy.push(service);
    }
  }
  
  return healthy;
}

function selectService(services: string[], strategy: string): string {
  switch (strategy) {
    case 'round-robin':
      return services[Math.floor(Math.random() * services.length)];
    
    case 'least-connections':
      return services.reduce((prev, current) => 
        serviceRegistry[current].loadScore < serviceRegistry[prev].loadScore ? current : prev
      );
    
    case 'weighted':
      const totalWeight = services.reduce((sum, service) => 
        sum + (1 / (serviceRegistry[service].loadScore + 1)), 0);
      
      let random = Math.random() * totalWeight;
      for (const service of services) {
        random -= 1 / (serviceRegistry[service].loadScore + 1);
        if (random <= 0) return service;
      }
      return services[0];
    
    default:
      return services[0];
  }
}

async function forwardRequest(req: Request, serviceName: string): Promise<Response> {
  const serviceUrl = `https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/${serviceName}`;
  
  const headers = new Headers(req.headers);
  headers.set('X-Forwarded-By', 'api-gateway');
  headers.set('X-Service-Target', serviceName);
  
  const forwardedRequest = new Request(serviceUrl, {
    method: req.method,
    headers: headers,
    body: req.body,
  });

  const response = await fetch(forwardedRequest);
  
  // Add gateway headers
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('X-Gateway-Service', serviceName);
  responseHeaders.set('X-Gateway-Timestamp', new Date().toISOString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

async function updateServiceHealth(serviceName: string, isHealthy: boolean, timestamp: number) {
  if (!serviceRegistry[serviceName]) {
    serviceRegistry[serviceName] = {
      endpoint: serviceName,
      health: isHealthy,
      lastCheck: timestamp,
      loadScore: 0,
      version: '1.0.0'
    };
  } else {
    serviceRegistry[serviceName].health = isHealthy;
    serviceRegistry[serviceName].lastCheck = timestamp;
    
    // Update load score based on health
    if (isHealthy) {
      serviceRegistry[serviceName].loadScore = Math.max(0, serviceRegistry[serviceName].loadScore - 1);
    } else {
      serviceRegistry[serviceName].loadScore += 5;
    }
  }

  // Persist to database for monitoring
  try {
    await supabase.from('service_health_metrics').upsert({
      service_name: serviceName,
      health_score: isHealthy ? 100 : 0,
      last_health_check: new Date(timestamp).toISOString(),
      response_time_avg: 0,
      error_rate: isHealthy ? 0 : 1,
      cpu_utilization: 0,
      memory_utilization: 0
    });
  } catch (error) {
    console.error('Failed to update service health metrics:', error);
  }
}

async function isCircuitBreakerOpen(serviceName: string, config: any): Promise<boolean> {
  const service = serviceRegistry[serviceName];
  if (!service) return false;
  
  const now = Date.now();
  const windowStart = now - config.monitorWindow;
  
  // Simple circuit breaker logic
  if (service.loadScore >= config.failureThreshold && 
      (now - service.lastCheck) < config.timeout) {
    return true;
  }
  
  return false;
}

async function handleHealthCheck(): Promise<Response> {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: serviceRegistry,
    uptime: process.uptime?.() || 0,
    version: '1.0.0'
  };

  return new Response(JSON.stringify(healthStatus), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleServiceDiscovery(): Promise<Response> {
  return new Response(JSON.stringify({
    services: serviceRegistry,
    routes: Object.keys(routingConfig),
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleFallback(path: string, error: any): Promise<Response> {
  console.error(`Fallback triggered for ${path}:`, error);
  
  return new Response(JSON.stringify({
    error: 'Service temporarily unavailable',
    message: 'Please try again later',
    path: path,
    timestamp: new Date().toISOString(),
    fallback: true
  }), {
    status: 503,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function logRequestMetrics(req: Request, response: Response, duration: number) {
  try {
    const url = new URL(req.url);
    
    await supabase.from('api_gateway_logs').insert({
      type: 'request',
      data: {
        method: req.method,
        path: url.pathname,
        status: response.status,
        duration: duration,
        timestamp: new Date().toISOString(),
        user_agent: req.headers.get('user-agent'),
        ip: req.headers.get('x-forwarded-for') || 'unknown'
      }
    });
  } catch (error) {
    console.error('Failed to log request metrics:', error);
  }
}

// Initialize service registry with known services
async function initializeServiceRegistry() {
  const knownServices = [
    'product-service', 'enhanced-products-api', 'order-service', 'orders-api',
    'payment-processing', 'bangladesh-payment-gateway', 'user-management-api',
    'auth-api', 'vendor-management-api', 'vendor-financial-management',
    'enhanced-search-service', 'ai-enhanced-search', 'analytics-engine',
    'advanced-analytics-service', 'ml-recommendation-engine', 'ai-recommendation-engine'
  ];

  for (const service of knownServices) {
    serviceRegistry[service] = {
      endpoint: service,
      health: true,
      lastCheck: Date.now(),
      loadScore: 0,
      version: '1.0.0'
    };
  }
}

// Initialize on startup
initializeServiceRegistry();