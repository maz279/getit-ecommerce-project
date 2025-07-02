#!/bin/bash

# GetIt PostgreSQL Backup Script
# Comprehensive database backup with encryption and cloud storage

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
BACKUP_DIR="/var/backups/postgresql"
S3_BUCKET="${S3_BUCKET:-getit-database-backups}"
RETENTION_DAYS=30
ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"

# Database configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-getit_production}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"

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

# Setup backup environment
setup_backup_environment() {
    log_info "Setting up backup environment..."
    
    # Create backup directories
    mkdir -p "$BACKUP_DIR"/{full,incremental,transaction-logs,metadata}
    
    # Set permissions
    chmod 700 "$BACKUP_DIR"
    
    # Check PostgreSQL tools
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump not found. Please install PostgreSQL client tools."
        exit 1
    fi
    
    if ! command -v pg_basebackup &> /dev/null; then
        log_error "pg_basebackup not found. Please install PostgreSQL client tools."
        exit 1
    fi
    
    # Check AWS CLI for S3 backup
    if ! command -v aws &> /dev/null; then
        log_warning "AWS CLI not found. S3 backup will be skipped."
    fi
    
    # Check encryption tools
    if [ -n "$ENCRYPTION_KEY" ] && ! command -v gpg &> /dev/null; then
        log_warning "GPG not found. Backup encryption will be skipped."
    fi
    
    log_success "Backup environment ready"
}

# Database connectivity test
test_database_connection() {
    log_info "Testing database connection..."
    
    export PGPASSWORD="$DB_PASSWORD"
    
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; then
        log_success "Database connection successful"
    else
        log_error "Cannot connect to database"
        exit 1
    fi
}

# Generate backup metadata
generate_backup_metadata() {
    local backup_file=$1
    local backup_type=$2
    local metadata_file="${backup_file}.metadata"
    
    cat > "$metadata_file" << EOF
{
    "backup_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "backup_type": "$backup_type",
    "database_name": "$DB_NAME",
    "database_host": "$DB_HOST",
    "database_port": "$DB_PORT",
    "backup_file": "$(basename "$backup_file")",
    "file_size": "$(stat -c%s "$backup_file" 2>/dev/null || echo 0)",
    "checksum": "$(sha256sum "$backup_file" | cut -d' ' -f1)",
    "postgresql_version": "$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT version();" | head -1 | xargs)",
    "backup_command": "$3",
    "compression": "$(file "$backup_file" | grep -o 'gzip compressed' || echo 'none')",
    "encryption": "$([ -f "${backup_file}.gpg" ] && echo 'yes' || echo 'no')"
}
EOF
}

# Full database backup
perform_full_backup() {
    log_info "Performing full database backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/full/getit_full_backup_${timestamp}.sql.gz"
    
    # Create backup with compression
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
        --verbose \
        --format=custom \
        --compress=9 \
        --no-owner \
        --no-acl \
        --create \
        --clean \
        --if-exists \
        "$DB_NAME" | gzip > "$backup_file"
    
    if [ $? -eq 0 ]; then
        log_success "Full backup created: $(basename "$backup_file")"
        
        # Generate metadata
        generate_backup_metadata "$backup_file" "full" "pg_dump --format=custom --compress=9"
        
        # Encrypt if key provided
        encrypt_backup "$backup_file"
        
        # Upload to S3
        upload_to_s3 "$backup_file"
        
        echo "$backup_file"
    else
        log_error "Full backup failed"
        exit 1
    fi
}

# Schema-only backup
perform_schema_backup() {
    log_info "Performing schema-only backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/full/getit_schema_backup_${timestamp}.sql.gz"
    
    # Create schema backup
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
        --verbose \
        --schema-only \
        --no-owner \
        --no-acl \
        --create \
        --clean \
        --if-exists \
        "$DB_NAME" | gzip > "$backup_file"
    
    if [ $? -eq 0 ]; then
        log_success "Schema backup created: $(basename "$backup_file")"
        generate_backup_metadata "$backup_file" "schema" "pg_dump --schema-only"
    else
        log_error "Schema backup failed"
    fi
}

