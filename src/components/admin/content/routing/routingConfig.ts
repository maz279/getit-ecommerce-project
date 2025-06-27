
// Dashboard submenus (removing category-analytics from here)
export const dashboardSubmenus = [
  'overview', 'analytics', 'real-time-metrics', 'realtime-metrics', 'kpi-monitoring', 'kpi_monitoring', 
  'performance-insights', 'performance_insights', 'revenue-analytics', 'user-activity', 'vendor-performance', 
  'order-insights', 'inventory-alerts', 'platform-performance', 'system-health', 'security-monitoring', 
  'system-logs', 'quick-actions', 'executive-summary'
];

// Sales management submenus
export const salesSubmenus = [
  'daily-sales', 'monthly-trends', 'yearly-reports', 'revenue-analytics', 'revenue-dashboard', 
  'sales-forecast', 'profit-margins', 'cost-analysis', 'roi-tracking', 'sales-reports', 
  'detailed-reports', 'summary-reports', 'comparative-analysis', 'export-data'
];

// Order management submenus
export const orderSubmenus = [
  'all-orders', 'pending-orders', 'confirmed-orders', 'processing-orders', 'shipped-orders', 
  'delivered-orders', 'cancelled-orders', 'returned-orders', 'order-tracking', 'live-tracking', 
  'delivery-status', 'shipment-updates', 'returns-refunds', 'return-requests', 'refund-processing', 
  'refund-management', 'exchange-requests', 'order-analytics', 'order-reports', 'detailed-reports', 
  'summary-reports', 'performance-reports', 'performance-metrics', 'comparative-analysis', 
  'fulfillment-center', 'order-search', 'order-timeline', 'bulk-actions', 'bulk', 'new-orders', 
  'order-processing', 'payment-status', 'payment-management', 'payment-gateway', 'transaction-monitoring', 
  'payment-analytics', 'payment-disputes', 'payment-methods', 'failed-payments'
];

// Logistics submenus (REMOVED quality-control to avoid conflict with product moderation)
export const logisticsSubmenus = [
  'shipping-management', 'warehouse-operations', 'courier-partners', 'shipping-rates', 
  'delivery-zones', 'shipping-zones', 'shipping-analytics', 'pick-pack-operations', 
  'logistics-overview', 'delivery-tracking', 'shipping-labels', 'return-logistics', 'delivery-performance'
];

// Product management submenus (INCLUDING all product moderation submenus explicitly)
export const productSubmenus = [
  'product-catalog', 'all-products', 'inventory-management', 'product-analytics', 'add-product', 
  'bulk-upload', 'product-categories', 'stock-levels', 'low-stock-alerts', 'reorder-points', 
  'warehouse-management', 'best-sellers', 'product-performance', 'trending-products', 
  'price-optimization', 'product-search', 'featured-products', 'import-export', 'product-import', 
  'product-export', 'bulk-operations', 'category-management', 'category-structure', 'category-hierarchy', 
  'category-attributes', 'category-rules', 'category-analytics', 'category-seo', 'category-performance',
  'seasonal-categories', 'seasonal-category-management', 'seasonal-campaigns', 'seasonal-analytics',
  // Product moderation submenus - EXPLICITLY LISTED TO ENSURE PROPER ROUTING
  'product-moderation', 'pending-approval', 'content-review', 'quality-control', 'rejected-products',
  // Stock and inventory related submenus - ADDED FOR PROPER ROUTING
  'stock-overview', 'stock-management', 'inventory-overview', 'inventory-tracking', 'stock-analytics'
];

// Customer management submenus
export const customerSubmenus = [
  'customer-database', 'customer-analytics', 'customer-support', 'all-customers', 'customer-segments', 
  'vip-customers', 'customer-search', 'customer-behavior', 'purchase-history', 'loyalty-analysis', 
  'customer-lifetime-value', 'support-tickets', 'live-chat', 'feedback-reviews'
];

// Vendor management submenus
export const vendorSubmenus = [
  'vendor-directory', 'vendor-analytics', 'all-vendors', 'vendor-onboarding', 'vendor-verification', 
  'vendor-performance', 'vendor-sales', 'commission-tracking', 'payout-management', 'vendor-ratings'
];

// Marketing submenus
export const marketingSubmenus = [
  'campaigns', 'promotions', 'email-marketing', 'active-campaigns', 'create-campaign', 'campaign-analytics', 
  'a-b-testing', 'discount-codes', 'flash-sales', 'seasonal-offers', 'bundle-deals', 'email-campaigns', 
  'newsletter-management', 'automated-emails'
];

// Analytics submenus
export const analyticsSubmenus = [
  'business-intelligence', 'financial-reports', 'operational-reports', 'executive-dashboard', 'key-metrics', 
  'trend-analysis', 'predictive-analytics', 'profit-loss', 'cash-flow', 'tax-reports', 'audit-reports', 
  'inventory-reports', 'shipping-reports', 'performance-reports'
];

// Payment submenus
export const paymentSubmenus = [
  'payment-processing', 'financial-management', 'transaction-monitoring', 'payment-gateways', 
  'failed-payments', 'payment-analytics', 'revenue-tracking', 'expense-management', 'budget-planning', 
  'financial-forecasting'
];

// Communication submenus
export const communicationSubmenus = [
  'notifications', 'messaging', 'system-notifications', 'push-notifications', 'email-notifications', 
  'sms-notifications', 'customer-messages', 'vendor-communications', 'broadcast-messages'
];

// Security submenus
export const securitySubmenus = [
  'security-monitoring', 'compliance', 'threat-detection', 'fraud-prevention', 'access-logs', 
  'security-alerts', 'data-protection', 'privacy-settings', 'audit-trails', 'compliance-reports'
];

// Settings submenus
export const settingsSubmenus = [
  'system-settings', 'platform-configuration', 'general-settings', 'user-management', 'role-permissions', 
  'api-configuration', 'store-settings', 'payment-configuration', 'shipping-configuration', 'tax-settings'
];
