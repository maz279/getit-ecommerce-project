-- AI-Powered Predictive Analytics Tables
CREATE TABLE public.ai_sales_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id),
  product_id UUID REFERENCES public.products(id),
  forecast_date DATE NOT NULL,
  forecast_period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly'
  predicted_sales NUMERIC NOT NULL,
  predicted_units INTEGER NOT NULL,
  confidence_interval JSONB NOT NULL DEFAULT '{}', -- {lower: 0.7, upper: 0.9}
  seasonality_factors JSONB DEFAULT '{}',
  model_accuracy NUMERIC,
  algorithm_used TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.demand_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  prediction_date DATE NOT NULL,
  predicted_demand INTEGER NOT NULL,
  demand_factors JSONB DEFAULT '{}', -- weather, events, trends
  confidence_score NUMERIC,
  historical_patterns JSONB DEFAULT '{}',
  external_factors JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.price_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  current_price NUMERIC NOT NULL,
  recommended_price NUMERIC NOT NULL,
  price_elasticity NUMERIC,
  competitor_prices JSONB DEFAULT '[]',
  demand_sensitivity NUMERIC,
  profit_impact NUMERIC,
  optimization_strategy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.inventory_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  forecast_date DATE NOT NULL,
  predicted_stock_level INTEGER NOT NULL,
  reorder_recommendation INTEGER,
  stockout_probability NUMERIC,
  optimal_stock_level INTEGER,
  lead_time_forecast INTEGER, -- days
  seasonal_adjustment NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-Time Market Intelligence Tables
CREATE TABLE public.competitive_pricing_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  competitor_name TEXT NOT NULL,
  competitor_price NUMERIC NOT NULL,
  our_price NUMERIC NOT NULL,
  price_difference NUMERIC NOT NULL,
  market_position TEXT, -- 'above', 'below', 'competitive'
  price_trend JSONB DEFAULT '[]', -- historical prices
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_source TEXT
);

CREATE TABLE public.market_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id),
  trend_name TEXT NOT NULL,
  trend_direction TEXT NOT NULL, -- 'up', 'down', 'stable'
  trend_strength NUMERIC, -- 0-1 scale
  trend_data JSONB NOT NULL DEFAULT '{}',
  detection_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  trend_period TEXT, -- 'short', 'medium', 'long'
  confidence_score NUMERIC,
  market_impact TEXT
);

CREATE TABLE public.product_benchmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  benchmark_type TEXT NOT NULL, -- 'sales', 'views', 'conversion', 'rating'
  our_metric NUMERIC NOT NULL,
  market_average NUMERIC NOT NULL,
  top_performer NUMERIC NOT NULL,
  percentile_rank NUMERIC,
  benchmark_date DATE DEFAULT CURRENT_DATE,
  category_comparison JSONB DEFAULT '{}',
  improvement_potential NUMERIC
);

CREATE TABLE public.category_growth_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  growth_rate NUMERIC NOT NULL,
  growth_period TEXT NOT NULL, -- 'monthly', 'quarterly', 'yearly'
  market_size NUMERIC,
  growth_drivers JSONB DEFAULT '[]',
  growth_barriers JSONB DEFAULT '[]',
  opportunity_score NUMERIC,
  competitive_intensity NUMERIC,
  analysis_date DATE DEFAULT CURRENT_DATE
);

-- Advanced Customer Intelligence Tables
CREATE TABLE public.customer_lifetime_value_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  predicted_clv NUMERIC NOT NULL,
  confidence_interval JSONB NOT NULL DEFAULT '{}',
  clv_factors JSONB DEFAULT '{}', -- purchase_frequency, avg_order_value, etc.
  prediction_horizon INTEGER NOT NULL, -- months
  segment_classification TEXT,
  risk_factors JSONB DEFAULT '[]',
  opportunity_factors JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.churn_predictions_detailed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  churn_probability NUMERIC NOT NULL,
  churn_risk_level TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  risk_factors JSONB DEFAULT '{}',
  intervention_recommendations JSONB DEFAULT '[]',
  intervention_impact JSONB DEFAULT '{}',
  next_predicted_purchase DATE,
  retention_strategies JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  prediction_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE public.personalized_pricing_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  base_price NUMERIC NOT NULL,
  personalized_price NUMERIC NOT NULL,
  discount_percentage NUMERIC,
  pricing_strategy TEXT NOT NULL, -- 'loyalty', 'retention', 'acquisition'
  customer_segment TEXT,
  price_sensitivity NUMERIC,
  purchase_probability NUMERIC,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.recommendation_engine_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  recommendation_type TEXT NOT NULL, -- 'cross_sell', 'upsell', 'similar', 'trending'
  recommended_products JSONB NOT NULL DEFAULT '[]',
  recommendation_score NUMERIC NOT NULL,
  reasoning JSONB DEFAULT '{}',
  conversion_probability NUMERIC,
  expected_revenue NUMERIC,
  campaign_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Executive Business Intelligence Tables
