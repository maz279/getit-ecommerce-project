
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
    
    // Check if the menu is actually a dashboard submenu
    if (dashboardSubmenus.includes(menu)) {
      console.log('🔧 Detected dashboard submenu, keeping dashboard as main menu');
      setSelectedMenu('dashboard');
      setSelectedSubmenu(menu);
      return;
    }

    // Check other submenu arrays and route correctly
    if (userManagementSubmenus.includes(menu)) {
      setSelectedMenu('user-management');
      setSelectedSubmenu(menu);
      return;
    }

    if (salesManagementSubmenus.includes(menu)) {
      setSelectedMenu('sales-management');
      setSelectedSubmenu(menu);
      return;
    }

    if (orderManagementSubmenus.includes(menu)) {
      setSelectedMenu('order-management');
      setSelectedSubmenu(menu);
      return;
    }

    if (productManagementSubmenus.includes(menu)) {
      setSelectedMenu('product-management');
      setSelectedSubmenu(menu);
      return;
    }

    if (customerManagementSubmenus.includes(menu)) {
      setSelectedMenu('customer-management');
      setSelectedSubmenu(menu);
      return;
    }

    if (vendorManagementSubmenus.includes(menu)) {
      setSelectedMenu('vendor-management');
      setSelectedSubmenu(menu);
      return;
    }

    if (marketingSubmenus.includes(menu)) {
      setSelectedMenu('marketing');
      setSelectedSubmenu(menu);
      return;
    }

    if (analyticsSubmenus.includes(menu)) {
      setSelectedMenu('analytics');
      setSelectedSubmenu(menu);
      return;
    }

    if (paymentManagementSubmenus.includes(menu)) {
      setSelectedMenu('payment-management');
      setSelectedSubmenu(menu);
      return;
    }

    if (logisticsManagementSubmenus.includes(menu)) {
      setSelectedMenu('logistics-management');
      setSelectedSubmenu(menu);
      return;
    }

    if (securitySubmenus.includes(menu)) {
      setSelectedMenu('security');
      setSelectedSubmenu(menu);
      return;
    }

    if (settingsSubmenus.includes(menu)) {
      setSelectedMenu('settings');
      setSelectedSubmenu(menu);
      return;
    }

    // If it's a main menu, set it normally
    console.log('🔧 Setting as main menu:', menu);
    setSelectedMenu(menu);
    setSelectedSubmenu('overview'); // Reset to default submenu
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
