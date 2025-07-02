variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "redis_security_group_id" {
  description = "Security group ID for Redis cluster"
  type        = string
}

variable "internal_lb_security_group_id" {
  description = "Security group ID for internal load balancer"
  type        = string
}

variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "enable_detailed_monitoring" {
  description = "Enable detailed monitoring"
  type        = bool
  default     = true
}

variable "alert_email" {
  description = "Email for alerts"
  type        = string
  default     = "admin@bdcommerce.com"
}