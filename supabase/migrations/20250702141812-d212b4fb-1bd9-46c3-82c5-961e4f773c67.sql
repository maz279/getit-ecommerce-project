-- Phase 3: Enterprise Monitoring & Phase 4: Disaster Recovery
-- Monitoring Infrastructure Tables

-- Metrics Collection System (Prometheus-style)
CREATE TABLE public.metrics_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'counter', 'gauge', 'histogram', 'summary'
  metric_value NUMERIC NOT NULL,
  labels JSONB NOT NULL DEFAULT '{}',
  service_name TEXT NOT NULL,
  instance_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  retention_period INTERVAL DEFAULT '30 days'
);

-- Business Dashboards Configuration
CREATE TABLE public.business_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_name TEXT NOT NULL,
  dashboard_type TEXT NOT NULL, -- 'executive', 'vendor', 'operational', 'financial'
  panels JSONB NOT NULL DEFAULT '[]',
  data_sources JSONB NOT NULL DEFAULT '[]',
  refresh_interval INTEGER DEFAULT 300, -- seconds
  access_permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Distributed Tracing (Jaeger-style)
CREATE TABLE public.distributed_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id TEXT NOT NULL,
  span_id TEXT NOT NULL,
  parent_span_id TEXT,
  operation_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_ms INTEGER,
  tags JSONB DEFAULT '{}',
  logs JSONB DEFAULT '[]',
  status TEXT DEFAULT 'ok', -- 'ok', 'error', 'timeout'
  error_message TEXT,
  baggage JSONB DEFAULT '{}'
);

-- Centralized Logging (ELK-style)
CREATE TABLE public.centralized_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_level TEXT NOT NULL, -- 'debug', 'info', 'warn', 'error', 'fatal'
  service_name TEXT NOT NULL,
  instance_id TEXT,
  message TEXT NOT NULL,
  structured_data JSONB DEFAULT '{}',
  request_id TEXT,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  stack_trace TEXT,
  correlation_id TEXT,
  business_context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SLA Monitoring & Alerting
CREATE TABLE public.sla_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  sla_type TEXT NOT NULL, -- 'availability', 'response_time', 'error_rate', 'throughput'
  target_value NUMERIC NOT NULL,
  warning_threshold NUMERIC NOT NULL,
  critical_threshold NUMERIC NOT NULL,
  measurement_window INTERVAL NOT NULL DEFAULT '5 minutes',
  evaluation_frequency INTERVAL NOT NULL DEFAULT '1 minute',
  escalation_policy JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sla_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sla_config_id UUID NOT NULL REFERENCES public.sla_configurations(id),
  violation_type TEXT NOT NULL, -- 'warning', 'critical'
  current_value NUMERIC NOT NULL,
  expected_value NUMERIC NOT NULL,
  duration_minutes INTEGER NOT NULL,
  impact_assessment JSONB DEFAULT '{}',
  root_cause_analysis JSONB DEFAULT '{}',
  mitigation_actions JSONB DEFAULT '[]',
  status TEXT DEFAULT 'open', -- 'open', 'acknowledged', 'resolved'
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL, -- 'threshold', 'anomaly', 'trend', 'composite'
  conditions JSONB NOT NULL,
  severity TEXT NOT NULL, -- 'info', 'warning', 'critical', 'emergency'
  notification_channels JSONB NOT NULL DEFAULT '[]',
  escalation_rules JSONB NOT NULL DEFAULT '{}',
  suppression_rules JSONB DEFAULT '{}',
  runbook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.alert_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_rule_id UUID NOT NULL REFERENCES public.alert_rules(id),
  status TEXT NOT NULL DEFAULT 'firing', -- 'firing', 'resolved', 'silenced'
  severity TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  trigger_value NUMERIC,
  labels JSONB DEFAULT '{}',
  annotations JSONB DEFAULT '{}',
  fired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ,
  escalation_level INTEGER DEFAULT 0,
  notification_history JSONB DEFAULT '[]'
);

