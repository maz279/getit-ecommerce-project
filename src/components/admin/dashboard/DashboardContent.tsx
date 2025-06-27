
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log('=== DashboardContent Debug Info ===');
    console.log('Received selectedSubmenu prop:', selectedSubmenu);
    console.log('Type of selectedSubmenu:', typeof selectedSubmenu);
    console.log('selectedSubmenu length:', selectedSubmenu?.length);
    console.log('JSON.stringify selectedSubmenu:', JSON.stringify(selectedSubmenu));
    console.log('=================================');
  }, [selectedSubmenu]);

  const getContent = () => {
    console.log('🔍 DashboardContent getContent - selectedSubmenu:', selectedSubmenu);
    
    // Normalize the submenu value to handle any whitespace or case issues
    const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
    console.log('🔍 Normalized submenu:', normalizedSubmenu);
    
    // Add explicit checks for the problematic submenus
    if (normalizedSubmenu === 'real-time-metrics' || normalizedSubmenu === 'realtime-metrics') {
      console.log('✅ Matched real-time-metrics, rendering RealtimeMetricsSection');
      return <RealtimeMetricsSection />;
    }
    
    if (normalizedSubmenu === 'kpi-monitoring' || normalizedSubmenu === 'kpi_monitoring') {
      console.log('✅ Matched kpi-monitoring, rendering KPIMonitoringDashboard');
      return <KPIMonitoringDashboard />;
    }
    
    if (normalizedSubmenu === 'performance-insights' || normalizedSubmenu === 'performance_insights') {
      console.log('✅ Matched performance-insights, rendering PerformanceInsightsDashboard');
      return <PerformanceInsightsDashboard />;
    }
    
    switch (normalizedSubmenu) {
      case 'overview':
        console.log('✅ Rendering OverviewDashboard');
        return <OverviewDashboard />;
      
      case 'analytics':
        console.log('✅ Rendering AnalyticsDashboard');
        return <AnalyticsDashboard />;
      
      case 'revenue-analytics':
        console.log('✅ Rendering RevenueAnalytics');
        return <RevenueAnalytics 
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
        />;
      
      case 'user-activity':
        console.log('✅ Rendering UserActivity');
        return <UserActivity />;
      
      case 'vendor-performance':
        console.log('✅ Rendering VendorPerformanceSection');
        return <VendorPerformanceSection />;
      
      case 'order-insights':
        console.log('✅ Rendering OrderInsightsSection');
        return <OrderInsightsSection />;
      
      case 'inventory-alerts':
        console.log('✅ Rendering InventoryAlertsSection');
        return <InventoryAlertsSection />;
      
      case 'platform-performance':
        console.log('✅ Rendering PlatformPerformanceSection');
        return <PlatformPerformanceSection />;
      
      case 'system-health':
        console.log('✅ Rendering SystemHealthSection');
        return <SystemHealthSection />;
      
      case 'security-monitoring':
        console.log('✅ Rendering SecurityMonitoringSection');
        return <SecurityMonitoringSection />;
      
      case 'system-logs':
        console.log('✅ Rendering SystemLogsSection');
        return <SystemLogsSection />;
      
      case 'quick-actions':
        console.log('✅ Rendering QuickActionsSection');
        return <QuickActionsSection />;
      
      case 'executive-summary':
        console.log('✅ Rendering ExecutiveSummarySection');
        return <ExecutiveSummarySection />;
      
      default:
        console.log('⚠️ DashboardContent - no matching submenu found for:', normalizedSubmenu);
        console.log('⚠️ Available submenus should include: real-time-metrics, kpi-monitoring, performance-insights');
        console.log('⚠️ Falling back to OverviewDashboard');
        return <OverviewDashboard />;
    }
  };

  return (
    <div>
      {getContent()}
    </div>
  );
};
