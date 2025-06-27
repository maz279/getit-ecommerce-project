
import { useState, useCallback } from 'react';

// Define user-management related submenus
const userManagementSubmenus = [
  'admin-users', 'admin-list', 'role-management', 'permissions', 
  'activity-logs', 'user-analytics', 'registration-trends', 
  'activity-reports', 'demographics'
];

// Define sales-management related submenus
const salesManagementSubmenus = [
  'sales-overview', 'daily-sales', 'monthly-trends', 'yearly-reports', 
  'revenue-analytics', 'revenue-dashboard', 'profit-margins', 'cost-analysis', 'roi-tracking',
  'sales-reports', 'detailed-reports', 'summary-reports', 'comparative-analysis',
  'export-data', 'sales-forecast'
];

// Define order-management related submenus
const orderManagementSubmenus = [
  'order-overview', 'all-orders', 'pending-orders', 'confirmed-orders', 'processing-orders',
  'shipped-orders', 'delivered-orders', 'cancelled-orders', 'returned-orders',
  'order-tracking', 'live-tracking', 'delivery-status', 'shipment-updates',
  'returns-refunds', 'return-requests', 'refund-processing', 'refund-management', 'exchange-requests',
  'order-analytics', 'order-reports', 'performance-reports', 'performance-metrics',
  'fulfillment-center', 'order-search', 'order-timeline',
  'bulk-actions', 'bulk', 'new-orders', 'order-processing',
  'payment-status', 'payment-management', 'payment-gateway', 'transaction-monitoring',
  'payment-analytics', 'payment-disputes', 'payment-methods',
  'failed-payments'
];

// Define logistics-management related submenus
const logisticsManagementSubmenus = [
  'shipping-management', 'warehouse-operations', 'courier-partners', 'shipping-rates',
  'delivery-zones', 'shipping-zones', 'shipping-analytics', 'pick-pack-operations', 'quality-control',
  'logistics-overview', 'delivery-tracking', 'shipping-labels', 'return-logistics', 'delivery-performance'
];

// Define product-management related submenus
const productManagementSubmenus = [
  'product-catalog', 'all-products', 'inventory-management', 'product-analytics', 
  'add-product', 'bulk-upload', 'product-categories', 'stock-levels', 'low-stock-alerts', 
  'reorder-points', 'warehouse-management', 'best-sellers', 'product-performance', 
  'trending-products', 'price-optimization', 'product-search', 'featured-products',
  'import-export', 'product-import', 'product-export', 'bulk-operations', 'product-import-export',
  'category-management', 'category-structure', 'category-hierarchy', 'category-attributes', 
  'category-rules', 'category-analytics', 'category-seo'
];

interface RouteState {
  selectedMenu: string;
  selectedSubmenu: string;
}

interface UseAdminRouteHandlerReturn {
  selectedMenu: string;
  selectedSubmenu: string;
  handleMenuChange: (menu: string) => void;
  handleSubmenuChange: (submenu: string) => void;
}

export const useAdminRouteHandler = (): UseAdminRouteHandlerReturn => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');

  const setDefaultSubmenu = useCallback((menu: string) => {
    switch (menu) {
      case 'dashboard':
        setSelectedSubmenu('overview');
        break;
      case 'user-management':
        setSelectedSubmenu('admin-users');
        break;
      case 'sales':
      case 'sales-management':
        setSelectedSubmenu('sales-overview');
        break;
      case 'order-management':
        setSelectedSubmenu('order-overview');
        break;
      case 'logistics':
        setSelectedSubmenu('logistics-overview');
        break;
      case 'vendor-management':
        setSelectedSubmenu('vendor-directory');
        break;
      case 'product-management':
        setSelectedSubmenu('product-catalog');
        break;
      case 'analytics-reports':
        setSelectedSubmenu('business-intelligence');
        break;
      case 'marketing-promotions':
        setSelectedSubmenu('campaign-management');
        break;
      case 'content-management':
        setSelectedSubmenu('cms-pages');
        break;
      case 'financial-management':
        setSelectedSubmenu('revenue-dashboard');
        break;
      case 'system-administration':
        setSelectedSubmenu('platform-settings');
        break;
      case 'communication':
        setSelectedSubmenu('customer-support');
        break;
      default:
        setSelectedSubmenu('overview');
    }
  }, []);

  const handleMenuChange = useCallback((menu: string) => {
    console.log('🎯 AdminRouteHandler handleMenuChange called with:', menu);
    
    // Handle special case for product-import-export
    if (menu === 'product-import-export') {
      console.log('✅ Special case: product-import-export detected');
      setSelectedMenu('product-management');
      setSelectedSubmenu('import-export');
      return;
    }

    // Handle special case for category-structure
    if (menu === 'category-structure') {
      console.log('✅ Special case: category-structure detected');
      setSelectedMenu('product-management');
      setSelectedSubmenu('category-structure');
      return;
    }
    
    // Check if this is a user-management submenu
    if (userManagementSubmenus.includes(menu)) {
      console.log('✅ User management submenu detected:', menu);
      setSelectedMenu('user-management');
      setSelectedSubmenu(menu);
      return;
    }
    
    // Check if this is a sales-management submenu
    if (salesManagementSubmenus.includes(menu)) {
      console.log('✅ Sales management submenu detected:', menu);
      setSelectedMenu('sales');
      setSelectedSubmenu(menu);
      return;
    }
    
    // Check if this is an order-management submenu
    if (orderManagementSubmenus.includes(menu)) {
      console.log('✅ Order management submenu detected:', menu);
      setSelectedMenu('order-management');
      setSelectedSubmenu(menu);
      return;
    }

    // Check if this is a logistics-management submenu
    if (logisticsManagementSubmenus.includes(menu)) {
      console.log('✅ Logistics management submenu detected:', menu);
      setSelectedMenu('logistics');
      setSelectedSubmenu(menu);
      return;
    }

    // Check if this is a product-management submenu
    if (productManagementSubmenus.includes(menu)) {
      console.log('✅ Product management submenu detected:', menu);
      setSelectedMenu('product-management');
      setSelectedSubmenu(menu);
      return;
    }
    
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
        setSelectedMenu(mainMenu);
        setSelectedSubmenu(subMenu);
        return;
      }
    }

    // Handle simple menu changes
    setSelectedMenu(menu);
    console.log('📝 Menu set to:', menu);
    
    // Set default submenu based on menu selection
    setDefaultSubmenu(menu);
  }, [setDefaultSubmenu]);

  const handleSubmenuChange = useCallback((submenu: string) => {
    console.log('🎯 AdminRouteHandler handleSubmenuChange called with:', submenu);
    setSelectedSubmenu(submenu);
  }, []);

  return {
    selectedMenu,
    selectedSubmenu,
    handleMenuChange,
    handleSubmenuChange
  };
};
