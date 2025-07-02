import React, { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { VendorDashboardHeader } from '@/components/vendor/VendorDashboardHeader';
import { VendorSidebar } from '@/components/vendor/VendorSidebar';
import { VendorDashboardFooter } from '@/components/vendor/VendorDashboardFooter';

interface VendorLayoutWrapperProps {
  children: ReactNode;
  selectedMenu: string;
  selectedSubmenu: string;
  sidebarCollapsed: boolean;
  onMenuSelect: (menu: string) => void;
  onSubmenuSelect: (submenu: string) => void;
  onSidebarToggle: () => void;
}

export const VendorLayoutWrapper: React.FC<VendorLayoutWrapperProps> = ({
  children,
  selectedMenu,
  selectedSubmenu,
  sidebarCollapsed,
  onMenuSelect,
  onSubmenuSelect,
  onSidebarToggle
}) => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Header */}
        <VendorDashboardHeader onSidebarToggle={onSidebarToggle} />

        {/* Content Area */}
        <div className="flex pt-[120px]">
          {/* Sidebar */}
          <VendorSidebar
            selectedMenu={selectedMenu}
            selectedSubmenu={selectedSubmenu}
            collapsed={sidebarCollapsed}
            onMenuSelect={onMenuSelect}
            onSubmenuSelect={onSubmenuSelect}
          />

          {/* Main Content */}
          <main className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
            <div className="p-6">
              {children}
            </div>
            <VendorDashboardFooter />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};