terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    bucket         = "getit-terraform-state-production"
    key            = "production/terraform.tfstate"
    region         = "ap-southeast-1"  # Singapore region for Bangladesh compliance
    encrypt        = true
    dynamodb_table = "getit-terraform-locks"
    
    # Enable versioning and MFA delete for state protection
    versioning = true
  }
}

# Provider configurations
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment        = "production"
      Project           = "getit-commerce"
      ManagedBy         = "terraform"
      BangladeshCompliant = "true"
      CostCenter        = "production-ops"
      BackupPolicy      = "daily"
      DataClassification = "confidential"
    }
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_name
}

# Local values
locals {
  name = "getit-production"
  
  vpc_cidr = "10.0.0.0/16"
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)
  
  # Bangladesh compliance requirements
  bangladesh_compliance = {
    data_residency_required = true
    audit_logging_enabled   = true
    encryption_at_rest      = true
    backup_retention_days   = 2555  # 7 years for financial data
    monitoring_enabled      = true
  }
  
  tags = {
    Environment = "production"
    Terraform   = "true"
    BangladeshCompliant = "true"
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/aws-infrastructure/vpc"
  
  name = local.name
  cidr = local.vpc_cidr
  
  azs             = local.azs
  private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
  public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 48)]
  intra_subnets   = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 52)]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  # VPC Flow Logs for Bangladesh compliance
  enable_flow_log                      = true
  create_flow_log_cloudwatch_iam_role  = true
  create_flow_log_cloudwatch_log_group = true
  
  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }
  
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
  
  tags = local.tags
}

# Security Groups Module
module "security_groups" {
  source = "../../modules/aws-infrastructure/security-groups"
  
  name   = local.name
  vpc_id = module.vpc.vpc_id
  
  bangladesh_compliance = local.bangladesh_compliance
  
  tags = local.tags
}

# EKS Module
module "eks" {
  source = "../../modules/aws-infrastructure/eks"
  
  cluster_name    = local.name
  cluster_version = "1.28"
  
  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true
  cluster_endpoint_private_access = true
  
