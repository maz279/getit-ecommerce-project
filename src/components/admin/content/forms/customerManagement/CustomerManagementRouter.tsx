import React, { Suspense, memo, useMemo, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Types and Enums
export enum CustomerRoutes {
  ALL_CUSTOMERS = 'all-customers',
  CUSTOMER_DATABASE = 'customer-database',
  CUSTOMER_SEARCH = 'customer-search',
  CUSTOMER_ANALYTICS = 'customer-analytics',
  CUSTOMER_INSIGHTS = 'customer-insights',
  CUSTOMER_SUPPORT = 'customer-support',
  SUPPORT_TICKETS = 'support-tickets',
  LIVE_CHAT = 'live-chat',
  FEEDBACK_REVIEWS = 'feedback-reviews',
  CUSTOMER_FEEDBACK = 'customer-feedback',
  REVIEWS_MANAGEMENT = 'reviews-management',
  CUSTOMER_SEGMENTS = 'customer-segments',
  CUSTOMER_DEMOGRAPHICS = 'customer-demographics',
  VIP_CUSTOMERS = 'vip-customers',
  CUSTOMER_LIFETIME_VALUE = 'customer-lifetime-value',
  CUSTOMER_BEHAVIOR = 'customer-behavior',
  CUSTOMER_ENGAGEMENT = 'customer-engagement',
  PURCHASE_HISTORY = 'purchase-history',
  LOYALTY_ANALYSIS = 'loyalty-analysis',
  CUSTOMER_OVERVIEW = 'customer-overview',
  CUSTOMER_RETENTION = 'customer-retention',
  CUSTOMER_ACQUISITION = 'customer-acquisition',
  CUSTOMER_SATISFACTION = 'customer-satisfaction'
}

export interface CustomerManagementRouterProps {
  selectedSubmenu: string;
  onRouteChange?: (route: string) => void;
  fallbackComponent?: React.ComponentType;
}

interface RouteConfig {
  component: React.LazyExoticComponent<React.ComponentType>;
  routes: string[];
  title: string;
  description: string;
}

// Lazy load components for better performance and code splitting
const AllCustomersContent = React.lazy(() => 
  import('./AllCustomersContent').then(module => ({ default: module.AllCustomersContent }))
);

const CustomerAnalyticsContent = React.lazy(() => 
  import('./CustomerAnalyticsContent').then(module => ({ default: module.CustomerAnalyticsContent }))
);

const CustomerSupportContent = React.lazy(() => 
  import('./CustomerSupportContent').then(module => ({ default: module.CustomerSupportContent }))
);

const LiveChatContent = React.lazy(() => 
  import('./LiveChatContent').then(module => ({ default: module.LiveChatContent }))
);

const CustomerSegmentsContent = React.lazy(() => 
  import('./CustomerSegmentsContent').then(module => ({ default: module.CustomerSegmentsContent }))
);

const VIPCustomersContent = React.lazy(() => 
  import('./VIPCustomersContent').then(module => ({ default: module.VIPCustomersContent }))
);

const CustomerBehaviorContent = React.lazy(() => 
  import('./CustomerBehaviorContent').then(module => ({ default: module.CustomerBehaviorContent }))
);

const CustomerOverviewContent = React.lazy(() => 
  import('./CustomerOverviewContent').then(module => ({ default: module.CustomerOverviewContent }))
);

const CustomerSearchContent = React.lazy(() => 
  import('./CustomerSearchContent').then(module => ({ default: module.CustomerSearchContent }))
);

const PurchaseHistoryContent = React.lazy(() => 
  import('./PurchaseHistoryContent').then(module => ({ default: module.PurchaseHistoryContent }))
);

const LoyaltyAnalysisContent = React.lazy(() => 
  import('./LoyaltyAnalysisContent').then(module => ({ default: module.LoyaltyAnalysisContent }))
);

const CLVContent = React.lazy(() => 
  import('./CLVContent').then(module => ({ default: module.CLVContent }))
);

const FeedbackReviewsContent = React.lazy(() => 
  import('./FeedbackReviewsContent').then(module => ({ default: module.FeedbackReviewsContent }))
);

// Enhanced logging utility for production
class RouterLogger {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  
  static logRoute(route: string, component: string): void {
    if (this.isDevelopment) {
      console.log(`🔍 CustomerManagementRouter - Route: ${route} -> Component: ${component}`);
    }
    
    // In production, send to monitoring service
    if (!this.isDevelopment && window.analytics) {
      window.analytics.track('customer_route_navigation', {
        route,
        component,
        timestamp: new Date().toISOString(),
        platform: 'getit-bangladesh'
      });
    }
  }
  
  static logError(error: Error, route: string): void {
    console.error(`❌ CustomerManagementRouter Error - Route: ${route}`, error);
    
    // Send to error monitoring service in production
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          component: 'CustomerManagementRouter',
          route,
          platform: 'getit-bangladesh'
        }
      });
    }
  }
}

