#!/bin/bash

# GetIt Amazon EKS Deployment Script
# Production-grade Kubernetes cluster deployment on AWS

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
CLUSTER_NAME="getit-production-cluster"
REGION="ap-southeast-1"
NODE_GROUP_NAME="getit-workers"
KUBERNETES_VERSION="1.28"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found. Please install AWS CLI first."
        exit 1
    fi
    
    # Check eksctl
    if ! command -v eksctl &> /dev/null; then
        log_error "eksctl not found. Installing eksctl..."
        curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
        sudo mv /tmp/eksctl /usr/local/bin
    fi
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl not found. Installing kubectl..."
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        chmod +x kubectl
        sudo mv kubectl /usr/local/bin/
    fi
    
    # Check helm
    if ! command -v helm &> /dev/null; then
        log_error "Helm not found. Installing Helm..."
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
    fi
    
    # Verify AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Create EKS cluster configuration
create_cluster_config() {
    log_info "Creating EKS cluster configuration..."
    
    cat > "$PROJECT_ROOT/eks-cluster-config.yaml" << EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: $CLUSTER_NAME
  region: $REGION
  version: "$KUBERNETES_VERSION"
  tags:
    Environment: production
    Project: getit
    ManagedBy: eksctl

# VPC Configuration
vpc:
  enableDnsHostnames: true
  enableDnsSupport: true
  cidr: "10.0.0.0/16"
  subnets:
    public:
      public-1a:
        cidr: "10.0.1.0/24"
        az: ${REGION}a
      public-1b:
        cidr: "10.0.2.0/24"
        az: ${REGION}b
      public-1c:
        cidr: "10.0.3.0/24"
        az: ${REGION}c
    private:
      private-1a:
        cidr: "10.0.11.0/24"
        az: ${REGION}a
      private-1b:
        cidr: "10.0.12.0/24"
        az: ${REGION}b
      private-1c:
        cidr: "10.0.13.0/24"
        az: ${REGION}c

# IAM Configuration
iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: kube-system
      wellKnownPolicies:
        awsLoadBalancerController: true
    - metadata:
        name: cluster-autoscaler
        namespace: kube-system
      wellKnownPolicies:
        autoScaler: true
    - metadata:
        name: ebs-csi-controller-sa
        namespace: kube-system
      wellKnownPolicies:
        ebsCSIController: true

# Addons
addons:
  - name: vpc-cni
    version: latest
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest
  - name: aws-ebs-csi-driver
    version: latest
    serviceAccountRoleARN: arn:aws:iam::ACCOUNT_ID:role/AmazonEKS_EBS_CSI_DriverRole

# Node Groups
nodeGroups:
  # General purpose node group
  - name: $NODE_GROUP_NAME-general
    instanceType: m5.large
    desiredCapacity: 3
    minSize: 1
    maxSize: 10
    volumeSize: 50
    volumeType: gp3
    amiFamily: AmazonLinux2
    labels:
      role: general
    tags:
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/$CLUSTER_NAME: "owned"
    iam:
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy
        - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
        - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
        - arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
    ssh:
      publicKeyName: getit-eks-keypair
    privateNetworking: true

  # Memory optimized for databases
  - name: $NODE_GROUP_NAME-memory
    instanceType: r5.large
    desiredCapacity: 2
    minSize: 1
    maxSize: 5
    volumeSize: 100
    volumeType: gp3
    amiFamily: AmazonLinux2
    labels:
      role: memory-optimized
    taints:
      - key: workload
        value: memory-intensive
        effect: NoSchedule
    tags:
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/$CLUSTER_NAME: "owned"
    privateNetworking: true

  # Compute optimized for processing
  - name: $NODE_GROUP_NAME-compute
    instanceType: c5.xlarge
    desiredCapacity: 2
    minSize: 0
    maxSize: 8
    volumeSize: 50
    volumeType: gp3
    amiFamily: AmazonLinux2
    labels:
      role: compute-optimized
    taints:
      - key: workload
        value: compute-intensive
        effect: NoSchedule
    tags:
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/$CLUSTER_NAME: "owned"
    privateNetworking: true

# Managed Node Groups for Spot instances
managedNodeGroups:
  - name: $NODE_GROUP_NAME-spot
    instanceTypes:
      - m5.large
      - m5.xlarge
      - m4.large
      - m4.xlarge
    spot: true
    desiredCapacity: 2
    minSize: 0
    maxSize: 10
    volumeSize: 50
    volumeType: gp3
    labels:
      lifecycle: spot
    tags:
      k8s.io/cluster-autoscaler/enabled: "true"
      k8s.io/cluster-autoscaler/$CLUSTER_NAME: "owned"
    privateNetworking: true

# CloudWatch Logging
cloudWatch:
  clusterLogging:
    enableTypes: ["audit", "authenticator", "controllerManager", "scheduler", "api"]
    logRetentionInDays: 30
EOF

    log_success "EKS cluster configuration created"
}

