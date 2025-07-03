-- Supply Chain Optimization and Inventory Forecasting Tables

-- Supply Chain Analytics
CREATE TABLE public.supply_chain_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  product_id UUID REFERENCES products(id),
  inventory_level INTEGER NOT NULL DEFAULT 0,
  demand_forecast INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  optimal_stock_level INTEGER NOT NULL DEFAULT 0,
  lead_time_days INTEGER NOT NULL DEFAULT 7,
  seasonal_factors JSONB DEFAULT '{}',
  demand_patterns JSONB DEFAULT '{}',
  forecast_accuracy NUMERIC(5,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inventory Forecasting
CREATE TABLE public.inventory_forecasting (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  vendor_id UUID REFERENCES vendors(id),
  forecast_date DATE NOT NULL,
  forecast_period TEXT NOT NULL DEFAULT 'weekly',
  predicted_demand INTEGER NOT NULL,
  confidence_level NUMERIC(5,2) DEFAULT 0.85,
  model_used TEXT NOT NULL DEFAULT 'arima',
  input_variables JSONB DEFAULT '{}',
  seasonal_adjustments JSONB DEFAULT '{}',
  trend_components JSONB DEFAULT '{}',
  forecast_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advanced Fraud Detection Events
CREATE TABLE public.advanced_fraud_detection (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  transaction_id UUID,
  vendor_id UUID,
  fraud_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'low',
  detection_model TEXT NOT NULL DEFAULT 'ml_ensemble',
  fraud_indicators JSONB DEFAULT '[]',
  behavioral_analysis JSONB DEFAULT '{}',
  device_fingerprint JSONB DEFAULT '{}',
  geolocation_data JSONB DEFAULT '{}',
  payment_patterns JSONB DEFAULT '{}',
  ml_predictions JSONB DEFAULT '{}',
  mitigation_actions JSONB DEFAULT '[]',
  investigation_status TEXT DEFAULT 'pending',
  false_positive BOOLEAN DEFAULT NULL,
  analyst_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Vendor Marketplace Tools
CREATE TABLE public.vendor_marketplace_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  tool_name TEXT NOT NULL,
  tool_category TEXT NOT NULL,
  configuration JSONB DEFAULT '{}',
  usage_analytics JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  subscription_status TEXT DEFAULT 'active',
  last_accessed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Voice Search Analytics
CREATE TABLE public.voice_search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  voice_query TEXT NOT NULL,
  transcribed_text TEXT,
  confidence_score NUMERIC(5,2) DEFAULT 0,
  language_detected TEXT DEFAULT 'en',
  intent_classification JSONB DEFAULT '{}',
  search_results JSONB DEFAULT '[]',
  user_interaction JSONB DEFAULT '{}',
  conversion_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AR/VR Interaction Tracking
CREATE TABLE public.ar_vr_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  product_id UUID REFERENCES products(id),
  interaction_type TEXT NOT NULL,
  ar_session_data JSONB DEFAULT '{}',
  vr_session_data JSONB DEFAULT '{}',
  device_capabilities JSONB DEFAULT '{}',
  session_duration INTEGER DEFAULT 0,
  engagement_metrics JSONB DEFAULT '{}',
  conversion_outcome BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mobile App Analytics
CREATE TABLE public.mobile_app_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  device_id TEXT,
  app_version TEXT,
  platform TEXT NOT NULL,
  session_duration INTEGER DEFAULT 0,
  screen_views JSONB DEFAULT '[]',
  user_actions JSONB DEFAULT '[]',
  push_notification_interactions JSONB DEFAULT '{}',
  offline_usage JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  crash_reports JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ML Model Performance Tracking
CREATE TABLE public.ml_model_performance_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  model_type TEXT NOT NULL,
  version TEXT NOT NULL,
  performance_metrics JSONB NOT NULL DEFAULT '{}',
  training_data_size INTEGER,
  validation_accuracy NUMERIC(5,4),
  test_accuracy NUMERIC(5,4),
  precision_score NUMERIC(5,4),
  recall_score NUMERIC(5,4),
  f1_score NUMERIC(5,4),
  deployment_status TEXT DEFAULT 'active',
  last_evaluation TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time Supply Chain Events
CREATE TABLE public.supply_chain_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  product_id UUID REFERENCES products(id),
  event_data JSONB NOT NULL DEFAULT '{}',
  severity_level TEXT DEFAULT 'low',
  impact_assessment JSONB DEFAULT '{}',
  automated_response JSONB DEFAULT '{}',
  manual_intervention_required BOOLEAN DEFAULT false,
  resolution_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.supply_chain_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_forecasting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_marketplace_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ar_vr_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_app_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_model_performance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Admin full access supply_chain_analytics" ON public.supply_chain_analytics FOR ALL USING (is_admin_user());
CREATE POLICY "Vendors can view their supply chain analytics" ON public.supply_chain_analytics FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Admin full access inventory_forecasting" ON public.inventory_forecasting FOR ALL USING (is_admin_user());
CREATE POLICY "Vendors can view their inventory forecasting" ON public.inventory_forecasting FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Admin full access advanced_fraud_detection" ON public.advanced_fraud_detection FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can manage their marketplace tools" ON public.vendor_marketplace_tools FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Users can view their voice search analytics" ON public.voice_search_analytics FOR SELECT USING (user_id = auth.uid() OR is_admin_user());
CREATE POLICY "Public can insert voice search analytics" ON public.voice_search_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their AR/VR interactions" ON public.ar_vr_interactions FOR SELECT USING (user_id = auth.uid() OR is_admin_user());
CREATE POLICY "Public can insert AR/VR interactions" ON public.ar_vr_interactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their mobile app analytics" ON public.mobile_app_analytics FOR SELECT USING (user_id = auth.uid() OR is_admin_user());
CREATE POLICY "Public can insert mobile app analytics" ON public.mobile_app_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access ml_model_performance_tracking" ON public.ml_model_performance_tracking FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access supply_chain_events" ON public.supply_chain_events FOR ALL USING (is_admin_user());
CREATE POLICY "Vendors can view their supply chain events" ON public.supply_chain_events FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

-- Create indexes for performance
CREATE INDEX idx_supply_chain_analytics_vendor_product ON public.supply_chain_analytics(vendor_id, product_id);
CREATE INDEX idx_inventory_forecasting_date ON public.inventory_forecasting(forecast_date);
CREATE INDEX idx_advanced_fraud_detection_score ON public.advanced_fraud_detection(fraud_score DESC);
CREATE INDEX idx_voice_search_analytics_date ON public.voice_search_analytics(created_at);
CREATE INDEX idx_ar_vr_interactions_product ON public.ar_vr_interactions(product_id);
CREATE INDEX idx_mobile_app_analytics_platform ON public.mobile_app_analytics(platform);
CREATE INDEX idx_supply_chain_events_vendor ON public.supply_chain_events(vendor_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_supply_chain_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_supply_chain_analytics_updated_at
    BEFORE UPDATE ON public.supply_chain_analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_supply_chain_analytics_updated_at();

CREATE TRIGGER update_inventory_forecasting_updated_at
    BEFORE UPDATE ON public.inventory_forecasting
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_marketplace_tools_updated_at
    BEFORE UPDATE ON public.vendor_marketplace_tools
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();