// Route configuration mapping
const ROUTE_CONFIG: Record<string, RouteConfig> = {
  allCustomers: {
    component: AllCustomersContent,
    routes: [CustomerRoutes.ALL_CUSTOMERS, CustomerRoutes.CUSTOMER_DATABASE],
    title: 'All Customers',
    description: 'Complete customer database and management for GetIt Bangladesh'
  },
  customerSearch: {
    component: CustomerSearchContent,
    routes: [CustomerRoutes.CUSTOMER_SEARCH],
    title: 'Customer Search',
    description: 'Advanced customer search with Bengali language support'
  },
  customerAnalytics: {
    component: CustomerAnalyticsContent,
    routes: [CustomerRoutes.CUSTOMER_ANALYTICS, CustomerRoutes.CUSTOMER_INSIGHTS],
    title: 'Customer Analytics',
    description: 'Customer insights and analytics for Bangladesh market'
  },
  customerSupport: {
    component: CustomerSupportContent,
    routes: [CustomerRoutes.CUSTOMER_SUPPORT, CustomerRoutes.SUPPORT_TICKETS],
    title: 'Customer Support',
    description: 'Multi-language customer support management'
  },
  liveChat: {
    component: LiveChatContent,
    routes: [CustomerRoutes.LIVE_CHAT],
    title: 'Live Chat',
    description: 'Real-time customer communication with Bengali support'
  },
  feedbackReviews: {
    component: FeedbackReviewsContent,
    routes: [
      CustomerRoutes.FEEDBACK_REVIEWS,
      CustomerRoutes.CUSTOMER_FEEDBACK,
      CustomerRoutes.REVIEWS_MANAGEMENT
    ],
    title: 'Feedback & Reviews',
    description: 'Customer feedback and review management system'
  },
  customerSegments: {
    component: CustomerSegmentsContent,
    routes: [CustomerRoutes.CUSTOMER_SEGMENTS, CustomerRoutes.CUSTOMER_DEMOGRAPHICS],
    title: 'Customer Segments',
    description: 'Customer segmentation and demographics for Bangladesh market'
  },
  vipCustomers: {
    component: VIPCustomersContent,
    routes: [CustomerRoutes.VIP_CUSTOMERS],
    title: 'VIP Customers',
    description: 'Premium customer management and loyalty program'
  },
  clv: {
    component: CLVContent,
    routes: [CustomerRoutes.CUSTOMER_LIFETIME_VALUE],
    title: 'Customer Lifetime Value',
    description: 'CLV analysis and customer value optimization'
  },
  customerBehavior: {
    component: CustomerBehaviorContent,
    routes: [CustomerRoutes.CUSTOMER_BEHAVIOR, CustomerRoutes.CUSTOMER_ENGAGEMENT],
    title: 'Customer Behavior',
    description: 'Customer behavior analysis and engagement tracking'
  },
  purchaseHistory: {
    component: PurchaseHistoryContent,
    routes: [CustomerRoutes.PURCHASE_HISTORY],
    title: 'Purchase History',
    description: 'Customer purchase history and transaction analysis'
  },
  loyaltyAnalysis: {
    component: LoyaltyAnalysisContent,
    routes: [CustomerRoutes.LOYALTY_ANALYSIS],
    title: 'Loyalty Analysis',
    description: 'Customer loyalty program analysis and insights'
  },
  customerOverview: {
    component: CustomerOverviewContent,
    routes: [
      CustomerRoutes.CUSTOMER_OVERVIEW,
      CustomerRoutes.CUSTOMER_RETENTION,
      CustomerRoutes.CUSTOMER_ACQUISITION,
      CustomerRoutes.CUSTOMER_SATISFACTION
    ],
    title: 'Customer Overview',
    description: 'Comprehensive customer overview and KPI dashboard'
  }
};

