/**
 * GetIt Multi-Vendor Ecommerce Platform - Admin Panel Routing Configuration
 * Production-ready routing configuration for Bangladesh multi-vendor ecommerce platform
 * 
 * @version 2.0.0
 * @author GetIt Development Team
 * @description Comprehensive routing configuration with role-based access control,
 *              localization support, and Bangladesh-specific features
 */

// ========================================================================================
// TYPE DEFINITIONS
// ========================================================================================

export interface RouteItem {
  key: string;
  path: string;
  label: string;
  labelBn?: string; // Bengali translation
  icon?: string;
  description?: string;
  roles?: UserRole[];
  permissions?: Permission[];
  isActive?: boolean;
  order?: number;
  metadata?: RouteMetadata;
}

export interface RouteMetadata {
  category: string;
  tags: string[];
  businessCritical?: boolean;
  bangladeshSpecific?: boolean;
  requiresKYC?: boolean;
  auditRequired?: boolean;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  SUPPORT = 'support',
  AUDITOR = 'auditor'
}

export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  APPROVE = 'approve',
  AUDIT = 'audit',
  FINANCIAL = 'financial'
}

// ========================================================================================
// ROUTE CONSTANTS
// ========================================================================================

export const ROUTE_CATEGORIES = {
  DASHBOARD: 'dashboard',
  SALES: 'sales',
  ORDERS: 'orders',
  LOGISTICS: 'logistics',
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  VENDORS: 'vendors',
  MARKETING: 'marketing',
  ANALYTICS: 'analytics',
  PAYMENTS: 'payments',
  COMMUNICATION: 'communication',
  SECURITY: 'security',
  SETTINGS: 'settings'
} as const;

// ========================================================================================
// DASHBOARD ROUTES
// ========================================================================================

export const dashboardRoutes: RouteItem[] = [
  {
    key: 'overview',
    path: '/admin/dashboard/overview',
    label: 'Overview',
    labelBn: 'সংক্ষিপ্ত বিবরণ',
    icon: 'dashboard',
    description: 'Platform overview and key metrics',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ],
    order: 1,
    metadata: {
      category: ROUTE_CATEGORIES.DASHBOARD,
      tags: ['overview', 'metrics'],
      businessCritical: true
    }
  },
  {
    key: 'analytics',
    path: '/admin/dashboard/analytics',
    label: 'Analytics',
    labelBn: 'বিশ্লেষণ',
    icon: 'chart-line',
    description: 'Real-time platform analytics',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ANALYST],
    permissions: [Permission.READ],
    order: 2,
    metadata: {
      category: ROUTE_CATEGORIES.DASHBOARD,
      tags: ['analytics', 'charts', 'insights']
    }
  },
  {
    key: 'reports',
    path: '/admin/dashboard/reports',
    label: 'Reports',
    labelBn: 'রিপোর্ট',
    icon: 'file-text',
    description: 'Generate and view reports',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ],
    order: 3,
    metadata: {
      category: ROUTE_CATEGORIES.DASHBOARD,
      tags: ['reports', 'export']
    }
  },
  {
    key: 'real-time-metrics',
    path: '/admin/dashboard/real-time-metrics',
    label: 'Real-time Metrics',
    labelBn: 'রিয়েল-টাইম মেট্রিক্স',
    icon: 'activity',
    description: 'Live platform performance metrics',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [Permission.READ],
    order: 4,
    metadata: {
      category: ROUTE_CATEGORIES.DASHBOARD,
      tags: ['real-time', 'live', 'monitoring']
    }
  },
  {
    key: 'kpi-monitoring',
    path: '/admin/dashboard/kpi-monitoring',
    label: 'KPI Monitoring',
    labelBn: 'KPI মনিটরিং',
    icon: 'target',
    description: 'Key Performance Indicators tracking',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ],
    order: 5,
    metadata: {
      category: ROUTE_CATEGORIES.DASHBOARD,
      tags: ['kpi', 'performance', 'tracking']
    }
  },
  {
    key: 'performance-insights',
    path: '/admin/dashboard/performance-insights',
    label: 'Performance Insights',
    labelBn: 'কর্মক্ষমতার অন্তর্দৃষ্টি',
    icon: 'trending-up',
    description: 'Deep performance analysis and insights',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ANALYST],
    permissions: [Permission.READ],
    order: 6,
    metadata: {
      category: ROUTE_CATEGORIES.DASHBOARD,
      tags: ['performance', 'insights', 'analysis']
    }
  },
  {
    key: 'executive-summary',
    path: '/admin/dashboard/executive-summary',
    label: 'Executive Summary',
    labelBn: 'নির্বাহী সারাংশ',
    icon: 'briefcase',
    description: 'High-level executive dashboard',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [Permission.READ],
    order: 7,
    metadata: {
      category: ROUTE_CATEGORIES.DASHBOARD,
      tags: ['executive', 'summary', 'overview'],
      businessCritical: true
    }
  }
];

