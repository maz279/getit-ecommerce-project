-- Phase 3: Amazon-Level Analytics Features

-- Real-time Anomaly Detection Tables
CREATE TABLE public.anomaly_detection_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('threshold', 'pattern', 'statistical', 'ml_based')),
  metric_type TEXT NOT NULL,
  threshold_config JSONB NOT NULL DEFAULT '{}',
  severity_level TEXT NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.anomaly_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES public.anomaly_detection_rules(id),
  anomaly_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  expected_value NUMERIC,
  actual_value NUMERIC NOT NULL,
  deviation_percentage NUMERIC,
  severity_score NUMERIC NOT NULL,
  context_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'false_positive')),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID
);

-- Predictive Inventory Management Tables
CREATE TABLE public.inventory_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  prediction_horizon INTEGER NOT NULL, -- days
  predicted_demand NUMERIC NOT NULL,
  recommended_stock_level NUMERIC NOT NULL,
  reorder_point NUMERIC NOT NULL,
  lead_time_days INTEGER NOT NULL,
  confidence_score NUMERIC NOT NULL,
  seasonality_factor NUMERIC DEFAULT 1.0,
  trend_factor NUMERIC DEFAULT 1.0,
  external_factors JSONB DEFAULT '{}',
  prediction_model TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE public.dynamic_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  category_id UUID,
  vendor_id UUID,
  rule_name TEXT NOT NULL,
  pricing_strategy TEXT NOT NULL CHECK (pricing_strategy IN ('competitive', 'demand_based', 'inventory_based', 'margin_optimization')),
  base_price NUMERIC NOT NULL,
  min_price NUMERIC NOT NULL,
  max_price NUMERIC NOT NULL,
  adjustment_factors JSONB NOT NULL DEFAULT '{}',
  competition_weight NUMERIC DEFAULT 0.3,
  demand_weight NUMERIC DEFAULT 0.4,
  inventory_weight NUMERIC DEFAULT 0.3,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.dynamic_pricing_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  rule_id UUID REFERENCES public.dynamic_pricing_rules(id),
  current_price NUMERIC NOT NULL,
  suggested_price NUMERIC NOT NULL,
  price_change_percentage NUMERIC NOT NULL,
  reasoning JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC NOT NULL,
  estimated_impact JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied')),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  applied_at TIMESTAMP WITH TIME ZONE,
  applied_by UUID
);

-- Customer Journey Analytics Tables
CREATE TABLE public.customer_journey_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_name TEXT NOT NULL UNIQUE,
  stage_order INTEGER NOT NULL,
  description TEXT,
  expected_duration_days INTEGER,
  conversion_goals JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.customer_journey_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  stage_id UUID REFERENCES public.customer_journey_stages(id),
  event_properties JSONB DEFAULT '{}',
  session_id TEXT,
  device_info JSONB DEFAULT '{}',
  location_data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processing_status TEXT DEFAULT 'pending'
);

CREATE TABLE public.customer_journey_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  journey_start DATE NOT NULL,
  journey_end DATE,
  current_stage_id UUID REFERENCES public.customer_journey_stages(id),
  stages_completed JSONB DEFAULT '[]',
  conversion_events JSONB DEFAULT '[]',
  total_interactions INTEGER DEFAULT 0,
  total_time_spent_minutes INTEGER DEFAULT 0,
  conversion_probability NUMERIC,
  churn_risk_score NUMERIC,
  next_best_action JSONB DEFAULT '{}',
  customer_value_score NUMERIC,
  engagement_score NUMERIC,
  last_interaction TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advanced AI Insights Tables
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL CHECK (insight_type IN ('anomaly', 'prediction', 'recommendation', 'pattern', 'optimization')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  insight_data JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC NOT NULL,
  impact_level TEXT NOT NULL CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
  business_value_estimate NUMERIC,
  actionable_recommendations JSONB DEFAULT '[]',
  related_entities JSONB DEFAULT '{}',
  generated_by TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'acted_upon', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_anomaly_detections_detected_at ON public.anomaly_detections(detected_at DESC);
CREATE INDEX idx_anomaly_detections_status ON public.anomaly_detections(status);
CREATE INDEX idx_inventory_predictions_product_vendor ON public.inventory_predictions(product_id, vendor_id);
CREATE INDEX idx_inventory_predictions_valid_until ON public.inventory_predictions(valid_until);
CREATE INDEX idx_dynamic_pricing_suggestions_product ON public.dynamic_pricing_suggestions(product_id);
CREATE INDEX idx_dynamic_pricing_suggestions_status ON public.dynamic_pricing_suggestions(status);
CREATE INDEX idx_customer_journey_events_customer ON public.customer_journey_events(customer_id);
CREATE INDEX idx_customer_journey_events_timestamp ON public.customer_journey_events(timestamp DESC);
CREATE INDEX idx_customer_journey_analytics_customer ON public.customer_journey_analytics(customer_id);
CREATE INDEX idx_ai_insights_type_created ON public.ai_insights(insight_type, created_at DESC);

-- Insert default customer journey stages
INSERT INTO public.customer_journey_stages (stage_name, stage_order, description, expected_duration_days) VALUES
('Awareness', 1, 'Customer becomes aware of the platform', 1),
('Interest', 2, 'Customer shows interest by browsing products', 3),
('Consideration', 3, 'Customer compares products and vendors', 7),
('Purchase Intent', 4, 'Customer adds items to cart or wishlist', 2),
('Purchase', 5, 'Customer completes a transaction', 1),
('Post-Purchase', 6, 'Customer receives and evaluates purchase', 14),
('Loyalty', 7, 'Customer becomes a repeat buyer', 30),
('Advocacy', 8, 'Customer refers others to the platform', 60);

-- Enable RLS
ALTER TABLE public.anomaly_detection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_pricing_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_journey_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin can manage anomaly detection rules" ON public.anomaly_detection_rules FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can view anomaly detections" ON public.anomaly_detections FOR SELECT USING (is_admin_user());
CREATE POLICY "Vendors can view their inventory predictions" ON public.inventory_predictions FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Admin can manage pricing rules" ON public.dynamic_pricing_rules FOR ALL USING (is_admin_user());
CREATE POLICY "Vendors can view their pricing suggestions" ON public.dynamic_pricing_suggestions FOR SELECT USING (product_id IN (SELECT id FROM products WHERE vendor_id = auth.uid()) OR is_admin_user());
CREATE POLICY "Public can view journey stages" ON public.customer_journey_stages FOR SELECT USING (true);
CREATE POLICY "Users can insert journey events" ON public.customer_journey_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view journey events" ON public.customer_journey_events FOR SELECT USING (is_admin_user());
CREATE POLICY "Admin can view customer analytics" ON public.customer_journey_analytics FOR SELECT USING (is_admin_user());
CREATE POLICY "Admin can view AI insights" ON public.ai_insights FOR SELECT USING (is_admin_user());

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_journey_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update customer journey analytics when events are added
  INSERT INTO public.customer_journey_analytics (
    customer_id, 
    journey_start, 
    current_stage_id,
    total_interactions,
    last_interaction
  ) VALUES (
    NEW.customer_id,
    CURRENT_DATE,
    NEW.stage_id,
    1,
    NEW.timestamp
  )
  ON CONFLICT (customer_id) DO UPDATE SET
    current_stage_id = NEW.stage_id,
    total_interactions = customer_journey_analytics.total_interactions + 1,
    last_interaction = NEW.timestamp,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_journey_analytics
  AFTER INSERT ON public.customer_journey_events
  FOR EACH ROW
  EXECUTE FUNCTION update_journey_analytics();