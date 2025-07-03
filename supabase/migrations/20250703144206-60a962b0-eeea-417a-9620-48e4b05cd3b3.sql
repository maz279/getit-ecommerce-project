-- Enhanced Search Service Infrastructure
-- Create comprehensive search and recommendation tables

-- 1. Enhanced search configurations
CREATE TABLE IF NOT EXISTS public.search_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_type TEXT NOT NULL, -- 'elasticsearch', 'bangla', 'visual', 'recommendation'
    config_name TEXT NOT NULL,
    config_data JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Bangla language processing
CREATE TABLE IF NOT EXISTS public.bangla_language_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_type TEXT NOT NULL, -- 'synonym', 'stem', 'phonetic', 'stop_word'
    bangla_word TEXT NOT NULL,
    english_equivalent TEXT,
    phonetic_mapping TEXT,
    word_frequency INTEGER DEFAULT 0,
    context_tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Visual search features
CREATE TABLE IF NOT EXISTS public.visual_search_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    feature_vector NUMERIC[] NOT NULL,
    color_histogram JSONB,
    shape_descriptors JSONB,
    deep_features JSONB,
    extraction_model TEXT DEFAULT 'resnet50',
    confidence_score NUMERIC(5,4) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. User search profiles for personalization
CREATE TABLE IF NOT EXISTS public.user_search_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    search_preferences JSONB DEFAULT '{}',
    category_preferences JSONB DEFAULT '{}',
    price_preferences JSONB DEFAULT '{}',
    brand_preferences JSONB DEFAULT '{}',
    language_preference TEXT DEFAULT 'english',
    cultural_context JSONB DEFAULT '{}',
    search_frequency INTEGER DEFAULT 0,
    last_search_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Advanced recommendation models
CREATE TABLE IF NOT EXISTS public.recommendation_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT UNIQUE NOT NULL,
    model_type TEXT NOT NULL, -- 'collaborative', 'content_based', 'hybrid', 'deep_learning'
    algorithm_config JSONB NOT NULL DEFAULT '{}',
    training_data_size INTEGER DEFAULT 0,
    accuracy_score NUMERIC(5,4) DEFAULT 0.0,
    last_trained_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    model_version TEXT DEFAULT '1.0',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Search suggestions and autocomplete
CREATE TABLE IF NOT EXISTS public.search_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suggestion_text TEXT NOT NULL,
    suggestion_type TEXT NOT NULL, -- 'product', 'category', 'brand', 'query'
    language TEXT DEFAULT 'english',
    frequency_score INTEGER DEFAULT 1,
    conversion_rate NUMERIC(5,4) DEFAULT 0.0,
    related_products UUID[],
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Search analytics aggregation
CREATE TABLE IF NOT EXISTS public.search_analytics_aggregated (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_period DATE NOT NULL,
    period_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
    total_searches INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    successful_searches INTEGER DEFAULT 0,
    zero_result_searches INTEGER DEFAULT 0,
    average_results_per_search NUMERIC(10,2) DEFAULT 0.0,
    top_search_terms JSONB DEFAULT '[]',
    top_categories JSONB DEFAULT '[]',
    conversion_metrics JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Cultural and festival context
CREATE TABLE IF NOT EXISTS public.cultural_search_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_type TEXT NOT NULL, -- 'festival', 'season', 'regional', 'traditional'
    context_name TEXT NOT NULL,
    date_range DATERANGE,
    boost_categories TEXT[],
    boost_keywords TEXT[],
    cultural_metadata JSONB DEFAULT '{}',
    boost_factor NUMERIC(3,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_search_configurations_type ON public.search_configurations(config_type);
CREATE INDEX IF NOT EXISTS idx_bangla_language_word_type ON public.bangla_language_data(word_type);
CREATE INDEX IF NOT EXISTS idx_bangla_language_bangla_word ON public.bangla_language_data(bangla_word);
CREATE INDEX IF NOT EXISTS idx_visual_search_product ON public.visual_search_features(product_id);
CREATE INDEX IF NOT EXISTS idx_user_search_profiles_user ON public.user_search_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_models_type ON public.recommendation_models(model_type, is_active);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_text ON public.search_suggestions(suggestion_text);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_type ON public.search_suggestions(suggestion_type, language);
CREATE INDEX IF NOT EXISTS idx_search_analytics_date ON public.search_analytics_aggregated(date_period, period_type);
CREATE INDEX IF NOT EXISTS idx_cultural_context_type ON public.cultural_search_context(context_type, is_active);