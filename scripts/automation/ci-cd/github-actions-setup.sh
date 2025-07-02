#!/bin/bash

# GetIt GitHub Actions CI/CD Pipeline Setup
# Comprehensive DevOps automation for multi-environment deployment

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
WORKFLOWS_DIR="$PROJECT_ROOT/.github/workflows"
ENVIRONMENTS=("development" "staging" "production")

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

# Setup directory structure
setup_workflows_directory() {
    log_info "Setting up GitHub Actions workflows directory..."
    
    mkdir -p "$WORKFLOWS_DIR"
    mkdir -p "$PROJECT_ROOT/.github/ISSUE_TEMPLATE"
    mkdir -p "$PROJECT_ROOT/.github/PULL_REQUEST_TEMPLATE"
    
    log_success "Workflows directory structure created"
}

# Create main CI workflow
create_ci_workflow() {
    log_info "Creating main CI workflow..."
    
    cat > "$WORKFLOWS_DIR/ci.yml" << 'EOF'
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  # Code Quality & Linting
  lint-and-format:
    name: Code Quality Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run Prettier check
        run: pnpm format:check

      - name: Run TypeScript check
        run: pnpm type-check

  # Security Scanning
  security-scan:
    name: Security Vulnerability Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run npm audit
        run: npm audit --audit-level high

  # Unit Tests
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # Integration Tests
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: getit_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run database migrations
        run: pnpm db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/getit_test

      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/getit_test
          REDIS_URL: redis://localhost:6379

  # Build Application
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint-and-format, security-scan, unit-tests]
    strategy:
      matrix:
        target: [customer-app, vendor-dashboard, admin-panel]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build ${{ matrix.target }}
        run: pnpm build:${{ matrix.target }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.target }}-build
          path: dist/${{ matrix.target }}
          retention-days: 30

  # E2E Tests
  e2e-tests:
    name: End-to-End Tests
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: customer-app-build
          path: dist/customer-app

      - name: Start application
        run: pnpm start:test &
        env:
          PORT: 3000

      - name: Wait for application
        run: npx wait-on http://localhost:3000

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # Performance Tests
  performance-tests:
    name: Performance Tests
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: customer-app-build
          path: dist/customer-app

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './.lighthouserc.js'
          uploadArtifacts: true
          temporaryPublicStorage: true

  # Docker Build
  docker-build:
    name: Docker Build & Push
    runs-on: ubuntu-latest
    needs: [integration-tests, build]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Notification
  notify:
    name: Notify Team
    runs-on: ubuntu-latest
    needs: [e2e-tests, performance-tests, docker-build]
    if: always()
    steps:
      - name: Notify Slack on success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: 'CI pipeline completed successfully! 🎉'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

      - name: Notify Slack on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: 'CI pipeline failed! 🚨'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
EOF

    log_success "Main CI workflow created"
}

