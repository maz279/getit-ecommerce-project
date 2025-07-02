-- Create Dynamic Pricing Engine Tables
CREATE TABLE public.dynamic_pricing_models (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    model_name TEXT NOT NULL,
    model_type TEXT NOT NULL, -- competitor_based, demand_based, ai_driven, time_based
    target_margin NUMERIC DEFAULT 15.0,
    min_margin NUMERIC DEFAULT 5.0,
    max_price_change_percent NUMERIC DEFAULT 20.0,
    pricing_frequency TEXT DEFAULT 'hourly', -- hourly, daily, weekly
    is_active BOOLEAN DEFAULT true,
    configuration JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.competitor_price_tracking (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID,
    competitor_name TEXT NOT NULL,
    competitor_url TEXT,
    competitor_price NUMERIC NOT NULL,
    competitor_availability BOOLEAN DEFAULT true,
    tracking_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    price_change_amount NUMERIC,
    price_change_percentage NUMERIC,
    data_source TEXT DEFAULT 'scraper',
    confidence_score NUMERIC DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.demand_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID,
    view_count INTEGER DEFAULT 0,
    cart_additions INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    search_frequency INTEGER DEFAULT 0,
    wishlist_additions INTEGER DEFAULT 0,
    conversion_rate NUMERIC DEFAULT 0,
    demand_score NUMERIC DEFAULT 0,
    demand_trend TEXT DEFAULT 'stable', -- increasing, decreasing, stable, volatile
    analytics_date DATE DEFAULT CURRENT_DATE,
    time_period TEXT DEFAULT 'daily', -- hourly, daily, weekly, monthly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.price_optimization_results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID,
    current_price NUMERIC NOT NULL,
    suggested_price NUMERIC NOT NULL,
    optimization_reason TEXT NOT NULL,
    confidence_score NUMERIC DEFAULT 0,
    expected_revenue_impact NUMERIC,
    expected_conversion_impact NUMERIC,
    pricing_model_id UUID REFERENCES public.dynamic_pricing_models(id),
    competitor_price_factor NUMERIC,
    demand_factor NUMERIC,
    inventory_factor NUMERIC,
    seasonality_factor NUMERIC,
    approved_by UUID,
    applied_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending', -- pending, approved, applied, rejected, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advanced Search & Discovery Tables
CREATE TABLE public.search_personalization (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    search_preferences JSONB NOT NULL DEFAULT '{}',
    category_weights JSONB NOT NULL DEFAULT '{}',
    brand_preferences JSONB NOT NULL DEFAULT '{}',
    price_sensitivity NUMERIC DEFAULT 0.5,
    quality_preference NUMERIC DEFAULT 0.5,
    personalization_score NUMERIC DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.semantic_search_vectors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL, -- product, category, brand, description
    vector_embedding TEXT, -- JSON string representation for now
    content_text TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    model_version TEXT DEFAULT 'text-embedding-ada-002',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.visual_search_index (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID,
    image_url TEXT NOT NULL,
    image_hash TEXT NOT NULL,
    visual_features JSONB NOT NULL DEFAULT '{}',
    color_palette JSONB NOT NULL DEFAULT '{}',
    style_tags JSONB NOT NULL DEFAULT '[]',
    category_predictions JSONB NOT NULL DEFAULT '{}',
    similarity_vectors TEXT, -- JSON string representation for now
    processing_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.search_result_optimization (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    search_query TEXT NOT NULL,
    user_id UUID,
    session_id TEXT,
    results_shown JSONB NOT NULL DEFAULT '[]',
    clicked_results JSONB NOT NULL DEFAULT '[]',
    purchased_results JSONB NOT NULL DEFAULT '[]',
    search_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    optimization_score NUMERIC DEFAULT 0,
    relevance_feedback JSONB,
    personalization_applied BOOLEAN DEFAULT false,
    geo_location JSONB,
    device_type TEXT,
    result_ranking_algorithm TEXT DEFAULT 'default'
);

-- Multi-region Infrastructure Tables
CREATE TABLE public.geo_regions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    region_code TEXT NOT NULL UNIQUE,
    region_name TEXT NOT NULL,
    country_code TEXT NOT NULL,
    continent TEXT NOT NULL,
    currency_code TEXT NOT NULL DEFAULT 'BDT',
    timezone TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    primary_language TEXT DEFAULT 'en',
    supported_languages JSONB NOT NULL DEFAULT '["en", "bn"]',
    regulatory_requirements JSONB NOT NULL DEFAULT '{}',
    tax_configuration JSONB NOT NULL DEFAULT '{}',
    shipping_zones JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.content_localization (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL, -- product, category, ui_text, legal
    content_id TEXT NOT NULL,
    region_id UUID REFERENCES public.geo_regions(id),
    language_code TEXT NOT NULL,
    original_content JSONB NOT NULL,
    localized_content JSONB NOT NULL,
    translation_status TEXT DEFAULT 'pending', -- pending, approved, rejected
    translation_confidence NUMERIC DEFAULT 0,
    human_reviewed BOOLEAN DEFAULT false,
    reviewer_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.regional_inventory (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID,
    region_id UUID REFERENCES public.geo_regions(id),
    warehouse_id UUID,
    current_stock INTEGER NOT NULL DEFAULT 0,
    reserved_stock INTEGER NOT NULL DEFAULT 0,
    available_stock INTEGER GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
    reorder_point INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    lead_time_days INTEGER DEFAULT 7,
    regional_pricing JSONB NOT NULL DEFAULT '{}',
    shipping_options JSONB NOT NULL DEFAULT '[]',
    last_restocked TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_competitor_price_tracking_product ON public.competitor_price_tracking(product_id);
CREATE INDEX idx_competitor_price_tracking_date ON public.competitor_price_tracking(tracking_date DESC);
CREATE INDEX idx_demand_analytics_product_date ON public.demand_analytics(product_id, analytics_date DESC);
CREATE INDEX idx_price_optimization_product ON public.price_optimization_results(product_id);
CREATE INDEX idx_price_optimization_status ON public.price_optimization_results(status);
CREATE INDEX idx_search_personalization_user ON public.search_personalization(user_id);
CREATE INDEX idx_semantic_search_content ON public.semantic_search_vectors(content_id, content_type);
CREATE INDEX idx_visual_search_product ON public.visual_search_index(product_id);
CREATE INDEX idx_search_result_query ON public.search_result_optimization(search_query);
CREATE INDEX idx_content_localization_region ON public.content_localization(region_id, language_code);
CREATE INDEX idx_regional_inventory_product_region ON public.regional_inventory(product_id, region_id);

-- RLS Policies
ALTER TABLE public.dynamic_pricing_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_price_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_optimization_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_personalization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semantic_search_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visual_search_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_result_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_localization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage dynamic pricing models" ON public.dynamic_pricing_models FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can view competitor price tracking" ON public.competitor_price_tracking FOR SELECT USING (is_admin_user());
CREATE POLICY "Admin can view demand analytics" ON public.demand_analytics FOR SELECT USING (is_admin_user());
CREATE POLICY "Admin can manage price optimization" ON public.price_optimization_results FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their search personalization" ON public.search_personalization FOR ALL USING (auth.uid() = user_id OR is_admin_user());
CREATE POLICY "Public can read semantic search vectors" ON public.semantic_search_vectors FOR SELECT USING (true);
CREATE POLICY "Public can read visual search index" ON public.visual_search_index FOR SELECT USING (true);
CREATE POLICY "Users can view their search results" ON public.search_result_optimization FOR SELECT USING (auth.uid() = user_id OR is_admin_user());
CREATE POLICY "Public can read geo regions" ON public.geo_regions FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage geo regions" ON public.geo_regions FOR ALL USING (is_admin_user());
CREATE POLICY "Public can read content localization" ON public.content_localization FOR SELECT USING (true);
CREATE POLICY "Admin can manage content localization" ON public.content_localization FOR ALL USING (is_admin_user());
CREATE POLICY "Public can read regional inventory" ON public.regional_inventory FOR SELECT USING (true);
CREATE POLICY "Admin can manage regional inventory" ON public.regional_inventory FOR ALL USING (is_admin_user());

-- Triggers for updated_at
CREATE TRIGGER update_dynamic_pricing_models_updated_at BEFORE UPDATE ON public.dynamic_pricing_models FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_semantic_search_vectors_updated_at BEFORE UPDATE ON public.semantic_search_vectors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visual_search_index_updated_at BEFORE UPDATE ON public.visual_search_index FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_localization_updated_at BEFORE UPDATE ON public.content_localization FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_regional_inventory_updated_at BEFORE UPDATE ON public.regional_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default geo regions and pricing models
INSERT INTO public.geo_regions (region_code, region_name, country_code, continent, currency_code, timezone, regulatory_requirements) VALUES
('BD-DH', 'Dhaka Division', 'BD', 'Asia', 'BDT', 'Asia/Dhaka', '{"data_localization": true, "tax_rate": 15, "vat_rate": 7.5}'),
('BD-CH', 'Chittagong Division', 'BD', 'Asia', 'BDT', 'Asia/Dhaka', '{"data_localization": true, "tax_rate": 15, "vat_rate": 7.5}'),
('BD-SY', 'Sylhet Division', 'BD', 'Asia', 'BDT', 'Asia/Dhaka', '{"data_localization": true, "tax_rate": 15, "vat_rate": 7.5}'),
('BD-RJ', 'Rajshahi Division', 'BD', 'Asia', 'BDT', 'Asia/Dhaka', '{"data_localization": true, "tax_rate": 15, "vat_rate": 7.5}'),
('BD-KH', 'Khulna Division', 'BD', 'Asia', 'BDT', 'Asia/Dhaka', '{"data_localization": true, "tax_rate": 15, "vat_rate": 7.5}'),
('BD-BA', 'Barisal Division', 'BD', 'Asia', 'BDT', 'Asia/Dhaka', '{"data_localization": true, "tax_rate": 15, "vat_rate": 7.5}'),
('BD-RA', 'Rangpur Division', 'BD', 'Asia', 'BDT', 'Asia/Dhaka', '{"data_localization": true, "tax_rate": 15, "vat_rate": 7.5}'),
('BD-MY', 'Mymensingh Division', 'BD', 'Asia', 'BDT', 'Asia/Dhaka', '{"data_localization": true, "tax_rate": 15, "vat_rate": 7.5}');

INSERT INTO public.dynamic_pricing_models (model_name, model_type, configuration) VALUES
('Competitor-Based Pricing', 'competitor_based', '{"update_frequency": "daily", "competitor_weight": 0.6, "cost_plus_weight": 0.4, "max_price_variance": 15}'),
('AI Demand Pricing', 'ai_driven', '{"ml_model": "demand_forecasting", "features": ["views", "searches", "seasonality", "inventory"], "update_frequency": "hourly"}'),
('Time-Based Dynamic', 'time_based', '{"peak_hours": [12, 13, 19, 20, 21], "peak_multiplier": 1.1, "off_peak_multiplier": 0.95, "weekend_adjustment": 1.05}'),
('Inventory-Based Pricing', 'demand_based', '{"low_stock_threshold": 10, "low_stock_multiplier": 1.2, "high_stock_threshold": 100, "high_stock_multiplier": 0.9}');