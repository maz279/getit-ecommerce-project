
-- Create missing tables for the ecommerce platform

-- Cart items table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Wishlist items table
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- User sessions for tracking behavior
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours')
);

-- User behavior tracking for ML services
CREATE TABLE public.user_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Search queries for analytics
CREATE TABLE public.search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  clicked_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product reviews
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- ML recommendations cache
CREATE TABLE public.ml_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]',
  confidence_score NUMERIC(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '1 hour')
);

-- Churn predictions
CREATE TABLE public.churn_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  churn_probability NUMERIC(5,4) NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  factors JSONB DEFAULT '{}',
  retention_strategies JSONB DEFAULT '[]',
  prediction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, prediction_date)
);

-- Search index for full-text search
CREATE TABLE public.search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  searchable_content TSVECTOR,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(item_id, item_type)
);

-- Create indexes for better performance
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_wishlist_items_user_id ON public.wishlist_items(user_id);
CREATE INDEX idx_user_behaviors_user_id ON public.user_behaviors(user_id);
CREATE INDEX idx_user_behaviors_event_type ON public.user_behaviors(event_type);
CREATE INDEX idx_user_behaviors_created_at ON public.user_behaviors(created_at);
CREATE INDEX idx_search_queries_user_id ON public.search_queries(user_id);
CREATE INDEX idx_search_queries_created_at ON public.search_queries(created_at);
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX idx_ml_recommendations_user_id ON public.ml_recommendations(user_id);
CREATE INDEX idx_ml_recommendations_expires_at ON public.ml_recommendations(expires_at);
CREATE INDEX idx_churn_predictions_user_id ON public.churn_predictions(user_id);
CREATE INDEX idx_churn_predictions_risk_level ON public.churn_predictions(risk_level);
CREATE INDEX idx_search_index_searchable_content ON public.search_index USING gin(searchable_content);
CREATE INDEX idx_search_index_item_type ON public.search_index(item_type);

-- Enable Row Level Security
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churn_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_index ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items
CREATE POLICY "Users can manage their own cart items" 
  ON public.cart_items 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for wishlist_items
CREATE POLICY "Users can manage their own wishlist items" 
  ON public.wishlist_items 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- RLS Policies for user_behaviors
CREATE POLICY "Users can view their own behavior data" 
  ON public.user_behaviors 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- RLS Policies for search_queries
CREATE POLICY "Users can view their own search queries" 
  ON public.search_queries 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- RLS Policies for product_reviews
CREATE POLICY "Anyone can view product reviews" 
  ON public.product_reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own reviews" 
  ON public.product_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.product_reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.product_reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for ml_recommendations
CREATE POLICY "Users can view their own ML recommendations" 
  ON public.ml_recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- RLS Policies for churn_predictions
CREATE POLICY "Users can view their own churn predictions" 
  ON public.churn_predictions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- RLS Policies for search_index (public read access)
CREATE POLICY "Anyone can search the index" 
  ON public.search_index 
  FOR SELECT 
  USING (true);

-- Function to update search index tsvector
CREATE OR REPLACE FUNCTION update_search_tsvector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.searchable_content := setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
                           setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search tsvector
CREATE TRIGGER update_search_index_tsvector
  BEFORE INSERT OR UPDATE ON public.search_index
  FOR EACH ROW EXECUTE FUNCTION update_search_tsvector();

-- Function to clean expired data
CREATE OR REPLACE FUNCTION clean_expired_data()
RETURNS void AS $$
BEGIN
  -- Clean expired user sessions
  DELETE FROM public.user_sessions WHERE expires_at < now();
  
  -- Clean expired ML recommendations
  DELETE FROM public.ml_recommendations WHERE expires_at < now();
  
  -- Clean old user behavior data (older than 6 months)
  DELETE FROM public.user_behaviors WHERE created_at < now() - INTERVAL '6 months';
  
  -- Clean old search queries (older than 3 months)
  DELETE FROM public.search_queries WHERE created_at < now() - INTERVAL '3 months';
END;
$$ LANGUAGE plpgsql;
