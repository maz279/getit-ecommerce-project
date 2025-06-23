import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminDashboardHeader } from '@/components/admin/AdminDashboardHeader';
import { ComprehensiveAdminSidebar } from '@/components/admin/ComprehensiveAdminSidebar';
import { ComprehensiveMainContent } from '@/components/admin/ComprehensiveMainContent';
import { AdminDashboardFooter } from '@/components/admin/AdminDashboardFooter';

export const AdminDashboard: React.FC = () => {
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

  // Handle menu changes and set appropriate default submenu
  const handleMenuChange = (menu: string) => {
    setSelectedMenu(menu);
    // Set default submenu based on menu selection
    switch (menu) {
      case 'dashboard':
        setSelectedSubmenu('overview');
        break;
      case 'user-management':
        setSelectedSubmenu('customer-management');
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

  // Handle submenu changes for dashboard items
  const handleSubmenuChange = (submenu: string) => {
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
            setActiveTab={(tab: string) => {
              if (tab.includes('-')) {
                const [menu, submenu] = tab.split('-', 2);
                setSelectedMenu(menu);
                setSelectedSubmenu(submenu);
              } else {
                handleMenuChange(tab);
              }
            }}
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
