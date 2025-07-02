-- Advanced Real-time Features Database Schema

-- Product View Tracking
CREATE TABLE IF NOT EXISTS public.product_view_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  view_duration INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Product Views (aggregated)
CREATE TABLE IF NOT EXISTS public.live_product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  current_viewers INTEGER DEFAULT 0,
  total_views_today INTEGER DEFAULT 0,
  total_views_week INTEGER DEFAULT 0,
  peak_concurrent_viewers INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price Change History
CREATE TABLE IF NOT EXISTS public.price_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  old_price NUMERIC,
  new_price NUMERIC NOT NULL,
  change_percentage NUMERIC,
  change_reason TEXT,
  effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  effective_to TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price Alerts
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  target_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL,
  alert_type TEXT DEFAULT 'below' CHECK (alert_type IN ('below', 'above', 'exact')),
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Flash Sales
CREATE TABLE IF NOT EXISTS public.flash_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  discount_percentage NUMERIC,
  discount_amount NUMERIC,
  min_order_amount NUMERIC DEFAULT 0,
  max_discount_amount NUMERIC,
  total_quantity INTEGER,
  sold_quantity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended', 'cancelled')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flash Sale Products
CREATE TABLE IF NOT EXISTS public.flash_sale_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flash_sale_id UUID REFERENCES public.flash_sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  original_price NUMERIC NOT NULL,
  sale_price NUMERIC NOT NULL,
  quantity_limit INTEGER,
  sold_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(flash_sale_id, product_id)
);

-- Real-time Chat System
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_type TEXT NOT NULL CHECK (conversation_type IN ('customer_service', 'vendor_admin', 'buyer_seller')),
  participants JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  subject TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_agent UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Chat Messages (enhanced)
CREATE TABLE IF NOT EXISTS public.chat_conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'agent', 'vendor', 'admin', 'ai')),
  message_content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Analytics Events
CREATE TABLE IF NOT EXISTS public.real_time_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  vendor_id UUID,
  product_id UUID,
  order_id UUID,
  ip_address INET,
  user_agent TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Sales Dashboard Data
CREATE TABLE IF NOT EXISTS public.live_sales_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_data JSONB DEFAULT '{}',
  time_period TEXT DEFAULT 'realtime' CHECK (time_period IN ('realtime', 'hourly', 'daily')),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traffic Monitoring
CREATE TABLE IF NOT EXISTS public.traffic_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  visitor_count INTEGER DEFAULT 1,
  unique_visitors INTEGER DEFAULT 1,
  bounce_rate NUMERIC DEFAULT 0,
  session_duration NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  recorded_hour TIMESTAMP WITH TIME ZONE DEFAULT date_trunc('hour', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Fraud Detection
CREATE TABLE IF NOT EXISTS public.real_time_fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('order', 'user', 'vendor', 'payment')),
  entity_id UUID NOT NULL,
  risk_score NUMERIC NOT NULL,
  risk_factors JSONB DEFAULT '[]',
  detection_rules JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
  assigned_to UUID,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_view_tracking_product_id ON public.product_view_tracking(product_id);
CREATE INDEX IF NOT EXISTS idx_product_view_tracking_created_at ON public.product_view_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_live_product_views_product_id ON public.live_product_views(product_id);

CREATE INDEX IF NOT EXISTS idx_price_change_history_product_id ON public.price_change_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_change_history_effective_from ON public.price_change_history(effective_from);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON public.price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_is_active ON public.price_alerts(is_active);

CREATE INDEX IF NOT EXISTS idx_flash_sales_status ON public.flash_sales(status);
CREATE INDEX IF NOT EXISTS idx_flash_sales_start_time ON public.flash_sales(start_time);
CREATE INDEX IF NOT EXISTS idx_flash_sales_end_time ON public.flash_sales(end_time);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_at ON public.chat_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_conversation_messages_conversation_id ON public.chat_conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversation_messages_created_at ON public.chat_conversation_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_real_time_analytics_events_event_type ON public.real_time_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_real_time_analytics_events_recorded_at ON public.real_time_analytics_events(recorded_at);
CREATE INDEX IF NOT EXISTS idx_real_time_analytics_events_user_id ON public.real_time_analytics_events(user_id);