-- Phase 4: Disaster Recovery Infrastructure

-- Multi-Region Database Replication
CREATE TABLE public.database_replicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  replica_name TEXT NOT NULL,
  region TEXT NOT NULL,
  replica_type TEXT NOT NULL, -- 'read_replica', 'standby', 'hot_standby', 'warm_standby'
  primary_endpoint TEXT NOT NULL,
  replica_endpoint TEXT NOT NULL,
  replication_lag_ms INTEGER,
  last_sync_at TIMESTAMPTZ,
  health_status TEXT DEFAULT 'healthy', -- 'healthy', 'degraded', 'failed'
  failover_priority INTEGER DEFAULT 1,
  auto_failover_enabled BOOLEAN DEFAULT false,
  configuration JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automated Backup Strategies
CREATE TABLE public.backup_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name TEXT NOT NULL,
  backup_type TEXT NOT NULL, -- 'full', 'incremental', 'differential', 'log'
  frequency INTERVAL NOT NULL,
  retention_period INTERVAL NOT NULL,
  storage_location TEXT NOT NULL,
  encryption_enabled BOOLEAN DEFAULT true,
  compression_enabled BOOLEAN DEFAULT true,
  verification_enabled BOOLEAN DEFAULT true,
  cross_region_copy BOOLEAN DEFAULT false,
  target_regions JSONB DEFAULT '[]',
  backup_window TEXT, -- preferred backup time window
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.backup_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.backup_policies(id),
  backup_name TEXT NOT NULL,
  backup_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  backup_size_bytes BIGINT,
  compressed_size_bytes BIGINT,
  storage_path TEXT,
  verification_status TEXT, -- 'pending', 'passed', 'failed'
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  recovery_point_objective TIMESTAMPTZ,
  next_scheduled_backup TIMESTAMPTZ
);

-- Service Failover Mechanisms
CREATE TABLE public.failover_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  primary_region TEXT NOT NULL,
  secondary_regions JSONB NOT NULL DEFAULT '[]',
  failover_mode TEXT NOT NULL, -- 'manual', 'automatic', 'assisted'
  health_check_config JSONB NOT NULL,
  failover_triggers JSONB NOT NULL DEFAULT '[]',
  recovery_time_objective INTEGER NOT NULL, -- seconds
  recovery_point_objective INTEGER NOT NULL, -- seconds
  traffic_switching_method TEXT NOT NULL, -- 'dns', 'load_balancer', 'service_mesh'
  rollback_procedure JSONB DEFAULT '{}',
  notification_contacts JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.failover_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES public.failover_configurations(id),
  event_type TEXT NOT NULL, -- 'failover_initiated', 'failover_completed', 'fallback_initiated', 'fallback_completed'
  trigger_reason TEXT NOT NULL,
  source_region TEXT NOT NULL,
  target_region TEXT NOT NULL,
  initiated_by TEXT, -- 'system', 'user', 'alert'
  initiated_by_user UUID,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed', 'rolled_back'
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  downtime_seconds INTEGER,
  affected_services JSONB DEFAULT '[]',
  impact_assessment JSONB DEFAULT '{}',
  lessons_learned TEXT,
  post_mortem_url TEXT
);

-- Incident Response Procedures
CREATE TABLE public.incident_response_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  incident_category TEXT NOT NULL, -- 'security', 'performance', 'availability', 'data_loss'
  severity_levels JSONB NOT NULL DEFAULT '[]',
  response_procedures JSONB NOT NULL,
  escalation_matrix JSONB NOT NULL,
  communication_templates JSONB DEFAULT '{}',
  required_roles JSONB DEFAULT '[]',
  sla_targets JSONB DEFAULT '{}',
  external_contacts JSONB DEFAULT '[]',
  runbook_links JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  version TEXT DEFAULT '1.0',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.incident_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'sev1', 'sev2', 'sev3', 'sev4'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'mitigating', 'resolved', 'closed'
  category TEXT NOT NULL,
  affected_services JSONB DEFAULT '[]',
  customer_impact TEXT,
  root_cause TEXT,
  resolution_summary TEXT,
  incident_commander UUID,
  assigned_team JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  communication_log JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}', -- MTTD, MTTR, customer impact metrics
  lessons_learned JSONB DEFAULT '[]',
  action_items JSONB DEFAULT '[]',
  post_mortem_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- System Health & Availability Tracking
