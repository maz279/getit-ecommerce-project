
// Define user-management related submenus
export const userManagementSubmenus = [
  'admin-users', 'admin-list', 'role-management', 'permissions', 
  'activity-logs', 'user-analytics', 'registration-trends', 
  'activity-reports', 'demographics'
];

// Define sales-management related submenus
export const salesManagementSubmenus = [
  'sales-overview', 'daily-sales', 'monthly-trends', 'yearly-reports', 
  'revenue-analytics', 'revenue-dashboard', 'profit-margins', 'cost-analysis', 'roi-tracking',
  'sales-reports', 'detailed-reports', 'summary-reports', 'comparative-analysis',
  'export-data', 'sales-forecast'
];

// Define order-management related submenus
export const orderManagementSubmenus = [
  'order-overview', 'all-orders', 'pending-orders', 'confirmed-orders', 'processing-orders',
  'shipped-orders', 'delivered-orders', 'cancelled-orders', 'returned-orders',
  'order-tracking', 'live-tracking', 'delivery-status', 'shipment-updates',
  'returns-refunds', 'return-requests', 'refund-processing', 'refund-management', 'exchange-requests',
  'order-analytics', 'order-reports', 'performance-reports', 'performance-metrics',
  'fulfillment-center', 'order-search', 'order-timeline',
  'bulk-actions', 'bulk', 'new-orders', 'order-processing',
  'payment-status', 'payment-management', 'payment-gateway', 'transaction-monitoring',
  'payment-analytics', 'payment-disputes', 'payment-methods',
  'failed-payments'
];

// Define logistics-management related submenus (REMOVED quality-control to avoid conflict)
export const logisticsManagementSubmenus = [
  'shipping-management', 'warehouse-operations', 'courier-partners', 'shipping-rates',
  'delivery-zones', 'shipping-zones', 'shipping-analytics', 'pick-pack-operations',
  'logistics-overview', 'delivery-tracking', 'shipping-labels', 'return-logistics', 'delivery-performance'
];

// Define product-management related submenus (INCLUDING all product moderation submenus)
export const productManagementSubmenus = [
  'product-catalog', 'all-products', 'inventory-management', 'product-analytics', 
  'add-product', 'bulk-upload', 'product-categories', 'stock-levels', 'low-stock-alerts', 'reorder-points', 
  'warehouse-management', 'warehouse-operations', 'warehouse-analytics', 'best-sellers', 'best-seller', 'top-selling', 'bestsellers', 'product-performance', 
  'trending-products', 'price-optimization', 'product-search', 'featured-products',
  'import-export', 'product-import', 'product-export', 'bulk-operations', 'product-import-export',
  'category-management', 'category-structure', 'category-hierarchy', 'category-attributes', 
  'category-rules', 'category-seo', 'category-performance', 'category-analytics',
  'seasonal-categories', 'seasonal-category-management', 'seasonal-campaigns', 'seasonal-analytics',
  // Product moderation submenus - EXPLICITLY LISTED
  'product-moderation', 'pending-approval', 'content-review', 'quality-control', 'rejected-products',
  // Stock and inventory related submenus - ADDED FOR PROPER ROUTING
  'stock-overview', 'stock-management', 'inventory-overview', 'inventory-tracking', 'stock-analytics',
  'low-stock', 'reorder-alerts', 'inventory-reports', 'stock-reports', 'inventory-analytics',
  // Market trends submenus - ADDED FOR PROPER ROUTING
  'market-trends', 'market-trend', 'trends', 'trend-analysis', 'market-analysis'
];

// Define customer-management related submenus - ENHANCED TO INCLUDE ALL CUSTOMER SUBMENUS
export const customerManagementSubmenus = [
  'customer-database', 'customer-analytics', 'customer-support', 'all-customers', 'customer-segments', 
  'vip-customers', 'customer-search', 'customer-behavior', 'purchase-history', 'loyalty-analysis', 
  'customer-lifetime-value', 'support-tickets', 'live-chat', 'feedback-reviews',
  'customer-overview', 'customer-insights', 'customer-engagement', 'customer-retention',
  'customer-acquisition', 'customer-satisfaction', 'customer-preferences', 'customer-demographics'
];

// Define vendor-management related submenus - COMPREHENSIVE LIST WITH ALL VERIFICATION SYSTEMS
export const vendorManagementSubmenus = [
  'vendor-directory', 'vendor-dashboard', 'active-vendors', 'active', 'suspended-vendors', 'suspended',
  'pending-application', 'pending-applications', 'applications', 'vendor-onboarding', 'onboarding',
  'vendor-verification', 'verification', 'vendor-performance', 'performance', 'vendor-analytics', 'analytics',
  'vendor-payments', 'payments', 'commission-management', 'vendor-support', 'support',
  // VENDOR SEARCH SUBMENUS
  'vendor-search', 'search-vendors', 'find-vendors', 'vendor-finder', 'advanced-vendor-search',
  'vendor-database-search', 'vendor-lookup', 'search-directory',
  // DOCUMENT REVIEW AND KYC VERIFICATION SUBMENUS - CRITICAL ADDITION
  'document-review', 'document-verification', 'kyc-verification', 'kyc-review', 'compliance-check',
  'identity-verification', 'business-verification', 'document-approval', 'verification-queue',
  'rejected-documents', 'pending-verification', 'verified-documents', 'compliance-status',
  // TRADE LICENSE VERIFICATION SUBMENUS
  'trade-license-verification', 'trade-license-review', 'license-validation', 'license-approval',
  'license-renewal', 'expired-licenses', 'license-compliance', 'license-analytics',
  'business-registration', 'regulatory-compliance', 'license-documents', 'certificate-verification',
  // TIN VERIFICATION SUBMENUS
  'tin-verification', 'tin-review', 'tax-verification', 'tin-validation', 'tin-approval',
  'tax-compliance', 'tin-analytics', 'tax-registration', 'tin-documents', 'tax-authority-verification',
  'expired-tin', 'tin-renewal', 'tax-status-check', 'tin-compliance-monitoring',
  // NID VERIFICATION SUBMENUS - NEW ADDITION
  'nid-verification', 'nid-review', 'national-id-verification', 'nid-validation', 'nid-approval',
  'identity-compliance', 'nid-analytics', 'national-id-registration', 'nid-documents', 'identity-authority-verification',
  'expired-nid', 'nid-renewal', 'identity-status-check', 'nid-compliance-monitoring', 'biometric-verification',
  'face-matching', 'identity-fraud-detection', 'nid-blacklist-check', 'identity-verification-api'
];

// Define dashboard-related submenus - CLEANED UP TO AVOID CONFLICTS
export const dashboardSubmenus = [
  'overview', 'analytics', 'real-time-metrics', 'realtime-metrics', 'kpi-monitoring', 'kpi_monitoring',
  'performance-insights', 'performance_insights', 'revenue-analytics', 'user-activity', 
  'order-insights', 'inventory-alerts', 'platform-performance', 
  'system-health', 'security-monitoring', 'system-logs', 'quick-actions', 'executive-summary'
];
