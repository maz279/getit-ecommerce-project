#!/bin/bash

# GetIt Multi-Vendor E-commerce - Microservices Deployment Script
# Deploy all microservices to Kubernetes with Amazon/Shopee level architecture

set -e

echo "🚀 Deploying GetIt Microservices..."

# Configuration
NAMESPACE="${NAMESPACE:-getit-production}"
ENVIRONMENT="${ENVIRONMENT:-production}"
IMAGE_REGISTRY="${IMAGE_REGISTRY:-your-registry.com}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "📦 Namespace: $NAMESPACE"
echo "🏷️  Environment: $ENVIRONMENT"
echo "🖼️  Registry: $IMAGE_REGISTRY"
echo "🏷️  Tag: $IMAGE_TAG"

# Ensure namespace exists
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace $NAMESPACE environment=$ENVIRONMENT --overwrite

# Create secrets
echo "🔐 Creating secrets..."

# Database secrets
kubectl create secret generic getit-db-secrets \
  --namespace=$NAMESPACE \
  --from-literal=SUPABASE_URL="${SUPABASE_URL}" \
  --from-literal=SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}" \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}" \
  --dry-run=client -o yaml | kubectl apply -f -

# API Gateway Deployment
echo "🌐 Deploying API Gateway..."
cat > api-gateway-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: $NAMESPACE
  labels:
    app: api-gateway
    tier: gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
        tier: gateway
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: api-gateway
        image: $IMAGE_REGISTRY/getit-api-gateway:$IMAGE_TAG
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: PORT
          value: "3000"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  namespace: $NAMESPACE
  labels:
    app: api-gateway
spec:
  selector:
    app: api-gateway
  ports:
  - port: 80
    targetPort: 3000
    name: http
  type: ClusterIP
EOF

kubectl apply -f api-gateway-deployment.yaml

# User Service Deployment
echo "👤 Deploying User Service..."
cat > user-service-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: $NAMESPACE
  labels:
    app: user-service
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        tier: backend
    spec:
      containers:
      - name: user-service
        image: $IMAGE_REGISTRY/getit-user-service:$IMAGE_TAG
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: SERVICE_PORT
          value: "3001"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: $NAMESPACE
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 3001
  type: ClusterIP
EOF

kubectl apply -f user-service-deployment.yaml

# Product Service Deployment
echo "🛍️  Deploying Product Service..."
cat > product-service-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
  namespace: $NAMESPACE
  labels:
    app: product-service
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: product-service
  template:
    metadata:
      labels:
        app: product-service
        tier: backend
    spec:
      containers:
      - name: product-service
        image: $IMAGE_REGISTRY/getit-product-service:$IMAGE_TAG
        ports:
        - containerPort: 3002
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: SERVICE_PORT
          value: "3002"
        - name: ELASTICSEARCH_URL
          value: "http://elasticsearch:9200"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: product-service
  namespace: $NAMESPACE
spec:
  selector:
    app: product-service
  ports:
  - port: 80
    targetPort: 3002
  type: ClusterIP
EOF

kubectl apply -f product-service-deployment.yaml

# Order Service Deployment
echo "📦 Deploying Order Service..."
cat > order-service-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  namespace: $NAMESPACE
  labels:
    app: order-service
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
        tier: backend
    spec:
      containers:
      - name: order-service
        image: $IMAGE_REGISTRY/getit-order-service:$IMAGE_TAG
        ports:
        - containerPort: 3003
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: SERVICE_PORT
          value: "3003"
        - name: REDIS_URL
          value: "redis://redis:6379"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: order-service
  namespace: $NAMESPACE
spec:
  selector:
    app: order-service
  ports:
  - port: 80
    targetPort: 3003
  type: ClusterIP
EOF

kubectl apply -f order-service-deployment.yaml

