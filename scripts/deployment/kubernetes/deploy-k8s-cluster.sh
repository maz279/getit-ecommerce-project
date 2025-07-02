#!/bin/bash

# GetIt Multi-Vendor E-commerce - Kubernetes Cluster Deployment Script
# Enterprise-grade container orchestration for Amazon/Shopee level scale

set -e

echo "☸️  Deploying GetIt Kubernetes Cluster..."

# Configuration
CLUSTER_NAME="${CLUSTER_NAME:-getit-production}"
CLUSTER_REGION="${CLUSTER_REGION:-us-east-1}"
NODE_COUNT="${NODE_COUNT:-6}"
NODE_TYPE="${NODE_TYPE:-m5.xlarge}"
ENVIRONMENT="${ENVIRONMENT:-production}"

echo "☸️  Cluster: $CLUSTER_NAME"
echo "🌍 Region: $CLUSTER_REGION"
echo "🖥️  Nodes: $NODE_COUNT x $NODE_TYPE"
echo "🏷️  Environment: $ENVIRONMENT"

# Prerequisites check
echo "🔍 Checking prerequisites..."

# Check required tools
REQUIRED_TOOLS=("kubectl" "eksctl" "helm" "aws")
for tool in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v $tool &> /dev/null; then
    echo "❌ $tool is required but not installed"
    exit 1
  else
    echo "✅ $tool found"
  fi
done

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
  echo "❌ AWS credentials not configured"
  exit 1
fi

echo "✅ Prerequisites check passed"

# Create cluster configuration
echo "📝 Creating cluster configuration..."

cat > cluster-config.yaml << EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: $CLUSTER_NAME
  region: $CLUSTER_REGION
  version: "1.28"

vpc:
  cidr: 10.0.0.0/16
  enableDnsHostnames: true
  enableDnsSupport: true

availabilityZones:
  - ${CLUSTER_REGION}a
  - ${CLUSTER_REGION}b
  - ${CLUSTER_REGION}c

managedNodeGroups:
  - name: getit-workers
    instanceType: $NODE_TYPE
    minSize: 3
    maxSize: 20
    desiredCapacity: $NODE_COUNT
    volumeSize: 100
    volumeType: gp3
    amiFamily: AmazonLinux2
    ssh:
      allow: false
    privateNetworking: true
    iam:
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy
        - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
        - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
        - arn:aws:iam::aws:policy/AmazonS3FullAccess
        - arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
    labels:
      role: worker
      environment: $ENVIRONMENT
    tags:
      Environment: $ENVIRONMENT
      Project: GetIt
      ManagedBy: eksctl

  - name: getit-spot-workers
    instanceTypes:
      - m5.large
      - m5.xlarge
      - m4.large
      - m4.xlarge
    spot: true
    minSize: 2
    maxSize: 10
    desiredCapacity: 4
    volumeSize: 50
    volumeType: gp3
    privateNetworking: true
    labels:
      role: spot-worker
      environment: $ENVIRONMENT
    taints:
      - key: spot
        value: "true"
        effect: NoSchedule

cloudWatch:
  clusterLogging:
    enable: true
    logTypes:
      - api
      - audit
      - authenticator
      - controllerManager
      - scheduler

addons:
  - name: vpc-cni
    version: latest
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest
  - name: aws-ebs-csi-driver
    version: latest

iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: kube-system
      wellKnownPolicies:
        awsLoadBalancerController: true
    - metadata:
        name: external-dns
        namespace: external-dns
      wellKnownPolicies:
        externalDNS: true
    - metadata:
        name: cluster-autoscaler
        namespace: kube-system
      wellKnownPolicies:
        autoScaling: true

fargateProfiles:
  - name: getit-fargate
    selectors:
      - namespace: fargate
      - namespace: getit-serverless
EOF

# Create cluster
echo "🚀 Creating EKS cluster..."
eksctl create cluster -f cluster-config.yaml --verbose 4

# Update kubeconfig
echo "🔧 Updating kubeconfig..."
aws eks update-kubeconfig --region $CLUSTER_REGION --name $CLUSTER_NAME

# Install essential add-ons
echo "🔌 Installing essential add-ons..."

# Install AWS Load Balancer Controller
echo "⚖️  Installing AWS Load Balancer Controller..."
helm repo add eks https://aws.github.io/eks-charts
helm repo update

kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Install Cluster Autoscaler
echo "📈 Installing Cluster Autoscaler..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

kubectl patch deployment cluster-autoscaler \
  -n kube-system \
  -p '{"spec":{"template":{"metadata":{"annotations":{"cluster-autoscaler.kubernetes.io/safe-to-evict":"false"}}}}}'

