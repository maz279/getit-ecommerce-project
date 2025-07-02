#!/bin/bash

# GetIt Multi-Vendor E-commerce - Vendor Dashboard Build Script
# Enterprise-grade vendor management interface

set -e

echo "🏪 Building GetIt Vendor Dashboard..."

# Configuration
APP_NAME="getit-vendor-dashboard"
BUILD_ENV="${BUILD_ENV:-production}"
TARGET_DIR="dist/vendor"
VENDOR_FEATURES="${VENDOR_FEATURES:-advanced}"

# Create build directory
mkdir -p "$TARGET_DIR"

echo "🏪 Environment: $BUILD_ENV"
echo "📊 Features: $VENDOR_FEATURES"
echo "🎯 Target Directory: $TARGET_DIR"

# Vendor-specific optimizations
echo "🔧 Configuring vendor-specific features..."

# Create vendor-specific vite config
cat > vite.config.vendor.ts << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '$TARGET_DIR',
    sourcemap: '$BUILD_ENV' !== 'production',
    rollupOptions: {
      input: {
        vendor: resolve(__dirname, 'vendor.html'),
        dashboard: resolve(__dirname, 'src/pages/vendor/Dashboard.tsx')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts', 'd3'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          analytics: ['@tanstack/react-query']
        }
      }
    }
  },
  define: {
    'process.env.VENDOR_FEATURES': JSON.stringify('$VENDOR_FEATURES'),
    'process.env.BUILD_TARGET': JSON.stringify('vendor'),
    'process.env.COMMISSION_TRACKING': JSON.stringify(true),
    'process.env.ADVANCED_ANALYTICS': JSON.stringify(true)
  }
})
EOF

# Create vendor-specific HTML entry point
cat > vendor.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vendor-favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GetIt Vendor Dashboard</title>
    <meta name="description" content="Manage your store, track sales, and grow your business on GetIt">
  </head>
  <body>
    <div id="vendor-root"></div>
    <script type="module" src="/src/pages/vendor/main.tsx"></script>
  </body>
</html>
EOF

# Install dependencies
echo "📥 Installing vendor dashboard dependencies..."
npm ci --production=false --silent

# Build vendor dashboard
echo "🚀 Building vendor dashboard..."
npx vite build --config vite.config.vendor.ts

# Generate vendor-specific service worker
echo "📱 Generating vendor service worker..."
cat > "$TARGET_DIR/vendor-sw.js" << 'EOF'
const CACHE_NAME = 'getit-vendor-v1.0.0';
const urlsToCache = [
  '/vendor',
  '/vendor/dashboard',
  '/vendor/analytics',
  '/vendor/products',
  '/vendor/orders'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/vendor/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
EOF

# Create vendor manifest
cat > "$TARGET_DIR/vendor-manifest.json" << 'EOF'
{
  "name": "GetIt Vendor Dashboard",
  "short_name": "GetIt Vendor",
  "description": "Vendor management dashboard for GetIt marketplace",
  "start_url": "/vendor/dashboard",
  "display": "standalone",
  "theme_color": "#1f2937",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/vendor-icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/vendor-icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# Generate vendor build report
cat > "$TARGET_DIR/vendor-build-report.json" << EOF
{
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "target": "vendor-dashboard",
  "environment": "$BUILD_ENV",
  "features": "$VENDOR_FEATURES",
  "size": "$(du -sh $TARGET_DIR | cut -f1)",
  "capabilities": {
    "commissionTracking": true,
    "advancedAnalytics": true,
    "bulkOperations": true,
    "multiChannel": true,
    "realTimeUpdates": true
  }
}
EOF

# Cleanup
rm -f vite.config.vendor.ts vendor.html

echo "✅ Vendor dashboard build completed!"
echo "📂 Build output: $TARGET_DIR"
echo "📊 Build size: $(du -sh $TARGET_DIR | cut -f1)"