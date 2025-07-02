-- Phase 6: Performance & Optimization Database Schema

-- 6.1 Intelligent Caching System Tables
CREATE TABLE IF NOT EXISTS public.intelligent_cache_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT NOT NULL,
    cache_value JSONB NOT NULL,
    cache_type TEXT NOT NULL, -- 'user_behavior', 'predictive', 'geographic'
    user_id UUID,
    geographic_region TEXT,
    access_frequency INTEGER DEFAULT 1,
    prediction_score NUMERIC DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.cache_optimization_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT NOT NULL,
    hit_rate NUMERIC NOT NULL DEFAULT 0,
    miss_rate NUMERIC NOT NULL DEFAULT 0,
    access_pattern JSONB NOT NULL DEFAULT '{}'::jsonb,
    optimization_score NUMERIC NOT NULL DEFAULT 0,
    recommendations JSONB DEFAULT '[]'::jsonb,
    analysis_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_behavior_cache_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    behavior_patterns JSONB NOT NULL DEFAULT '{}'::jsonb,
    cache_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    access_frequency_map JSONB NOT NULL DEFAULT '{}'::jsonb,
    geographic_preferences JSONB DEFAULT '{}'::jsonb,
    prediction_accuracy NUMERIC DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.predictive_cache_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT NOT NULL,
    model_type TEXT NOT NULL, -- 'user_behavior', 'content_popularity', 'geographic'
    model_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    accuracy_score NUMERIC DEFAULT 0,
    training_data_size INTEGER DEFAULT 0,
    last_trained TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6.2 Request Optimization Engine Tables
CREATE TABLE IF NOT EXISTS public.request_optimization_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL,
    original_size INTEGER NOT NULL,
    optimized_size INTEGER NOT NULL,
    compression_ratio NUMERIC NOT NULL,
    optimization_type TEXT NOT NULL, -- 'deduplication', 'compression', 'batching', 'streaming'
    processing_time_ms INTEGER NOT NULL,
    bandwidth_saved INTEGER DEFAULT 0,
    user_id UUID,
    endpoint TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.request_deduplication_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_hash TEXT NOT NULL UNIQUE,
    response_data JSONB NOT NULL,
    request_count INTEGER DEFAULT 1,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.compression_optimization_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL,
    compression_algorithm TEXT NOT NULL, -- 'gzip', 'brotli', 'zstd'
    compression_level INTEGER DEFAULT 6,
    min_size_threshold INTEGER DEFAULT 1024,
    max_compression_time_ms INTEGER DEFAULT 100,
    bandwidth_threshold TEXT, -- 'low', 'medium', 'high'
    is_active BOOLEAN DEFAULT true,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.request_batching_queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id TEXT NOT NULL,
    user_id UUID,
    request_type TEXT NOT NULL,
    request_data JSONB NOT NULL,
    priority INTEGER DEFAULT 5,
    batch_size INTEGER DEFAULT 0,
    processing_delay_ms INTEGER DEFAULT 100,
    status TEXT DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.bandwidth_adaptation_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    connection_type TEXT NOT NULL, -- '2g', '3g', '4g', '5g', 'wifi', 'ethernet'
    bandwidth_estimate INTEGER NOT NULL, -- in kbps
    latency_ms INTEGER DEFAULT 0,
    packet_loss_rate NUMERIC DEFAULT 0,
    adaptation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    quality_preferences JSONB DEFAULT '{}'::jsonb,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_intelligent_cache_entries_cache_key ON public.intelligent_cache_entries(cache_key);
CREATE INDEX IF NOT EXISTS idx_intelligent_cache_entries_user_id ON public.intelligent_cache_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_intelligent_cache_entries_expires_at ON public.intelligent_cache_entries(expires_at);
CREATE INDEX IF NOT EXISTS idx_intelligent_cache_entries_cache_type ON public.intelligent_cache_entries(cache_type);