CREATE TABLE public.system_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  check_type TEXT NOT NULL, -- 'http', 'tcp', 'database', 'custom'
  status TEXT NOT NULL, -- 'healthy', 'degraded', 'unhealthy'
  response_time_ms INTEGER,
  status_code INTEGER,
  error_message TEXT,
  health_score NUMERIC, -- 0-100
  metadata JSONB DEFAULT '{}',
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.availability_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  measurement_period INTERVAL NOT NULL,
  total_requests BIGINT NOT NULL DEFAULT 0,
  successful_requests BIGINT NOT NULL DEFAULT 0,
  failed_requests BIGINT NOT NULL DEFAULT 0,
  average_response_time_ms NUMERIC,
  p95_response_time_ms NUMERIC,
  p99_response_time_ms NUMERIC,
  uptime_percentage NUMERIC,
  error_rate_percentage NUMERIC,
  sla_compliance BOOLEAN,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all monitoring tables
ALTER TABLE public.metrics_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributed_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centralized_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.database_replicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failover_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failover_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_response_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_tracking ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies for monitoring infrastructure
CREATE POLICY "Admin full access metrics_collection" ON public.metrics_collection FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access business_dashboards" ON public.business_dashboards FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access distributed_traces" ON public.distributed_traces FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access centralized_logs" ON public.centralized_logs FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access sla_configurations" ON public.sla_configurations FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access sla_violations" ON public.sla_violations FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access alert_rules" ON public.alert_rules FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access alert_instances" ON public.alert_instances FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access database_replicas" ON public.database_replicas FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access backup_policies" ON public.backup_policies FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access backup_executions" ON public.backup_executions FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access failover_configurations" ON public.failover_configurations FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access failover_events" ON public.failover_events FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access incident_response_plans" ON public.incident_response_plans FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access incident_records" ON public.incident_records FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access system_health_checks" ON public.system_health_checks FOR ALL USING (is_admin_user());
CREATE POLICY "Admin full access availability_tracking" ON public.availability_tracking FOR ALL USING (is_admin_user());

-- Create indexes for performance
CREATE INDEX idx_metrics_collection_service_timestamp ON public.metrics_collection (service_name, timestamp DESC);
CREATE INDEX idx_metrics_collection_metric_name ON public.metrics_collection (metric_name);
CREATE INDEX idx_distributed_traces_trace_id ON public.distributed_traces (trace_id);
CREATE INDEX idx_distributed_traces_service_time ON public.distributed_traces (service_name, start_time DESC);
CREATE INDEX idx_centralized_logs_service_timestamp ON public.centralized_logs (service_name, created_at DESC);
CREATE INDEX idx_centralized_logs_level ON public.centralized_logs (log_level);
CREATE INDEX idx_sla_violations_config_created ON public.sla_violations (sla_config_id, created_at DESC);
CREATE INDEX idx_alert_instances_status ON public.alert_instances (status);
CREATE INDEX idx_system_health_checks_service_time ON public.system_health_checks (service_name, checked_at DESC);

-- Create triggers for updated_at
CREATE TRIGGER update_business_dashboards_updated_at BEFORE UPDATE ON public.business_dashboards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sla_configurations_updated_at BEFORE UPDATE ON public.sla_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON public.alert_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_database_replicas_updated_at BEFORE UPDATE ON public.database_replicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_backup_policies_updated_at BEFORE UPDATE ON public.backup_policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_failover_configurations_updated_at BEFORE UPDATE ON public.failover_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incident_response_plans_updated_at BEFORE UPDATE ON public.incident_response_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();