
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsTab, PerformanceTab, InsightsTab, ReportsTab } from './overview';
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
    // Only show tabs if we're specifically in the 'overview' submenu
    if (selectedSubmenu === 'overview') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="text-sm text-gray-500">
              Welcome to your comprehensive admin dashboard
            </div>
          </div>
          
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="mt-6">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <PerformanceTab />
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <InsightsTab />
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <ReportsTab />
            </TabsContent>
          </Tabs>
        </div>
      );
    }
    
    // For other dashboard submenus, return appropriate content without tabs
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Select a menu item from the sidebar to view content
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
