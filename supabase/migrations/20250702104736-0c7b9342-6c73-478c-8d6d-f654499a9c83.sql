-- Create missing real-time tables only

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

-- WebSocket Message Routing
CREATE TABLE public.websocket_message_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  message_payload JSONB NOT NULL DEFAULT '{}',
  direction TEXT NOT NULL,
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
CREATE INDEX idx_event_streams_type_timestamp ON public.event_streams(event_type, event_timestamp);
CREATE INDEX idx_realtime_metrics_name_time ON public.realtime_business_metrics(metric_name, time_window);
CREATE INDEX idx_websocket_messages_session ON public.websocket_message_logs(session_id);

-- Enable RLS and policies
ALTER TABLE public.websocket_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websocket_message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_processing_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access websocket_sessions" ON public.websocket_sessions FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access event_streams" ON public.event_streams FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access realtime_business_metrics" ON public.realtime_business_metrics FOR ALL USING (is_admin_user());