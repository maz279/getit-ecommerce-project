
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminDashboardHeader } from '@/components/admin/AdminDashboardHeader';
import { ComprehensiveAdminSidebar } from '@/components/admin/ComprehensiveAdminSidebar';
import { ComprehensiveMainContent } from '@/components/admin/ComprehensiveMainContent';
import { AdminDashboardFooter } from '@/components/admin/AdminDashboardFooter';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          {/* Collapsible Sidebar */}
          <ComprehensiveAdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />

          {/* Main Content - Dynamic margin based on sidebar state */}
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
            {/* Extended Main Content - 3x longer */}
            <div className="min-h-[300vh]">
              <ComprehensiveMainContent activeTab={activeTab} />
              
              {/* Additional content to make page 3x longer */}
              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Extended Section {i + 1}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        This section provides additional content to extend the dashboard page length for better demonstration of scrolling behavior and footer placement.
                      </p>
                      <div className="space-y-2">
                        {Array.from({ length: 4 }, (_, j) => (
                          <div key={j} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm text-gray-600">Metric {j + 1}</span>
                            <span className="text-sm font-medium text-blue-600">{Math.floor(Math.random() * 1000)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <AdminDashboardFooter />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};
