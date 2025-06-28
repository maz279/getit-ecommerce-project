
// Centralized routing utilities for admin dashboard
export const vendorManagementSubmenus = [
  'vendor-directory', 'vendor-analytics', 'all-vendors', 'vendor-onboarding',
  'vendor-verification', 'vendor-performance', 'vendor-support', 'vendor-search',
  'vendor-scorecard', 'active-vendors', 'pending-applications', 'suspended-vendors',
  'nid-verification', 'tin-verification', 'trade-license-verification',
  'bank-account-verification', 'document-review', 'vendor-payments',
  'commission-tracking', 'payout-processing', 'revenue-sharing',
  'performance-reports', 'performance-metrics', 'rating-management'
];

export const getMenuTitle = (menuId: string): string => {
  const titles: Record<string, string> = {
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
    'rating-management': 'Rating Management'
  };
  
  return titles[menuId] || menuId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
