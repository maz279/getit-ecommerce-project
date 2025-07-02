-- Phase 3: Social Commerce & Real-time Features Enhancement

-- Enhance live shopping sessions table
ALTER TABLE public.live_shopping_sessions 
ADD COLUMN IF NOT EXISTS stream_url TEXT,
ADD COLUMN IF NOT EXISTS viewer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS interaction_metrics JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS recording_url TEXT,
ADD COLUMN IF NOT EXISTS monetization_data JSONB DEFAULT '{}'::jsonb;

-- Create social interactions table
CREATE TABLE IF NOT EXISTS public.social_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  interaction_type TEXT NOT NULL, -- 'like', 'share', 'comment', 'follow'
  target_type TEXT NOT NULL, -- 'product', 'vendor', 'live_session', 'post'
  target_id UUID NOT NULL,
  interaction_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create social media integrations table
CREATE TABLE IF NOT EXISTS public.social_media_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  platform TEXT NOT NULL, -- 'facebook', 'instagram', 'whatsapp', 'telegram'
  platform_user_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  integration_settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Create WhatsApp business integration table
CREATE TABLE IF NOT EXISTS public.whatsapp_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id),
  business_account_id TEXT NOT NULL,
  phone_number_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  webhook_verify_token TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'suspended'
  integration_config JSONB DEFAULT '{}'::jsonb,
  message_templates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhance push notifications table
ALTER TABLE public.push_notifications 
ADD COLUMN IF NOT EXISTS deep_link TEXT,
ADD COLUMN IF NOT EXISTS action_buttons JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS analytics_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending';

-- Create real-time events table for WebSocket management
CREATE TABLE IF NOT EXISTS public.realtime_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  room_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  event_data JSONB NOT NULL,
  broadcasted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours')
);

-- Create social feeds table
CREATE TABLE IF NOT EXISTS public.social_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  content_type TEXT NOT NULL, -- 'product_share', 'live_session', 'review', 'achievement'
  content_data JSONB NOT NULL,
  visibility TEXT DEFAULT 'public', -- 'public', 'friends', 'private'
  engagement_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS policies
ALTER TABLE public.social_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_feeds ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own social interactions" ON public.social_interactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own social integrations" ON public.social_media_integrations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Vendors can manage their WhatsApp integrations" ON public.whatsapp_integrations
  FOR ALL USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

CREATE POLICY "Users can view public social feeds" ON public.social_feeds
  FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can manage their own social feeds" ON public.social_feeds
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_interactions_user_type ON public.social_interactions(user_id, interaction_type);
CREATE INDEX IF NOT EXISTS idx_social_interactions_target ON public.social_interactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_realtime_events_room ON public.realtime_events(room_id);
CREATE INDEX IF NOT EXISTS idx_social_feeds_user_time ON public.social_feeds(user_id, created_at DESC);

-- Update user presence table
ALTER TABLE public.user_presence 
ADD COLUMN IF NOT EXISTS current_room TEXT,
ADD COLUMN IF NOT EXISTS device_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS activity_data JSONB DEFAULT '{}'::jsonb;