CREATE INDEX IF NOT EXISTS idx_cache_optimization_metrics_cache_key ON public.cache_optimization_metrics(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_optimization_metrics_analysis_date ON public.cache_optimization_metrics(analysis_date);

CREATE INDEX IF NOT EXISTS idx_user_behavior_cache_profiles_user_id ON public.user_behavior_cache_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_request_optimization_logs_request_id ON public.request_optimization_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_request_optimization_logs_user_id ON public.request_optimization_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_request_optimization_logs_created_at ON public.request_optimization_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_request_deduplication_cache_request_hash ON public.request_deduplication_cache(request_hash);
CREATE INDEX IF NOT EXISTS idx_request_deduplication_cache_expires_at ON public.request_deduplication_cache(expires_at);

CREATE INDEX IF NOT EXISTS idx_request_batching_queues_batch_id ON public.request_batching_queues(batch_id);
CREATE INDEX IF NOT EXISTS idx_request_batching_queues_user_id ON public.request_batching_queues(user_id);
CREATE INDEX IF NOT EXISTS idx_request_batching_queues_status ON public.request_batching_queues(status);

CREATE INDEX IF NOT EXISTS idx_bandwidth_adaptation_profiles_user_id ON public.bandwidth_adaptation_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_bandwidth_adaptation_profiles_connection_type ON public.bandwidth_adaptation_profiles(connection_type);

-- Enable RLS
ALTER TABLE public.intelligent_cache_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_optimization_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavior_cache_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_cache_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_optimization_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_deduplication_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compression_optimization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_batching_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandwidth_adaptation_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access intelligent_cache_entries" ON public.intelligent_cache_entries FOR ALL USING (is_admin_user());
CREATE POLICY "Users can access their cache entries" ON public.intelligent_cache_entries FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin full access cache_optimization_metrics" ON public.cache_optimization_metrics FOR ALL USING (is_admin_user());

CREATE POLICY "Users can manage their behavior cache profiles" ON public.user_behavior_cache_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access predictive_cache_models" ON public.predictive_cache_models FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access request_optimization_logs" ON public.request_optimization_logs FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their optimization logs" ON public.request_optimization_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin full access request_deduplication_cache" ON public.request_deduplication_cache FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access compression_optimization_rules" ON public.compression_optimization_rules FOR ALL USING (is_admin_user());

CREATE POLICY "Users can manage their batching queues" ON public.request_batching_queues FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their bandwidth profiles" ON public.bandwidth_adaptation_profiles FOR ALL USING (auth.uid() = user_id);

-- Database Functions
CREATE OR REPLACE FUNCTION public.update_cache_access_frequency()
RETURNS TRIGGER AS $$
BEGIN
    NEW.access_frequency := OLD.access_frequency + 1;
    NEW.last_accessed_at := now();
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.cleanup_expired_intelligent_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM public.intelligent_cache_entries WHERE expires_at < now();
    DELETE FROM public.request_deduplication_cache WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.calculate_cache_optimization_score(
    p_cache_key TEXT,
    p_hit_rate NUMERIC,
    p_access_frequency INTEGER
) RETURNS NUMERIC AS $$
DECLARE
    v_score NUMERIC;
BEGIN
    -- Calculate optimization score based on hit rate, access frequency, and other factors
    v_score := (p_hit_rate * 40) + (LEAST(p_access_frequency / 100.0, 1.0) * 30) + 
               (CASE WHEN p_hit_rate > 0.8 THEN 30 ELSE 0 END);
    
    RETURN LEAST(100, v_score);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.optimize_request_batching(
    p_user_id UUID,
    p_request_type TEXT
) RETURNS JSONB AS $$
DECLARE
    v_batch_config JSONB;
    v_queue_size INTEGER;
BEGIN
    -- Get current queue size for user and request type
    SELECT COUNT(*) INTO v_queue_size
    FROM public.request_batching_queues
    WHERE user_id = p_user_id AND request_type = p_request_type AND status = 'queued';
    
    -- Determine optimal batch configuration
    v_batch_config := jsonb_build_object(
        'batch_size', CASE 
            WHEN v_queue_size > 50 THEN 20
            WHEN v_queue_size > 20 THEN 10
            ELSE 5
        END,
        'processing_delay_ms', CASE
            WHEN v_queue_size > 50 THEN 50
            WHEN v_queue_size > 20 THEN 100
            ELSE 200
        END,
        'priority_boost', v_queue_size > 30
    );
    
    RETURN v_batch_config;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_cache_access_trigger
    BEFORE UPDATE ON public.intelligent_cache_entries
    FOR EACH ROW
    WHEN (OLD.last_accessed_at IS DISTINCT FROM NEW.last_accessed_at)
    EXECUTE FUNCTION public.update_cache_access_frequency();

CREATE TRIGGER update_updated_at_intelligent_cache_entries
    BEFORE UPDATE ON public.intelligent_cache_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_updated_at_predictive_cache_models
    BEFORE UPDATE ON public.predictive_cache_models
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_updated_at_compression_optimization_rules
    BEFORE UPDATE ON public.compression_optimization_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();