import React from 'react';
import { DashboardContent } from './dashboard/DashboardContent';
import { UserManagementContent } from './content/UserManagementContent';
import { SalesManagementContent } from './content/forms/SalesManagementContent';
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
  console.log('🌟 ComprehensiveMainContent - selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
  
  const renderContent = () => {
    console.log('🔍 ComprehensiveMainContent renderContent Debug:');
    console.log('  - selectedMenu:', selectedMenu, '(type:', typeof selectedMenu, ')');
    console.log('  - selectedSubmenu:', selectedSubmenu, '(type:', typeof selectedSubmenu, ')');
    
    // Handle user-management explicitly first
    if (selectedMenu === 'user-management') {
      console.log('✅ USER MANAGEMENT MAIN MENU - routing to UserManagementContent');
      console.log('   selectedSubmenu:', selectedSubmenu);
      return <UserManagementContent selectedSubmenu={selectedSubmenu} />;
    }

    // Handle sales management and sales-related submenus
    if (selectedMenu === 'sales' || selectedMenu === 'sales-management' || 
        selectedMenu.startsWith('sales-') || 
        ['daily-sales', 'monthly-trends', 'yearly-reports', 'revenue-analytics', 'revenue-dashboard', 'sales-forecast', 'profit-margins', 'cost-analysis', 'roi-tracking', 'sales-reports', 'detailed-reports', 'summary-reports', 'comparative-analysis', 'export-data'].includes(selectedMenu)) {
      console.log('✅ SALES MANAGEMENT - routing to SalesManagementContent');
      console.log('   selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
      
      // If selectedMenu is a sales submenu, pass it as selectedSubmenu
      const submenu = ['daily-sales', 'monthly-trends', 'yearly-reports', 'revenue-analytics', 'revenue-dashboard', 'sales-forecast', 'profit-margins', 'cost-analysis', 'roi-tracking', 'sales-reports', 'detailed-reports', 'summary-reports', 'comparative-analysis', 'export-data'].includes(selectedMenu) 
        ? selectedMenu 
        : selectedSubmenu;
      
      console.log('   Final submenu passed:', submenu);
      return <SalesManagementContent selectedSubmenu={submenu} />;
    }

    // Handle order management and order-related submenus
    if (selectedMenu === 'order-management' || selectedMenu === 'orders' || selectedMenu === 'order' || selectedMenu.startsWith('order-') || 
        ['all-orders', 'pending-orders', 'confirmed-orders', 'processing-orders', 'shipped-orders', 'delivered-orders', 'cancelled-orders', 'returned-orders', 'order-tracking', 'live-tracking', 'delivery-status', 'shipment-updates', 'returns-refunds', 'return-requests', 'refund-processing', 'refund-management', 'exchange-requests', 'order-analytics', 'order-reports', 'detailed-reports', 'summary-reports', 'performance-reports', 'performance-metrics', 'comparative-analysis', 'fulfillment-center', 'order-search', 'order-timeline', 'bulk-actions', 'bulk', 'new-orders', 'order-processing', 'payment-status', 'payment-management', 'payment-gateway', 'transaction-monitoring', 'payment-analytics', 'payment-disputes', 'payment-methods', 'failed-payments'].includes(selectedMenu)) {
      console.log('✅ ORDER MANAGEMENT - routing to OrderManagementContent');
      console.log('   selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
      
      // If selectedMenu is an order submenu, pass it as selectedSubmenu
      const submenu = ['all-orders', 'pending-orders', 'confirmed-orders', 'processing-orders', 'shipped-orders', 'delivered-orders', 'cancelled-orders', 'returned-orders', 'order-tracking', 'live-tracking', 'delivery-status', 'shipment-updates', 'returns-refunds', 'return-requests', 'refund-processing', 'refund-management', 'exchange-requests', 'order-analytics', 'order-reports', 'detailed-reports', 'summary-reports', 'performance-reports', 'performance-metrics', 'comparative-analysis', 'fulfillment-center', 'order-search', 'order-timeline', 'bulk-actions', 'bulk', 'new-orders', 'order-processing', 'payment-status', 'payment-management', 'payment-gateway', 'transaction-monitoring', 'payment-analytics', 'payment-disputes', 'payment-methods', 'failed-payments'].includes(selectedMenu) 
        ? selectedMenu 
        : selectedSubmenu;
      
      console.log('   Final submenu passed:', submenu);
      return <OrderManagementContent selectedSubmenu={submenu} />;
    }

    // Handle logistics management and logistics-related submenus
    if (selectedMenu === 'logistics' || selectedMenu.startsWith('shipping-') || selectedMenu.startsWith('warehouse-') || selectedMenu.startsWith('courier-') ||
        ['shipping-management', 'warehouse-operations', 'courier-partners', 'shipping-rates', 'delivery-zones', 'shipping-zones', 'shipping-analytics', 'pick-pack-operations', 'quality-control', 'logistics-overview', 'delivery-tracking', 'shipping-labels', 'return-logistics', 'delivery-performance'].includes(selectedMenu)) {
      console.log('✅ LOGISTICS MANAGEMENT - routing to LogisticsContent');
      console.log('   selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
      
      // If selectedMenu is a logistics submenu, pass it as selectedSubmenu
      const submenu = ['shipping-management', 'warehouse-operations', 'courier-partners', 'shipping-rates', 'delivery-zones', 'shipping-zones', 'shipping-analytics', 'pick-pack-operations', 'quality-control', 'logistics-overview', 'delivery-tracking', 'shipping-labels', 'return-logistics', 'delivery-performance'].includes(selectedMenu) 
        ? selectedMenu 
        : selectedSubmenu;
      
      console.log('   Final submenu passed:', submenu);
      return <LogisticsContent selectedSubmenu={submenu} />;
    }

    // Handle dashboard and its submenus
    if (selectedMenu === 'dashboard') {
      console.log('✅ Dashboard section detected - submenu:', selectedSubmenu);
      return <DashboardContent selectedSubmenu={selectedSubmenu} />;
    }

    // Handle specific dashboard submenus when they come in as selectedMenu
    const dashboardSubmenus = [
      'overview', 'analytics', 'real-time-metrics', 'kpi-monitoring', 'performance-insights', 
      'revenue-analytics', 'user-activity', 'vendor-performance', 'order-insights', 
      'inventory-alerts', 'platform-performance', 'system-health', 'security-monitoring', 
      'system-logs', 'quick-actions', 'executive-summary'
    ];

    if (dashboardSubmenus.includes(selectedMenu)) {
      console.log('✅ Dashboard submenu detected as selectedMenu:', selectedMenu);
      console.log('   Passing to DashboardContent with selectedSubmenu:', selectedMenu);
      return <DashboardContent selectedSubmenu={selectedMenu} />;
    }

    // Handle product management and product-related submenus - UPDATED with import-export
    if (selectedMenu === 'product-management' || selectedMenu === 'products' || selectedMenu.startsWith('product-') || 
        ['product-catalog', 'all-products', 'inventory-management', 'product-analytics', 'add-product', 'bulk-upload', 'product-categories', 'stock-levels', 'low-stock-alerts', 'reorder-points', 'warehouse-management', 'best-sellers', 'product-performance', 'trending-products', 'price-optimization', 'product-search', 'featured-products', 'import-export', 'product-import', 'product-export', 'bulk-operations'].includes(selectedMenu)) {
      console.log('✅ PRODUCT MANAGEMENT - routing to ProductManagementContent');
      console.log('   selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
      
      // If selectedMenu is a product submenu, pass it as selectedSubmenu
      const submenu = ['product-catalog', 'all-products', 'inventory-management', 'product-analytics', 'add-product', 'bulk-upload', 'product-categories', 'stock-levels', 'low-stock-alerts', 'reorder-points', 'warehouse-management', 'best-sellers', 'product-performance', 'trending-products', 'price-optimization', 'product-search', 'featured-products', 'import-export', 'product-import', 'product-export', 'bulk-operations'].includes(selectedMenu) 
        ? selectedMenu 
        : selectedSubmenu;
      
      console.log('   Final submenu passed:', submenu);
      return <ProductManagementContent selectedSubmenu={submenu} />;
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

    // Handle analytics (separate from dashboard analytics)
    if (selectedMenu === 'analytics' || selectedMenu.startsWith('analytics-') || selectedMenu.startsWith('business-') || selectedMenu.startsWith('financial-') || selectedMenu.startsWith('operational-') || 
        ['business-intelligence', 'financial-reports', 'operational-reports', 'executive-dashboard', 'key-metrics', 'trend-analysis', 'predictive-analytics', 'profit-loss', 'cash-flow', 'tax-reports', 'audit-reports', 'inventory-reports', 'shipping-reports', 'performance-reports'].includes(selectedMenu)) {
      return <AnalyticsContent selectedSubmenu={selectedMenu === 'analytics' ? selectedSubmenu : selectedMenu} />;
    }

    // Handle payments
    if (selectedMenu === 'payments' || selectedMenu.startsWith('payment-') || selectedMenu.startsWith('financial-') || 
        ['payment-processing', 'financial-management', 'transaction-monitoring', 'payment-gateways', 'failed-payments', 'payment-analytics', 'revenue-tracking', 'expense-management', 'budget-planning', 'financial-forecasting'].includes(selectedMenu)) {
      return <PaymentManagementContent selectedSubmenu={selectedMenu === 'payments' ? selectedSubmenu : selectedMenu} />;
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

    // Default fallback
    console.log('⚠️ No matching menu found, defaulting to dashboard overview');
    console.log('   selectedMenu was:', selectedMenu);
    console.log('   selectedSubmenu was:', selectedSubmenu);
    return <DashboardContent selectedSubmenu="overview" />;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};
