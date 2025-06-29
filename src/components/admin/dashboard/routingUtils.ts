// Dashboard submenus
export const dashboardSubmenus = [
  'overview',
  'analytics',
  'reports',
  'metrics',
  'real-time-metrics',
  'realtime-metrics',
  'kpi-monitoring',
  'kpi_monitoring',
  'performance-insights',
  'performance_insights',
  'revenue-analytics',
  'user-activity',
  'vendor-performance',
  'order-insights',
  'inventory-alerts',
  'platform-performance',
  'system-health',
  'security-monitoring',
  'system-logs',
  'quick-actions',
  'executive-summary'
];

// User management submenus - Updated to include analytics submenus
export const userManagementSubmenus = [
  'admin-users',
  'admin-list',
  'user-analytics',
  'user-behavior',          // Added for analytics submenu
  'customer-segmentation',  // Added for analytics submenu
  'lifetime-value',        // Added for analytics submenu
  'user-permissions',
  'permissions',
  'role-management',
  'user-activity-logs',
  'activity-logs',
  'user-reports',
  'activity-reports',
  'access-control',
  'user-security',
  'user-overview',
  'active-users',
  'inactive-users',
  'banned-users',
  'user-verification',
  'user-settings',
  'registration-trends',
  'demographics',
  'user-demographics'
];

// Sales management submenus
export const salesManagementSubmenus = [
  'sales-overview',
  'revenue-analytics',
  'revenue-dashboard',
  'sales-forecast',
  'profit-margins',
  'cost-analysis',
  'roi-tracking',
  'comparative-analysis',
  'detailed-reports',
  'export-data',
  'daily-sales',
  'monthly-sales',
  'yearly-sales',
  'sales-reports'
];

// Order management submenus - CRITICAL FIX: Added missing submenus
export const orderManagementSubmenus = [
  'order-overview',
  'all-orders',
  'order-processing',
  'order-tracking',
  'order-reports',
  'refund-processing',
  'bulk-actions',
  'performance-metrics',
  'payment-methods',
  // CRITICAL: Adding the missing order status submenus
  'new-orders',
  'processing-orders',
  'shipped-orders',
  'delivered-orders',
  'cancelled-orders',
  'pending-orders',
  'completed-orders',
  'failed-orders',
  'returned-orders',
  // Additional order management submenus
  'order-search',
  'order-timeline',
  'order-analytics',
  'payment-status',
  'failed-payments',
  'order-history',
  'order-details',
  'order-management',
  'live-tracking'
];

// Logistics management submenus - FIXED: Added courier-partners
export const logisticsManagementSubmenus = [
  'logistics-overview',
  'delivery-tracking',
  'delivery-performance',
  'shipping-zones',
  'courier-management',
  'courier-partners',  // ADDED: This was missing
  'warehouse-operations',
  'inventory-tracking',
  'supply-chain',
  'transportation-analytics',
  'route-optimization',
  'cost-analysis',
  'delivery-analytics'
];

// Product management submenus
export const productManagementSubmenus = [
  'product-catalog',
  'all-products',
  'pending-approval',
  'rejected-products',
  'featured-products',
  'best-sellers',
  'category-structure',
  'category-analytics',
  'category-performance',
  'seasonal-categories',
  'product-search',
  'content-review',
  'quality-control',
  'product-import-export',
  'market-trends',
  'inventory-overview',
  'stock-overview',
  'low-stock-alerts',
  'warehouse-management',
  'inventory-reports'
];

// Customer management submenus
export const customerManagementSubmenus = [
  'customer-database',
  'all-customers',
  'vip-customers',
  'customer-segments',
  'customer-analytics',
  'customer-behavior',
  'clv',
  'loyalty-analysis',
  'purchase-history',
  'customer-support',
  'live-chat',
  'feedback-reviews',
  'customer-search'
];

// Vendor management submenus
export const vendorManagementSubmenus = [
  'vendor-directory',
  'active-vendors',
  'pending-applications',
  'suspended-vendors',
  'vendor-analytics',
  'vendor-performance',
  'vendor-performance-metrics',
  'vendor-performance-reports',
  'vendor-scorecard',
  'vendor-onboarding',
  'vendor-verification',
  'nid-verification',
  'tin-verification',
  'trade-license-verification',
  'bank-account-verification',
  'document-review',
  'vendor-payments',
  'payout-processing',
  'commission-tracking',
  'revenue-sharing',
  'rating-management',
  'vendor-support',
  'vendor-search'
];

// Marketing submenus
export const marketingSubmenus = [
  'campaigns',
  'email-marketing',
  'sms-marketing',
  'social-media',
  'content-marketing',
  'seo-optimization',
  'affiliate-marketing',
  'influencer-partnerships',
  'promotional-offers',
  'discount-management',
  'loyalty-programs',
  'referral-programs',
  'marketing-analytics',
  'campaign-performance',
  'roi-analysis',
  'customer-acquisition',
  'marketing-automation',
  'lead-generation',
  'conversion-optimization',
  'marketing-budget'
];

// Analytics submenus
export const analyticsSubmenus = [
  'business-intelligence',
  'sales-analytics',
  'customer-analytics',
  'product-analytics',
  'marketing-analytics',
  'financial-analytics',
  'operational-analytics',
  'predictive-analytics',
  'real-time-analytics',
  'custom-reports',
  'data-visualization',
  'performance-metrics',
  'trend-analysis',
  'comparative-analysis',
  'forecast-modeling',
  'data-export',
  'automated-reports',
  'alert-management',
  'dashboard-customization',
  'analytics-api'
];

// Payment management submenus
export const paymentManagementSubmenus = [
  'payment-processing',
  'transaction-monitoring',
  'payment-methods',
  'gateway-management',
  'fraud-detection',
  'chargeback-management',
  'settlement-reports',
  'payment-reconciliation',
  'refund-management',
  'payment-analytics',
  'compliance-monitoring',
  'risk-assessment',
  'payment-security',
  'merchant-accounts',
  'payment-flows',
  'integration-management',
  'payment-testing',
  'payment-optimization',
  'payment-insights',
  'payment-automation'
];

// Communications submenus
export const communicationsSubmenus = [
  'notifications',
  'email-management',
  'sms-management',
  'push-notifications',
  'in-app-messaging',
  'notification-templates',
  'communication-logs',
  'delivery-reports',
  'engagement-analytics',
  'communication-settings',
  'automation-rules',
  'personalization',
  'multi-channel',
  'communication-api',
  'integration-management',
  'compliance-management',
  'opt-out-management',
  'communication-testing',
  'performance-monitoring',
  'communication-insights'
];

// Security submenus
export const securitySubmenus = [
  'security-monitoring',
  'access-control',
  'user-authentication',
  'role-management',
  'permission-management',
  'security-policies',
  'threat-detection',
  'vulnerability-scanning',
  'security-audits',
  'compliance-monitoring',
  'incident-management',
  'security-logs',
  'intrusion-detection',
  'data-encryption',
  'api-security',
  'network-security',
  'application-security',
  'security-training',
  'security-awareness',
  'security-reporting'
];

// Settings submenus
export const settingsSubmenus = [
  'system-settings',
  'general-settings',
  'user-settings',
  'security-settings',
  'notification-settings',
  'integration-settings',
  'api-management',
  'backup-settings',
  'maintenance-mode',
  'system-monitoring',
  'performance-settings',
  'cache-management',
  'database-settings',
  'file-management',
  'environment-settings',
  'feature-flags',
  'configuration-management',
  'system-logs',
  'health-checks',
  'system-updates'
];
