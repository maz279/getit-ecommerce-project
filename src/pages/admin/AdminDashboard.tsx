
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminDashboardHeader } from '@/components/admin/AdminDashboardHeader';
import { ComprehensiveAdminSidebar } from '@/components/admin/ComprehensiveAdminSidebar';
import { ComprehensiveMainContent } from '@/components/admin/ComprehensiveMainContent';
import { AdminDashboardFooter } from '@/components/admin/AdminDashboardFooter';

const AdminDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock user profile data
  const userProfile = {
    name: 'Admin User',
    email: 'admin@getit.com',
    role: 'System Administrator',
    avatar: null
  };

  // Enhanced menu change handler with better routing logic
  const handleMenuChange = (menu: string) => {
    console.log('🎯 AdminDashboard handleMenuChange called with:', menu);
    
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
      'sales-reports', 'detailed-reports', 'summary-reports', 'performance-reports', 'comparative-analysis'
    ];
    
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
    
    // Handle compound menu items (menu-submenu format) for other cases
    if (menu.includes('-') && !salesManagementSubmenus.includes(menu) && !userManagementSubmenus.includes(menu)) {
      const parts = menu.split('-');
      console.log('🔍 Split menu parts:', parts);
      
      // Handle other compound menus (but skip user-management and sales ones as they're handled above)
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
    switch (menu) {
      case 'dashboard':
        setSelectedSubmenu('overview');
        break;
      case 'user-management':
        setSelectedSubmenu('admin-users'); // Default to admin users
        break;
      case 'sales':
      case 'sales-management':
        setSelectedSubmenu('sales-overview'); // Default to sales overview
        break;
      case 'vendor-management':
        setSelectedSubmenu('vendor-directory');
        break;
      case 'product-management':
        setSelectedSubmenu('product-catalog');
        break;
      case 'order-management':
        setSelectedSubmenu('order-overview');
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
  };

  // Handle submenu changes
  const handleSubmenuChange = (submenu: string) => {
    console.log('🎯 AdminDashboard handleSubmenuChange called with:', submenu);
    setSelectedSubmenu(submenu);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Independent Header */}
        <AdminDashboardHeader userProfile={userProfile} />

        {/* Content Area with top margin for fixed header */}
        <div className="flex pt-[125px]">
          {/* Collapsible Sidebar */}
          <ComprehensiveAdminSidebar
            activeTab={selectedMenu}
            setActiveTab={handleMenuChange}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />

          {/* Main Content - Dynamic margin based on sidebar state */}
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
            {/* Main Content */}
            <div className="min-h-screen">
              <ComprehensiveMainContent 
                selectedMenu={selectedMenu} 
                selectedSubmenu={selectedSubmenu} 
              />
            </div>
            
            {/* Footer */}
            <AdminDashboardFooter />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminDashboard;
