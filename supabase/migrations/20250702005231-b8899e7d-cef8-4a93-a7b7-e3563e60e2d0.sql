-- Real-time notifications table
CREATE TABLE public.realtime_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time analytics events
CREATE TABLE public.realtime_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vendor dashboard preferences
CREATE TABLE public.vendor_dashboard_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL UNIQUE,
  dashboard_config JSONB DEFAULT '{}',
  widget_preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Commission real-time tracking
CREATE TABLE public.commission_realtime_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  commission_id UUID,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.realtime_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_dashboard_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_realtime_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their notifications" ON public.realtime_notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Vendors can view their analytics" ON public.realtime_analytics
  FOR SELECT USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can manage their preferences" ON public.vendor_dashboard_preferences
  FOR ALL USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can view their commission events" ON public.commission_realtime_events
  FOR SELECT USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

-- Triggers for real-time updates
CREATE OR REPLACE FUNCTION notify_realtime_event()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('realtime_event', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER realtime_notifications_trigger
  AFTER INSERT OR UPDATE ON public.realtime_notifications
  FOR EACH ROW EXECUTE FUNCTION notify_realtime_event();

CREATE TRIGGER commission_realtime_trigger
  AFTER INSERT OR UPDATE ON public.commission_realtime_events
  FOR EACH ROW EXECUTE FUNCTION notify_realtime_event();