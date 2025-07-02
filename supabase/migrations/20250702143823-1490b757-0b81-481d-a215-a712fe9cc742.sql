-- Infrastructure Management Tables
CREATE TABLE IF NOT EXISTS public.infrastructure_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_name TEXT NOT NULL,
    environment TEXT NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
    infrastructure_type TEXT NOT NULL CHECK (infrastructure_type IN ('kubernetes', 'terraform', 'ansible', 'docker')),
    deployment_status TEXT NOT NULL DEFAULT 'pending' CHECK (deployment_status IN ('pending', 'deploying', 'deployed', 'failed', 'rolling_back')),
    configuration JSONB NOT NULL DEFAULT '{}',
    deployed_at TIMESTAMP WITH TIME ZONE,
    deployed_by UUID,
    rollback_version TEXT,
    health_status TEXT DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'degraded', 'unhealthy', 'unknown')),
    resource_utilization JSONB DEFAULT '{}',
    deployment_logs JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kubernetes_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_name TEXT NOT NULL UNIQUE,
    environment TEXT NOT NULL,
    region TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('aws', 'gcp', 'azure', 'local')),
    cluster_config JSONB NOT NULL DEFAULT '{}',
    node_pools JSONB NOT NULL DEFAULT '[]',
    cluster_status TEXT NOT NULL DEFAULT 'provisioning',
    kubeconfig_encrypted TEXT,
    cluster_endpoint TEXT,
    cluster_version TEXT,
    auto_scaling_enabled BOOLEAN DEFAULT true,
    monitoring_enabled BOOLEAN DEFAULT true,
    backup_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.terraform_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_name TEXT NOT NULL,
    environment TEXT NOT NULL,
    state_version INTEGER NOT NULL DEFAULT 1,
    terraform_version TEXT NOT NULL,
    state_data JSONB NOT NULL,
    state_checksum TEXT NOT NULL,
    resources_count INTEGER DEFAULT 0,
    last_applied_at TIMESTAMP WITH TIME ZONE,
    applied_by UUID,
    lock_info JSONB,
    is_locked BOOLEAN DEFAULT false,
    backup_states JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ci_cd_pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_name TEXT NOT NULL,
    repository_url TEXT NOT NULL,
    branch_name TEXT NOT NULL DEFAULT 'main',
    pipeline_type TEXT NOT NULL CHECK (pipeline_type IN ('build', 'test', 'deploy', 'release')),
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('push', 'pull_request', 'manual', 'scheduled')),
    pipeline_config JSONB NOT NULL DEFAULT '{}',
    environment_variables JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'success', 'failed', 'cancelled')),
    last_run_at TIMESTAMP WITH TIME ZONE,
    last_run_duration INTEGER, -- in seconds
    success_rate NUMERIC(5,2) DEFAULT 0,
    pipeline_metrics JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.container_registries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_name TEXT NOT NULL UNIQUE,
    registry_url TEXT NOT NULL,
    registry_type TEXT NOT NULL CHECK (registry_type IN ('docker_hub', 'ecr', 'gcr', 'acr', 'harbor')),
    authentication_config JSONB NOT NULL DEFAULT '{}',
    image_scanning_enabled BOOLEAN DEFAULT true,
    vulnerability_policies JSONB DEFAULT '{}',
    retention_policies JSONB DEFAULT '{}',
    access_policies JSONB DEFAULT '{}',
    storage_usage_gb NUMERIC(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.infrastructure_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kubernetes_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terraform_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ci_cd_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.container_registries ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
CREATE POLICY "Admin can manage infrastructure deployments" ON public.infrastructure_deployments FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin can manage kubernetes clusters" ON public.kubernetes_clusters FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin can manage terraform states" ON public.terraform_states FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin can manage ci/cd pipelines" ON public.ci_cd_pipelines FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin can manage container registries" ON public.container_registries FOR ALL TO authenticated USING (is_admin_user());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_infrastructure_deployments_environment ON public.infrastructure_deployments(environment);
CREATE INDEX IF NOT EXISTS idx_infrastructure_deployments_status ON public.infrastructure_deployments(deployment_status);
CREATE INDEX IF NOT EXISTS idx_kubernetes_clusters_environment ON public.kubernetes_clusters(environment);
CREATE INDEX IF NOT EXISTS idx_terraform_states_workspace ON public.terraform_states(workspace_name, environment);
CREATE INDEX IF NOT EXISTS idx_ci_cd_pipelines_status ON public.ci_cd_pipelines(status);
CREATE INDEX IF NOT EXISTS idx_ci_cd_pipelines_type ON public.ci_cd_pipelines(pipeline_type);

-- Update triggers
CREATE TRIGGER update_infrastructure_deployments_updated_at BEFORE UPDATE ON public.infrastructure_deployments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kubernetes_clusters_updated_at BEFORE UPDATE ON public.kubernetes_clusters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_terraform_states_updated_at BEFORE UPDATE ON public.terraform_states FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ci_cd_pipelines_updated_at BEFORE UPDATE ON public.ci_cd_pipelines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_container_registries_updated_at BEFORE UPDATE ON public.container_registries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();