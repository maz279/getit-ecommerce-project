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

interface ContainerSpec {
  name: string;
  image: string;
  tag: string;
  replicas: number;
  resources: {
    requests: { cpu: string; memory: string };
    limits: { cpu: string; memory: string };
  };
  ports: Array<{ name: string; port: number; protocol: string }>;
  environment: { [key: string]: string };
  volumes?: Array<{ name: string; mountPath: string; type: string }>;
  healthCheck: {
    httpGet?: { path: string; port: number };
    initialDelaySeconds: number;
    periodSeconds: number;
    timeoutSeconds: number;
    failureThreshold: number;
  };
  scaling: {
    minReplicas: number;
    maxReplicas: number;
    targetCPUUtilization: number;
    targetMemoryUtilization: number;
  };
}

interface DeploymentStatus {
  name: string;
  namespace: string;
  replicas: {
    desired: number;
    ready: number;
    available: number;
    unavailable: number;
  };
  status: 'deploying' | 'running' | 'failed' | 'scaling' | 'updating';
  lastUpdated: string;
  conditions: Array<{
    type: string;
    status: boolean;
    message: string;
    lastTransition: string;
  }>;
}

const containerSpecs: { [serviceName: string]: ContainerSpec } = {
  'api-gateway-orchestrator': {
    name: 'api-gateway',
    image: 'getit/api-gateway',
    tag: 'v1.0.0',
    replicas: 3,
    resources: {
      requests: { cpu: '200m', memory: '256Mi' },
      limits: { cpu: '500m', memory: '512Mi' }
    },
    ports: [{ name: 'http', port: 8080, protocol: 'TCP' }],
    environment: {
      'NODE_ENV': 'production',
      'LOG_LEVEL': 'info',
      'RATE_LIMIT_WINDOW': '60000',
      'RATE_LIMIT_MAX': '1000'
    },
    healthCheck: {
      httpGet: { path: '/health', port: 8080 },
      initialDelaySeconds: 30,
      periodSeconds: 10,
      timeoutSeconds: 5,
      failureThreshold: 3
    },
    scaling: {
      minReplicas: 2,
      maxReplicas: 10,
      targetCPUUtilization: 70,
      targetMemoryUtilization: 80
    }
  },
  'product-service': {
    name: 'product-service',
    image: 'getit/product-service',
    tag: 'v1.2.1',
    replicas: 4,
    resources: {
      requests: { cpu: '300m', memory: '512Mi' },
      limits: { cpu: '1000m', memory: '1Gi' }
    },
    ports: [{ name: 'http', port: 3000, protocol: 'TCP' }],
    environment: {
      'NODE_ENV': 'production',
      'DATABASE_URL': 'postgresql://product_db',
      'REDIS_URL': 'redis://redis-cluster',
      'ELASTICSEARCH_URL': 'http://elasticsearch:9200'
    },
    volumes: [
      { name: 'product-images', mountPath: '/app/uploads', type: 'persistentVolume' }
    ],
    healthCheck: {
      httpGet: { path: '/health', port: 3000 },
      initialDelaySeconds: 45,
      periodSeconds: 15,
      timeoutSeconds: 8,
      failureThreshold: 2
    },
    scaling: {
      minReplicas: 3,
      maxReplicas: 15,
      targetCPUUtilization: 65,
      targetMemoryUtilization: 75
    }
  },
  'order-service': {
    name: 'order-service',
    image: 'getit/order-service',
    tag: 'v1.1.0',
    replicas: 5,
    resources: {
      requests: { cpu: '400m', memory: '768Mi' },
      limits: { cpu: '1200m', memory: '1.5Gi' }
    },
    ports: [{ name: 'http', port: 3001, protocol: 'TCP' }],
    environment: {
      'NODE_ENV': 'production',
      'DATABASE_URL': 'postgresql://order_db',
      'MESSAGE_QUEUE_URL': 'amqp://rabbitmq',
      'PAYMENT_SERVICE_URL': 'http://payment-service:3002'
    },
    healthCheck: {
      httpGet: { path: '/health', port: 3001 },
      initialDelaySeconds: 60,
      periodSeconds: 20,
      timeoutSeconds: 10,
      failureThreshold: 2
    },
    scaling: {
      minReplicas: 4,
      maxReplicas: 20,
      targetCPUUtilization: 60,
      targetMemoryUtilization: 70
    }
  },
  'payment-processing': {
    name: 'payment-service',
    image: 'getit/payment-service',
    tag: 'v2.0.0',
    replicas: 6,
    resources: {
      requests: { cpu: '500m', memory: '1Gi' },
      limits: { cpu: '1500m', memory: '2Gi' }
    },
    ports: [{ name: 'http', port: 3002, protocol: 'TCP' }],
    environment: {
      'NODE_ENV': 'production',
      'DATABASE_URL': 'postgresql://payment_db',
      'ENCRYPTION_KEY': '${SECRET_ENCRYPTION_KEY}',
      'BKASH_API_URL': 'https://checkout.pay.bka.sh/v1.2.0-beta',
      'NAGAD_API_URL': 'https://api.mynagad.com/remote-payment-gateway-1.0/api'
    },
    healthCheck: {
      httpGet: { path: '/health', port: 3002 },
      initialDelaySeconds: 90,
      periodSeconds: 30,
      timeoutSeconds: 15,
      failureThreshold: 1
    },
    scaling: {
      minReplicas: 5,
      maxReplicas: 25,
      targetCPUUtilization: 50,
      targetMemoryUtilization: 65
    }
  },
  'user-management-api': {
    name: 'user-service',
    image: 'getit/user-service',
    tag: 'v1.0.3',
    replicas: 3,
    resources: {
      requests: { cpu: '250m', memory: '384Mi' },
      limits: { cpu: '750m', memory: '768Mi' }
    },
    ports: [{ name: 'http', port: 3003, protocol: 'TCP' }],
    environment: {
      'NODE_ENV': 'production',
      'DATABASE_URL': 'postgresql://user_db',
      'JWT_SECRET': '${SECRET_JWT_KEY}',
      'SESSION_STORE': 'redis://redis-cluster'
    },
    healthCheck: {
      httpGet: { path: '/health', port: 3003 },
      initialDelaySeconds: 30,
      periodSeconds: 15,
      timeoutSeconds: 5,
      failureThreshold: 3
    },
    scaling: {
      minReplicas: 2,
      maxReplicas: 12,
      targetCPUUtilization: 70,
      targetMemoryUtilization: 75
    }
  },
  'analytics-engine': {
    name: 'analytics-service',
    image: 'getit/analytics-service',
    tag: 'v1.3.0',
    replicas: 2,
    resources: {
      requests: { cpu: '800m', memory: '2Gi' },
      limits: { cpu: '2000m', memory: '4Gi' }
    },
    ports: [{ name: 'http', port: 3004, protocol: 'TCP' }],
    environment: {
      'NODE_ENV': 'production',
      'DATABASE_URL': 'postgresql://analytics_db',
      'CLICKHOUSE_URL': 'http://clickhouse:8123',
      'KAFKA_BROKERS': 'kafka-1:9092,kafka-2:9092,kafka-3:9092'
    },
    volumes: [
      { name: 'analytics-data', mountPath: '/app/data', type: 'persistentVolume' }
    ],
    healthCheck: {
      httpGet: { path: '/health', port: 3004 },
      initialDelaySeconds: 120,
      periodSeconds: 60,
      timeoutSeconds: 30,
      failureThreshold: 2
    },
    scaling: {
      minReplicas: 1,
      maxReplicas: 8,
      targetCPUUtilization: 80,
      targetMemoryUtilization: 85
    }
  }
};

