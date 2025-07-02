-- Advanced Commerce Features Database Schema

-- AI/ML Chatbot System
CREATE TABLE public.ai_chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  conversation_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  context_data JSONB DEFAULT '{}'::jsonb,
  sentiment_score NUMERIC,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated'))
);

CREATE TABLE public.ai_chatbot_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_name TEXT NOT NULL UNIQUE,
  training_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_threshold NUMERIC DEFAULT 0.8,
  response_templates JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fraud Detection System
CREATE TABLE public.fraud_detection_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('velocity', 'pattern', 'threshold', 'behavioral')),
  conditions JSONB NOT NULL,
  risk_score INTEGER CHECK (risk_score >= 1 AND risk_score <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.fraud_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  transaction_id UUID,
  rule_id UUID REFERENCES public.fraud_detection_rules(id),
  risk_score INTEGER,
  fraud_indicators JSONB DEFAULT '{}'::jsonb,
  action_taken TEXT CHECK (action_taken IN ('allow', 'block', 'review', 'challenge')),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Price Prediction ML
CREATE TABLE public.price_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  current_price NUMERIC NOT NULL,
  predicted_price NUMERIC NOT NULL,
  prediction_confidence NUMERIC CHECK (prediction_confidence >= 0 AND prediction_confidence <= 1),
  prediction_period TEXT NOT NULL CHECK (prediction_period IN ('1_day', '3_days', '1_week', '1_month')),
  market_factors JSONB DEFAULT '{}'::jsonb,
  competitor_data JSONB DEFAULT '{}'::jsonb,
  seasonal_factors JSONB DEFAULT '{}'::jsonb,
  algorithm_used TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Advanced Analytics
CREATE TABLE public.user_heatmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  element_selector TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('click', 'hover', 'scroll', 'focus')),
  x_coordinate INTEGER,
  y_coordinate INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  device_type TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.conversion_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_name TEXT NOT NULL,
  funnel_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.conversion_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.conversion_funnels(id),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  time_spent_seconds INTEGER,
  exit_point BOOLEAN DEFAULT false,
  conversion_value NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enhanced Security
CREATE TABLE public.user_two_factor_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  secret_key TEXT,
  backup_codes TEXT[],
  last_used_at TIMESTAMPTZ,
  setup_at TIMESTAMPTZ,
  method TEXT DEFAULT 'totp' CHECK (method IN ('totp', 'sms', 'email'))
);

CREATE TABLE public.biometric_auth_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  authenticator_data JSONB NOT NULL,
  device_type TEXT,
  device_name TEXT,
  registered_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.device_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  device_fingerprint TEXT NOT NULL,
  device_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  location_data JSONB DEFAULT '{}'::jsonb,
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  is_trusted BOOLEAN DEFAULT false,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- PWA and Offline Functionality
CREATE TABLE public.pwa_push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.offline_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  payload JSONB NOT NULL,
  priority INTEGER DEFAULT 1,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Performance Monitoring
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'custom')),
  metric_value NUMERIC NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  device_type TEXT,
  connection_type TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.error_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  page_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  device_info JSONB DEFAULT '{}'::jsonb,
  severity TEXT DEFAULT 'error' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CDN and Caching Configuration
CREATE TABLE public.cdn_cache_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_pattern TEXT NOT NULL,
  cache_duration INTEGER NOT NULL, -- in seconds
  cache_type TEXT NOT NULL CHECK (cache_type IN ('browser', 'cdn', 'edge')),
  headers JSONB DEFAULT '{}'::jsonb,
  compression_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chatbot_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_detection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_heatmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_two_factor_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_auth_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pwa_push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cdn_cache_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- AI Chatbot Conversations
CREATE POLICY "Users can manage their own chatbot conversations" ON public.ai_chatbot_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access ai_chatbot_intents" ON public.ai_chatbot_intents
  FOR ALL USING (is_admin_user());