// Input validation utility
const validateRouteInput = (selectedSubmenu: string): boolean => {
  if (!selectedSubmenu || typeof selectedSubmenu !== 'string') {
    return false;
  }
  
  // Sanitize input to prevent XSS
  const sanitized = selectedSubmenu.replace(/[<>"/]g, '');
  return sanitized === selectedSubmenu && sanitized.length <= 100;
};

// Error fallback component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-red-600 text-lg font-semibold mb-4">
      Customer Management Error
    </div>
    <div className="text-red-500 text-sm mb-4 max-w-md text-center">
      {error.message || 'An unexpected error occurred while loading the customer management module.'}
    </div>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <div className="text-gray-600 text-sm">Loading customer management...</div>
    </div>
  </div>
);

// Main router component
export const CustomerManagementRouter: React.FC<CustomerManagementRouterProps> = memo(({
  selectedSubmenu,
  onRouteChange,
  fallbackComponent: CustomFallback
}) => {
  // Validate input
  const isValidRoute = useMemo(() => validateRouteInput(selectedSubmenu), [selectedSubmenu]);
  
  // Find matching route configuration
  const routeConfig = useMemo(() => {
    if (!isValidRoute) {
      RouterLogger.logError(new Error(`Invalid route input: ${selectedSubmenu}`), selectedSubmenu);
      return ROUTE_CONFIG.customerOverview;
    }
    
    const normalizedRoute = selectedSubmenu.toLowerCase().trim();
    
    for (const [key, config] of Object.entries(ROUTE_CONFIG)) {
      if (config.routes.includes(normalizedRoute as CustomerRoutes)) {
        RouterLogger.logRoute(normalizedRoute, config.title);
        return config;
      }
    }
    
    // Default fallback
    RouterLogger.logRoute(normalizedRoute, 'CustomerOverview (default)');
    return ROUTE_CONFIG.customerOverview;
  }, [selectedSubmenu, isValidRoute]);
  
  // Handle route changes
  const handleRouteChange = useCallback((route: string) => {
    onRouteChange?.(route);
  }, [onRouteChange]);
  
  // Error handler
  const handleError = useCallback((error: Error, errorInfo: { componentStack: string }) => {
    RouterLogger.logError(error, selectedSubmenu);
  }, [selectedSubmenu]);
  
  // Render the selected component
  const SelectedComponent = routeConfig.component;
  const FallbackComponent = CustomFallback || LoadingFallback;
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => handleRouteChange(CustomerRoutes.CUSTOMER_OVERVIEW)}
    >
      <div 
        className="customer-management-router"
        data-route={selectedSubmenu}
        data-component={routeConfig.title}
        role="main"
        aria-label={`Customer Management - ${routeConfig.title}`}
      >
        <Suspense fallback={<FallbackComponent />}>
          <SelectedComponent />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
});

// Set display name for debugging
CustomerManagementRouter.displayName = 'CustomerManagementRouter';

// Export route configuration for external use
export { ROUTE_CONFIG, CustomerRoutes, RouterLogger };

// Default export
export default CustomerManagementRouter;
