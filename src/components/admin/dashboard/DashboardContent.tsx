
import React, { useState } from 'react';
import { 
  RevenueAnalytics, 
  UserActivity,
  InventoryAlertsSection,
  SecurityMonitoringSection,
  SystemLogsSection,
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
import { RealtimeMetricsSection } from './sections/RealtimeMetricsSection';

interface DashboardContentProps {
  selectedSubmenu: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ selectedSubmenu }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const getContent = () => {
    console.log('DashboardContent - selectedSubmenu:', selectedSubmenu);
    
    switch (selectedSubmenu) {
      case 'overview':
        console.log('Rendering OverviewDashboard');
        return <OverviewDashboard />;
      case 'analytics':
        console.log('Rendering AnalyticsDashboard');
        return <AnalyticsDashboard />;
      case 'real-time-metrics':
        console.log('Rendering RealtimeMetricsSection');
        return <RealtimeMetricsSection />;
      case 'kpi-monitoring':
        console.log('Rendering KPIMonitoringDashboard');
        return <KPIMonitoringDashboard />;
      case 'performance-insights':
        console.log('Rendering PerformanceInsightsDashboard');
        return <PerformanceInsightsDashboard />;
      case 'revenue-analytics':
        console.log('Rendering RevenueAnalytics');
        return <RevenueAnalytics 
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
        />;
      case 'user-activity':
        console.log('Rendering UserActivity');
        return <UserActivity />;
      case 'vendor-performance':
        console.log('Rendering VendorPerformanceSection');
        return <VendorPerformanceSection />;
      case 'order-insights':
        console.log('Rendering OrderInsightsSection');
        return <OrderInsightsSection />;
      case 'inventory-alerts':
        console.log('Rendering InventoryAlertsSection');
        return <InventoryAlertsSection />;
      case 'platform-performance':
        console.log('Rendering PlatformPerformanceSection');
        return <PlatformPerformanceSection />;
      case 'system-health':
        console.log('Rendering SystemHealthSection');
        return <SystemHealthSection />;
      case 'security-monitoring':
        console.log('Rendering SecurityMonitoringSection');
        return <SecurityMonitoringSection />;
      case 'system-logs':
        console.log('Rendering SystemLogsSection');
        return <SystemLogsSection />;
      case 'quick-actions':
        console.log('Rendering QuickActionsSection');
        return <QuickActionsSection />;
      case 'executive-summary':
        console.log('Rendering ExecutiveSummarySection');
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