# Data-only backup
perform_data_backup() {
    log_info "Performing data-only backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/full/getit_data_backup_${timestamp}.sql.gz"
    
    # Create data backup
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
        --verbose \
        --data-only \
        --no-owner \
        --no-acl \
        --column-inserts \
        "$DB_NAME" | gzip > "$backup_file"
    
    if [ $? -eq 0 ]; then
        log_success "Data backup created: $(basename "$backup_file")"
        generate_backup_metadata "$backup_file" "data" "pg_dump --data-only --column-inserts"
    else
        log_error "Data backup failed"
    fi
}

# Table-specific backup
backup_critical_tables() {
    log_info "Backing up critical tables..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local critical_tables=("users" "products" "orders" "vendors" "transactions" "commission_tracking")
    
    for table in "${critical_tables[@]}"; do
        local backup_file="$BACKUP_DIR/full/getit_table_${table}_${timestamp}.sql.gz"
        
        pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
            --verbose \
            --table="$table" \
            --data-only \
            --column-inserts \
            "$DB_NAME" | gzip > "$backup_file"
        
        if [ $? -eq 0 ]; then
            log_success "Table backup created: $table"
            generate_backup_metadata "$backup_file" "table" "pg_dump --table=$table"
        else
            log_warning "Failed to backup table: $table"
        fi
    done
}

# Physical backup using pg_basebackup
perform_physical_backup() {
    log_info "Performing physical backup using pg_basebackup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$BACKUP_DIR/physical/getit_physical_${timestamp}"
    
    mkdir -p "$backup_dir"
    
    # Create physical backup
    pg_basebackup -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
        -D "$backup_dir" \
        -Ft \
        -z \
        -P \
        -v \
        -W
    
    if [ $? -eq 0 ]; then
        # Create tar archive
        local archive_file="$BACKUP_DIR/physical/getit_physical_${timestamp}.tar.gz"
        tar -czf "$archive_file" -C "$backup_dir" .
        
        # Remove directory
        rm -rf "$backup_dir"
        
        log_success "Physical backup created: $(basename "$archive_file")"
        generate_backup_metadata "$archive_file" "physical" "pg_basebackup -Ft -z"
        
        # Encrypt and upload
        encrypt_backup "$archive_file"
        upload_to_s3 "$archive_file"
    else
        log_error "Physical backup failed"
    fi
}

# Incremental backup using WAL archiving
perform_incremental_backup() {
    log_info "Performing incremental backup (WAL archiving)..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local wal_backup_dir="$BACKUP_DIR/incremental/wal_${timestamp}"
    
    mkdir -p "$wal_backup_dir"
    
    # Get WAL files location from PostgreSQL
    local wal_location=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SHOW data_directory;" | xargs)
    local wal_dir="${wal_location}/pg_wal"
    
    if [ -d "$wal_dir" ]; then
        # Copy WAL files
        cp "$wal_dir"/0* "$wal_backup_dir"/ 2>/dev/null || true
        
        # Create archive
        local archive_file="$BACKUP_DIR/incremental/getit_wal_${timestamp}.tar.gz"
        tar -czf "$archive_file" -C "$wal_backup_dir" .
        
        # Cleanup
        rm -rf "$wal_backup_dir"
        
        log_success "Incremental backup created: $(basename "$archive_file")"
        generate_backup_metadata "$archive_file" "incremental" "WAL file archiving"
    else
        log_warning "Cannot access WAL directory: $wal_dir"
    fi
}

