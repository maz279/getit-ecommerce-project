
// Centralized routing utilities for admin dashboard

// Dashboard submenus
export const dashboardSubmenus = [
  'overview', 'analytics', 'reports', 'metrics', 'real-time-metrics', 'realtime-metrics',
  'kpi-monitoring', 'kpi_monitoring', 'performance-insights', 'performance_insights',
  'revenue-analytics', 'user-activity', 'vendor-performance', 'order-insights',
  'inventory-alerts', 'platform-performance', 'system-health', 'security-monitoring',
  'system-logs', 'quick-actions', 'executive-summary'
];

// User Management submenus
export const userManagementSubmenus = [
  'admin-users', 'user-roles', 'permissions', 'user-analytics', 'admin-list',
  'role-management', 'activity-logs', 'activity-reports', 'registration-trends',
  'demographics', 'user-permissions', 'access-control', 'user-sessions',
  'security-logs', 'audit-trail'
];

// Sales Management submenus
export const salesManagementSubmenus = [
  'sales-overview', 'revenue-analytics', 'sales-reports', 'export-data',
  'daily-sales', 'monthly-trends', 'yearly-reports', 'revenue-dashboard',
  'sales-targets', 'performance-metrics', 'conversion-analytics',
  'customer-acquisition', 'sales-forecasting', 'territory-management'
];

// Order Management submenus
export const orderManagementSubmenus = [
  'order-overview', 'order-processing', 'order-tracking', 'refund-processing',
  'bulk-actions', 'order-reports', 'payment-methods', 'performance-metrics',
  'all-orders', 'pending-orders', 'completed-orders', 'cancelled-orders',
  'order-analytics', 'shipping-management', 'delivery-tracking'
];

// Logistics Management submenus
export const logisticsManagementSubmenus = [
  'logistics-overview', 'delivery-tracking', 'shipping-zones', 'delivery-performance',
  'courier-management', 'warehouse-operations', 'inventory-tracking',
  'supply-chain', 'transportation-analytics', 'route-optimization',
  'cost-analysis', 'delivery-analytics'
];

// Product Management submenus
export const productManagementSubmenus = [
  'product-catalog', 'category-structure', 'inventory-management', 
  'featured-products', 'product-search', 'import-export', 'all-products',
  'stock-overview', 'inventory-overview', 'pending-approval', 'content-review',
  'quality-control', 'rejected-products', 'product-moderation', 'best-sellers',
  'market-trends', 'low-stock-alerts', 'inventory-reports', 'warehouse-management',
  'category-performance', 'category-analytics', 'seasonal-categories',
  'product-analytics', 'add-product', 'bulk-operations'
];

// Customer Management submenus
export const customerManagementSubmenus = [
  'customer-database', 'customer-analytics', 'customer-support', 'live-chat',
  'customer-segments', 'vip-customers', 'customer-behavior', 'all-customers',
  'customer-search', 'purchase-history', 'loyalty-analysis', 'customer-lifetime-value',
  'feedback-reviews', 'customer-insights', 'customer-retention', 'customer-acquisition',
  'customer-satisfaction', 'customer-engagement', 'demographics', 'support-tickets'
];

// Vendor Management submenus
export const vendorManagementSubmenus = [
  'vendor-directory', 'vendor-analytics', 'all-vendors', 'vendor-onboarding',
  'vendor-verification', 'vendor-performance', 'vendor-support', 'vendor-search',
  'vendor-scorecard', 'active-vendors', 'pending-applications', 'suspended-vendors',
  'nid-verification', 'tin-verification', 'trade-license-verification',
  'bank-account-verification', 'document-review', 'vendor-payments',
  'commission-tracking', 'payout-processing', 'revenue-sharing',
  'performance-reports', 'performance-metrics', 'rating-management'
];

// Marketing submenus
export const marketingSubmenus = [
  'campaigns', 'email-marketing', 'social-media', 'advertising',
  'promotions', 'discounts', 'loyalty-programs', 'referral-programs',
  'content-marketing', 'seo-optimization', 'marketing-analytics',
  'campaign-performance', 'lead-generation', 'conversion-tracking'
];