# Create CD workflow
create_cd_workflow() {
    log_info "Creating CD workflow..."
    
    cat > "$WORKFLOWS_DIR/cd.yml" << 'EOF'
name: Continuous Deployment

on:
  push:
    branches:
      - main
      - develop
    tags:
      - 'v*'

env:
  NODE_VERSION: '18'
  KUBECTL_VERSION: '1.28.0'

jobs:
  # Determine deployment environment
  determine-environment:
    name: Determine Deployment Environment
    runs-on: ubuntu-latest
    outputs:
      environment: ${{ steps.env.outputs.environment }}
      namespace: ${{ steps.env.outputs.namespace }}
    steps:
      - name: Determine environment
        id: env
        run: |
          if [[ $GITHUB_REF == refs/tags/v* ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
            echo "namespace=production" >> $GITHUB_OUTPUT
          elif [[ $GITHUB_REF == refs/heads/main ]]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
            echo "namespace=staging" >> $GITHUB_OUTPUT
          else
            echo "environment=development" >> $GITHUB_OUTPUT
            echo "namespace=development" >> $GITHUB_OUTPUT
          fi

  # Deploy to Kubernetes
  deploy:
    name: Deploy to ${{ needs.determine-environment.outputs.environment }}
    runs-on: ubuntu-latest
    needs: determine-environment
    environment:
      name: ${{ needs.determine-environment.outputs.environment }}
      url: https://${{ needs.determine-environment.outputs.environment }}.getit.com.bd
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: ${{ env.KUBECTL_VERSION }}

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-1

      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name getit-${{ needs.determine-environment.outputs.environment }}-cluster

      - name: Deploy to Kubernetes
        run: |
          envsubst < k8s/deployment.yaml | kubectl apply -f -
          kubectl rollout status deployment/getit-app -n ${{ needs.determine-environment.outputs.namespace }}
        env:
          ENVIRONMENT: ${{ needs.determine-environment.outputs.environment }}
          NAMESPACE: ${{ needs.determine-environment.outputs.namespace }}
          IMAGE_TAG: ${{ github.sha }}

      - name: Run smoke tests
        run: |
          kubectl run smoke-test-${{ github.run_number }} \
            --image=ghcr.io/${{ github.repository }}:${{ github.sha }} \
            --restart=Never \
            --rm -i \
            --command -- /bin/sh -c "curl -f http://getit-app.${{ needs.determine-environment.outputs.namespace }}.svc.cluster.local/health"

  # Database Migration
  migrate-database:
    name: Database Migration
    runs-on: ubuntu-latest
    needs: [determine-environment, deploy]
    if: needs.determine-environment.outputs.environment != 'production' || startsWith(github.ref, 'refs/tags/')
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: ${{ secrets[format('DATABASE_URL_{0}', upper(needs.determine-environment.outputs.environment))] }}

  # Update monitoring
  update-monitoring:
    name: Update Monitoring & Alerts
    runs-on: ubuntu-latest
    needs: [determine-environment, deploy]
    steps:
      - name: Update Grafana dashboards
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.GRAFANA_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d @monitoring/grafana-dashboard.json \
            "${{ secrets.GRAFANA_URL }}/api/dashboards/db"

      - name: Update Prometheus alerts
        run: |
          kubectl apply -f monitoring/prometheus-alerts.yaml -n monitoring

  # Post-deployment tests
  post-deployment-tests:
    name: Post-Deployment Tests
    runs-on: ubuntu-latest
    needs: [determine-environment, deploy, migrate-database]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run API health checks
        run: |
          chmod +x scripts/testing/integration-tests/test-api-integration.sh
          scripts/testing/integration-tests/test-api-integration.sh
        env:
          API_BASE_URL: https://${{ needs.determine-environment.outputs.environment }}.getit.com.bd

      - name: Run load tests
        if: needs.determine-environment.outputs.environment == 'staging'
        run: |
          docker run --rm -v $(pwd)/tests/load:/tests \
            loadimpact/k6 run /tests/load-test.js \
            --env BASE_URL=https://${{ needs.determine-environment.outputs.environment }}.getit.com.bd

  # Security scan post-deployment
  security-scan-live:
    name: Live Security Scan
    runs-on: ubuntu-latest
    needs: [determine-environment, deploy]
    if: needs.determine-environment.outputs.environment == 'staging'
    steps:
      - name: Run OWASP ZAP baseline scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'https://${{ needs.determine-environment.outputs.environment }}.getit.com.bd'
          rules_file_name: '.zap/rules.tsv'

  # Rollback capability
  rollback:
    name: Rollback Deployment
    runs-on: ubuntu-latest
    if: failure() && needs.determine-environment.outputs.environment == 'production'
    needs: [determine-environment, deploy, post-deployment-tests]
    steps:
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: ${{ env.KUBECTL_VERSION }}

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-1

      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name getit-production-cluster

      - name: Rollback deployment
        run: |
          kubectl rollout undo deployment/getit-app -n production
          kubectl rollout status deployment/getit-app -n production

      - name: Notify team of rollback
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: '🚨 Production deployment failed and was rolled back!'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  # Notify deployment success
  notify-success:
    name: Notify Deployment Success
    runs-on: ubuntu-latest
    needs: [determine-environment, deploy, post-deployment-tests, security-scan-live]
    if: success()
    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: '🚀 Successfully deployed to ${{ needs.determine-environment.outputs.environment }}!'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
EOF

    log_success "CD workflow created"
}

# Create dependency update workflow
create_dependency_update_workflow() {
    log_info "Creating dependency update workflow..."
    
    cat > "$WORKFLOWS_DIR/dependency-update.yml" << 'EOF'
name: Dependency Updates

on:
  schedule:
    - cron: '0 2 * * 1' # Every Monday at 2 AM
  workflow_dispatch:

jobs:
  update-dependencies:
    name: Update Dependencies
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: '8'

      - name: Update dependencies
        run: |
          pnpm update --latest
          pnpm audit fix

      - name: Run tests
        run: |
          pnpm install
          pnpm test
          pnpm build

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore: update dependencies'
          title: 'chore: weekly dependency updates'
          body: |
            Automated dependency updates:
            
            - Updated all dependencies to latest versions
            - Fixed any security vulnerabilities
            - All tests passing ✅
            
            Please review and merge if all checks pass.
          branch: dependency-updates
          delete-branch: true

  security-audit:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Run security audit
        run: |
          npm audit --audit-level high
          npx better-npm-audit audit

      - name: Upload audit results
        uses: actions/upload-artifact@v3
        with:
          name: security-audit-results
          path: audit-results.json
EOF

    log_success "Dependency update workflow created"
}

# Create release workflow
create_release_workflow() {
    log_info "Creating release workflow..."
    
    cat > "$WORKFLOWS_DIR/release.yml" << 'EOF'
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  create-release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate changelog
        id: changelog
        run: |
          PREV_TAG=$(git describe --tags --abbrev=0 HEAD^)
          echo "changelog<<EOF" >> $GITHUB_OUTPUT
          git log --pretty=format:"- %s (%h)" $PREV_TAG..HEAD >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref_name }}
          release_name: Release ${{ github.ref_name }}
          body: |
            ## Changes in this release
            
            ${{ steps.changelog.outputs.changelog }}
            
            ## Deployment
            
            This release will be automatically deployed to production.
          draft: false
          prerelease: false

  build-and-upload-assets:
    name: Build and Upload Release Assets
    runs-on: ubuntu-latest
    strategy:
      matrix:
        target: [customer-app, vendor-dashboard, admin-panel]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: '8'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build ${{ matrix.target }}
        run: pnpm build:${{ matrix.target }}

      - name: Create release archive
        run: |
          cd dist/${{ matrix.target }}
          tar -czf ../../${{ matrix.target }}-${{ github.ref_name }}.tar.gz .

      - name: Upload release asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ needs.create-release.outputs.upload_url }}
          asset_path: ./${{ matrix.target }}-${{ github.ref_name }}.tar.gz
          asset_name: ${{ matrix.target }}-${{ github.ref_name }}.tar.gz
          asset_content_type: application/gzip
