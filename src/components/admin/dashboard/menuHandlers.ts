
import { 
  userManagementSubmenus, 
  salesManagementSubmenus, 
  orderManagementSubmenus, 
  logisticsManagementSubmenus, 
  productManagementSubmenus 
} from './routingUtils';

export const getDefaultSubmenu = (menu: string): string => {
  switch (menu) {
    case 'dashboard':
      return 'overview';
    case 'user-management':
      return 'admin-users';
    case 'sales':
    case 'sales-management':
      return 'sales-overview';
    case 'order-management':
      return 'order-overview';
    case 'logistics':
      return 'logistics-overview';
    case 'vendor-management':
      return 'vendor-directory';
    case 'product-management':
      return 'product-catalog';
    case 'analytics-reports':
      return 'business-intelligence';
    case 'marketing-promotions':
      return 'campaign-management';
    case 'content-management':
      return 'cms-pages';
    case 'financial-management':
      return 'revenue-dashboard';
    case 'system-administration':
      return 'platform-settings';
    case 'communication':
      return 'customer-support';
    default:
      return 'overview';
  }
};

export const handleSpecialCases = (menu: string): { selectedMenu: string; selectedSubmenu: string } | null => {
  // Handle special case for product-import-export
  if (menu === 'product-import-export') {
    console.log('✅ Special case: product-import-export detected');
    return { selectedMenu: 'product-management', selectedSubmenu: 'import-export' };
  }

  // Handle special case for category-structure
  if (menu === 'category-structure') {
    console.log('✅ Special case: category-structure detected');
    return { selectedMenu: 'product-management', selectedSubmenu: 'category-structure' };
  }

  return null;
};

export const handleSubmenuRouting = (menu: string): { selectedMenu: string; selectedSubmenu: string } | null => {
  // Check if this is a user-management submenu
  if (userManagementSubmenus.includes(menu)) {
    console.log('✅ User management submenu detected:', menu);
    return { selectedMenu: 'user-management', selectedSubmenu: menu };
  }
  
  // Check if this is a sales-management submenu
  if (salesManagementSubmenus.includes(menu)) {
    console.log('✅ Sales management submenu detected:', menu);
    return { selectedMenu: 'sales', selectedSubmenu: menu };
  }
  
  // Check if this is an order-management submenu
  if (orderManagementSubmenus.includes(menu)) {
    console.log('✅ Order management submenu detected:', menu);
    return { selectedMenu: 'order-management', selectedSubmenu: menu };
  }

  // Check if this is a logistics-management submenu
  if (logisticsManagementSubmenus.includes(menu)) {
    console.log('✅ Logistics management submenu detected:', menu);
    return { selectedMenu: 'logistics', selectedSubmenu: menu };
  }

  // Check if this is a product-management submenu
  if (productManagementSubmenus.includes(menu)) {
    console.log('✅ Product management submenu detected:', menu);
    return { selectedMenu: 'product-management', selectedSubmenu: menu };
  }

  return null;
};

export const handleCompoundMenus = (menu: string): { selectedMenu: string; selectedSubmenu: string } | null => {
  // Handle compound menu items (menu-submenu format) for other cases
  if (menu.includes('-') && 
      !salesManagementSubmenus.includes(menu) && 
      !userManagementSubmenus.includes(menu) &&
      !orderManagementSubmenus.includes(menu) &&
      !logisticsManagementSubmenus.includes(menu) &&
      !productManagementSubmenus.includes(menu)) {
    const parts = menu.split('-');
    console.log('🔍 Split menu parts:', parts);
    
    // Handle other compound menus
    if (parts.length >= 2) {
      const [mainMenu, subMenu] = parts;
      console.log(`🎯 Setting mainMenu: ${mainMenu}, subMenu: ${subMenu}`);
      return { selectedMenu: mainMenu, selectedSubmenu: subMenu };
    }
  }

  return null;
};
