
-- Create comprehensive dashboard-related tables with proper schemas

-- Dashboard metrics table for storing various KPI data
CREATE TABLE public.dashboard_kpi_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_category TEXT NOT NULL CHECK (metric_category IN ('revenue', 'users', 'orders', 'performance', 'security', 'inventory')),
  metric_value NUMERIC(15,2) NOT NULL,
  metric_unit TEXT DEFAULT NULL,
  comparison_value NUMERIC(15,2) DEFAULT NULL,
  percentage_change NUMERIC(5,2) DEFAULT NULL,
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable')) DEFAULT 'stable',
  time_period TEXT NOT NULL CHECK (time_period IN ('hourly', 'daily', 'weekly', 'monthly', 'yearly')),
  recorded_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System health monitoring table
CREATE TABLE public.system_health_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('database', 'api', 'cache', 'search', 'payment', 'notification')),
  health_status TEXT NOT NULL CHECK (health_status IN ('healthy', 'warning', 'critical', 'down')) DEFAULT 'healthy',
  response_time_ms INTEGER DEFAULT NULL,
  error_count INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2) DEFAULT 100.00,
  cpu_usage NUMERIC(5,2) DEFAULT NULL,
  memory_usage NUMERIC(5,2) DEFAULT NULL,
  disk_usage NUMERIC(5,2) DEFAULT NULL,
  uptime_seconds INTEGER DEFAULT NULL,
  last_check TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  error_details JSONB DEFAULT '{}',
  alerts_triggered JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security monitoring events table
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('login_attempt', 'failed_login', 'suspicious_activity', 'data_breach_attempt', 'unauthorized_access', 'password_reset')),
  severity_level TEXT NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  user_id UUID REFERENCES profiles(id),
  ip_address INET NOT NULL,
  user_agent TEXT,
  location_data JSONB DEFAULT '{}',
  event_details JSONB NOT NULL DEFAULT '{}',
  is_blocked BOOLEAN DEFAULT false,
  resolution_status TEXT CHECK (resolution_status IN ('open', 'investigating', 'resolved', 'false_positive')) DEFAULT 'open',
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time analytics data table
CREATE TABLE public.realtime_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('page_views', 'active_users', 'transactions', 'api_calls', 'errors', 'conversions')),
  metric_value NUMERIC(15,2) NOT NULL,
  dimensions JSONB DEFAULT '{}',
  timestamp_recorded TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  user_id UUID,
  page_url TEXT,
  referrer TEXT,
  device_info JSONB DEFAULT '{}',
  geographic_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Executive summary reports table
CREATE TABLE public.executive_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_title TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom')),
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  key_metrics JSONB NOT NULL DEFAULT '{}',
  executive_summary TEXT NOT NULL,
  recommendations JSONB DEFAULT '[]',
  charts_data JSONB DEFAULT '{}',
  status TEXT CHECK (status IN ('draft', 'review', 'approved', 'published')) DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quick actions tracking table
CREATE TABLE public.quick_actions_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL CHECK (action_type IN ('bulk_update', 'data_export', 'system_maintenance', 'user_management', 'order_processing', 'inventory_sync')),
  action_name TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  execution_status TEXT CHECK (execution_status IN ('pending', 'running', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  result_data JSONB DEFAULT '{}',
  error_message TEXT,
  execution_time_ms INTEGER,
  executed_by UUID NOT NULL REFERENCES profiles(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance monitoring table
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_category TEXT NOT NULL CHECK (metric_category IN ('api_performance', 'database_performance', 'frontend_performance', 'search_performance', 'cache_performance')),
  endpoint_path TEXT,
  method_type TEXT CHECK (method_type IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER,
  error_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  throughput_per_second NUMERIC(10,2),
  memory_usage_mb NUMERIC(10,2),
  cpu_usage_percent NUMERIC(5,2),
  cache_hit_rate NUMERIC(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dashboard_kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin users can manage dashboard KPI metrics" ON public.dashboard_kpi_metrics FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Admin users can manage system health logs" ON public.system_health_logs FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Admin users can manage security events" ON public.security_events FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Admin users can manage realtime analytics" ON public.realtime_analytics FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Admin users can manage executive reports" ON public.executive_reports FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Admin users can manage quick actions log" ON public.quick_actions_log FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

CREATE POLICY "Admin users can manage performance metrics" ON public.performance_metrics FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

-- Create indexes for better performance
CREATE INDEX idx_dashboard_kpi_metrics_category ON public.dashboard_kpi_metrics(metric_category);
CREATE INDEX idx_dashboard_kpi_metrics_date ON public.dashboard_kpi_metrics(recorded_date);
CREATE INDEX idx_system_health_logs_service ON public.system_health_logs(service_name, service_type);
CREATE INDEX idx_system_health_logs_status ON public.system_health_logs(health_status);
CREATE INDEX idx_security_events_type ON public.security_events(event_type);
CREATE INDEX idx_security_events_severity ON public.security_events(severity_level);
CREATE INDEX idx_security_events_user ON public.security_events(user_id);
CREATE INDEX idx_realtime_analytics_type ON public.realtime_analytics(metric_type);
CREATE INDEX idx_realtime_analytics_timestamp ON public.realtime_analytics(timestamp_recorded);
CREATE INDEX idx_executive_reports_type ON public.executive_reports(report_type);
CREATE INDEX idx_executive_reports_period ON public.executive_reports(report_period_start, report_period_end);
CREATE INDEX idx_quick_actions_log_type ON public.quick_actions_log(action_type);
CREATE INDEX idx_quick_actions_log_status ON public.quick_actions_log(execution_status);
CREATE INDEX idx_performance_metrics_category ON public.performance_metrics(metric_category);
CREATE INDEX idx_performance_metrics_endpoint ON public.performance_metrics(endpoint_path);

-- Add triggers for updated_at
CREATE TRIGGER update_dashboard_kpi_metrics_updated_at
  BEFORE UPDATE ON public.dashboard_kpi_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_executive_reports_updated_at
  BEFORE UPDATE ON public.executive_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.dashboard_kpi_metrics (metric_name, metric_category, metric_value, metric_unit, time_period) VALUES
('Total Revenue', 'revenue', 156789.50, 'BDT', 'monthly'),
('Active Users', 'users', 12847, 'count', 'daily'),
('Orders Completed', 'orders', 2456, 'count', 'daily'),
('API Response Time', 'performance', 245.5, 'ms', 'hourly'),
('Security Alerts', 'security', 3, 'count', 'daily'),
('Low Stock Items', 'inventory', 45, 'count', 'daily');

INSERT INTO public.system_health_logs (service_name, service_type, health_status, response_time_ms, success_rate) VALUES
('Main Database', 'database', 'healthy', 12, 99.8),
('API Gateway', 'api', 'healthy', 45, 99.9),
('Redis Cache', 'cache', 'warning', 78, 98.5),
('Elasticsearch', 'search', 'healthy', 23, 99.7),
('Payment Gateway', 'payment', 'healthy', 156, 99.6),
('Email Service', 'notification', 'healthy', 234, 99.4);