# Encrypt backup file
encrypt_backup() {
    local backup_file=$1
    
    if [ -n "$ENCRYPTION_KEY" ] && command -v gpg &> /dev/null; then
        log_info "Encrypting backup file..."
        
        # Encrypt using GPG
        echo "$ENCRYPTION_KEY" | gpg --batch --yes --passphrase-fd 0 --cipher-algo AES256 --compress-algo 2 --symmetric --output "${backup_file}.gpg" "$backup_file"
        
        if [ $? -eq 0 ]; then
            log_success "Backup encrypted: $(basename "${backup_file}.gpg")"
            
            # Remove unencrypted file
            rm "$backup_file"
            
            # Update metadata to point to encrypted file
            if [ -f "${backup_file}.metadata" ]; then
                sed -i 's/"encryption": "no"/"encryption": "yes"/' "${backup_file}.metadata"
                sed -i "s/$(basename "$backup_file")/$(basename "${backup_file}.gpg")/" "${backup_file}.metadata"
            fi
        else
            log_error "Backup encryption failed"
        fi
    fi
}

# Upload backup to S3
upload_to_s3() {
    local backup_file=$1
    
    if command -v aws &> /dev/null && [ -n "$S3_BUCKET" ]; then
        log_info "Uploading backup to S3..."
        
        # Determine the actual file to upload (encrypted or original)
        local upload_file="$backup_file"
        if [ -f "${backup_file}.gpg" ]; then
            upload_file="${backup_file}.gpg"
        fi
        
        # Upload to S3 with server-side encryption
        aws s3 cp "$upload_file" "s3://$S3_BUCKET/postgresql/$(date +%Y/%m/%d)/" \
            --storage-class STANDARD_IA \
            --server-side-encryption AES256 \
            --metadata "backup-date=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
        
        if [ $? -eq 0 ]; then
            log_success "Backup uploaded to S3: s3://$S3_BUCKET/postgresql/$(date +%Y/%m/%d)/$(basename "$upload_file")"
            
            # Upload metadata file
            if [ -f "${backup_file}.metadata" ]; then
                aws s3 cp "${backup_file}.metadata" "s3://$S3_BUCKET/postgresql/$(date +%Y/%m/%d)/"
            fi
        else
            log_error "Failed to upload backup to S3"
        fi
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_file=$1
    log_info "Verifying backup integrity..."
    
    # Check if file exists and is not empty
    if [ ! -f "$backup_file" ] || [ ! -s "$backup_file" ]; then
        log_error "Backup file is missing or empty"
        return 1
    fi
    
    # Verify checksum if metadata exists
    if [ -f "${backup_file}.metadata" ]; then
        local stored_checksum=$(grep '"checksum"' "${backup_file}.metadata" | cut -d'"' -f4)
        local current_checksum=$(sha256sum "$backup_file" | cut -d' ' -f1)
        
        if [ "$stored_checksum" = "$current_checksum" ]; then
            log_success "Backup integrity verified"
        else
            log_error "Backup integrity check failed"
            return 1
        fi
    fi
    
    # Try to read the backup file
    if [[ "$backup_file" == *.gz ]]; then
        if gzip -t "$backup_file"; then
            log_success "Backup file is valid gzip archive"
        else
            log_error "Backup file is corrupted"
            return 1
        fi
    fi
    
    return 0
}

# Cleanup old backups
cleanup_old_backups() {
    log_info "Cleaning up backups older than $RETENTION_DAYS days..."
    
    # Local cleanup
    find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -type f -name "*.gpg" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -type f -name "*.metadata" -mtime +$RETENTION_DAYS -delete
    
    # S3 cleanup using lifecycle policies
    if command -v aws &> /dev/null && [ -n "$S3_BUCKET" ]; then
        cat > /tmp/lifecycle-policy.json << EOF
{
    "Rules": [
        {
            "ID": "DeleteOldBackups",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "postgresql/"
            },
            "Transitions": [
                {
                    "Days": 30,
                    "StorageClass": "GLACIER"
                },
                {
                    "Days": 90,
                    "StorageClass": "DEEP_ARCHIVE"
                }
            ],
            "Expiration": {
                "Days": $((RETENTION_DAYS + 365))
            }
        }
    ]
}
EOF
        
        aws s3api put-bucket-lifecycle-configuration \
            --bucket "$S3_BUCKET" \
            --lifecycle-configuration file:///tmp/lifecycle-policy.json
        
        rm /tmp/lifecycle-policy.json
    fi
    
    log_success "Cleanup completed"
}

