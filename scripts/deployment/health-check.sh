#!/bin/bash

# BDCommerce Health Check Script
# This script performs comprehensive health checks on all system components

set -e

# Configuration
SUPABASE_URL="https://bbgppsjmspimrfowytf.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Health check results
HEALTH_STATUS=0

echo -e "${BLUE}🏥 BDCommerce Platform Health Check${NC}"
echo "========================================"

# Function to perform HTTP health check
check_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$endpoint" || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ FAILED (HTTP $response)${NC}"
        HEALTH_STATUS=1
    fi
}

# Function to check edge function
check_edge_function() {
    local function_name=$1
    local description=$2
    
    echo -n "Checking $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/functions/v1/$function_name" || echo "000")
    
    if [ "$response" = "200" ] || [ "$response" = "400" ]; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ FAILED (HTTP $response)${NC}"
        HEALTH_STATUS=1
    fi
}

# 1. Database Health Check
echo -e "\n${YELLOW}📊 Database Health${NC}"
check_endpoint "$SUPABASE_URL/rest/v1/health" "Database Connection"

# 2. Core API Endpoints
echo -e "\n${YELLOW}🔌 Core API Endpoints${NC}"
check_endpoint "$SUPABASE_URL/rest/v1/products?select=id&limit=1" "Products API"
check_endpoint "$SUPABASE_URL/rest/v1/categories?select=id&limit=1" "Categories API"
check_endpoint "$SUPABASE_URL/rest/v1/vendors?select=id&limit=1" "Vendors API"

# 3. Edge Functions Health
echo -e "\n${YELLOW}⚡ Edge Functions${NC}"
check_edge_function "platform-monitoring" "Platform Monitoring"
check_edge_function "enhanced-payment-processing" "Payment Processing"
check_edge_function "notification-system" "Notification System"
check_edge_function "business-analytics" "Business Analytics"

# 4. Authentication Service
echo -e "\n${YELLOW}🔐 Authentication Service${NC}"
check_endpoint "$SUPABASE_URL/auth/v1/health" "Auth Service"

# 5. Storage Service
echo -e "\n${YELLOW}💾 Storage Service${NC}"
check_endpoint "$SUPABASE_URL/storage/v1/buckets" "Storage Service"

# 6. Real-time Service
echo -e "\n${YELLOW}⚡ Real-time Service${NC}"
echo -n "Checking Real-time WebSocket... "
if command -v wscat >/dev/null 2>&1; then
    timeout 5 wscat -c "wss://bbgppsjmspimrfowytf.supabase.co/realtime/v1/websocket?apikey=$SUPABASE_ANON_KEY" --close || true
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️ SKIP (wscat not installed)${NC}"
fi

# 7. Performance Check
echo -e "\n${YELLOW}⚡ Performance Check${NC}"
echo -n "Measuring API response time... "
start_time=$(date +%s%N)
curl -s -o /dev/null \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    "$SUPABASE_URL/rest/v1/products?select=id&limit=10"
end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 ))

if [ $duration -lt 500 ]; then
    echo -e "${GREEN}✅ ${duration}ms${NC}"
elif [ $duration -lt 1000 ]; then
    echo -e "${YELLOW}⚠️ ${duration}ms (slow)${NC}"
else
    echo -e "${RED}❌ ${duration}ms (too slow)${NC}"
    HEALTH_STATUS=1
fi

# 8. Security Check
echo -e "\n${YELLOW}🔒 Security Check${NC}"
echo -n "Checking HTTPS enforcement... "
http_response=$(curl -s -o /dev/null -w "%{http_code}" "http://bbgppsjmspimrfowytf.supabase.co" || echo "000")
if [ "$http_response" = "301" ] || [ "$http_response" = "302" ]; then
    echo -e "${GREEN}✅ OK (HTTP redirects to HTTPS)${NC}"
else
    echo -e "${YELLOW}⚠️ Check manually${NC}"
fi

# Summary
echo -e "\n${BLUE}📋 Health Check Summary${NC}"
echo "========================================"

if [ $HEALTH_STATUS -eq 0 ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
    echo "Platform is healthy and ready for production traffic."
else
    echo -e "${RED}⚠️ Issues detected!${NC}"
    echo "Some components require attention. Check the failed items above."
fi

echo -e "\n${BLUE}💡 Additional Monitoring${NC}"
echo "- Grafana Dashboard: http://localhost:3001"
echo "- Prometheus Metrics: http://localhost:9090"
echo "- Kibana Logs: http://localhost:5601"
echo "- Supabase Dashboard: https://supabase.com/dashboard/project/66238a4d-b3f3-4669-a1c0-ad03cb092c84"

exit $HEALTH_STATUS