# Payment Service Deployment
echo "💳 Deploying Payment Service..."
cat > payment-service-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
  namespace: $NAMESPACE
  labels:
    app: payment-service
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: payment-service
  template:
    metadata:
      labels:
        app: payment-service
        tier: backend
    spec:
      containers:
      - name: payment-service
        image: $IMAGE_REGISTRY/getit-payment-service:$IMAGE_TAG
        ports:
        - containerPort: 3004
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: SERVICE_PORT
          value: "3004"
        - name: BKASH_BASE_URL
          value: "https://tokenized.pay.bka.sh/v1.2.0-beta"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        - secretRef:
            name: getit-payment-secrets
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "250m"
        securityContext:
          runAsNonRoot: true
          readOnlyRootFilesystem: true
---
apiVersion: v1
kind: Service
metadata:
  name: payment-service
  namespace: $NAMESPACE
spec:
  selector:
    app: payment-service
  ports:
  - port: 80
    targetPort: 3004
  type: ClusterIP
EOF

kubectl apply -f payment-service-deployment.yaml

# Vendor Service Deployment
echo "🏪 Deploying Vendor Service..."
cat > vendor-service-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vendor-service
  namespace: $NAMESPACE
  labels:
    app: vendor-service
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vendor-service
  template:
    metadata:
      labels:
        app: vendor-service
        tier: backend
    spec:
      containers:
      - name: vendor-service
        image: $IMAGE_REGISTRY/getit-vendor-service:$IMAGE_TAG
        ports:
        - containerPort: 3005
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: SERVICE_PORT
          value: "3005"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: vendor-service
  namespace: $NAMESPACE
spec:
  selector:
    app: vendor-service
  ports:
  - port: 80
    targetPort: 3005
  type: ClusterIP
EOF

kubectl apply -f vendor-service-deployment.yaml

# Notification Service Deployment
echo "📢 Deploying Notification Service..."
cat > notification-service-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notification-service
  namespace: $NAMESPACE
  labels:
    app: notification-service
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: notification-service
  template:
    metadata:
      labels:
        app: notification-service
        tier: backend
    spec:
      containers:
      - name: notification-service
        image: $IMAGE_REGISTRY/getit-notification-service:$IMAGE_TAG
        ports:
        - containerPort: 3006
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: SERVICE_PORT
          value: "3006"
        - name: REDIS_URL
          value: "redis://redis:6379"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: notification-service
  namespace: $NAMESPACE
spec:
  selector:
    app: notification-service
  ports:
  - port: 80
    targetPort: 3006
  type: ClusterIP
EOF

kubectl apply -f notification-service-deployment.yaml

# Analytics Service Deployment
echo "📊 Deploying Analytics Service..."
cat > analytics-service-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: analytics-service
  namespace: $NAMESPACE
  labels:
    app: analytics-service
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: analytics-service
  template:
    metadata:
      labels:
        app: analytics-service
        tier: backend
    spec:
      containers:
      - name: analytics-service
        image: $IMAGE_REGISTRY/getit-analytics-service:$IMAGE_TAG
        ports:
        - containerPort: 3007
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: SERVICE_PORT
          value: "3007"
        - name: CLICKHOUSE_URL
          value: "http://clickhouse:8123"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: analytics-service
  namespace: $NAMESPACE
spec:
  selector:
    app: analytics-service
  ports:
  - port: 80
    targetPort: 3007
  type: ClusterIP
EOF

kubectl apply -f analytics-service-deployment.yaml

# Search Service Deployment
echo "🔍 Deploying Search Service..."
cat > search-service-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: search-service
  namespace: $NAMESPACE
  labels:
    app: search-service
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: search-service
  template:
    metadata:
      labels:
        app: search-service
        tier: backend
    spec:
      containers:
      - name: search-service
        image: $IMAGE_REGISTRY/getit-search-service:$IMAGE_TAG
        ports:
        - containerPort: 3008
        env:
        - name: NODE_ENV
          value: "$ENVIRONMENT"
        - name: SERVICE_PORT
          value: "3008"
        - name: ELASTICSEARCH_URL
          value: "http://elasticsearch:9200"
        envFrom:
        - secretRef:
            name: getit-db-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: search-service
  namespace: $NAMESPACE
