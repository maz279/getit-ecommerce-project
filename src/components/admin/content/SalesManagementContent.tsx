
import React from 'react';
import { DailySalesForm } from './forms/DailySalesForm';
import { MonthlySalesForm } from './forms/MonthlySalesForm';
import { YearlySalesForm } from './forms/YearlySalesForm';
import { SalesForecastForm } from './forms/SalesForecastForm';
import { ProfitMarginsForm } from './forms/ProfitMarginsForm';
import { SalesReportsForm } from './forms/SalesReportsForm';
import { SalesOverviewContent } from './forms/salesManagement/SalesOverviewContent';
import { RevenueAnalyticsContent } from './forms/salesManagement/RevenueAnalyticsContent';
import { SalesForecastContent } from './forms/salesManagement/SalesForecastContent';
import { RevenueDashboardContent } from './forms/salesManagement/RevenueDashboardContent';
import { ProfitMarginContent } from './forms/salesManagement/ProfitMarginContent';
import { CostAnalysisContent } from './forms/salesManagement/CostAnalysisContent';
import { ROITrackingContent } from './forms/salesManagement/ROITrackingContent';
import { DetailedReportsContent } from './forms/salesManagement/DetailedReportsContent';
import { ComparativeAnalysisContent } from './forms/salesManagement/ComparativeAnalysisContent';
import { ExportDataContent } from './forms/salesManagement/ExportDataContent';

interface SalesManagementContentProps {
  selectedSubmenu: string;
}

export const SalesManagementContent: React.FC<SalesManagementContentProps> = ({ selectedSubmenu }) => {
  const getContent = () => {
    console.log('🔍 SalesManagementContent - selectedSubmenu:', selectedSubmenu);
    
    switch (selectedSubmenu) {
      case 'sales-overview':
      case 'sales':
      case 'overview':
        console.log('✅ Rendering SalesOverviewContent');
        return <SalesOverviewContent />;
      
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
        console.log('✅ Rendering RevenueAnalyticsContent');
        return <RevenueAnalyticsContent />;
      
      case 'revenue-dashboard':
        console.log('✅ Rendering RevenueDashboardContent');
        return <RevenueDashboardContent />;
      
      case 'sales-forecast':
      case 'forecast':
        console.log('✅ Rendering SalesForecastContent');
        return <SalesForecastContent />;
      
      case 'profit-margins':
        console.log('✅ Rendering ProfitMarginContent');
        return <ProfitMarginContent />;
      
      case 'cost-analysis':
        console.log('✅ Rendering CostAnalysisContent');
        return <CostAnalysisContent />;
      
      case 'roi-tracking':
        console.log('✅ Rendering ROITrackingContent');
        return <ROITrackingContent />;
      
      case 'sales-reports':
      case 'detailed-reports':
      case 'summary-reports':
        console.log('✅ Rendering DetailedReportsContent');
        return <DetailedReportsContent />;
      
      case 'comparative-analysis':
        console.log('✅ Rendering ComparativeAnalysisContent');
        return <ComparativeAnalysisContent />;
      
      case 'export-data':
        console.log('✅ Rendering ExportDataContent');
        return <ExportDataContent />;
      
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
