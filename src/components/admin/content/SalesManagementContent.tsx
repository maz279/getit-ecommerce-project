
import React from 'react';
import { SalesOverviewContent } from './forms/salesManagement/SalesOverviewContent';
import { DailySalesForm } from './forms/DailySalesForm';
import { MonthlySalesForm } from './forms/MonthlySalesForm';
import { YearlySalesForm } from './forms/YearlySalesForm';
import { SalesForecastContent } from './forms/salesManagement/SalesForecastContent';
import { RevenueAnalyticsContent } from './forms/salesManagement/RevenueAnalyticsContent';
import { RevenueDashboardContent } from './forms/salesManagement/RevenueDashboardContent';
import { ProfitMarginContent } from './forms/salesManagement/ProfitMarginContent';
import { CostAnalysisContent } from './forms/salesManagement/CostAnalysisContent';
import { ROITrackingContent } from './forms/salesManagement/ROITrackingContent';
import { SalesReportsForm } from './forms/SalesReportsForm';
import { DetailedReportsContent } from './forms/salesManagement/DetailedReportsContent';
import { ComparativeAnalysisContent } from './forms/salesManagement/ComparativeAnalysisContent';
import { ExportDataContent } from './forms/salesManagement/ExportDataContent';

interface SalesManagementContentProps {
  selectedSubmenu: string;
}

export const SalesManagementContent: React.FC<SalesManagementContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 SalesManagementContent - selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
    
    switch (normalizedSubmenu) {
      case 'sales-overview':
        return <SalesOverviewContent />;
      case 'daily-sales':
        return <DailySalesForm />;
      case 'monthly-trends':
        return <MonthlySalesForm />;
      case 'yearly-reports':
        return <YearlySalesForm />;
      case 'sales-forecast':
        return <SalesForecastContent />;
      case 'revenue-analytics':
        return <RevenueAnalyticsContent />;
      case 'revenue-dashboard':
        return <RevenueDashboardContent />;
      case 'profit-margins':
        return <ProfitMarginContent />;
      case 'cost-analysis':
        return <CostAnalysisContent />;
      case 'roi-tracking':
        return <ROITrackingContent />;
      case 'sales-reports':
        return <SalesReportsForm />;
      case 'detailed-reports':
        return <DetailedReportsContent />;
      case 'comparative-analysis':
        return <ComparativeAnalysisContent />;
      case 'export-data':
        return <ExportDataContent />;
      default:
        console.log('⚠️ SalesManagementContent - unknown submenu, defaulting to overview');
        return <SalesOverviewContent />;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};
