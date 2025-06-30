
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { 
  getDefaultSubmenu, 
  handleSubmenuRouting, 
  handleSpecialCases, 
  handleCompoundMenus 
} from './menuHandlers';

export const useAdminRouteHandler = () => {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState<string>('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState<string>('overview');

  useEffect(() => {
    // Extract path without leading slash
    const path = location.pathname.slice(1);
    
    // Check for direct matches in main menus
    if (
      path === 'dashboard' ||
      path === 'user-management' ||
      path === 'sales-management' ||
      path === 'order-management' ||
      path === 'logistics-management' ||
      path === 'product-management' ||
      path === 'customer-management' ||
      path === 'vendor-management' ||
      path === 'marketing' ||
      path === 'analytics' ||
      path === 'payment-management' ||
      path === 'security' ||
      path === 'settings'
    ) {
      console.log('🎯 Direct menu match found:', path);
      setSelectedMenu(path);
      setSelectedSubmenu(getDefaultSubmenu(path));
      return;
    }

    // Check for special cases (direct submenu navigation)
    const specialCaseResult = handleSpecialCases(path);
    if (specialCaseResult) {
      console.log('🎯 Special case routing triggered for:', path);
      setSelectedMenu(specialCaseResult.selectedMenu);
      setSelectedSubmenu(specialCaseResult.selectedSubmenu);
      return;
    }
    
    // Check for standard submenu routing
    const submenuRoutingResult = handleSubmenuRouting(path);
    if (submenuRoutingResult) {
      console.log('✅ Standard submenu routing triggered for:', path);
      setSelectedMenu(submenuRoutingResult.selectedMenu);
      setSelectedSubmenu(submenuRoutingResult.selectedSubmenu);
      return;
    }

    // Fallback: Default to dashboard overview
    console.log('⚠️ No matching route found - defaulting to dashboard overview');
    setSelectedMenu('dashboard');
    setSelectedSubmenu('overview');
  }, [location.pathname]);

  const handleMenuChange = (menu: string) => {
    console.log('Menu changed to:', menu);
    setSelectedMenu(menu);
    setSelectedSubmenu(getDefaultSubmenu(menu));
  };

  const handleSubmenuChange = (submenu: string) => {
    console.log('Submenu changed to:', submenu);
    setSelectedSubmenu(submenu);
  };

  return {
    selectedMenu,
    selectedSubmenu,
    handleMenuChange,
    handleSubmenuChange
  };
};
