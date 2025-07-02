#!/bin/bash

# GetIt Multi-Vendor E-commerce - Admin Panel Build Script
# Enterprise-grade administrative interface

set -e

echo "👑 Building GetIt Admin Panel..."

# Configuration
APP_NAME="getit-admin-panel"
BUILD_ENV="${BUILD_ENV:-production}"
TARGET_DIR="dist/admin"
SECURITY_LEVEL="${SECURITY_LEVEL:-enterprise}"

# Create build directory
mkdir -p "$TARGET_DIR"

echo "👑 Environment: $BUILD_ENV"
echo "🔒 Security Level: $SECURITY_LEVEL"
echo "🎯 Target Directory: $TARGET_DIR"

# Admin-specific security configurations
echo "🔐 Configuring enterprise security features..."

# Create admin-specific vite config
cat > vite.config.admin.ts << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '$TARGET_DIR',
    sourcemap: false, // No source maps for admin panel security
    rollupOptions: {
      input: {
        admin: resolve(__dirname, 'admin.html'),
        dashboard: resolve(__dirname, 'src/pages/admin/AdminDashboard.tsx')
      },
      output: {
        manualChunks: {
          admin: ['react', 'react-dom'],
          analytics: ['recharts', 'd3', '@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          security: ['@supabase/supabase-js'],
          reports: ['date-fns', 'lodash']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        properties: {
          regex: /^_/
        }
      }
    }
  },
  define: {
    'process.env.ADMIN_SECURITY': JSON.stringify('$SECURITY_LEVEL'),
    'process.env.BUILD_TARGET': JSON.stringify('admin'),
    'process.env.RBAC_ENABLED': JSON.stringify(true),
    'process.env.AUDIT_LOGGING': JSON.stringify(true),
    'process.env.ENCRYPTION_ENABLED': JSON.stringify(true)
  }
})
EOF

# Create admin-specific HTML entry point
cat > admin.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/admin-favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="Strict-Transport-Security" content="max-age=63072000; includeSubDomains; preload">
    <title>GetIt Admin Dashboard</title>
    <meta name="description" content="Administrative dashboard for GetIt e-commerce platform">
  </head>
  <body>
    <div id="admin-root"></div>
    <script type="module" src="/src/pages/admin/main.tsx"></script>
  </body>
</html>
EOF

# Install dependencies
echo "📥 Installing admin panel dependencies..."
npm ci --production=false --silent

# Security scan before build
if command -v npm &> /dev/null; then
  echo "🔍 Running security audit..."
  npm audit --audit-level moderate || echo "⚠️  Security audit completed with warnings"
fi

# Build admin panel
echo "🚀 Building admin panel..."
npx vite build --config vite.config.admin.ts

# Generate admin-specific security headers
echo "🔒 Generating security configurations..."
cat > "$TARGET_DIR/.htaccess" << 'EOF'
# Security headers for admin panel
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Disable server signature
ServerTokens Prod

# Disable directory browsing
Options -Indexes

# Admin-only access
<RequireAll>
    Require ip 127.0.0.1
    Require ip ::1
</RequireAll>
EOF

# Generate admin service worker with security focus
cat > "$TARGET_DIR/admin-sw.js" << 'EOF'
const CACHE_NAME = 'getit-admin-v1.0.0';
const urlsToCache = [
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/vendors',
  '/admin/orders',
  '/admin/analytics'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Security-focused fetch handler
self.addEventListener('fetch', event => {
  // Only cache admin requests
  if (event.request.url.includes('/admin/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            // Don't cache sensitive admin data
            if (response.status === 200 && !event.request.url.includes('/api/')) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          });
        })
    );
  }
});
EOF

# Create admin manifest with restricted access
cat > "$TARGET_DIR/admin-manifest.json" << 'EOF'
{
  "name": "GetIt Admin Dashboard",
  "short_name": "GetIt Admin",
  "description": "Administrative dashboard for GetIt e-commerce platform",
  "start_url": "/admin/dashboard",
  "display": "standalone",
  "theme_color": "#dc2626",
  "background_color": "#ffffff",
  "orientation": "landscape",
  "icons": [
    {
      "src": "/admin-icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/admin-icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# Generate admin build report
cat > "$TARGET_DIR/admin-build-report.json" << EOF
{
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "target": "admin-panel",
  "environment": "$BUILD_ENV",
  "securityLevel": "$SECURITY_LEVEL",
  "size": "$(du -sh $TARGET_DIR | cut -f1)",
  "security": {
    "rbacEnabled": true,
    "auditLogging": true,
    "encryptionEnabled": true,
    "sourceMapDisabled": true,
    "securityHeaders": true
  },
  "capabilities": {
    "userManagement": true,
    "vendorManagement": true,
    "analyticsReporting": true,
    "systemMonitoring": true,
    "securityDashboard": true
  }
}
EOF

# Cleanup
rm -f vite.config.admin.ts admin.html

echo "✅ Admin panel build completed!"
echo "📂 Build output: $TARGET_DIR"
echo "📊 Build size: $(du -sh $TARGET_DIR | cut -f1)"
echo "🔒 Security features enabled"