-- Create comprehensive microservices infrastructure tables
CREATE TABLE IF NOT EXISTS public.kubernetes_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  namespace TEXT NOT NULL,
  deployment_type TEXT NOT NULL, -- 'core-service', 'business-service', 'frontend', 'infrastructure'
  image_name TEXT NOT NULL,
  image_tag TEXT NOT NULL,
  replicas INTEGER NOT NULL DEFAULT 1,
  cpu_request TEXT,
  cpu_limit TEXT,
  memory_request TEXT,
  memory_limit TEXT,
  environment_variables JSONB DEFAULT '{}',
  config_maps TEXT[],
  secrets TEXT[],
  health_check_config JSONB DEFAULT '{}',
  auto_scaling_config JSONB DEFAULT '{}',
  network_policies TEXT[],
  service_mesh_config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deployed_at TIMESTAMPTZ,
  deployed_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.service_mesh_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  virtual_service_config JSONB NOT NULL DEFAULT '{}',
  destination_rules JSONB NOT NULL DEFAULT '{}',
  gateway_config JSONB NOT NULL DEFAULT '{}',
  authentication_policy JSONB NOT NULL DEFAULT '{}',
  authorization_policy JSONB NOT NULL DEFAULT '{}',
  traffic_policy JSONB NOT NULL DEFAULT '{}',
  circuit_breaker_config JSONB NOT NULL DEFAULT '{}',
  retry_policy JSONB NOT NULL DEFAULT '{}',
  timeout_config JSONB NOT NULL DEFAULT '{}',
  load_balancing_config JSONB NOT NULL DEFAULT '{}',
  tls_config JSONB NOT NULL DEFAULT '{}',
  observability_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.advanced_monitoring_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitoring_type TEXT NOT NULL, -- 'prometheus', 'grafana', 'jaeger', 'elk', 'chaos'
  configuration JSONB NOT NULL DEFAULT '{}',
  alert_rules JSONB NOT NULL DEFAULT '[]',
  dashboard_configs JSONB NOT NULL DEFAULT '[]',
  data_retention_days INTEGER NOT NULL DEFAULT 30,
  scrape_intervals TEXT NOT NULL DEFAULT '30s',
  notification_channels JSONB NOT NULL DEFAULT '[]',
  sla_configs JSONB NOT NULL DEFAULT '{}',
  availability_targets JSONB NOT NULL DEFAULT '{}',
  performance_baselines JSONB NOT NULL DEFAULT '{}',
  anomaly_detection_rules JSONB NOT NULL DEFAULT '[]',
  auto_remediation_rules JSONB NOT NULL DEFAULT '[]',
  compliance_configs JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.advanced_caching_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_layer TEXT NOT NULL, -- 'redis', 'elasticsearch', 'cdn', 'application', 'database'
  cache_strategy TEXT NOT NULL, -- 'write-through', 'write-behind', 'cache-aside', 'refresh-ahead'
  ttl_seconds INTEGER,
  max_memory_mb INTEGER,
  eviction_policy TEXT,
  replication_config JSONB DEFAULT '{}',
  sharding_config JSONB DEFAULT '{}',
  encryption_enabled BOOLEAN DEFAULT false,
  compression_enabled BOOLEAN DEFAULT false,
  monitoring_config JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  hit_rate_threshold NUMERIC DEFAULT 0.8,
  invalidation_rules JSONB DEFAULT '[]',
  warming_strategies JSONB DEFAULT '[]',
  cdn_config JSONB DEFAULT '{}',
  geo_distribution JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enterprise_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL UNIQUE,
  feature_type TEXT NOT NULL, -- 'ai-ml', 'analytics', 'security', 'performance', 'business'
  implementation_status TEXT NOT NULL DEFAULT 'planned', -- 'planned', 'in-progress', 'testing', 'deployed', 'deprecated'
  priority_level TEXT NOT NULL DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
  amazon_equivalent TEXT,
  shopee_equivalent TEXT,
  description TEXT,
  technical_requirements JSONB DEFAULT '{}',
  business_requirements JSONB DEFAULT '{}',
  implementation_plan JSONB DEFAULT '{}',
  success_metrics JSONB DEFAULT '{}',
  dependencies TEXT[],
  estimated_effort_days INTEGER,
  assigned_team TEXT,
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  business_impact_score INTEGER CHECK (business_impact_score BETWEEN 1 AND 10),
  technical_complexity_score INTEGER CHECK (technical_complexity_score BETWEEN 1 AND 10),
  roi_estimate NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert critical enterprise features