const deploymentStatuses = new Map<string, DeploymentStatus>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    switch (path) {
      case '/orchestration/status':
        return await getOrchestrationStatus();
      
      case '/orchestration/deployments':
        return await getDeployments();
      
      case '/orchestration/deploy':
        return await handleDeploy(req);
      
      case '/orchestration/scale':
        return await handleScale(req);
      
      case '/orchestration/rollback':
        return await handleRollback(req);
      
      case '/orchestration/logs':
        return await getContainerLogs(req);
      
      case '/orchestration/resources':
        return await getResourceUsage();
      
      case '/orchestration/health':
        return await getClusterHealth();
      
      case '/orchestration/events':
        return await getClusterEvents();
      
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Container Orchestration Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function getOrchestrationStatus(): Promise<Response> {
  const totalServices = Object.keys(containerSpecs).length;
  let runningServices = 0;
  let totalPods = 0;
  let readyPods = 0;

  for (const [serviceName, status] of deploymentStatuses) {
    if (status.status === 'running') {
      runningServices++;
    }
    totalPods += status.replicas.desired;
    readyPods += status.replicas.ready;
  }

  const clusterStatus = {
    cluster_healthy: runningServices === totalServices,
    total_services: totalServices,
    running_services: runningServices,
    failed_services: totalServices - runningServices,
    total_pods: totalPods,
    ready_pods: readyPods,
    resource_utilization: {
      cpu_usage: Math.random() * 70 + 20, // Simulated
      memory_usage: Math.random() * 60 + 30, // Simulated
      storage_usage: Math.random() * 50 + 20 // Simulated
    },
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(clusterStatus), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getDeployments(): Promise<Response> {
  const deployments: { [serviceName: string]: DeploymentStatus } = {};
  
  for (const [serviceName, status] of deploymentStatuses) {
    deployments[serviceName] = status;
  }

  return new Response(JSON.stringify(deployments), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleDeploy(req: Request): Promise<Response> {
  const body = await req.json();
  const { service_name, tag, replicas, strategy } = body;

  if (!containerSpecs[service_name]) {
    return new Response(JSON.stringify({ error: 'Service not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const spec = containerSpecs[service_name];
  
  // Update spec if new parameters provided
  if (tag) spec.tag = tag;
  if (replicas) spec.replicas = replicas;

  // Start deployment
  const deploymentId = `deploy-${service_name}-${Date.now()}`;
  
  try {
    await deployService(service_name, spec, strategy || 'RollingUpdate');
    
    return new Response(JSON.stringify({
      success: true,
      deployment_id: deploymentId,
      service: service_name,
      image: `${spec.image}:${spec.tag}`,
      replicas: spec.replicas,
      strategy: strategy || 'RollingUpdate'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      deployment_id: deploymentId
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function deployService(serviceName: string, spec: ContainerSpec, strategy: string): Promise<void> {
  console.log(`Starting deployment of ${serviceName} with strategy ${strategy}`);
  
  // Update deployment status
  const status: DeploymentStatus = {
    name: serviceName,
    namespace: 'production',
    replicas: {
      desired: spec.replicas,
      ready: 0,
      available: 0,
      unavailable: spec.replicas
    },
    status: 'deploying',
    lastUpdated: new Date().toISOString(),
    conditions: [
      {
        type: 'Progressing',
        status: true,
        message: 'Deployment started',
        lastTransition: new Date().toISOString()
      }
    ]
  };
  
  deploymentStatuses.set(serviceName, status);
  
  // Simulate deployment process
  await simulateDeployment(serviceName, spec, strategy);
}

async function simulateDeployment(serviceName: string, spec: ContainerSpec, strategy: string): Promise<void> {
  const status = deploymentStatuses.get(serviceName)!;
  
  // Simulate rolling update or recreate strategy
  const deploymentSteps = strategy === 'RollingUpdate' ? 
    Math.ceil(spec.replicas / 2) : // Rolling update in batches
    1; // Recreate all at once
  
  const replicasPerStep = Math.ceil(spec.replicas / deploymentSteps);
  
  for (let step = 0; step < deploymentSteps; step++) {
    // Wait for deployment step
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const replicasInThisStep = Math.min(replicasPerStep, spec.replicas - (step * replicasPerStep));
    
    // Update replicas progressively
    status.replicas.ready += replicasInThisStep;
    status.replicas.available += replicasInThisStep;
    status.replicas.unavailable -= replicasInThisStep;
    
    status.lastUpdated = new Date().toISOString();
    status.conditions.push({
      type: 'Progressing',
      status: true,
      message: `Deployed ${status.replicas.ready}/${spec.replicas} replicas`,
      lastTransition: new Date().toISOString()
    });
    
    console.log(`${serviceName}: ${status.replicas.ready}/${spec.replicas} replicas ready`);
  }
  
  // Deployment complete
  status.status = 'running';
  status.conditions.push({
    type: 'Available',
    status: true,
    message: 'Deployment completed successfully',
    lastTransition: new Date().toISOString()
  });
  
  console.log(`Deployment of ${serviceName} completed successfully`);
}

async function handleScale(req: Request): Promise<Response> {
  const body = await req.json();
  const { service_name, replicas, auto_scale } = body;

  if (!containerSpecs[service_name]) {
    return new Response(JSON.stringify({ error: 'Service not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const spec = containerSpecs[service_name];
  const currentStatus = deploymentStatuses.get(service_name);
  
  if (!currentStatus) {
    return new Response(JSON.stringify({ error: 'Service not deployed' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let targetReplicas = replicas;
  
  if (auto_scale) {
    // Auto-scale based on current metrics (simulated)
    const cpuUsage = Math.random() * 100;
    const memoryUsage = Math.random() * 100;
    
    if (cpuUsage > spec.scaling.targetCPUUtilization || memoryUsage > spec.scaling.targetMemoryUtilization) {
      targetReplicas = Math.min(spec.replicas + 1, spec.scaling.maxReplicas);
    } else if (cpuUsage < spec.scaling.targetCPUUtilization * 0.5 && memoryUsage < spec.scaling.targetMemoryUtilization * 0.5) {
      targetReplicas = Math.max(spec.replicas - 1, spec.scaling.minReplicas);
    } else {
      targetReplicas = spec.replicas; // No scaling needed
    }
  }

  // Validate scaling bounds
  targetReplicas = Math.max(spec.scaling.minReplicas, Math.min(targetReplicas, spec.scaling.maxReplicas));
  
  if (targetReplicas === spec.replicas) {
    return new Response(JSON.stringify({
      success: true,
      message: 'No scaling required',
      current_replicas: spec.replicas,
      target_replicas: targetReplicas
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Perform scaling
  spec.replicas = targetReplicas;
  currentStatus.status = 'scaling';
  currentStatus.replicas.desired = targetReplicas;
  currentStatus.lastUpdated = new Date().toISOString();
  
  // Simulate scaling operation
  EdgeRuntime.waitUntil(simulateScaling(service_name, currentStatus, targetReplicas));

  return new Response(JSON.stringify({
    success: true,
    service: service_name,
    previous_replicas: currentStatus.replicas.ready,
    target_replicas: targetReplicas,
    scaling_strategy: targetReplicas > currentStatus.replicas.ready ? 'scale_up' : 'scale_down'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function simulateScaling(serviceName: string, status: DeploymentStatus, targetReplicas: number): Promise<void> {
  const currentReplicas = status.replicas.ready;
  
  if (targetReplicas > currentReplicas) {
    // Scale up
    for (let i = currentReplicas; i < targetReplicas; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      status.replicas.ready++;
      status.replicas.available++;
      console.log(`Scaled up ${serviceName}: ${status.replicas.ready}/${targetReplicas} replicas`);
    }
  } else {
    // Scale down
    for (let i = currentReplicas; i > targetReplicas; i--) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      status.replicas.ready--;
      status.replicas.available--;
      console.log(`Scaled down ${serviceName}: ${status.replicas.ready}/${targetReplicas} replicas`);
    }
  }
  
  status.status = 'running';
  status.lastUpdated = new Date().toISOString();
  status.conditions.push({
    type: 'Scaled',
    status: true,
    message: `Successfully scaled to ${targetReplicas} replicas`,
    lastTransition: new Date().toISOString()
  });
}

async function handleRollback(req: Request): Promise<Response> {
  const body = await req.json();
  const { service_name, revision } = body;

  if (!containerSpecs[service_name]) {
    return new Response(JSON.stringify({ error: 'Service not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Simulate rollback
  const rollbackId = `rollback-${service_name}-${Date.now()}`;
  
  try {
    await performRollback(service_name, revision);
    
    return new Response(JSON.stringify({
      success: true,
      rollback_id: rollbackId,
      service: service_name,
      target_revision: revision,
      message: 'Rollback completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      rollback_id: rollbackId
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function performRollback(serviceName: string, revision: string): Promise<void> {
  console.log(`Rolling back ${serviceName} to revision ${revision}`);
  
  const status = deploymentStatuses.get(serviceName);
  if (status) {
    status.status = 'updating';
    status.lastUpdated = new Date().toISOString();
    status.conditions.push({
      type: 'Rollback',
      status: true,
      message: `Rolling back to revision ${revision}`,
      lastTransition: new Date().toISOString()
    });
  }
  
  // Simulate rollback process
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
  
  if (status) {
    status.status = 'running';
    status.lastUpdated = new Date().toISOString();
    status.conditions.push({
      type: 'RollbackComplete',
      status: true,
      message: `Rollback to revision ${revision} completed`,
      lastTransition: new Date().toISOString()
    });
  }
}

async function getContainerLogs(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const serviceName = url.searchParams.get('service');
  const lines = parseInt(url.searchParams.get('lines') || '100');
  
  if (!serviceName) {
    return new Response(JSON.stringify({ error: 'Service parameter required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Simulate log retrieval
  const logs = generateSimulatedLogs(serviceName, lines);

  return new Response(JSON.stringify({
    service: serviceName,
    lines: logs.length,
    logs: logs,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function generateSimulatedLogs(serviceName: string, lines: number): string[] {
  const logs: string[] = [];
  const logLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
  
  for (let i = 0; i < lines; i++) {
    const timestamp = new Date(Date.now() - (lines - i) * 1000).toISOString();
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const message = generateLogMessage(serviceName, level);
    
    logs.push(`${timestamp} [${level}] ${serviceName}: ${message}`);
  }
  
  return logs;
}

function generateLogMessage(serviceName: string, level: string): string {
  const messages = {
    'INFO': [
      'Request processed successfully',
      'Health check passed',
      'Database connection established',
      'Cache hit for key'
    ],
    'WARN': [
      'High memory usage detected',
      'Slow query detected',
      'Rate limit threshold approaching',
      'Connection pool near capacity'
    ],
    'ERROR': [
      'Database connection failed',
      'Authentication failed',
      'Request timeout',
      'Service unavailable'
    ],
    'DEBUG': [
      'Processing request with ID',
      'Cache miss for key',
      'Validating input parameters',
      'Executing business logic'
    ]
  };
  
  const messageList = messages[level as keyof typeof messages] || messages['INFO'];
  return messageList[Math.floor(Math.random() * messageList.length)];
}

async function getResourceUsage(): Promise<Response> {
  const resourceUsage: { [serviceName: string]: any } = {};
  
  for (const serviceName of Object.keys(containerSpecs)) {
    const spec = containerSpecs[serviceName];
    const status = deploymentStatuses.get(serviceName);
    
    if (status) {
      resourceUsage[serviceName] = {
        replicas: status.replicas,
        cpu: {
          requests: spec.resources.requests.cpu,
          limits: spec.resources.limits.cpu,
          usage: `${Math.random() * 80 + 10}%`
        },
        memory: {
          requests: spec.resources.requests.memory,
          limits: spec.resources.limits.memory,
          usage: `${Math.random() * 70 + 20}%`
        },
        network: {
          ingress: `${Math.random() * 100 + 50} MB/s`,
          egress: `${Math.random() * 80 + 30} MB/s`
        },
        storage: spec.volumes ? {
          volumes: spec.volumes.length,
          usage: `${Math.random() * 60 + 20}%`
        } : null
      };
    }
  }

  return new Response(JSON.stringify(resourceUsage), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getClusterHealth(): Promise<Response> {
  const health = {
    cluster_status: 'healthy',
    node_count: 6,
    healthy_nodes: 6,
    cluster_version: 'v1.28.2',
    control_plane: {
      api_server: 'healthy',
      etcd: 'healthy',
      scheduler: 'healthy',
      controller_manager: 'healthy'
    },
    addons: {
      dns: 'healthy',
      ingress_controller: 'healthy',
      monitoring: 'healthy',
      logging: 'healthy'
    },
    resource_quotas: {
      cpu_capacity: '24 cores',
      memory_capacity: '96 GB',
      storage_capacity: '2 TB',
      cpu_utilization: '45%',
      memory_utilization: '60%',
      storage_utilization: '35%'
    },
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(health), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getClusterEvents(): Promise<Response> {
  const events = [
    {
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'Normal',
      reason: 'Scheduled',
      object: 'pod/product-service-abc123',
      message: 'Successfully assigned pod to node worker-1'
    },
    {
      timestamp: new Date(Date.now() - 240000).toISOString(),
      type: 'Normal',
      reason: 'Pulling',
      object: 'pod/product-service-abc123',
      message: 'Pulling image "getit/product-service:v1.2.1"'
    },
    {
      timestamp: new Date(Date.now() - 180000).toISOString(),
      type: 'Normal',
      reason: 'Pulled',
      object: 'pod/product-service-abc123',
      message: 'Successfully pulled image'
    },
    {
      timestamp: new Date(Date.now() - 120000).toISOString(),
      type: 'Normal',
      reason: 'Created',
      object: 'pod/product-service-abc123',
      message: 'Created container product-service'
    },
    {
      timestamp: new Date(Date.now() - 60000).toISOString(),
      type: 'Normal',
      reason: 'Started',
      object: 'pod/product-service-abc123',
      message: 'Started container product-service'
    }
  ];

  return new Response(JSON.stringify(events), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Initialize deployment statuses
function initializeDeployments() {
  for (const serviceName of Object.keys(containerSpecs)) {
    const spec = containerSpecs[serviceName];
    
    deploymentStatuses.set(serviceName, {
      name: serviceName,
      namespace: 'production',
      replicas: {
        desired: spec.replicas,
        ready: spec.replicas,
        available: spec.replicas,
        unavailable: 0
      },
      status: 'running',
      lastUpdated: new Date().toISOString(),
      conditions: [
        {
          type: 'Available',
          status: true,
          message: 'Deployment is available',
          lastTransition: new Date().toISOString()
        }
      ]
    });
  }
}

// Initialize on startup
initializeDeployments();