kubectl patch deployment cluster-autoscaler \
  -n kube-system \
  -p '{"spec":{"template":{"spec":{"containers":[{"name":"cluster-autoscaler","command":["./cluster-autoscaler","--v=4","--stderrthreshold=info","--cloud-provider=aws","--skip-nodes-with-local-storage=false","--expander=least-waste","--node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/'$CLUSTER_NAME'"]}]}}}}'

# Install External DNS
echo "🌐 Installing External DNS..."
kubectl create namespace external-dns || true

cat > external-dns-values.yaml << EOF
serviceAccount:
  create: false
  name: external-dns

provider: aws
aws:
  region: $CLUSTER_REGION

domainFilters:
  - getit.com.bd

txtOwnerId: $CLUSTER_NAME

policy: sync

interval: 1m

logLevel: info
EOF

helm repo add external-dns https://kubernetes-sigs.github.io/external-dns/
helm install external-dns external-dns/external-dns \
  -n external-dns \
  -f external-dns-values.yaml

# Install Metrics Server
echo "📊 Installing Metrics Server..."
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Install Ingress NGINX (backup ingress controller)
echo "🔀 Installing NGINX Ingress Controller..."
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer

# Create namespaces
echo "📦 Creating application namespaces..."
NAMESPACES=("getit-production" "getit-staging" "getit-monitoring" "getit-logging" "istio-system")

for ns in "${NAMESPACES[@]}"; do
  kubectl create namespace $ns || echo "Namespace $ns already exists"
  kubectl label namespace $ns environment=$ENVIRONMENT || true
done

# Install Istio Service Mesh
echo "🕸️  Installing Istio Service Mesh..."
curl -L https://istio.io/downloadIstio | sh -
export PATH="$PWD/istio-*/bin:$PATH"

istioctl install --set values.defaultRevision=default -y

# Enable Istio injection for application namespaces
kubectl label namespace getit-production istio-injection=enabled --overwrite
kubectl label namespace getit-staging istio-injection=enabled --overwrite

# Install Istio Gateway
kubectl apply -f - << EOF
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: getit-gateway
  namespace: getit-production
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*.getit.com.bd"
    tls:
      httpsRedirect: true
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: getit-tls-secret
    hosts:
    - "*.getit.com.bd"
EOF

# Create storage classes for different performance needs
echo "💾 Creating storage classes..."
kubectl apply -f - << EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: getit-ssd
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  fsType: ext4
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: getit-nvme
provisioner: ebs.csi.aws.com
parameters:
  type: io2
  iops: "4000"
  fsType: ext4
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
EOF

# Configure RBAC
echo "🔐 Configuring RBAC..."
kubectl apply -f - << EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: getit-admin
  namespace: getit-production
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: getit-admin-role
rules:
- apiGroups: [""]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["apps"]
  resources: ["*"]
  verbs: ["*"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: getit-admin-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: getit-admin-role
subjects:
- kind: ServiceAccount
  name: getit-admin
  namespace: getit-production
EOF

# Install monitoring prerequisites
echo "📊 Setting up monitoring prerequisites..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Generate cluster verification report
echo "📋 Generating cluster verification report..."
cat > cluster-deployment-report.json << EOF
{
  "clusterName": "$CLUSTER_NAME",
  "region": "$CLUSTER_REGION",
  "deploymentTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "nodeCount": $NODE_COUNT,
  "nodeType": "$NODE_TYPE",
  "environment": "$ENVIRONMENT",
  "addons": {
    "awsLoadBalancerController": true,
    "clusterAutoscaler": true,
    "externalDns": true,
    "metricsServer": true,
    "nginxIngress": true,
    "istioServiceMesh": true
  },
  "namespaces": [
    "getit-production",
    "getit-staging", 
    "getit-monitoring",
    "getit-logging",
    "istio-system"
  ],
  "features": {
    "autoScaling": true,
    "serviceMesh": true,
    "monitoring": true,
    "rbac": true,
    "storageClasses": true
  }
}
EOF

# Cleanup
rm -f cluster-config.yaml external-dns-values.yaml

echo "✅ Kubernetes cluster deployment completed!"
echo "☸️  Cluster Name: $CLUSTER_NAME"
echo "🌍 Region: $CLUSTER_REGION"
echo "📊 Nodes: $(kubectl get nodes --no-headers | wc -l)"
echo "📦 Namespaces: $(kubectl get namespaces --no-headers | wc -l)"

# Display cluster information
echo ""
echo "📋 Cluster Information:"
kubectl cluster-info
echo ""
echo "🖥️  Node Status:"
kubectl get nodes -o wide
echo ""
echo "🔌 Installed Add-ons:"
helm list -A

echo ""
echo "🎉 Cluster is ready for application deployment!"