-- Phase 2: AI/ML Features Database Schema

-- AI Recommendation Models and Settings
CREATE TABLE public.ai_recommendation_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('collaborative_filtering', 'content_based', 'hybrid', 'deep_learning')),
  version TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  model_config JSONB NOT NULL DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  last_trained TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Behavior Tracking for ML
CREATE TABLE public.user_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  product_id UUID,
  category_id UUID,
  vendor_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  device_info JSONB DEFAULT '{}',
  location_data JSONB DEFAULT '{}'
);

-- ML Recommendations Cache
CREATE TABLE public.ml_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('product', 'vendor', 'cross_sell', 'upsell')),
  recommendations JSONB NOT NULL DEFAULT '[]',
  confidence_score NUMERIC(3,2),
  model_version TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Search Cache and Analytics
CREATE TABLE public.ai_search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT UNIQUE NOT NULL,
  original_query TEXT NOT NULL,
  enhanced_query TEXT NOT NULL,
  semantic_tokens JSONB DEFAULT '[]',
  ai_suggestions JSONB NOT NULL DEFAULT '[]',
  usage_count INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Search Query Analytics
CREATE TABLE public.search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  query_type TEXT DEFAULT 'text' CHECK (query_type IN ('text', 'voice', 'image', 'semantic')),
  results_count INTEGER DEFAULT 0,
  clicked_result_ids JSONB DEFAULT '[]',
  session_id TEXT,
  search_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time Metrics and Events
CREATE TABLE public.real_time_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID,
  metric_type TEXT NOT NULL,
  metric_key TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Chatbot Conversations
CREATE TABLE public.ai_chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  conversation_data JSONB NOT NULL DEFAULT '[]',
  context_data JSONB DEFAULT '{}',
  sentiment_score NUMERIC(3,2),
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Chatbot Intents and Training Data
CREATE TABLE public.ai_chatbot_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_name TEXT NOT NULL,
  training_data JSONB NOT NULL DEFAULT '[]',
  response_templates JSONB NOT NULL DEFAULT '[]',
  confidence_threshold NUMERIC(3,2) DEFAULT 0.8,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ML Sales Forecasts
CREATE TABLE public.ai_sales_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID,
  product_id UUID,
  forecast_date DATE NOT NULL,
  forecast_period TEXT NOT NULL CHECK (forecast_period IN ('daily', 'weekly', 'monthly', 'quarterly')),
  predicted_sales NUMERIC(15,2) NOT NULL,
  predicted_units INTEGER NOT NULL,
  confidence_interval JSONB NOT NULL DEFAULT '{}',
  seasonality_factors JSONB DEFAULT '{}',
  algorithm_used TEXT NOT NULL,
  model_accuracy NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer Journey Analytics
CREATE TABLE public.customer_journey_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  journey_start DATE NOT NULL,
  current_stage_id TEXT,
  total_interactions INTEGER DEFAULT 0,
  conversion_events JSONB DEFAULT '[]',
  touchpoints JSONB DEFAULT '[]',
  last_interaction TIMESTAMP WITH TIME ZONE,
  journey_status TEXT DEFAULT 'active' CHECK (journey_status IN ('active', 'converted', 'churned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(customer_id)
);

-- AI Insights and Predictions
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL CHECK (insight_type IN ('sales_prediction', 'churn_risk', 'market_trend', 'inventory_optimization')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score NUMERIC(3,2) NOT NULL,
  impact_level TEXT NOT NULL CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
  actionable_recommendations JSONB DEFAULT '[]',
  related_entities JSONB DEFAULT '{}',
  business_value_estimate NUMERIC(15,2),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'acted_upon', 'dismissed')),
  generated_by TEXT NOT NULL,
  insight_data JSONB NOT NULL DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for Performance
