#!/bin/bash

# GetIt Multi-Vendor E-commerce - Prometheus Monitoring Setup Script
# Enterprise-grade monitoring for Amazon/Shopee level observability

set -e

echo "📊 Setting up Prometheus Monitoring Stack..."

# Configuration
NAMESPACE="${NAMESPACE:-getit-monitoring}"
ENVIRONMENT="${ENVIRONMENT:-production}"
RETENTION="${RETENTION:-30d}"
STORAGE_SIZE="${STORAGE_SIZE:-100Gi}"

echo "📊 Namespace: $NAMESPACE"
echo "🏷️  Environment: $ENVIRONMENT"
echo "⏰ Retention: $RETENTION"
echo "💾 Storage: $STORAGE_SIZE"

# Create monitoring namespace
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace $NAMESPACE environment=$ENVIRONMENT --overwrite

# Add Prometheus Helm repository
echo "📦 Adding Prometheus Helm repository..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create Prometheus values file
echo "⚙️  Creating Prometheus configuration..."
cat > prometheus-values.yaml << EOF
# Prometheus Configuration for GetIt E-commerce Platform

# Global Configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s

# Server Configuration
prometheus:
  prometheusSpec:
    replicas: 2
    retention: $RETENTION
    retentionSize: "90GB"
    
    # Storage Configuration
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: getit-ssd
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: $STORAGE_SIZE
    
    # Resource Configuration
    resources:
      requests:
        memory: "2Gi"
        cpu: "1000m"
      limits:
        memory: "4Gi"
        cpu: "2000m"
    
    # Security Context
    securityContext:
      runAsNonRoot: true
      runAsUser: 65534
      fsGroup: 65534
    
    # Additional Scrape Configs
    additionalScrapeConfigs:
      - job_name: 'getit-microservices'
        kubernetes_sd_configs:
          - role: endpoints
            namespaces:
              names:
                - getit-production
                - getit-staging
        relabel_configs:
          - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)
          - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
            action: replace
            regex: ([^:]+)(?::\d+)?;(\d+)
            replacement: \$1:\$2
            target_label: __address__
          - action: labelmap
            regex: __meta_kubernetes_service_label_(.+)
          - source_labels: [__meta_kubernetes_namespace]
            action: replace
            target_label: kubernetes_namespace
          - source_labels: [__meta_kubernetes_service_name]
            action: replace
            target_label: kubernetes_name
      
      - job_name: 'bangladesh-payment-gateways'
        static_configs:
          - targets:
            - 'bkash-monitor:8080'
            - 'nagad-monitor:8080'
            - 'rocket-monitor:8080'
        scrape_interval: 30s
        metrics_path: '/metrics'
      
      - job_name: 'node-exporter'
        kubernetes_sd_configs:
          - role: node
        relabel_configs:
          - source_labels: [__address__]
            regex: '(.*):10250'
            replacement: '\$1:9100'
            target_label: __address__
          - action: labelmap
            regex: __meta_kubernetes_node_label_(.+)
    
    # Rule Configuration
    ruleSelector:
      matchLabels:
        app: kube-prometheus-stack
        release: prometheus-stack
    
    # Service Monitor Configuration
    serviceMonitorSelector:
      matchLabels:
        app: getit
    
    # Pod Monitor Configuration
    podMonitorSelector:
      matchLabels:
        app: getit

