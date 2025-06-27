
import { 
  dashboardSubmenus,
  userManagementSubmenus, 
  salesManagementSubmenus, 
  orderManagementSubmenus,
  logisticsManagementSubmenus,
  productManagementSubmenus 
} from './routingUtils';

export const getDefaultSubmenu = (menu: string): string => {
  switch (menu) {
    case 'dashboard': return 'overview';
    case 'user-management': return 'admin-users';
    case 'sales-management': return 'sales-overview';
    case 'order-management': return 'order-overview';
    case 'logistics-management': return 'logistics-overview';
    case 'product-management': return 'product-catalog';
    case 'customer-management': return 'customer-database';
    case 'vendor-management': return 'vendor-directory';
    case 'marketing': return 'campaigns';
    case 'analytics': return 'business-intelligence';
    case 'payment-management': return 'payment-processing';
    case 'communications': return 'notifications';
    case 'security': return 'security-monitoring';
    case 'settings': return 'system-settings';
    default: return 'overview';
  }
};

export const handleSpecialCases = (menu: string) => {
  // Handle direct dashboard submenu navigation
  if (dashboardSubmenus.includes(menu)) {
    console.log('🎯 Special case: Dashboard submenu detected:', menu);
    return {
      selectedMenu: 'dashboard',
      selectedSubmenu: menu
    };
  }
  
  return null;
};

export const handleSubmenuRouting = (menu: string) => {
  console.log('🔍 Checking submenu routing for:', menu);
  
  if (userManagementSubmenus.includes(menu)) {
    console.log('✅ Found in user management submenus');
    return {
      selectedMenu: 'user-management',
      selectedSubmenu: menu
    };
  }
  
  if (salesManagementSubmenus.includes(menu)) {
    console.log('✅ Found in sales management submenus');
    return {
      selectedMenu: 'sales-management',
      selectedSubmenu: menu
    };
  }
  
  if (orderManagementSubmenus.includes(menu)) {
    console.log('✅ Found in order management submenus');
    return {
      selectedMenu: 'order-management',
      selectedSubmenu: menu
    };
  }
  
  if (logisticsManagementSubmenus.includes(menu)) {
    console.log('✅ Found in logistics management submenus');
    return {
      selectedMenu: 'logistics-management',
      selectedSubmenu: menu
    };
  }
  
  if (productManagementSubmenus.includes(menu)) {
    console.log('✅ Found in product management submenus');
    return {
      selectedMenu: 'product-management',
      selectedSubmenu: menu
    };
  }
  
  return null;
};

export const handleCompoundMenus = (menu: string) => {
  // Remove the problematic compound menu splitting logic
  // All dashboard submenus should be handled by handleSpecialCases
  return null;
};