CREATE TABLE public.executive_kpi_dashboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_category TEXT NOT NULL, -- 'revenue', 'growth', 'efficiency', 'market'
  metric_name TEXT NOT NULL,
  current_value NUMERIC NOT NULL,
  target_value NUMERIC,
  previous_period_value NUMERIC,
  trend_direction TEXT, -- 'up', 'down', 'stable'
  trend_percentage NUMERIC,
  benchmark_value NUMERIC,
  performance_status TEXT, -- 'excellent', 'good', 'warning', 'critical'
  time_period TEXT NOT NULL,
  recorded_date DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.strategic_planning_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_category TEXT NOT NULL, -- 'market_opportunity', 'competitive_threat', 'growth_driver'
  insight_title TEXT NOT NULL,
  insight_description TEXT NOT NULL,
  strategic_priority TEXT, -- 'high', 'medium', 'low'
  business_impact NUMERIC, -- 1-10 scale
  implementation_complexity NUMERIC, -- 1-10 scale
  resource_requirements JSONB DEFAULT '{}',
  timeline_estimate TEXT,
  success_metrics JSONB DEFAULT '[]',
  risk_factors JSONB DEFAULT '[]',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'identified' -- 'identified', 'planned', 'in_progress', 'completed'
);

CREATE TABLE public.market_share_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id),
  vendor_id UUID REFERENCES public.vendors(id),
  our_market_share NUMERIC NOT NULL,
  total_market_size NUMERIC NOT NULL,
  competitor_shares JSONB DEFAULT '{}',
  share_trend JSONB DEFAULT '[]', -- historical data
  market_position INTEGER, -- rank
  share_growth_rate NUMERIC,
  market_growth_rate NUMERIC,
  analysis_period TEXT NOT NULL,
  analysis_date DATE DEFAULT CURRENT_DATE,
  growth_opportunities JSONB DEFAULT '[]'
);

CREATE TABLE public.growth_opportunity_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_name TEXT NOT NULL,
  opportunity_type TEXT NOT NULL, -- 'product', 'market', 'channel', 'geographic'
  category_id UUID REFERENCES public.categories(id),
  vendor_id UUID REFERENCES public.vendors(id),
  market_size NUMERIC,
  growth_potential NUMERIC NOT NULL, -- 1-10 scale
  competitive_intensity NUMERIC, -- 1-10 scale
  entry_barriers JSONB DEFAULT '[]',
  success_probability NUMERIC,
  investment_required NUMERIC,
  expected_roi NUMERIC,
  timeline_to_market TEXT,
  risk_assessment JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'identified'
);

-- Automated Reporting System Tables
CREATE TABLE public.custom_report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_description TEXT,
  report_type TEXT NOT NULL, -- 'sales', 'inventory', 'customer', 'financial', 'custom'
  report_configuration JSONB NOT NULL DEFAULT '{}', -- filters, columns, charts
  visualization_config JSONB DEFAULT '{}',
  data_sources JSONB NOT NULL DEFAULT '[]',
  created_by UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  is_public BOOLEAN DEFAULT FALSE,
  template_version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.scheduled_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_name TEXT NOT NULL,
  template_id UUID REFERENCES public.custom_report_templates(id),
  schedule_config JSONB NOT NULL DEFAULT '{}', -- frequency, time, days
  recipients JSONB NOT NULL DEFAULT '[]', -- email list
  report_format TEXT NOT NULL DEFAULT 'pdf', -- 'pdf', 'excel', 'csv', 'powerbi'
  is_active BOOLEAN DEFAULT TRUE,
  last_generated TIMESTAMP WITH TIME ZONE,
  next_generation TIMESTAMP WITH TIME ZONE,
  generation_status TEXT DEFAULT 'scheduled',
  error_log JSONB DEFAULT '[]',
  created_by UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.report_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduled_report_id UUID REFERENCES public.scheduled_reports(id),
  template_id UUID REFERENCES public.custom_report_templates(id),
  execution_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  execution_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  execution_end TIMESTAMP WITH TIME ZONE,
  report_data JSONB,
  file_path TEXT, -- path to generated file
  file_size INTEGER,
  generation_time_ms INTEGER,
  error_message TEXT,
  recipients_sent JSONB DEFAULT '[]',
  delivery_status JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.report_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  scheduled_report_id UUID REFERENCES public.scheduled_reports(id),
  subscription_type TEXT NOT NULL, -- 'email', 'dashboard', 'api'
  delivery_preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_delivered TIMESTAMP WITH TIME ZONE,
  delivery_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ai_sales_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_pricing_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_growth_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_lifetime_value_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churn_predictions_detailed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalized_pricing_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_engine_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_kpi_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_planning_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_share_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_opportunity_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- AI-Powered Analytics Policies
