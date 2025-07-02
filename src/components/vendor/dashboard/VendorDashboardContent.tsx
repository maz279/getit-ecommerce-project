import React from 'react';
import { VendorOverviewDashboard } from './content/VendorOverviewDashboard';
import { VendorAnalyticsDashboard } from './content/VendorAnalyticsDashboard';
import { VendorPerformanceDashboard } from './content/VendorPerformanceDashboard';
import { VendorProductsManagement } from './content/VendorProductsManagement';
import { VendorOrdersManagement } from './content/VendorOrdersManagement';
import { VendorEarningsManagement } from './content/VendorEarningsManagement';

interface VendorDashboardContentProps {
  selectedSubmenu: string;
}

export const VendorDashboardContent: React.FC<VendorDashboardContentProps> = ({
  selectedSubmenu
}) => {
  const renderContent = () => {
    switch (selectedSubmenu) {
      case 'overview':
        return <VendorOverviewDashboard />;
      case 'analytics':
        return <VendorAnalyticsDashboard />;
      case 'performance':
        return <VendorPerformanceDashboard />;
      case 'all-products':
      case 'add-product':
      case 'inventory':
      case 'categories':
        return <VendorProductsManagement activeTab={selectedSubmenu} />;
      case 'pending':
      case 'processing':
      case 'shipped':
      case 'completed':
      case 'refunds':
        return <VendorOrdersManagement activeTab={selectedSubmenu} />;
      case 'commission-tracking':
      case 'payouts':
      case 'disputes':
        return <VendorEarningsManagement activeTab={selectedSubmenu} />;
      default:
        return <VendorOverviewDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};