EOF

    log_success "Release workflow created"
}

# Create backup workflow
create_backup_workflow() {
    log_info "Creating backup workflow..."
    
    cat > "$WORKFLOWS_DIR/backup.yml" << 'EOF'
name: Automated Backups

on:
  schedule:
    - cron: '0 1 * * *' # Daily at 1 AM
    - cron: '0 3 * * 0' # Weekly on Sunday at 3 AM
  workflow_dispatch:
    inputs:
      backup_type:
        description: 'Type of backup'
        required: true
        default: 'daily'
        type: choice
        options:
          - daily
          - weekly
          - monthly
          - full

jobs:
  database-backup:
    name: Database Backup
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-1

      - name: Run database backup
        run: |
          chmod +x scripts/database/backups/backup-postgresql.sh
          scripts/database/backups/backup-postgresql.sh
        env:
          BACKUP_TYPE: ${{ github.event.inputs.backup_type || 'daily' }}
          S3_BUCKET: getit-backups

      - name: Verify backup
        run: |
          chmod +x scripts/database/backups/backup-verification.sh
          scripts/database/backups/backup-verification.sh

  file-backup:
    name: File System Backup
    runs-on: ubuntu-latest
    steps:
      - name: Backup user uploads
        run: |
          aws s3 sync s3://getit-user-uploads s3://getit-backups/user-uploads/$(date +%Y-%m-%d)

      - name: Backup configuration files
        run: |
          kubectl get configmaps -o yaml > configmaps-backup.yaml
          aws s3 cp configmaps-backup.yaml s3://getit-backups/k8s-configs/$(date +%Y-%m-%d)/

  notify-backup-status:
    name: Notify Backup Status
    runs-on: ubuntu-latest
    needs: [database-backup, file-backup]
    if: always()
    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Backup completed with status: ${{ job.status }}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
EOF

    log_success "Backup workflow created"
}

