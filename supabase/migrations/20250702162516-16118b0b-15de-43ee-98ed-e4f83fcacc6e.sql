-- Additional Enterprise Features for Amazon/Shopee Level Platform

-- Advanced AI & Machine Learning Tables
CREATE TABLE public.ai_behavior_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  prediction_type TEXT NOT NULL,
  prediction_data JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0,
  predicted_action TEXT,
  probability_score NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  model_version TEXT NOT NULL DEFAULT '1.0'
);

CREATE TABLE public.customer_lifetime_value (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  current_clv NUMERIC(12,2) NOT NULL DEFAULT 0,
  predicted_clv NUMERIC(12,2) NOT NULL DEFAULT 0,
  clv_segment TEXT NOT NULL DEFAULT 'low',
  purchase_frequency NUMERIC(5,2) DEFAULT 0,
  average_order_value NUMERIC(10,2) DEFAULT 0,
  customer_lifespan_months INTEGER DEFAULT 0,
  churn_probability NUMERIC(3,2) DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  calculation_factors JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enterprise Analytics & Business Intelligence
CREATE TABLE public.executive_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_name TEXT NOT NULL,
  dashboard_type TEXT NOT NULL,
  executive_level TEXT NOT NULL,
  widgets JSONB NOT NULL DEFAULT '[]',
  filters JSONB DEFAULT '{}',
  refresh_interval INTEGER DEFAULT 300,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.business_intelligence_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  report_category TEXT NOT NULL,
  data_sources JSONB NOT NULL DEFAULT '[]',
  filters JSONB DEFAULT '{}',
  scheduled_frequency TEXT,
  report_data JSONB DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Supply Chain & Inventory Optimization
CREATE TABLE public.supply_chain_optimization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID,
  product_id UUID,
  optimization_type TEXT NOT NULL,
  current_metrics JSONB NOT NULL DEFAULT '{}',
  optimized_metrics JSONB NOT NULL DEFAULT '{}',
  improvement_percentage NUMERIC(5,2),
  implementation_status TEXT DEFAULT 'pending',
  cost_savings NUMERIC(12,2) DEFAULT 0,
  efficiency_gains JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  implemented_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.automated_inventory_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  vendor_id UUID,
  reorder_point INTEGER NOT NULL,
  optimal_stock_level INTEGER NOT NULL,
  safety_stock INTEGER DEFAULT 0,
  lead_time_days INTEGER DEFAULT 7,
  demand_forecast JSONB DEFAULT '{}',
  seasonal_factors JSONB DEFAULT '{}',
  auto_reorder_enabled BOOLEAN DEFAULT false,
  last_reorder_date DATE,
  next_predicted_reorder DATE,
  algorithm_version TEXT DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer Experience Enhancement
CREATE TABLE public.social_commerce_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  content_data JSONB NOT NULL DEFAULT '{}',
  engagement_metrics JSONB DEFAULT '{}',
  virality_score NUMERIC(5,2) DEFAULT 0,
  social_proof_indicators JSONB DEFAULT '{}',
  influence_network JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.loyalty_rewards_system (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  loyalty_tier TEXT NOT NULL DEFAULT 'bronze',
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  lifetime_spending NUMERIC(12,2) DEFAULT 0,
  tier_benefits JSONB DEFAULT '{}',
  points_history JSONB DEFAULT '[]',
  next_tier_requirements JSONB DEFAULT '{}',
  anniversary_date DATE,
  special_offers JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advanced Search & Discovery Enhancement
CREATE TABLE public.visual_search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  image_url TEXT NOT NULL,
  visual_features JSONB NOT NULL DEFAULT '{}',
  color_palette JSONB DEFAULT '{}',
  style_attributes JSONB DEFAULT '{}',
  similarity_vectors JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  model_version TEXT DEFAULT '1.0'
);

CREATE TABLE public.voice_search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  audio_url TEXT,
  transcribed_text TEXT,
  search_intent TEXT,
  detected_language TEXT DEFAULT 'bn',
  confidence_score NUMERIC(3,2) DEFAULT 0,
  search_results JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quality Assurance & Content Moderation
CREATE TABLE public.quality_assurance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  check_type TEXT NOT NULL,
  quality_score NUMERIC(3,2) DEFAULT 0,
  issues_detected JSONB DEFAULT '[]',
  auto_resolution_applied BOOLEAN DEFAULT false,
  manual_review_required BOOLEAN DEFAULT false,
  reviewed_by UUID REFERENCES auth.users(id),
  resolution_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Performance Monitoring & SLA Tracking
CREATE TABLE public.sla_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  sla_type TEXT NOT NULL,
  target_value NUMERIC(10,4) NOT NULL,
  actual_value NUMERIC(10,4),
  measurement_period INTERVAL NOT NULL,
  compliance_status TEXT DEFAULT 'measuring',
  breach_count INTEGER DEFAULT 0,
  breach_details JSONB DEFAULT '[]',
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_ai_behavior_predictions_user_id ON ai_behavior_predictions(user_id);
CREATE INDEX idx_ai_behavior_predictions_type ON ai_behavior_predictions(prediction_type);
CREATE INDEX idx_customer_lifetime_value_user_id ON customer_lifetime_value(user_id);
CREATE INDEX idx_customer_lifetime_value_segment ON customer_lifetime_value(clv_segment);
CREATE INDEX idx_supply_chain_vendor_id ON supply_chain_optimization(vendor_id);
CREATE INDEX idx_supply_chain_product_id ON supply_chain_optimization(product_id);
CREATE INDEX idx_loyalty_rewards_user_id ON loyalty_rewards_system(user_id);
CREATE INDEX idx_loyalty_rewards_tier ON loyalty_rewards_system(loyalty_tier);
CREATE INDEX idx_visual_search_product_id ON visual_search_index(product_id);
CREATE INDEX idx_voice_search_user_id ON voice_search_queries(user_id);
CREATE INDEX idx_quality_assurance_content ON quality_assurance_checks(content_type, content_id);
CREATE INDEX idx_sla_tracking_service ON sla_tracking(service_name);

-- Enable RLS
ALTER TABLE ai_behavior_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_lifetime_value ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_intelligence_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_inventory_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_commerce_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards_system ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_search_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_assurance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their AI predictions" ON ai_behavior_predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage AI predictions" ON ai_behavior_predictions FOR ALL USING (is_admin_user());

CREATE POLICY "Users can view their CLV" ON customer_lifetime_value FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage CLV" ON customer_lifetime_value FOR ALL USING (is_admin_user());

CREATE POLICY "Admins can manage executive dashboards" ON executive_dashboards FOR ALL USING (is_admin_user());

CREATE POLICY "Admins can manage BI reports" ON business_intelligence_reports FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can view their supply chain data" ON supply_chain_optimization FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admins can manage supply chain" ON supply_chain_optimization FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can view their inventory management" ON automated_inventory_management FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admins can manage inventory automation" ON automated_inventory_management FOR ALL USING (is_admin_user());

CREATE POLICY "Users can manage their social commerce" ON social_commerce_features FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their loyalty data" ON loyalty_rewards_system FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can read visual search index" ON visual_search_index FOR SELECT USING (true);
CREATE POLICY "Admins can manage visual search" ON visual_search_index FOR ALL USING (is_admin_user());

CREATE POLICY "Users can view their voice searches" ON voice_search_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create voice searches" ON voice_search_queries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage quality assurance" ON quality_assurance_checks FOR ALL USING (is_admin_user());

CREATE POLICY "Admins can view SLA tracking" ON sla_tracking FOR SELECT USING (is_admin_user());

-- Add updated_at triggers
CREATE TRIGGER update_customer_lifetime_value_updated_at BEFORE UPDATE ON customer_lifetime_value FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_executive_dashboards_updated_at BEFORE UPDATE ON executive_dashboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automated_inventory_management_updated_at BEFORE UPDATE ON automated_inventory_management FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loyalty_rewards_system_updated_at BEFORE UPDATE ON loyalty_rewards_system FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO executive_dashboards (dashboard_name, dashboard_type, executive_level, widgets, created_by) VALUES
('CEO Performance Dashboard', 'performance', 'ceo', '[{"type": "revenue_overview", "position": {"x": 0, "y": 0}}, {"type": "market_share", "position": {"x": 1, "y": 0}}, {"type": "customer_growth", "position": {"x": 0, "y": 1}}]', '00000000-0000-0000-0000-000000000000'),
('COO Operations Dashboard', 'operations', 'coo', '[{"type": "supply_chain_efficiency", "position": {"x": 0, "y": 0}}, {"type": "inventory_turnover", "position": {"x": 1, "y": 0}}, {"type": "fulfillment_metrics", "position": {"x": 0, "y": 1}}]', '00000000-0000-0000-0000-000000000000'),
('CMO Marketing Dashboard', 'marketing', 'cmo', '[{"type": "customer_acquisition_cost", "position": {"x": 0, "y": 0}}, {"type": "conversion_rates", "position": {"x": 1, "y": 0}}, {"type": "campaign_performance", "position": {"x": 0, "y": 1}}]', '00000000-0000-0000-0000-000000000000');

INSERT INTO loyalty_rewards_system (user_id, loyalty_tier, total_points, available_points, tier_benefits) VALUES
('00000000-0000-0000-0000-000000000000', 'platinum', 15000, 5000, '{"free_shipping": true, "priority_support": true, "exclusive_deals": true, "birthday_bonus": 500}'),
('00000000-0000-0000-0000-000000000001', 'gold', 8000, 2000, '{"free_shipping": true, "priority_support": false, "exclusive_deals": true, "birthday_bonus": 300}'),
('00000000-0000-0000-0000-000000000002', 'silver', 3000, 800, '{"free_shipping": false, "priority_support": false, "exclusive_deals": false, "birthday_bonus": 100}');

-- Success message
SELECT 'Enterprise features database schema created successfully!' as message;