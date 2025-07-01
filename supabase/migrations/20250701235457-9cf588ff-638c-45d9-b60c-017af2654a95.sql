-- Enable RLS and add policies for Phase 3 tables

-- Enable RLS on all new tables
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_gateway_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function for admin check
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- API Gateway tables - admin only
CREATE POLICY "Admin can manage api_rate_limits" ON public.api_rate_limits
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin can manage api_gateway_logs" ON public.api_gateway_logs
  FOR ALL USING (public.is_admin_user());

-- Cache tables - admin only
CREATE POLICY "Admin can manage cache_entries" ON public.cache_entries
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin can manage cache_statistics" ON public.cache_statistics
  FOR ALL USING (public.is_admin_user());

-- File uploads - users can manage their own files, admins can manage all
CREATE POLICY "Users can manage their own files" ON public.file_uploads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all files" ON public.file_uploads
  FOR ALL USING (public.is_admin_user());

-- System monitoring - admin only
CREATE POLICY "Admin can manage system_logs" ON public.system_logs
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin can manage system_metrics" ON public.system_metrics
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin can manage health_checks" ON public.health_checks
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin can manage system_alerts" ON public.system_alerts
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin can manage error_tracking" ON public.error_tracking
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin can manage performance_tracking" ON public.performance_tracking
  FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admin can manage audit_logs" ON public.audit_logs
  FOR ALL USING (public.is_admin_user());

-- Allow public insert for some monitoring tables (needed for edge functions)
CREATE POLICY "Public can insert system_logs" ON public.system_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert system_metrics" ON public.system_metrics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert error_tracking" ON public.error_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert performance_tracking" ON public.performance_tracking
  FOR INSERT WITH CHECK (true);

-- Clean up expired cache entries (trigger)
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.cache_entries 
  WHERE expires_at IS NOT NULL 
    AND expires_at < now();
  RETURN NULL;
END;
$$;

CREATE TRIGGER cleanup_expired_cache_trigger
  AFTER INSERT ON public.cache_entries
  EXECUTE FUNCTION public.cleanup_expired_cache();