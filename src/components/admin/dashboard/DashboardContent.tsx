
import React, { useState } from 'react';
import { 
  RevenueAnalytics, 
  UserActivity,
  InventoryAlertsSection,
  SecurityMonitoringSection,
  SystemLogsSection,
  RealtimeMetricsSection,
  VendorPerformanceSection,
  OrderInsightsSection,
  PlatformPerformanceSection,
  SystemHealthSection,
  QuickActionsSection,
  ExecutiveSummarySection
} from './sections';

interface DashboardContentProps {
  selectedSubmenu: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ selectedSubmenu }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="text-sm text-gray-500">
            Welcome to your comprehensive admin dashboard
          </div>
        </div>
        
        {/* Simple overview content without tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">12,345</p>
            <p className="text-sm text-gray-500">+5% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">8,976</p>
            <p className="text-sm text-gray-500">+12% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">৳2.4M</p>
            <p className="text-sm text-gray-500">+8% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Vendors</h3>
            <p className="text-3xl font-bold text-orange-600">156</p>
            <p className="text-sm text-gray-500">+3% from last month</p>
          </div>
        </div>
      </div>
    );
  };

  const getContent = () => {
    console.log('DashboardContent - selectedSubmenu:', selectedSubmenu);
    
    switch (selectedSubmenu) {
      case 'overview':
        return renderOverview();
      case 'real-time-metrics':
        return <RealtimeMetricsSection />;
      case 'revenue-analytics':
        return <RevenueAnalytics 
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
        />;
      case 'user-activity':
        return <UserActivity />;
      case 'vendor-performance':
        return <VendorPerformanceSection />;
      case 'order-insights':
        return <OrderInsightsSection />;
      case 'inventory-alerts':
        return <InventoryAlertsSection />;
      case 'platform-performance':
        return <PlatformPerformanceSection />;
      case 'system-health':
        return <SystemHealthSection />;
      case 'security-monitoring':
        return <SecurityMonitoringSection />;
      case 'system-logs':
        return <SystemLogsSection />;
      case 'quick-actions':
        return <QuickActionsSection />;
      case 'executive-summary':
        return <ExecutiveSummarySection />;
      default:
        console.log('DashboardContent - no matching submenu, showing default overview');
        return renderOverview();
    }
  };

  return (
    <div className="p-6">
      {getContent()}
    </div>
  );
};
