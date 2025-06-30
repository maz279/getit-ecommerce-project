
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

export const useAdminRouteHandler = () => {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState<string>('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState<string>('overview');

  useEffect(() => {
    const path = location.pathname.slice(1); // Remove leading slash
    console.log('🔍 AdminRouteHandler - Current path:', path);
    console.log('🔍 Full pathname:', location.pathname);
    
    // Handle root dashboard paths
    if (path === '' || path === 'admin/dashboard' || path === 'dashboard') {
      console.log('🎯 Root dashboard detected');
      setSelectedMenu('dashboard');
      setSelectedSubmenu('overview');
      return;
    }

    // Parse the path to extract menu and submenu
    const pathParts = path.split('/').filter(part => part !== '');
    console.log('🔍 Path parts:', pathParts);
    
    // For admin dashboard routes, we expect: admin/dashboard or just dashboard
    // For specific admin routes, we might have: admin/user-management, admin/sales-management, etc.
    
    let menuPart = '';
    let submenuPart = '';
    
    if (pathParts[0] === 'admin' && pathParts.length > 1) {
      menuPart = pathParts[1];
      submenuPart = pathParts[2] || '';
    } else {
      menuPart = pathParts[0] || '';
      submenuPart = pathParts[1] || '';
    }
    
    console.log('🔍 Menu part:', menuPart, 'Submenu part:', submenuPart);
    
    // Map menu parts to actual menu names
    const menuMapping: { [key: string]: string } = {
      'dashboard': 'dashboard',
      'user-management': 'user-management',
      'sales-management': 'sales-management',
      'order-management': 'order-management',
      'logistics-management': 'logistics-management',
      'product-management': 'product-management',
      'customer-management': 'customer-management',
      'vendor-management': 'vendor-management',
      'marketing': 'marketing',
      'analytics': 'analytics',
      'payment-management': 'payment-management',
      'security': 'security',
      'settings': 'settings'
    };
    
    const mappedMenu = menuMapping[menuPart];
    
    if (mappedMenu) {
      console.log('✅ Mapped menu found:', mappedMenu);
      setSelectedMenu(mappedMenu);
      
      // Set appropriate submenu based on the menu
      if (submenuPart) {
        console.log('✅ Using submenu from URL:', submenuPart);
        setSelectedSubmenu(submenuPart);
      } else {
        // Set default submenu for each menu
        const defaultSubmenu = getDefaultSubmenu(mappedMenu);
        console.log('✅ Using default submenu:', defaultSubmenu);
        setSelectedSubmenu(defaultSubmenu);
      }
    } else {
      // Check if it's a submenu that should route to a specific menu
      const submenuRouting = findMenuBySubmenu(menuPart);
      if (submenuRouting) {
        console.log('✅ Found submenu routing:', submenuRouting);
        setSelectedMenu(submenuRouting.menu);
        setSelectedSubmenu(submenuRouting.submenu);
      } else {
        console.log('⚠️ No matching route found, defaulting to dashboard');
        setSelectedMenu('dashboard');
        setSelectedSubmenu('overview');
      }
    }
  }, [location.pathname]);

  const getDefaultSubmenu = (menu: string): string => {
    switch (menu) {
      case 'dashboard': return 'overview';
      case 'user-management': return 'admin-list';
      case 'sales-management': return 'sales-overview';
      case 'order-management': return 'order-overview';
      case 'logistics-management': return 'courier-partners-logistics';
      case 'product-management': return 'product-catalog';
      case 'customer-management': return 'customer-database';
      case 'vendor-management': return 'vendor-directory';
      case 'marketing': return 'marketing-campaigns';
      case 'analytics': return 'business-intelligence';
      case 'payment-management': return 'revenue-dashboard-payment';
      case 'security': return 'security-monitoring';
      case 'settings': return 'system-settings';
      default: return 'overview';
    }
  };

  const findMenuBySubmenu = (submenu: string): { menu: string; submenu: string } | null => {
    const submenuMappings = [
      { submenus: dashboardSubmenus, menu: 'dashboard' },
      { submenus: userManagementSubmenus, menu: 'user-management' },
      { submenus: salesManagementSubmenus, menu: 'sales-management' },
      { submenus: orderManagementSubmenus, menu: 'order-management' },
      { submenus: logisticsManagementSubmenus, menu: 'logistics-management' },
      { submenus: productManagementSubmenus, menu: 'product-management' },
      { submenus: customerManagementSubmenus, menu: 'customer-management' },
      { submenus: vendorManagementSubmenus, menu: 'vendor-management' },
      { submenus: marketingSubmenus, menu: 'marketing' },
      { submenus: analyticsSubmenus, menu: 'analytics' },
      { submenus: paymentManagementSubmenus, menu: 'payment-management' },
      { submenus: securitySubmenus, menu: 'security' },
      { submenus: settingsSubmenus, menu: 'settings' }
    ];

    for (const mapping of submenuMappings) {
      if (mapping.submenus.includes(submenu)) {
        return { menu: mapping.menu, submenu };
      }
    }

    return null;
  };

  const handleMenuChange = (menu: string) => {
    console.log('📍 Menu changed to:', menu);
    setSelectedMenu(menu);
    setSelectedSubmenu(getDefaultSubmenu(menu));
  };

  const handleSubmenuChange = (submenu: string) => {
    console.log('📍 Submenu changed to:', submenu);
    setSelectedSubmenu(submenu);
  };

  return {
    selectedMenu,
    selectedSubmenu,
    handleMenuChange,
    handleSubmenuChange
  };
};
