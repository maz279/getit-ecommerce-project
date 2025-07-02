# Terraform configuration for BDCommerce monitoring infrastructure
# This is a template for future infrastructure scaling

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# CloudWatch Log Groups for application logs
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/bdcommerce/application"
  retention_in_days = 30
  
  tags = {
    Environment = var.environment
    Application = "bdcommerce"
  }
}

resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/bdcommerce/api"
  retention_in_days = 30
  
  tags = {
    Environment = var.environment
    Application = "bdcommerce"
  }
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "BDCommerce-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", "bdcommerce-api"],
            [".", "MemoryUtilization", ".", "."],
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Service Metrics"
          period  = 300
        }
      },
      {
        type   = "log"
        x      = 0
        y      = 6
        width  = 24
        height = 6

        properties = {
          query   = "SOURCE '/bdcommerce/application' | fields @timestamp, @message | sort @timestamp desc | limit 100"
          region  = var.aws_region
          title   = "Recent Application Logs"
        }
      }
    ]
  })
}

# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "bdcommerce-alerts-${var.environment}"
  
  tags = {
    Environment = var.environment
    Application = "bdcommerce"
  }
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "bdcommerce-high-error-rate-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ErrorRate"
  namespace           = "BDCommerce/API"
  period              = "300"
  statistic           = "Average"
  threshold           = "0.05"
  alarm_description   = "This metric monitors api error rate"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  tags = {
    Environment = var.environment
    Application = "bdcommerce"
  }
}

resource "aws_cloudwatch_metric_alarm" "high_response_time" {
  alarm_name          = "bdcommerce-high-response-time-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ResponseTime"
  namespace           = "BDCommerce/API"
  period              = "300"
  statistic           = "Average"
  threshold           = "1000"
  alarm_description   = "This metric monitors api response time"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  tags = {
    Environment = var.environment
    Application = "bdcommerce"
  }
}

# ElastiCache for Redis (session storage and caching)
resource "aws_elasticache_subnet_group" "main" {
  name       = "bdcommerce-cache-subnet-${var.environment}"
  subnet_ids = var.private_subnet_ids
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id         = "bdcommerce-redis-${var.environment}"
  description                  = "Redis cluster for BDCommerce"
  
  port                         = 6379
  parameter_group_name         = "default.redis7"
  node_type                   = var.redis_node_type
  num_cache_clusters          = 2
  
  subnet_group_name           = aws_elasticache_subnet_group.main.name
  security_group_ids          = [var.redis_security_group_id]
  
  at_rest_encryption_enabled  = true
  transit_encryption_enabled  = true
  
  tags = {
    Environment = var.environment
    Application = "bdcommerce"
  }
}

# Application Load Balancer for internal services
resource "aws_lb" "internal" {
  name               = "bdcommerce-internal-${var.environment}"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [var.internal_lb_security_group_id]
  subnets           = var.private_subnet_ids

  enable_deletion_protection = var.environment == "production"

  tags = {
    Environment = var.environment
    Application = "bdcommerce"
  }
}

# Output values
output "cloudwatch_log_group_name" {
  value = aws_cloudwatch_log_group.app_logs.name
}

output "sns_topic_arn" {
  value = aws_sns_topic.alerts.arn
}

output "redis_endpoint" {
  value = aws_elasticache_replication_group.redis.configuration_endpoint_address
}