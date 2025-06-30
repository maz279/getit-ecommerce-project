
import React from 'react';
import { DashboardContent } from '../../dashboard/DashboardContent';
import { UserManagementContent } from '../UserManagementContent';
import { SalesManagementContent } from '../SalesManagementContent';
import { OrderManagementContent } from '../OrderManagementContent';
import { LogisticsContent } from '../LogisticsContent';
import { ProductManagementContent } from '../ProductManagementContent';
import { CustomerManagementContent } from '../CustomerManagementContent';
import { VendorManagementContent } from '../VendorManagementContent';
import { MarketingContent } from '../MarketingContent';
import { AnalyticsContent } from '../AnalyticsContent';
import { PaymentManagementContent } from '../PaymentManagementContent';
import { CommunicationsContent } from '../CommunicationsContent';
import { SecurityContent } from '../SecurityContent';
import { SettingsContent } from '../SettingsContent';

interface ContentRouterProps {
  selectedMenu: string;
  selectedSubmenu: string;
}

export const ContentRouter: React.FC<ContentRouterProps> = ({ selectedMenu, selectedSubmenu }) => {
  console.log('🔍 ContentRouter - selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
  
  // Normalize menu values to handle any inconsistencies
  const normalizedMenu = selectedMenu?.toString().trim().toLowerCase();
  const normalizedSubmenu = selectedSubmenu?.toString().trim().toLowerCase();
  
  console.log('🔍 Normalized values - menu:', normalizedMenu, 'submenu:', normalizedSubmenu);
  
  switch (normalizedMenu) {
    case 'dashboard':
      console.log('✅ ContentRouter routing to DashboardContent');
      return <DashboardContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'user-management':
      console.log('✅ ContentRouter routing to UserManagementContent');
      return <UserManagementContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'sales-management':
      console.log('✅ ContentRouter routing to SalesManagementContent');
      return <SalesManagementContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'order-management':
      console.log('✅ ContentRouter routing to OrderManagementContent');
      return <OrderManagementContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'logistics-management':
    case 'shipping-logistics': // Handle legacy naming
      console.log('✅ ContentRouter routing to LogisticsContent');
      return <LogisticsContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'product-management':
      console.log('✅ ContentRouter routing to ProductManagementContent');
      return <ProductManagementContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'customer-management':
      console.log('✅ ContentRouter routing to CustomerManagementContent');
      return <CustomerManagementContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'vendor-management':
      console.log('✅ ContentRouter routing to VendorManagementContent');
      return <VendorManagementContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'marketing':
    case 'marketing-promotions': // Handle expanded naming
      console.log('✅ ContentRouter routing to MarketingContent');
      return <MarketingContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'analytics':
    case 'analytics-reports': // Handle expanded naming
      console.log('✅ ContentRouter routing to AnalyticsContent');
      return <AnalyticsContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'payment-management':
    case 'financial-management': // Handle alternative naming
      console.log('✅ ContentRouter routing to PaymentManagementContent');
      return <PaymentManagementContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'communications':
      console.log('✅ ContentRouter routing to CommunicationsContent');
      return <CommunicationsContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'security':
    case 'security-compliance': // Handle expanded naming
      console.log('✅ ContentRouter routing to SecurityContent');
      return <SecurityContent selectedSubmenu={normalizedSubmenu} />;
    
    case 'settings':
    case 'settings-configuration': // Handle expanded naming
      console.log('✅ ContentRouter routing to SettingsContent');
      return <SettingsContent selectedSubmenu={normalizedSubmenu} />;
    
    // Handle dashboard submenus that might be passed as main menu
    case 'overview':
    case 'analytics-dashboard':
    case 'real-time-metrics':
    case 'realtime-metrics':
    case 'kpi-monitoring':
    case 'performance-insights':
      console.log('✅ ContentRouter routing dashboard submenu to DashboardContent');
      return <DashboardContent selectedSubmenu={normalizedMenu} />;
    
    // Handle order management submenus that might be passed as main menu
    case 'order-search':
    case 'order-timeline':
    case 'bulk-actions':
    case 'new-orders':
    case 'processing-orders':
    case 'shipped-orders':
    case 'delivered-orders':
      console.log('✅ ContentRouter routing order submenu to OrderManagementContent');
      return <OrderManagementContent selectedSubmenu={normalizedMenu} />;
    
    default:
      console.log('⚠️ ContentRouter - Unknown menu:', normalizedMenu, '- routing to appropriate content based on submenu');
      
      // Try to determine the correct content based on submenu patterns
      if (normalizedSubmenu.includes('order') || normalizedSubmenu.includes('payment') || normalizedSubmenu.includes('shipping')) {
        return <OrderManagementContent selectedSubmenu={normalizedSubmenu} />;
      }
      if (normalizedSubmenu.includes('user') || normalizedSubmenu.includes('admin') || normalizedSubmenu.includes('role')) {
        return <UserManagementContent selectedSubmenu={normalizedSubmenu} />;
      }
      if (normalizedSubmenu.includes('sales') || normalizedSubmenu.includes('revenue')) {
        return <SalesManagementContent selectedSubmenu={normalizedSubmenu} />;
      }
      if (normalizedSubmenu.includes('product') || normalizedSubmenu.includes('inventory') || normalizedSubmenu.includes('category')) {
        return <ProductManagementContent selectedSubmenu={normalizedSubmenu} />;
      }
      if (normalizedSubmenu.includes('customer') || normalizedSubmenu.includes('support')) {
        return <CustomerManagementContent selectedSubmenu={normalizedSubmenu} />;
      }
      if (normalizedSubmenu.includes('vendor') || normalizedSubmenu.includes('commission')) {
        return <VendorManagementContent selectedSubmenu={normalizedSubmenu} />;
      }
      if (normalizedSubmenu.includes('marketing') || normalizedSubmenu.includes('campaign')) {
        return <MarketingContent selectedSubmenu={normalizedSubmenu} />;
      }
      if (normalizedSubmenu.includes('analytics') || normalizedSubmenu.includes('report')) {
        return <AnalyticsContent selectedSubmenu={normalizedSubmenu} />;
      }
      if (normalizedSubmenu.includes('logistics') || normalizedSubmenu.includes('courier') || normalizedSubmenu.includes('delivery')) {
        return <LogisticsContent selectedSubmenu={normalizedSubmenu} />;
      }
      
      // Final fallback to dashboard
      return <DashboardContent selectedSubmenu="overview" />;
  }
};
