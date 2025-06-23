
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminDashboardHeader } from '@/components/admin/AdminDashboardHeader';
import { SystemStatusBar } from '@/components/admin/header/SystemStatusBar';
import { ComprehensiveAdminSidebar } from '@/components/admin/ComprehensiveAdminSidebar';
import { ComprehensiveMainContent } from '@/components/admin/ComprehensiveMainContent';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('BDT');

  // Mock system status data
  const systemStatus = {
    overall: 'Operational',
    database: 'Connected',
    paymentGateways: 'All Active',
    apiStatus: 'Healthy',
    serverLoad: 'Normal',
    activeUsers: '15,437'
  };

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
        {/* System Status Bar */}
        <SystemStatusBar
          systemStatus={systemStatus}
          language={language}
          setLanguage={setLanguage}
          currency={currency}
          setCurrency={setCurrency}
        />

        {/* Main Header */}
        <AdminDashboardHeader
          userProfile={userProfile}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />

        <div className="flex">
          {/* Sidebar */}
          <ComprehensiveAdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 ${
            collapsed ? 'ml-16' : 'ml-80'
          }`}>
            <ComprehensiveMainContent activeTab={activeTab} />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};
