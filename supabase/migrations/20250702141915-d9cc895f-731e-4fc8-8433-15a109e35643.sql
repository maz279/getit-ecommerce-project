-- Insert initial monitoring configurations
INSERT INTO public.business_dashboards (dashboard_name, dashboard_type, panels, data_sources, access_permissions) VALUES
('Executive Overview', 'executive', '[
  {"title": "Total Revenue", "type": "metric", "query": "revenue_total"},
  {"title": "Active Users", "type": "metric", "query": "users_active"},
  {"title": "Order Volume", "type": "chart", "query": "orders_count"},
  {"title": "Vendor Performance", "type": "table", "query": "vendor_metrics"}
]', '[
  {"name": "metrics", "type": "prometheus"},
  {"name": "business", "type": "database"}
]', '{"roles": ["admin", "executive"]}'),
('Vendor Dashboard', 'vendor', '[
  {"title": "Sales Performance", "type": "chart", "query": "vendor_sales"},
  {"title": "Product Views", "type": "metric", "query": "product_views"},
  {"title": "Order Status", "type": "pie", "query": "order_status"},
  {"title": "Commission Earnings", "type": "metric", "query": "commission_total"}
]', '[
  {"name": "vendor_metrics", "type": "database"}
]', '{"roles": ["vendor"]}'),
('Operational Monitoring', 'operational', '[
  {"title": "System Health", "type": "status", "query": "system_health"},
  {"title": "Response Times", "type": "chart", "query": "response_times"},
  {"title": "Error Rates", "type": "chart", "query": "error_rates"},
  {"title": "Active Alerts", "type": "list", "query": "active_alerts"}
]', '[
  {"name": "monitoring", "type": "prometheus"},
  {"name": "logs", "type": "elasticsearch"}
]', '{"roles": ["admin", "ops"]}');

INSERT INTO public.sla_configurations (service_name, sla_type, target_value, warning_threshold, critical_threshold) VALUES
('user-service', 'availability', 99.9, 99.5, 99.0),
('product-service', 'response_time', 500, 800, 1000),
('order-service', 'availability', 99.95, 99.8, 99.5),
('payment-service', 'availability', 99.99, 99.95, 99.9),
('api-gateway', 'error_rate', 1.0, 2.0, 5.0);

INSERT INTO public.alert_rules (rule_name, rule_type, conditions, severity, notification_channels) VALUES
('High Error Rate', 'threshold', '{"metric": "error_rate", "operator": ">", "value": 5}', 'critical', '["email", "slack", "sms"]'),
('Service Down', 'threshold', '{"metric": "availability", "operator": "<", "value": 95}', 'emergency', '["email", "slack", "sms", "phone"]'),
('High Response Time', 'threshold', '{"metric": "response_time_p95", "operator": ">", "value": 2000}', 'warning', '["slack"]'),
('Database Connection Pool Full', 'threshold', '{"metric": "db_connections", "operator": ">", "value": 90}', 'critical', '["email", "slack"]');

INSERT INTO public.backup_policies (policy_name, backup_type, frequency, retention_period, storage_location) VALUES
('Daily Full Backup', 'full', '1 day', '30 days', 's3://backups/daily/'),
('Hourly Incremental', 'incremental', '1 hour', '7 days', 's3://backups/incremental/'),
('Weekly Archive', 'full', '7 days', '1 year', 's3://backups/archive/'),
('Transaction Log Backup', 'log', '15 minutes', '3 days', 's3://backups/logs/');

INSERT INTO public.failover_configurations (service_name, primary_region, secondary_regions, failover_mode, health_check_config, recovery_time_objective, recovery_point_objective, traffic_switching_method) VALUES
('user-service', 'us-east-1', '["us-west-2", "eu-west-1"]', 'automatic', '{"endpoint": "/health", "interval": 30, "timeout": 10}', 300, 60, 'load_balancer'),
('payment-service', 'us-east-1', '["us-west-2"]', 'manual', '{"endpoint": "/health", "interval": 15, "timeout": 5}', 120, 30, 'dns'),
('order-service', 'us-east-1', '["us-west-2", "ap-southeast-1"]', 'assisted', '{"endpoint": "/health", "interval": 30, "timeout": 10}', 180, 45, 'service_mesh');

INSERT INTO public.incident_response_plans (plan_name, incident_category, severity_levels, response_procedures, escalation_matrix) VALUES
('Service Outage Response', 'availability', '["sev1", "sev2", "sev3"]', '{
  "sev1": {
    "response_time": "5 minutes",
    "actions": ["page_oncall", "create_incident", "notify_executives"],
    "roles": ["incident_commander", "technical_lead", "communications"]
  },
  "sev2": {
    "response_time": "15 minutes", 
    "actions": ["notify_oncall", "create_incident", "assess_impact"],
    "roles": ["incident_commander", "technical_lead"]
  }
}', '{
  "level1": {"role": "oncall_engineer", "timeout": "5 minutes"},
  "level2": {"role": "engineering_manager", "timeout": "15 minutes"},
  "level3": {"role": "engineering_director", "timeout": "30 minutes"}
}'),
('Security Incident Response', 'security', '["sev1", "sev2", "sev3", "sev4"]', '{
  "sev1": {
    "response_time": "immediate",
    "actions": ["isolate_systems", "preserve_evidence", "notify_authorities"],
    "roles": ["security_lead", "incident_commander", "legal"]
  }
}', '{
  "level1": {"role": "security_oncall", "timeout": "immediate"},
  "level2": {"role": "security_manager", "timeout": "10 minutes"},
  "level3": {"role": "ciso", "timeout": "20 minutes"}
}');