
import { useState, useCallback } from 'react';
import { 
  dashboardSubmenus,
  userManagementSubmenus,
  salesManagementSubmenus,
  orderManagementSubmenus,
  productManagementSubmenus,
  customerManagementSubmenus,
  vendorManagementSubmenus,
  marketingSubmenus,
  analyticsSubmenus,
  paymentManagementSubmenus,
  logisticsManagementSubmenus,
  securitySubmenus,
  settingsSubmenus
} from './routingUtils';

interface AdminRouteHandlerReturn {
  selectedMenu: string;
  selectedSubmenu: string;
  handleMenuChange: (menu: string) => void;
  handleSubmenuChange: (submenu: string) => void;
}

export const useAdminRouteHandler = (): AdminRouteHandlerReturn => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');

  const handleMenuChange = useCallback((menu: string) => {
    console.log('🔧 AdminRouteHandler - handleMenuChange called with:', menu);
    
    // Clear mapping of submenu to parent menu
    const submenuToParentMap: Record<string, string> = {};
    
    // Build the mapping
    dashboardSubmenus.forEach(sub => submenuToParentMap[sub] = 'dashboard');
    userManagementSubmenus.forEach(sub => submenuToParentMap[sub] = 'user-management');
    salesManagementSubmenus.forEach(sub => submenuToParentMap[sub] = 'sales-management');
    orderManagementSubmenus.forEach(sub => submenuToParentMap[sub] = 'order-management');
    productManagementSubmenus.forEach(sub => submenuToParentMap[sub] = 'product-management');
    customerManagementSubmenus.forEach(sub => submenuToParentMap[sub] = 'customer-management');
    vendorManagementSubmenus.forEach(sub => submenuToParentMap[sub] = 'vendor-management');
    marketingSubmenus.forEach(sub => submenuToParentMap[sub] = 'marketing');
    analyticsSubmenus.forEach(sub => submenuToParentMap[sub] = 'analytics');
    paymentManagementSubmenus.forEach(sub => submenuToParentMap[sub] = 'payment-management');
    logisticsManagementSubmenus.forEach(sub => submenuToParentMap[sub] = 'logistics-management');
    securitySubmenus.forEach(sub => submenuToParentMap[sub] = 'security');
    settingsSubmenus.forEach(sub => submenuToParentMap[sub] = 'settings');

    // Check if the menu is actually a submenu
    if (submenuToParentMap[menu]) {
      const parentMenu = submenuToParentMap[menu];
      console.log('🔧 Detected submenu:', menu, 'belongs to parent:', parentMenu);
      setSelectedMenu(parentMenu);
      setSelectedSubmenu(menu);
      return;
    }

    // Main menu categories
    const mainMenus = [
      'dashboard',
      'user-management', 
      'customer-management',
      'vendor-management',
      'product-management',
      'order-management',
      'sales-management',
      'logistics-management',
      'payment-management',
      'marketing',
      'analytics',
      'communications',
      'security',
      'settings'
    ];

    if (mainMenus.includes(menu)) {
      console.log('🔧 Setting as main menu:', menu);
      setSelectedMenu(menu);
      // Set appropriate default submenu based on main menu
      switch (menu) {
        case 'dashboard':
          setSelectedSubmenu('overview');
          break;
        case 'user-management':
          setSelectedSubmenu('user-overview');
          break;
        case 'customer-management':
          setSelectedSubmenu('customer-overview');
          break;
        case 'vendor-management':
          setSelectedSubmenu('vendor-directory');
          break;
        case 'product-management':
          setSelectedSubmenu('product-catalog');
          break;
        case 'order-management':
          setSelectedSubmenu('order-overview');
          break;
        case 'sales-management':
          setSelectedSubmenu('sales-overview');
          break;
        case 'logistics-management':
          setSelectedSubmenu('courier-partners');
          break;
        case 'payment-management':
          setSelectedSubmenu('revenue-dashboard-payment');
          break;
        case 'marketing':
          setSelectedSubmenu('marketing-campaigns');
          break;
        case 'analytics':
          setSelectedSubmenu('business-intelligence');
          break;
        case 'communications':
          setSelectedSubmenu('notifications');
          break;
        case 'security':
          setSelectedSubmenu('security-monitoring');
          break;
        case 'settings':
          setSelectedSubmenu('system-settings');
          break;
        default:
          setSelectedSubmenu('overview');
      }
    } else {
      console.log('⚠️ Unknown menu:', menu, '- defaulting to dashboard');
      setSelectedMenu('dashboard');
      setSelectedSubmenu('overview');
    }
  }, []);

  const handleSubmenuChange = useCallback((submenu: string) => {
    console.log('🔧 AdminRouteHandler - handleSubmenuChange called with:', submenu);
    setSelectedSubmenu(submenu);
  }, []);

  return {
    selectedMenu,
    selectedSubmenu,
    handleMenuChange,
    handleSubmenuChange
  };
};