spec:
  selector:
    app: search-service
  ports:
  - port: 80
    targetPort: 3008
  type: ClusterIP
EOF

kubectl apply -f search-service-deployment.yaml

# Create Horizontal Pod Autoscalers
echo "📈 Creating Horizontal Pod Autoscalers..."
cat > hpa-configs.yaml << EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: $NAMESPACE
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: product-service-hpa
  namespace: $NAMESPACE
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: product-service
  minReplicas: 3
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-service-hpa
  namespace: $NAMESPACE
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-service
  minReplicas: 3
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
EOF

kubectl apply -f hpa-configs.yaml

# Create Network Policies
echo "🔒 Creating Network Policies..."
cat > network-policies.yaml << EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-gateway-network-policy
  namespace: $NAMESPACE
spec:
  podSelector:
    matchLabels:
      app: api-gateway
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: istio-system
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          tier: backend
    ports:
    - protocol: TCP
      port: 80
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-services-network-policy
  namespace: $NAMESPACE
spec:
  podSelector:
    matchLabels:
      tier: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-gateway
  egress:
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 443
  - to: []
    ports:
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379
    - protocol: TCP
      port: 9200
EOF

kubectl apply -f network-policies.yaml

# Create Service Monitor for Prometheus
echo "📊 Creating Service Monitors..."
cat > service-monitors.yaml << EOF
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
      tier: gateway
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
  namespaceSelector:
    matchNames:
    - $NAMESPACE
EOF

kubectl apply -f service-monitors.yaml

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
SERVICES=("api-gateway" "user-service" "product-service" "order-service" "payment-service" "vendor-service" "notification-service" "analytics-service" "search-service")

for service in "${SERVICES[@]}"; do
  echo "⏳ Waiting for $service..."
  kubectl wait --for=condition=available --timeout=300s deployment/$service -n $NAMESPACE
done

# Verify deployments
echo "✅ Verifying deployments..."
kubectl get deployments -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get hpa -n $NAMESPACE

# Generate deployment report
cat > microservices-deployment-report.json << EOF
{
  "deploymentTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "namespace": "$NAMESPACE",
  "environment": "$ENVIRONMENT",
  "imageTag": "$IMAGE_TAG",
  "services": {
    "apiGateway": {
      "replicas": 3,
      "port": 3000,
      "hpa": true
    },
    "userService": {
      "replicas": 2,
      "port": 3001,
      "hpa": false
    },
    "productService": {
      "replicas": 3,
      "port": 3002,
      "hpa": true
    },
    "orderService": {
      "replicas": 3,
      "port": 3003,
      "hpa": true
    },
    "paymentService": {
      "replicas": 2,
      "port": 3004,
      "hpa": false
    },
    "vendorService": {
      "replicas": 2,
      "port": 3005,
      "hpa": false
    },
    "notificationService": {
      "replicas": 2,
      "port": 3006,
      "hpa": false
    },
    "analyticsService": {
      "replicas": 2,
      "port": 3007,
      "hpa": false
    },
    "searchService": {
      "replicas": 3,
      "port": 3008,
      "hpa": false
    }
  },
  "features": {
    "autoScaling": true,
    "networkPolicies": true,
    "monitoring": true,
    "loadBalancing": true
  }
}
EOF

# Cleanup deployment files
rm -f *-deployment.yaml *-configs.yaml *-policies.yaml *-monitors.yaml

echo "✅ Microservices deployment completed!"
echo "📦 Namespace: $NAMESPACE"
echo "🚀 Services: ${#SERVICES[@]}"
echo "📈 Auto-scaling: Enabled"
echo "🔒 Network policies: Applied"
echo "📊 Monitoring: Configured"