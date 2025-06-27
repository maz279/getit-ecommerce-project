
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
  
  // PRIORITY 1: Handle logistics and shipping submenus FIRST
  const logisticsMenus = [
    'logistics', 'shipping-management', 'warehouse-operations', 'courier-partners', 
    'shipping-rates', 'delivery-zones', 'shipping-zones', 'shipping-analytics', 
    'pick-pack-operations', 'logistics-overview', 'delivery-tracking', 'shipping-labels', 
    'return-logistics', 'delivery-performance'
  ];
  
  if (logisticsMenus.includes(selectedMenu) || logisticsMenus.includes(selectedSubmenu)) {
    console.log('✅ LOGISTICS DETECTED - routing to LogisticsContent');
    console.log('🔍 Logistics selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
    const logisticsSubmenu = logisticsMenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <LogisticsContent selectedSubmenu={logisticsSubmenu} />;
  }
  
  // PRIORITY 2: Handle vendor management submenus - EXPANDED DETECTION
  const vendorManagementMenus = [
    'vendor-directory', 'active-vendors', 'vendor-onboarding', 'vendor-verification',
    'vendor-performance', 'vendor-analytics', 'vendor-payments', 'vendor-support',
    'vendor-dashboard', 'vendor-profile', 'vendor-products', 'vendor-orders',
    'commission-management', 'vendor-reviews', 'vendor-settlements', 'vendor-kyc'
  ];
  
  if (vendorManagementMenus.includes(selectedMenu) || vendorManagementMenus.includes(selectedSubmenu)) {
    console.log('✅ VENDOR MANAGEMENT DETECTED - routing to VendorManagementContent');
    console.log('🔍 Vendor management selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
    const vendorSubmenu = vendorManagementMenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <VendorManagementContent selectedSubmenu={vendorSubmenu} />;
  }
  
  // PRIORITY 3: Handle customer management submenus
  const customerManagementMenus = [
    'all-customers', 'customer-database', 'customer-analytics', 'customer-support', 'customer-segments', 
    'vip-customers', 'customer-search', 'customer-behavior', 'purchase-history', 'loyalty-analysis', 
    'customer-lifetime-value', 'support-tickets', 'live-chat', 'feedback-reviews',
    'customer-overview', 'customer-insights', 'customer-engagement', 'customer-retention',
    'customer-acquisition', 'customer-satisfaction', 'customer-preferences', 'customer-demographics'
  ];
  
  if (customerManagementMenus.includes(selectedMenu) || customerManagementMenus.includes(selectedSubmenu)) {
    console.log('✅ CUSTOMER MANAGEMENT DETECTED - routing to CustomerManagementContent');
    console.log('🔍 Customer management selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
    const customerSubmenu = customerManagementMenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <CustomerManagementContent selectedSubmenu={customerSubmenu} />;
  }
  
  // PRIORITY 4: Handle stock-overview and inventory-related submenus
  const stockInventoryMenus = [
    'stock-overview', 'stock-management', 'inventory-overview', 'inventory-tracking', 'stock-analytics'
  ];
  
  if (stockInventoryMenus.includes(selectedMenu) || stockInventoryMenus.includes(selectedSubmenu)) {
    console.log('✅ STOCK/INVENTORY DETECTED - routing to ProductManagementContent');
    console.log('🔍 Stock/Inventory selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
    const stockSubmenu = stockInventoryMenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <ProductManagementContent selectedSubmenu={stockSubmenu} />;
  }
  
  // PRIORITY 5: Handle product moderation submenus
  const productModerationMenus = [
    'pending-approval', 'pending-approvals',
    'content-review', 'content-reviews', 
    'quality-control', 'quality-controls',
    'rejected-products', 'rejected-product',
    'product-moderation', 'product-moderations'
  ];
  
  if (productModerationMenus.includes(selectedMenu) || productModerationMenus.includes(selectedSubmenu)) {
    console.log('✅ PRODUCT MODERATION DETECTED - routing to ProductManagementContent');
    console.log('🔍 Product moderation selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
    
    // Normalize submenu to singular form for consistent routing
    let moderationSubmenu = productModerationMenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    if (moderationSubmenu === 'pending-approvals') moderationSubmenu = 'pending-approval';
    if (moderationSubmenu === 'content-reviews') moderationSubmenu = 'content-review';
    if (moderationSubmenu === 'quality-controls') moderationSubmenu = 'quality-control';
    if (moderationSubmenu === 'rejected-product') moderationSubmenu = 'rejected-products';
    if (moderationSubmenu === 'product-moderations') moderationSubmenu = 'product-moderation';
    
    console.log('🔍 Normalized moderation submenu:', moderationSubmenu);
    return <ProductManagementContent selectedSubmenu={moderationSubmenu} />;
  }

  // Handle user-management explicitly
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

  // Handle dashboard
  if (selectedMenu === 'dashboard' || dashboardSubmenus.includes(selectedMenu)) {
    console.log('✅ Dashboard section detected');
    const submenu = dashboardSubmenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <DashboardContent selectedSubmenu={submenu} />;
  }

  // Handle product management - COMPREHENSIVE DETECTION
  if (selectedMenu === 'product-management' || selectedMenu === 'products' || 
      selectedMenu.startsWith('product-') || selectedMenu.startsWith('category-') ||
      productSubmenus.includes(selectedMenu)) {
    console.log('✅ PRODUCT MANAGEMENT - routing to ProductManagementContent');
    console.log('🔍 Selected menu for product management:', selectedMenu);
    console.log('🔍 Selected submenu for product management:', selectedSubmenu);
    const submenu = productSubmenus.includes(selectedMenu) ? selectedMenu : selectedSubmenu;
    return <ProductManagementContent selectedSubmenu={submenu} />;
  }

  // Handle customer management - FALLBACK FOR REMAINING CASES
  if (selectedMenu === 'customers' || selectedMenu.startsWith('customer-') || 
      customerSubmenus.includes(selectedMenu)) {
    console.log('✅ CUSTOMER MANAGEMENT FALLBACK - routing to CustomerManagementContent');
    const submenu = selectedMenu === 'customers' ? selectedSubmenu : selectedMenu;
    return <CustomerManagementContent selectedSubmenu={submenu} />;
  }

  // Handle vendor management - FALLBACK
  if (selectedMenu === 'vendors' || selectedMenu.startsWith('vendor-') || 
      vendorSubmenus.includes(selectedMenu)) {
    console.log('✅ VENDOR MANAGEMENT FALLBACK - routing to VendorManagementContent');
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
  console.log('⚠️ Received selectedMenu:', selectedMenu, 'selectedSubmenu:', selectedSubmenu);
  return <DashboardContent selectedSubmenu="overview" />;
};
