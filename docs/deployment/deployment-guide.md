# BDCommerce Platform Deployment Guide

## Overview

This guide covers deployment strategies for the BDCommerce platform, from development to enterprise production environments.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Lovable Deployment](#lovable-deployment)
3. [Production Deployment](#production-deployment)
4. [Infrastructure Scaling](#infrastructure-scaling)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Security Configuration](#security-configuration)
7. [Troubleshooting](#troubleshooting)

## Environment Setup

### Prerequisites

- Node.js 18+ 
- npm 8+
- Git
- Supabase CLI (for advanced operations)
- Docker (for monitoring stack)

### Environment Variables

Create environment-specific configuration:

```bash
# Development
SUPABASE_URL=https://bbgppsjmspimrfowytf.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=development

# Staging
SUPABASE_URL=your_staging_supabase_url
SUPABASE_ANON_KEY=your_staging_anon_key
NODE_ENV=staging

# Production
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
NODE_ENV=production
```

## Lovable Deployment

### Automatic Deployment

Lovable provides automatic deployment for your application:

1. **Preview Deployment**: Automatic on every change
2. **Production Deployment**: Click "Publish" button
3. **Custom Domain**: Configure in Project Settings

### Manual Steps

```bash
# Build the application
npm run build

# Test the build locally
npm run preview

# Deploy edge functions (if using Supabase CLI)
supabase functions deploy
```

### Domain Configuration

1. Go to Project → Settings → Domains
2. Add your custom domain
3. Configure DNS settings
4. Wait for SSL certificate generation

## Production Deployment

### Infrastructure Requirements

#### Minimum Requirements
- 2 vCPUs
- 4GB RAM
- 50GB SSD
- 100GB bandwidth

#### Recommended Requirements
- 4 vCPUs
- 8GB RAM
- 200GB SSD
- 500GB bandwidth

### Deployment Options

#### Option 1: Lovable + Supabase (Recommended for MVP)

```bash
# 1. Deploy via Lovable interface
# 2. Configure custom domain
# 3. Set up monitoring
```

**Pros:**
- Fastest deployment
- Automatic scaling
- Built-in CDN
- SSL certificates

**Cons:**
- Limited customization
- Vendor lock-in

#### Option 2: Self-Hosted with Docker

```bash
# Build and deploy
docker build -t bdcommerce-app .
docker run -d -p 80:3000 \
  -e SUPABASE_URL=$SUPABASE_URL \
  -e SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
  bdcommerce-app
```

#### Option 3: Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/namespaces/production.yaml
kubectl apply -f infrastructure/kubernetes/deployments/
kubectl apply -f infrastructure/kubernetes/services/
kubectl apply -f infrastructure/kubernetes/ingress/
```

### Database Migration

```bash
# Run database migrations
supabase db push --project-ref your-project-ref

# Verify migration
supabase db diff --project-ref your-project-ref
```

### Edge Functions Deployment

```bash
# Deploy all edge functions
supabase functions deploy --project-ref your-project-ref

# Deploy specific function
supabase functions deploy enhanced-payment-processing --project-ref your-project-ref
```

## Infrastructure Scaling

### Horizontal Scaling

#### Load Balancer Configuration

```nginx
upstream bdcommerce_backend {
    server app1.bdcommerce.com:3000;
    server app2.bdcommerce.com:3000;
    server app3.bdcommerce.com:3000;
}

server {
    listen 80;
    server_name bdcommerce.com;
    
    location / {
        proxy_pass http://bdcommerce_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Auto-scaling Configuration

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: bdcommerce-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: bdcommerce-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling

#### Read Replicas

```sql
-- Configure read replica in Supabase
-- (Available in Pro plan and above)
```

#### Connection Pooling

```javascript
// Configure in Supabase settings
// Pool size: 20-50 connections
// Pool timeout: 10 seconds
```

### Caching Strategy

#### Redis Setup

```bash
# Deploy Redis cluster
docker run -d --name redis-cluster \
  -p 6379:6379 \
  redis:7-alpine redis-server --appendonly yes
```

#### CDN Configuration

```javascript
// Configure CloudFlare or similar CDN
const cdnConfig = {
  cacheTTL: 3600, // 1 hour
  edgeLocations: ['US', 'EU', 'APAC'],
  compressionEnabled: true
};
```

## Monitoring & Maintenance

### Health Checks

```bash
# Automated health monitoring
*/5 * * * * /opt/scripts/health-check.sh

# Manual health check
curl -f http://localhost:3000/health || exit 1
```

### Performance Monitoring

```bash
# Start monitoring stack
cd infrastructure/monitoring
docker-compose up -d

# Access dashboards
# Grafana: http://localhost:3001
# Prometheus: http://localhost:9090
# Kibana: http://localhost:5601
```

### Log Management

```bash
# View application logs
docker logs bdcommerce-app

# View edge function logs
supabase functions logs enhanced-payment-processing

# Search logs
grep "ERROR" /var/log/bdcommerce/*.log
```

### Backup Strategy

#### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
supabase db dump --project-ref $PROJECT_REF > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://bdcommerce-backups/
```

#### File Storage Backups

```bash
# Backup Supabase storage
supabase storage cp --recursive bucket-name/ ./backups/
```

## Security Configuration

### SSL/TLS Setup

```bash
# Generate SSL certificate (if self-hosted)
certbot --nginx -d bdcommerce.com -d www.bdcommerce.com
```

### Security Headers

```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

### Firewall Configuration

```bash
# Basic firewall rules
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw deny 3000/tcp   # Block direct app access
ufw enable
```

### Secret Management

```bash
# Using Vault (production)
vault kv put secret/bdcommerce/prod \
  supabase_url=$SUPABASE_URL \
  supabase_key=$SUPABASE_KEY

# Using environment files (staging)
echo "SUPABASE_URL=$SUPABASE_URL" > .env.staging
```

## Performance Optimization

### Frontend Optimization

```bash
# Build optimizations
npm run build

# Bundle analysis
npm run analyze

# Lighthouse audit
lighthouse https://bdcommerce.com --output html
```

### Database Optimization

```sql
-- Add performance indexes
CREATE INDEX CONCURRENTLY idx_products_category_price 
ON products(category_id, price) WHERE is_active = true;

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = '...';
```

### Caching Implementation

```javascript
// Redis caching strategy
const cacheKeys = {
  products: 'products:list:',
  vendors: 'vendors:list:',
  categories: 'categories:all'
};

// Cache TTL configuration
const cacheTTL = {
  products: 3600,     // 1 hour
  vendors: 7200,      // 2 hours
  categories: 86400   // 24 hours
};
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check connection
psql -h db.supabase.co -U postgres -d postgres

# Verify credentials
echo $SUPABASE_URL
```

#### 2. Edge Function Errors

```bash
# Check function logs
supabase functions logs function-name

# Test function locally
supabase functions serve
```

#### 3. Performance Issues

```bash
# Check resource usage
top
htop
iotop

# Monitor database performance
SELECT * FROM pg_stat_activity;
```

#### 4. SSL Certificate Issues

```bash
# Check certificate validity
openssl s_client -connect bdcommerce.com:443

# Renew certificate
certbot renew
```

### Emergency Procedures

#### 1. Service Outage

```bash
# Immediate response
1. Check monitoring dashboards
2. Verify database connectivity
3. Check edge function status
4. Roll back if necessary

# Rollback procedure
git revert HEAD
npm run build
supabase functions deploy
```

#### 2. Database Issues

```bash
# Emergency database restore
supabase db reset --project-ref $PROJECT_REF
supabase db push --project-ref $PROJECT_REF
```

#### 3. Security Incident

```bash
# Immediate actions
1. Isolate affected systems
2. Change all credentials
3. Review access logs
4. Notify stakeholders
```

## Maintenance Schedule

### Daily
- [ ] Monitor system health
- [ ] Check error logs
- [ ] Verify backup completion

### Weekly
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Security scans

### Monthly
- [ ] Capacity planning review
- [ ] Security audit
- [ ] Disaster recovery testing

### Quarterly
- [ ] Infrastructure review
- [ ] Cost optimization
- [ ] Technology updates

## Support Contacts

### Technical Support
- **Email**: tech-support@bdcommerce.com
- **Slack**: #bdcommerce-tech
- **Phone**: +880-XXX-XXXX (24/7)

### Emergency Contacts
- **On-call Engineer**: +880-XXX-XXXX
- **Team Lead**: +880-XXX-XXXX
- **CTO**: +880-XXX-XXXX

## Additional Resources

- [API Documentation](../api/openapi-spec.yaml)
- [Architecture Guide](../architecture/system-architecture.md)
- [Security Guide](../security/security-architecture.md)
- [Monitoring Guide](../monitoring/monitoring-setup.md)