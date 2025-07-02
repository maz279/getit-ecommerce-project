-- ENHANCED E-COMMERCE CORE TABLES
-- Add missing columns to existing products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS brand_id UUID,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS allow_backorder BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS length NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS width NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS height NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS hs_code TEXT,
ADD COLUMN IF NOT EXISTS origin_country TEXT DEFAULT 'BD',
ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS taxable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS rating_average NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create unique slug constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_key') THEN
        ALTER TABLE public.products ADD CONSTRAINT products_slug_key UNIQUE (slug);
    END IF;
END
$$;

-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  country_origin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_categories table (enhanced version)
CREATE TABLE IF NOT EXISTS public.product_categories_enhanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories_enhanced(id),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shopping Cart System
CREATE TABLE IF NOT EXISTS public.shopping_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT check_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.shopping_carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(cart_id, product_id, variant_id)
);

-- Enhanced order system (add missing columns)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS fulfillment_status TEXT CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled', 'restocked')) DEFAULT 'unfulfilled',
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- Enhanced order items
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_sku TEXT,
ADD COLUMN IF NOT EXISTS vendor_commission NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(10,2);

-- Product Reviews System
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images JSONB DEFAULT '[]',
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')) DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, user_id, order_id)
);

-- Wishlist System
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT DEFAULT 'My Wishlist',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(wishlist_id, product_id, variant_id)
);

-- Enhanced Search System (extends existing search_queries)
ALTER TABLE public.search_queries 
ADD COLUMN IF NOT EXISTS filters JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sort_by TEXT,
ADD COLUMN IF NOT EXISTS clicked_product_id UUID REFERENCES public.products(id),
ADD COLUMN IF NOT EXISTS conversion_product_id UUID REFERENCES public.products(id);

-- Discount System
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('percentage', 'fixed_amount', 'buy_x_get_y', 'free_shipping')) NOT NULL,
  value NUMERIC(10,2) NOT NULL,
  minimum_order_amount NUMERIC(10,2),
  maximum_discount_amount NUMERIC(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  usage_limit_per_customer INTEGER DEFAULT 1,
  applies_to TEXT CHECK (applies_to IN ('all', 'specific_products', 'specific_categories', 'specific_vendors')) DEFAULT 'all',
  applies_to_ids UUID[],
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Live Shopping & Social Commerce
CREATE TABLE IF NOT EXISTS public.live_shopping_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  stream_url TEXT,
  status TEXT CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')) DEFAULT 'scheduled',
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  viewer_count INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  featured_products UUID[],
  chat_enabled BOOLEAN DEFAULT true,
  recording_enabled BOOLEAN DEFAULT true,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.live_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.live_shopping_sessions(id) ON DELETE CASCADE,
  user_id UUID,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('chat', 'product_question', 'system')) DEFAULT 'chat',
  is_pinned BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Social Features
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  follow_type TEXT CHECK (follow_type IN ('user', 'vendor', 'brand')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_id, following_id, follow_type)
);

CREATE TABLE IF NOT EXISTS public.product_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  user_id UUID,
  share_platform TEXT NOT NULL,
  share_url TEXT,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recommendation Engine
CREATE TABLE IF NOT EXISTS public.user_product_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  product_id UUID NOT NULL REFERENCES public.products(id),
  interaction_type TEXT CHECK (interaction_type IN ('view', 'click', 'cart_add', 'purchase', 'wishlist', 'share', 'review')) NOT NULL,
  interaction_value NUMERIC(10,2),
  interaction_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT check_user_or_session_interaction CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  recommendation_type TEXT CHECK (recommendation_type IN ('similar_products', 'frequently_bought', 'trending', 'personalized', 'seasonal')) NOT NULL,
  product_ids UUID[],
  confidence_score NUMERIC(3,2) DEFAULT 0,
  algorithm_version TEXT DEFAULT '1.0',
  context_data JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT check_user_or_session_rec CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Add foreign key for brands if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_brand_id_fkey') THEN
        ALTER TABLE public.products ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);
    END IF;
END
$$;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_rating_average ON public.products(rating_average);
CREATE INDEX IF NOT EXISTS idx_products_sales_count ON public.products(sales_count);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_product ON public.user_product_interactions(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type_created ON public.user_product_interactions(interaction_type, created_at);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON public.live_shopping_sessions(status);
CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled ON public.live_shopping_sessions(scheduled_start);

-- Enable RLS for new tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_shopping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_product_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admin can manage brands" ON public.brands FOR ALL USING (is_admin_user());

CREATE POLICY "Public can view active categories" ON public.product_categories_enhanced FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage categories" ON public.product_categories_enhanced FOR ALL USING (is_admin_user());

CREATE POLICY "Users can manage their carts" ON public.shopping_carts FOR ALL USING (user_id = auth.uid() OR is_admin_user());
CREATE POLICY "Users can manage their cart items" ON public.cart_items FOR ALL USING (
  cart_id IN (SELECT id FROM public.shopping_carts WHERE user_id = auth.uid()) OR is_admin_user()
);

CREATE POLICY "Users can manage their reviews" ON public.product_reviews FOR ALL USING (user_id = auth.uid() OR is_admin_user());
CREATE POLICY "Public can view approved reviews" ON public.product_reviews FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can manage their wishlists" ON public.wishlists FOR ALL USING (user_id = auth.uid() OR is_admin_user());
CREATE POLICY "Users can manage their wishlist items" ON public.wishlist_items FOR ALL USING (
  wishlist_id IN (SELECT id FROM public.wishlists WHERE user_id = auth.uid()) OR is_admin_user()
);

CREATE POLICY "Public can view active discount codes" ON public.discount_codes FOR SELECT USING (
  is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at > now())
);
CREATE POLICY "Admin can manage discount codes" ON public.discount_codes FOR ALL USING (is_admin_user());

CREATE POLICY "Public can view live sessions" ON public.live_shopping_sessions FOR SELECT USING (true);
CREATE POLICY "Vendors can manage their sessions" ON public.live_shopping_sessions FOR ALL USING (vendor_id = auth.uid() OR is_admin_user());

CREATE POLICY "Users can view live chat" ON public.live_chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send live chat messages" ON public.live_chat_messages FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their follows" ON public.user_follows FOR ALL USING (follower_id = auth.uid() OR is_admin_user());
CREATE POLICY "Users can view follows" ON public.user_follows FOR SELECT USING (true);

CREATE POLICY "Users can create product shares" ON public.product_shares FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Public can view product shares" ON public.product_shares FOR SELECT USING (true);

CREATE POLICY "Users can create interactions" ON public.user_product_interactions FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Admin can view interactions" ON public.user_product_interactions FOR SELECT USING (is_admin_user());

CREATE POLICY "Users can view their recommendations" ON public.ai_recommendations FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "System can create recommendations" ON public.ai_recommendations FOR INSERT WITH CHECK (true);