CREATE POLICY "Vendors can view their AI sales forecasts" ON public.ai_sales_forecasts 
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can view their demand predictions" ON public.demand_predictions 
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can view their price optimizations" ON public.price_optimizations 
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can view their inventory forecasts" ON public.inventory_forecasts 
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

-- Market Intelligence Policies
CREATE POLICY "Public can view competitive pricing" ON public.competitive_pricing_analysis 
  FOR SELECT USING (true);

CREATE POLICY "Public can view market trends" ON public.market_trends 
  FOR SELECT USING (true);

CREATE POLICY "Vendors can view product benchmarks" ON public.product_benchmarks 
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Public can view category growth insights" ON public.category_growth_insights 
  FOR SELECT USING (true);

-- Customer Intelligence Policies
CREATE POLICY "Vendors can view customer CLV predictions" ON public.customer_lifetime_value_predictions 
  FOR SELECT USING (vendor_id = auth.uid() OR vendor_id IS NULL OR is_admin_user());

CREATE POLICY "Vendors can view churn predictions" ON public.churn_predictions_detailed 
  FOR SELECT USING (vendor_id = auth.uid() OR vendor_id IS NULL OR is_admin_user());

CREATE POLICY "Vendors can view personalized pricing" ON public.personalized_pricing_strategies 
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can view recommendations" ON public.recommendation_engine_data 
  FOR SELECT USING (vendor_id = auth.uid() OR vendor_id IS NULL OR is_admin_user());

-- Executive BI Policies
CREATE POLICY "Admin can manage executive KPIs" ON public.executive_kpi_dashboard 
  FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage strategic insights" ON public.strategic_planning_insights 
  FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can view market share analysis" ON public.market_share_analysis 
  FOR SELECT USING (vendor_id = auth.uid() OR vendor_id IS NULL OR is_admin_user());

CREATE POLICY "Admin can manage growth opportunities" ON public.growth_opportunity_mapping 
  FOR ALL USING (is_admin_user());

-- Reporting System Policies
CREATE POLICY "Users can manage their report templates" ON public.custom_report_templates 
  FOR ALL USING (created_by = auth.uid() OR is_admin_user());

CREATE POLICY "Users can view public templates" ON public.custom_report_templates 
  FOR SELECT USING (is_public = true OR created_by = auth.uid() OR is_admin_user());

CREATE POLICY "Users can manage their scheduled reports" ON public.scheduled_reports 
  FOR ALL USING (created_by = auth.uid() OR is_admin_user());

CREATE POLICY "Users can view their report executions" ON public.report_executions 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.scheduled_reports sr 
    WHERE sr.id = scheduled_report_id AND (sr.created_by = auth.uid() OR is_admin_user())
  ));

CREATE POLICY "Users can manage their subscriptions" ON public.report_subscriptions 
  FOR ALL USING (user_id = auth.uid() OR is_admin_user());

-- Create indexes for performance
CREATE INDEX idx_ai_sales_forecasts_vendor_date ON public.ai_sales_forecasts(vendor_id, forecast_date);
CREATE INDEX idx_demand_predictions_product_date ON public.demand_predictions(product_id, prediction_date);
CREATE INDEX idx_price_optimizations_product_date ON public.price_optimizations(product_id, created_at);
CREATE INDEX idx_inventory_forecasts_product_date ON public.inventory_forecasts(product_id, forecast_date);
CREATE INDEX idx_competitive_pricing_product ON public.competitive_pricing_analysis(product_id);
CREATE INDEX idx_market_trends_category_date ON public.market_trends(category_id, detection_date);
CREATE INDEX idx_product_benchmarks_vendor_date ON public.product_benchmarks(vendor_id, benchmark_date);
CREATE INDEX idx_clv_predictions_customer ON public.customer_lifetime_value_predictions(customer_id);
CREATE INDEX idx_churn_predictions_customer ON public.churn_predictions_detailed(customer_id);
CREATE INDEX idx_personalized_pricing_customer ON public.personalized_pricing_strategies(customer_id);
CREATE INDEX idx_recommendations_customer ON public.recommendation_engine_data(customer_id);
CREATE INDEX idx_executive_kpi_date ON public.executive_kpi_dashboard(recorded_date);
CREATE INDEX idx_market_share_vendor_date ON public.market_share_analysis(vendor_id, analysis_date);
CREATE INDEX idx_scheduled_reports_next_gen ON public.scheduled_reports(next_generation) WHERE is_active = true;
CREATE INDEX idx_report_executions_status ON public.report_executions(execution_status);

-- Add triggers for updated_at
CREATE TRIGGER update_ai_sales_forecasts_updated_at 
  BEFORE UPDATE ON public.ai_sales_forecasts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_report_templates_updated_at 
  BEFORE UPDATE ON public.custom_report_templates 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_reports_updated_at 
  BEFORE UPDATE ON public.scheduled_reports 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_subscriptions_updated_at 
  BEFORE UPDATE ON public.report_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();