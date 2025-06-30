import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  dashboardSubmenus,
  userManagementSubmenus, 
  salesManagementSubmenus, 
  orderManagementSubmenus,
  logisticsManagementSubmenus,
  productManagementSubmenus,
  customerManagementSubmenus,
  vendorManagementSubmenus,
  marketingSubmenus,
  analyticsSubmenus,
  paymentManagementSubmenus,
  securitySubmenus,
  settingsSubmenus
} from './routingUtils';
import { logger } from '@/utils/logger';
import { routeAnalytics } from '@/utils/analytics';
import { validateRouteAccess } from '@/utils/security';
import type { RootState } from '@/store/store';

// Enhanced TypeScript interfaces
interface RouteConfig {
  menu: string;
  submenu: string;
  requiresPermission?: string[];
  isPublic?: boolean;
  redirect?: string;
}

interface MenuSubmenuMapping {
  submenus: string[];
  menu: string;
  category: 'core' | 'business' | 'analytics' | 'admin';
  permissions: string[];
}

interface RouteState {
  selectedMenu: string;
  selectedSubmenu: string;
  isLoading: boolean;
  error: string | null;
  hasAccess: boolean;
  breadcrumbs: Array<{ label: string; path: string }>;
}

// Configuration constants
const ROUTE_CONFIG = {
  DEFAULT_MENU: 'dashboard',
  DEFAULT_SUBMENU: 'overview',
  ADMIN_PREFIX: 'admin',
  MAX_RETRIES: 3,
  ROUTE_TIMEOUT: 5000,
} as const;

// Enhanced menu mappings with permissions
const ENHANCED_MENU_MAPPINGS: Record<string, MenuSubmenuMapping> = {
  'dashboard': {
    submenus: dashboardSubmenus,
    menu: 'dashboard',
    category: 'core',
    permissions: ['dashboard.view']
  },
  'user-management': {
    submenus: userManagementSubmenus,
    menu: 'user-management',
    category: 'admin',
    permissions: ['user.manage', 'admin.access']
  },
  'sales-management': {
    submenus: salesManagementSubmenus,
    menu: 'sales-management',
    category: 'business',
    permissions: ['sales.view', 'analytics.access']
  },
  'order-management': {
    submenus: orderManagementSubmenus,
    menu: 'order-management',
    category: 'business',
    permissions: ['order.manage']
  },
  'logistics-management': {
    submenus: logisticsManagementSubmenus,
    menu: 'logistics-management',
    category: 'business',
    permissions: ['logistics.manage', 'shipping.configure']
  },
  'product-management': {
    submenus: productManagementSubmenus,
    menu: 'product-management',
    category: 'business',
    permissions: ['product.manage', 'catalog.edit']
  },
  'customer-management': {
    submenus: customerManagementSubmenus,
    menu: 'customer-management',
    category: 'business',
    permissions: ['customer.manage', 'support.access']
  },
  'vendor-management': {
    submenus: vendorManagementSubmenus,
    menu: 'vendor-management',
    category: 'business',
    permissions: ['vendor.manage', 'kyc.verify']
  },
  'marketing': {
    submenus: marketingSubmenus,
    menu: 'marketing',
    category: 'business',
    permissions: ['marketing.manage', 'campaign.create']
  },
  'analytics': {
    submenus: analyticsSubmenus,
    menu: 'analytics',
    category: 'analytics',
    permissions: ['analytics.view', 'reports.access']
  },
  'payment-management': {
    submenus: paymentManagementSubmenus,
    menu: 'payment-management',
    category: 'business',
    permissions: ['payment.manage', 'financial.view']
  },
  'security': {
    submenus: securitySubmenus,
    menu: 'security',
    category: 'admin',
    permissions: ['security.manage', 'system.admin']
  },
  'settings': {
    submenus: settingsSubmenus,
    menu: 'settings',
    category: 'admin',
    permissions: ['settings.manage', 'system.configure']
  }
};

