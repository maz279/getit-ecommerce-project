-- Enhanced Product Comparison System
CREATE TABLE IF NOT EXISTS public.product_comparison_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  shared_token TEXT UNIQUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Wishlist with Collections
CREATE TABLE IF NOT EXISTS public.wishlist_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  shared_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.wishlist_items ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES public.wishlist_collections(id) ON DELETE SET NULL;
ALTER TABLE public.wishlist_items ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.wishlist_items ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 1;

-- Enhanced Loyalty System
CREATE TABLE IF NOT EXISTS public.loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_bn TEXT,
  minimum_points INTEGER NOT NULL,
  benefits JSONB DEFAULT '{}',
  perks JSONB DEFAULT '[]',
  color_code TEXT DEFAULT '#000000',
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.loyalty_point_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points_changed INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- earned, redeemed, expired, bonus
  source_type TEXT, -- purchase, referral, review, signup
  source_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Referral System  
CREATE TABLE IF NOT EXISTS public.referral_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  referrer_reward_points INTEGER DEFAULT 0,
  referee_reward_points INTEGER DEFAULT 0,
  referrer_reward_amount DECIMAL(10,2) DEFAULT 0,
  referee_reward_amount DECIMAL(10,2) DEFAULT 0,
  minimum_purchase_amount DECIMAL(10,2) DEFAULT 0,
  max_referrals_per_user INTEGER,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.referral_campaigns(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  custom_message TEXT,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  total_earned_points INTEGER DEFAULT 0,
  total_earned_amount DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Chat System for Live Support
CREATE TABLE IF NOT EXISTS public.chat_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  avatar_url TEXT,
  specializations TEXT[],
  languages TEXT[] DEFAULT ARRAY['en', 'bn'],
  is_online BOOLEAN DEFAULT false,
  max_concurrent_chats INTEGER DEFAULT 5,
  current_chat_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_chats INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.chat_agents(id);
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal'; -- low, normal, high, urgent
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS category TEXT; -- general, technical, billing, complaint
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS satisfaction_rating INTEGER;
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;

-- Enhanced Reviews System
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT false;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]';
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS pros TEXT[];
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS cons TEXT[];

CREATE TABLE IF NOT EXISTS public.review_helpfulness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.product_reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Bulk Orders System
CREATE TABLE IF NOT EXISTS public.bulk_order_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_bn TEXT,
  description TEXT,
  minimum_quantity INTEGER DEFAULT 100,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.bulk_order_requests ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.bulk_order_categories(id);
ALTER TABLE public.bulk_order_requests ADD COLUMN IF NOT EXISTS business_license TEXT;
ALTER TABLE public.bulk_order_requests ADD COLUMN IF NOT EXISTS tax_id TEXT;
ALTER TABLE public.bulk_order_requests ADD COLUMN IF NOT EXISTS delivery_address JSONB;
ALTER TABLE public.bulk_order_requests ADD COLUMN IF NOT EXISTS expected_delivery_date DATE;

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_product_comparison_lists_user_id ON public.product_comparison_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_collections_user_id ON public.wishlist_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_point_history_user_id ON public.loyalty_point_history(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_user_id ON public.referral_links(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_code ON public.referral_links(referral_code);
CREATE INDEX IF NOT EXISTS idx_chat_agents_online ON public.chat_agents(is_online);
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_review_id ON public.review_helpfulness(review_id);

-- Enable RLS
ALTER TABLE public.product_comparison_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_point_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpfulness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_order_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own comparison lists" ON public.product_comparison_lists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public comparison lists" ON public.product_comparison_lists
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist collections" ON public.wishlist_collections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public wishlist collections" ON public.wishlist_collections
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Public can view loyalty tiers" ON public.loyalty_tiers
  FOR SELECT USING (true);

CREATE POLICY "Users can view their loyalty history" ON public.loyalty_point_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view active referral campaigns" ON public.referral_campaigns
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their referral links" ON public.referral_links
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage chat agents" ON public.chat_agents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

CREATE POLICY "Users can mark review helpfulness" ON public.review_helpfulness
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view bulk order categories" ON public.bulk_order_categories
  FOR SELECT USING (is_active = true);

-- Triggers for updated_at
CREATE TRIGGER update_product_comparison_lists_updated_at
  BEFORE UPDATE ON public.product_comparison_lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wishlist_collections_updated_at
  BEFORE UPDATE ON public.wishlist_collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_agents_updated_at
  BEFORE UPDATE ON public.chat_agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();