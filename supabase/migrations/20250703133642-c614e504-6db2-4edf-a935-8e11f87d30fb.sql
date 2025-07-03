-- Product Service - Enhanced Database Schema (excluding existing dynamic_pricing_rules)

-- Enhanced Categories with Hierarchy Support
CREATE TABLE public.product_categories_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.product_categories_enhanced(id),
    name TEXT NOT NULL,
    name_bn TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    description_bn TEXT,
    category_path TEXT NOT NULL, -- For hierarchical queries
    level INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    bangladesh_specific BOOLEAN DEFAULT false,
    traditional_category BOOLEAN DEFAULT false,
    seasonal_category BOOLEAN DEFAULT false,
    festival_category TEXT, -- 'eid', 'puja', 'pohela_boishakh'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bangladesh-Specific Product Attributes
CREATE TABLE public.product_attributes_bd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    traditional_size TEXT, -- 'S', 'M', 'L', 'XL', 'XXL' (BD sizing)
    local_measurements JSONB, -- {"chest": "42 inch", "length": "45 inch"}
    material_type TEXT, -- 'cotton', 'silk', 'jute', 'khadi'
    origin_tag TEXT DEFAULT 'Made in Bangladesh',
    traditional_colors JSONB, -- Bengali color names
    festival_suitable TEXT[], -- ['eid', 'puja', 'wedding']
    regional_variant TEXT, -- 'dhaka', 'chittagong', 'sylhet'
    handicraft_type TEXT, -- 'nakshi_kantha', 'jamdani', 'muslin'
    artisan_info JSONB, -- {"name": "artisan", "region": "location"}
    certification JSONB, -- {"organic": true, "fair_trade": true}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Search Configuration
CREATE TABLE public.product_search_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_type TEXT NOT NULL, -- 'bangla', 'english', 'phonetic', 'mixed'
    analyzer_config JSONB NOT NULL,
    synonym_groups JSONB, -- {"laptop": ["computer", "notebook"]}
    stopwords TEXT[],
    phonetic_mappings JSONB, -- English phonetics for Bangla words
    boost_settings JSONB, -- Field boost weights
    filter_config JSONB, -- Available filters configuration
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inventory Automation Rules
CREATE TABLE public.inventory_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    vendor_id UUID,
    auto_reorder_enabled BOOLEAN DEFAULT false,
    reorder_point INTEGER NOT NULL,
    reorder_quantity INTEGER NOT NULL,
    max_stock_level INTEGER,
    safety_stock INTEGER DEFAULT 0,
    lead_time_days INTEGER DEFAULT 7,
    seasonal_multipliers JSONB, -- {"winter": 1.5, "summer": 0.8}
    demand_forecast JSONB, -- ML predictions
    last_reorder_date DATE,
    next_predicted_reorder DATE,
    supplier_info JSONB,
    cost_thresholds JSONB, -- Price change alerts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product Media Management  
CREATE TABLE public.product_media_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL, -- 'image', 'video', '360_view', 'ar_model'
    original_url TEXT NOT NULL,
    optimized_urls JSONB, -- {"thumbnail": "url", "medium": "url", "large": "url"}
    alt_text TEXT,
    alt_text_bn TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    cdn_urls JSONB, -- Multiple CDN endpoints
    processing_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    metadata JSONB, -- {"size": "1920x1080", "format": "webp"}
    watermark_applied BOOLEAN DEFAULT false,
    seo_filename TEXT,
    accessibility_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bulk Upload Management