// Default submenu mappings
const DEFAULT_SUBMENUS: Record<string, string> = {
  'dashboard': 'overview',
  'user-management': 'admin-list',
  'sales-management': 'sales-overview',
  'order-management': 'order-overview',
  'logistics-management': 'courier-partners-logistics',
  'product-management': 'product-catalog',
  'customer-management': 'customer-database',
  'vendor-management': 'vendor-directory',
  'marketing': 'marketing-campaigns',
  'analytics': 'business-intelligence',
  'payment-management': 'revenue-dashboard-payment',
  'security': 'security-monitoring',
  'settings': 'system-settings'
};

/**
 * Enhanced Admin Route Handler Hook for GetIt Platform
 * Handles routing logic with security, permissions, and analytics
 */
export const useAdminRouteHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redux state for user permissions and auth
  const { user, permissions, isAuthenticated } = useSelector((state: RootState) => ({
    user: state.auth.user,
    permissions: state.auth.permissions || [],
    isAuthenticated: state.auth.isAuthenticated
  }));

  // Enhanced state management
  const [routeState, setRouteState] = useState<RouteState>({
    selectedMenu: ROUTE_CONFIG.DEFAULT_MENU,
    selectedSubmenu: ROUTE_CONFIG.DEFAULT_SUBMENU,
    isLoading: true,
    error: null,
    hasAccess: false,
    breadcrumbs: []
  });

  // Memoized route parsing function
  const parseRoutePath = useCallback((pathname: string): RouteConfig => {
    try {
      const path = pathname.slice(1); // Remove leading slash
      logger.debug('AdminRouteHandler - Parsing path:', { path, fullPathname: pathname });
      
      // Handle root dashboard paths
      if (!path || path === 'admin/dashboard' || path === 'dashboard') {
        return {
          menu: ROUTE_CONFIG.DEFAULT_MENU,
          submenu: ROUTE_CONFIG.DEFAULT_SUBMENU,
          isPublic: false
        };
      }

      const pathParts = path.split('/').filter(part => part !== '');
      let menuPart = '';
      let submenuPart = '';
      
      // Enhanced path parsing logic
      if (pathParts[0] === ROUTE_CONFIG.ADMIN_PREFIX && pathParts.length > 1) {
        menuPart = pathParts[1];
        submenuPart = pathParts[2] || '';
      } else {
        menuPart = pathParts[0] || '';
        submenuPart = pathParts[1] || '';
      }
      
      // Validate menu exists in mappings
      const menuMapping = ENHANCED_MENU_MAPPINGS[menuPart];
      if (menuMapping) {
        const submenu = submenuPart || DEFAULT_SUBMENUS[menuPart] || ROUTE_CONFIG.DEFAULT_SUBMENU;
        
        return {
          menu: menuPart,
          submenu,
          requiresPermission: menuMapping.permissions,
          isPublic: false
        };
      }

      // Check if it's a submenu that should route to a specific menu
      const submenuRouting = findMenuBySubmenu(menuPart);
      if (submenuRouting) {
        return {
          menu: submenuRouting.menu,
          submenu: submenuRouting.submenu,
          requiresPermission: ENHANCED_MENU_MAPPINGS[submenuRouting.menu]?.permissions,
          isPublic: false
        };
      }

      // Fallback to dashboard with potential redirect
      logger.warn('AdminRouteHandler - Unknown route, redirecting to dashboard:', { path });
      return {
        menu: ROUTE_CONFIG.DEFAULT_MENU,
        submenu: ROUTE_CONFIG.DEFAULT_SUBMENU,
        redirect: '/admin/dashboard',
        isPublic: false
      };

    } catch (error) {
      logger.error('AdminRouteHandler - Route parsing error:', error);
      return {
        menu: ROUTE_CONFIG.DEFAULT_MENU,
        submenu: ROUTE_CONFIG.DEFAULT_SUBMENU,
        isPublic: false
      };
    }
  }, []);

  // Enhanced submenu finder with caching
  const findMenuBySubmenu = useMemo(() => {
    const submenuToMenuMap = new Map<string, { menu: string; submenu: string }>();
    
    Object.entries(ENHANCED_MENU_MAPPINGS).forEach(([menu, config]) => {
      config.submenus.forEach(submenu => {
        submenuToMenuMap.set(submenu, { menu, submenu });
      });
    });
    
    return (submenu: string): { menu: string; submenu: string } | null => {
      return submenuToMenuMap.get(submenu) || null;
    };
  }, []);

  // Generate breadcrumbs
  const generateBreadcrumbs = useCallback((menu: string, submenu: string) => {
    const breadcrumbs = [
      { label: 'Dashboard', path: '/admin/dashboard' }
    ];
    
    if (menu !== 'dashboard') {
      const menuConfig = ENHANCED_MENU_MAPPINGS[menu];
      if (menuConfig) {
        breadcrumbs.push({
          label: menu.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          path: `/admin/${menu}`
        });
        
        if (submenu && submenu !== DEFAULT_SUBMENUS[menu]) {
          breadcrumbs.push({
            label: submenu.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            path: `/admin/${menu}/${submenu}`
          });
        }
      }
    }
    
    return breadcrumbs;
  }, []);

  // Enhanced permission checking
  const checkRouteAccess = useCallback(async (routeConfig: RouteConfig): Promise<boolean> => {
    try {
      // Public routes don't require permission checks
      if (routeConfig.isPublic) return true;
      
      // Check authentication
      if (!isAuthenticated || !user) {
        logger.warn('AdminRouteHandler - User not authenticated');
        return false;
      }

      // Check route-specific permissions
      if (routeConfig.requiresPermission && routeConfig.requiresPermission.length > 0) {
        const hasRequiredPermissions = await validateRouteAccess(
          routeConfig.requiresPermission,
          permissions
        );
        
        if (!hasRequiredPermissions) {
          logger.warn('AdminRouteHandler - Insufficient permissions:', {
            required: routeConfig.requiresPermission,
            userPermissions: permissions,
            user: user.id
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.error('AdminRouteHandler - Permission check failed:', error);
      return false;
    }
  }, [isAuthenticated, user, permissions]);

  // Main route processing effect
  useEffect(() => {
    const processRoute = async () => {
      try {
        setRouteState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const routeConfig = parseRoutePath(location.pathname);
        const hasAccess = await checkRouteAccess(routeConfig);
        
        // Handle redirects
        if (routeConfig.redirect) {
          navigate(routeConfig.redirect, { replace: true });
          return;
        }

        // Handle access denied
        if (!hasAccess) {
          setRouteState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Access denied. Insufficient permissions.',
            hasAccess: false
          }));
          
          // Redirect to dashboard or login
          const redirectPath = isAuthenticated ? '/admin/dashboard' : '/login';
          navigate(redirectPath, { replace: true });
          return;
        }

        // Generate breadcrumbs
        const breadcrumbs = generateBreadcrumbs(routeConfig.menu, routeConfig.submenu);

        // Update state
        setRouteState({
          selectedMenu: routeConfig.menu,
          selectedSubmenu: routeConfig.submenu,
          isLoading: false,
          error: null,
          hasAccess: true,
          breadcrumbs
        });

        // Analytics tracking
        routeAnalytics.trackPageView({
          path: location.pathname,
          menu: routeConfig.menu,
          submenu: routeConfig.submenu,
          userId: user?.id,
          userRole: user?.role,
          timestamp: new Date().toISOString()
        });

        logger.info('AdminRouteHandler - Route processed successfully:', {
          menu: routeConfig.menu,
          submenu: routeConfig.submenu,
          path: location.pathname
        });

      } catch (error) {
        logger.error('AdminRouteHandler - Route processing failed:', error);
        setRouteState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to process route',
          hasAccess: false
        }));
      }
    };

    processRoute();
  }, [location.pathname, parseRoutePath, checkRouteAccess, generateBreadcrumbs, navigate, isAuthenticated, user]);

  // Enhanced menu change handler
  const handleMenuChange = useCallback(async (menu: string) => {
    try {
      logger.debug('AdminRouteHandler - Menu change requested:', { menu });
      
      // Validate menu exists and user has access
      const menuConfig = ENHANCED_MENU_MAPPINGS[menu];
      if (!menuConfig) {
        logger.error('AdminRouteHandler - Invalid menu:', { menu });
        return;
      }

      const hasAccess = await validateRouteAccess(menuConfig.permissions, permissions);
      if (!hasAccess) {
        logger.warn('AdminRouteHandler - Access denied for menu:', { menu, permissions: menuConfig.permissions });
        return;
      }

      const defaultSubmenu = DEFAULT_SUBMENUS[menu] || ROUTE_CONFIG.DEFAULT_SUBMENU;
      const newPath = `/admin/${menu}`;
      
      // Analytics tracking
      routeAnalytics.trackMenuChange({
        fromMenu: routeState.selectedMenu,
        toMenu: menu,
        userId: user?.id,
        timestamp: new Date().toISOString()
      });

      navigate(newPath);
      
    } catch (error) {
      logger.error('AdminRouteHandler - Menu change failed:', error);
    }
  }, [permissions, routeState.selectedMenu, user?.id, navigate]);

  // Enhanced submenu change handler
  const handleSubmenuChange = useCallback(async (submenu: string) => {
    try {
      logger.debug('AdminRouteHandler - Submenu change requested:', { submenu, currentMenu: routeState.selectedMenu });
      
      // Validate submenu exists in current menu
      const menuConfig = ENHANCED_MENU_MAPPINGS[routeState.selectedMenu];
      if (!menuConfig || !menuConfig.submenus.includes(submenu)) {
        logger.error('AdminRouteHandler - Invalid submenu for menu:', { 
          submenu, 
          menu: routeState.selectedMenu,
          availableSubmenus: menuConfig?.submenus 
        });
        return;
      }

      const newPath = `/admin/${routeState.selectedMenu}/${submenu}`;
      
      // Analytics tracking
      routeAnalytics.trackSubmenuChange({
        menu: routeState.selectedMenu,
        fromSubmenu: routeState.selectedSubmenu,
        toSubmenu: submenu,
        userId: user?.id,
        timestamp: new Date().toISOString()
      });

      navigate(newPath);
      
    } catch (error) {
      logger.error('AdminRouteHandler - Submenu change failed:', error);
    }
  }, [routeState.selectedMenu, routeState.selectedSubmenu, user?.id, navigate]);

  // Utility function to get available menus based on permissions
  const getAvailableMenus = useCallback(() => {
    return Object.entries(ENHANCED_MENU_MAPPINGS)
      .filter(([_, config]) => 
        config.permissions.some(permission => permissions.includes(permission))
      )
      .map(([menu]) => menu);
  }, [permissions]);

  // Utility function to get available submenus for current menu
  const getAvailableSubmenus = useCallback(() => {
    const menuConfig = ENHANCED_MENU_MAPPINGS[routeState.selectedMenu];
    return menuConfig ? menuConfig.submenus : [];
  }, [routeState.selectedMenu]);

  return {
    // Core state
    selectedMenu: routeState.selectedMenu,
    selectedSubmenu: routeState.selectedSubmenu,
    isLoading: routeState.isLoading,
    error: routeState.error,
    hasAccess: routeState.hasAccess,
    breadcrumbs: routeState.breadcrumbs,
    
    // Navigation handlers
    handleMenuChange,
    handleSubmenuChange,
    
    // Utility functions
    getAvailableMenus,
    getAvailableSubmenus,
    
    // Menu configuration access
    getCurrentMenuConfig: () => ENHANCED_MENU_MAPPINGS[routeState.selectedMenu],
    
    // Route validation
    validateRoute: (menu: string, submenu?: string) => {
      const menuConfig = ENHANCED_MENU_MAPPINGS[menu];
      if (!menuConfig) return false;
      if (submenu && !menuConfig.submenus.includes(submenu)) return false;
      return menuConfig.permissions.some(permission => permissions.includes(permission));
    }
  };
};