CREATE INDEX idx_user_behaviors_user_id ON public.user_behaviors(user_id);
CREATE INDEX idx_user_behaviors_timestamp ON public.user_behaviors(timestamp);
CREATE INDEX idx_user_behaviors_event_type ON public.user_behaviors(event_type);
CREATE INDEX idx_ml_recommendations_user_id ON public.ml_recommendations(user_id);
CREATE INDEX idx_ml_recommendations_type ON public.ml_recommendations(recommendation_type);
CREATE INDEX idx_ai_search_cache_query_hash ON public.ai_search_cache(query_hash);
CREATE INDEX idx_search_queries_user_id ON public.search_queries(user_id);
CREATE INDEX idx_search_queries_created_at ON public.search_queries(created_at);
CREATE INDEX idx_real_time_metrics_vendor_id ON public.real_time_metrics(vendor_id);
CREATE INDEX idx_real_time_metrics_timestamp ON public.real_time_metrics(timestamp);
CREATE INDEX idx_chatbot_conversations_user_id ON public.ai_chatbot_conversations(user_id);
CREATE INDEX idx_chatbot_conversations_session_id ON public.ai_chatbot_conversations(session_id);
CREATE INDEX idx_sales_forecasts_vendor_id ON public.ai_sales_forecasts(vendor_id);
CREATE INDEX idx_sales_forecasts_date ON public.ai_sales_forecasts(forecast_date);
CREATE INDEX idx_customer_journey_customer_id ON public.customer_journey_analytics(customer_id);
CREATE INDEX idx_ai_insights_type ON public.ai_insights(insight_type);
CREATE INDEX idx_ai_insights_status ON public.ai_insights(status);

-- RLS Policies
ALTER TABLE public.ai_recommendation_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chatbot_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sales_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_journey_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admin full access ai_recommendation_models" ON public.ai_recommendation_models FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin full access ai_chatbot_intents" ON public.ai_chatbot_intents FOR ALL TO authenticated USING (is_admin_user());
CREATE POLICY "Admin can view AI insights" ON public.ai_insights FOR SELECT TO authenticated USING (is_admin_user());

-- User-specific policies
CREATE POLICY "Users can view their behaviors" ON public.user_behaviors FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their recommendations" ON public.ml_recommendations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their search queries" ON public.search_queries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own chatbot conversations" ON public.ai_chatbot_conversations FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their journey analytics" ON public.customer_journey_analytics FOR SELECT TO authenticated USING (auth.uid() = customer_id);

-- Public read policies
CREATE POLICY "Public can read AI search cache" ON public.ai_search_cache FOR SELECT TO authenticated USING (true);

-- Vendor policies
CREATE POLICY "Vendors can view their AI sales forecasts" ON public.ai_sales_forecasts FOR SELECT TO authenticated USING (vendor_id = auth.uid() OR is_admin_user());
CREATE POLICY "Vendors can view their metrics" ON public.real_time_metrics FOR SELECT TO authenticated USING (vendor_id = auth.uid() OR is_admin_user());

-- Triggers for updated_at
CREATE TRIGGER update_ai_recommendation_models_updated_at BEFORE UPDATE ON public.ai_recommendation_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ml_recommendations_updated_at BEFORE UPDATE ON public.ml_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_search_cache_updated_at BEFORE UPDATE ON public.ai_search_cache FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chatbot_conversations_updated_at BEFORE UPDATE ON public.ai_chatbot_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_forecasts_updated_at BEFORE UPDATE ON public.ai_sales_forecasts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_journey_updated_at BEFORE UPDATE ON public.customer_journey_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Customer journey analytics trigger
CREATE OR REPLACE FUNCTION update_journey_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update customer journey analytics when events are added
  INSERT INTO public.customer_journey_analytics (
    customer_id, 
    journey_start, 
    current_stage_id,
    total_interactions,
    last_interaction
  ) VALUES (
    NEW.customer_id,
    CURRENT_DATE,
    NEW.stage_id,
    1,
    NEW.timestamp
  )
  ON CONFLICT (customer_id) DO UPDATE SET
    current_stage_id = NEW.stage_id,
    total_interactions = customer_journey_analytics.total_interactions + 1,
    last_interaction = NEW.timestamp,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;