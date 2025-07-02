-- Phase 4: Advanced API Gateway Features & Phase 5: Bangladesh-Specific Enhancements (V2)

-- GraphQL Federation Gateway Tables
CREATE TABLE IF NOT EXISTS public.graphql_schemas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  schema_definition TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  federation_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.graphql_query_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_hash TEXT NOT NULL UNIQUE,
  query_text TEXT NOT NULL,
  cached_result JSONB NOT NULL,
  ttl_seconds INTEGER DEFAULT 300,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.graphql_federation_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  query_complexity INTEGER DEFAULT 0,
  execution_time_ms NUMERIC NOT NULL,
  cache_hit BOOLEAN DEFAULT false,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- gRPC Gateway Tables
CREATE TABLE IF NOT EXISTS public.grpc_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  proto_definition TEXT NOT NULL,
  health_check_config JSONB DEFAULT '{}',
  load_balancing_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.grpc_health_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.grpc_services(id),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'unhealthy', 'unknown')),
  response_time_ms NUMERIC NOT NULL,
  error_message TEXT,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.grpc_load_balancing_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.grpc_services(id),
  endpoint_url TEXT NOT NULL,
  request_count INTEGER DEFAULT 0,
  success_rate NUMERIC DEFAULT 0,
  avg_response_time_ms NUMERIC DEFAULT 0,
  current_load_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Edge Computing Integration Tables
CREATE TABLE IF NOT EXISTS public.edge_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_name TEXT NOT NULL,
  geographic_region TEXT NOT NULL,
  country_code TEXT NOT NULL,
  city TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  node_capacity JSONB DEFAULT '{}',
  current_load NUMERIC DEFAULT 0,
  health_status TEXT DEFAULT 'healthy',
  optimization_config JSONB DEFAULT '{}',
  rural_optimization_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.geographic_routing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  source_region TEXT NOT NULL,
  target_edge_node_id UUID REFERENCES public.edge_nodes(id),
  routing_criteria JSONB NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  bangladesh_specific BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_optimization_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL,
  content_type TEXT NOT NULL,
  original_size_bytes INTEGER NOT NULL,
  optimized_size_bytes INTEGER NOT NULL,
  compression_ratio NUMERIC NOT NULL,
  edge_node_id UUID REFERENCES public.edge_nodes(id),
  geographic_region TEXT NOT NULL,
  rural_optimized BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Mobile Money Integration Tables
