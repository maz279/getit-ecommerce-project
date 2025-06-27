
import React from 'react';
import { DailySalesForm } from './forms/DailySalesForm';
import { MonthlySalesForm } from './forms/MonthlySalesForm';
import { YearlySalesForm } from './forms/YearlySalesForm';
import { SalesOverviewRenderer } from './SalesManagement/SalesOverviewRenderer';
import { RevenueAnalyticsRenderer } from './SalesManagement/RevenueAnalyticsRenderer';

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
      case 'revenue-dashboard':
        return <RevenueAnalyticsRenderer />;
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