# Alertmanager Configuration
alertmanager:
  alertmanagerSpec:
    replicas: 2
    retention: 120h
    
    # Storage Configuration
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: getit-ssd
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 10Gi
    
    # Resource Configuration
    resources:
      requests:
        memory: "256Mi"
        cpu: "100m"
      limits:
        memory: "512Mi"
        cpu: "200m"
    
    # Configuration
    config:
      global:
        smtp_smarthost: 'smtp.gmail.com:587'
        smtp_from: 'alerts@getit.com.bd'
        smtp_auth_username: 'alerts@getit.com.bd'
        smtp_auth_password: '${SMTP_PASSWORD}'
      
      route:
        group_by: ['alertname', 'cluster', 'service']
        group_wait: 10s
        group_interval: 10s
        repeat_interval: 1h
        receiver: 'default-receiver'
        routes:
        - match:
            severity: critical
          receiver: 'critical-receiver'
          repeat_interval: 5m
        - match:
            severity: warning
          receiver: 'warning-receiver'
          repeat_interval: 15m
        - match:
            alertname: BangladeshPaymentGatewayDown
          receiver: 'payment-receiver'
          repeat_interval: 2m
      
      receivers:
      - name: 'default-receiver'
        email_configs:
        - to: 'alerts@getit.com.bd'
          subject: '[GetIt] Alert: {{ .GroupLabels.alertname }}'
          body: |
            {{ range .Alerts }}
            Alert: {{ .Annotations.summary }}
            Description: {{ .Annotations.description }}
            Labels: {{ range .Labels.SortedPairs }}{{ .Name }}={{ .Value }} {{ end }}
            {{ end }}
        
        slack_configs:
        - api_url: '${SLACK_WEBHOOK_URL}'
          channel: '#getit-alerts'
          title: '[GetIt] Alert: {{ .GroupLabels.alertname }}'
          text: |
            {{ range .Alerts }}
            {{ .Annotations.summary }}
            {{ .Annotations.description }}
            {{ end }}
      
      - name: 'critical-receiver'
        email_configs:
        - to: 'critical@getit.com.bd'
          subject: '[GetIt CRITICAL] {{ .GroupLabels.alertname }}'
          body: |
            CRITICAL ALERT FOR GETIT PLATFORM
            
            {{ range .Alerts }}
            Alert: {{ .Annotations.summary }}
            Description: {{ .Annotations.description }}
            Severity: {{ .Labels.severity }}
            Time: {{ .StartsAt }}
            {{ end }}
            
            Immediate action required!
        
        slack_configs:
        - api_url: '${SLACK_WEBHOOK_URL}'
          channel: '#getit-critical'
          title: '🚨 [GetIt CRITICAL] {{ .GroupLabels.alertname }}'
          text: |
            CRITICAL ALERT - IMMEDIATE ACTION REQUIRED
            {{ range .Alerts }}
            {{ .Annotations.summary }}
            {{ .Annotations.description }}
            {{ end }}
        
        pagerduty_configs:
        - routing_key: '${PAGERDUTY_KEY}'
          description: '[GetIt] {{ .GroupLabels.alertname }}'
      
      - name: 'warning-receiver'
        slack_configs:
        - api_url: '${SLACK_WEBHOOK_URL}'
          channel: '#getit-warnings'
          title: '⚠️ [GetIt Warning] {{ .GroupLabels.alertname }}'
          text: |
            {{ range .Alerts }}
            {{ .Annotations.summary }}
            {{ .Annotations.description }}
            {{ end }}
      
      - name: 'payment-receiver'
        email_configs:
        - to: 'payments@getit.com.bd'
          subject: '[GetIt Payment Alert] {{ .GroupLabels.alertname }}'
          body: |
            PAYMENT GATEWAY ALERT
            
            {{ range .Alerts }}
            Gateway: {{ .Labels.gateway }}
            Issue: {{ .Annotations.summary }}
            Description: {{ .Annotations.description }}
            {{ end }}
        
        slack_configs:
        - api_url: '${SLACK_WEBHOOK_URL}'
          channel: '#getit-payments'
          title: '💳 [Payment Gateway Alert] {{ .GroupLabels.alertname }}'
          text: |
            {{ range .Alerts }}
            Gateway: {{ .Labels.gateway }}
            {{ .Annotations.summary }}
            {{ end }}

