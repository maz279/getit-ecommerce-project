
-- Create system health logs table
CREATE TABLE IF NOT EXISTS public.system_health_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('database', 'api', 'cache', 'search', 'payment', 'notification')),
  health_status TEXT NOT NULL CHECK (health_status IN ('healthy', 'warning', 'critical', 'down')),
  response_time_ms INTEGER,
  cpu_usage NUMERIC(5,2),
  memory_usage_mb NUMERIC(10,2),
  disk_usage NUMERIC(5,2),
  uptime_seconds BIGINT,
  error_count INTEGER DEFAULT 0,
  last_check TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  error_details JSONB DEFAULT '{}',
  alerts_triggered JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create security events table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('login_attempt', 'failed_login', 'suspicious_activity', 'data_breach_attempt', 'unauthorized_access', 'password_reset')),
  severity_level TEXT NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  location_data JSONB DEFAULT '{}',
  event_details JSONB NOT NULL DEFAULT '{}',
  is_blocked BOOLEAN DEFAULT false,
  resolution_status TEXT DEFAULT 'open' CHECK (resolution_status IN ('open', 'investigating', 'resolved', 'false_positive')),
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor commission rates table
CREATE TABLE IF NOT EXISTS public.vendor_commission_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  product_type TEXT,
  base_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  rate_type TEXT NOT NULL DEFAULT 'percentage' CHECK (rate_type IN ('percentage', 'fixed')),
  minimum_amount NUMERIC(10,2),
  maximum_amount NUMERIC(10,2),
  platform_fee_rate NUMERIC(5,2) DEFAULT 2.5,
  is_active BOOLEAN DEFAULT true,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor commissions table
CREATE TABLE IF NOT EXISTS public.vendor_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  product_id UUID REFERENCES public.products(id),
  gross_amount NUMERIC(12,2) NOT NULL,
  commission_rate NUMERIC(5,2) NOT NULL,
  commission_amount NUMERIC(12,2) NOT NULL,
  platform_fee NUMERIC(12,2) DEFAULT 0,
  net_commission NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'BDT',
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'disputed')),
  payout_batch_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  trade_license TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  commission_rate NUMERIC(5,2) DEFAULT 10.00,
  rating NUMERIC(3,2) DEFAULT 0.00,
  total_sales NUMERIC(12,2) DEFAULT 0.00,
  phone TEXT,
  email TEXT,
  address JSONB,
  bank_details JSONB,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor ratings table
CREATE TABLE IF NOT EXISTS public.vendor_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE UNIQUE,
  overall_rating NUMERIC(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  service_quality NUMERIC(3,2) DEFAULT 0.00,
  delivery_speed NUMERIC(3,2) DEFAULT 0.00,
  communication NUMERIC(3,2) DEFAULT 0.00,
  product_quality NUMERIC(3,2) DEFAULT 0.00,
  rating_breakdown JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create review moderation table
CREATE TABLE IF NOT EXISTS public.review_moderation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  customer_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  risk_score NUMERIC(5,2) DEFAULT 0.00,
  flags JSONB DEFAULT '[]',
  priority_level TEXT DEFAULT 'low' CHECK (priority_level IN ('low', 'medium', 'high')),
  moderator_id UUID REFERENCES auth.users(id),
  moderation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order analytics table
CREATE TABLE IF NOT EXISTS public.order_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analytics_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_orders INTEGER DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0.00,
  average_order_value NUMERIC(10,2) DEFAULT 0.00,
  successful_orders INTEGER DEFAULT 0,
  failed_orders INTEGER DEFAULT 0,
  pending_orders INTEGER DEFAULT 0,
  cancelled_orders INTEGER DEFAULT 0,
  order_categories JSONB DEFAULT '{}',
  payment_methods JSONB DEFAULT '{}',
  geographic_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform metrics table
CREATE TABLE IF NOT EXISTS public.platform_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  uptime_percentage NUMERIC(5,2) DEFAULT 99.9,
  average_response_time INTEGER DEFAULT 250,
  server_load_percentage NUMERIC(5,2) DEFAULT 0.00,
  active_users INTEGER DEFAULT 0,
  api_calls_count BIGINT DEFAULT 0,
  error_rate NUMERIC(5,2) DEFAULT 0.00,
  cdn_cache_hit_rate NUMERIC(5,2) DEFAULT 0.00,
  database_performance JSONB DEFAULT '{}',
  security_incidents INTEGER DEFAULT 0,
  backup_status TEXT DEFAULT 'success',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_commission_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin full access to system_health_logs" ON public.system_health_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin full access to security_events" ON public.security_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin full access to vendor_commission_rates" ON public.vendor_commission_rates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin and vendor access to vendor_commissions" ON public.vendor_commissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
    OR 
    vendor_id IN (
      SELECT id FROM public.vendors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin full access to vendors" ON public.vendors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Vendor can update own record" ON public.vendors
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin full access to vendor_ratings" ON public.vendor_ratings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin full access to review_moderation" ON public.review_moderation
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin full access to order_analytics" ON public.order_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin full access to platform_metrics" ON public.platform_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_health_logs_service_type ON public.system_health_logs(service_type);
CREATE INDEX IF NOT EXISTS idx_system_health_logs_health_status ON public.system_health_logs(health_status);
CREATE INDEX IF NOT EXISTS idx_system_health_logs_created_at ON public.system_health_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity_level);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vendor_commissions_vendor_id ON public.vendor_commissions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_status ON public.vendor_commissions(status);
CREATE INDEX IF NOT EXISTS idx_vendor_commissions_transaction_date ON public.vendor_commissions(transaction_date);

CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON public.vendors(user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vendor_commission_rates_updated_at BEFORE UPDATE ON public.vendor_commission_rates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_commissions_updated_at BEFORE UPDATE ON public.vendor_commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_ratings_updated_at BEFORE UPDATE ON public.vendor_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_moderation_updated_at BEFORE UPDATE ON public.review_moderation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_analytics_updated_at BEFORE UPDATE ON public.order_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
