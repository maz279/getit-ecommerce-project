-- Bangladesh Payment Gateway Integration Tables
CREATE TABLE public.bd_payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name TEXT NOT NULL CHECK (gateway_name IN ('bkash', 'nagad', 'rocket')),
  is_active BOOLEAN DEFAULT true,
  api_config JSONB NOT NULL DEFAULT '{}',
  fee_structure JSONB NOT NULL DEFAULT '{}',
  transaction_limits JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.bd_payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  merchant_transaction_id TEXT NOT NULL,
  order_id UUID,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'BDT',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  gateway_response JSONB DEFAULT '{}',
  customer_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Bangladesh Courier Integration Tables
CREATE TABLE public.bd_courier_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  courier_name TEXT NOT NULL CHECK (courier_name IN ('pathao', 'paperfly', 'redx', 'ecourier', 'sundarban')),
  is_active BOOLEAN DEFAULT true,
  api_config JSONB NOT NULL DEFAULT '{}',
  coverage_areas JSONB NOT NULL DEFAULT '[]',
  pricing_structure JSONB NOT NULL DEFAULT '{}',
  service_types JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.courier_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  courier_name TEXT NOT NULL,
  tracking_id TEXT NOT NULL,
  pickup_address JSONB NOT NULL,
  delivery_address JSONB NOT NULL,
  package_details JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  estimated_delivery DATE,
  actual_delivery_date DATE,
  delivery_attempts INTEGER DEFAULT 0,
  courier_response JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bangladesh KYC Verification Tables
CREATE TABLE public.bd_kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('nid', 'trade_license', 'tin', 'bank_account')),
  document_number TEXT NOT NULL,
  document_data JSONB NOT NULL DEFAULT '{}',
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
  rejection_reason TEXT,
  api_response JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Recommendation Engine Tables
CREATE TABLE public.ai_recommendation_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('collaborative', 'content_based', 'hybrid', 'deep_learning')),
  version TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  model_config JSONB NOT NULL DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  last_trained TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.product_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  product_id UUID NOT NULL,
  recommended_products JSONB NOT NULL DEFAULT '[]',
  recommendation_type TEXT NOT NULL,
  confidence_score NUMERIC(3,2),
  model_version TEXT,
  context_data JSONB DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Advanced Inventory Management Tables
CREATE TABLE public.inventory_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_demand INTEGER NOT NULL,
  confidence_level NUMERIC(3,2),
  seasonal_factors JSONB DEFAULT '{}',
  external_factors JSONB DEFAULT '{}',
  model_used TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'overstock', 'stockout', 'reorder_point', 'dead_stock')),
  threshold_value INTEGER,
  current_value INTEGER,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.smart_reorder_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  suggested_quantity INTEGER NOT NULL,
  suggested_reorder_date DATE NOT NULL,
  cost_analysis JSONB DEFAULT '{}',
  demand_forecast JSONB DEFAULT '{}',
  supplier_lead_time INTEGER,
  priority_score NUMERIC(3,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time Business Intelligence Tables
CREATE TABLE public.business_intelligence_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_name TEXT NOT NULL,
  dashboard_type TEXT NOT NULL,
  user_role TEXT NOT NULL,
  widget_config JSONB NOT NULL DEFAULT '[]',
  refresh_interval INTEGER DEFAULT 300,
  is_real_time BOOLEAN DEFAULT true,
  access_permissions JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.real_time_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_name TEXT NOT NULL,
  kpi_category TEXT NOT NULL,
  current_value NUMERIC,
  target_value NUMERIC,
  unit TEXT,
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable')),
  calculation_method TEXT NOT NULL,
  data_sources JSONB DEFAULT '[]',
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Order Orchestration Tables
CREATE TABLE public.order_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT NOT NULL,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('single_vendor', 'multi_vendor', 'dropship', 'marketplace')),
  workflow_steps JSONB NOT NULL DEFAULT '[]',
  conditions JSONB DEFAULT '{}',
  automation_rules JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.order_orchestration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  workflow_id UUID NOT NULL,
  current_step TEXT NOT NULL,
  step_status TEXT NOT NULL CHECK (step_status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  step_data JSONB DEFAULT '{}',
  error_details TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Cache Management Tables
CREATE TABLE public.cache_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  cache_type TEXT NOT NULL CHECK (cache_type IN ('redis', 'memory', 'database', 'cdn')),
  ttl_seconds INTEGER NOT NULL,
  cache_strategy TEXT NOT NULL CHECK (cache_strategy IN ('write_through', 'write_back', 'write_around', 'refresh_ahead')),
  invalidation_rules JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CDN Management Tables
CREATE TABLE public.cdn_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('images', 'videos', 'documents', 'static_assets')),
  cdn_provider TEXT NOT NULL,
  distribution_settings JSONB NOT NULL DEFAULT '{}',
  caching_rules JSONB DEFAULT '{}',
  geographic_restrictions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_bd_payment_transactions_order_id ON public.bd_payment_transactions(order_id);