# Generate backup report
generate_backup_report() {
    log_info "Generating backup report..."
    
    local report_file="$BACKUP_DIR/backup_report_$(date +%Y%m%d).txt"
    
    cat > "$report_file" << EOF
GetIt PostgreSQL Backup Report
Generated: $(date)

Database Information:
- Host: $DB_HOST
- Port: $DB_PORT
- Database: $DB_NAME
- User: $DB_USER

Backup Statistics:
- Full backups: $(find "$BACKUP_DIR/full" -name "getit_full_backup_*.sql.gz" -mtime -1 | wc -l)
- Schema backups: $(find "$BACKUP_DIR/full" -name "getit_schema_backup_*.sql.gz" -mtime -1 | wc -l)
- Data backups: $(find "$BACKUP_DIR/full" -name "getit_data_backup_*.sql.gz" -mtime -1 | wc -l)
- Physical backups: $(find "$BACKUP_DIR/physical" -name "getit_physical_*.tar.gz" -mtime -1 | wc -l)
- Incremental backups: $(find "$BACKUP_DIR/incremental" -name "getit_wal_*.tar.gz" -mtime -1 | wc -l)

Storage Usage:
- Local backup size: $(du -sh "$BACKUP_DIR" | cut -f1)
- Oldest backup: $(find "$BACKUP_DIR" -type f -name "*.gz" | xargs ls -lt | tail -1 | awk '{print $6" "$7" "$8}')
- Newest backup: $(find "$BACKUP_DIR" -type f -name "*.gz" | xargs ls -lt | head -1 | awk '{print $6" "$7" "$8}')

Recent Backup Files:
$(find "$BACKUP_DIR" -type f -name "*.gz" -mtime -1 -exec ls -lh {} \; | awk '{print $9" ("$5")"}')

S3 Upload Status:
$([ -n "$S3_BUCKET" ] && echo "Enabled - Bucket: $S3_BUCKET" || echo "Disabled")

Encryption Status:
$([ -n "$ENCRYPTION_KEY" ] && echo "Enabled" || echo "Disabled")
EOF

    log_success "Backup report generated: $report_file"
}

# Main backup function
main() {
    local backup_type="${1:-full}"
    
    log_info "Starting PostgreSQL backup process..."
    log_info "Backup type: $backup_type"
    
    setup_backup_environment
    test_database_connection
    
    case "$backup_type" in
        "full")
            perform_full_backup
            perform_schema_backup
            backup_critical_tables
            ;;
        "incremental")
            perform_incremental_backup
            ;;
        "physical")
            perform_physical_backup
            ;;
        "schema")
            perform_schema_backup
            ;;
        "data")
            perform_data_backup
            ;;
        "all")
            perform_full_backup
            perform_schema_backup
            perform_data_backup
            perform_physical_backup
            perform_incremental_backup
            backup_critical_tables
            ;;
        *)
            log_error "Unknown backup type: $backup_type"
            log_info "Available types: full, incremental, physical, schema, data, all"
            exit 1
            ;;
    esac
    
    cleanup_old_backups
    generate_backup_report
    
    log_success "PostgreSQL backup process completed successfully!"
    log_info "Backup location: $BACKUP_DIR"
    log_info "S3 location: s3://$S3_BUCKET/postgresql/$(date +%Y/%m/%d)/"
}

# Error handling
trap 'log_error "Backup process interrupted"; exit 1' INT TERM

# Execute main function
main "$@"