# Grafana Configuration
grafana:
  enabled: true
  
  # Admin Configuration
  adminPassword: '${GRAFANA_ADMIN_PASSWORD}'
  
  # Persistence
  persistence:
    enabled: true
    storageClassName: getit-ssd
    size: 10Gi
  
  # Resources
  resources:
    requests:
      memory: "256Mi"
      cpu: "100m"
    limits:
      memory: "512Mi"
      cpu: "200m"
  
  # Data Sources
  datasources:
    datasources.yaml:
      apiVersion: 1
      datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus-stack-kube-prom-prometheus:9090
        access: proxy
        isDefault: true
      - name: Alertmanager
        type: alertmanager
        url: http://prometheus-stack-kube-prom-alertmanager:9093
        access: proxy
  
  # Dashboard Providers
  dashboardProviders:
    dashboardproviders.yaml:
      apiVersion: 1
      providers:
      - name: 'getit-dashboards'
        orgId: 1
        folder: 'GetIt'
        type: file
        disableDeletion: false
        editable: true
        options:
          path: /var/lib/grafana/dashboards/getit
  
  # Dashboards
  dashboards:
    getit:
      getit-overview:
        gnetId: 15758
        revision: 1
        datasource: Prometheus
      
      getit-microservices:
        gnetId: 6417
        revision: 1
        datasource: Prometheus
      
      getit-bangladesh-payments:
        json: |
          {
            "dashboard": {
              "title": "GetIt Bangladesh Payment Gateways",
              "panels": [
                {
                  "title": "bKash Transaction Volume",
                  "type": "graph",
                  "targets": [
                    {
                      "expr": "rate(bkash_transactions_total[5m])"
                    }
                  ]
                },
                {
                  "title": "Nagad Success Rate",
                  "type": "graph", 
                  "targets": [
                    {
                      "expr": "rate(nagad_successful_transactions[5m]) / rate(nagad_total_transactions[5m])"
                    }
                  ]
                },
                {
                  "title": "Rocket Payment Latency",
                  "type": "graph",
                  "targets": [
                    {
                      "expr": "histogram_quantile(0.95, rate(rocket_payment_duration_seconds_bucket[5m]))"
                    }
                  ]
                }
              ]
            }
          }

# Node Exporter Configuration
nodeExporter:
  enabled: true
  
# Kube State Metrics Configuration  
kubeStateMetrics:
  enabled: true

# Service Monitor for GetIt services
serviceMonitor:
  enabled: true
  namespace: $NAMESPACE
  labels:
    app: getit
EOF

# Install Prometheus Stack
echo "🚀 Installing Prometheus Stack..."
helm upgrade --install prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace $NAMESPACE \
  --values prometheus-values.yaml \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set prometheus.prometheusSpec.podMonitorSelectorNilUsesHelmValues=false \
  --wait

# Create GetIt-specific alerting rules
echo "🚨 Creating GetIt-specific alerting rules..."
cat > getit-alert-rules.yaml << EOF
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: getit-alert-rules
  namespace: $NAMESPACE
  labels:
    app: kube-prometheus-stack
    release: prometheus-stack
