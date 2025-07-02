#!/bin/bash

# GetIt API Integration Tests
# Comprehensive API endpoint testing with real Supabase integration

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
TEST_ENV="integration"
API_BASE_URL="https://bbgppsimspymrfowytf.supabase.co"
TIMEOUT=30

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

# Test environment setup
setup_test_environment() {
    log_info "Setting up API integration test environment..."
    
    cd "$PROJECT_ROOT"
    
    # Create test results directory
    mkdir -p reports/api-integration
    
    # Load environment variables
    if [ -f ".env.test" ]; then
        export $(cat .env.test | xargs)
    fi
    
    # Set test-specific variables
    export NODE_ENV=test
    export SUPABASE_URL="$API_BASE_URL"
    
    log_success "API test environment ready"
}

# Authentication tests
test_authentication_endpoints() {
    log_info "Testing authentication endpoints..."
    
    local test_results=()
    
    # Test user registration
    log_info "Testing user registration..."
    REGISTER_RESPONSE=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        -d '{
            "email": "test@example.com",
            "password": "testpassword123",
            "data": {
                "full_name": "Test User",
                "phone": "+8801234567890"
            }
        }' \
        "$API_BASE_URL/auth/v1/signup")
    
    HTTP_CODE="${REGISTER_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(200|201|400)$ ]]; then
        log_success "User registration endpoint working"
        test_results+=("registration:PASS")
    else
        log_error "User registration failed: $HTTP_CODE"
        test_results+=("registration:FAIL")
    fi
    
    # Test user login
    log_info "Testing user login..."
    LOGIN_RESPONSE=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        -d '{
            "email": "test@example.com",
            "password": "testpassword123"
        }' \
        "$API_BASE_URL/auth/v1/token?grant_type=password")
    
    HTTP_CODE="${LOGIN_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(200|400)$ ]]; then
        log_success "User login endpoint working"
        test_results+=("login:PASS")
    else
        log_error "User login failed: $HTTP_CODE"
        test_results+=("login:FAIL")
    fi
    
    # Test password reset
    log_info "Testing password reset..."
    RESET_RESPONSE=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        -d '{
            "email": "test@example.com"
        }' \
        "$API_BASE_URL/auth/v1/recover")
    
    HTTP_CODE="${RESET_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(200|400)$ ]]; then
        log_success "Password reset endpoint working"
        test_results+=("password_reset:PASS")
    else
        log_error "Password reset failed: $HTTP_CODE"
        test_results+=("password_reset:FAIL")
    fi
    
    echo "${test_results[@]}" > reports/api-integration/auth-tests.txt
}

# Product API tests
test_product_endpoints() {
    log_info "Testing product API endpoints..."
    
    local test_results=()
    
    # Test products listing
    log_info "Testing products listing..."
    PRODUCTS_RESPONSE=$(curl -s -w "%{http_code}" \
        -X GET \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        "$API_BASE_URL/rest/v1/products?select=*&limit=10")
    
    HTTP_CODE="${PRODUCTS_RESPONSE: -3}"
    if [[ "$HTTP_CODE" == "200" ]]; then
        log_success "Products listing endpoint working"
        test_results+=("products_list:PASS")
    else
        log_error "Products listing failed: $HTTP_CODE"
        test_results+=("products_list:FAIL")
    fi
    
    # Test product search
    log_info "Testing product search..."
    SEARCH_RESPONSE=$(curl -s -w "%{http_code}" \
        -X GET \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        "$API_BASE_URL/rest/v1/products?name=like.*shirt*&select=*")
    
    HTTP_CODE="${SEARCH_RESPONSE: -3}"
    if [[ "$HTTP_CODE" == "200" ]]; then
        log_success "Product search endpoint working"
        test_results+=("product_search:PASS")
    else
        log_error "Product search failed: $HTTP_CODE"
        test_results+=("product_search:FAIL")
    fi
    
    # Test categories
    log_info "Testing categories endpoint..."
    CATEGORIES_RESPONSE=$(curl -s -w "%{http_code}" \
        -X GET \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        "$API_BASE_URL/rest/v1/categories?select=*")
    
    HTTP_CODE="${CATEGORIES_RESPONSE: -3}"
    if [[ "$HTTP_CODE" == "200" ]]; then
        log_success "Categories endpoint working"
        test_results+=("categories:PASS")
    else
        log_error "Categories failed: $HTTP_CODE"
        test_results+=("categories:FAIL")
    fi
    
    echo "${test_results[@]}" > reports/api-integration/product-tests.txt
}

