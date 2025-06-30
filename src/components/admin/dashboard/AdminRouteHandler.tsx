
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
  handleSpecialCases
} from './menuHandlers';

export const useAdminRouteHandler = () => {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState<string>('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState<string>('overview');

  useEffect(() => {
    // Extract path without leading slash
    const path = location.pathname.slice(1);
    console.log('🔍 AdminRouteHandler - processing path:', path);
    
    // Handle root dashboard path
    if (path === '' || path === 'admin/dashboard' || path === 'dashboard') {
      console.log('🎯 Root dashboard path detected');
      setSelectedMenu('dashboard');
      setSelectedSubmenu('overview');
      return;
    }
    
    // Check for direct main menu matches
    const mainMenus = [
      'dashboard',
      'user-management',
      'sales-management', 
      'order-management',
      'logistics-management',
      'product-management',
      'customer-management',
      'vendor-management',
      'marketing',
      'analytics',
      'payment-management',
      'security',
      'settings'
    ];
    
    if (mainMenus.includes(path)) {
      console.log('🎯 Direct main menu match found:', path);
      setSelectedMenu(path);
      setSelectedSubmenu(getDefaultSubmenu(path));
      return;
    }

    // Check for submenu routing
    const submenuResult = handleSubmenuRouting(path);
    if (submenuResult) {
      console.log('✅ Submenu routing found:', submenuResult);
      setSelectedMenu(submenuResult.selectedMenu);
      setSelectedSubmenu(submenuResult.selectedSubmenu);
      return;
    }

    // Check for special cases
    const specialCaseResult = handleSpecialCases(path);
    if (specialCaseResult) {
      console.log('✅ Special case routing found:', specialCaseResult);
      setSelectedMenu(specialCaseResult.selectedMenu);
      setSelectedSubmenu(specialCaseResult.selectedSubmenu);
      return;
    }

    // Fallback to dashboard
    console.log('⚠️ No matching route found for:', path, '- defaulting to dashboard');
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