// ========================================================================================
// SALES ROUTES
// ========================================================================================

export const salesRoutes: RouteItem[] = [
  {
    key: 'sales-overview',
    path: '/admin/sales/overview',
    label: 'Sales Overview',
    labelBn: 'বিক্রয় সংক্ষিপ্ত বিবরণ',
    icon: 'dollar-sign',
    description: 'Comprehensive sales overview',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ, Permission.FINANCIAL],
    order: 1,
    metadata: {
      category: ROUTE_CATEGORIES.SALES,
      tags: ['sales', 'overview', 'revenue'],
      businessCritical: true
    }
  },
  {
    key: 'daily-sales',
    path: '/admin/sales/daily',
    label: 'Daily Sales',
    labelBn: 'দৈনিক বিক্রয়',
    icon: 'calendar-day',
    description: 'Daily sales tracking and analysis',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ, Permission.FINANCIAL],
    order: 2,
    metadata: {
      category: ROUTE_CATEGORIES.SALES,
      tags: ['daily', 'sales', 'tracking']
    }
  },
  {
    key: 'revenue-analytics',
    path: '/admin/sales/revenue-analytics',
    label: 'Revenue Analytics',
    labelBn: 'আয়ের বিশ্লেষণ',
    icon: 'bar-chart',
    description: 'Advanced revenue analysis and forecasting',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ANALYST],
    permissions: [Permission.READ, Permission.FINANCIAL],
    order: 3,
    metadata: {
      category: ROUTE_CATEGORIES.SALES,
      tags: ['revenue', 'analytics', 'forecasting'],
      businessCritical: true
    }
  },
  {
    key: 'sales-forecast',
    path: '/admin/sales/forecast',
    label: 'Sales Forecast',
    labelBn: 'বিক্রয় পূর্বাভাস',
    icon: 'trending-up',
    description: 'Sales forecasting and predictions',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ANALYST],
    permissions: [Permission.READ],
    order: 4,
    metadata: {
      category: ROUTE_CATEGORIES.SALES,
      tags: ['forecast', 'prediction', 'trends']
    }
  },
  {
    key: 'profit-analysis',
    path: '/admin/sales/profit-analysis',
    label: 'Profit Analysis',
    labelBn: 'লাভের বিশ্লেষণ',
    icon: 'pie-chart',
    description: 'Profit margins and cost analysis',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [Permission.READ, Permission.FINANCIAL],
    order: 5,
    metadata: {
      category: ROUTE_CATEGORIES.SALES,
      tags: ['profit', 'margins', 'costs'],
      businessCritical: true
    }
  }
];

// ========================================================================================
// ORDER MANAGEMENT ROUTES
// ========================================================================================

export const orderRoutes: RouteItem[] = [
  {
    key: 'order-overview',
    path: '/admin/orders/overview',
    label: 'Order Overview',
    labelBn: 'অর্ডার সংক্ষিপ্ত বিবরণ',
    icon: 'shopping-cart',
    description: 'Complete order management overview',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ],
    order: 1,
    metadata: {
      category: ROUTE_CATEGORIES.ORDERS,
      tags: ['orders', 'overview'],
      businessCritical: true
    }
  },
  {
    key: 'all-orders',
    path: '/admin/orders/all',
    label: 'All Orders',
    labelBn: 'সব অর্ডার',
    icon: 'list',
    description: 'View all platform orders',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ],
    order: 2,
    metadata: {
      category: ROUTE_CATEGORIES.ORDERS,
      tags: ['orders', 'list', 'all']
    }
  },
  {
    key: 'pending-orders',
    path: '/admin/orders/pending',
    label: 'Pending Orders',
    labelBn: 'মুলতুবি অর্ডার',
    icon: 'clock',
    description: 'Orders awaiting processing',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ, Permission.WRITE],
    order: 3,
    metadata: {
      category: ROUTE_CATEGORIES.ORDERS,
      tags: ['pending', 'processing'],
      businessCritical: true
    }
  },
  {
    key: 'cod-management',
    path: '/admin/orders/cod-management',
    label: 'COD Management',
    labelBn: 'COD ব্যবস্থাপনা',
    icon: 'hand-holding-usd',
    description: 'Cash on Delivery order management',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ, Permission.WRITE],
    order: 4,
    metadata: {
      category: ROUTE_CATEGORIES.ORDERS,
      tags: ['cod', 'cash-on-delivery'],
      bangladeshSpecific: true,
      businessCritical: true
    }
  },
  {
    key: 'order-tracking',
    path: '/admin/orders/tracking',
    label: 'Order Tracking',
    labelBn: 'অর্ডার ট্র্যাকিং',
    icon: 'map-pin',
    description: 'Real-time order tracking system',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPPORT],
    permissions: [Permission.READ],
    order: 5,
    metadata: {
      category: ROUTE_CATEGORIES.ORDERS,
      tags: ['tracking', 'delivery', 'real-time']
    }
  },
  {
    key: 'returns-refunds',
    path: '/admin/orders/returns-refunds',
    label: 'Returns & Refunds',
    labelBn: 'ফেরত ও রিফান্ড',
    icon: 'undo',
    description: 'Handle returns and refund requests',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ, Permission.WRITE, Permission.APPROVE],
    order: 6,
    metadata: {
      category: ROUTE_CATEGORIES.ORDERS,
      tags: ['returns', 'refunds', 'customer-service'],
      businessCritical: true
    }
  }
];

