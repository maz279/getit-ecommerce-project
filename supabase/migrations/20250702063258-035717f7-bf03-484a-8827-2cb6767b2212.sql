-- Phase 2: Create missing AI/ML tables only

-- User Behavior Tracking for ML (if not exists)
CREATE TABLE IF NOT EXISTS public.user_behaviors (
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

-- ML Recommendations Cache (if not exists)
CREATE TABLE IF NOT EXISTS public.ml_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('product', 'vendor', 'cross_sell', 'upsell')),
  recommendations JSONB NOT NULL DEFAULT '[]',
  confidence_score NUMERIC(3,2),
  model_version TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Search Query Analytics (if not exists)
CREATE TABLE IF NOT EXISTS public.search_queries (
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

-- Customer Journey Analytics (if not exists)
CREATE TABLE IF NOT EXISTS public.customer_journey_analytics (
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

-- Create indexes only if tables are new
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_behaviors_user_id') THEN
    CREATE INDEX idx_user_behaviors_user_id ON public.user_behaviors(user_id);
    CREATE INDEX idx_user_behaviors_timestamp ON public.user_behaviors(timestamp);
    CREATE INDEX idx_user_behaviors_event_type ON public.user_behaviors(event_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ml_recommendations_user_id') THEN
    CREATE INDEX idx_ml_recommendations_user_id ON public.ml_recommendations(user_id);
    CREATE INDEX idx_ml_recommendations_type ON public.ml_recommendations(recommendation_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_search_queries_user_id') THEN
    CREATE INDEX idx_search_queries_user_id ON public.search_queries(user_id);
    CREATE INDEX idx_search_queries_created_at ON public.search_queries(created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_customer_journey_customer_id') THEN
    CREATE INDEX idx_customer_journey_customer_id ON public.customer_journey_analytics(customer_id);
  END IF;
END
$$;

-- Enable RLS on new tables
ALTER TABLE public.user_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_journey_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
DROP POLICY IF EXISTS "Users can view their behaviors" ON public.user_behaviors;
CREATE POLICY "Users can view their behaviors" ON public.user_behaviors FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their recommendations" ON public.ml_recommendations;
CREATE POLICY "Users can view their recommendations" ON public.ml_recommendations FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their search queries" ON public.search_queries;
CREATE POLICY "Users can view their search queries" ON public.search_queries FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their journey analytics" ON public.customer_journey_analytics;
CREATE POLICY "Users can view their journey analytics" ON public.customer_journey_analytics FOR SELECT TO authenticated USING (auth.uid() = customer_id);

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_ml_recommendations_updated_at ON public.ml_recommendations;
CREATE TRIGGER update_ml_recommendations_updated_at BEFORE UPDATE ON public.ml_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_journey_updated_at ON public.customer_journey_analytics;
CREATE TRIGGER update_customer_journey_updated_at BEFORE UPDATE ON public.customer_journey_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();