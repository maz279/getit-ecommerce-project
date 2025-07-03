-- Create comprehensive notification service tables for Amazon/Shopee level functionality

-- Enhanced notification channels table
CREATE TABLE IF NOT EXISTS public.notification_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push', 'whatsapp', 'in_app', 'webhook')),
    provider TEXT NOT NULL,
    configuration JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notification campaigns table
CREATE TABLE IF NOT EXISTS public.notification_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('promotional', 'transactional', 'system', 'behavioral')),
    target_audience JSONB NOT NULL DEFAULT '{}',
    channels TEXT[] NOT NULL DEFAULT ARRAY['in_app'],
    template_id UUID REFERENCES public.notification_templates(id),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled')),
    sending_options JSONB DEFAULT '{}',
    analytics JSONB DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User notification history for analytics
CREATE TABLE IF NOT EXISTS public.notification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    notification_id UUID,
    campaign_id UUID REFERENCES public.notification_campaigns(id),
    channel TEXT NOT NULL,
    template_id UUID REFERENCES public.notification_templates(id),
    subject TEXT,
    content TEXT,
    recipient TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced')),
    provider_response JSONB,
    error_details JSONB,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time notification subscriptions
CREATE TABLE IF NOT EXISTS public.notification_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    endpoint TEXT NOT NULL,
    subscription_type TEXT NOT NULL CHECK (subscription_type IN ('web_push', 'mobile_push', 'webhook')),
    subscription_data JSONB NOT NULL,
    device_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, endpoint, subscription_type)
);

-- Notification analytics aggregation
CREATE TABLE IF NOT EXISTS public.notification_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.notification_campaigns(id),
    channel TEXT NOT NULL,
    date DATE NOT NULL,
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    total_bounced INTEGER DEFAULT 0,
    unique_opens INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    revenue_generated NUMERIC(12,2) DEFAULT 0,
    cost NUMERIC(10,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(campaign_id, channel, date)
);

-- Notification AB tests
CREATE TABLE IF NOT EXISTS public.notification_ab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    campaign_id UUID REFERENCES public.notification_campaigns(id),
    variant_a_template_id UUID REFERENCES public.notification_templates(id),
    variant_b_template_id UUID REFERENCES public.notification_templates(id),
    traffic_split NUMERIC(3,2) DEFAULT 0.5 CHECK (traffic_split BETWEEN 0 AND 1),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'paused')),
    winner TEXT CHECK (winner IN ('variant_a', 'variant_b', 'inconclusive')),
    confidence_level NUMERIC(5,2),
    statistical_significance BOOLEAN DEFAULT false,
    results JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bangladesh-specific SMS providers configuration
INSERT INTO public.notification_channels (name, type, provider, configuration) VALUES
('ssl_wireless', 'sms', 'ssl_wireless', '{"api_url": "https://sms.sslwireless.com/pushapi/dynamic/server.php", "priority": 1}'),
('banglalink', 'sms', 'banglalink', '{"api_url": "https://api.banglalink.net/sms", "priority": 2}'),
('robi', 'sms', 'robi', '{"api_url": "https://api.robi.com.bd/sms", "priority": 3}'),
('grameenphone', 'sms', 'grameenphone', '{"api_url": "https://api.grameenphone.com/sms", "priority": 4}'),
('sendgrid', 'email', 'sendgrid', '{"api_url": "https://api.sendgrid.com/v3/mail/send", "priority": 1}'),
('fcm', 'push', 'firebase', '{"api_url": "https://fcm.googleapis.com/fcm/send", "priority": 1}'),
('whatsapp_business', 'whatsapp', 'meta', '{"api_url": "https://graph.facebook.com/v18.0", "priority": 1}')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON public.notification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_campaign_id ON public.notification_history(campaign_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_status ON public.notification_history(status);
CREATE INDEX IF NOT EXISTS idx_notification_history_created_at ON public.notification_history(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_subscriptions_user_id ON public.notification_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_analytics_campaign_date ON public.notification_analytics(campaign_id, date);

-- Update triggers
CREATE TRIGGER update_notification_campaigns_updated_at 
    BEFORE UPDATE ON public.notification_campaigns 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_channels_updated_at 
    BEFORE UPDATE ON public.notification_channels 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_subscriptions_updated_at 
    BEFORE UPDATE ON public.notification_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.notification_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_ab_tests ENABLE ROW LEVEL SECURITY;

-- Admin access to all notification management
CREATE POLICY "Admins can manage notification channels" ON public.notification_channels
    FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admins can manage notification campaigns" ON public.notification_campaigns
    FOR ALL USING (public.is_admin_user());

CREATE POLICY "Admins can view notification history" ON public.notification_history
    FOR SELECT USING (public.is_admin_user());

CREATE POLICY "Users can view their notification history" ON public.notification_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view notification analytics" ON public.notification_analytics
    FOR SELECT USING (public.is_admin_user());

CREATE POLICY "Users can manage their subscriptions" ON public.notification_subscriptions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage AB tests" ON public.notification_ab_tests
    FOR ALL USING (public.is_admin_user());