# Create issue templates
create_issue_templates() {
    log_info "Creating GitHub issue templates..."
    
    # Bug report template
    cat > "$PROJECT_ROOT/.github/ISSUE_TEMPLATE/bug_report.md" << 'EOF'
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
- OS: [e.g. iOS, Windows]
- Device: [e.g. iPhone6, Desktop]

## Additional Context
Add any other context about the problem here.
EOF

    # Feature request template
    cat > "$PROJECT_ROOT/.github/ISSUE_TEMPLATE/feature_request.md" << 'EOF'
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: 'enhancement'
assignees: ''
---

## Feature Description
A clear and concise description of what you want to happen.

## Problem Statement
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

## Proposed Solution
A clear and concise description of what you want to happen.

## Alternative Solutions
A clear and concise description of any alternative solutions or features you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
EOF

    log_success "Issue templates created"
}

# Create pull request template
create_pull_request_template() {
    log_info "Creating pull request template..."
    
    cat > "$PROJECT_ROOT/.github/PULL_REQUEST_TEMPLATE.md" << 'EOF'
## Description
Brief description of changes made in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots
If applicable, add screenshots of the changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Deployment Notes
Any special deployment considerations or migration steps required.
EOF

    log_success "Pull request template created"
}

# Create GitHub Actions secrets documentation
create_secrets_documentation() {
    log_info "Creating secrets documentation..."
    
    cat > "$PROJECT_ROOT/.github/SECRETS.md" << 'EOF'
# GitHub Actions Secrets Configuration

This document lists all the secrets that need to be configured in GitHub Actions for the CI/CD pipelines to work properly.

## Required Secrets

### AWS Deployment
- `AWS_ACCESS_KEY_ID` - AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for deployment

### Database
- `DATABASE_URL_DEVELOPMENT` - Development database connection string
- `DATABASE_URL_STAGING` - Staging database connection string
- `DATABASE_URL_PRODUCTION` - Production database connection string

### Supabase
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### Monitoring & Notifications
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications
- `GRAFANA_API_KEY` - Grafana API key for dashboard updates
- `GRAFANA_URL` - Grafana instance URL

### Security
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `DOCKER_REGISTRY_TOKEN` - Docker registry authentication token

### Bangladesh-specific Services
- `BKASH_API_KEY` - bKash payment gateway API key
- `NAGAD_API_KEY` - Nagad payment gateway API key
- `PATHAO_API_KEY` - Pathao courier service API key
- `SSL_WIRELESS_API_KEY` - SSL Wireless SMS service API key

## Setting Up Secrets

1. Go to your repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add each secret with its corresponding value

## Environment-specific Secrets

For environment-specific deployments, prefix secrets with the environment name:
- `STAGING_*` for staging environment
- `PRODUCTION_*` for production environment

## Security Best Practices

- Rotate secrets regularly
- Use least privilege principle
- Monitor secret usage through GitHub Actions logs
- Never log or expose secrets in workflow outputs
EOF

    log_success "Secrets documentation created"
}

# Main execution
main() {
    log_info "Setting up GitHub Actions CI/CD pipelines..."
    
    setup_workflows_directory
    
    # Create all workflows
    create_ci_workflow
    create_cd_workflow
    create_dependency_update_workflow
    create_release_workflow
    create_backup_workflow
    
    # Create templates and documentation
    create_issue_templates
    create_pull_request_template
    create_secrets_documentation
    
    log_success "GitHub Actions CI/CD setup completed!"
    log_info "Workflows created in: $WORKFLOWS_DIR"
    log_info "Configure secrets as described in: .github/SECRETS.md"
    log_warning "Remember to set up the required secrets in your GitHub repository settings"
}

# Error handling
trap 'log_error "GitHub Actions setup interrupted"; exit 1' INT TERM

# Execute main function
main "$@"