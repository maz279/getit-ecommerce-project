
import React from 'react';
import { DailySalesForm } from './forms/DailySalesForm';
import { MonthlySalesForm } from './forms/MonthlySalesForm';
import { YearlySalesForm } from './forms/YearlySalesForm';
import { SalesForecastForm } from './forms/SalesForecastForm';
import { ProfitMarginsForm } from './forms/ProfitMarginsForm';
import { SalesReportsForm } from './forms/SalesReportsForm';
import { SalesOverviewRenderer } from './SalesManagement/SalesOverviewRenderer';
import { RevenueAnalyticsRenderer } from './SalesManagement/RevenueAnalyticsRenderer';
import { RevenueDashboardContent } from './forms/salesManagement/RevenueDashboardContent';
import { RevenueAnalyticsContent } from './forms/salesManagement/RevenueAnalyticsContent';
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
        return <SalesOverviewRenderer />;
      
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
      
      case 'revenue-dashboard':
        return <RevenueDashboardContent />;
      
      case 'sales-forecast':
        return <SalesForecastForm />;
      
      case 'profit-margins':
        return <ProfitMarginsForm />;
      
      case 'cost-analysis':
        return <div className="p-6"><h1 className="text-2xl font-bold">Cost Analysis</h1><p>Cost analysis dashboard coming soon...</p></div>;
      
      case 'roi-tracking':
        return <div className="p-6"><h1 className="text-2xl font-bold">ROI Tracking</h1><p>ROI tracking analytics coming soon...</p></div>;
      
      case 'sales-reports':
      case 'detailed-reports':
      case 'summary-reports':
        return <SalesReportsForm />;
      
      case 'comparative-analysis':
        return <div className="p-6"><h1 className="text-2xl font-bold">Comparative Analysis</h1><p>Comparative sales analysis coming soon...</p></div>;
      
      case 'export-data':
        return <ExportDataContent />;
      
      default:
        console.log('⚠️ SalesManagementContent - defaulting to sales overview for:', selectedSubmenu);
        return <SalesOverviewRenderer />;
    }
  };

  return (
    <div className="p-6">
      {getContent()}
    </div>
  );
};