CREATE TABLE IF NOT EXISTS public.mobile_money_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallet_provider TEXT NOT NULL,
  wallet_number TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_primary BOOLEAN DEFAULT false,
  daily_limit NUMERIC DEFAULT 25000,
  monthly_limit NUMERIC DEFAULT 200000,
  balance_cache NUMERIC DEFAULT 0,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cross_wallet_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_wallet_id UUID REFERENCES public.mobile_money_wallets(id),
  to_wallet_id UUID REFERENCES public.mobile_money_wallets(id),
  amount NUMERIC NOT NULL,
  transfer_fee NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transfer_type TEXT DEFAULT 'regular' CHECK (transfer_type IN ('regular', 'instant', 'scheduled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  gateway_transaction_id TEXT,
  gateway_response JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.installment_payment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  total_amount NUMERIC NOT NULL,
  installment_count INTEGER NOT NULL,
  installment_amount NUMERIC NOT NULL,
  payment_frequency TEXT DEFAULT 'monthly' CHECK (payment_frequency IN ('weekly', 'monthly', 'quarterly')),
  down_payment NUMERIC DEFAULT 0,
  interest_rate NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted', 'cancelled')),
  next_payment_date DATE NOT NULL,
  mobile_money_wallet_id UUID REFERENCES public.mobile_money_wallets(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.micro_payment_aggregations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  aggregation_period TEXT DEFAULT 'daily' CHECK (aggregation_period IN ('hourly', 'daily', 'weekly')),
  total_micro_amount NUMERIC DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  min_amount_threshold NUMERIC DEFAULT 10,
  auto_process BOOLEAN DEFAULT true,
  processed_at TIMESTAMP WITH TIME ZONE,
  wallet_id UUID REFERENCES public.mobile_money_wallets(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Rural Connectivity Optimization Tables (Skip offline_sync_queue if exists)
CREATE TABLE IF NOT EXISTS public.rural_connectivity_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  district TEXT NOT NULL,
  upazila TEXT,
  average_bandwidth_kbps NUMERIC DEFAULT 0,
  connection_stability_score NUMERIC DEFAULT 0,
  preferred_data_mode TEXT DEFAULT 'standard' CHECK (preferred_data_mode IN ('minimal', 'standard', 'full')),
  offline_sync_enabled BOOLEAN DEFAULT true,
  sms_fallback_enabled BOOLEAN DEFAULT true,
  compression_level TEXT DEFAULT 'medium' CHECK (compression_level IN ('low', 'medium', 'high', 'max')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bandwidth_optimization_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT NOT NULL,
  target_bandwidth_range TEXT NOT NULL,
  image_quality_reduction INTEGER DEFAULT 0,
  video_streaming_disabled BOOLEAN DEFAULT false,
  prefetch_disabled BOOLEAN DEFAULT false,
  lazy_loading_aggressive BOOLEAN DEFAULT true,
  compression_algorithms JSONB DEFAULT '[]',
  cache_strategy JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cultural & Localization Enhancement Tables
CREATE TABLE IF NOT EXISTS public.cultural_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  preferred_language TEXT DEFAULT 'bn' CHECK (preferred_language IN ('bn', 'en')),
  calendar_type TEXT DEFAULT 'islamic' CHECK (calendar_type IN ('gregorian', 'islamic', 'bengali')),
  currency_display TEXT DEFAULT 'BDT',
  number_format TEXT DEFAULT 'bengali' CHECK (number_format IN ('bengali', 'international')),
  date_format TEXT DEFAULT 'dd/mm/yyyy',
  time_format TEXT DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),
  region_specific_content BOOLEAN DEFAULT true,
  festival_notifications BOOLEAN DEFAULT true,
  prayer_time_integration BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.festival_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_name TEXT NOT NULL,
  festival_name_bn TEXT NOT NULL,
  festival_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  optimization_config JSONB NOT NULL,
  traffic_multiplier NUMERIC DEFAULT 1.0,
  server_scaling_factor NUMERIC DEFAULT 1.0,
  special_offers_enabled BOOLEAN DEFAULT true,
  cultural_content_boost BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.regional_business_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_name TEXT NOT NULL,
  district TEXT,
  business_type TEXT NOT NULL,
  weekday_hours JSONB NOT NULL,
  friday_hours JSONB,
  weekend_hours JSONB,
  holiday_schedule JSONB DEFAULT '{}',
  ramadan_hours JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bangla_nlp_processing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input_text TEXT NOT NULL,
  processed_text TEXT NOT NULL,
  processing_type TEXT NOT NULL,
  confidence_score NUMERIC DEFAULT 0,
  language_detected TEXT DEFAULT 'bn',
  sentiment_score NUMERIC,
  categories JSONB DEFAULT '[]',
  keywords JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_graphql_query_cache_hash ON public.graphql_query_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_graphql_query_cache_expires ON public.graphql_query_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_grpc_health_checks_service ON public.grpc_health_checks(service_id, checked_at);
CREATE INDEX IF NOT EXISTS idx_edge_nodes_region ON public.edge_nodes(geographic_region, country_code);
CREATE INDEX IF NOT EXISTS idx_geographic_routing_source ON public.geographic_routing_rules(source_region, is_active);
CREATE INDEX IF NOT EXISTS idx_mobile_wallets_user ON public.mobile_money_wallets(user_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_cross_wallet_transfers_status ON public.cross_wallet_transfers(status, created_at);
CREATE INDEX IF NOT EXISTS idx_installment_plans_customer ON public.installment_payment_plans(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_cultural_preferences_user ON public.cultural_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_festival_optimizations_dates ON public.festival_optimizations(start_date, end_date, is_active);
CREATE INDEX IF NOT EXISTS idx_bangla_nlp_type ON public.bangla_nlp_processing(processing_type, created_at);

-- Database Functions
CREATE OR REPLACE FUNCTION public.update_graphql_cache_access()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.graphql_query_cache 
  SET access_count = access_count + 1 
  WHERE query_hash = NEW.query_hash;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.cleanup_expired_graphql_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.graphql_query_cache WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.calculate_edge_node_load(p_node_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_total_requests INTEGER;
  v_avg_response_time NUMERIC;
  v_load_score NUMERIC;
BEGIN
  SELECT COUNT(*), AVG(CASE WHEN content_type = 'api_response' THEN (optimization_config->>'response_time_ms')::numeric ELSE 100 END) 
  INTO v_total_requests, v_avg_response_time
  FROM public.content_optimization_cache 
  WHERE edge_node_id = p_node_id AND created_at > now() - INTERVAL '1 hour';
  
  v_load_score := LEAST(100, (COALESCE(v_total_requests, 0) * 0.1) + (COALESCE(v_avg_response_time, 0) * 0.01));
  
  UPDATE public.edge_nodes SET current_load = v_load_score WHERE id = p_node_id;
  
  RETURN v_load_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.process_micro_payment_aggregation(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_aggregation RECORD;
  v_result JSONB;
BEGIN
  SELECT * INTO v_aggregation 
  FROM public.micro_payment_aggregations 
  WHERE user_id = p_user_id AND processed_at IS NULL 
  ORDER BY created_at ASC LIMIT 1;
  
  IF FOUND AND v_aggregation.total_micro_amount >= v_aggregation.min_amount_threshold THEN
    UPDATE public.micro_payment_aggregations 
    SET processed_at = now() 
    WHERE id = v_aggregation.id;
    
    v_result := jsonb_build_object(
      'processed', true,
      'amount', v_aggregation.total_micro_amount,
      'transaction_count', v_aggregation.transaction_count
    );
  ELSE
    v_result := jsonb_build_object('processed', false, 'reason', 'below_threshold_or_not_found');
  END IF;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;