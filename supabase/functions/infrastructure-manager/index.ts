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

interface InfrastructureDeployment {
  deployment_name: string;
  environment: 'development' | 'staging' | 'production';
  infrastructure_type: 'kubernetes' | 'terraform' | 'ansible' | 'docker';
  configuration: Record<string, any>;
}

interface KubernetesCluster {
  cluster_name: string;
  environment: string;
  region: string;
  provider: 'aws' | 'gcp' | 'azure' | 'local';
  cluster_config: Record<string, any>;
  node_pools: Array<any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();

    switch (action) {
      case 'deploy_infrastructure':
        return await deployInfrastructure(data);
      
      case 'create_kubernetes_cluster':
        return await createKubernetesCluster(data);
      
      case 'get_deployment_status':
        return await getDeploymentStatus(data);
      
      case 'rollback_deployment':
        return await rollbackDeployment(data);
      
      case 'scale_cluster':
        return await scaleCluster(data);
      
      case 'get_infrastructure_health':
        return await getInfrastructureHealth();
      
      case 'trigger_ci_cd_pipeline':
        return await triggerCiCdPipeline(data);
      
      case 'manage_container_registry':
        return await manageContainerRegistry(data);
      
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Infrastructure Manager Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function deployInfrastructure(data: InfrastructureDeployment) {
  const { deployment_name, environment, infrastructure_type, configuration } = data;
  
  // Validate configuration based on infrastructure type
  const validationResult = validateConfiguration(infrastructure_type, configuration);
  if (!validationResult.valid) {
    throw new Error(`Configuration validation failed: ${validationResult.errors.join(', ')}`);
  }
  
  // Create deployment record
  const { data: deployment, error } = await supabase
    .from('infrastructure_deployments')
    .insert({
      deployment_name,
      environment,
      infrastructure_type,
      configuration,
      deployment_status: 'deploying',
      deployed_by: data.user_id || null
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Simulate deployment process based on infrastructure type
  await simulateDeployment(deployment.id, infrastructure_type, configuration);
  
  return new Response(JSON.stringify({
    success: true,
    deployment_id: deployment.id,
    status: 'deploying',
    message: `${infrastructure_type} deployment initiated for ${environment} environment`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createKubernetesCluster(data: KubernetesCluster) {
  const { cluster_name, environment, region, provider, cluster_config, node_pools } = data;
  
  // Validate cluster configuration
  if (!cluster_config.kubernetes_version) {
    throw new Error('Kubernetes version is required');
  }
  
  // Create cluster record
  const { data: cluster, error } = await supabase
    .from('kubernetes_clusters')
    .insert({
      cluster_name,
      environment,
      region,
      provider,
      cluster_config,
      node_pools,
      cluster_status: 'provisioning',
      cluster_version: cluster_config.kubernetes_version
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Simulate cluster provisioning
  await simulateClusterProvisioning(cluster.id, provider, cluster_config);
  
  return new Response(JSON.stringify({
    success: true,
    cluster_id: cluster.id,
    status: 'provisioning',
    message: `Kubernetes cluster ${cluster_name} provisioning initiated`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getDeploymentStatus(data: { deployment_id: string }) {
  const { deployment_id } = data;
  
  const { data: deployment, error } = await supabase
    .from('infrastructure_deployments')
    .select('*')
    .eq('id', deployment_id)
    .single();
  
  if (error) throw error;
  
  // Get related cluster information if it's a Kubernetes deployment
  let clusterInfo = null;
  if (deployment.infrastructure_type === 'kubernetes') {
    const { data: cluster } = await supabase
      .from('kubernetes_clusters')
      .select('*')
      .eq('environment', deployment.environment)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    clusterInfo = cluster;
  }
  
  return new Response(JSON.stringify({
    success: true,
    deployment,
    cluster_info: clusterInfo,
    health_metrics: await getDeploymentHealthMetrics(deployment_id)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function rollbackDeployment(data: { deployment_id: string, rollback_version?: string }) {
  const { deployment_id, rollback_version } = data;
  
  // Update deployment status to rolling back
  const { error } = await supabase
    .from('infrastructure_deployments')
    .update({
      deployment_status: 'rolling_back',
      rollback_version: rollback_version || 'previous'
    })
    .eq('id', deployment_id);
  
  if (error) throw error;
  
  // Simulate rollback process
  setTimeout(async () => {
    await supabase
      .from('infrastructure_deployments')
      .update({
        deployment_status: 'deployed',
        health_status: 'healthy'
      })
      .eq('id', deployment_id);
  }, 30000); // 30 seconds rollback simulation
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Rollback initiated',
    estimated_completion: '30 seconds'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function scaleCluster(data: { cluster_id: string, node_pools: Array<any> }) {
  const { cluster_id, node_pools } = data;
  
  const { error } = await supabase
    .from('kubernetes_clusters')
    .update({
      node_pools,
      cluster_status: 'scaling'
    })
    .eq('id', cluster_id);
  
  if (error) throw error;
  
  // Simulate scaling process
  setTimeout(async () => {
    await supabase
      .from('kubernetes_clusters')
      .update({
        cluster_status: 'running'
      })
      .eq('id', cluster_id);
  }, 60000); // 1 minute scaling simulation
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Cluster scaling initiated',
    estimated_completion: '1-2 minutes'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getInfrastructureHealth() {
  // Get overall infrastructure health metrics
  const { data: deployments, error: deploymentsError } = await supabase
    .from('infrastructure_deployments')
    .select('deployment_status, health_status, environment')
    .eq('deployment_status', 'deployed');
  
  const { data: clusters, error: clustersError } = await supabase
    .from('kubernetes_clusters')
    .select('cluster_status, environment, auto_scaling_enabled');
  
  const { data: pipelines, error: pipelinesError } = await supabase
    .from('ci_cd_pipelines')
    .select('status, success_rate, last_run_at');
  
  if (deploymentsError || clustersError || pipelinesError) {
    throw new Error('Failed to fetch infrastructure health data');
  }
  
  const healthSummary = {
    overall_status: calculateOverallHealth(deployments || [], clusters || [], pipelines || []),
    deployments_health: analyzeDeploymentsHealth(deployments || []),
    clusters_health: analyzeClustersHealth(clusters || []),
    pipelines_health: analyzePipelinesHealth(pipelines || []),
    timestamp: new Date().toISOString()
  };
  
  return new Response(JSON.stringify({
    success: true,
    health_summary: healthSummary
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function triggerCiCdPipeline(data: { pipeline_name: string, environment: string, manual_trigger?: boolean }) {
  const { pipeline_name, environment, manual_trigger = true } = data;
  
  // Get pipeline configuration
  const { data: pipeline, error } = await supabase
    .from('ci_cd_pipelines')
    .select('*')
    .eq('pipeline_name', pipeline_name)
    .eq('is_active', true)
    .single();
  
  if (error || !pipeline) {
    throw new Error('Pipeline not found or inactive');
  }
  
  // Update pipeline status to running
  await supabase
    .from('ci_cd_pipelines')
    .update({
      status: 'running',
      last_run_at: new Date().toISOString()
    })
    .eq('id', pipeline.id);
  
  // Simulate pipeline execution
  const success = await simulatePipelineExecution(pipeline, environment);
  
  return new Response(JSON.stringify({
    success: true,
    pipeline_id: pipeline.id,
    status: 'running',
    estimated_duration: `${pipeline.pipeline_config.estimated_duration || 10} minutes`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function manageContainerRegistry(data: { action: string, registry_config?: any }) {
  const { action, registry_config } = data;
  
  switch (action) {
    case 'create':
      const { data: registry, error } = await supabase
        .from('container_registries')
        .insert(registry_config)
        .select()
        .single();
      
      if (error) throw error;
      
      return new Response(JSON.stringify({
        success: true,
        registry_id: registry.id,
        message: 'Container registry created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    
    case 'scan_vulnerabilities':
      // Simulate vulnerability scanning
      const scanResults = await simulateVulnerabilityScanning(data.registry_id);
      
      return new Response(JSON.stringify({
        success: true,
        scan_results: scanResults
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    
    default:
      throw new Error('Invalid registry action');
  }
}

// Helper functions
function validateConfiguration(type: string, config: Record<string, any>) {
  const errors: string[] = [];
  
  switch (type) {
    case 'kubernetes':
      if (!config.kubernetes_version) errors.push('Kubernetes version required');
      if (!config.node_pools || config.node_pools.length === 0) errors.push('At least one node pool required');
      break;
    case 'terraform':
      if (!config.terraform_version) errors.push('Terraform version required');
      if (!config.modules || config.modules.length === 0) errors.push('At least one module required');
      break;
    case 'docker':
      if (!config.docker_version) errors.push('Docker version required');
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

async function simulateDeployment(deploymentId: string, type: string, config: Record<string, any>) {
  // Simulate deployment process with different durations based on type
  const duration = {
    kubernetes: 300000, // 5 minutes
    terraform: 180000,  // 3 minutes
    ansible: 120000,    // 2 minutes
    docker: 60000       // 1 minute
  }[type] || 120000;
  
  setTimeout(async () => {
    await supabase
      .from('infrastructure_deployments')
      .update({
        deployment_status: 'deployed',
        health_status: 'healthy',
        deployed_at: new Date().toISOString(),
        resource_utilization: generateResourceUtilization()
      })
      .eq('id', deploymentId);
  }, duration);
}

async function simulateClusterProvisioning(clusterId: string, provider: string, config: Record<string, any>) {
  // Simulate cluster provisioning (longer for cloud providers)
  const duration = provider === 'local' ? 180000 : 600000; // 3 minutes local, 10 minutes cloud
  
  setTimeout(async () => {
    await supabase
      .from('kubernetes_clusters')
      .update({
        cluster_status: 'running',
        cluster_endpoint: `https://${provider}-cluster-${Date.now()}.example.com`,
        kubeconfig_encrypted: 'encrypted_kubeconfig_data_here'
      })
      .eq('id', clusterId);
  }, duration);
}

async function getDeploymentHealthMetrics(deploymentId: string) {
  // Return simulated health metrics
  return {
    cpu_usage: Math.random() * 80,
    memory_usage: Math.random() * 70,
    disk_usage: Math.random() * 60,
    network_throughput: Math.random() * 1000,
    response_time: Math.random() * 200 + 50,
    error_rate: Math.random() * 5
  };
}

function calculateOverallHealth(deployments: any[], clusters: any[], pipelines: any[]) {
  const healthyDeployments = deployments.filter(d => d.health_status === 'healthy').length;
  const runningClusters = clusters.filter(c => c.cluster_status === 'running').length;
  const successfulPipelines = pipelines.filter(p => p.status === 'success').length;
  
  const totalItems = deployments.length + clusters.length + pipelines.length;
  const healthyItems = healthyDeployments + runningClusters + successfulPipelines;
  
  const healthPercentage = totalItems > 0 ? (healthyItems / totalItems) * 100 : 100;
  
  if (healthPercentage >= 90) return 'healthy';
  if (healthPercentage >= 70) return 'degraded';
  return 'unhealthy';
}

function analyzeDeploymentsHealth(deployments: any[]) {
  const byEnvironment = deployments.reduce((acc, dep) => {
    acc[dep.environment] = acc[dep.environment] || { total: 0, healthy: 0 };
    acc[dep.environment].total++;
    if (dep.health_status === 'healthy') acc[dep.environment].healthy++;
    return acc;
  }, {});
  
  return byEnvironment;
}

function analyzeClustersHealth(clusters: any[]) {
  const byEnvironment = clusters.reduce((acc, cluster) => {
    acc[cluster.environment] = acc[cluster.environment] || { total: 0, running: 0, auto_scaling: 0 };
    acc[cluster.environment].total++;
    if (cluster.cluster_status === 'running') acc[cluster.environment].running++;
    if (cluster.auto_scaling_enabled) acc[cluster.environment].auto_scaling++;
    return acc;
  }, {});
  
  return byEnvironment;
}

function analyzePipelinesHealth(pipelines: any[]) {
  const total = pipelines.length;
  const successful = pipelines.filter(p => p.status === 'success').length;
  const averageSuccessRate = pipelines.reduce((sum, p) => sum + (p.success_rate || 0), 0) / total;
  
  return {
    total,
    successful,
    success_percentage: total > 0 ? (successful / total) * 100 : 0,
    average_success_rate: averageSuccessRate || 0
  };
}

async function simulatePipelineExecution(pipeline: any, environment: string) {
  const duration = (pipeline.pipeline_config.estimated_duration || 10) * 60000; // Convert to milliseconds
  
  setTimeout(async () => {
    const success = Math.random() > 0.1; // 90% success rate
    
    await supabase
      .from('ci_cd_pipelines')
      .update({
        status: success ? 'success' : 'failed',
        last_run_duration: duration / 1000, // Store in seconds
        success_rate: pipeline.success_rate * 0.9 + (success ? 10 : 0) // Update success rate
      })
      .eq('id', pipeline.id);
  }, duration);
  
  return true;
}

async function simulateVulnerabilityScanning(registryId: string) {
  // Simulate vulnerability scanning results
  return {
    total_images: Math.floor(Math.random() * 50) + 10,
    vulnerabilities: {
      critical: Math.floor(Math.random() * 3),
      high: Math.floor(Math.random() * 8),
      medium: Math.floor(Math.random() * 15),
      low: Math.floor(Math.random() * 25)
    },
    compliance_score: Math.floor(Math.random() * 30) + 70,
    scan_timestamp: new Date().toISOString()
  };
}

function generateResourceUtilization() {
  return {
    cpu: Math.random() * 80,
    memory: Math.random() * 70,
    disk: Math.random() * 60,
    network: Math.random() * 1000
  };
}