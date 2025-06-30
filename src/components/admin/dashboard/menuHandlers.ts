/**
 * GetIt Multi-Vendor Ecommerce Platform
 * Menu Navigation Handlers for Admin Dashboard
 * 
 * @fileoverview Production-ready menu routing and navigation handlers
 * for the GetIt admin dashboard. Optimized for performance and maintainability.
 * 
 * @author GetIt Development Team
 * @version 2.0.0
 * @since 2025-06-30
 */

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

/* ================================
 * TYPE DEFINITIONS
 * ================================ */

/**
 * Valid main menu keys in the GetIt admin dashboard
 */
export type MainMenuKey = 
  | 'dashboard'
  | 'user-management'
  | 'sales-management'
  | 'order-management'
  | 'logistics-management'
  | 'product-management'
  | 'customer-management'
  | 'vendor-management'
  | 'marketing'
  | 'analytics'
  | 'payment-management'
  | 'security'
  | 'settings';

/**
 * Menu routing result interface
 */
export interface MenuRoutingResult {
  /** The main menu category */
  selectedMenu: MainMenuKey;
  /** The specific submenu within the category */
  selectedSubmenu: string;
  /** Whether the routing was successful */
  success: boolean;
  /** Error message if routing failed */
  error?: string;
}

/**
 * Menu configuration interface for type safety
 */
interface MenuConfig {
  defaultSubmenu: string;
  submenus: readonly string[];
}

/* ================================
 * CONSTANTS & CONFIGURATION
 * ================================ */

/**
 * Default submenu mapping for each main menu category
 * Optimized for O(1) lookup performance
 */
const DEFAULT_SUBMENUS: ReadonlyMap<MainMenuKey, string> = new Map([
  ['dashboard', 'overview'],
  ['user-management', 'admin-list'],
  ['sales-management', 'sales-overview'],
  ['order-management', 'order-overview'],
  ['logistics-management', 'courier-partners-logistics'],
  ['product-management', 'product-catalog'],
  ['customer-management', 'customer-database'],
  ['vendor-management', 'vendor-directory'],
  ['marketing', 'marketing-campaigns'],
  ['analytics', 'business-intelligence'],
  ['payment-management', 'revenue-dashboard-payment'],
  ['security', 'security-monitoring'],
  ['settings', 'system-settings']
] as const);

/**
 * Menu configuration mapping for efficient submenu lookups
 * Performance: O(1) lookup instead of O(n) array iterations
 */
const MENU_CONFIGURATIONS: ReadonlyMap<MainMenuKey, MenuConfig> = new Map([
  ['dashboard', { 
    defaultSubmenu: 'overview', 
    submenus: dashboardSubmenus 
  }],
  ['user-management', { 
    defaultSubmenu: 'admin-list', 
    submenus: userManagementSubmenus 
  }],
  ['sales-management', { 
    defaultSubmenu: 'sales-overview', 
    submenus: salesManagementSubmenus 
  }],
  ['order-management', { 
    defaultSubmenu: 'order-overview', 
    submenus: orderManagementSubmenus 
  }],
  ['logistics-management', { 
    defaultSubmenu: 'courier-partners-logistics', 
    submenus: logisticsManagementSubmenus 
  }],
  ['product-management', { 
    defaultSubmenu: 'product-catalog', 
    submenus: productManagementSubmenus 
  }],
  ['customer-management', { 
    defaultSubmenu: 'customer-database', 
    submenus: customerManagementSubmenus 
  }],
  ['vendor-management', { 
    defaultSubmenu: 'vendor-directory', 
    submenus: vendorManagementSubmenus 
  }],
  ['marketing', { 
    defaultSubmenu: 'marketing-campaigns', 
    submenus: marketingSubmenus 
  }],
  ['analytics', { 
    defaultSubmenu: 'business-intelligence', 
    submenus: analyticsSubmenus 
  }],
  ['payment-management', { 
    defaultSubmenu: 'revenue-dashboard-payment', 
    submenus: paymentManagementSubmenus 
  }],
  ['security', { 
    defaultSubmenu: 'security-monitoring', 
    submenus: securitySubmenus 
  }],
  ['settings', { 
    defaultSubmenu: 'system-settings', 
    submenus: settingsSubmenus 
  }]
] as const);

/* ================================
 * UTILITY FUNCTIONS
 * ================================ */

/**
 * Validates if a string is a valid main menu key
 * 
 * @param menu - The menu string to validate
 * @returns True if valid main menu key
 */
