-- Create tables for enhanced payment, notification, and analytics services

-- Payment fraud detection logs
CREATE TABLE public.fraud_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  risk_score NUMERIC NOT NULL,
  risk_level TEXT NOT NULL,
  risk_factors JSONB DEFAULT '[]'::jsonb,
  approved BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notification logs
CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  template TEXT NOT NULL,
  status TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  external_id TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- In-app notifications
CREATE TABLE public.in_app_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Analytics cache
CREATE TABLE public.analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_type TEXT NOT NULL,
  vendor_id UUID,
  date_range JSONB NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fraud_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.in_app_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin can manage fraud logs" ON public.fraud_detection_logs FOR ALL USING (is_admin_user());
CREATE POLICY "Admin can manage notification logs" ON public.notification_logs FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their notifications" ON public.in_app_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage analytics cache" ON public.analytics_cache FOR ALL USING (is_admin_user());