# Create SSH key pair
create_ssh_keypair() {
    log_info "Creating SSH key pair for EKS nodes..."
    
    # Check if key pair already exists
    if aws ec2 describe-key-pairs --key-names getit-eks-keypair --region $REGION &> /dev/null; then
        log_info "SSH key pair already exists"
        return
    fi
    
    # Generate SSH key pair
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/getit-eks-keypair -N ""
    
    # Import public key to AWS
    aws ec2 import-key-pair \
        --key-name getit-eks-keypair \
        --public-key-material fileb://~/.ssh/getit-eks-keypair.pub \
        --region $REGION
    
    log_success "SSH key pair created and imported to AWS"
}

# Deploy EKS cluster
deploy_cluster() {
    log_info "Deploying EKS cluster... This may take 15-20 minutes"
    
    # Get AWS account ID and replace in config
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    sed -i "s/ACCOUNT_ID/$ACCOUNT_ID/g" "$PROJECT_ROOT/eks-cluster-config.yaml"
    
    # Create the cluster
    eksctl create cluster -f "$PROJECT_ROOT/eks-cluster-config.yaml" --verbose 4
    
    # Update kubeconfig
    aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME
    
    log_success "EKS cluster deployed successfully"
}

# Install essential addons
install_addons() {
    log_info "Installing essential Kubernetes addons..."
    
    # AWS Load Balancer Controller
    log_info "Installing AWS Load Balancer Controller..."
    helm repo add eks https://aws.github.io/eks-charts
    helm repo update
    
    helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
        -n kube-system \
        --set clusterName=$CLUSTER_NAME \
        --set serviceAccount.create=false \
        --set serviceAccount.name=aws-load-balancer-controller \
        --set region=$REGION \
        --set vpcId=$(aws eks describe-cluster --name $CLUSTER_NAME --query "cluster.resourcesVpcConfig.vpcId" --output text)
    
    # Cluster Autoscaler
    log_info "Installing Cluster Autoscaler..."
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml
    
    # Patch cluster autoscaler deployment
    kubectl patch deployment cluster-autoscaler \
        -n kube-system \
        -p '{"spec":{"template":{"metadata":{"annotations":{"cluster-autoscaler.kubernetes.io/safe-to-evict":"false"}}}}}'
    
    kubectl patch deployment cluster-autoscaler \
        -n kube-system \
        -p '{"spec":{"template":{"spec":{"containers":[{"name":"cluster-autoscaler","command":["./cluster-autoscaler","--v=4","--stderrthreshold=info","--cloud-provider=aws","--skip-nodes-with-local-storage=false","--expander=least-waste","--node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/'$CLUSTER_NAME'","--balance-similar-node-groups","--skip-nodes-with-system-pods=false"]}]}}}}'
    
    # AWS EBS CSI Driver
    log_info "Installing AWS EBS CSI Driver..."
    eksctl create iamserviceaccount \
        --name ebs-csi-controller-sa \
        --namespace kube-system \
        --cluster $CLUSTER_NAME \
        --region $REGION \
        --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
        --approve \
        --override-existing-serviceaccounts
    
    # Metrics Server
    log_info "Installing Metrics Server..."
    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
    
    log_success "Essential addons installed"
}

# Setup monitoring stack
setup_monitoring() {
    log_info "Setting up monitoring stack..."
    
    # Create monitoring namespace
    kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
    
    # Add Prometheus Helm repository
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update
    
    # Install Prometheus
    helm install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
        --set prometheus.prometheusSpec.retention=30d \
        --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi \
        --set grafana.adminPassword=admin123 \
        --set grafana.service.type=LoadBalancer
    
    # Wait for Grafana to be ready
    kubectl wait --for=condition=available --timeout=300s deployment/prometheus-grafana -n monitoring
    
    log_success "Monitoring stack deployed"
}

# Setup ingress controller
setup_ingress() {
    log_info "Setting up NGINX Ingress Controller..."
    
    # Add NGINX Helm repository
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    
    # Install NGINX Ingress Controller
    helm install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.service.type=LoadBalancer \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"="nlb" \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-cross-zone-load-balancing-enabled"="true"
    
    # Wait for ingress controller to be ready
    kubectl wait --namespace ingress-nginx \
        --for=condition=ready pod \
        --selector=app.kubernetes.io/component=controller \
        --timeout=120s
    
    log_success "NGINX Ingress Controller deployed"
}

# Setup certificate management
setup_cert_manager() {
    log_info "Setting up cert-manager for SSL certificates..."
    
    # Install cert-manager
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
    
    # Wait for cert-manager to be ready
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager -n cert-manager
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-cainjector -n cert-manager
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-webhook -n cert-manager
    
    # Create Let's Encrypt cluster issuer
    cat > "$PROJECT_ROOT/cluster-issuer.yaml" << EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@getit.com.bd
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
    
    kubectl apply -f "$PROJECT_ROOT/cluster-issuer.yaml"
    
    log_success "cert-manager deployed and configured"
}