const isValidMainMenu = (menu: string): menu is MainMenuKey => {
  return DEFAULT_SUBMENUS.has(menu as MainMenuKey);
};

/**
 * Sanitizes and validates menu input
 * 
 * @param menu - Raw menu input
 * @returns Sanitized menu string or null if invalid
 */
const sanitizeMenuInput = (menu: string): string | null => {
  if (!menu || typeof menu !== 'string') {
    return null;
  }
  
  const sanitized = menu.trim().toLowerCase();
  return sanitized.length > 0 ? sanitized : null;
};

/**
 * Creates a submenu-to-parent menu lookup map for O(1) performance
 * This is computed once and reused for all routing operations
 */
const createSubmenuLookupMap = (): ReadonlyMap<string, MainMenuKey> => {
  const lookupMap = new Map<string, MainMenuKey>();
  
  MENU_CONFIGURATIONS.forEach((config, menuKey) => {
    config.submenus.forEach(submenu => {
      lookupMap.set(submenu, menuKey);
    });
  });
  
  return lookupMap;
};

// Pre-computed lookup map for optimal performance
const SUBMENU_TO_MENU_MAP = createSubmenuLookupMap();

/* ================================
 * CORE FUNCTIONS
 * ================================ */

/**
 * Gets the default submenu for a given main menu
 * 
 * @param menu - The main menu key
 * @returns The default submenu name, or 'overview' as fallback
 * 
 * @example
 * ```typescript
 * const defaultSub = getDefaultSubmenu('dashboard'); // Returns 'overview'
 * const fallback = getDefaultSubmenu('invalid'); // Returns 'overview'
 * ```
 */
export const getDefaultSubmenu = (menu: string): string => {
  const sanitizedMenu = sanitizeMenuInput(menu);
  
  if (!sanitizedMenu || !isValidMainMenu(sanitizedMenu)) {
    console.warn(`⚠️ Invalid menu provided: "${menu}". Using fallback default.`);
    return 'overview';
  }
  
  const defaultSubmenu = DEFAULT_SUBMENUS.get(sanitizedMenu);
  return defaultSubmenu || 'overview';
};

/**
 * Handles submenu routing with comprehensive error handling and validation
 * 
 * @param submenuRoute - The submenu route to resolve
 * @returns MenuRoutingResult with routing information and success status
 * 
 * @example
 * ```typescript
 * const result = handleSubmenuRouting('admin-list');
 * if (result.success) {
 *   console.log(`Route: ${result.selectedMenu}/${result.selectedSubmenu}`);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export const handleSubmenuRouting = (submenuRoute: string): MenuRoutingResult => {
  const startTime = performance.now();
  
  try {
    // Input validation and sanitization
    const sanitizedRoute = sanitizeMenuInput(submenuRoute);
    
    if (!sanitizedRoute) {
      return {
        selectedMenu: 'dashboard',
        selectedSubmenu: 'overview',
        success: false,
        error: 'Invalid or empty submenu route provided'
      };
    }
    
    console.log(`🔍 Resolving submenu route: "${sanitizedRoute}"`);
    
    // Fast O(1) lookup using pre-computed map
    const parentMenu = SUBMENU_TO_MENU_MAP.get(sanitizedRoute);
    
    if (parentMenu) {
      const endTime = performance.now();
      console.log(`✅ Route resolved successfully in ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`📍 Menu: ${parentMenu} → Submenu: ${sanitizedRoute}`);
      
      return {
        selectedMenu: parentMenu,
        selectedSubmenu: sanitizedRoute,
        success: true
      };
    }
    
    // Handle case where submenu doesn't exist
    console.warn(`⚠️ Submenu "${sanitizedRoute}" not found in any menu category`);
    
    return {
      selectedMenu: 'dashboard',
      selectedSubmenu: 'overview',
      success: false,
      error: `Submenu "${sanitizedRoute}" not found. Redirected to dashboard overview.`
    };
    
  } catch (error) {
    console.error('🚨 Error in handleSubmenuRouting:', error);
    
    return {
      selectedMenu: 'dashboard',
      selectedSubmenu: 'overview',
      success: false,
      error: `Routing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Validates if a submenu exists within a specific main menu
 * 
 * @param mainMenu - The main menu to check
 * @param submenu - The submenu to validate
 * @returns True if the submenu exists in the specified main menu
 * 
 * @example
 * ```typescript
 * const isValid = validateSubmenuInMenu('dashboard', 'overview'); // true
 * const isInvalid = validateSubmenuInMenu('dashboard', 'invalid-sub'); // false
 * ```
 */