CREATE TABLE public.bulk_upload_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    session_type TEXT NOT NULL, -- 'product_import', 'inventory_update', 'category_import'
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_log JSONB,
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    template_version TEXT,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product Performance Analytics
CREATE TABLE public.product_analytics_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    vendor_id UUID,
    analytics_date DATE NOT NULL,
    analytics_period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
    views_count INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    add_to_cart_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    wishlist_additions INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    average_rating NUMERIC(3,2),
    conversion_rate NUMERIC(5,4),
    bounce_rate NUMERIC(5,4),
    revenue_generated NUMERIC(12,2) DEFAULT 0,
    search_rank_average NUMERIC(5,2),
    competitor_price_analysis JSONB,
    seasonal_performance JSONB,
    geographic_performance JSONB, -- By division/district
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product Recommendation Engine Enhanced
CREATE TABLE public.recommendation_models_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT NOT NULL,
    model_type TEXT NOT NULL, -- 'collaborative', 'content_based', 'hybrid', 'ml_ensemble'
    algorithm_config JSONB NOT NULL,
    training_data_config JSONB,
    feature_weights JSONB,
    performance_metrics JSONB,
    bangladesh_context_weights JSONB, -- Local preferences
    seasonal_adjustments JSONB,
    demographic_factors JSONB,
    is_active BOOLEAN DEFAULT true,
    model_version TEXT NOT NULL,
    last_trained_at TIMESTAMP WITH TIME ZONE,
    next_training_scheduled TIMESTAMP WITH TIME ZONE,
    accuracy_score NUMERIC(4,3),
    precision_score NUMERIC(4,3),
    recall_score NUMERIC(4,3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.product_categories_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes_bd ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_search_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analytics_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_models_enhanced ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active categories" ON public.product_categories_enhanced
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage categories" ON public.product_categories_enhanced
    FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can view their product attributes" ON public.product_attributes_bd
    FOR SELECT USING (
        product_id IN (SELECT id FROM public.products WHERE vendor_id = auth.uid())
        OR is_admin_user()
    );

CREATE POLICY "Vendors can manage their product attributes" ON public.product_attributes_bd
    FOR ALL USING (
        product_id IN (SELECT id FROM public.products WHERE vendor_id = auth.uid())
        OR is_admin_user()
    );

CREATE POLICY "Public can view search config" ON public.product_search_config
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage search config" ON public.product_search_config
    FOR ALL USING (is_admin_user());

CREATE POLICY "Vendors can manage their inventory rules" ON public.inventory_automation_rules
    FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can manage their product media" ON public.product_media_enhanced
    FOR ALL USING (
        product_id IN (SELECT id FROM public.products WHERE vendor_id = auth.uid())
        OR is_admin_user()
    );

CREATE POLICY "Vendors can view their bulk upload sessions" ON public.bulk_upload_sessions
    FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Vendors can view their product analytics" ON public.product_analytics_enhanced
    FOR SELECT USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Admin can manage all analytics" ON public.product_analytics_enhanced
    FOR ALL USING (is_admin_user());

CREATE POLICY "Admin can manage recommendation models" ON public.recommendation_models_enhanced
    FOR ALL USING (is_admin_user());

-- Indexes for Performance
CREATE INDEX idx_categories_enhanced_parent_id ON public.product_categories_enhanced(parent_id);
CREATE INDEX idx_categories_enhanced_path ON public.product_categories_enhanced USING GIN(to_tsvector('english', category_path));
CREATE INDEX idx_categories_enhanced_bangladesh ON public.product_categories_enhanced(bangladesh_specific) WHERE bangladesh_specific = true;

CREATE INDEX idx_product_attributes_bd_product_id ON public.product_attributes_bd(product_id);
CREATE INDEX idx_product_attributes_bd_material ON public.product_attributes_bd(material_type);
CREATE INDEX idx_product_attributes_bd_festival ON public.product_attributes_bd USING GIN(festival_suitable);

CREATE INDEX idx_inventory_automation_product_id ON public.inventory_automation_rules(product_id);
CREATE INDEX idx_inventory_automation_vendor_id ON public.inventory_automation_rules(vendor_id);
CREATE INDEX idx_inventory_automation_reorder ON public.inventory_automation_rules(next_predicted_reorder) WHERE auto_reorder_enabled = true;

CREATE INDEX idx_product_media_enhanced_product_id ON public.product_media_enhanced(product_id);
CREATE INDEX idx_product_media_enhanced_type ON public.product_media_enhanced(media_type);
CREATE INDEX idx_product_media_enhanced_primary ON public.product_media_enhanced(is_primary) WHERE is_primary = true;

CREATE INDEX idx_bulk_upload_sessions_vendor_id ON public.bulk_upload_sessions(vendor_id);
CREATE INDEX idx_bulk_upload_sessions_status ON public.bulk_upload_sessions(status);

CREATE INDEX idx_product_analytics_enhanced_product_date ON public.product_analytics_enhanced(product_id, analytics_date);
CREATE INDEX idx_product_analytics_enhanced_vendor_period ON public.product_analytics_enhanced(vendor_id, analytics_period);

CREATE INDEX idx_recommendation_models_enhanced_active ON public.recommendation_models_enhanced(is_active, model_type) WHERE is_active = true;