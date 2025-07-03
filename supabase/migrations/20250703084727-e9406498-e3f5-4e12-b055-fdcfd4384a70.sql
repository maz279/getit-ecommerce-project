-- ====================================================================================
-- COMPREHENSIVE MICROSERVICES ARCHITECTURE DATABASE FOUNDATION
-- Systematic gap fixes across all layers for 100% microservice compatibility
-- ====================================================================================

-- 1. SERVICE REGISTRY AND DISCOVERY TABLES
-- Core microservices infrastructure tables

CREATE TABLE IF NOT EXISTS public.microservices_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL UNIQUE,
    service_version TEXT NOT NULL DEFAULT '1.0.0',
    service_type TEXT NOT NULL CHECK (service_type IN ('api_gateway', 'business_service', 'data_service', 'auth_service', 'notification_service', 'payment_service', 'inventory_service', 'order_service', 'user_service', 'analytics_service', 'ml_service')),
    endpoint_url TEXT NOT NULL,
    health_check_url TEXT NOT NULL,
    service_port INTEGER NOT NULL DEFAULT 3000,
    service_status TEXT NOT NULL DEFAULT 'healthy' CHECK (service_status IN ('healthy', 'unhealthy', 'starting', 'stopping', 'maintenance')),
    service_metadata JSONB NOT NULL DEFAULT '{}',
    load_balancing_config JSONB NOT NULL DEFAULT '{}',
    circuit_breaker_config JSONB NOT NULL DEFAULT '{"failure_threshold": 5, "recovery_timeout": 30}',
    timeout_config JSONB NOT NULL DEFAULT '{"connect_timeout": 5, "read_timeout": 30}',
    retry_policy JSONB NOT NULL DEFAULT '{"max_retries": 3, "backoff_strategy": "exponential"}',
    rate_limit_config JSONB NOT NULL DEFAULT '{"requests_per_minute": 1000}',
    security_config JSONB NOT NULL DEFAULT '{}',
    dependencies JSONB NOT NULL DEFAULT '[]',
    tags JSONB NOT NULL DEFAULT '[]',
    environment TEXT NOT NULL DEFAULT 'production',
    deployment_strategy TEXT NOT NULL DEFAULT 'rolling',
    scaling_config JSONB NOT NULL DEFAULT '{"min_instances": 1, "max_instances": 10, "target_cpu": 70}',
    monitoring_config JSONB NOT NULL DEFAULT '{}',
    last_health_check TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- 2. SERVICE COMMUNICATION AND API GATEWAY CONFIGURATION
