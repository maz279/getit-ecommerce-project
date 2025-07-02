-- Phase 1: Enhanced Database Performance Optimization (Part 1)
-- Create tables and functions first

-- Enhanced rate limiting table
CREATE TABLE IF NOT EXISTS public.enhanced_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_type TEXT NOT NULL,
  key_value TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  requests_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  window_size_ms INTEGER NOT NULL DEFAULT 60000,
  max_requests INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(key_type, key_value, endpoint, window_start)
);

-- Connection pooling optimization table
CREATE TABLE IF NOT EXISTS public.db_connection_pool_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_name TEXT NOT NULL,
  active_connections INTEGER NOT NULL DEFAULT 0,
  idle_connections INTEGER NOT NULL DEFAULT 0,
  max_connections INTEGER NOT NULL DEFAULT 20,
  total_requests BIGINT NOT NULL DEFAULT 0,
  avg_response_time_ms NUMERIC(10,2) NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Query performance monitoring
CREATE TABLE IF NOT EXISTS public.query_performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT NOT NULL,
  query_type TEXT NOT NULL,
  execution_time_ms NUMERIC(10,2) NOT NULL,
  rows_affected INTEGER,
  cache_hit BOOLEAN DEFAULT false,
  user_id UUID,
  endpoint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_enhanced_rate_limits_lookup ON public.enhanced_rate_limits(key_type, key_value, endpoint, window_start);
CREATE INDEX IF NOT EXISTS idx_enhanced_rate_limits_cleanup ON public.enhanced_rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_query_performance_hash ON public.query_performance_logs(query_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_query_performance_time ON public.query_performance_logs(execution_time_ms DESC, created_at DESC);

-- Enable RLS on new tables
ALTER TABLE public.enhanced_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.db_connection_pool_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_performance_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Admin can manage enhanced_rate_limits" 
ON public.enhanced_rate_limits 
FOR ALL 
USING (is_admin_user());

CREATE POLICY "Admin can manage db_connection_pool_stats" 
ON public.db_connection_pool_stats 
FOR ALL 
USING (is_admin_user());

CREATE POLICY "Admin can manage query_performance_logs" 
ON public.query_performance_logs 
FOR ALL 
USING (is_admin_user());

-- Performance monitoring functions
CREATE OR REPLACE FUNCTION public.log_query_performance(
  p_query_hash TEXT,
  p_query_type TEXT,
  p_execution_time_ms NUMERIC,
  p_rows_affected INTEGER DEFAULT NULL,
  p_cache_hit BOOLEAN DEFAULT false,
  p_user_id UUID DEFAULT NULL,
  p_endpoint TEXT DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.query_performance_logs (
    query_hash, query_type, execution_time_ms, rows_affected,
    cache_hit, user_id, endpoint
  ) VALUES (
    p_query_hash, p_query_type, p_execution_time_ms, p_rows_affected,
    p_cache_hit, p_user_id, p_endpoint
  );
END;
$$;

-- Rate limiting function
CREATE OR REPLACE FUNCTION public.check_enhanced_rate_limit(
  p_key_type TEXT,
  p_key_value TEXT,
  p_endpoint TEXT,
  p_max_requests INTEGER DEFAULT 100,
  p_window_size_ms INTEGER DEFAULT 60000
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_current_count INTEGER;
  v_allowed BOOLEAN := true;
BEGIN
  -- Calculate window start
  v_window_start := date_trunc('minute', now()) + 
    INTERVAL '1 minute' * FLOOR(EXTRACT(EPOCH FROM (now() - date_trunc('minute', now()))) / (p_window_size_ms / 1000.0));
  
  -- Clean old windows
  DELETE FROM public.enhanced_rate_limits 
  WHERE window_start < (now() - INTERVAL '1 hour');
  
  -- Get or create current window record
  INSERT INTO public.enhanced_rate_limits (
    key_type, key_value, endpoint, window_start, 
    window_size_ms, max_requests, requests_count
  ) VALUES (
    p_key_type, p_key_value, p_endpoint, v_window_start,
    p_window_size_ms, p_max_requests, 1
  )
  ON CONFLICT (key_type, key_value, endpoint, window_start)
  DO UPDATE SET 
    requests_count = enhanced_rate_limits.requests_count + 1
  RETURNING requests_count INTO v_current_count;
  
  -- Check if limit exceeded
  v_allowed := v_current_count <= p_max_requests;
  
  RETURN jsonb_build_object(
    'allowed', v_allowed,
    'current_count', v_current_count,
    'max_requests', p_max_requests,
    'window_start', v_window_start,
    'reset_time', v_window_start + INTERVAL '1 millisecond' * p_window_size_ms
  );
END;
$$;

-- Database health check function
CREATE OR REPLACE FUNCTION public.database_health_check()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_connections INTEGER;
  v_active_connections INTEGER;
  v_slow_queries INTEGER;
  v_cache_hit_ratio NUMERIC;
  v_avg_query_time NUMERIC;
BEGIN
  -- Get connection stats
  SELECT COUNT(*) INTO v_total_connections FROM pg_stat_activity;
  SELECT COUNT(*) INTO v_active_connections FROM pg_stat_activity WHERE state = 'active';
  
  -- Get slow queries count (last hour)
  SELECT COALESCE(COUNT(*), 0) INTO v_slow_queries 
  FROM public.query_performance_logs 
  WHERE execution_time_ms > 1000 
    AND created_at > now() - INTERVAL '1 hour';
  
  -- Calculate cache hit ratio
  SELECT COALESCE(AVG(CASE WHEN cache_hit THEN 1.0 ELSE 0.0 END), 0) INTO v_cache_hit_ratio
  FROM public.query_performance_logs 
  WHERE created_at > now() - INTERVAL '1 hour';
  
  -- Average query time
  SELECT COALESCE(AVG(execution_time_ms), 0) INTO v_avg_query_time
  FROM public.query_performance_logs 
  WHERE created_at > now() - INTERVAL '1 hour';
  
  RETURN jsonb_build_object(
    'status', 'healthy',
    'total_connections', v_total_connections,
    'active_connections', v_active_connections,
    'slow_queries_last_hour', v_slow_queries,
    'cache_hit_ratio', v_cache_hit_ratio,
    'avg_query_time_ms', v_avg_query_time,
    'timestamp', now()
  );
END;
$$;