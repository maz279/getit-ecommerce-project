
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboardHeader } from '@/components/admin/AdminDashboardHeader';
import { AdminDashboardFooter } from '@/components/admin/AdminDashboardFooter';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { AdminVendorManagement } from '@/components/admin/AdminVendorManagement';
import { AdminProductManagement } from '@/components/admin/AdminProductManagement';
import { AdminOrderManagement } from '@/components/admin/AdminOrderManagement';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminFinancials } from '@/components/admin/AdminFinancials';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminReports } from '@/components/admin/AdminReports';
import { AdminNotifications } from '@/components/admin/AdminNotifications';

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <AdminStats />
            <AdminCharts />
            <AdminRecentActivity />
          </div>
        );
      case 'vendors':
        return <AdminVendorManagement />;
      case 'products':
        return <AdminProductManagement />;
      case 'orders':
        return <AdminOrderManagement />;
      case 'users':
        return <AdminUserManagement />;
      case 'financials':
        return <AdminFinancials />;
      case 'reports':
        return <AdminReports />;
      case 'settings':
        return <AdminSettings />;
      case 'notifications':
        return <AdminNotifications />;
      default:
        return (
          <div className="space-y-6">
            <AdminStats />
            <AdminCharts />
            <AdminRecentActivity />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <AdminSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <AdminDashboardHeader 
            userProfile={userProfile}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>

          <AdminDashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