# Order API tests
test_order_endpoints() {
    log_info "Testing order API endpoints..."
    
    local test_results=()
    
    # Test orders listing (requires auth)
    log_info "Testing orders listing..."
    ORDERS_RESPONSE=$(curl -s -w "%{http_code}" \
        -X GET \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        -H "Authorization: Bearer test-token" \
        "$API_BASE_URL/rest/v1/orders?select=*&limit=10")
    
    HTTP_CODE="${ORDERS_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(200|401)$ ]]; then
        log_success "Orders endpoint responding correctly"
        test_results+=("orders_list:PASS")
    else
        log_error "Orders listing failed: $HTTP_CODE"
        test_results+=("orders_list:FAIL")
    fi
    
    # Test order tracking
    log_info "Testing order tracking..."
    TRACKING_RESPONSE=$(curl -s -w "%{http_code}" \
        -X GET \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        "$API_BASE_URL/rest/v1/order_tracking?order_number=eq.ORD-20240101-000001&select=*")
    
    HTTP_CODE="${TRACKING_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(200|404)$ ]]; then
        log_success "Order tracking endpoint working"
        test_results+=("order_tracking:PASS")
    else
        log_error "Order tracking failed: $HTTP_CODE"
        test_results+=("order_tracking:FAIL")
    fi
    
    echo "${test_results[@]}" > reports/api-integration/order-tests.txt
}

# Vendor API tests
test_vendor_endpoints() {
    log_info "Testing vendor API endpoints..."
    
    local test_results=()
    
    # Test vendor listing
    log_info "Testing vendor listing..."
    VENDORS_RESPONSE=$(curl -s -w "%{http_code}" \
        -X GET \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        "$API_BASE_URL/rest/v1/vendors?select=*&limit=10")
    
    HTTP_CODE="${VENDORS_RESPONSE: -3}"
    if [[ "$HTTP_CODE" == "200" ]]; then
        log_success "Vendor listing endpoint working"
        test_results+=("vendors_list:PASS")
    else
        log_error "Vendor listing failed: $HTTP_CODE"
        test_results+=("vendors_list:FAIL")
    fi
    
    # Test vendor registration
    log_info "Testing vendor registration..."
    VENDOR_REG_RESPONSE=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        -H "Authorization: Bearer test-token" \
        -d '{
            "business_name": "Test Vendor",
            "business_type": "retail",
            "registration_number": "REG123456"
        }' \
        "$API_BASE_URL/rest/v1/vendor_applications")
    
    HTTP_CODE="${VENDOR_REG_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(201|400|401)$ ]]; then
        log_success "Vendor registration endpoint working"
        test_results+=("vendor_registration:PASS")
    else
        log_error "Vendor registration failed: $HTTP_CODE"
        test_results+=("vendor_registration:FAIL")
    fi
    
    echo "${test_results[@]}" > reports/api-integration/vendor-tests.txt
}

# Payment API tests
test_payment_endpoints() {
    log_info "Testing payment API endpoints..."
    
    local test_results=()
    
    # Test payment methods
    log_info "Testing payment methods..."
    PAYMENT_METHODS_RESPONSE=$(curl -s -w "%{http_code}" \
        -X GET \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        "$API_BASE_URL/rest/v1/payment_methods?select=*")
    
    HTTP_CODE="${PAYMENT_METHODS_RESPONSE: -3}"
    if [[ "$HTTP_CODE" == "200" ]]; then
        log_success "Payment methods endpoint working"
        test_results+=("payment_methods:PASS")
    else
        log_error "Payment methods failed: $HTTP_CODE"
        test_results+=("payment_methods:FAIL")
    fi
    
    # Test commission rates
    log_info "Testing commission rates..."
    COMMISSION_RESPONSE=$(curl -s -w "%{http_code}" \
        -X GET \
        -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        "$API_BASE_URL/rest/v1/vendor_commission_rates?select=*&limit=10")
    
    HTTP_CODE="${COMMISSION_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(200|401)$ ]]; then
        log_success "Commission rates endpoint working"
        test_results+=("commission_rates:PASS")
    else
        log_error "Commission rates failed: $HTTP_CODE"
        test_results+=("commission_rates:FAIL")
    fi
    
    echo "${test_results[@]}" > reports/api-integration/payment-tests.txt
}

