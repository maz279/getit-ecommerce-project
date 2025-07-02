#!/bin/bash

# GetIt Multi-Vendor E-commerce - Customer App Build Script
# Optimized for Amazon/Shopee level performance

set -e

echo "🏗️  Building GetIt Customer App..."

# Configuration
APP_NAME="getit-customer-app"
BUILD_ENV="${BUILD_ENV:-production}"
TARGET_DIR="dist/customer"
OPTIMIZATION_LEVEL="${OPTIMIZATION_LEVEL:-3}"

# Create build directory
mkdir -p "$TARGET_DIR"

# Environment-specific configurations
case $BUILD_ENV in
  "production")
    NODE_ENV=production
    OPTIMIZATION_FLAGS="--optimize --minimize --treeshake"
    ;;
  "staging")
    NODE_ENV=staging
    OPTIMIZATION_FLAGS="--optimize"
    ;;
  "development")
    NODE_ENV=development
    OPTIMIZATION_FLAGS=""
    ;;
esac

echo "📦 Environment: $BUILD_ENV"
echo "🎯 Target Directory: $TARGET_DIR"

# Install dependencies with optimizations
echo "📥 Installing dependencies..."
npm ci --production=false --silent

# Pre-build optimizations
echo "🔧 Pre-build optimizations..."

# Image optimization
if command -v imagemin &> /dev/null; then
  echo "🖼️  Optimizing images..."
  npx imagemin src/assets/**/*.{jpg,png,jpeg,webp} --out-dir=src/assets/optimized/
fi

# CSS purging preparation
echo "💄 Preparing CSS optimizations..."
export PURGE_CSS=true

# TypeScript compilation with optimizations
echo "🔨 Compiling TypeScript..."
npx tsc --project tsconfig.json --declaration false

# Vite build with custom configurations
echo "🚀 Building application..."
cat > vite.config.customer.ts << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '$TARGET_DIR',
    sourcemap: '$BUILD_ENV' === 'development',
    minify: '$BUILD_ENV' === 'production' ? 'terser' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['lodash', 'date-fns'],
          router: ['react-router-dom']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: '$BUILD_ENV' === 'production',
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('$NODE_ENV'),
    'process.env.BUILD_ENV': JSON.stringify('$BUILD_ENV'),
    'process.env.APP_VERSION': JSON.stringify(process.env.npm_package_version || '1.0.0')
  }
})
EOF

# Execute build
npx vite build --config vite.config.customer.ts $OPTIMIZATION_FLAGS

# Post-build optimizations
echo "⚡ Post-build optimizations..."

# Gzip compression
if command -v gzip &> /dev/null; then
  echo "🗜️  Creating gzip files..."
  find "$TARGET_DIR" -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec gzip -k {} \;
fi

# Brotli compression
if command -v brotli &> /dev/null; then
  echo "🗜️  Creating brotli files..."
  find "$TARGET_DIR" -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec brotli -k {} \;
fi

# Generate service worker for PWA
echo "📱 Generating service worker..."
cat > "$TARGET_DIR/sw.js" << 'EOF'
const CACHE_NAME = 'getit-customer-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
EOF

# Generate build report
echo "📊 Generating build report..."
cat > "$TARGET_DIR/build-report.json" << EOF
{
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "$BUILD_ENV",
  "version": "$(npm pkg get version | tr -d '"')",
  "size": "$(du -sh $TARGET_DIR | cut -f1)",
  "optimization": "$OPTIMIZATION_LEVEL",
  "features": {
    "pwa": true,
    "compression": true,
    "treeshaking": true,
    "codesplitting": true
  }
}
EOF

# Cleanup
rm -f vite.config.customer.ts

echo "✅ Customer app build completed successfully!"
echo "📂 Build output: $TARGET_DIR"
echo "📊 Build size: $(du -sh $TARGET_DIR | cut -f1)"

# Optional: Upload to CDN (uncomment when ready)
# if [ "$BUILD_ENV" = "production" ]; then
#   echo "☁️  Uploading to CDN..."
#   aws s3 sync "$TARGET_DIR" s3://getit-customer-assets/ --delete
# fi