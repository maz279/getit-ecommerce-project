#!/bin/bash

# GetIt Frontend Unit Tests Runner
# Comprehensive testing for React components, hooks, and utilities

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
TEST_ENV="test"
COVERAGE_THRESHOLD=80
PARALLEL_WORKERS=4

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    log_info "Setting up test environment..."
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm install
    fi
    
    # Set test environment variables
    export NODE_ENV=test
    export CI=true
    export GENERATE_SOURCEMAP=false
    
    # Create test results directory
    mkdir -p coverage reports/frontend-tests
    
    log_success "Test environment ready"
}

# Component tests
run_component_tests() {
    log_info "Running React component tests..."
    
    npx jest \
        --testPathPattern="src/components.*\\.test\\.(js|jsx|ts|tsx)$" \
        --collectCoverage \
        --coverageDirectory=coverage/components \
        --coverageReporters=text,lcov,html \
        --maxWorkers=$PARALLEL_WORKERS \
        --verbose \
        --passWithNoTests
    
    if [ $? -eq 0 ]; then
        log_success "Component tests passed"
    else
        log_error "Component tests failed"
        return 1
    fi
}

# Hook tests
run_hook_tests() {
    log_info "Running React hooks tests..."
    
    npx jest \
        --testPathPattern="src/hooks.*\\.test\\.(js|jsx|ts|tsx)$" \
        --collectCoverage \
        --coverageDirectory=coverage/hooks \
        --coverageReporters=text,lcov,html \
        --maxWorkers=$PARALLEL_WORKERS \
        --verbose \
        --passWithNoTests
    
    if [ $? -eq 0 ]; then
        log_success "Hook tests passed"
    else
        log_error "Hook tests failed"
        return 1
    fi
}

# Utility tests
run_utility_tests() {
    log_info "Running utility function tests..."
    
    npx jest \
        --testPathPattern="src/utils.*\\.test\\.(js|jsx|ts|tsx)$" \
        --collectCoverage \
        --coverageDirectory=coverage/utils \
        --coverageReporters=text,lcov,html \
        --maxWorkers=$PARALLEL_WORKERS \
        --verbose \
        --passWithNoTests
    
    if [ $? -eq 0 ]; then
        log_success "Utility tests passed"
    else
        log_error "Utility tests failed"
        return 1
    fi
}

# Service tests
run_service_tests() {
    log_info "Running service layer tests..."
    
    npx jest \
        --testPathPattern="src/services.*\\.test\\.(js|jsx|ts|tsx)$" \
        --collectCoverage \
        --coverageDirectory=coverage/services \
        --coverageReporters=text,lcov,html \
        --maxWorkers=$PARALLEL_WORKERS \
        --verbose \
        --passWithNoTests
    
    if [ $? -eq 0 ]; then
        log_success "Service tests passed"
    else
        log_error "Service tests failed"
        return 1
    fi
}

# Context and provider tests
run_context_tests() {
    log_info "Running context and provider tests..."
    
    npx jest \
        --testPathPattern="src/context.*\\.test\\.(js|jsx|ts|tsx)$" \
        --testPathPattern="src/providers.*\\.test\\.(js|jsx|ts|tsx)$" \
        --collectCoverage \
        --coverageDirectory=coverage/context \
        --coverageReporters=text,lcov,html \
        --maxWorkers=$PARALLEL_WORKERS \
        --verbose \
        --passWithNoTests
    
    if [ $? -eq 0 ]; then
        log_success "Context tests passed"
    else
        log_error "Context tests failed"
        return 1
    fi
}

# Generate comprehensive coverage report
generate_coverage_report() {
    log_info "Generating comprehensive coverage report..."
    
    # Merge coverage reports
    npx nyc merge coverage coverage/merged-coverage.json
    
    # Generate final report
    npx nyc report \
        --temp-dir=coverage \
        --reporter=html \
        --reporter=text \
        --reporter=lcov \
        --report-dir=coverage/final
    
    # Check coverage threshold
    COVERAGE_PERCENT=$(npx nyc report --reporter=text | grep "All files" | awk '{print $10}' | sed 's/%//')
    
    if (( $(echo "$COVERAGE_PERCENT >= $COVERAGE_THRESHOLD" | bc -l) )); then
        log_success "Coverage threshold met: ${COVERAGE_PERCENT}% >= ${COVERAGE_THRESHOLD}%"
    else
        log_warning "Coverage below threshold: ${COVERAGE_PERCENT}% < ${COVERAGE_THRESHOLD}%"
    fi
    
    log_info "Coverage report generated at: coverage/final/index.html"
}

# Accessibility tests
run_accessibility_tests() {
    log_info "Running accessibility tests..."
    
    npx jest \
        --testPathPattern=".*\\.a11y\\.test\\.(js|jsx|ts|tsx)$" \
        --collectCoverage \
        --coverageDirectory=coverage/a11y \
        --maxWorkers=$PARALLEL_WORKERS \
        --verbose \
        --passWithNoTests
    
    if [ $? -eq 0 ]; then
        log_success "Accessibility tests passed"
    else
        log_error "Accessibility tests failed"
        return 1
    fi
}

# Performance tests
run_performance_tests() {
    log_info "Running performance tests..."
    
    # Bundle size analysis
    npx webpack-bundle-analyzer build/static/js/*.js --mode=static --report=reports/frontend-tests/bundle-analysis.html
    
    # Lighthouse CI for performance metrics
    if command -v lhci >/dev/null 2>&1; then
        npx lhci autorun --upload.target=filesystem --upload.outputDir=reports/frontend-tests/lighthouse
    else
        log_warning "Lighthouse CI not available, skipping performance tests"
    fi
}

# TypeScript type checking
run_type_checking() {
    log_info "Running TypeScript type checking..."
    
    npx tsc --noEmit --skipLibCheck
    
    if [ $? -eq 0 ]; then
        log_success "TypeScript type checking passed"
    else
        log_error "TypeScript type checking failed"
        return 1
    fi
}

# ESLint and code quality
run_lint_tests() {
    log_info "Running ESLint and code quality checks..."
    
    npx eslint src/ --ext .js,.jsx,.ts,.tsx --format=json --output-file=reports/frontend-tests/eslint-report.json
    npx eslint src/ --ext .js,.jsx,.ts,.tsx --format=html --output-file=reports/frontend-tests/eslint-report.html
    
    if [ $? -eq 0 ]; then
        log_success "Linting passed"
    else
        log_error "Linting failed"
        return 1
    fi
}

# Main execution function
main() {
    log_info "Starting frontend unit tests..."
    
    setup_test_environment
    
    # Run all test suites
    run_type_checking
    run_lint_tests
    run_component_tests
    run_hook_tests
    run_utility_tests
    run_service_tests
    run_context_tests
    run_accessibility_tests
    run_performance_tests
    
    # Generate final reports
    generate_coverage_report
    
    log_success "Frontend unit tests completed successfully!"
    log_info "Reports available in: reports/frontend-tests/"
    log_info "Coverage report: coverage/final/index.html"
}

# Error handling
trap 'log_error "Test execution interrupted"; exit 1' INT TERM

# Execute main function
main "$@"