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

interface ServiceMeshConfig {
  services: {
    [serviceName: string]: {
      replicas: number;
      healthCheck: {
        path: string;
        interval: number;
        timeout: number;
        retries: number;
      };
      resources: {
        cpu: string;
        memory: string;
      };
      scaling: {
        minReplicas: number;
        maxReplicas: number;
        targetCPU: number;
        targetMemory: number;
      };
      circuit_breaker: {
        enabled: boolean;
        failure_threshold: number;
        recovery_timeout: number;
        request_timeout: number;
      };
      rate_limiting: {
        enabled: boolean;
        requests_per_minute: number;
        burst_size: number;
      };
      load_balancing: {
        strategy: 'round_robin' | 'least_connections' | 'weighted_round_robin';
        weights?: { [replica: string]: number };
      };
      security: {
        tls_enabled: boolean;
        mutual_tls: boolean;
        allowed_origins: string[];
        jwt_validation: boolean;
      };
    };
  };
  global_policies: {
    default_timeout: number;
    default_retries: number;
    observability: {
      tracing_enabled: boolean;
      metrics_enabled: boolean;
      logging_level: string;
    };
    security: {
      enforce_https: boolean;
      cors_enabled: boolean;
      rate_limiting_enabled: boolean;
    };
  };
}

const serviceMeshConfig: ServiceMeshConfig = {
  services: {
    'product-service': {
      replicas: 3,
      healthCheck: { path: '/health', interval: 30000, timeout: 5000, retries: 3 },
      resources: { cpu: '500m', memory: '512Mi' },
      scaling: { minReplicas: 2, maxReplicas: 10, targetCPU: 70, targetMemory: 80 },
      circuit_breaker: { enabled: true, failure_threshold: 5, recovery_timeout: 30000, request_timeout: 10000 },
      rate_limiting: { enabled: true, requests_per_minute: 1000, burst_size: 100 },
      load_balancing: { strategy: 'round_robin' },
      security: { tls_enabled: true, mutual_tls: false, allowed_origins: ['*'], jwt_validation: true }
    },
    'order-service': {
      replicas: 4,
      healthCheck: { path: '/health', interval: 20000, timeout: 3000, retries: 2 },
      resources: { cpu: '750m', memory: '1Gi' },
      scaling: { minReplicas: 3, maxReplicas: 15, targetCPU: 60, targetMemory: 75 },
      circuit_breaker: { enabled: true, failure_threshold: 3, recovery_timeout: 20000, request_timeout: 8000 },
      rate_limiting: { enabled: true, requests_per_minute: 800, burst_size: 80 },
      load_balancing: { strategy: 'least_connections' },
      security: { tls_enabled: true, mutual_tls: true, allowed_origins: ['*.getit.com'], jwt_validation: true }
    },
    'payment-processing': {
      replicas: 5,
      healthCheck: { path: '/health', interval: 15000, timeout: 2000, retries: 1 },
      resources: { cpu: '1000m', memory: '2Gi' },
      scaling: { minReplicas: 4, maxReplicas: 20, targetCPU: 50, targetMemory: 70 },
      circuit_breaker: { enabled: true, failure_threshold: 2, recovery_timeout: 15000, request_timeout: 5000 },
      rate_limiting: { enabled: true, requests_per_minute: 500, burst_size: 50 },
      load_balancing: { strategy: 'weighted_round_robin', weights: { 'replica-1': 3, 'replica-2': 2, 'replica-3': 1 } },
      security: { tls_enabled: true, mutual_tls: true, allowed_origins: ['*.getit.com'], jwt_validation: true }
    },
    'user-management-api': {
      replicas: 3,
      healthCheck: { path: '/health', interval: 25000, timeout: 4000, retries: 2 },
      resources: { cpu: '400m', memory: '512Mi' },
      scaling: { minReplicas: 2, maxReplicas: 8, targetCPU: 65, targetMemory: 75 },
      circuit_breaker: { enabled: true, failure_threshold: 4, recovery_timeout: 25000, request_timeout: 12000 },
      rate_limiting: { enabled: true, requests_per_minute: 1200, burst_size: 120 },
      load_balancing: { strategy: 'round_robin' },
      security: { tls_enabled: true, mutual_tls: false, allowed_origins: ['*'], jwt_validation: true }
    },
    'analytics-engine': {
      replicas: 2,
      healthCheck: { path: '/health', interval: 45000, timeout: 8000, retries: 3 },
      resources: { cpu: '1500m', memory: '4Gi' },
      scaling: { minReplicas: 1, maxReplicas: 6, targetCPU: 80, targetMemory: 85 },
      circuit_breaker: { enabled: true, failure_threshold: 6, recovery_timeout: 45000, request_timeout: 30000 },
      rate_limiting: { enabled: true, requests_per_minute: 200, burst_size: 20 },
      load_balancing: { strategy: 'least_connections' },
      security: { tls_enabled: true, mutual_tls: false, allowed_origins: ['*.getit.com'], jwt_validation: true }
    }
  },
  global_policies: {
    default_timeout: 30000,
    default_retries: 3,
    observability: {
      tracing_enabled: true,
      metrics_enabled: true,
      logging_level: 'info'
    },
    security: {
      enforce_https: true,
      cors_enabled: true,
      rate_limiting_enabled: true
    }
  }
};