// Analytics submenus
export const analyticsSubmenus = [
  'business-intelligence', 'performance-dashboard', 'data-visualization',
  'custom-reports', 'predictive-analytics', 'user-behavior', 'conversion-analytics',
  'revenue-insights', 'market-analysis', 'competitive-analysis',
  'trend-analysis', 'forecasting', 'data-export'
];

// Payment Management submenus
export const paymentManagementSubmenus = [
  'payment-processing', 'transaction-monitoring', 'payment-gateways',
  'refund-management', 'chargeback-handling', 'payment-analytics',
  'billing-management', 'subscription-management', 'payment-methods',
  'fraud-detection', 'compliance-monitoring', 'financial-reporting'
];

// Communications submenus
export const communicationsSubmenus = [
  'notifications', 'email-templates', 'sms-management', 'push-notifications',
  'announcement-system', 'customer-communications', 'vendor-communications',
  'automated-messaging', 'communication-logs', 'template-management',
  'broadcast-messages', 'communication-analytics'
];

// Security submenus
export const securitySubmenus = [
  'security-monitoring', 'access-control', 'audit-logs', 'threat-detection',
  'vulnerability-assessment', 'security-policies', 'compliance-management',
  'data-protection', 'incident-response', 'security-analytics',
  'authentication', 'authorization', 'security-reports'
];

// Settings submenus
export const settingsSubmenus = [
  'system-settings', 'user-preferences', 'platform-configuration',
  'api-management', 'integration-settings', 'backup-restore',
  'maintenance-mode', 'performance-optimization', 'database-management',
  'cache-management', 'log-management', 'environment-variables'
];

export const getMenuTitle = (menuId: string): string => {
  const titles: Record<string, string> = {
    // Dashboard titles
    'overview': 'Dashboard Overview',
    'analytics': 'Analytics Dashboard',
    'reports': 'Reports',
    'metrics': 'Metrics',
    'real-time-metrics': 'Real-time Metrics',
    'realtime-metrics': 'Real-time Metrics',
    'kpi-monitoring': 'KPI Monitoring',
    'kpi_monitoring': 'KPI Monitoring',
    'performance-insights': 'Performance Insights',
    'performance_insights': 'Performance Insights',
    'revenue-analytics': 'Revenue Analytics',
    'user-activity': 'User Activity',
    'vendor-performance': 'Vendor Performance',
    'order-insights': 'Order Insights',
    'inventory-alerts': 'Inventory Alerts',
    'platform-performance': 'Platform Performance',
    'system-health': 'System Health',
    'security-monitoring': 'Security Monitoring',
    'system-logs': 'System Logs',
    'quick-actions': 'Quick Actions',
    'executive-summary': 'Executive Summary',
    
    // Vendor Management titles
    'vendor-directory': 'Vendor Directory',
    'vendor-analytics': 'Vendor Analytics',
    'all-vendors': 'All Vendors',
    'vendor-onboarding': 'Vendor Onboarding',
    'vendor-verification': 'Vendor Verification',
    'vendor-performance': 'Vendor Performance',
    'vendor-support': 'Vendor Support',
    'vendor-search': 'Vendor Search',
    'vendor-scorecard': 'Vendor Scorecard',
    'active-vendors': 'Active Vendors',
    'pending-applications': 'Pending Applications',
    'suspended-vendors': 'Suspended Vendors',
    'nid-verification': 'NID Verification',
    'tin-verification': 'TIN Verification',
    'trade-license-verification': 'Trade License Verification',
    'bank-account-verification': 'Bank Account Verification',
    'document-review': 'Document Review',
    'vendor-payments': 'Vendor Payments',
    'commission-tracking': 'Commission Tracking',
    'payout-processing': 'Payout Processing',
    'revenue-sharing': 'Revenue Sharing',
    'performance-reports': 'Performance Reports',
    'performance-metrics': 'Performance Metrics',
    'rating-management': 'Rating Management',
    
    // User Management titles
    'admin-users': 'Admin Users',
    'admin-list': 'Admin List',
    'user-roles': 'User Roles',
    'role-management': 'Role Management',
    'permissions': 'Permissions',
    'user-analytics': 'User Analytics',
    'activity-logs': 'Activity Logs',
    'activity-reports': 'Activity Reports',
    'registration-trends': 'Registration Trends',
    'demographics': 'Demographics'
  };
  
  return titles[menuId] || menuId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
