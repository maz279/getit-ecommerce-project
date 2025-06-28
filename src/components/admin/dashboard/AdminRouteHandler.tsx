
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  communicationsSubmenus,
  securitySubmenus,
  settingsSubmenus
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
      setSelectedMenu('dashboard');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 2: Check user management submenus - FIX HERE
    if (userManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in user management submenus - routing to user management');
      setSelectedMenu('user-management');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 3: Check sales management submenus
    if (salesManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in sales management submenus - routing to sales management');
      setSelectedMenu('sales-management');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 4: Check order management submenus
    if (orderManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in order management submenus - routing to order management');
      setSelectedMenu('order-management');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 5: Check logistics management submenus
    if (logisticsManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in logistics management submenus - routing to logistics management');
      setSelectedMenu('logistics-management');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 6: Check product management submenus
    if (productManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in product management submenus - routing to product management');
      setSelectedMenu('product-management');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 7: Check customer management submenus
    if (customerManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in customer management submenus - routing to customer management');
      setSelectedMenu('customer-management');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 8: Check vendor management submenus
    if (vendorManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in vendor management submenus - routing to vendor management');
      setSelectedMenu('vendor-management');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 9: Check marketing submenus
    if (marketingSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in marketing submenus - routing to marketing');
      setSelectedMenu('marketing');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 10: Check analytics submenus
    if (analyticsSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in analytics submenus - routing to analytics');
      setSelectedMenu('analytics');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 11: Check payment management submenus
    if (paymentManagementSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in payment management submenus - routing to payment management');
      setSelectedMenu('payment-management');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 12: Check communications submenus
    if (communicationsSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in communications submenus - routing to communications');
      setSelectedMenu('communications');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 13: Check security submenus
    if (securitySubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in security submenus - routing to security');
      setSelectedMenu('security');
      setSelectedSubmenu(menuId);
      return;
    }
    
    // PRIORITY 14: Check settings submenus
    if (settingsSubmenus.includes(menuId)) {
      console.log('✅ CRITICAL: Found in settings submenus - routing to settings');
      setSelectedMenu('settings');
      setSelectedSubmenu(menuId);
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