interface ServiceInstance {
  id: string;
  service_name: string;
  status: 'healthy' | 'unhealthy' | 'starting' | 'stopping';
  last_health_check: Date;
  response_time: number;
  error_count: number;
  request_count: number;
  cpu_usage: number;
  memory_usage: number;
  replica_index: number;
}

const serviceInstances = new Map<string, ServiceInstance[]>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    switch (path) {
      case '/mesh/status':
        return await getMeshStatus();
      
      case '/mesh/config':
        return await getMeshConfig();
      
      case '/mesh/services':
        return await getServiceInstances();
      
      case '/mesh/health':
        return await performHealthChecks();
      
      case '/mesh/scale':
        return await handleScaling(req);
      
      case '/mesh/circuit-breaker':
        return await getCircuitBreakerStatus();
      
      case '/mesh/metrics':
        return await getServiceMetrics();
      
      case '/mesh/proxy':
        return await handleServiceProxy(req);
      
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Service Mesh Controller Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function getMeshStatus(): Promise<Response> {
  const status = {
    mesh_healthy: true,
    total_services: Object.keys(serviceMeshConfig.services).length,
    healthy_services: 0,
    unhealthy_services: 0,
    total_instances: 0,
    timestamp: new Date().toISOString(),
    global_policies: serviceMeshConfig.global_policies
  };

  for (const [serviceName, instances] of serviceInstances) {
    status.total_instances += instances.length;
    
    const healthyInstances = instances.filter(i => i.status === 'healthy').length;
    if (healthyInstances > 0) {
      status.healthy_services++;
    } else {
      status.unhealthy_services++;
    }
  }

  status.mesh_healthy = status.unhealthy_services === 0;

  return new Response(JSON.stringify(status), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getMeshConfig(): Promise<Response> {
  return new Response(JSON.stringify(serviceMeshConfig), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getServiceInstances(): Promise<Response> {
  const instances: { [serviceName: string]: ServiceInstance[] } = {};
  
  for (const [serviceName, serviceInstances_] of serviceInstances) {
    instances[serviceName] = serviceInstances_;
  }

  return new Response(JSON.stringify(instances), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function performHealthChecks(): Promise<Response> {
  const healthResults: { [serviceName: string]: { healthy: number; total: number; status: string } } = {};

  for (const serviceName of Object.keys(serviceMeshConfig.services)) {
    const config = serviceMeshConfig.services[serviceName];
    const instances = serviceInstances.get(serviceName) || [];
    
    let healthyCount = 0;
    
    for (const instance of instances) {
      try {
        // Simulate health check
        const isHealthy = await simulateHealthCheck(serviceName, instance);
        
        if (isHealthy) {
          instance.status = 'healthy';
          instance.error_count = Math.max(0, instance.error_count - 1);
          healthyCount++;
        } else {
          instance.status = 'unhealthy';
          instance.error_count++;
        }
        
        instance.last_health_check = new Date();
        instance.response_time = Math.random() * 1000; // Simulate response time
        
      } catch (error) {
        instance.status = 'unhealthy';
        instance.error_count++;
        console.error(`Health check failed for ${serviceName}:${instance.id}`, error);
      }
    }
    
    healthResults[serviceName] = {
      healthy: healthyCount,
      total: instances.length,
      status: healthyCount > 0 ? 'operational' : 'down'
    };
  }

  return new Response(JSON.stringify(healthResults), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function simulateHealthCheck(serviceName: string, instance: ServiceInstance): Promise<boolean> {
  // Simulate health check by calling the actual service
  try {
    const config = serviceMeshConfig.services[serviceName];
    const healthUrl = `https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/${serviceName}${config.healthCheck.path}`;
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: { 'X-Health-Check': 'true' },
      signal: AbortSignal.timeout(config.healthCheck.timeout)
    });
    
    return response.ok;
  } catch {
    // Simulate random health status for demonstration
    return Math.random() > 0.1; // 90% healthy rate
  }
}

async function handleScaling(req: Request): Promise<Response> {
  const body = await req.json();
  const { service_name, action, replicas } = body;

  if (!serviceMeshConfig.services[service_name]) {
    return new Response(JSON.stringify({ error: 'Service not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const config = serviceMeshConfig.services[service_name];
  
  switch (action) {
    case 'scale_up':
      await scaleService(service_name, Math.min(replicas || config.replicas + 1, config.scaling.maxReplicas));
      break;
    
    case 'scale_down':
      await scaleService(service_name, Math.max(replicas || config.replicas - 1, config.scaling.minReplicas));
      break;
    
    case 'auto_scale':
      await autoScaleService(service_name);
      break;
    
    default:
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    service: service_name, 
    new_replicas: serviceMeshConfig.services[service_name].replicas 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function scaleService(serviceName: string, targetReplicas: number): Promise<void> {
  const config = serviceMeshConfig.services[serviceName];
  const currentInstances = serviceInstances.get(serviceName) || [];
  
  config.replicas = targetReplicas;
  
  if (targetReplicas > currentInstances.length) {
    // Scale up - add instances
    for (let i = currentInstances.length; i < targetReplicas; i++) {
      const newInstance: ServiceInstance = {
        id: `${serviceName}-${i}`,
        service_name: serviceName,
        status: 'starting',
        last_health_check: new Date(),
        response_time: 0,
        error_count: 0,
        request_count: 0,
        cpu_usage: 0,
        memory_usage: 0,
        replica_index: i
      };
      
      currentInstances.push(newInstance);
    }
  } else if (targetReplicas < currentInstances.length) {
    // Scale down - remove instances
    currentInstances.splice(targetReplicas);
  }
  
  serviceInstances.set(serviceName, currentInstances);
  
  // Log scaling event
  console.log(`Scaled ${serviceName} to ${targetReplicas} replicas`);
}

async function autoScaleService(serviceName: string): Promise<void> {
  const config = serviceMeshConfig.services[serviceName];
  const instances = serviceInstances.get(serviceName) || [];
  
  // Calculate average resource usage
  const avgCPU = instances.reduce((sum, inst) => sum + inst.cpu_usage, 0) / instances.length;
  const avgMemory = instances.reduce((sum, inst) => sum + inst.memory_usage, 0) / instances.length;
  
  let targetReplicas = config.replicas;
  
  if (avgCPU > config.scaling.targetCPU || avgMemory > config.scaling.targetMemory) {
    // Scale up
    targetReplicas = Math.min(config.replicas + 1, config.scaling.maxReplicas);
  } else if (avgCPU < config.scaling.targetCPU * 0.5 && avgMemory < config.scaling.targetMemory * 0.5) {
    // Scale down
    targetReplicas = Math.max(config.replicas - 1, config.scaling.minReplicas);
  }
  
  if (targetReplicas !== config.replicas) {
    await scaleService(serviceName, targetReplicas);
  }
}

async function getCircuitBreakerStatus(): Promise<Response> {
  const status: { [serviceName: string]: any } = {};
  
  for (const serviceName of Object.keys(serviceMeshConfig.services)) {
    const config = serviceMeshConfig.services[serviceName];
    const instances = serviceInstances.get(serviceName) || [];
    
    const failureRate = instances.reduce((sum, inst) => sum + inst.error_count, 0) / Math.max(instances.length, 1);
    const isOpen = failureRate >= config.circuit_breaker.failure_threshold;
    
    status[serviceName] = {
      enabled: config.circuit_breaker.enabled,
      state: isOpen ? 'open' : 'closed',
      failure_rate: failureRate,
      threshold: config.circuit_breaker.failure_threshold,
      recovery_timeout: config.circuit_breaker.recovery_timeout
    };
  }

  return new Response(JSON.stringify(status), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getServiceMetrics(): Promise<Response> {
  const metrics: { [serviceName: string]: any } = {};
  
  for (const [serviceName, instances] of serviceInstances) {
    const totalRequests = instances.reduce((sum, inst) => sum + inst.request_count, 0);
    const totalErrors = instances.reduce((sum, inst) => sum + inst.error_count, 0);
    const avgResponseTime = instances.reduce((sum, inst) => sum + inst.response_time, 0) / instances.length;
    
    metrics[serviceName] = {
      instances: instances.length,
      total_requests: totalRequests,
      total_errors: totalErrors,
      error_rate: totalRequests > 0 ? totalErrors / totalRequests : 0,
      avg_response_time: avgResponseTime,
      healthy_instances: instances.filter(i => i.status === 'healthy').length
    };
  }

  return new Response(JSON.stringify(metrics), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleServiceProxy(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const targetService = url.searchParams.get('service');
  const targetPath = url.searchParams.get('path') || '/';
  
  if (!targetService) {
    return new Response(JSON.stringify({ error: 'Service parameter required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Apply mesh policies (rate limiting, circuit breaker, etc.)
  const config = serviceMeshConfig.services[targetService];
  if (!config) {
    return new Response(JSON.stringify({ error: 'Service not found in mesh' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Select healthy instance using load balancing strategy
  const instances = serviceInstances.get(targetService) || [];
  const healthyInstances = instances.filter(i => i.status === 'healthy');
  
  if (healthyInstances.length === 0) {
    return new Response(JSON.stringify({ error: 'No healthy instances available' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const selectedInstance = selectInstanceByStrategy(healthyInstances, config.load_balancing.strategy);
  
  // Forward request with mesh headers
  try {
    const serviceUrl = `https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/${targetService}${targetPath}`;
    
    const headers = new Headers(req.headers);
    headers.set('X-Mesh-Service', targetService);
    headers.set('X-Mesh-Instance', selectedInstance.id);
    headers.set('X-Mesh-Timestamp', new Date().toISOString());
    
    const response = await fetch(serviceUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      signal: AbortSignal.timeout(config.circuit_breaker.request_timeout)
    });
    
    // Update instance metrics
    selectedInstance.request_count++;
    if (!response.ok) {
      selectedInstance.error_count++;
    }
    
    return response;
    
  } catch (error) {
    selectedInstance.error_count++;
    throw error;
  }
}

function selectInstanceByStrategy(instances: ServiceInstance[], strategy: string): ServiceInstance {
  switch (strategy) {
    case 'least_connections':
      return instances.reduce((prev, current) => 
        current.request_count < prev.request_count ? current : prev
      );
    
    case 'weighted_round_robin':
      // Simple round-robin for now
      return instances[Math.floor(Math.random() * instances.length)];
    
    case 'round_robin':
    default:
      return instances[Math.floor(Math.random() * instances.length)];
  }
}

// Initialize service instances
function initializeServiceInstances() {
  for (const [serviceName, config] of Object.entries(serviceMeshConfig.services)) {
    const instances: ServiceInstance[] = [];
    
    for (let i = 0; i < config.replicas; i++) {
      instances.push({
        id: `${serviceName}-${i}`,
        service_name: serviceName,
        status: 'healthy',
        last_health_check: new Date(),
        response_time: Math.random() * 100,
        error_count: 0,
        request_count: 0,
        cpu_usage: Math.random() * 50,
        memory_usage: Math.random() * 60,
        replica_index: i
      });
    }
    
    serviceInstances.set(serviceName, instances);
  }
}

// Start periodic health checks
function startHealthCheckScheduler() {
  setInterval(async () => {
    try {
      await performHealthChecks();
    } catch (error) {
      console.error('Health check scheduler error:', error);
    }
  }, 30000); // Every 30 seconds
}

// Start auto-scaling scheduler
function startAutoScalingScheduler() {
  setInterval(async () => {
    try {
      for (const serviceName of Object.keys(serviceMeshConfig.services)) {
        await autoScaleService(serviceName);
      }
    } catch (error) {
      console.error('Auto-scaling scheduler error:', error);
    }
  }, 60000); // Every minute
}

// Initialize on startup
initializeServiceInstances();
startHealthCheckScheduler();
startAutoScalingScheduler();