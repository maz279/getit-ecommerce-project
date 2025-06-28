
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { vendorManagementSubmenus, dashboardSubmenus } from './routingUtils';

export const useAdminRouteHandler = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuChange = (menuId: string) => {
    console.log('🎯 AdminRouteHandler handleMenuChange called with:', menuId);
    console.log('🔍 Checking submenu routing for:', menuId);
    
    // PRIORITY 1: Check dashboard submenus first
    if (dashboardSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in dashboard submenus - routing to dashboard');
      console.log('🔍 Dashboard submenu:', menuId);
      setSelectedMenu('dashboard');
      setSelectedSubmenu(menuId);
      console.log('✅ Dashboard submenu routing handled:', {
        selectedMenu: 'dashboard',
        selectedSubmenu: menuId
      });
      return;
    }
    
    // PRIORITY 2: Check if this is a vendor management submenu
    if (vendorManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in vendor management submenus - routing to vendor management');
      console.log('🔍 Vendor management submenu:', menuId);
      setSelectedMenu('vendor-management');
      setSelectedSubmenu(menuId);
      console.log('✅ Submenu routing handled:', {
        selectedMenu: 'vendor-management',
        selectedSubmenu: menuId
      });
      return;
    }
    
    // Handle other main menu items
    console.log('📝 Setting simple menu:', menuId);
    setSelectedMenu(menuId);
    setSelectedSubmenu('overview');
  };

  const handleSubmenuChange = (submenuId: string) => {
    console.log('🔍 AdminRouteHandler handleSubmenuChange called with:', submenuId);
    setSelectedSubmenu(submenuId);
  };

  // Update URL when menu changes
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath !== '/admin/dashboard') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [selectedMenu, selectedSubmenu, location.pathname, navigate]);

  return {
    selectedMenu,
    selectedSubmenu,
    handleMenuChange,
    handleSubmenuChange
  };
};
