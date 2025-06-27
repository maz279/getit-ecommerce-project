
import React from 'react';
import { DashboardContent } from '../../dashboard/DashboardContent';
import { UserManagementContent } from '../UserManagementContent';
import { SalesManagementContent } from '../forms/SalesManagementContent';
import { OrderManagementContent } from '../OrderManagementContent';
import { ProductManagementContent } from '../ProductManagementContent';
import { CustomerManagementContent } from '../CustomerManagementContent';
import { VendorManagementContent } from '../VendorManagementContent';
import { MarketingContent } from '../MarketingContent';
import { AnalyticsContent } from '../AnalyticsContent';
import { PaymentManagementContent } from '../PaymentManagementContent';
import { LogisticsContent } from '../LogisticsContent';
import { CommunicationsContent } from '../CommunicationsContent';
import { SecurityContent } from '../SecurityContent';
import { SettingsContent } from '../SettingsContent';
import { 
  dashboardSubmenus, salesSubmenus, orderSubmenus, logisticsSubmenus, 
  productSubmenus, customerSubmenus, vendorSubmenus, marketingSubmenus, 
  analyticsSubmenus, paymentSubmenus, communicationSubmenus, 
  securitySubmenus, settingsSubmenus 
} from './routingConfig';

interface ContentRouterProps {
  selectedMenu: string;
  selectedSubmenu: string;
}

export const ContentRouter: React.FC<ContentRouterProps> = ({ selectedMenu, selectedSubmenu }) => {
  console.log('🌟 ContentRouter - selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
  
  // Handle user-management explicitly first
  if (selectedMenu === 'user-management') {
    console.log('✅ USER MANAGEMENT MAIN MENU - routing to UserManagementContent');
    return <UserManagementContent selectedSubmenu={selectedSubmenu} />;
  }

  // Handle sales management
  if (selectedMenu === 'sales' || selectedMenu === 'sales-management' || 
      selectedMenu.startsWith('sales-') || salesSubmenus.includes(selectedMenu)) {
    console.log('✅ SALES MANAGEMENT - routing to SalesManagementContent');
    const submenu = salesSubmenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <SalesManagementContent selectedSubmenu={submenu} />;
  }

  // Handle order management
  if (selectedMenu === 'order-management' || selectedMenu === 'orders' || selectedMenu === 'order' || 
      selectedMenu.startsWith('order-') || orderSubmenus.includes(selectedMenu)) {
    console.log('✅ ORDER MANAGEMENT - routing to OrderManagementContent');
    const submenu = orderSubmenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <OrderManagementContent selectedSubmenu={submenu} />;
  }

  // Handle logistics management
  if (selectedMenu === 'logistics' || selectedMenu.startsWith('shipping-') || 
      selectedMenu.startsWith('warehouse-') || selectedMenu.startsWith('courier-') ||
      logisticsSubmenus.includes(selectedMenu)) {
    console.log('✅ LOGISTICS MANAGEMENT - routing to LogisticsContent');
    const submenu = logisticsSubmenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <LogisticsContent selectedSubmenu={submenu} />;
  }

  // Handle dashboard
  if (selectedMenu === 'dashboard' || dashboardSubmenus.includes(selectedMenu)) {
    console.log('✅ Dashboard section detected');
    const submenu = dashboardSubmenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <DashboardContent selectedSubmenu={submenu} />;
  }

  // Handle product management
  if (selectedMenu === 'product-management' || selectedMenu === 'products' || 
      selectedMenu.startsWith('product-') || productSubmenus.includes(selectedMenu)) {
    console.log('✅ PRODUCT MANAGEMENT - routing to ProductManagementContent');
    const submenu = productSubmenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <ProductManagementContent selectedSubmenu={submenu} />;
  }

  // Handle customer management
  if (selectedMenu === 'customers' || selectedMenu.startsWith('customer-') || 
      customerSubmenus.includes(selectedMenu)) {
    const submenu = selectedMenu === 'customers' ? selectedSubmenu : selectedMenu;
    return <CustomerManagementContent selectedSubmenu={submenu} />;
  }

  // Handle vendor management
  if (selectedMenu === 'vendors' || selectedMenu.startsWith('vendor-') || 
      vendorSubmenus.includes(selectedMenu)) {
    const submenu = selectedMenu === 'vendors' ? selectedSubmenu : selectedMenu;
    return <VendorManagementContent selectedSubmenu={submenu} />;
  }

  // Handle marketing
  if (selectedMenu === 'marketing' || selectedMenu.startsWith('marketing-') || 
      selectedMenu.startsWith('campaigns') || selectedMenu.startsWith('promotions') || 
      selectedMenu.startsWith('email-') || marketingSubmenus.includes(selectedMenu)) {
    const submenu = selectedMenu === 'marketing' ? selectedSubmenu : selectedMenu;
    return <MarketingContent selectedSubmenu={submenu} />;
  }

  // Handle analytics
  if (selectedMenu === 'analytics' || selectedMenu.startsWith('analytics-') || 
      selectedMenu.startsWith('business-') || selectedMenu.startsWith('financial-') || 
      selectedMenu.startsWith('operational-') || analyticsSubmenus.includes(selectedMenu)) {
    const submenu = selectedMenu === 'analytics' ? selectedSubmenu : selectedMenu;
    return <AnalyticsContent selectedSubmenu={submenu} />;
  }

  // Handle payments
  if (selectedMenu === 'payments' || selectedMenu.startsWith('payment-') || 
      selectedMenu.startsWith('financial-') || paymentSubmenus.includes(selectedMenu)) {
    const submenu = selectedMenu === 'payments' ? selectedSubmenu : selectedMenu;
    return <PaymentManagementContent selectedSubmenu={submenu} />;
  }

  // Handle communications
  if (selectedMenu === 'communications' || selectedMenu.startsWith('notifications') || 
      selectedMenu.startsWith('messaging') || communicationSubmenus.includes(selectedMenu)) {
    const submenu = selectedMenu === 'communications' ? selectedSubmenu : selectedMenu;
    return <CommunicationsContent selectedSubmenu={submenu} />;
  }

  // Handle security
  if (selectedMenu === 'security' || selectedMenu.startsWith('security-') || 
      selectedMenu.startsWith('compliance') || securitySubmenus.includes(selectedMenu)) {
    const submenu = selectedMenu === 'security' ? selectedSubmenu : selectedMenu;
    return <SecurityContent selectedSubmenu={submenu} />;
  }

  // Handle settings
  if (selectedMenu === 'settings' || selectedMenu.startsWith('system-') || 
      selectedMenu.startsWith('platform-') || settingsSubmenus.includes(selectedMenu)) {
    const submenu = selectedMenu === 'settings' ? selectedSubmenu : selectedMenu;
    return <SettingsContent selectedSubmenu={submenu} />;
  }

  // Default fallback
  console.log('⚠️ No matching menu found, defaulting to dashboard overview');
  return <DashboardContent selectedSubmenu="overview" />;
};