INSERT INTO public.enterprise_features (feature_name, feature_type, priority_level, amazon_equivalent, shopee_equivalent, description, business_impact_score, technical_complexity_score, estimated_effort_days) VALUES
('AI-Powered Personalization Engine', 'ai-ml', 'critical', 'Amazon Personalize', 'Shopee Recommendations', 'Real-time ML-based product recommendations', 10, 9, 45),
('Advanced Fraud Detection', 'security', 'critical', 'Amazon Fraud Detector', 'Shopee Risk Management', 'ML-based fraud detection and prevention', 9, 8, 30),
('Dynamic Pricing Optimization', 'ai-ml', 'high', 'Amazon Dynamic Pricing', 'Shopee Smart Pricing', 'AI-driven pricing optimization', 9, 7, 35),
('Real-time Inventory Management', 'performance', 'critical', 'Amazon Inventory Planning', 'Shopee Stock Management', 'Real-time inventory sync and forecasting', 8, 6, 25),
('Advanced Analytics & BI', 'analytics', 'high', 'Amazon QuickSight', 'Shopee Analytics', 'Enterprise-grade business intelligence', 8, 7, 40),
('Multi-region Deployment', 'performance', 'high', 'AWS Global Infrastructure', 'Shopee Regional Expansion', 'Global content delivery and redundancy', 7, 9, 60),
('Chaos Engineering Framework', 'performance', 'medium', 'AWS Chaos Engineering', 'Shopee Resilience Testing', 'Automated fault injection and testing', 6, 8, 20),
('Advanced Search & Discovery', 'ai-ml', 'high', 'Amazon Elasticsearch', 'Shopee Search', 'AI-enhanced search with NLP', 8, 6, 30);

-- Enable RLS
ALTER TABLE public.kubernetes_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_mesh_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_monitoring_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_caching_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_features ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin full access kubernetes_deployments" ON public.kubernetes_deployments FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access service_mesh_config" ON public.service_mesh_config FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access advanced_monitoring_config" ON public.advanced_monitoring_config FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access advanced_caching_config" ON public.advanced_caching_config FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access enterprise_features" ON public.enterprise_features FOR ALL USING (is_admin_user());

-- Create indexes
CREATE INDEX idx_kubernetes_deployments_namespace ON public.kubernetes_deployments(namespace);
CREATE INDEX idx_kubernetes_deployments_type ON public.kubernetes_deployments(deployment_type);
CREATE INDEX idx_kubernetes_deployments_status ON public.kubernetes_deployments(status);
CREATE INDEX idx_service_mesh_service_name ON public.service_mesh_config(service_name);
CREATE INDEX idx_monitoring_type ON public.advanced_monitoring_config(monitoring_type);
CREATE INDEX idx_caching_layer ON public.advanced_caching_config(cache_layer);
CREATE INDEX idx_enterprise_features_type ON public.enterprise_features(feature_type);
CREATE INDEX idx_enterprise_features_status ON public.enterprise_features(implementation_status);
CREATE INDEX idx_enterprise_features_priority ON public.enterprise_features(priority_level);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kubernetes_deployments_updated_at BEFORE UPDATE ON public.kubernetes_deployments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_mesh_config_updated_at BEFORE UPDATE ON public.service_mesh_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_advanced_monitoring_config_updated_at BEFORE UPDATE ON public.advanced_monitoring_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_advanced_caching_config_updated_at BEFORE UPDATE ON public.advanced_caching_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enterprise_features_updated_at BEFORE UPDATE ON public.enterprise_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();