  # Managed node groups
  managed_node_groups = {
    # Application nodes
    application = {
      min_size     = 3
      max_size     = 10
      desired_size = 5
      
      instance_types = ["t3.large", "t3.xlarge"]
      capacity_type  = "ON_DEMAND"
      
      k8s_labels = {
        node-type = "application"
        environment = "production"
      }
      
      k8s_taints = [
        {
          key    = "application-node"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      ]
    }
    
    # Database and stateful workloads
    database = {
      min_size     = 2
      max_size     = 5
      desired_size = 3
      
      instance_types = ["r5.large", "r5.xlarge"]
      capacity_type  = "ON_DEMAND"
      
      k8s_labels = {
        node-type = "database"
        environment = "production"
      }
      
      k8s_taints = [
        {
          key    = "database-node"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      ]
    }
    
    # Monitoring and logging
    monitoring = {
      min_size     = 2
      max_size     = 4
      desired_size = 2
      
      instance_types = ["m5.large"]
      capacity_type  = "ON_DEMAND"
      
      k8s_labels = {
        node-type = "monitoring"
        environment = "production"
      }
    }
  }
  
  # Fargate profiles for serverless workloads
  fargate_profiles = {
    serverless = {
      selectors = [
        {
          namespace = "serverless"
          labels = {
            compute-type = "fargate"
          }
        }
      ]
    }
  }
  
  bangladesh_compliance = local.bangladesh_compliance
  
  tags = local.tags
}

# RDS Module for PostgreSQL
module "rds" {
  source = "../../modules/aws-infrastructure/rds"
  
  identifier = "${local.name}-postgres"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.r6g.xlarge"
  
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.rds.arn
  
  db_name  = "getit_production"
  username = "postgres"
  manage_master_user_password = true
  
  vpc_security_group_ids = [module.security_groups.database_security_group_id]
  db_subnet_group_name   = module.vpc.database_subnet_group
  
  # Backup configuration for Bangladesh compliance
  backup_retention_period = 35  # 5 weeks
  backup_window          = "03:00-04:00"  # 9:00-10:00 AM Bangladesh time
  maintenance_window     = "sun:04:00-sun:05:00"  # 10:00-11:00 AM Bangladesh time
  
  # Multi-AZ for high availability
  multi_az = true
  
  # Enhanced monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn
  
  # Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7
  
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "${local.name}-postgres-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  
  tags = local.tags
}

# ElastiCache for Redis
module "elasticache" {
  source = "../../modules/aws-infrastructure/elasticache"
  
  cluster_id = "${local.name}-redis"
  
  engine         = "redis"
  engine_version = "7.0"
  node_type      = "cache.r6g.large"
  
  num_cache_nodes = 1
  parameter_group_name = "default.redis7"
  
  subnet_group_name  = module.vpc.elasticache_subnet_group_name
  security_group_ids = [module.security_groups.cache_security_group_id]
  
  # Encryption
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  # Backup
  snapshot_retention_limit = 7
  snapshot_window         = "03:00-05:00"  # 9:00-11:00 AM Bangladesh time
  
  tags = local.tags
}

# S3 Buckets
module "s3" {
  source = "../../modules/aws-infrastructure/s3"
  
  bucket_name = local.name
  
  # Versioning and lifecycle
  versioning_enabled = true
  lifecycle_rules = [
    {
      id      = "transition_to_ia"
      enabled = true
      transition = {
        days          = 30
        storage_class = "STANDARD_IA"
      }
    },
    {
      id      = "transition_to_glacier"
      enabled = true
      transition = {
        days          = 90
        storage_class = "GLACIER"
      }
    },
    {
      id      = "delete_old_versions"
      enabled = true
      noncurrent_version_expiration = {
        days = 365
      }
    }
  ]
  
  # Encryption
  encryption_enabled = true
  kms_key_id        = aws_kms_key.s3.arn
  
  # Logging and monitoring
  access_logging_enabled = true
  
  bangladesh_compliance = local.bangladesh_compliance
  
  tags = local.tags
}

# CloudFront for CDN
module "cloudfront" {
  source = "../../modules/aws-infrastructure/cloudfront"
  
  distribution_name = local.name
  
  origin_domain_name = module.s3.bucket_domain_name
  origin_id         = "S3-${module.s3.bucket_id}"
  
  # Caching behavior
  default_cache_behavior = {
    target_origin_id       = "S3-${module.s3.bucket_id}"
    viewer_protocol_policy = "redirect-to-https"
    compress              = true
    
    forwarded_values = {
      query_string = false
      cookies = {
        forward = "none"
      }
    }
  }
  
  # Geographic restrictions for Bangladesh compliance
  geo_restriction = {
    restriction_type = "none"  # Allow global access but log for compliance
  }
  
  # SSL/TLS
  ssl_support_method = "sni-only"
  minimum_protocol_version = "TLSv1.2_2021"
  
  # WAF integration
  web_acl_id = aws_wafv2_web_acl.main.arn
  
  tags = local.tags
}

# Monitoring Module
module "monitoring" {
  source = "../../modules/monitoring"
  
  cluster_name = module.eks.cluster_name
  
  # Prometheus configuration
  prometheus_enabled = true
  prometheus_namespace = "monitoring"
  
  # Grafana configuration
  grafana_enabled = true
  grafana_admin_password = random_password.grafana_admin.result
  
  # AlertManager configuration
  alertmanager_enabled = true
  
  # Bangladesh compliance monitoring
  bangladesh_compliance = local.bangladesh_compliance
  
  tags = local.tags
}

# Bangladesh Compliance Module
module "bangladesh_compliance" {
  source = "../../modules/bangladesh-compliance"
  
  cluster_name = module.eks.cluster_name
  vpc_id       = module.vpc.vpc_id
  
  # Data residency
  data_residency_enabled = true
  
  # Audit logging
  audit_logging_enabled = true
  audit_log_retention_days = 2555  # 7 years
  
  # Backup compliance
  backup_policies = {
    daily_backup = {
      retention_days = 30
      schedule      = "0 2 * * *"  # 8:00 AM Bangladesh time
    }
    weekly_backup = {
      retention_days = 90
      schedule      = "0 1 * * 0"  # 7:00 AM Sunday Bangladesh time
    }
    monthly_backup = {
      retention_days = 365
      schedule      = "0 0 1 * *"  # 6:00 AM 1st of month Bangladesh time
    }
  }
  
  tags = local.tags
}

# KMS Keys
resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true
  
  tags = merge(local.tags, {
    Name = "${local.name}-rds-kms"
    Service = "RDS"
  })
}

resource "aws_kms_key" "s3" {
  description             = "KMS key for S3 encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true
  
  tags = merge(local.tags, {
    Name = "${local.name}-s3-kms"
    Service = "S3"
  })
}

# IAM Role for RDS Monitoring
resource "aws_iam_role" "rds_monitoring" {
  name = "${local.name}-rds-monitoring"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })
  
  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# WAF v2 for CloudFront
resource "aws_wafv2_web_acl" "main" {
  name  = "${local.name}-waf"
  scope = "CLOUDFRONT"
  
  default_action {
    allow {}
  }
  
  # Rate limiting rule
  rule {
    name     = "RateLimitRule"
    priority = 1
    
    override_action {
      none {}
    }
    
    statement {
      rate_based_statement {
        limit              = 10000
        aggregate_key_type = "IP"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }
  
  # Bangladesh IP whitelist (if required)
  rule {
    name     = "BangladeshGeoRule"
    priority = 2
    
    override_action {
      none {}
    }
    
    statement {
      geo_match_statement {
        country_codes = ["BD"]  # Bangladesh
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BangladeshGeoRule"
      sampled_requests_enabled   = true
    }
  }
  
  tags = local.tags
  
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${local.name}-waf"
    sampled_requests_enabled   = true
  }
}

# Random password for Grafana admin
resource "random_password" "grafana_admin" {
  length  = 16
  special = true
}