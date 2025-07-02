-- Phase 4: Enhanced Database Layer for Advanced Features & PWA

-- Enhance AI analytics table
CREATE TABLE IF NOT EXISTS public.ai_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_type TEXT NOT NULL, -- 'fraud_detection', 'recommendation', 'behavior_analysis'
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}',
  prediction_result JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC NOT NULL DEFAULT 0,
  execution_time_ms INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  vendor_id UUID,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  feedback_score NUMERIC, -- For model improvement
  feedback_data JSONB DEFAULT '{}'
);

-- Enhanced security events table with AI analysis
ALTER TABLE public.security_events ADD COLUMN IF NOT EXISTS ai_risk_score NUMERIC DEFAULT 0;
ALTER TABLE public.security_events ADD COLUMN IF NOT EXISTS threat_category TEXT;
ALTER TABLE public.security_events ADD COLUMN IF NOT EXISTS automated_response TEXT;
ALTER TABLE public.security_events ADD COLUMN IF NOT EXISTS ml_model_version TEXT;

-- Enhanced performance metrics table  
CREATE TABLE IF NOT EXISTS public.enhanced_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_category TEXT NOT NULL, -- 'page_load', 'api_response', 'db_query', 'cache_hit'
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  measurement_unit TEXT NOT NULL, -- 'ms', 'bytes', 'count', 'percentage'
  resource_identifier TEXT, -- URL, function name, table name, etc.
  user_agent TEXT,
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  connection_type TEXT, -- '4g', '3g', 'wifi', 'ethernet'
  geographic_region TEXT,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  additional_metadata JSONB DEFAULT '{}',
  
  -- Performance thresholds
  is_slow_performance BOOLEAN DEFAULT false,
  performance_grade TEXT, -- 'excellent', 'good', 'poor', 'critical'
  
  INDEX (metric_category, timestamp),
  INDEX (user_id, timestamp),
  INDEX (resource_identifier, timestamp)
);

-- Enhanced A/B testing tables
ALTER TABLE public.ab_experiments ADD COLUMN IF NOT EXISTS traffic_split JSONB DEFAULT '{"control": 50, "variant": 50}';
ALTER TABLE public.ab_experiments ADD COLUMN IF NOT EXISTS conversion_goals JSONB DEFAULT '[]';
ALTER TABLE public.ab_experiments ADD COLUMN IF NOT EXISTS minimum_sample_size INTEGER DEFAULT 1000;
ALTER TABLE public.ab_experiments ADD COLUMN IF NOT EXISTS confidence_level NUMERIC DEFAULT 95.0;
ALTER TABLE public.ab_experiments ADD COLUMN IF NOT EXISTS auto_winner_selection BOOLEAN DEFAULT false;

-- A/B test results aggregation table
CREATE TABLE IF NOT EXISTS public.ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  variant_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  conversion_rate NUMERIC,
  statistical_significance NUMERIC,
  p_value NUMERIC,
  confidence_interval JSONB, -- {"lower": 0.1, "upper": 0.3}
  sample_size INTEGER NOT NULL,
  analysis_date DATE DEFAULT CURRENT_DATE,
  is_winner BOOLEAN DEFAULT false,
  
  UNIQUE(experiment_id, variant_id, metric_name, analysis_date)
);

-- Enhanced offline sync queue with priority and batching
ALTER TABLE public.offline_sync_queue ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 5; -- 1-10, 1 highest
ALTER TABLE public.offline_sync_queue ADD COLUMN IF NOT EXISTS batch_id UUID;
ALTER TABLE public.offline_sync_queue ADD COLUMN IF NOT EXISTS dependency_id UUID REFERENCES public.offline_sync_queue(id);
ALTER TABLE public.offline_sync_queue ADD COLUMN IF NOT EXISTS retry_strategy JSONB DEFAULT '{"max_attempts": 3, "backoff_multiplier": 2}';
ALTER TABLE public.offline_sync_queue ADD COLUMN IF NOT EXISTS conflict_resolution TEXT DEFAULT 'server_wins'; -- 'server_wins', 'client_wins', 'merge'

-- AI model performance tracking
CREATE TABLE IF NOT EXISTS public.ai_model_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  evaluation_date DATE DEFAULT CURRENT_DATE,
  accuracy_score NUMERIC,
  precision_score NUMERIC,
  recall_score NUMERIC,
  f1_score NUMERIC,
  training_data_size INTEGER,
  inference_time_ms NUMERIC,
  memory_usage_mb NUMERIC,
  deployment_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advanced fraud detection rules with ML
