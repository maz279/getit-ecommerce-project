
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
import { OverviewDashboard } from './sections/OverviewDashboard';
import { AnalyticsDashboard } from './sections/AnalyticsDashboard';
import { KPIMonitoringDashboard } from './sections/KPIMonitoringDashboard';
import { PerformanceInsightsDashboard } from './sections/PerformanceInsightsDashboard';

interface DashboardContentProps {
  selectedSubmenu: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ selectedSubmenu }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const getContent = () => {
    console.log('DashboardContent - selectedSubmenu:', selectedSubmenu);
    
    switch (selectedSubmenu) {
      case 'overview':
        return <OverviewDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'real-time-metrics':
        return <RealtimeMetricsSection />;
      case 'kpi-monitoring':
        return <KPIMonitoringDashboard />;
      case 'performance-insights':
        return <PerformanceInsightsDashboard />;
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
        return <OverviewDashboard />;
    }
  };

  return (
    <div>
      {getContent()}
    </div>
  );
};