// ========================================================================================
// VENDOR MANAGEMENT ROUTES
// ========================================================================================

export const vendorRoutes: RouteItem[] = [
  {
    key: 'vendor-overview',
    path: '/admin/vendors/overview',
    label: 'Vendor Overview',
    labelBn: 'বিক্রেতা সংক্ষিপ্ত বিবরণ',
    icon: 'store',
    description: 'Complete vendor management overview',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ],
    order: 1,
    metadata: {
      category: ROUTE_CATEGORIES.VENDORS,
      tags: ['vendors', 'overview'],
      businessCritical: true
    }
  },
  {
    key: 'vendor-onboarding',
    path: '/admin/vendors/onboarding',
    label: 'Vendor Onboarding',
    labelBn: 'বিক্রেতা অনবোর্ডিং',
    icon: 'user-plus',
    description: 'New vendor registration and verification',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [Permission.READ, Permission.WRITE, Permission.APPROVE],
    order: 2,
    metadata: {
      category: ROUTE_CATEGORIES.VENDORS,
      tags: ['onboarding', 'registration', 'verification'],
      requiresKYC: true,
      businessCritical: true
    }
  },
  {
    key: 'kyc-verification',
    path: '/admin/vendors/kyc-verification',
    label: 'KYC Verification',
    labelBn: 'KYC যাচাইকরণ',
    icon: 'shield-check',
    description: 'Know Your Customer verification for vendors',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [Permission.READ, Permission.WRITE, Permission.APPROVE],
    order: 3,
    metadata: {
      category: ROUTE_CATEGORIES.VENDORS,
      tags: ['kyc', 'verification', 'compliance'],
      bangladeshSpecific: true,
      requiresKYC: true,
      auditRequired: true,
      businessCritical: true
    }
  },
  {
    key: 'trade-license-verification',
    path: '/admin/vendors/trade-license-verification',
    label: 'Trade License Verification',
    labelBn: 'ট্রেড লাইসেন্স যাচাইকরণ',
    icon: 'file-certificate',
    description: 'Bangladesh trade license verification',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [Permission.READ, Permission.WRITE, Permission.APPROVE],
    order: 4,
    metadata: {
      category: ROUTE_CATEGORIES.VENDORS,
      tags: ['trade-license', 'verification', 'legal'],
      bangladeshSpecific: true,
      requiresKYC: true,
      auditRequired: true
    }
  },
  {
    key: 'vendor-performance',
    path: '/admin/vendors/performance',
    label: 'Vendor Performance',
    labelBn: 'বিক্রেতার কর্মক্ষমতা',
    icon: 'chart-bar',
    description: 'Vendor performance analytics and scoring',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
    permissions: [Permission.READ],
    order: 5,
    metadata: {
      category: ROUTE_CATEGORIES.VENDORS,
      tags: ['performance', 'analytics', 'scoring']
    }
  },
  {
    key: 'commission-management',
    path: '/admin/vendors/commission-management',
    label: 'Commission Management',
    labelBn: 'কমিশন ব্যবস্থাপনা',
    icon: 'percentage',
    description: 'Vendor commission tracking and management',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [Permission.READ, Permission.WRITE, Permission.FINANCIAL],
    order: 6,
    metadata: {
      category: ROUTE_CATEGORIES.VENDORS,
      tags: ['commission', 'payments', 'financial'],
      businessCritical: true,
      auditRequired: true
    }
  },
  {
    key: 'payout-management',
    path: '/admin/vendors/payout-management',
    label: 'Payout Management',
    labelBn: 'পেআউট ব্যবস্থাপনা',
    icon: 'credit-card',
    description: 'Vendor payment processing and management',
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [Permission.READ, Permission.WRITE, Permission.FINANCIAL, Permission.APPROVE],
    order: 7,
    metadata: {
      category: ROUTE_CATEGORIES.VENDORS,
      tags: ['payouts', 'payments', 'financial'],
      businessCritical: true,
      auditRequired: true
    }
  }
];

