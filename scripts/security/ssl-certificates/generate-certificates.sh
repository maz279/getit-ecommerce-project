#!/bin/bash

# GetIt SSL Certificate Generation & Management
# Comprehensive SSL certificate lifecycle management

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
CERT_DIR="$PROJECT_ROOT/certificates"
DOMAIN="getit.com.bd"
VALIDITY_DAYS=365
KEY_SIZE=2048

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

# Setup certificate directory structure
setup_certificate_directories() {
    log_info "Setting up certificate directory structure..."
    
    mkdir -p "$CERT_DIR"/{ca,certs,private,csr,config}
    chmod 700 "$CERT_DIR/private"
    
    # Create index and serial files for CA
    touch "$CERT_DIR/ca/index.txt"
    echo 1000 > "$CERT_DIR/ca/serial"
    
    log_success "Certificate directories created"
}

# Generate Certificate Authority (CA)
generate_ca_certificate() {
    log_info "Generating Certificate Authority (CA)..."
    
    # CA private key
    openssl genrsa -out "$CERT_DIR/private/ca.key" 4096
    chmod 400 "$CERT_DIR/private/ca.key"
    
    # CA certificate
    openssl req -new -x509 -key "$CERT_DIR/private/ca.key" \
        -out "$CERT_DIR/ca/ca.crt" \
        -days 3650 \
        -subj "/C=BD/ST=Dhaka/L=Dhaka/O=GetIt/OU=IT Department/CN=GetIt Root CA"
    
    log_success "CA certificate generated"
}

# Create OpenSSL configuration for domain certificates
create_ssl_config() {
    local domain=$1
    local config_file="$CERT_DIR/config/$domain.conf"
    
    cat > "$config_file" << EOF
[req]
default_bits = $KEY_SIZE
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=BD
ST=Dhaka
L=Dhaka
O=GetIt Bangladesh Ltd
OU=IT Department
CN=$domain

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = $domain
DNS.2 = *.$domain
DNS.3 = www.$domain
DNS.4 = api.$domain
DNS.5 = admin.$domain
DNS.6 = vendor.$domain
DNS.7 = mobile.$domain
DNS.8 = cdn.$domain
EOF

    echo "$config_file"
}

# Generate domain certificate
generate_domain_certificate() {
    local domain=$1
    log_info "Generating certificate for domain: $domain"
    
    # Create SSL config
    local config_file=$(create_ssl_config "$domain")
    
    # Generate private key
    openssl genrsa -out "$CERT_DIR/private/$domain.key" $KEY_SIZE
    chmod 400 "$CERT_DIR/private/$domain.key"
    
    # Generate certificate signing request
    openssl req -new -key "$CERT_DIR/private/$domain.key" \
        -out "$CERT_DIR/csr/$domain.csr" \
        -config "$config_file"
    
    # Generate certificate signed by CA
    openssl ca -batch -in "$CERT_DIR/csr/$domain.csr" \
        -out "$CERT_DIR/certs/$domain.crt" \
        -keyfile "$CERT_DIR/private/ca.key" \
        -cert "$CERT_DIR/ca/ca.crt" \
        -days $VALIDITY_DAYS \
        -extensions v3_req \
        -extfile "$config_file"
    
    # Create certificate chain
    cat "$CERT_DIR/certs/$domain.crt" "$CERT_DIR/ca/ca.crt" > "$CERT_DIR/certs/$domain-chain.crt"
    
    log_success "Certificate generated for $domain"
}

# Generate Let's Encrypt certificate using Certbot
generate_letsencrypt_certificate() {
    local domain=$1
    log_info "Generating Let's Encrypt certificate for: $domain"
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        log_error "Certbot not found. Installing..."
        
        # Install certbot (Ubuntu/Debian)
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y certbot python3-certbot-nginx
        elif command -v yum &> /dev/null; then
            sudo yum install -y certbot python3-certbot-nginx
        else
            log_error "Package manager not supported. Please install certbot manually."
            return 1
        fi
    fi
    
    # Generate certificate
    sudo certbot certonly \
        --nginx \
        --non-interactive \
        --agree-tos \
        --email admin@getit.com.bd \
        -d "$domain" \
        -d "www.$domain" \
        -d "api.$domain" \
        -d "admin.$domain" \
        -d "vendor.$domain"
    
    # Copy certificates to our directory
    sudo cp "/etc/letsencrypt/live/$domain/fullchain.pem" "$CERT_DIR/certs/$domain-letsencrypt.crt"
    sudo cp "/etc/letsencrypt/live/$domain/privkey.pem" "$CERT_DIR/private/$domain-letsencrypt.key"
    sudo chown $(whoami):$(whoami) "$CERT_DIR/certs/$domain-letsencrypt.crt"
    sudo chown $(whoami):$(whoami) "$CERT_DIR/private/$domain-letsencrypt.key"
    
    log_success "Let's Encrypt certificate generated for $domain"
}