spec:
  groups:
  - name: getit.rules
    rules:
    
    # High-level service availability
    - alert: GetItServiceDown
      expr: up{job=~"getit-.*"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "GetIt service {{ \$labels.job }} is down"
        description: "Service {{ \$labels.job }} has been down for more than 1 minute"
    
    # API Gateway specific alerts
    - alert: APIGatewayHighLatency
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="api-gateway"}[5m])) > 0.5
      for: 2m
      labels:
        severity: warning
      annotations:
        summary: "API Gateway high latency detected"
        description: "95th percentile latency is {{ \$value }}s for more than 2 minutes"
    
    - alert: APIGatewayHighErrorRate
      expr: rate(http_requests_total{job="api-gateway",status=~"5.."}[5m]) / rate(http_requests_total{job="api-gateway"}[5m]) > 0.05
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "API Gateway high error rate"
        description: "Error rate is {{ \$value | humanizePercentage }} for more than 1 minute"
    
    # Bangladesh Payment Gateway alerts
    - alert: BangladeshPaymentGatewayDown
      expr: up{job=~".*-payment-gateway"} == 0
      for: 30s
      labels:
        severity: critical
        gateway: "{{ \$labels.gateway }}"
      annotations:
        summary: "Bangladesh payment gateway {{ \$labels.gateway }} is down"
        description: "Payment gateway {{ \$labels.gateway }} has been unreachable for more than 30 seconds"
    
    - alert: BkashHighFailureRate
      expr: rate(bkash_failed_transactions[5m]) / rate(bkash_total_transactions[5m]) > 0.1
      for: 2m
      labels:
        severity: warning
        gateway: "bkash"
      annotations:
        summary: "bKash payment gateway high failure rate"
        description: "bKash failure rate is {{ \$value | humanizePercentage }} for more than 2 minutes"
    
    - alert: NagadPaymentLatency
      expr: histogram_quantile(0.95, rate(nagad_payment_duration_seconds_bucket[5m])) > 10
      for: 3m
      labels:
        severity: warning
        gateway: "nagad"
      annotations:
        summary: "Nagad payment gateway high latency"
        description: "Nagad 95th percentile payment latency is {{ \$value }}s"
    
    # Order processing alerts
    - alert: OrderProcessingBacklog
      expr: getit_order_queue_size > 1000
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High order processing backlog"
        description: "Order queue size is {{ \$value }} orders for more than 5 minutes"
    
    - alert: OrderProcessingFailures
      expr: rate(getit_order_processing_failures[5m]) > 10
      for: 2m
      labels:
        severity: critical
      annotations:
        summary: "High order processing failure rate"
        description: "Order processing failures: {{ \$value }} per minute"
    
    # Vendor performance alerts
    - alert: VendorDashboardSlowResponse
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="vendor-service"}[5m])) > 2
      for: 3m
      labels:
        severity: warning
      annotations:
        summary: "Vendor dashboard slow response"
        description: "Vendor dashboard 95th percentile response time is {{ \$value }}s"
    
    # Database performance alerts
    - alert: DatabaseConnectionPoolExhausted
      expr: getit_db_connections_active / getit_db_connections_max > 0.9
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Database connection pool nearly exhausted"
        description: "Database connection pool utilization is {{ \$value | humanizePercentage }}"
    
    # Search service alerts
    - alert: SearchServiceHighLatency
      expr: histogram_quantile(0.95, rate(search_request_duration_seconds_bucket[5m])) > 1
      for: 2m
      labels:
        severity: warning
      annotations:
        summary: "Search service high latency"
        description: "Search 95th percentile latency is {{ \$value }}s"
    
    # Infrastructure alerts
    - alert: HighMemoryUsage
      expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) > 0.9
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High memory usage on {{ \$labels.instance }}"
        description: "Memory usage is {{ \$value | humanizePercentage }}"
    
    - alert: HighCPUUsage
      expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High CPU usage on {{ \$labels.instance }}"
        description: "CPU usage is {{ \$value }}%"
    
    - alert: DiskSpaceLow
      expr: (1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) > 0.85
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "Low disk space on {{ \$labels.instance }}"
        description: "Disk usage is {{ \$value | humanizePercentage }}"

  - name: getit.business.rules
    rules:
    
    # Business metrics alerts
    - alert: LowDailyRevenue
      expr: getit_daily_revenue < 50000
      for: 30m
      labels:
        severity: warning
      annotations:
        summary: "Daily revenue below target"
        description: "Daily revenue is ৳{{ \$value }}, below ৳50,000 target"
    
    - alert: HighCartAbandonmentRate
      expr: getit_cart_abandonment_rate > 0.7
      for: 10m
      labels:
        severity: warning
      annotations:
        summary: "High cart abandonment rate"
        description: "Cart abandonment rate is {{ \$value | humanizePercentage }}"
    
    - alert: VendorPayoutDelayed
      expr: getit_pending_vendor_payouts > 72
      for: 1h
      labels:
        severity: critical
      annotations:
        summary: "Vendor payouts delayed"
        description: "{{ \$value }} vendor payouts are pending for more than 72 hours"