CREATE TABLE IF NOT EXISTS public.ai_fraud_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL, -- 'ml_model', 'statistical', 'rule_based', 'ensemble'
  model_config JSONB NOT NULL DEFAULT '{}',
  feature_weights JSONB DEFAULT '{}',
  threshold_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  accuracy_score NUMERIC,
  false_positive_rate NUMERIC,
  false_negative_rate NUMERIC,
  last_trained TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Biometric authentication sessions
CREATE TABLE IF NOT EXISTS public.biometric_auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.biometric_auth_registrations(id),
  auth_type TEXT NOT NULL, -- 'fingerprint', 'face', 'voice', 'iris'
  challenge TEXT NOT NULL, -- Random challenge for authentication
  challenge_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_data JSONB,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Two-factor authentication methods
CREATE TABLE IF NOT EXISTS public.two_factor_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL, -- 'totp', 'sms', 'email', 'backup_codes'
  secret_key TEXT, -- For TOTP
  phone_number TEXT, -- For SMS
  backup_codes JSONB, -- Array of backup codes
  is_active BOOLEAN DEFAULT true,
  is_primary_method BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, method_type)
);

-- Advanced caching strategies
CREATE TABLE IF NOT EXISTS public.cache_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_type TEXT NOT NULL, -- 'redis', 'browser', 'cdn', 'database'
  cache_key TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'hit', 'miss', 'set', 'invalidate'
  hit_rate NUMERIC,
  response_time_ms INTEGER,
  cache_size_bytes INTEGER,
  ttl_seconds INTEGER,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  INDEX (cache_type, created_at),
  INDEX (operation, created_at)
);

-- Progressive Web App analytics
CREATE TABLE IF NOT EXISTS public.pwa_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL, -- 'install', 'uninstall', 'offline_usage', 'cache_fallback'
  device_info JSONB NOT NULL DEFAULT '{}',
  app_version TEXT,
  service_worker_version TEXT,
  network_status TEXT, -- 'online', 'offline', '2g', '3g', '4g', '5g'
  cache_performance JSONB DEFAULT '{}',
  offline_duration INTEGER, -- seconds spent offline
  sync_queue_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  INDEX (user_id, created_at),
  INDEX (event_type, created_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_analytics_type_date ON public.ai_analytics(analysis_type, created_at);
CREATE INDEX IF NOT EXISTS idx_enhanced_performance_metrics_category ON public.enhanced_performance_metrics(metric_category, timestamp);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_experiment ON public.ab_test_results(experiment_id, analysis_date);
CREATE INDEX IF NOT EXISTS idx_ai_fraud_rules_active ON public.ai_fraud_rules(is_active, rule_type);
CREATE INDEX IF NOT EXISTS idx_biometric_sessions_user ON public.biometric_auth_sessions(user_id, created_at);

-- Enable Row Level Security
ALTER TABLE public.ai_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_fraud_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pwa_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- AI Analytics: Admin can view all, users can view their own
CREATE POLICY "Admin can manage ai_analytics" ON public.ai_analytics FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their ai_analytics" ON public.ai_analytics FOR SELECT USING (auth.uid() = user_id);

-- Performance Metrics: Admin full access, users can view their own
CREATE POLICY "Admin can manage performance_metrics" ON public.enhanced_performance_metrics FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their performance_metrics" ON public.enhanced_performance_metrics FOR SELECT USING (auth.uid() = user_id);

-- A/B Test Results: Admin only
CREATE POLICY "Admin can manage ab_test_results" ON public.ab_test_results FOR ALL USING (is_admin_user());

-- AI Model Performance: Admin only
CREATE POLICY "Admin can manage ai_model_performance" ON public.ai_model_performance FOR ALL USING (is_admin_user());

-- AI Fraud Rules: Admin only
CREATE POLICY "Admin can manage ai_fraud_rules" ON public.ai_fraud_rules FOR ALL USING (is_admin_user());

-- Biometric Auth Sessions: Users can manage their own
CREATE POLICY "Users can manage their biometric_sessions" ON public.biometric_auth_sessions FOR ALL USING (auth.uid() = user_id);

-- Two Factor Auth: Users can manage their own
CREATE POLICY "Users can manage their 2fa" ON public.two_factor_auth FOR ALL USING (auth.uid() = user_id);

-- Cache Analytics: Admin can view all
CREATE POLICY "Admin can manage cache_analytics" ON public.cache_analytics FOR ALL USING (is_admin_user());

-- PWA Analytics: Admin can view all, users can view their own
CREATE POLICY "Admin can manage pwa_analytics" ON public.pwa_analytics FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their pwa_analytics" ON public.pwa_analytics FOR SELECT USING (auth.uid() = user_id);