CREATE TABLE IF NOT EXISTS public.api_gateway_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_pattern TEXT NOT NULL,
    service_name TEXT NOT NULL REFERENCES public.microservices_registry(service_name) ON DELETE CASCADE,
    http_method TEXT NOT NULL CHECK (http_method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS')),
    target_path TEXT NOT NULL,
    authentication_required BOOLEAN NOT NULL DEFAULT true,
    authorization_rules JSONB NOT NULL DEFAULT '[]',
    rate_limiting JSONB NOT NULL DEFAULT '{"enabled": true, "requests_per_minute": 100}',
    caching_config JSONB NOT NULL DEFAULT '{"enabled": false, "ttl_seconds": 300}',
    request_transformation JSONB NOT NULL DEFAULT '{}',
    response_transformation JSONB NOT NULL DEFAULT '{}',
    cors_config JSONB NOT NULL DEFAULT '{"enabled": true, "origins": ["*"]}',
    validation_schema JSONB NOT NULL DEFAULT '{}',
    middleware_chain JSONB NOT NULL DEFAULT '[]',
    load_balancing_strategy TEXT NOT NULL DEFAULT 'round_robin' CHECK (load_balancing_strategy IN ('round_robin', 'least_connections', 'weighted', 'ip_hash')),
    health_check_enabled BOOLEAN NOT NULL DEFAULT true,
    timeout_ms INTEGER NOT NULL DEFAULT 30000,
    retry_config JSONB NOT NULL DEFAULT '{"enabled": true, "max_retries": 3}',
    circuit_breaker_enabled BOOLEAN NOT NULL DEFAULT true,
    monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 1,
    tags JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. INTER-SERVICE COMMUNICATION LOGS
CREATE TABLE IF NOT EXISTS public.service_communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL,
    source_service TEXT NOT NULL,
    target_service TEXT NOT NULL,
    operation_name TEXT NOT NULL,
    http_method TEXT NOT NULL,
    request_path TEXT NOT NULL,
    request_headers JSONB NOT NULL DEFAULT '{}',
    request_body JSONB,
    response_status INTEGER,
    response_headers JSONB NOT NULL DEFAULT '{}',
    response_body JSONB,
    execution_time_ms INTEGER NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    error_code TEXT,
    trace_id TEXT,
    span_id TEXT,
    parent_span_id TEXT,
    correlation_id TEXT,
    user_id UUID,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. DISTRIBUTED TRANSACTION MANAGEMENT (SAGA PATTERN)
CREATE TABLE IF NOT EXISTS public.distributed_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL UNIQUE,
    transaction_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'compensating', 'compensated')),
    total_steps INTEGER NOT NULL,
    current_step INTEGER NOT NULL DEFAULT 0,
    steps_definition JSONB NOT NULL DEFAULT '[]',
    execution_context JSONB NOT NULL DEFAULT '{}',
    compensation_data JSONB NOT NULL DEFAULT '{}',
    timeout_at TIMESTAMP WITH TIME ZONE,
    initiated_by UUID,
    correlation_id TEXT,
    parent_transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.transaction_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.distributed_transactions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    service_name TEXT NOT NULL,
    operation_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'compensated')),
    request_data JSONB NOT NULL DEFAULT '{}',
    response_data JSONB NOT NULL DEFAULT '{}',
    compensation_action TEXT,
    compensation_data JSONB NOT NULL DEFAULT '{}',
    execution_time_ms INTEGER,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(transaction_id, step_number)
);

-- 5. SERVICE CONFIGURATION AND FEATURE FLAGS
CREATE TABLE IF NOT EXISTS public.service_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    config_key TEXT NOT NULL,
    config_value JSONB NOT NULL,
    config_type TEXT NOT NULL CHECK (config_type IN ('string', 'number', 'boolean', 'object', 'array')),
    environment TEXT NOT NULL DEFAULT 'production',
    is_encrypted BOOLEAN NOT NULL DEFAULT false,
    is_sensitive BOOLEAN NOT NULL DEFAULT false,
    validation_schema JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    last_updated_by UUID,
    version INTEGER NOT NULL DEFAULT 1,
    effective_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    effective_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(service_name, config_key, environment)
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_name TEXT NOT NULL UNIQUE,
    flag_description TEXT NOT NULL,
    flag_type TEXT NOT NULL DEFAULT 'boolean' CHECK (flag_type IN ('boolean', 'string', 'number', 'json')),
    default_value JSONB NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    target_services TEXT[] NOT NULL DEFAULT '{}',
    targeting_rules JSONB NOT NULL DEFAULT '[]',
    rollout_percentage INTEGER NOT NULL DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    environment_overrides JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. MESSAGE QUEUE AND EVENT STREAMING
CREATE TABLE IF NOT EXISTS public.message_queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_name TEXT NOT NULL UNIQUE,
    queue_type TEXT NOT NULL CHECK (queue_type IN ('fifo', 'standard', 'priority', 'delayed')),
    max_message_size INTEGER NOT NULL DEFAULT 1048576,
    message_retention_period INTEGER NOT NULL DEFAULT 1209600,
    dead_letter_queue_name TEXT,
    max_receive_count INTEGER NOT NULL DEFAULT 3,
    visibility_timeout INTEGER NOT NULL DEFAULT 30,
    delay_seconds INTEGER NOT NULL DEFAULT 0,
    consumer_services TEXT[] NOT NULL DEFAULT '{}',
    producer_services TEXT[] NOT NULL DEFAULT '{}',
    encryption_enabled BOOLEAN NOT NULL DEFAULT true,
    monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
    auto_scaling_config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_name TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    partition_key TEXT NOT NULL,
    retention_period INTEGER NOT NULL DEFAULT 168,
    shard_count INTEGER NOT NULL DEFAULT 1,
    consumer_services TEXT[] NOT NULL DEFAULT '{}',
    producer_services TEXT[] NOT NULL DEFAULT '{}',
    schema_registry_id TEXT,
    encryption_enabled BOOLEAN NOT NULL DEFAULT true,
    compression_enabled BOOLEAN NOT NULL DEFAULT true,
    monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. SERVICE MESH AND SECURITY
