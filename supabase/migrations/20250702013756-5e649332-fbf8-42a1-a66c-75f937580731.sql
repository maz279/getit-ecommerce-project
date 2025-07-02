-- Real-time Infrastructure Database Schema (Fixed)
-- Push Notification Tables
CREATE TABLE IF NOT EXISTS public.push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  type TEXT NOT NULL DEFAULT 'general',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  device_tokens TEXT[],
  platform TEXT DEFAULT 'web' CHECK (platform IN ('web', 'ios', 'android', 'all')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT,
  auth_key TEXT,
  device_type TEXT DEFAULT 'web',
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  order_updates BOOLEAN DEFAULT true,
  price_alerts BOOLEAN DEFAULT true,
  inventory_alerts BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  flash_sales BOOLEAN DEFAULT true,
  chat_messages BOOLEAN DEFAULT true,
  vendor_updates BOOLEAN DEFAULT true,
  system_notifications BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Inventory Tracking Tables
CREATE TABLE IF NOT EXISTS public.live_inventory_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('stock_update', 'low_stock', 'out_of_stock', 'restock', 'reserved', 'unreserved')),
  old_quantity INTEGER,
  new_quantity INTEGER NOT NULL,
  difference INTEGER GENERATED ALWAYS AS (new_quantity - COALESCE(old_quantity, 0)) STORED,
  reason TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'order', 'return', 'adjustment', 'supplier')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'high_demand', 'slow_moving')),
  threshold_value INTEGER,
  current_value INTEGER,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Order Status Tables
CREATE TABLE IF NOT EXISTS public.order_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  vendor_id UUID,
  old_status TEXT,
  new_status TEXT NOT NULL,
  status_category TEXT CHECK (status_category IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  event_description TEXT,
  location_data JSONB,
  tracking_number TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.live_order_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  current_location TEXT,
  coordinates JSONB,
  status TEXT NOT NULL,
  status_description TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  delivery_attempts INTEGER DEFAULT 0,
  last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tracking_events JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WebSocket Connection Management
CREATE TABLE IF NOT EXISTS public.websocket_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id TEXT NOT NULL UNIQUE,
  channel_subscriptions TEXT[],
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_push_notifications_user_id ON public.push_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_push_notifications_status ON public.push_notifications(status);
CREATE INDEX IF NOT EXISTS idx_push_notifications_scheduled_at ON public.push_notifications(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_live_inventory_events_product_id ON public.live_inventory_events(product_id);
CREATE INDEX IF NOT EXISTS idx_live_inventory_events_vendor_id ON public.live_inventory_events(vendor_id);
CREATE INDEX IF NOT EXISTS idx_live_inventory_events_created_at ON public.live_inventory_events(created_at);

CREATE INDEX IF NOT EXISTS idx_inventory_alerts_product_id ON public.inventory_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_vendor_id ON public.inventory_alerts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_is_resolved ON public.inventory_alerts(is_resolved);

CREATE INDEX IF NOT EXISTS idx_order_status_events_order_id ON public.order_status_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_events_vendor_id ON public.order_status_events(vendor_id);
CREATE INDEX IF NOT EXISTS idx_order_status_events_created_at ON public.order_status_events(created_at);

CREATE INDEX IF NOT EXISTS idx_live_order_tracking_order_id ON public.live_order_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_live_order_tracking_tracking_number ON public.live_order_tracking(tracking_number);

CREATE INDEX IF NOT EXISTS idx_websocket_connections_user_id ON public.websocket_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_websocket_connections_is_active ON public.websocket_connections(is_active);

-- Enable RLS
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_inventory_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websocket_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Push Notifications
CREATE POLICY "Users can view their own notifications" ON public.push_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all notifications" ON public.push_notifications
  FOR ALL USING (is_admin_user());

-- Notification Subscriptions
CREATE POLICY "Users can manage their subscriptions" ON public.notification_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Notification Preferences
CREATE POLICY "Users can manage their preferences" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Live Inventory Events
CREATE POLICY "Vendors can view their inventory events" ON public.live_inventory_events
  FOR SELECT USING (auth.uid() = vendor_id OR is_admin_user());

CREATE POLICY "Vendors can create inventory events" ON public.live_inventory_events
  FOR INSERT WITH CHECK (auth.uid() = vendor_id);

-- Inventory Alerts
CREATE POLICY "Vendors can view their alerts" ON public.inventory_alerts
  FOR SELECT USING (auth.uid() = vendor_id OR is_admin_user());

CREATE POLICY "System can create alerts" ON public.inventory_alerts
  FOR INSERT WITH CHECK (true);

-- Order Status Events
CREATE POLICY "Users can view order events for their orders" ON public.order_status_events
  FOR SELECT USING (
    auth.uid() = vendor_id OR 
    is_admin_user() OR
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = order_status_events.order_id 
      AND o.customer_id = auth.uid()
    )
  );

-- Live Order Tracking
CREATE POLICY "Users can view tracking for their orders" ON public.live_order_tracking
  FOR SELECT USING (
    is_admin_user() OR
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = live_order_tracking.order_id 
      AND o.customer_id = auth.uid()
    )
  );

-- WebSocket Connections
CREATE POLICY "Users can view their connections" ON public.websocket_connections
  FOR ALL USING (auth.uid() = user_id OR is_admin_user());

-- Triggers for updated_at
CREATE TRIGGER update_push_notifications_updated_at
  BEFORE UPDATE ON public.push_notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_subscriptions_updated_at
  BEFORE UPDATE ON public.notification_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_live_order_tracking_updated_at
  BEFORE UPDATE ON public.live_order_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.push_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_inventory_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_order_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.websocket_connections;