CREATE INDEX IF NOT EXISTS idx_live_sales_metrics_vendor_id ON public.live_sales_metrics(vendor_id);
CREATE INDEX IF NOT EXISTS idx_live_sales_metrics_recorded_at ON public.live_sales_metrics(recorded_at);

CREATE INDEX IF NOT EXISTS idx_traffic_monitoring_recorded_hour ON public.traffic_monitoring(recorded_hour);
CREATE INDEX IF NOT EXISTS idx_real_time_fraud_alerts_status ON public.real_time_fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_real_time_fraud_alerts_severity ON public.real_time_fraud_alerts(severity);

-- Enable RLS
ALTER TABLE public.product_view_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sale_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sales_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_fraud_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Product View Tracking
CREATE POLICY "Anyone can track product views" ON public.product_view_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all tracking data" ON public.product_view_tracking
  FOR SELECT USING (is_admin_user());

-- Live Product Views
CREATE POLICY "Anyone can view live product views" ON public.live_product_views
  FOR SELECT USING (true);

CREATE POLICY "System can update live product views" ON public.live_product_views
  FOR ALL USING (true);

-- Price Change History
CREATE POLICY "Vendors can view their price history" ON public.price_change_history
  FOR SELECT USING (auth.uid() = vendor_id OR is_admin_user());

CREATE POLICY "Vendors can create price history" ON public.price_change_history
  FOR INSERT WITH CHECK (auth.uid() = vendor_id);

-- Price Alerts
CREATE POLICY "Users can manage their price alerts" ON public.price_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Flash Sales
CREATE POLICY "Everyone can view active flash sales" ON public.flash_sales
  FOR SELECT USING (status = 'active' OR is_admin_user());

CREATE POLICY "Admin can manage flash sales" ON public.flash_sales
  FOR ALL USING (is_admin_user());

-- Flash Sale Products
CREATE POLICY "Everyone can view flash sale products" ON public.flash_sale_products
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage flash sale products" ON public.flash_sale_products
  FOR ALL USING (is_admin_user());

-- Chat Conversations
CREATE POLICY "Users can view conversations they participate in" ON public.chat_conversations
  FOR SELECT USING (
    auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participants)) OR 
    auth.uid() = assigned_agent OR 
    is_admin_user()
  );

CREATE POLICY "Users can create conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participants)));

-- Chat Messages
CREATE POLICY "Users can view messages in their conversations" ON public.chat_conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc 
      WHERE cc.id = conversation_id 
      AND (auth.uid()::text = ANY(SELECT jsonb_array_elements_text(cc.participants)) OR 
           auth.uid() = cc.assigned_agent OR 
           is_admin_user())
    )
  );

CREATE POLICY "Users can send messages in their conversations" ON public.chat_conversation_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc 
      WHERE cc.id = conversation_id 
      AND auth.uid()::text = ANY(SELECT jsonb_array_elements_text(cc.participants))
    )
  );

-- Analytics Events
CREATE POLICY "Anyone can create analytics events" ON public.real_time_analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view analytics events" ON public.real_time_analytics_events
  FOR SELECT USING (is_admin_user());

-- Live Sales Metrics
CREATE POLICY "Vendors can view their metrics" ON public.live_sales_metrics
  FOR SELECT USING (auth.uid() = vendor_id OR is_admin_user());

CREATE POLICY "System can insert metrics" ON public.live_sales_metrics
  FOR INSERT WITH CHECK (true);

-- Traffic Monitoring
CREATE POLICY "Admin can view traffic data" ON public.traffic_monitoring
  FOR ALL USING (is_admin_user());

-- Fraud Alerts
CREATE POLICY "Admin can manage fraud alerts" ON public.real_time_fraud_alerts
  FOR ALL USING (is_admin_user());

-- Triggers for updated_at
CREATE TRIGGER update_flash_sales_updated_at
  BEFORE UPDATE ON public.flash_sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_live_product_views_updated_at
  BEFORE UPDATE ON public.live_product_views
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_product_views;
ALTER PUBLICATION supabase_realtime ADD TABLE public.price_change_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.flash_sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.flash_sale_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sales_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.real_time_fraud_alerts;