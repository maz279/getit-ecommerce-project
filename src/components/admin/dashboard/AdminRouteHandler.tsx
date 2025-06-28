
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { vendorManagementSubmenus } from './routingUtils';

export const useAdminRouteHandler = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuChange = (menuId: string) => {
    console.log('🎯 AdminRouteHandler handleMenuChange called with:', menuId);
    console.log('🔍 Checking submenu routing for:', menuId);
    
    // Check if this is a vendor management submenu using the centralized list
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