# Setup storage classes
setup_storage() {
    log_info "Setting up storage classes..."
    
    cat > "$PROJECT_ROOT/storage-classes.yaml" << EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp3-fast
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  fsType: ext4
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp3-slow
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "1000"
  throughput: "125"
  fsType: ext4
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: io2-high-performance
provisioner: ebs.csi.aws.com
parameters:
  type: io2
  iops: "4000"
  fsType: ext4
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
EOF
    
    kubectl apply -f "$PROJECT_ROOT/storage-classes.yaml"
    
    log_success "Storage classes configured"
}

# Create namespaces
create_namespaces() {
    log_info "Creating application namespaces..."
    
    cat > "$PROJECT_ROOT/namespaces.yaml" << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    name: production
    environment: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: staging
  labels:
    name: staging
    environment: staging
---
apiVersion: v1
kind: Namespace
metadata:
  name: development
  labels:
    name: development
    environment: development
---
apiVersion: v1
kind: Namespace
metadata:
  name: getit-system
  labels:
    name: getit-system
    purpose: system-services
EOF
    
    kubectl apply -f "$PROJECT_ROOT/namespaces.yaml"
    
    log_success "Application namespaces created"
}

# Setup network policies
setup_network_policies() {
    log_info "Setting up network policies..."
    
    cat > "$PROJECT_ROOT/network-policies.yaml" << EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-same-namespace
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: production
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: production
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-controller
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
EOF
    
    kubectl apply -f "$PROJECT_ROOT/network-policies.yaml"
    
    log_success "Network policies configured"
}

# Validate deployment
validate_deployment() {
    log_info "Validating EKS deployment..."
    
    # Check cluster status
    kubectl cluster-info
    
    # Check nodes
    kubectl get nodes -o wide
    
    # Check system pods
    kubectl get pods -n kube-system
    
    # Check monitoring
    kubectl get pods -n monitoring
    
    # Check ingress controller
    kubectl get pods -n ingress-nginx
    
    # Get LoadBalancer endpoints
    log_info "LoadBalancer endpoints:"
    kubectl get svc -A | grep LoadBalancer
    
    log_success "EKS deployment validation completed"
}

# Create post-deployment documentation
create_documentation() {
    log_info "Creating deployment documentation..."
    
    cat > "$PROJECT_ROOT/eks-deployment-info.md" << EOF
# GetIt EKS Cluster Deployment Information

## Cluster Details
- **Cluster Name**: $CLUSTER_NAME
- **Region**: $REGION
- **Kubernetes Version**: $KUBERNETES_VERSION
- **VPC CIDR**: 10.0.0.0/16

## Node Groups
- **General Purpose**: m5.large instances (1-10 nodes)
- **Memory Optimized**: r5.large instances (1-5 nodes)
- **Compute Optimized**: c5.xlarge instances (0-8 nodes)
- **Spot Instances**: Mixed instance types (0-10 nodes)

## Installed Components
- AWS Load Balancer Controller
- Cluster Autoscaler
- AWS EBS CSI Driver
- Metrics Server
- Prometheus + Grafana
- NGINX Ingress Controller
- cert-manager

## Access Information
- **kubectl config**: Run \`aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME\`
- **SSH Key**: ~/.ssh/getit-eks-keypair

## LoadBalancer Endpoints
$(kubectl get svc -A | grep LoadBalancer)

## Next Steps
1. Deploy GetIt applications
2. Configure DNS records
3. Set up monitoring alerts
4. Configure backup procedures
5. Implement GitOps workflows

## Useful Commands
\`\`\`bash
# Update kubeconfig
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

# Check cluster health
kubectl get nodes
kubectl get pods -A

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Scale node groups
eksctl scale nodegroup --cluster=$CLUSTER_NAME --name=$NODE_GROUP_NAME-general --nodes=5

# Delete cluster (when needed)
eksctl delete cluster --name=$CLUSTER_NAME --region=$REGION
\`\`\`
EOF

    log_success "Documentation created: eks-deployment-info.md"
}

# Main execution
main() {
    log_info "Starting Amazon EKS deployment..."
    
    check_prerequisites
    create_ssh_keypair
    create_cluster_config
    deploy_cluster
    install_addons
    setup_monitoring
    setup_ingress
    setup_cert_manager
    setup_storage
    create_namespaces
    setup_network_policies
    validate_deployment
    create_documentation
    
    log_success "Amazon EKS deployment completed successfully!"
    log_info "Cluster name: $CLUSTER_NAME"
    log_info "Region: $REGION"
    log_info "Documentation: eks-deployment-info.md"
    log_warning "Remember to:"
    log_warning "1. Configure DNS records for LoadBalancer endpoints"
    log_warning "2. Set up monitoring alerts and notifications"
    log_warning "3. Configure backup and disaster recovery procedures"
    log_warning "4. Deploy GetIt applications to the cluster"
}

# Error handling
trap 'log_error "EKS deployment interrupted"; exit 1' INT TERM

# Execute main function
main "$@"