-- ================================
-- BANGLADESH ECOMMERCE FOUNDATION
-- Phase 1: Critical Missing Database Tables
-- ================================

-- =====================================
-- 1. LOCALIZATION & CULTURAL FEATURES
-- =====================================

-- Bengali translations table
CREATE TABLE public.bengali_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  english_text TEXT NOT NULL,
  bengali_text TEXT NOT NULL,
  category TEXT NOT NULL, -- 'ui', 'product', 'error', 'notification'
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX idx_bengali_translations_key ON public.bengali_translations(key);

-- Currency exchange rates
CREATE TABLE public.currency_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL, -- 'BDT', 'USD', 'EUR'
  to_currency TEXT NOT NULL,
  rate NUMERIC(15,6) NOT NULL,
  provider TEXT NOT NULL, -- 'central_bank', 'xe', 'fixer'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX idx_currency_rates_pair ON public.currency_rates(from_currency, to_currency) WHERE is_active = true;

-- Festival and cultural events
CREATE TABLE public.festival_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_name TEXT NOT NULL,
  festival_name_bn TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  banner_config JSONB DEFAULT '{}',
  discount_config JSONB DEFAULT '{}',
  cultural_elements JSONB DEFAULT '{}', -- colors, fonts, graphics
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Prayer times configuration
CREATE TABLE public.prayer_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  division TEXT NOT NULL,
  date DATE NOT NULL,
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX idx_prayer_times_city_date ON public.prayer_times(city, date);

-- =====================================
-- 2. ADVANCED PRODUCT FEATURES
-- =====================================

-- Product comparisons
CREATE TABLE public.product_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_ids JSONB NOT NULL, -- Array of product IDs
  comparison_criteria JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  shared_link TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bulk order requests
CREATE TABLE public.bulk_order_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID,
  product_id UUID,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2),
  total_price NUMERIC(12,2),
  special_requirements TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'approved', 'rejected', 'completed')),
  quote_valid_until TIMESTAMP WITH TIME ZONE,
  vendor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product recommendations (AI-powered)
CREATE TABLE public.product_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'similar', 'frequently_bought', 'trending', 'ai_personalized'
  score NUMERIC(5,3) NOT NULL CHECK (score >= 0 AND score <= 1),
  reasoning JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_product_recommendations_user_type ON public.product_recommendations(user_id, recommendation_type);

-- =====================================
-- 3. ENHANCED USER FEATURES
-- =====================================

-- KYC document verification
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('nid', 'passport', 'driving_license', 'birth_certificate')),
  document_number TEXT NOT NULL,
  document_front_url TEXT,
  document_back_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Loyalty program
CREATE TABLE public.loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  program_name_bn TEXT NOT NULL,
  tier_levels JSONB NOT NULL, -- Array of tier configurations
  point_rules JSONB NOT NULL, -- Rules for earning points
  redemption_rules JSONB NOT NULL, -- Rules for redeeming points
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User loyalty points
CREATE TABLE public.user_loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.loyalty_programs(id),
  total_points INTEGER DEFAULT 0,
  current_tier TEXT,
  points_earned_lifetime INTEGER DEFAULT 0,
  points_redeemed_lifetime INTEGER DEFAULT 0,
  tier_progress JSONB DEFAULT '{}',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Point transactions
CREATE TABLE public.loyalty_point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.loyalty_programs(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted')),
  points INTEGER NOT NULL,
  reference_type TEXT, -- 'order', 'referral', 'bonus', 'manual'
  reference_id TEXT,
  description TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Referral system
CREATE TABLE public.referral_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
  referrer_reward JSONB DEFAULT '{}', -- Points, discount, cash
  referee_reward JSONB DEFAULT '{}',
  completion_criteria JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_referral_programs_code ON public.referral_programs(referral_code);

-- Digital wallet
CREATE TABLE public.digital_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance NUMERIC(12,2) DEFAULT 0.00 CHECK (balance >= 0),
  currency TEXT DEFAULT 'BDT',
  is_active BOOLEAN DEFAULT true,
  pin_hash TEXT, -- For wallet transactions
  daily_limit NUMERIC(12,2) DEFAULT 50000.00,
  monthly_limit NUMERIC(12,2) DEFAULT 500000.00,
  kyc_level INTEGER DEFAULT 1 CHECK (kyc_level IN (1, 2, 3)),
  last_transaction_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wallet transactions
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.digital_wallets(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  balance_before NUMERIC(12,2) NOT NULL,
  balance_after NUMERIC(12,2) NOT NULL,
  reference_type TEXT, -- 'order', 'refund', 'cashback', 'top_up', 'withdrawal'
  reference_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================
-- 4. REAL-TIME & SOCIAL FEATURES
-- =====================================

-- Live shopping sessions
CREATE TABLE public.live_shopping_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  host_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  stream_url TEXT,
  chat_room_id UUID,
  featured_products JSONB DEFAULT '[]',
  viewer_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  recording_url TEXT,
  analytics_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Live shopping interactions
CREATE TABLE public.live_shopping_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.live_shopping_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('join', 'leave', 'like', 'comment', 'purchase', 'share')),
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Social media integrations
CREATE TABLE public.social_media_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'google', 'whatsapp', 'telegram')),
  social_id TEXT NOT NULL,
  profile_data JSONB DEFAULT '{}',
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX idx_social_accounts_platform_user ON public.social_media_accounts(platform, user_id);

