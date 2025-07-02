-- Real-time & Event-Driven Architecture Tables

-- WebSocket Session Management
CREATE TABLE public.websocket_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID,
  connection_id TEXT NOT NULL,
  gateway_node TEXT NOT NULL,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  connection_status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}',
  channel_subscriptions JSONB NOT NULL DEFAULT '[]',
  message_count INTEGER NOT NULL DEFAULT 0
);

-- Real-time Event Streams
CREATE TABLE public.event_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  source_service TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}',
  event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processing_status TEXT NOT NULL DEFAULT 'pending',
  retry_count INTEGER NOT NULL DEFAULT 0,
  routing_key TEXT,
  correlation_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time Business Metrics
CREATE TABLE public.realtime_business_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL,
  time_window TIMESTAMP WITH TIME ZONE NOT NULL,
  dimensions JSONB NOT NULL DEFAULT '{}',
  aggregation_type TEXT NOT NULL DEFAULT 'sum',
  vendor_id UUID,
  customer_segment TEXT,
  geographic_region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer Journey Tracking
CREATE TABLE public.customer_journey_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL,
  page_url TEXT,
  event_properties JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  journey_stage TEXT,
  funnel_step INTEGER,
  conversion_value NUMERIC DEFAULT 0,
  device_info JSONB NOT NULL DEFAULT '{}'
);

-- WebSocket Message Routing
CREATE TABLE public.websocket_message_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  message_payload JSONB NOT NULL DEFAULT '{}',
  direction TEXT NOT NULL, -- 'inbound' or 'outbound'
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_time_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'delivered',
  error_message TEXT
);

-- Event Processing Queue
CREATE TABLE public.event_processing_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  processor_name TEXT NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'queued',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_details JSONB,
  priority INTEGER NOT NULL DEFAULT 5
);

-- Create indexes
CREATE INDEX idx_websocket_sessions_user_id ON public.websocket_sessions(user_id);
CREATE INDEX idx_websocket_sessions_status ON public.websocket_sessions(connection_status);
CREATE INDEX idx_event_streams_type_timestamp ON public.event_streams(event_type, event_timestamp);
CREATE INDEX idx_event_streams_status ON public.event_streams(processing_status);
CREATE INDEX idx_realtime_metrics_name_time ON public.realtime_business_metrics(metric_name, time_window);
CREATE INDEX idx_customer_journey_customer_timestamp ON public.customer_journey_events(customer_id, timestamp);
CREATE INDEX idx_websocket_messages_session ON public.websocket_message_logs(session_id);
CREATE INDEX idx_event_queue_status_priority ON public.event_processing_queue(processing_status, priority);

-- Enable RLS
ALTER TABLE public.websocket_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websocket_message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_processing_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access websocket_sessions" ON public.websocket_sessions FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their websocket sessions" ON public.websocket_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin full access event_streams" ON public.event_streams FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access realtime_business_metrics" ON public.realtime_business_metrics FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access customer_journey_events" ON public.customer_journey_events FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access websocket_message_logs" ON public.websocket_message_logs FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access event_processing_queue" ON public.event_processing_queue FOR ALL USING (is_admin_user());

-- Functions for real-time processing
CREATE OR REPLACE FUNCTION public.process_realtime_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Add to processing queue
  INSERT INTO public.event_processing_queue (event_id, processor_name)
  VALUES (NEW.id, 'default_processor');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_process_realtime_event
  AFTER INSERT ON public.event_streams
  FOR EACH ROW EXECUTE FUNCTION public.process_realtime_event();