CREATE INDEX idx_bd_payment_transactions_gateway_status ON public.bd_payment_transactions(gateway_name, status);
CREATE INDEX idx_courier_shipments_order_id ON public.courier_shipments(order_id);
CREATE INDEX idx_courier_shipments_tracking_id ON public.courier_shipments(tracking_id);
CREATE INDEX idx_bd_kyc_verifications_vendor_id ON public.bd_kyc_verifications(vendor_id);
CREATE INDEX idx_product_recommendations_user_id ON public.product_recommendations(user_id);
CREATE INDEX idx_product_recommendations_expires_at ON public.product_recommendations(expires_at);
CREATE INDEX idx_inventory_forecasts_product_date ON public.inventory_forecasts(product_id, forecast_date);
CREATE INDEX idx_inventory_alerts_product_severity ON public.inventory_alerts(product_id, severity);
CREATE INDEX idx_order_orchestration_logs_order_id ON public.order_orchestration_logs(order_id);

-- Enable RLS
ALTER TABLE public.bd_payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bd_payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bd_courier_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bd_kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendation_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_reorder_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_intelligence_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_orchestration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cdn_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access bd_payment_gateways" ON public.bd_payment_gateways FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access bd_payment_transactions" ON public.bd_payment_transactions FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access bd_courier_partners" ON public.bd_courier_partners FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access courier_shipments" ON public.courier_shipments FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access bd_kyc_verifications" ON public.bd_kyc_verifications FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access ai_recommendation_models" ON public.ai_recommendation_models FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Users can view their recommendations" ON public.product_recommendations FOR SELECT TO authenticated USING (auth.uid() = user_id OR is_admin_user());
CREATE POLICY "Admin full access inventory_forecasts" ON public.inventory_forecasts FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access inventory_alerts" ON public.inventory_alerts FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Vendors can view their reorder suggestions" ON public.smart_reorder_suggestions FOR SELECT TO authenticated USING (auth.uid() = vendor_id OR is_admin_user());
CREATE POLICY "Admin full access business_intelligence_dashboards" ON public.business_intelligence_dashboards FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access real_time_kpis" ON public.real_time_kpis FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access order_workflows" ON public.order_workflows FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access order_orchestration_logs" ON public.order_orchestration_logs FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access cache_configurations" ON public.cache_configurations FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access cdn_configurations" ON public.cdn_configurations FOR ALL TO authenticated USING (is_admin_user());

-- Triggers for updated_at
CREATE TRIGGER update_bd_payment_gateways_updated_at BEFORE UPDATE ON public.bd_payment_gateways FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bd_courier_partners_updated_at BEFORE UPDATE ON public.bd_courier_partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courier_shipments_updated_at BEFORE UPDATE ON public.courier_shipments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bd_kyc_verifications_updated_at BEFORE UPDATE ON public.bd_kyc_verifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_recommendation_models_updated_at BEFORE UPDATE ON public.ai_recommendation_models FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_smart_reorder_suggestions_updated_at BEFORE UPDATE ON public.smart_reorder_suggestions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_intelligence_dashboards_updated_at BEFORE UPDATE ON public.business_intelligence_dashboards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_order_workflows_updated_at BEFORE UPDATE ON public.order_workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cache_configurations_updated_at BEFORE UPDATE ON public.cache_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cdn_configurations_updated_at BEFORE UPDATE ON public.cdn_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();