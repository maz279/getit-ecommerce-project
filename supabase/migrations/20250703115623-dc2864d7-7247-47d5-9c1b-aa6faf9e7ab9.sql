-- Create comprehensive microservice infrastructure tables
-- This addresses the gaps between database and backend services

-- API Gateway and Service Registry Tables
CREATE TABLE IF NOT EXISTS public.api_gateway_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  service_type TEXT NOT NULL,
  base_url TEXT NOT NULL,
  health_endpoint TEXT NOT NULL,
  auth_required BOOLEAN DEFAULT true,
  rate_limit_config JSONB DEFAULT '{"requests_per_minute": 60}',
  circuit_breaker_config JSONB DEFAULT '{"failure_threshold": 5, "timeout_ms": 30000}',
  load_balancer_config JSONB DEFAULT '{"strategy": "round_robin"}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Service Health Monitoring
CREATE TABLE IF NOT EXISTS public.service_health_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  health_status TEXT NOT NULL DEFAULT 'healthy',
  response_time_ms INTEGER,
  error_count INTEGER DEFAULT 0,
  last_check_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- API Request Routing and Load Balancing
CREATE TABLE IF NOT EXISTS public.api_request_routing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  route_path TEXT NOT NULL,
  method TEXT NOT NULL,
  user_id UUID,
  ip_address INET,
  response_status INTEGER,
  response_time_ms INTEGER,
  payload_size_bytes INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Microservice Configuration Management
CREATE TABLE IF NOT EXISTS public.microservice_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  environment TEXT DEFAULT 'production',
  is_secret BOOLEAN DEFAULT false,
  version TEXT DEFAULT '1.0.0',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(service_name, config_key, environment)
);

-- Service Dependencies and Communication
CREATE TABLE IF NOT EXISTS public.service_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  depends_on_service TEXT NOT NULL,
  dependency_type TEXT NOT NULL, -- 'sync', 'async', 'optional'
  communication_method TEXT NOT NULL, -- 'http', 'grpc', 'message_queue'
  circuit_breaker_enabled BOOLEAN DEFAULT true,
  retry_config JSONB DEFAULT '{"max_retries": 3, "backoff_ms": 1000}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Distributed Transaction Management
CREATE TABLE IF NOT EXISTS public.distributed_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  coordinator_service TEXT NOT NULL,
  participants JSONB NOT NULL, -- Array of participating services
  transaction_state TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'committed', 'aborted'
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  rollback_data JSONB,
  error_details JSONB
);

-- Event Sourcing for Microservices
CREATE TABLE IF NOT EXISTS public.service_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  service_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_data JSONB NOT NULL,
  event_version INTEGER DEFAULT 1,
  correlation_id TEXT,
  causation_id TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_by_services JSONB DEFAULT '[]'
);

-- Service Discovery and Registration
CREATE TABLE IF NOT EXISTS public.service_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  service_id TEXT NOT NULL UNIQUE,
  instance_id TEXT NOT NULL,
  host TEXT NOT NULL,
  port INTEGER NOT NULL,
  protocol TEXT DEFAULT 'https',
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'draining'
  metadata JSONB DEFAULT '{}',
  health_check_interval INTEGER DEFAULT 30, -- seconds
  last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT now(),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Message Queue for Async Communication
CREATE TABLE IF NOT EXISTS public.message_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  message_id TEXT NOT NULL UNIQUE,
  message_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  priority INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  delay_until TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  created_by_service TEXT NOT NULL,
  assigned_to_service TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Service Metrics and Monitoring
CREATE TABLE IF NOT EXISTS public.service_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'counter', 'gauge', 'histogram'
  metric_value NUMERIC NOT NULL,
  labels JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- API Contract Versioning
CREATE TABLE IF NOT EXISTS public.api_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  api_version TEXT NOT NULL,
  contract_spec JSONB NOT NULL, -- OpenAPI/AsyncAPI spec
  backward_compatible BOOLEAN DEFAULT true,
  deprecation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(service_name, api_version)
);

-- RLS Policies for microservice security
ALTER TABLE public.api_gateway_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_health_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_request_routing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microservice_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributed_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_contracts ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin full access api_gateway_configs" ON public.api_gateway_configs FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access service_health_monitoring" ON public.service_health_monitoring FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access api_request_routing" ON public.api_request_routing FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access microservice_configs" ON public.microservice_configs FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access service_dependencies" ON public.service_dependencies FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access distributed_transactions" ON public.distributed_transactions FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access service_events" ON public.service_events FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access service_registry" ON public.service_registry FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access message_queue" ON public.message_queue FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access service_metrics" ON public.service_metrics FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access api_contracts" ON public.api_contracts FOR ALL USING (is_admin_user());

-- Service can insert their own health checks
CREATE POLICY "Services can insert health monitoring" ON public.service_health_monitoring FOR INSERT WITH CHECK (true);
CREATE POLICY "Services can insert request routing" ON public.api_request_routing FOR INSERT WITH CHECK (true);
CREATE POLICY "Services can insert events" ON public.service_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Services can insert metrics" ON public.service_metrics FOR INSERT WITH CHECK (true);

-- Insert initial microservice configurations
INSERT INTO public.api_gateway_configs (service_name, service_type, base_url, health_endpoint) VALUES
('user-management-api', 'user', '/functions/v1/user-management-api', '/functions/v1/user-management-api/health'),
('vendor-management-api', 'vendor', '/functions/v1/vendor-management-api', '/functions/v1/vendor-management-api/health'),
('product-service', 'product', '/functions/v1/product-service', '/functions/v1/product-service/health'),
('payment-processing', 'payment', '/functions/v1/payment-processing', '/functions/v1/payment-processing/health'),
('order-service', 'order', '/functions/v1/order-service', '/functions/v1/order-service/health'),
('notification-system', 'notification', '/functions/v1/notification-system', '/functions/v1/notification-system/health'),
('ai-enhanced-search', 'search', '/functions/v1/ai-enhanced-search', '/functions/v1/ai-enhanced-search/health'),
('realtime-hub', 'realtime', '/functions/v1/realtime-hub', '/functions/v1/realtime-hub/health')
ON CONFLICT (service_name) DO NOTHING;

-- Insert service dependencies
INSERT INTO public.service_dependencies (service_name, depends_on_service, dependency_type, communication_method) VALUES
('order-service', 'product-service', 'sync', 'http'),
('order-service', 'user-management-api', 'sync', 'http'),
('order-service', 'payment-processing', 'async', 'message_queue'),
('vendor-management-api', 'user-management-api', 'sync', 'http'),
('payment-processing', 'notification-system', 'async', 'message_queue'),
('ai-enhanced-search', 'product-service', 'sync', 'http')
ON CONFLICT DO NOTHING;

-- Insert initial service registry entries
INSERT INTO public.service_registry (service_name, service_id, instance_id, host, port) VALUES
('user-management-api', 'user-mgmt-001', 'instance-001', 'bbgppsjmspmymrfowytf.supabase.co', 443),
('vendor-management-api', 'vendor-mgmt-001', 'instance-001', 'bbgppsjmspmymrfowytf.supabase.co', 443),
('product-service', 'product-svc-001', 'instance-001', 'bbgppsjmspmymrfowytf.supabase.co', 443),
('payment-processing', 'payment-proc-001', 'instance-001', 'bbgppsjmspmymrfowytf.supabase.co', 443)
ON CONFLICT (service_id) DO NOTHING;