CREATE TABLE IF NOT EXISTS public.service_mesh_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name TEXT NOT NULL UNIQUE,
    policy_type TEXT NOT NULL CHECK (policy_type IN ('authentication', 'authorization', 'traffic', 'security', 'observability')),
    source_services TEXT[] NOT NULL DEFAULT '{}',
    target_services TEXT[] NOT NULL DEFAULT '{}',
    policy_rules JSONB NOT NULL DEFAULT '{}',
    mtls_enabled BOOLEAN NOT NULL DEFAULT true,
    encryption_enabled BOOLEAN NOT NULL DEFAULT true,
    rate_limiting JSONB NOT NULL DEFAULT '{}',
    circuit_breaker_config JSONB NOT NULL DEFAULT '{}',
    retry_policy JSONB NOT NULL DEFAULT '{}',
    timeout_config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. DISTRIBUTED CACHING LAYER
CREATE TABLE IF NOT EXISTS public.distributed_cache_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_name TEXT NOT NULL UNIQUE,
    cache_type TEXT NOT NULL CHECK (cache_type IN ('redis', 'memcached', 'in_memory', 'distributed')),
    cache_nodes JSONB NOT NULL DEFAULT '[]',
    replication_factor INTEGER NOT NULL DEFAULT 3,
    consistency_level TEXT NOT NULL DEFAULT 'eventual' CHECK (consistency_level IN ('strong', 'eventual', 'weak')),
    ttl_seconds INTEGER NOT NULL DEFAULT 3600,
    max_memory_mb INTEGER NOT NULL DEFAULT 1024,
    eviction_policy TEXT NOT NULL DEFAULT 'lru' CHECK (eviction_policy IN ('lru', 'lfu', 'fifo', 'random')),
    partition_strategy TEXT NOT NULL DEFAULT 'hash' CHECK (partition_strategy IN ('hash', 'range', 'consistent_hash')),
    encryption_enabled BOOLEAN NOT NULL DEFAULT true,
    compression_enabled BOOLEAN NOT NULL DEFAULT true,
    monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
    backup_enabled BOOLEAN NOT NULL DEFAULT true,
    backup_frequency INTEGER NOT NULL DEFAULT 3600,
    service_access_list TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_microservices_registry_name ON public.microservices_registry(service_name);