export const validateSubmenuInMenu = (mainMenu: string, submenu: string): boolean => {
  const sanitizedMenu = sanitizeMenuInput(mainMenu);
  const sanitizedSubmenu = sanitizeMenuInput(submenu);
  
  if (!sanitizedMenu || !sanitizedSubmenu || !isValidMainMenu(sanitizedMenu)) {
    return false;
  }
  
  const menuConfig = MENU_CONFIGURATIONS.get(sanitizedMenu);
  return menuConfig ? menuConfig.submenus.includes(sanitizedSubmenu) : false;
};

/**
 * Gets all available submenus for a given main menu
 * 
 * @param mainMenu - The main menu key
 * @returns Array of available submenus, or empty array if menu doesn't exist
 * 
 * @example
 * ```typescript
 * const submenus = getAvailableSubmenus('dashboard');
 * console.log(submenus); // ['overview', 'analytics-dashboard', ...]
 * ```
 */
export const getAvailableSubmenus = (mainMenu: string): readonly string[] => {
  const sanitizedMenu = sanitizeMenuInput(mainMenu);
  
  if (!sanitizedMenu || !isValidMainMenu(sanitizedMenu)) {
    console.warn(`⚠️ Invalid main menu: "${mainMenu}"`);
    return [];
  }
  
  const menuConfig = MENU_CONFIGURATIONS.get(sanitizedMenu);
  return menuConfig?.submenus || [];
};

/**
 * Creates a safe menu navigation URL
 * 
 * @param mainMenu - The main menu
 * @param submenu - The submenu (optional)
 * @returns Safe navigation URL
 * 
 * @example
 * ```typescript
 * const url = createMenuUrl('dashboard', 'overview'); // '/admin/dashboard/overview'
 * const urlWithDefault = createMenuUrl('dashboard'); // '/admin/dashboard/overview'
 * ```
 */
export const createMenuUrl = (mainMenu: string, submenu?: string): string => {
  const sanitizedMenu = sanitizeMenuInput(mainMenu);
  
  if (!sanitizedMenu || !isValidMainMenu(sanitizedMenu)) {
    console.warn(`⚠️ Invalid main menu for URL creation: "${mainMenu}"`);
    return '/admin/dashboard/overview';
  }
  
  const targetSubmenu = submenu ? 
    (validateSubmenuInMenu(sanitizedMenu, submenu) ? submenu : getDefaultSubmenu(sanitizedMenu)) :
    getDefaultSubmenu(sanitizedMenu);
  
  return `/admin/${sanitizedMenu}/${targetSubmenu}`;
};

/**
 * Gets comprehensive menu information for debugging and analytics
 * 
 * @returns Object containing all menu configuration data
 */
export const getMenuDebugInfo = () => {
  return {
    totalMenus: MENU_CONFIGURATIONS.size,
    totalSubmenus: SUBMENU_TO_MENU_MAP.size,
    menuConfigurations: Object.fromEntries(MENU_CONFIGURATIONS),
    submenuMapping: Object.fromEntries(SUBMENU_TO_MENU_MAP),
    performanceMap: SUBMENU_TO_MENU_MAP.size > 0 ? 'Optimized O(1) lookups' : 'Not initialized'
  };
};

/* ================================
 * LEGACY COMPATIBILITY (DEPRECATED)
 * ================================ */

/**
 * @deprecated Use handleSubmenuRouting instead
 * Legacy function maintained for backward compatibility
 * Will be removed in version 3.0.0
 */
export const handleSpecialCases = (menu: string): MenuRoutingResult | null => {
  console.warn('⚠️ DEPRECATED: handleSpecialCases() is deprecated. Use handleSubmenuRouting() instead.');
  
  const result = handleSubmenuRouting(menu);
  return result.success ? result : null;
};

/**
 * @deprecated No longer needed - functionality integrated into handleSubmenuRouting
 * Legacy function maintained for backward compatibility
 * Will be removed in version 3.0.0
 */
export const handleCompoundMenus = (_menu: string): null => {
  console.warn('⚠️ DEPRECATED: handleCompoundMenus() is deprecated and no longer needed.');
  return null;
};

/* ================================
 * DEFAULT EXPORT
 * ================================ */

/**
 * Default export containing all menu handling functionality
 */
export default {
  getDefaultSubmenu,
  handleSubmenuRouting,
  validateSubmenuInMenu,
  getAvailableSubmenus,
  createMenuUrl,
  getMenuDebugInfo,
  // Legacy functions (deprecated)
  handleSpecialCases,
  handleCompoundMenus
} as const;