-- Product sharing & social commerce
CREATE TABLE public.product_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'whatsapp', 'telegram', 'messenger', 'email', 'sms')),
  shared_url TEXT,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  referral_earnings NUMERIC(8,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================
-- 5. ENHANCED CART & CHECKOUT
-- =====================================

-- Installment plans
CREATE TABLE public.installment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  plan_name_bn TEXT NOT NULL,
  duration_months INTEGER NOT NULL CHECK (duration_months > 0),
  interest_rate NUMERIC(5,2) DEFAULT 0.00,
  processing_fee NUMERIC(8,2) DEFAULT 0.00,
  minimum_amount NUMERIC(12,2) NOT NULL,
  maximum_amount NUMERIC(12,2),
  eligibility_criteria JSONB DEFAULT '{}',
  partner_bank TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tax configurations for Bangladesh
CREATE TABLE public.tax_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_type TEXT NOT NULL CHECK (tax_type IN ('vat', 'sd', 'customs', 'ait')),
  tax_name TEXT NOT NULL,
  tax_name_bn TEXT NOT NULL,
  rate NUMERIC(5,2) NOT NULL,
  applicable_categories JSONB DEFAULT '[]',
  minimum_threshold NUMERIC(12,2) DEFAULT 0.00,
  calculation_method TEXT DEFAULT 'percentage' CHECK (calculation_method IN ('percentage', 'fixed', 'tiered')),
  is_active BOOLEAN DEFAULT true,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================
-- 6. NOTIFICATION SYSTEM
-- =====================================

-- Multi-channel notification templates
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('email', 'sms', 'push', 'whatsapp', 'in_app')),
  trigger_event TEXT NOT NULL,
  subject_en TEXT,
  subject_bn TEXT,
  content_en TEXT NOT NULL,
  content_bn TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Available template variables
  channel_config JSONB DEFAULT '{}', -- Channel-specific configuration
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notification queue
CREATE TABLE public.notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.notification_templates(id),
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL, -- Email, phone, device_token
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_notification_queue_status_priority ON public.notification_queue(status, priority, scheduled_at);

-- =====================================
-- RLS POLICIES
-- =====================================

-- Enable RLS on all tables
ALTER TABLE public.bengali_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.festival_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_order_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_shopping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_shopping_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Public read policies for configuration tables
CREATE POLICY "Public can read translations" ON public.bengali_translations FOR SELECT USING (true);
CREATE POLICY "Public can read currency rates" ON public.currency_rates FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active festivals" ON public.festival_configurations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read prayer times" ON public.prayer_times FOR SELECT USING (true);
CREATE POLICY "Public can read installment plans" ON public.installment_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read tax configurations" ON public.tax_configurations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read loyalty programs" ON public.loyalty_programs FOR SELECT USING (is_active = true);

-- User-specific policies
CREATE POLICY "Users can manage their comparisons" ON public.product_comparisons FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their bulk orders" ON public.bulk_order_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their recommendations" ON public.product_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their KYC" ON public.kyc_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their loyalty points" ON public.user_loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their point transactions" ON public.loyalty_point_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their referrals" ON public.referral_programs FOR ALL USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
CREATE POLICY "Users can manage their wallet" ON public.digital_wallets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their wallet transactions" ON public.wallet_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.digital_wallets WHERE id = wallet_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view live shopping sessions" ON public.live_shopping_sessions FOR SELECT USING (true);
CREATE POLICY "Users can manage their live interactions" ON public.live_shopping_interactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their social accounts" ON public.social_media_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their product shares" ON public.product_shares FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their notifications" ON public.notification_queue FOR SELECT USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admin can manage all data" ON public.bengali_translations FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can manage currency rates" ON public.currency_rates FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can manage festivals" ON public.festival_configurations FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can manage KYC verifications" ON public.kyc_documents FOR UPDATE USING (is_admin_user());
CREATE POLICY "Admin can manage live sessions" ON public.live_shopping_sessions FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can manage notification templates" ON public.notification_templates FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can manage notification queue" ON public.notification_queue FOR ALL USING (is_admin_user());

-- =====================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================

CREATE TRIGGER update_bengali_translations_updated_at BEFORE UPDATE ON public.bengali_translations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_currency_rates_updated_at BEFORE UPDATE ON public.currency_rates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_festival_configurations_updated_at BEFORE UPDATE ON public.festival_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_comparisons_updated_at BEFORE UPDATE ON public.product_comparisons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bulk_order_requests_updated_at BEFORE UPDATE ON public.bulk_order_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON public.kyc_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loyalty_programs_updated_at BEFORE UPDATE ON public.loyalty_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_loyalty_points_updated_at BEFORE UPDATE ON public.user_loyalty_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_referral_programs_updated_at BEFORE UPDATE ON public.referral_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_digital_wallets_updated_at BEFORE UPDATE ON public.digital_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_live_shopping_sessions_updated_at BEFORE UPDATE ON public.live_shopping_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_media_accounts_updated_at BEFORE UPDATE ON public.social_media_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_installment_plans_updated_at BEFORE UPDATE ON public.installment_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tax_configurations_updated_at BEFORE UPDATE ON public.tax_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON public.notification_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();