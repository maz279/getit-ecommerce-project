# BDCommerce Vault Policy

# Database credentials
path "secret/data/database/*" {
  capabilities = ["read"]
}

# Payment gateway secrets
path "secret/data/payments/*" {
  capabilities = ["read"]
}

# API keys and tokens
path "secret/data/api-keys/*" {
  capabilities = ["read"]
}

# JWT signing keys
path "secret/data/jwt/*" {
  capabilities = ["read"]
}

# SSL certificates
path "secret/data/ssl/*" {
  capabilities = ["read"]
}

# External service credentials
path "secret/data/external/*" {
  capabilities = ["read"]
}

# Application configuration
path "secret/data/config/*" {
  capabilities = ["read", "update"]
}

# Supabase secrets
path "secret/data/supabase/*" {
  capabilities = ["read"]
}

# Shipping provider credentials
path "secret/data/shipping/*" {
  capabilities = ["read"]
}

# Notification service credentials
path "secret/data/notifications/*" {
  capabilities = ["read"]
}

# Analytics and monitoring
path "secret/data/monitoring/*" {
  capabilities = ["read"]
}