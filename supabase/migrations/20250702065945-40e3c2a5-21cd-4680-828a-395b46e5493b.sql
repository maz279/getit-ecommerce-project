-- First, let's add the agent role to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'agent';

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

-- Add columns to existing wishlist_items table
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
  transaction_type TEXT NOT NULL,
  source_type TEXT,
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

-- Enhanced existing chat tables
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.chat_agents(id);
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS satisfaction_rating INTEGER;
ALTER TABLE public.chat_conversations ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;