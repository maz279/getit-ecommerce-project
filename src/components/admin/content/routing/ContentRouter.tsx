
import React from 'react';
import { DashboardContent } from '../DashboardContent';
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
      return <DashboardContent selectedSubmenu={selectedSubmenu} />;
    
    case 'user-management':
      return <UserManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'sales-management':
      return <SalesManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'order-management':
      return <OrderManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'logistics-management':
      return <LogisticsContent selectedSubmenu={selectedSubmenu} />;
    
    case 'product-management':
      return <ProductManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'customer-management':
      return <CustomerManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'vendor-management':
      console.log('✅ ContentRouter routing to VendorManagementContent with submenu:', selectedSubmenu);
      return <VendorManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'marketing':
      return <MarketingContent selectedSubmenu={selectedSubmenu} />;
    
    case 'analytics':
      return <AnalyticsContent selectedSubmenu={selectedSubmenu} />;
    
    case 'payment-management':
      return <PaymentManagementContent selectedSubmenu={selectedSubmenu} />;
    
    case 'communications':
      return <CommunicationsContent selectedSubmenu={selectedSubmenu} />;
    
    case 'security':
      return <SecurityContent selectedSubmenu={selectedSubmenu} />;
    
    case 'settings':
      return <SettingsContent selectedSubmenu={selectedSubmenu} />;
    
    default:
      console.log('⚠️ ContentRouter - Unknown menu, defaulting to dashboard');
      return <DashboardContent selectedSubmenu="overview" />;
  }
};
