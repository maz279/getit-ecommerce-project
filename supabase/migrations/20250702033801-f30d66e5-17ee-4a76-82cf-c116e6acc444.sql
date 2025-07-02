-- Create comprehensive metrics tracking tables
CREATE TABLE public.success_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_category TEXT NOT NULL, -- 'phase1', 'phase2', 'phase3'
  metric_value NUMERIC NOT NULL,
  target_value NUMERIC NOT NULL,
  metric_unit TEXT NOT NULL, -- 'percentage', 'count', 'score'
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor_id UUID,
  user_id UUID,
  additional_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user engagement tracking
CREATE TABLE public.user_engagement_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  page_type TEXT NOT NULL, -- 'vendor_dashboard', 'analytics_dashboard', etc.
  action_type TEXT NOT NULL, -- 'page_view', 'click', 'conversion', etc.
  engagement_duration INTEGER, -- in seconds
  feature_used TEXT,
  conversion_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real-time feature usage tracking
CREATE TABLE public.realtime_feature_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  feature_name TEXT NOT NULL, -- 'live_chat', 'order_tracking', 'inventory_updates'
  usage_duration INTEGER, -- in seconds
  interaction_count INTEGER DEFAULT 1,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mobile performance tracking
CREATE TABLE public.mobile_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  device_type TEXT NOT NULL, -- 'mobile', 'tablet', 'desktop'
  page_load_time NUMERIC, -- in milliseconds
  performance_score NUMERIC, -- 0-100
  network_type TEXT, -- '4g', '3g', 'wifi'
  user_agent TEXT,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversion tracking
CREATE TABLE public.conversion_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT NOT NULL,
  conversion_type TEXT NOT NULL, -- 'search_to_purchase', 'mobile_checkout', 'pwa_install'
  source_page TEXT,
  target_action TEXT,
  conversion_value NUMERIC,
  search_query TEXT,
  products_viewed JSONB DEFAULT '[]',
  time_to_conversion INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.success_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin can manage success metrics" ON public.success_metrics FOR ALL USING (is_admin_user());

CREATE POLICY "Users can view their engagement metrics" ON public.user_engagement_metrics 
FOR SELECT USING (user_id = auth.uid() OR is_admin_user());

CREATE POLICY "Users can insert their engagement metrics" ON public.user_engagement_metrics 
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their realtime usage" ON public.realtime_feature_usage 
FOR SELECT USING (user_id = auth.uid() OR is_admin_user());

CREATE POLICY "Users can track their realtime usage" ON public.realtime_feature_usage 
FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can view mobile performance data" ON public.mobile_performance_metrics 
FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL OR is_admin_user());

CREATE POLICY "Public can insert mobile performance data" ON public.mobile_performance_metrics 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their conversion data" ON public.conversion_tracking 
FOR SELECT USING (user_id = auth.uid() OR is_admin_user());

CREATE POLICY "Users can track conversions" ON public.conversion_tracking 
FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Performance indexes
CREATE INDEX idx_success_metrics_category_date ON public.success_metrics(metric_category, measurement_date);
CREATE INDEX idx_user_engagement_user_date ON public.user_engagement_metrics(user_id, created_at);
CREATE INDEX idx_realtime_usage_feature_date ON public.realtime_feature_usage(feature_name, created_at);
CREATE INDEX idx_mobile_performance_device_date ON public.mobile_performance_metrics(device_type, created_at);
CREATE INDEX idx_conversion_tracking_type_date ON public.conversion_tracking(conversion_type, created_at);