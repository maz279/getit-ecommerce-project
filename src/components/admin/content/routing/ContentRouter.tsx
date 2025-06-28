
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
  
  switch (selectedMenu) {
    case 'dashboard':
      console.log('✅ ContentRouter routing to DashboardContent');
      return <DashboardContent selectedSubmenu={selectedSubmenu} />;
    
    case 'user-management':
      console.log('✅ ContentRouter routing to UserManagementContent');
      return <UserManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'sales-management':
      console.log('✅ ContentRouter routing to SalesManagementContent');
      return <SalesManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'order-management':
      console.log('✅ ContentRouter routing to OrderManagementContent');
      return <OrderManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'logistics-management':
      console.log('✅ ContentRouter routing to LogisticsContent');
      return <LogisticsContent selectedSubmenu={selectedSubmenu} />;
    
    case 'product-management':
      console.log('✅ ContentRouter routing to ProductManagementContent');
      return <ProductManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'customer-management':
      console.log('✅ ContentRouter routing to CustomerManagementContent');
      return <CustomerManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'vendor-management':
      console.log('✅ ContentRouter routing to VendorManagementContent with submenu:', selectedSubmenu);
      return <VendorManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'marketing':
      console.log('✅ ContentRouter routing to MarketingContent');
      return <MarketingContent selectedSubmenu={selectedSubmenu} />;
    
    case 'analytics':
      console.log('✅ ContentRouter routing to AnalyticsContent');
      return <AnalyticsContent selectedSubmenu={selectedSubmenu} />;
    
    case 'payment-management':
      console.log('✅ ContentRouter routing to PaymentManagementContent');
      return <PaymentManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'communications':
      console.log('✅ ContentRouter routing to CommunicationsContent');
      return <CommunicationsContent selectedSubmenu={selectedSubmenu} />;
    
    case 'security':
      console.log('✅ ContentRouter routing to SecurityContent');
      return <SecurityContent selectedSubmenu={selectedSubmenu} />;
    
    case 'settings':
      console.log('✅ ContentRouter routing to SettingsContent');
      return <SettingsContent selectedSubmenu={selectedSubmenu} />;
    
    default:
      console.log('⚠️ ContentRouter - Unknown menu:', selectedMenu, '- defaulting to dashboard');
      return <DashboardContent selectedSubmenu="overview" />;
  }
};