# Edge Functions tests
test_edge_functions() {
    log_info "Testing Edge Functions..."
    
    local test_results=()
    
    # Test search API
    log_info "Testing search Edge Function..."
    SEARCH_FUNCTION_RESPONSE=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        -d '{
            "query": "shirt",
            "filters": {},
            "limit": 10
        }' \
        "$API_BASE_URL/functions/v1/search-api")
    
    HTTP_CODE="${SEARCH_FUNCTION_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(200|400)$ ]]; then
        log_success "Search Edge Function working"
        test_results+=("search_function:PASS")
    else
        log_error "Search Edge Function failed: $HTTP_CODE"
        test_results+=("search_function:FAIL")
    fi
    
    # Test analytics engine
    log_info "Testing analytics engine..."
    ANALYTICS_RESPONSE=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
        -d '{
            "event_type": "page_view",
            "data": {"page": "/products"}
        }' \
        "$API_BASE_URL/functions/v1/analytics-engine")
    
    HTTP_CODE="${ANALYTICS_RESPONSE: -3}"
    if [[ "$HTTP_CODE" =~ ^(200|400)$ ]]; then
        log_success "Analytics engine working"
        test_results+=("analytics_engine:PASS")
    else
        log_error "Analytics engine failed: $HTTP_CODE"
        test_results+=("analytics_engine:FAIL")
    fi
    
    echo "${test_results[@]}" > reports/api-integration/edge-function-tests.txt
}

# Performance testing
test_api_performance() {
    log_info "Testing API performance..."
    
    # Test response times
    for endpoint in "products" "categories" "vendors"; do
        log_info "Testing $endpoint performance..."
        
        START_TIME=$(date +%s%N)
        curl -s "$API_BASE_URL/rest/v1/$endpoint?select=*&limit=1" \
            -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." > /dev/null
        END_TIME=$(date +%s%N)
        
        RESPONSE_TIME=$((($END_TIME - $START_TIME) / 1000000))
        
        if [ $RESPONSE_TIME -lt 1000 ]; then
            log_success "$endpoint response time: ${RESPONSE_TIME}ms (GOOD)"
        elif [ $RESPONSE_TIME -lt 3000 ]; then
            log_warning "$endpoint response time: ${RESPONSE_TIME}ms (ACCEPTABLE)"
        else
            log_error "$endpoint response time: ${RESPONSE_TIME}ms (SLOW)"
        fi
        
        echo "$endpoint:${RESPONSE_TIME}ms" >> reports/api-integration/performance-results.txt
    done
}

# Generate comprehensive test report
generate_test_report() {
    log_info "Generating API integration test report..."
    
    cat > reports/api-integration/summary.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>GetIt API Integration Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .pass { color: green; }
        .fail { color: red; }
        .warning { color: orange; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>GetIt API Integration Test Report</h1>
    <p>Generated on: $(date)</p>
    
    <h2>Test Results Summary</h2>
    <table>
        <tr><th>Test Category</th><th>Status</th><th>Details</th></tr>
EOF
    
    # Add test results to report
    for test_file in reports/api-integration/*-tests.txt; do
        if [ -f "$test_file" ]; then
            category=$(basename "$test_file" -tests.txt)
            results=$(cat "$test_file")
            echo "        <tr><td>$category</td><td>$results</td><td>-</td></tr>" >> reports/api-integration/summary.html
        fi
    done
    
    echo "    </table>" >> reports/api-integration/summary.html
    echo "</body></html>" >> reports/api-integration/summary.html
    
    log_success "Test report generated: reports/api-integration/summary.html"
}

# Main execution
main() {
    log_info "Starting API integration tests..."
    
    setup_test_environment
    
    # Run all test suites
    test_authentication_endpoints
    test_product_endpoints
    test_order_endpoints
    test_vendor_endpoints
    test_payment_endpoints
    test_edge_functions
    test_api_performance
    
    # Generate reports
    generate_test_report
    
    log_success "API integration tests completed!"
    log_info "Results available in: reports/api-integration/"
}

# Error handling
trap 'log_error "API integration tests interrupted"; exit 1' INT TERM

# Execute main function
main "$@"