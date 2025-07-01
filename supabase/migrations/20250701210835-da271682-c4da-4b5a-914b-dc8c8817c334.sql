-- Enhanced UX Features Database Schema (Fixed)

-- Product comparison table
CREATE TABLE IF NOT EXISTS public.product_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    comparison_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced wishlist table (replacing any existing)
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    notes TEXT,
    priority INTEGER DEFAULT 1,
    UNIQUE(user_id, product_id)
);

-- Recently viewed products
CREATE TABLE IF NOT EXISTS public.recently_viewed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    view_duration_seconds INTEGER DEFAULT 0,
    UNIQUE(user_id, product_id)
);

-- Quick checkout preferences
CREATE TABLE IF NOT EXISTS public.quick_checkout_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    default_shipping_address JSONB,
    default_billing_address JSONB,
    default_payment_method TEXT,
    auto_apply_coupons BOOLEAN DEFAULT false,
    skip_review_step BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Product filters and sorting metadata
CREATE TABLE IF NOT EXISTS public.product_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID,
    filter_type TEXT NOT NULL, -- 'price_range', 'rating', 'brand', 'features'
    filter_name TEXT NOT NULL,
    filter_options JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_comparisons_user_id ON public.product_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON public.wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id ON public.recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_viewed_at ON public.recently_viewed(viewed_at DESC);

-- RLS Policies
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_checkout_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_filters ENABLE ROW LEVEL SECURITY;

-- Product comparisons policies
CREATE POLICY "Users can manage their own comparisons" ON public.product_comparisons
    FOR ALL USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can manage their own wishlist" ON public.wishlists
    FOR ALL USING (auth.uid() = user_id);

-- Recently viewed policies
CREATE POLICY "Users can manage their own view history" ON public.recently_viewed
    FOR ALL USING (auth.uid() = user_id);

-- Quick checkout policies
CREATE POLICY "Users can manage their own checkout preferences" ON public.quick_checkout_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Product filters policies (public read, admin write)
CREATE POLICY "Anyone can view active filters" ON public.product_filters
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage filters" ON public.product_filters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = ANY(ARRAY['admin'::user_role, 'super_admin'::user_role])
        )
    );

-- Triggers for updated_at
CREATE TRIGGER update_product_comparisons_updated_at
    BEFORE UPDATE ON public.product_comparisons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_checkout_preferences_updated_at
    BEFORE UPDATE ON public.quick_checkout_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean old recently viewed items (keep last 50 per user)
CREATE OR REPLACE FUNCTION clean_old_recently_viewed()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete old entries, keep only the 50 most recent per user
    DELETE FROM public.recently_viewed 
    WHERE user_id = NEW.user_id 
    AND id NOT IN (
        SELECT id FROM public.recently_viewed 
        WHERE user_id = NEW.user_id 
        ORDER BY viewed_at DESC 
        LIMIT 50
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clean_recently_viewed_trigger
    AFTER INSERT ON public.recently_viewed
    FOR EACH ROW EXECUTE FUNCTION clean_old_recently_viewed();

-- Insert sample product filters
INSERT INTO public.product_filters (filter_type, filter_name, filter_options, sort_order) VALUES
('price_range', 'Price Range', '{"ranges": [{"min": 0, "max": 1000, "label": "Under ৳1,000"}, {"min": 1000, "max": 5000, "label": "৳1,000 - ৳5,000"}, {"min": 5000, "max": 10000, "label": "৳5,000 - ৳10,000"}, {"min": 10000, "max": null, "label": "Over ৳10,000"}]}', 1),
('rating', 'Customer Rating', '{"options": [{"value": 4, "label": "4 stars & up"}, {"value": 3, "label": "3 stars & up"}, {"value": 2, "label": "2 stars & up"}, {"value": 1, "label": "1 star & up"}]}', 2),
('sort', 'Sort By', '{"options": [{"value": "popularity", "label": "Most Popular"}, {"value": "price_low", "label": "Price: Low to High"}, {"value": "price_high", "label": "Price: High to Low"}, {"value": "rating", "label": "Customer Rating"}, {"value": "newest", "label": "Newest First"}, {"value": "reviews", "label": "Most Reviewed"}]}', 3),
('availability', 'Availability', '{"options": [{"value": "in_stock", "label": "In Stock"}, {"value": "out_of_stock", "label": "Include Out of Stock"}]}', 4)
ON CONFLICT DO NOTHING;