CREATE INDEX IF NOT EXISTS idx_microservices_registry_status ON public.microservices_registry(service_status);
CREATE INDEX IF NOT EXISTS idx_microservices_registry_type ON public.microservices_registry(service_type);
CREATE INDEX IF NOT EXISTS idx_api_gateway_routes_pattern ON public.api_gateway_routes(route_pattern);
CREATE INDEX IF NOT EXISTS idx_api_gateway_routes_service ON public.api_gateway_routes(service_name);
CREATE INDEX IF NOT EXISTS idx_service_comm_logs_request_id ON public.service_communication_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_service_comm_logs_source ON public.service_communication_logs(source_service);
CREATE INDEX IF NOT EXISTS idx_service_comm_logs_target ON public.service_communication_logs(target_service);
CREATE INDEX IF NOT EXISTS idx_service_comm_logs_created_at ON public.service_communication_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_distributed_transactions_id ON public.distributed_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_distributed_transactions_status ON public.distributed_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transaction_steps_transaction_id ON public.transaction_steps(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_steps_service ON public.transaction_steps(service_name);
CREATE INDEX IF NOT EXISTS idx_service_configs_service_key ON public.service_configurations(service_name, config_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON public.feature_flags(flag_name);
CREATE INDEX IF NOT EXISTS idx_message_queues_name ON public.message_queues(queue_name);
CREATE INDEX IF NOT EXISTS idx_event_streams_name ON public.event_streams(stream_name);

-- 10. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.microservices_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_gateway_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributed_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_mesh_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributed_cache_config ENABLE ROW LEVEL SECURITY;

-- 11. RLS POLICIES
-- Admin access for all microservice infrastructure tables
CREATE POLICY "Admins can manage microservices registry" ON public.microservices_registry FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can manage API gateway routes" ON public.api_gateway_routes FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can view service communication logs" ON public.service_communication_logs FOR SELECT USING (is_admin_user());
CREATE POLICY "Admins can manage distributed transactions" ON public.distributed_transactions FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can manage transaction steps" ON public.transaction_steps FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can manage service configurations" ON public.service_configurations FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can manage feature flags" ON public.feature_flags FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can manage message queues" ON public.message_queues FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can manage event streams" ON public.event_streams FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can manage service mesh policies" ON public.service_mesh_policies FOR ALL USING (is_admin_user());
CREATE POLICY "Admins can manage distributed cache config" ON public.distributed_cache_config FOR ALL USING (is_admin_user());

-- Service-to-service communication logging
CREATE POLICY "Services can log communications" ON public.service_communication_logs FOR INSERT WITH CHECK (true);

-- 12. FUNCTIONS FOR MICROSERVICES OPERATIONS
CREATE OR REPLACE FUNCTION public.register_microservice(
    p_service_name TEXT,
    p_service_version TEXT,
    p_service_type TEXT,
    p_endpoint_url TEXT,
    p_health_check_url TEXT,
    p_service_port INTEGER DEFAULT 3000,
    p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    v_service_id UUID;
BEGIN
    INSERT INTO public.microservices_registry (
        service_name, service_version, service_type, endpoint_url, 
        health_check_url, service_port, service_metadata
    ) VALUES (
        p_service_name, p_service_version, p_service_type, p_endpoint_url,
        p_health_check_url, p_service_port, p_metadata
    ) 
    ON CONFLICT (service_name) 
    DO UPDATE SET 
        service_version = EXCLUDED.service_version,
        endpoint_url = EXCLUDED.endpoint_url,
        health_check_url = EXCLUDED.health_check_url,
        service_port = EXCLUDED.service_port,
        service_metadata = EXCLUDED.service_metadata,
        updated_at = now()
    RETURNING id INTO v_service_id;
    
    RETURN v_service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_healthy_services(p_service_type TEXT DEFAULT NULL)
RETURNS TABLE(
    service_name TEXT,
    endpoint_url TEXT,
    service_port INTEGER,
    load_balancing_config JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ms.service_name,
        ms.endpoint_url,
        ms.service_port,
        ms.load_balancing_config
    FROM public.microservices_registry ms
    WHERE ms.service_status = 'healthy'
    AND (p_service_type IS NULL OR ms.service_type = p_service_type)
    AND ms.last_health_check > (now() - INTERVAL '5 minutes');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_service_communication(
    p_request_id TEXT,
    p_source_service TEXT,
    p_target_service TEXT,
    p_operation_name TEXT,
    p_http_method TEXT,
    p_request_path TEXT,
    p_execution_time_ms INTEGER,
    p_success BOOLEAN,
    p_response_status INTEGER DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.service_communication_logs (
        request_id, source_service, target_service, operation_name,
        http_method, request_path, execution_time_ms, success,
        response_status, error_message
    ) VALUES (
        p_request_id, p_source_service, p_target_service, p_operation_name,
        p_http_method, p_request_path, p_execution_time_ms, p_success,
        p_response_status, p_error_message
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. TRIGGERS FOR AUTOMATIC UPDATES
CREATE OR REPLACE FUNCTION public.update_microservice_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER microservices_registry_updated_at
    BEFORE UPDATE ON public.microservices_registry
    FOR EACH ROW EXECUTE FUNCTION public.update_microservice_timestamp();

CREATE TRIGGER api_gateway_routes_updated_at
    BEFORE UPDATE ON public.api_gateway_routes
    FOR EACH ROW EXECUTE FUNCTION public.update_microservice_timestamp();

CREATE TRIGGER service_configurations_updated_at
    BEFORE UPDATE ON public.service_configurations
    FOR EACH ROW EXECUTE FUNCTION public.update_microservice_timestamp();