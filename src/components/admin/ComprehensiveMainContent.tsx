
import React from 'react';
import { DashboardContent } from './dashboard/DashboardContent';
import { SalesManagementContent } from './content/SalesManagementContent';
import { OrderManagementContent } from './content/OrderManagementContent';
import { ProductManagementContent } from './content/ProductManagementContent';
import { CustomerManagementContent } from './content/CustomerManagementContent';
import { VendorManagementContent } from './content/VendorManagementContent';
import { MarketingContent } from './content/MarketingContent';
import { AnalyticsContent } from './content/AnalyticsContent';
import { PaymentManagementContent } from './content/PaymentManagementContent';
import { LogisticsContent } from './content/LogisticsContent';
import { CommunicationsContent } from './content/CommunicationsContent';
import { SecurityContent } from './content/SecurityContent';
import { SettingsContent } from './content/SettingsContent';

interface ComprehensiveMainContentProps {
  selectedMenu: string;
  selectedSubmenu: string;
}

export const ComprehensiveMainContent: React.FC<ComprehensiveMainContentProps> = ({
  selectedMenu,
  selectedSubmenu
}) => {
  console.log('ComprehensiveMainContent - selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    // Handle dashboard and its submenus
    if (selectedMenu === 'dashboard' || selectedMenu.startsWith('dashboard-') || 
        ['overview', 'analytics', 'real-time-metrics', 'kpi-monitoring', 'performance-insights'].includes(selectedMenu)) {
      return <DashboardContent selectedSubmenu={selectedMenu === 'dashboard' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle sales management
    if (selectedMenu === 'sales' || selectedMenu.startsWith('sales-') || 
        ['sales-overview', 'revenue-analytics', 'sales-reports', 'daily-sales', 'monthly-trends', 'yearly-reports', 'sales-forecast', 'revenue-dashboard', 'profit-margins', 'cost-analysis', 'roi-tracking', 'detailed-reports', 'comparative-analysis', 'export-data'].includes(selectedMenu)) {
      return <SalesManagementContent selectedSubmenu={selectedMenu === 'sales' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle order management
    if (selectedMenu === 'orders' || selectedMenu.startsWith('order-') || 
        ['order-processing', 'order-tracking', 'returns-refunds', 'new-orders', 'pending-orders', 'confirmed-orders', 'shipped-orders', 'delivered-orders', 'live-tracking', 'delivery-status', 'shipment-updates', 'return-requests', 'refund-processing', 'exchange-requests'].includes(selectedMenu)) {
      return <OrderManagementContent selectedSubmenu={selectedMenu === 'orders' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle product management
    if (selectedMenu === 'products' || selectedMenu.startsWith('product-') || 
        ['product-catalog', 'inventory-management', 'product-analytics', 'all-products', 'add-product', 'bulk-upload', 'product-categories', 'stock-levels', 'low-stock-alerts', 'reorder-points', 'warehouse-management', 'best-sellers', 'product-performance', 'trending-products', 'price-optimization'].includes(selectedMenu)) {
      return <ProductManagementContent selectedSubmenu={selectedMenu === 'products' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle customer management
    if (selectedMenu === 'customers' || selectedMenu.startsWith('customer-') || 
        ['customer-database', 'customer-analytics', 'customer-support', 'all-customers', 'customer-segments', 'vip-customers', 'customer-search', 'customer-behavior', 'purchase-history', 'loyalty-analysis', 'customer-lifetime-value', 'support-tickets', 'live-chat', 'feedback-reviews'].includes(selectedMenu)) {
      return <CustomerManagementContent selectedSubmenu={selectedMenu === 'customers' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle vendor management
    if (selectedMenu === 'vendors' || selectedMenu.startsWith('vendor-') || 
        ['vendor-directory', 'vendor-analytics', 'all-vendors', 'vendor-onboarding', 'vendor-verification', 'vendor-performance', 'vendor-sales', 'commission-tracking', 'payout-management', 'vendor-ratings'].includes(selectedMenu)) {
      return <VendorManagementContent selectedSubmenu={selectedMenu === 'vendors' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle marketing
    if (selectedMenu === 'marketing' || selectedMenu.startsWith('marketing-') || selectedMenu.startsWith('campaigns') || selectedMenu.startsWith('promotions') || selectedMenu.startsWith('email-') || 
        ['campaigns', 'promotions', 'email-marketing', 'active-campaigns', 'create-campaign', 'campaign-analytics', 'a-b-testing', 'discount-codes', 'flash-sales', 'seasonal-offers', 'bundle-deals', 'email-campaigns', 'newsletter-management', 'automated-emails'].includes(selectedMenu)) {
      return <MarketingContent selectedSubmenu={selectedMenu === 'marketing' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle analytics
    if (selectedMenu === 'analytics' || selectedMenu.startsWith('analytics-') || selectedMenu.startsWith('business-') || selectedMenu.startsWith('financial-') || selectedMenu.startsWith('operational-') || 
        ['business-intelligence', 'financial-reports', 'operational-reports', 'executive-dashboard', 'key-metrics', 'trend-analysis', 'predictive-analytics', 'profit-loss', 'cash-flow', 'tax-reports', 'audit-reports', 'inventory-reports', 'shipping-reports', 'performance-reports'].includes(selectedMenu)) {
      return <AnalyticsContent selectedSubmenu={selectedMenu === 'analytics' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle payments
    if (selectedMenu === 'payments' || selectedMenu.startsWith('payment-') || selectedMenu.startsWith('financial-') || 
        ['payment-processing', 'financial-management', 'transaction-monitoring', 'payment-gateways', 'failed-payments', 'payment-analytics', 'revenue-tracking', 'expense-management', 'budget-planning', 'financial-forecasting'].includes(selectedMenu)) {
      return <PaymentManagementContent selectedSubmenu={selectedMenu === 'payments' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle logistics
    if (selectedMenu === 'logistics' || selectedMenu.startsWith('shipping-') || selectedMenu.startsWith('warehouse-') || 
        ['shipping-management', 'warehouse-operations', 'courier-partners', 'shipping-rates', 'delivery-zones', 'shipping-analytics', 'pick-pack-operations', 'quality-control'].includes(selectedMenu)) {
      return <LogisticsContent selectedSubmenu={selectedMenu === 'logistics' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle communications
    if (selectedMenu === 'communications' || selectedMenu.startsWith('notifications') || selectedMenu.startsWith('messaging') || 
        ['notifications', 'messaging', 'system-notifications', 'push-notifications', 'email-notifications', 'sms-notifications', 'customer-messages', 'vendor-communications', 'broadcast-messages'].includes(selectedMenu)) {
      return <CommunicationsContent selectedSubmenu={selectedMenu === 'communications' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle security
    if (selectedMenu === 'security' || selectedMenu.startsWith('security-') || selectedMenu.startsWith('compliance') || 
        ['security-monitoring', 'compliance', 'threat-detection', 'fraud-prevention', 'access-logs', 'security-alerts', 'data-protection', 'privacy-settings', 'audit-trails', 'compliance-reports'].includes(selectedMenu)) {
      return <SecurityContent selectedSubmenu={selectedMenu === 'security' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle settings
    if (selectedMenu === 'settings' || selectedMenu.startsWith('system-') || selectedMenu.startsWith('platform-') || 
        ['system-settings', 'platform-configuration', 'general-settings', 'user-management', 'role-permissions', 'api-configuration', 'store-settings', 'payment-configuration', 'shipping-configuration', 'tax-settings'].includes(selectedMenu)) {
      return <SettingsContent selectedSubmenu={selectedMenu === 'settings' ? selectedSubmenu : selectedMenu} />;
    }

    // Default to dashboard
    return <DashboardContent selectedSubmenu="overview" />;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};