// ========================================================================================
// UTILITY FUNCTIONS
// ========================================================================================

/**
 * Get routes by category
 */
export const getRoutesByCategory = (category: string): RouteItem[] => {
  const allRoutes = [
    ...dashboardRoutes,
    ...salesRoutes,
    ...orderRoutes,
    ...vendorRoutes
  ];
  
  return allRoutes.filter(route => route.metadata?.category === category);
};

/**
 * Get routes by user role
 */
export const getRoutesByRole = (userRole: UserRole): RouteItem[] => {
  const allRoutes = [
    ...dashboardRoutes,
    ...salesRoutes,
    ...orderRoutes,
    ...vendorRoutes
  ];
  
  return allRoutes.filter(route => 
    route.roles?.includes(userRole) || false
  );
};

/**
 * Check if user has access to route
 */
export const hasRouteAccess = (
  route: RouteItem, 
  userRole: UserRole, 
  userPermissions: Permission[]
): boolean => {
  const hasRole = route.roles?.includes(userRole) || false;
  const hasPermissions = route.permissions?.every(permission => 
    userPermissions.includes(permission)
  ) || true;
  
  return hasRole && hasPermissions && (route.isActive !== false);
};

/**
 * Get Bangladesh-specific routes
 */
export const getBangladeshSpecificRoutes = (): RouteItem[] => {
  const allRoutes = [
    ...dashboardRoutes,
    ...salesRoutes,
    ...orderRoutes,
    ...vendorRoutes
  ];
  
  return allRoutes.filter(route => route.metadata?.bangladeshSpecific === true);
};

/**
 * Get business critical routes
 */
export const getBusinessCriticalRoutes = (): RouteItem[] => {
  const allRoutes = [
    ...dashboardRoutes,
    ...salesRoutes,
    ...orderRoutes,
    ...vendorRoutes
  ];
  
  return allRoutes.filter(route => route.metadata?.businessCritical === true);
};

/**
 * Generate route breadcrumbs
 */
export const generateBreadcrumbs = (currentPath: string): RouteItem[] => {
  const pathSegments = currentPath.split('/').filter(Boolean);
  const breadcrumbs: RouteItem[] = [];
  
  let currentFullPath = '';
  pathSegments.forEach(segment => {
    currentFullPath += `/${segment}`;
    const route = findRouteByPath(currentFullPath);
    if (route) {
      breadcrumbs.push(route);
    }
  });
  
  return breadcrumbs;
};

/**
 * Find route by path
 */
export const findRouteByPath = (path: string): RouteItem | undefined => {
  const allRoutes = [
    ...dashboardRoutes,
    ...salesRoutes,
    ...orderRoutes,
    ...vendorRoutes
  ];
  
  return allRoutes.find(route => route.path === path);
};

/**
 * Validate route configuration
 */
export const validateRouteConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const allRoutes = [
    ...dashboardRoutes,
    ...salesRoutes,
    ...orderRoutes,
    ...vendorRoutes
  ];
  
  // Check for duplicate paths
  const paths = allRoutes.map(route => route.path);
  const duplicatePaths = paths.filter((path, index) => paths.indexOf(path) !== index);
  if (duplicatePaths.length > 0) {
    errors.push(`Duplicate paths found: ${duplicatePaths.join(', ')}`);
  }
  
  // Check for duplicate keys
  const keys = allRoutes.map(route => route.key);
  const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (duplicateKeys.length > 0) {
    errors.push(`Duplicate keys found: ${duplicateKeys.join(', ')}`);
  }
  
  // Validate required fields
  allRoutes.forEach(route => {
    if (!route.key) errors.push(`Route missing key: ${route.path}`);
    if (!route.path) errors.push(`Route missing path: ${route.key}`);
    if (!route.label) errors.push(`Route missing label: ${route.key}`);
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ========================================================================================
// EXPORTS
// ========================================================================================

export default {
  dashboardRoutes,
  salesRoutes,
  orderRoutes,
  vendorRoutes,
  getRoutesByCategory,
  getRoutesByRole,
  hasRouteAccess,
  getBangladeshSpecificRoutes,
  getBusinessCriticalRoutes,
  generateBreadcrumbs,
  findRouteByPath,
  validateRouteConfig,
  ROUTE_CATEGORIES,
  UserRole,
  Permission
};