-- Advanced Analytics Dashboard Database Schema

-- Market insights table
CREATE TABLE IF NOT EXISTS public.market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable')),
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  category_id UUID,
  vendor_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'
);

-- Sales forecasting table
CREATE TABLE IF NOT EXISTS public.sales_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID,
  product_id UUID,
  category_id UUID,
  forecast_type TEXT NOT NULL CHECK (forecast_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  forecast_period_start DATE NOT NULL,
  forecast_period_end DATE NOT NULL,
  predicted_sales NUMERIC(15,2) NOT NULL,
  predicted_units INTEGER,
  confidence_interval JSONB DEFAULT '{}',
  algorithm_used TEXT DEFAULT 'linear_regression',
  model_accuracy NUMERIC(5,2),
  factors_considered JSONB DEFAULT '{}',
  seasonal_adjustments JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Performance monitoring metrics
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_category TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  target_value NUMERIC,
  threshold_warning NUMERIC,
  threshold_critical NUMERIC,
  status TEXT CHECK (status IN ('healthy', 'warning', 'critical')) DEFAULT 'healthy',
  vendor_id UUID,
  product_id UUID,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Custom reports table
CREATE TABLE IF NOT EXISTS public.custom_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_name TEXT NOT NULL,
  report_description TEXT,
  report_type TEXT NOT NULL,
  report_config JSONB NOT NULL DEFAULT '{}',
  data_sources JSONB NOT NULL DEFAULT '[]',
  filters JSONB DEFAULT '{}',
  columns JSONB NOT NULL DEFAULT '[]',
  chart_config JSONB DEFAULT '{}',
  schedule_config JSONB DEFAULT '{}',
  is_scheduled BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  shared_with JSONB DEFAULT '[]',
  last_generated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Report executions log
CREATE TABLE IF NOT EXISTS public.report_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.custom_reports(id) ON DELETE CASCADE,
  execution_type TEXT CHECK (execution_type IN ('manual', 'scheduled')) DEFAULT 'manual',
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  execution_time_ms INTEGER,
  result_data JSONB,
  error_message TEXT,
  file_path TEXT,
  export_format TEXT,
  executed_by UUID,
  row_count INTEGER,
  file_size_bytes INTEGER
);

-- Business intelligence insights
CREATE TABLE IF NOT EXISTS public.bi_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_category TEXT NOT NULL,
  insight_title TEXT NOT NULL,
  insight_description TEXT,
  insight_type TEXT CHECK (insight_type IN ('trend', 'anomaly', 'opportunity', 'risk', 'recommendation')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  data_points JSONB NOT NULL DEFAULT '{}',
  visualization_config JSONB DEFAULT '{}',
  action_items JSONB DEFAULT '[]',
  affected_metrics JSONB DEFAULT '[]',
  confidence_score NUMERIC(3,2),
  impact_score NUMERIC(3,2),
  vendor_id UUID,
  category_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- Advanced customer segments
CREATE TABLE IF NOT EXISTS public.advanced_customer_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_name TEXT NOT NULL,
  segment_description TEXT,
  criteria JSONB NOT NULL DEFAULT '{}',
  customer_count INTEGER DEFAULT 0,
  avg_order_value NUMERIC(10,2),
  total_revenue NUMERIC(15,2),
  churn_rate NUMERIC(5,2),
  lifetime_value NUMERIC(10,2),
  engagement_score NUMERIC(5,2),
  profitability_score NUMERIC(5,2),
  growth_rate NUMERIC(5,2),
  segment_trends JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_calculated TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bi_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_customer_segments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin and vendors can view market insights" ON public.market_insights
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Admin and vendors can view sales forecasts" ON public.sales_forecasts
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Admin and vendors can view performance metrics" ON public.performance_metrics
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Users can manage their own reports" ON public.custom_reports
  FOR ALL USING (created_by = auth.uid() OR is_admin_user());

CREATE POLICY "Users can view report executions for their reports" ON public.report_executions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.custom_reports cr 
      WHERE cr.id = report_executions.report_id 
      AND (cr.created_by = auth.uid() OR is_admin_user())
    )
  );

CREATE POLICY "Admin and vendors can view BI insights" ON public.bi_insights
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Admin can manage customer segments" ON public.advanced_customer_segments
  FOR ALL USING (is_admin_user());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_insights_type_active ON public.market_insights(insight_type, is_active);
CREATE INDEX IF NOT EXISTS idx_sales_forecasts_vendor_period ON public.sales_forecasts(vendor_id, forecast_period_start, forecast_period_end);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_category_recorded ON public.performance_metrics(metric_category, recorded_at);
CREATE INDEX IF NOT EXISTS idx_custom_reports_created_by ON public.custom_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_report_executions_report_status ON public.report_executions(report_id, status);
CREATE INDEX IF NOT EXISTS idx_bi_insights_priority_active ON public.bi_insights(priority, is_active);
CREATE INDEX IF NOT EXISTS idx_customer_segments_updated ON public.advanced_customer_segments(updated_at);

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.update_analytics_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_market_insights_updated_at
  BEFORE UPDATE ON public.market_insights
  FOR EACH ROW EXECUTE FUNCTION public.update_analytics_timestamps();

CREATE TRIGGER update_sales_forecasts_updated_at
  BEFORE UPDATE ON public.sales_forecasts
  FOR EACH ROW EXECUTE FUNCTION public.update_analytics_timestamps();

CREATE TRIGGER update_custom_reports_updated_at
  BEFORE UPDATE ON public.custom_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_analytics_timestamps();

CREATE TRIGGER update_bi_insights_updated_at
  BEFORE UPDATE ON public.bi_insights
  FOR EACH ROW EXECUTE FUNCTION public.update_analytics_timestamps();

CREATE TRIGGER update_customer_segments_updated_at
  BEFORE UPDATE ON public.advanced_customer_segments
  FOR EACH ROW EXECUTE FUNCTION public.update_analytics_timestamps();