-- Fraud Detection
CREATE POLICY "Admin can manage fraud detection" ON public.fraud_detection_rules
  FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can view fraud logs" ON public.fraud_detection_logs
  FOR SELECT USING (is_admin_user());

-- Price Predictions
CREATE POLICY "Vendors can view their price predictions" ON public.price_predictions
  FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

-- Analytics
CREATE POLICY "Admin can view all heatmaps" ON public.user_heatmaps
  FOR SELECT USING (is_admin_user());

CREATE POLICY "Public can insert heatmap data" ON public.user_heatmaps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage conversion funnels" ON public.conversion_funnels
  FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can view conversion tracking" ON public.conversion_tracking
  FOR SELECT USING (is_admin_user());

CREATE POLICY "Public can insert conversion tracking" ON public.conversion_tracking
  FOR INSERT WITH CHECK (true);

-- Security
CREATE POLICY "Users can manage their own 2FA" ON public.user_two_factor_auth
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own biometric auth" ON public.biometric_auth_registrations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own device tracking" ON public.device_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert device tracking" ON public.device_tracking
  FOR INSERT WITH CHECK (true);

-- PWA
CREATE POLICY "Users can manage their own push subscriptions" ON public.pwa_push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sync queue" ON public.offline_sync_queue
  FOR ALL USING (auth.uid() = user_id);

-- Performance
CREATE POLICY "Admin can view performance metrics" ON public.performance_metrics
  FOR SELECT USING (is_admin_user());

CREATE POLICY "Public can insert performance metrics" ON public.performance_metrics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage error tracking" ON public.error_tracking
  FOR ALL USING (is_admin_user());

CREATE POLICY "Public can insert error tracking" ON public.error_tracking
  FOR INSERT WITH CHECK (true);

-- CDN
CREATE POLICY "Admin can manage CDN cache rules" ON public.cdn_cache_rules
  FOR ALL USING (is_admin_user());

-- Create indexes for performance
CREATE INDEX idx_ai_chatbot_conversations_user_id ON public.ai_chatbot_conversations(user_id);
CREATE INDEX idx_ai_chatbot_conversations_session_id ON public.ai_chatbot_conversations(session_id);
CREATE INDEX idx_fraud_detection_logs_user_id ON public.fraud_detection_logs(user_id);
CREATE INDEX idx_fraud_detection_logs_created_at ON public.fraud_detection_logs(created_at);
CREATE INDEX idx_price_predictions_product_id ON public.price_predictions(product_id);
CREATE INDEX idx_price_predictions_vendor_id ON public.price_predictions(vendor_id);
CREATE INDEX idx_user_heatmaps_page_url ON public.user_heatmaps(page_url);
CREATE INDEX idx_user_heatmaps_timestamp ON public.user_heatmaps(timestamp);
CREATE INDEX idx_conversion_tracking_funnel_id ON public.conversion_tracking(funnel_id);
CREATE INDEX idx_conversion_tracking_session_id ON public.conversion_tracking(session_id);
CREATE INDEX idx_device_tracking_user_id ON public.device_tracking(user_id);
CREATE INDEX idx_device_tracking_fingerprint ON public.device_tracking(device_fingerprint);
CREATE INDEX idx_performance_metrics_page_url ON public.performance_metrics(page_url);
CREATE INDEX idx_performance_metrics_timestamp ON public.performance_metrics(timestamp);

-- Add updated_at triggers
CREATE TRIGGER update_ai_chatbot_conversations_updated_at
  BEFORE UPDATE ON public.ai_chatbot_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_chatbot_intents_updated_at
  BEFORE UPDATE ON public.ai_chatbot_intents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fraud_detection_rules_updated_at
  BEFORE UPDATE ON public.fraud_detection_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversion_funnels_updated_at
  BEFORE UPDATE ON public.conversion_funnels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cdn_cache_rules_updated_at
  BEFORE UPDATE ON public.cdn_cache_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();