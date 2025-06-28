
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  dashboardSubmenus,
  userManagementSubmenus,
  salesManagementSubmenus,
  orderManagementSubmenus,
  logisticsManagementSubmenus,
  productManagementSubmenus,
  vendorManagementSubmenus
} from './routingUtils';

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
    
    // PRIORITY 2: Check user management submenus
    if (userManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in user management submenus - routing to user management');
      console.log('🔍 User management submenu:', menuId);
      setSelectedMenu('user-management');
      setSelectedSubmenu(menuId);
      console.log('✅ User management submenu routing handled:', {
        selectedMenu: 'user-management',
        selectedSubmenu: menuId
      });
      return;
    }
    
    // PRIORITY 3: Check sales management submenus
    if (salesManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in sales management submenus - routing to sales management');
      console.log('🔍 Sales management submenu:', menuId);
      setSelectedMenu('sales-management');
      setSelectedSubmenu(menuId);
      console.log('✅ Sales management submenu routing handled:', {
        selectedMenu: 'sales-management',
        selectedSubmenu: menuId
      });
      return;
    }
    
    // PRIORITY 4: Check order management submenus
    if (orderManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in order management submenus - routing to order management');
      console.log('🔍 Order management submenu:', menuId);
      setSelectedMenu('order-management');
      setSelectedSubmenu(menuId);
      console.log('✅ Order management submenu routing handled:', {
        selectedMenu: 'order-management',
        selectedSubmenu: menuId
      });
      return;
    }
    
    // PRIORITY 5: Check logistics management submenus
    if (logisticsManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in logistics management submenus - routing to logistics management');
      console.log('🔍 Logistics management submenu:', menuId);
      setSelectedMenu('logistics-management');
      setSelectedSubmenu(menuId);
      console.log('✅ Logistics management submenu routing handled:', {
        selectedMenu: 'logistics-management',
        selectedSubmenu: menuId
      });
      return;
    }
    
    // PRIORITY 6: Check product management submenus
    if (productManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in product management submenus - routing to product management');
      console.log('🔍 Product management submenu:', menuId);
      setSelectedMenu('product-management');
      setSelectedSubmenu(menuId);
      console.log('✅ Product management submenu routing handled:', {
        selectedMenu: 'product-management',
        selectedSubmenu: menuId
      });
      return;
    }
    
    // PRIORITY 7: Check vendor management submenus
    if (vendorManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in vendor management submenus - routing to vendor management');
      console.log('🔍 Vendor management submenu:', menuId);
      setSelectedMenu('vendor-management');
      setSelectedSubmenu(menuId);
      console.log('✅ Vendor management submenu routing handled:', {
        selectedMenu: 'vendor-management',
        selectedSubmenu: menuId
      });
      return;
    }
    
    // Handle main menu items
    console.log('📝 Setting main menu:', menuId);
    setSelectedMenu(menuId);
    
    // Set default submenu for each main menu
    const getDefaultSubmenu = (menu: string): string => {
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
    
    setSelectedSubmenu(getDefaultSubmenu(menuId));
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
