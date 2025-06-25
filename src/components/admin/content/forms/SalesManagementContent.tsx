
import React from 'react';
import { DailySalesForm } from './DailySalesForm';
import { MonthlySalesForm } from './MonthlySalesForm';
import { YearlySalesForm } from './YearlySalesForm';
import { SalesOverviewContent } from './salesManagement/SalesOverviewContent';
import { RevenueAnalyticsContent } from './salesManagement/RevenueAnalyticsContent';
import { SalesForecastContent } from './salesManagement/SalesForecastContent';
import { RevenueDashboardContent } from './salesManagement/RevenueDashboardContent';
import { ProfitMarginContent } from './salesManagement/ProfitMarginContent';
import { CostAnalysisContent } from './salesManagement/CostAnalysisContent';
import { ROITrackingContent } from './salesManagement/ROITrackingContent';
import { DetailedReportsContent } from './salesManagement/DetailedReportsContent';
import { ComparativeAnalysisContent } from './salesManagement/ComparativeAnalysisContent';

interface SalesManagementContentProps {
  selectedSubmenu: string;
}

export const SalesManagementContent: React.FC<SalesManagementContentProps> = ({ selectedSubmenu }) => {
  const getContent = () => {
    console.log('🔍 SalesManagementContent - selectedSubmenu:', selectedSubmenu);
    
    switch (selectedSubmenu) {
      case 'sales-overview':
      case 'sales':
      case 'overview': // Add fallback for when coming from sales menu
        return <SalesOverviewContent />;
      case 'sales-forecast':
      case 'forecast':
        console.log('✅ Rendering SalesForecastContent');
        return <SalesForecastContent />;
      case 'revenue-dashboard':
        console.log('✅ Rendering RevenueDashboardContent');
        return <RevenueDashboardContent />;
      case 'profit-margins':
        console.log('✅ Rendering ProfitMarginContent');
        return <ProfitMarginContent />;
      case 'cost-analysis':
        console.log('✅ Rendering CostAnalysisContent');
        return <CostAnalysisContent />;
      case 'roi-tracking':
        console.log('✅ Rendering ROITrackingContent');
        return <ROITrackingContent />;
      case 'detailed-reports':
      case 'sales-reports':
        console.log('✅ Rendering DetailedReportsContent');
        return <DetailedReportsContent />;
      case 'comparative-analysis':
        console.log('✅ Rendering ComparativeAnalysisContent');
        return <ComparativeAnalysisContent />;
      case 'daily-sales':
        console.log('✅ Rendering DailySalesForm');
        return <DailySalesForm />;
      case 'monthly-trends':
        console.log('✅ Rendering MonthlySalesForm');
        return <MonthlySalesForm />;
      case 'yearly-reports':
        console.log('✅ Rendering YearlySalesForm');
        return <YearlySalesForm />;
      case 'revenue-analytics':
        return <RevenueAnalyticsContent />;
      default:
        console.log('⚠️ SalesManagementContent - defaulting to sales overview for:', selectedSubmenu);
        return <SalesOverviewContent />;
    }
  };

  return (
    <div className="p-6">
      {getContent()}
    </div>
  );
};