EOF

kubectl apply -f getit-alert-rules.yaml

# Create Service Monitors for GetIt services
echo "📊 Creating Service Monitors..."
cat > getit-service-monitors.yaml << EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: getit-api-gateway
  namespace: $NAMESPACE
  labels:
    app: getit
spec:
  selector:
    matchLabels:
      app: api-gateway
  namespaceSelector:
    matchNames:
    - getit-production
    - getit-staging
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
    scrapeTimeout: 10s
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: getit-microservices
  namespace: $NAMESPACE
  labels:
    app: getit
spec:
  selector:
    matchLabels:
      tier: backend
  namespaceSelector:
    matchNames:
    - getit-production
    - getit-staging
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
    scrapeTimeout: 10s
EOF

kubectl apply -f getit-service-monitors.yaml

# Wait for Prometheus stack to be ready
echo "⏳ Waiting for Prometheus stack to be ready..."
kubectl wait --for=condition=ready pod -l "app.kubernetes.io/name=prometheus" -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l "app.kubernetes.io/name=grafana" -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l "app.kubernetes.io/name=alertmanager" -n $NAMESPACE --timeout=300s

# Get service URLs
echo "🔗 Getting service URLs..."
GRAFANA_URL="http://$(kubectl get svc prometheus-stack-grafana -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'):80"
PROMETHEUS_URL="http://$(kubectl get svc prometheus-stack-kube-prom-prometheus -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'):9090"
ALERTMANAGER_URL="http://$(kubectl get svc prometheus-stack-kube-prom-alertmanager -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'):9093"

# Generate monitoring setup report
cat > monitoring-setup-report.json << EOF
{
  "setupTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "namespace": "$NAMESPACE",
  "environment": "$ENVIRONMENT",
  "retention": "$RETENTION",
  "storageSize": "$STORAGE_SIZE",
  "components": {
    "prometheus": {
      "replicas": 2,
      "retention": "$RETENTION",
      "storage": "$STORAGE_SIZE",
      "url": "$PROMETHEUS_URL"
    },
    "grafana": {
      "enabled": true,
      "url": "$GRAFANA_URL",
      "adminUser": "admin"
    },
    "alertmanager": {
      "replicas": 2,
      "url": "$ALERTMANAGER_URL",
      "retention": "120h"
    },
    "nodeExporter": {
      "enabled": true
    },
    "kubeStateMetrics": {
      "enabled": true
    }
  },
  "alerting": {
    "rules": 20,
    "channels": ["email", "slack", "pagerduty"],
    "specialRules": [
      "BangladeshPaymentGateway",
      "OrderProcessing",
      "VendorPayouts"
    ]
  },
  "monitoring": {
    "microservices": true,
    "paymentGateways": true,
    "businessMetrics": true,
    "infrastructure": true
  }
}
EOF

# Cleanup
rm -f prometheus-values.yaml getit-alert-rules.yaml getit-service-monitors.yaml

echo "✅ Prometheus monitoring setup completed!"
echo "📊 Prometheus: $PROMETHEUS_URL"
echo "📈 Grafana: $GRAFANA_URL (admin/\$GRAFANA_ADMIN_PASSWORD)"
echo "🚨 Alertmanager: $ALERTMANAGER_URL"
echo "📋 Rules: 20+ alerting rules configured"
echo "🇧🇩 Bangladesh payment gateway monitoring: Enabled"

# Display status
kubectl get pods -n $NAMESPACE
kubectl get svc -n $NAMESPACE