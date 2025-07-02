import React, { useState } from 'react';
import { AdminDashboardHeader } from '../AdminDashboardHeader';
import { AdminDashboardFooter } from '../AdminDashboardFooter';
import { ComprehensiveAdminSidebar } from '../ComprehensiveAdminSidebar';
import { MetricsProvider } from '@/components/analytics/MetricsProvider';
import { MetricsWrapper } from '@/components/common/MetricsWrapper';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <MetricsProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 ${collapsed ? 'w-16' : 'w-64'} bg-white shadow-lg z-30 transition-all duration-300`}>
          <ComprehensiveAdminSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 ${collapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
          {/* Header */}
          <AdminDashboardHeader />
          
          {/* Main Content */}
          <MetricsWrapper pageType="admin_dashboard" trackScrollDepth trackTimeOnPage trackClicks>
            <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </MetricsWrapper>
          
          {/* Footer */}
          <AdminDashboardFooter />
        </div>
      </div>
    </MetricsProvider>
  );
};