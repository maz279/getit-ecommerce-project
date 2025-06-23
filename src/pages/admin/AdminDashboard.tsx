
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminDashboardHeader } from '@/components/admin/AdminDashboardHeader';
import { ComprehensiveAdminSidebar } from '@/components/admin/ComprehensiveAdminSidebar';
import { ComprehensiveMainContent } from '@/components/admin/ComprehensiveMainContent';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock user profile data
  const userProfile = {
    name: 'Admin User',
    email: 'admin@getit.com',
    role: 'System Administrator',
    avatar: null
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Independent Header */}
        <AdminDashboardHeader userProfile={userProfile} />

        {/* Content Area with top margin for fixed header */}
        <div className="flex pt-[125px]">
          {/* Fixed Sidebar */}
          <ComprehensiveAdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={false}
            setCollapsed={() => {}} // No-op function since we removed collapse
          />

          {/* Main Content - Fixed margin for sidebar */}
          <main className="flex-1 ml-80">
            <ComprehensiveMainContent activeTab={activeTab} />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};
