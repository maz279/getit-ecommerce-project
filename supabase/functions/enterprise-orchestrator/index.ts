import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface EnterpriseFeature {
  id: string
  feature_name: string
  feature_type: string
  implementation_status: string
  priority_level: string
  amazon_equivalent?: string
  shopee_equivalent?: string
  description?: string
  technical_requirements: any
  business_requirements: any
  implementation_plan: any
  success_metrics: any
  dependencies: string[]
  estimated_effort_days?: number
  assigned_team?: string
  business_impact_score?: number
  technical_complexity_score?: number
  roi_estimate?: number
}

interface KubernetesDeployment {
  id: string
  name: string
  namespace: string
  deployment_type: string
  image_name: string
  image_tag: string
  replicas: number
  status: string
}

interface ServiceMeshConfig {
  id: string
  service_name: string
  virtual_service_config: any
  destination_rules: any
  gateway_config: any
  authentication_policy: any
  authorization_policy: any
  traffic_policy: any
  is_active: boolean
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/enterprise-orchestrator', '')

    switch (path) {
      case '/features/roadmap':
        return await getEnterpriseRoadmap(supabase)
      
      case '/features/amazon-gap-analysis':
        return await getAmazonGapAnalysis(supabase)
      
      case '/infrastructure/deployment-status':
        return await getDeploymentStatus(supabase)
      
      case '/infrastructure/service-mesh-status':
        return await getServiceMeshStatus(supabase)
      
      case '/analytics/implementation-progress':
        return await getImplementationProgress(supabase)
      
      case '/recommendations/next-features':
        return await getNextFeatureRecommendations(supabase)
      
      case '/automation/scale-services':
        if (req.method === 'POST') {
          const body = await req.json()
          return await autoScaleServices(supabase, body)
        }
        break
      
      case '/automation/deploy-feature':
        if (req.method === 'POST') {
          const body = await req.json()
          return await deployEnterpriseFeature(supabase, body)
        }
        break
      
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Enterprise Orchestrator Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getEnterpriseRoadmap(supabase: any) {
  const { data: features, error } = await supabase
    .from('enterprise_features')
    .select('*')
    .order('priority_level', { ascending: false })
    .order('business_impact_score', { ascending: false })

  if (error) throw error

  // Categorize features by implementation status
  const roadmap = {
    critical_features: features.filter((f: EnterpriseFeature) => f.priority_level === 'critical'),
    high_priority: features.filter((f: EnterpriseFeature) => f.priority_level === 'high'),
    medium_priority: features.filter((f: EnterpriseFeature) => f.priority_level === 'medium'),
    in_progress: features.filter((f: EnterpriseFeature) => f.implementation_status === 'in-progress'),
    testing: features.filter((f: EnterpriseFeature) => f.implementation_status === 'testing'),
    deployed: features.filter((f: EnterpriseFeature) => f.implementation_status === 'deployed'),
    total_estimated_effort: features.reduce((sum: number, f: EnterpriseFeature) => 
      sum + (f.estimated_effort_days || 0), 0),
    average_business_impact: features.reduce((sum: number, f: EnterpriseFeature) => 
      sum + (f.business_impact_score || 0), 0) / features.length,
    completion_percentage: features.filter((f: EnterpriseFeature) => 
      f.implementation_status === 'deployed').length / features.length * 100
  }

  return new Response(
    JSON.stringify({ roadmap }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getAmazonGapAnalysis(supabase: any) {
  const { data: features, error } = await supabase
    .from('enterprise_features')
    .select('*')

  if (error) throw error

  const amazonFeatures = features.filter((f: EnterpriseFeature) => f.amazon_equivalent)
  const shopeeFeatures = features.filter((f: EnterpriseFeature) => f.shopee_equivalent)
  
  const gapAnalysis = {
    amazon_equivalents: {
      total_features: amazonFeatures.length,
      implemented: amazonFeatures.filter((f: EnterpriseFeature) => 
        f.implementation_status === 'deployed').length,
      in_progress: amazonFeatures.filter((f: EnterpriseFeature) => 
        f.implementation_status === 'in-progress').length,
      planned: amazonFeatures.filter((f: EnterpriseFeature) => 
        f.implementation_status === 'planned').length,
      coverage_percentage: amazonFeatures.filter((f: EnterpriseFeature) => 
        f.implementation_status === 'deployed').length / amazonFeatures.length * 100
    },
    shopee_equivalents: {
      total_features: shopeeFeatures.length,
      implemented: shopeeFeatures.filter((f: EnterpriseFeature) => 
        f.implementation_status === 'deployed').length,
      in_progress: shopeeFeatures.filter((f: EnterpriseFeature) => 
        f.implementation_status === 'in-progress').length,
      planned: shopeeFeatures.filter((f: EnterpriseFeature) => 
        f.implementation_status === 'planned').length,
      coverage_percentage: shopeeFeatures.filter((f: EnterpriseFeature) => 
        f.implementation_status === 'deployed').length / shopeeFeatures.length * 100
    },
    critical_gaps: features.filter((f: EnterpriseFeature) => 
      f.priority_level === 'critical' && f.implementation_status === 'planned'),
    high_impact_missing: features.filter((f: EnterpriseFeature) => 
      (f.business_impact_score || 0) >= 8 && f.implementation_status === 'planned'),
    recommended_next_implementations: features
      .filter((f: EnterpriseFeature) => f.implementation_status === 'planned')
      .sort((a, b) => ((b.business_impact_score || 0) / (b.technical_complexity_score || 1)) - 
                      ((a.business_impact_score || 0) / (a.technical_complexity_score || 1)))
      .slice(0, 5)
  }

  return new Response(
    JSON.stringify({ gap_analysis: gapAnalysis }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getDeploymentStatus(supabase: any) {
  const { data: deployments, error } = await supabase
    .from('kubernetes_deployments')
    .select('*')

  if (error) throw error

  const status = {
    total_deployments: deployments.length,
    by_type: {
      'core-service': deployments.filter((d: KubernetesDeployment) => d.deployment_type === 'core-service').length,
      'business-service': deployments.filter((d: KubernetesDeployment) => d.deployment_type === 'business-service').length,
      'frontend': deployments.filter((d: KubernetesDeployment) => d.deployment_type === 'frontend').length,
      'infrastructure': deployments.filter((d: KubernetesDeployment) => d.deployment_type === 'infrastructure').length
    },
    by_status: {
      running: deployments.filter((d: KubernetesDeployment) => d.status === 'running').length,
      pending: deployments.filter((d: KubernetesDeployment) => d.status === 'pending').length,
      failed: deployments.filter((d: KubernetesDeployment) => d.status === 'failed').length
    },
    total_replicas: deployments.reduce((sum: number, d: KubernetesDeployment) => sum + d.replicas, 0),
    health_percentage: deployments.filter((d: KubernetesDeployment) => 
      d.status === 'running').length / deployments.length * 100
  }

  return new Response(
    JSON.stringify({ deployment_status: status }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getServiceMeshStatus(supabase: any) {
  const { data: meshConfigs, error } = await supabase
    .from('service_mesh_config')
    .select('*')

  if (error) throw error

  const status = {
    total_services: meshConfigs.length,
    active_services: meshConfigs.filter((m: ServiceMeshConfig) => m.is_active).length,
    security_policies: meshConfigs.filter((m: ServiceMeshConfig) => 
      Object.keys(m.authentication_policy).length > 0).length,
    traffic_policies: meshConfigs.filter((m: ServiceMeshConfig) => 
      Object.keys(m.traffic_policy).length > 0).length,
    circuit_breakers: meshConfigs.filter((m: ServiceMeshConfig) => 
      m.traffic_policy?.circuit_breaker).length,
    mtls_enabled: meshConfigs.filter((m: ServiceMeshConfig) => 
      m.authentication_policy?.mtls?.mode === 'STRICT').length,
    coverage_percentage: meshConfigs.filter((m: ServiceMeshConfig) => 
      m.is_active).length / meshConfigs.length * 100
  }

  return new Response(
    JSON.stringify({ service_mesh_status: status }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getImplementationProgress(supabase: any) {
  const { data: features, error } = await supabase
    .from('enterprise_features')
    .select('*')

  if (error) throw error

  const progress = {
    overall_completion: features.filter((f: EnterpriseFeature) => 
      f.implementation_status === 'deployed').length / features.length * 100,
    by_type: {
      'ai-ml': calculateTypeProgress(features, 'ai-ml'),
      'analytics': calculateTypeProgress(features, 'analytics'),
      'security': calculateTypeProgress(features, 'security'),
      'performance': calculateTypeProgress(features, 'performance'),
      'business': calculateTypeProgress(features, 'business')
    },
    velocity_metrics: {
      features_completed_last_30_days: features.filter((f: EnterpriseFeature) => 
        f.actual_completion_date && 
        new Date(f.actual_completion_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
      average_implementation_time: calculateAverageImplementationTime(features),
      estimated_completion_date: estimateProjectCompletion(features)
    },
    roi_analysis: {
      total_estimated_roi: features.reduce((sum: number, f: EnterpriseFeature) => 
        sum + (f.roi_estimate || 0), 0),
      average_roi_per_feature: features.filter((f: EnterpriseFeature) => f.roi_estimate)
        .reduce((sum: number, f: EnterpriseFeature) => sum + (f.roi_estimate || 0), 0) / 
        features.filter((f: EnterpriseFeature) => f.roi_estimate).length
    }
  }

  return new Response(
    JSON.stringify({ implementation_progress: progress }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getNextFeatureRecommendations(supabase: any) {
  const { data: features, error } = await supabase
    .from('enterprise_features')
    .select('*')
    .eq('implementation_status', 'planned')

  if (error) throw error

  // Calculate priority score based on business impact, complexity, and dependencies
  const scoredFeatures = features.map((f: EnterpriseFeature) => ({
    ...f,
    priority_score: calculatePriorityScore(f, features)
  })).sort((a, b) => b.priority_score - a.priority_score)

  const recommendations = {
    next_sprint: scoredFeatures.slice(0, 3),
    next_quarter: scoredFeatures.slice(0, 10),
    quick_wins: features.filter((f: EnterpriseFeature) => 
      (f.business_impact_score || 0) >= 7 && (f.technical_complexity_score || 0) <= 4),
    high_impact: features.filter((f: EnterpriseFeature) => 
      (f.business_impact_score || 0) >= 8),
    dependency_analysis: analyzeDependencies(features),
    resource_requirements: calculateResourceRequirements(scoredFeatures.slice(0, 10))
  }

  return new Response(
    JSON.stringify({ recommendations }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function autoScaleServices(supabase: any, config: any) {
  // Auto-scaling logic based on metrics and enterprise features status
  const scalingDecisions = {
    timestamp: new Date().toISOString(),
    decisions: [],
    metrics_analyzed: config.metrics || {},
    scaling_actions: []
  }

  // Implementation would connect to Kubernetes API and make scaling decisions
  // This is a placeholder for the actual auto-scaling logic

  return new Response(
    JSON.stringify({ auto_scaling: scalingDecisions }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function deployEnterpriseFeature(supabase: any, featureConfig: any) {
  // Feature deployment orchestration
  const deployment = {
    feature_id: featureConfig.feature_id,
    deployment_id: crypto.randomUUID(),
    status: 'initiated',
    timestamp: new Date().toISOString(),
    steps: [
      'Infrastructure preparation',
      'Database migration',
      'Service deployment',
      'Configuration setup',
      'Testing validation',
      'Traffic routing',
      'Monitoring setup'
    ]
  }

  // Update feature status
  await supabase
    .from('enterprise_features')
    .update({ implementation_status: 'in-progress' })
    .eq('id', featureConfig.feature_id)

  return new Response(
    JSON.stringify({ deployment }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Helper functions
function calculateTypeProgress(features: EnterpriseFeature[], type: string) {
  const typeFeatures = features.filter(f => f.feature_type === type)
  const completed = typeFeatures.filter(f => f.implementation_status === 'deployed').length
  return typeFeatures.length > 0 ? (completed / typeFeatures.length) * 100 : 0
}

function calculateAverageImplementationTime(features: EnterpriseFeature[]) {
  const completedFeatures = features.filter(f => 
    f.start_date && f.actual_completion_date)
  
  if (completedFeatures.length === 0) return null
  
  const totalDays = completedFeatures.reduce((sum, f) => {
    const start = new Date(f.start_date!)
    const end = new Date(f.actual_completion_date!)
    return sum + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }, 0)
  
  return totalDays / completedFeatures.length
}

function estimateProjectCompletion(features: EnterpriseFeature[]) {
  const remainingFeatures = features.filter(f => 
    f.implementation_status === 'planned' || f.implementation_status === 'in-progress')
  const totalRemainingDays = remainingFeatures.reduce((sum, f) => 
    sum + (f.estimated_effort_days || 0), 0)
  
  // Assuming 20 working days per month and parallel development
  const parallelismFactor = 3 // Assuming 3 teams can work in parallel
  const estimatedMonths = Math.ceil(totalRemainingDays / (20 * parallelismFactor))
  
  const completionDate = new Date()
  completionDate.setMonth(completionDate.getMonth() + estimatedMonths)
  
  return completionDate.toISOString().split('T')[0]
}

function calculatePriorityScore(feature: EnterpriseFeature, allFeatures: EnterpriseFeature[]) {
  const businessImpact = feature.business_impact_score || 5
  const complexity = feature.technical_complexity_score || 5
  const dependencyPenalty = feature.dependencies.length * 0.5
  
  // Higher business impact, lower complexity = higher score
  const baseScore = (businessImpact / complexity) * 10
  const priorityMultiplier = feature.priority_level === 'critical' ? 2 : 
                           feature.priority_level === 'high' ? 1.5 : 1
  
  return (baseScore * priorityMultiplier) - dependencyPenalty
}

function analyzeDependencies(features: EnterpriseFeature[]) {
  const dependencyMap = new Map()
  features.forEach(f => {
    f.dependencies.forEach(dep => {
      if (!dependencyMap.has(dep)) {
        dependencyMap.set(dep, [])
      }
      dependencyMap.get(dep).push(f.feature_name)
    })
  })
  
  return Object.fromEntries(dependencyMap)
}

function calculateResourceRequirements(features: EnterpriseFeature[]) {
  return {
    total_estimated_days: features.reduce((sum, f) => sum + (f.estimated_effort_days || 0), 0),
    required_teams: Math.ceil(features.length / 3), // Assuming each team can handle 3 features
    skill_requirements: features.flatMap(f => Object.keys(f.technical_requirements || {})),
    budget_estimate: features.reduce((sum, f) => sum + (f.estimated_effort_days || 0) * 1000, 0) // $1000 per day estimate
  }
}