# Generate self-signed certificate for development
generate_selfsigned_certificate() {
    local domain=$1
    log_info "Generating self-signed certificate for: $domain"
    
    # Create SSL config
    local config_file=$(create_ssl_config "$domain")
    
    # Generate private key and certificate in one step
    openssl req -x509 -newkey rsa:$KEY_SIZE \
        -keyout "$CERT_DIR/private/$domain-selfsigned.key" \
        -out "$CERT_DIR/certs/$domain-selfsigned.crt" \
        -days $VALIDITY_DAYS \
        -nodes \
        -config "$config_file" \
        -extensions v3_req
    
    chmod 400 "$CERT_DIR/private/$domain-selfsigned.key"
    
    log_success "Self-signed certificate generated for $domain"
}

# Generate wildcard certificate
generate_wildcard_certificate() {
    local base_domain=$1
    local wildcard_domain="*.$base_domain"
    log_info "Generating wildcard certificate for: $wildcard_domain"
    
    # Create wildcard SSL config
    cat > "$CERT_DIR/config/wildcard-$base_domain.conf" << EOF
[req]
default_bits = $KEY_SIZE
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=BD
ST=Dhaka
L=Dhaka
O=GetIt Bangladesh Ltd
OU=IT Department
CN=$wildcard_domain

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = $base_domain
DNS.2 = $wildcard_domain
EOF

    # Generate private key
    openssl genrsa -out "$CERT_DIR/private/wildcard-$base_domain.key" $KEY_SIZE
    chmod 400 "$CERT_DIR/private/wildcard-$base_domain.key"
    
    # Generate certificate signing request
    openssl req -new -key "$CERT_DIR/private/wildcard-$base_domain.key" \
        -out "$CERT_DIR/csr/wildcard-$base_domain.csr" \
        -config "$CERT_DIR/config/wildcard-$base_domain.conf"
    
    # Generate certificate signed by CA
    openssl ca -batch -in "$CERT_DIR/csr/wildcard-$base_domain.csr" \
        -out "$CERT_DIR/certs/wildcard-$base_domain.crt" \
        -keyfile "$CERT_DIR/private/ca.key" \
        -cert "$CERT_DIR/ca/ca.crt" \
        -days $VALIDITY_DAYS \
        -extensions v3_req \
        -extfile "$CERT_DIR/config/wildcard-$base_domain.conf"
    
    # Create certificate chain
    cat "$CERT_DIR/certs/wildcard-$base_domain.crt" "$CERT_DIR/ca/ca.crt" > "$CERT_DIR/certs/wildcard-$base_domain-chain.crt"
    
    log_success "Wildcard certificate generated for $wildcard_domain"
}

# Validate certificate
validate_certificate() {
    local cert_file=$1
    log_info "Validating certificate: $cert_file"
    
    if [ ! -f "$cert_file" ]; then
        log_error "Certificate file not found: $cert_file"
        return 1
    fi
    
    # Check certificate validity
    EXPIRY_DATE=$(openssl x509 -in "$cert_file" -noout -enddate | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
    CURRENT_EPOCH=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
    
    if [ $DAYS_UNTIL_EXPIRY -gt 30 ]; then
        log_success "Certificate valid for $DAYS_UNTIL_EXPIRY days"
    elif [ $DAYS_UNTIL_EXPIRY -gt 0 ]; then
        log_warning "Certificate expires in $DAYS_UNTIL_EXPIRY days"
    else
        log_error "Certificate has expired!"
        return 1
    fi
    
    # Display certificate details
    openssl x509 -in "$cert_file" -noout -text | grep -E "(Subject:|DNS:|Not After)"
}

# Generate Kubernetes TLS secrets
generate_k8s_tls_secrets() {
    local domain=$1
    local namespace=${2:-default}
    log_info "Generating Kubernetes TLS secrets for: $domain"
    
    # Check if certificate exists
    if [ ! -f "$CERT_DIR/certs/$domain.crt" ] || [ ! -f "$CERT_DIR/private/$domain.key" ]; then
        log_error "Certificate or key not found for $domain"
        return 1
    fi
    
    # Create Kubernetes TLS secret
    kubectl create secret tls "$domain-tls" \
        --cert="$CERT_DIR/certs/$domain.crt" \
        --key="$CERT_DIR/private/$domain.key" \
        --namespace="$namespace" \
        --dry-run=client -o yaml > "$CERT_DIR/k8s-$domain-tls-secret.yaml"
    
    log_success "Kubernetes TLS secret generated: $CERT_DIR/k8s-$domain-tls-secret.yaml"
}

# Generate Docker registry certificate
generate_docker_registry_certificate() {
    log_info "Generating Docker registry certificate..."
    
    local registry_domain="registry.getit.com.bd"
    
    # Create registry SSL config
    cat > "$CERT_DIR/config/docker-registry.conf" << EOF
[req]
default_bits = $KEY_SIZE
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=BD
ST=Dhaka
L=Dhaka
O=GetIt Bangladesh Ltd
OU=DevOps Team
CN=$registry_domain

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = $registry_domain
DNS.2 = docker.$registry_domain
IP.1 = 127.0.0.1
IP.2 = 192.168.1.100
EOF

    # Generate private key
    openssl genrsa -out "$CERT_DIR/private/docker-registry.key" $KEY_SIZE
    chmod 400 "$CERT_DIR/private/docker-registry.key"
    
    # Generate certificate
    openssl req -new -x509 -key "$CERT_DIR/private/docker-registry.key" \
        -out "$CERT_DIR/certs/docker-registry.crt" \
        -days $VALIDITY_DAYS \
        -config "$CERT_DIR/config/docker-registry.conf" \
        -extensions v3_req
    
    log_success "Docker registry certificate generated"
}

# Generate database SSL certificates
generate_database_certificates() {
    log_info "Generating database SSL certificates..."
    
    # PostgreSQL certificate
    openssl genrsa -out "$CERT_DIR/private/postgres.key" $KEY_SIZE
    chmod 400 "$CERT_DIR/private/postgres.key"
    
    openssl req -new -x509 -key "$CERT_DIR/private/postgres.key" \
        -out "$CERT_DIR/certs/postgres.crt" \
        -days $VALIDITY_DAYS \
        -subj "/C=BD/ST=Dhaka/L=Dhaka/O=GetIt/OU=Database/CN=postgres.getit.local"
    
    # Redis certificate
    openssl genrsa -out "$CERT_DIR/private/redis.key" $KEY_SIZE
    chmod 400 "$CERT_DIR/private/redis.key"
    
    openssl req -new -x509 -key "$CERT_DIR/private/redis.key" \
        -out "$CERT_DIR/certs/redis.crt" \
        -days $VALIDITY_DAYS \
        -subj "/C=BD/ST=Dhaka/L=Dhaka/O=GetIt/OU=Cache/CN=redis.getit.local"
    
    log_success "Database SSL certificates generated"
}

# Create certificate monitoring script
create_monitoring_script() {
    log_info "Creating certificate monitoring script..."
    
    cat > "$CERT_DIR/monitor-certificates.sh" << 'EOF'
#!/bin/bash

# Certificate monitoring script
CERT_DIR="$(dirname "$0")"
ALERT_DAYS=30

for cert in "$CERT_DIR/certs"/*.crt; do
    if [ -f "$cert" ]; then
        CERT_NAME=$(basename "$cert" .crt)
        EXPIRY_DATE=$(openssl x509 -in "$cert" -noout -enddate | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
        CURRENT_EPOCH=$(date +%s)
        DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
        
        if [ $DAYS_UNTIL_EXPIRY -le $ALERT_DAYS ]; then
            echo "WARNING: Certificate $CERT_NAME expires in $DAYS_UNTIL_EXPIRY days!"
        fi
    fi
done
EOF
    
    chmod +x "$CERT_DIR/monitor-certificates.sh"
    
    log_success "Certificate monitoring script created"
}

# Main execution
main() {
    log_info "Starting SSL certificate generation..."
    
    setup_certificate_directories
    
    # Check if CA exists, if not generate it
    if [ ! -f "$CERT_DIR/ca/ca.crt" ]; then
        generate_ca_certificate
    fi
    
    # Generate certificates based on arguments
    case "${1:-all}" in
        "domain")
            generate_domain_certificate "${2:-$DOMAIN}"
            ;;
        "letsencrypt")
            generate_letsencrypt_certificate "${2:-$DOMAIN}"
            ;;
        "selfsigned")
            generate_selfsigned_certificate "${2:-$DOMAIN}"
            ;;
        "wildcard")
            generate_wildcard_certificate "${2:-getit.com.bd}"
            ;;
        "docker")
            generate_docker_registry_certificate
            ;;
        "database")
            generate_database_certificates
            ;;
        "k8s")
            generate_k8s_tls_secrets "${2:-$DOMAIN}" "${3:-default}"
            ;;
        "all")
            generate_domain_certificate "$DOMAIN"
            generate_selfsigned_certificate "$DOMAIN"
            generate_wildcard_certificate "getit.com.bd"
            generate_docker_registry_certificate
            generate_database_certificates
            ;;
        "validate")
            validate_certificate "${2:-$CERT_DIR/certs/$DOMAIN.crt}"
            ;;
        *)
            echo "Usage: $0 {domain|letsencrypt|selfsigned|wildcard|docker|database|k8s|all|validate} [domain] [namespace]"
            exit 1
            ;;
    esac
    
    create_monitoring_script
    
    log_success "SSL certificate generation completed!"
    log_info "Certificates stored in: $CERT_DIR"
    log_info "Run '$CERT_DIR/monitor-certificates.sh' to check certificate expiry"
}

# Error handling
trap 'log_error "Certificate generation interrupted"; exit 1' INT TERM

# Execute main function
main "$@"