
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Settings,
  FileText,
  Bell,
  Store,
  DollarSign,
  BarChart3,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Shield,
  Truck,
  CreditCard,
  MessageSquare,
  Megaphone
} from 'lucide-react';

interface ComprehensiveAdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const ComprehensiveAdminSidebar: React.FC<ComprehensiveAdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menuId: string) => {
    if (collapsed) return;
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleMenuClick = (menuId: string, hasSubmenu: boolean = false) => {
    if (hasSubmenu && !collapsed) {
      toggleMenu(menuId);
    }
    setActiveTab(menuId);
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      submenu: [
        { id: 'overview', label: 'Overview' },
        { id: 'dashboard-analytics', label: 'Analytics Dashboard' },
        { id: 'real-time-metrics', label: 'Real-time Metrics' },
        { id: 'kpi-monitoring', label: 'KPI Monitoring' },
        { id: 'performance-insights', label: 'Performance Insights' }
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      color: 'text-cyan-500',
      submenu: [
        { id: 'user-overview', label: 'User Overview' },
        { id: 'active-users', label: 'Active Users' },
        { id: 'inactive-users', label: 'Inactive Users' },
        { id: 'banned-users', label: 'Banned Users' },
        { id: 'user-verification', label: 'User Verification' },
        { id: 'demographics', label: 'Demographics' },
        { id: 'registration-trends', label: 'Registration Trends' },
        { id: 'user-analytics', label: 'User Analytics' },
        { id: 'role-management', label: 'Role Management' },
        { id: 'permissions-management', label: 'Permissions Management' },
        { id: 'access-control', label: 'Access Control' },
        { id: 'activity-logs', label: 'Activity Logs' },
        { id: 'activity-reports', label: 'Activity Reports' },
        { id: 'user-settings', label: 'User Settings' },
        { id: 'admin-list-management', label: 'Admin List Management' }
      ]
    },
    {
      id: 'sales',
      label: 'Sales Management',
      icon: TrendingUp,
      color: 'text-green-500',
      submenu: [
        { id: 'sales-overview', label: 'Sales Overview' },
        { id: 'daily-sales', label: 'Daily Sales' },
        { id: 'monthly-trends', label: 'Monthly Trends' },
        { id: 'yearly-reports', label: 'Yearly Reports' },
        { id: 'sales-forecast', label: 'Sales Forecast' },
        { id: 'revenue-analytics', label: 'Revenue Analytics' },
        { id: 'revenue-dashboard', label: 'Revenue Dashboard' },
        { id: 'profit-margins', label: 'Profit Margins' },
        { id: 'cost-analysis', label: 'Cost Analysis' },
        { id: 'roi-tracking', label: 'ROI Tracking' },
        { id: 'sales-reports', label: 'Sales Reports' },
        { id: 'detailed-reports', label: 'Detailed Reports' },
        { id: 'comparative-analysis', label: 'Comparative Analysis' },
        { id: 'export-data', label: 'Export Data' }
      ]
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: ShoppingCart,
      color: 'text-orange-500',
      submenu: [
        { id: 'order-overview', label: 'Order Overview' },
        { id: 'all-orders', label: 'All Orders' },
        { id: 'new-orders', label: 'New Orders' },
        { id: 'processing-orders', label: 'Processing Orders' },
        { id: 'shipped-orders', label: 'Shipped Orders' },
        { id: 'delivered-orders', label: 'Delivered Orders' },
        { id: 'order-tracking', label: 'Order Tracking' },
        { id: 'order-processing', label: 'Order Processing' },
        { id: 'bulk-actions', label: 'Bulk Actions' },
        { id: 'order-reports', label: 'Order Reports' },
        { id: 'performance-metrics', label: 'Performance Metrics' },
        { id: 'payment-status', label: 'Payment Status' },
        { id: 'payment-methods', label: 'Payment Methods' },
        { id: 'failed-payments', label: 'Failed Payments' },
        { id: 'refund-processing', label: 'Refund Processing' }
      ]
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: Package,
      color: 'text-purple-500',
      submenu: [
        { id: 'product-catalog-overview', label: 'Product Catalog Overview' },
        { id: 'all-products', label: 'All Products' },
        { id: 'featured-products', label: 'Featured Products' },
        { id: 'best-sellers', label: 'Best Sellers' },
        { id: 'product-search', label: 'Product Search' },
        { id: 'category-structure', label: 'Category Structure' },
        { id: 'category-analytics', label: 'Category Analytics' },
        { id: 'pending-approval', label: 'Pending Approval' },
        { id: 'rejected-products', label: 'Rejected Products' },
        { id: 'content-review', label: 'Content Review' },
        { id: 'quality-control', label: 'Quality Control' },
        { id: 'inventory-management-overview', label: 'Inventory Management Overview' },
        { id: 'stock-overview', label: 'Stock Overview' },
        { id: 'low-stock-alerts', label: 'Low Stock Alerts' },
        { id: 'warehouse-management', label: 'Warehouse Management' },
        { id: 'inventory-reports', label: 'Inventory Reports' },
        { id: 'product-import-export', label: 'Product Import/Export' },
        { id: 'market-trends', label: 'Market Trends' }
      ]
    },
    {
      id: 'customers',
      label: 'Customer Management',
      icon: UserCheck,
      color: 'text-indigo-500',
      submenu: [
        { id: 'customer-overview', label: 'Customer Overview' },
        { id: 'all-customers', label: 'All Customers' },
        { id: 'vip-customers', label: 'VIP Customers' },
        { id: 'customer-segments', label: 'Customer Segments' },
        { id: 'customer-search', label: 'Customer Search' },
        { id: 'customer-analytics', label: 'Customer Analytics' },
        { id: 'customer-behavior', label: 'Customer Behavior' },
        { id: 'purchase-history', label: 'Purchase History' },
        { id: 'clv', label: 'Customer Lifetime Value' },
        { id: 'loyalty-analysis', label: 'Loyalty Analysis' },
        { id: 'customer-support', label: 'Customer Support' },
        { id: 'live-chat', label: 'Live Chat' },
        { id: 'feedback-reviews', label: 'Feedback & Reviews' }
      ]
    },
    {
      id: 'vendors',
      label: 'Vendor Management',
      icon: Store,
      color: 'text-emerald-500',
      submenu: [
        { id: 'vendor-overview', label: 'Vendor Overview' },
        { id: 'active-vendors', label: 'Active Vendors' },
        { id: 'pending-applications', label: 'Pending Applications' },
        { id: 'suspended-vendors', label: 'Suspended Vendors' },
        { id: 'vendor-directory', label: 'Vendor Directory' },
        { id: 'vendor-search', label: 'Vendor Search' },
        { id: 'vendor-analytics', label: 'Vendor Analytics' },
        { id: 'vendor-performance', label: 'Vendor Performance' },
        { id: 'vendor-performance-metrics', label: 'Vendor Performance Metrics' },
        { id: 'vendor-performance-reports', label: 'Vendor Performance Reports' },
        { id: 'vendor-scorecard', label: 'Vendor Scorecard' },
        { id: 'rating-management', label: 'Rating Management' },
        { id: 'vendor-onboarding', label: 'Vendor Onboarding' },
        { id: 'vendor-verification', label: 'Vendor Verification' },
        { id: 'nid-verification', label: 'NID Verification' },
        { id: 'tin-verification', label: 'TIN Verification' },
        { id: 'trade-license-verification', label: 'Trade License Verification' },
        { id: 'bank-account-verification', label: 'Bank Account Verification' },
        { id: 'document-review', label: 'Document Review' },
        { id: 'vendor-payments', label: 'Vendor Payments' },
        { id: 'payout-processing', label: 'Payout Processing' },
        { id: 'commission-tracking', label: 'Commission Tracking' },
        { id: 'revenue-sharing', label: 'Revenue Sharing' },
        { id: 'vendor-support', label: 'Vendor Support' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Megaphone,
      color: 'text-pink-500',
      submenu: [
        { id: 'marketing-overview', label: 'Marketing Overview' },
        { id: 'campaigns', label: 'Campaigns' },
        { id: 'promotions', label: 'Promotions' },
        { id: 'discount-management', label: 'Discount Management' },
        { id: 'coupon-management', label: 'Coupon Management' },
        { id: 'email-marketing', label: 'Email Marketing' },
        { id: 'sms-marketing', label: 'SMS Marketing' },
        { id: 'push-notifications', label: 'Push Notifications' },
        { id: 'social-media', label: 'Social Media' },
        { id: 'content-management', label: 'Content Management' },
        { id: 'seo-optimization', label: 'SEO Optimization' },
        { id: 'affiliate-program', label: 'Affiliate Program' },
        { id: 'referral-program', label: 'Referral Program' },
        { id: 'loyalty-program', label: 'Loyalty Program' },
        { id: 'marketing-analytics', label: 'Marketing Analytics' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-yellow-500',
      submenu: [
        { id: 'analytics-overview', label: 'Analytics Overview' },
        { id: 'traffic-analytics', label: 'Traffic Analytics' },
        { id: 'conversion-analytics', label: 'Conversion Analytics' },
        { id: 'behavior-analytics', label: 'Behavior Analytics' },
        { id: 'funnel-analysis', label: 'Funnel Analysis' },
        { id: 'cohort-analysis', label: 'Cohort Analysis' },
        { id: 'a-b-testing', label: 'A/B Testing' },
        { id: 'heatmaps', label: 'Heatmaps' },
        { id: 'user-journey', label: 'User Journey' },
        { id: 'predictive-analytics', label: 'Predictive Analytics' },
        { id: 'custom-reports', label: 'Custom Reports' },
        { id: 'data-visualization', label: 'Data Visualization' },
        { id: 'export-analytics', label: 'Export Analytics' }
      ]
    },
    {
      id: 'financials',
      label: 'Payment Management',
      icon: CreditCard,
      color: 'text-teal-500',
      submenu: [
        { id: 'payment-overview', label: 'Payment Overview' },
        { id: 'payment-processing', label: 'Payment Processing' },
        { id: 'payment-gateways', label: 'Payment Gateways' },
        { id: 'payment-methods', label: 'Payment Methods' },
        { id: 'transaction-history', label: 'Transaction History' },
        { id: 'failed-transactions', label: 'Failed Transactions' },
        { id: 'refunds-chargebacks', label: 'Refunds & Chargebacks' },
        { id: 'payment-disputes', label: 'Payment Disputes' },
        { id: 'payment-analytics', label: 'Payment Analytics' },
        { id: 'fraud-detection', label: 'Fraud Detection' },
        { id: 'compliance-reporting', label: 'Compliance Reporting' },
        { id: 'tax-management', label: 'Tax Management' },
        { id: 'financial-reports', label: 'Financial Reports' }
      ]
    },
    {
      id: 'logistics',
      label: 'Logistics',
      icon: Truck,
      color: 'text-amber-500',
      submenu: [
        { id: 'logistics-overview', label: 'Logistics Overview' },
        { id: 'delivery-tracking', label: 'Delivery Tracking' },
        { id: 'delivery-performance', label: 'Delivery Performance' },
        { id: 'courier-partners', label: 'Courier Partners' },
        { id: 'shipping-zones', label: 'Shipping Zones' },
        { id: 'shipping-rates', label: 'Shipping Rates' },
        { id: 'warehouse-management', label: 'Warehouse Management' },
        { id: 'inventory-tracking', label: 'Inventory Tracking' },
        { id: 'route-optimization', label: 'Route Optimization' },
        { id: 'delivery-analytics', label: 'Delivery Analytics' }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      color: 'text-rose-500',
      submenu: [
        { id: 'communications-overview', label: 'Communications Overview' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'email-templates', label: 'Email Templates' },
        { id: 'sms-templates', label: 'SMS Templates' },
        { id: 'push-notifications', label: 'Push Notifications' },
        { id: 'broadcast-messages', label: 'Broadcast Messages' },
        { id: 'automated-messages', label: 'Automated Messages' },
        { id: 'message-analytics', label: 'Message Analytics' }
      ]
    },
    {
      id: 'security',
      label: 'Security & Compliance',
      icon: Shield,
      color: 'text-red-500',
      submenu: [
        { id: 'security-overview', label: 'Security Overview' },
        { id: 'security-monitoring', label: 'Security Monitoring' },
        { id: 'threat-detection', label: 'Threat Detection' },
        { id: 'fraud-prevention', label: 'Fraud Prevention' },
        { id: 'access-logs', label: 'Access Logs' },
        { id: 'security-alerts', label: 'Security Alerts' },
        { id: 'compliance', label: 'Compliance' },
        { id: 'data-protection', label: 'Data Protection' },
        { id: 'privacy-settings', label: 'Privacy Settings' },
        { id: 'audit-trails', label: 'Audit Trails' },
        { id: 'compliance-reports', label: 'Compliance Reports' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-500',
      submenu: [
        { id: 'system-settings', label: 'System Settings' },
        { id: 'general-settings', label: 'General Settings' },
        { id: 'user-management-settings', label: 'User Management Settings' },
        { id: 'role-permissions-settings', label: 'Role & Permissions Settings' },
        { id: 'api-configuration', label: 'API Configuration' },
        { id: 'platform-configuration', label: 'Platform Configuration' },
        { id: 'store-settings', label: 'Store Settings' },
        { id: 'payment-configuration', label: 'Payment Configuration' },
        { id: 'shipping-configuration', label: 'Shipping Configuration' },
        { id: 'tax-settings', label: 'Tax Settings' }
      ]
    }
  ];

  return (
    <div className={`fixed left-0 top-[125px] bottom-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800 transition-all duration-300 z-30 shadow-lg border-r border-gray-200 ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="font-bold text-sm text-gray-700">GETIT Admin</span>
          </Link>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 h-[calc(100vh-180px)] overflow-hidden">
        <div 
          className="h-full overflow-y-auto pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
          
          <nav className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isExpanded = expandedMenus[item.id];
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              
              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => handleMenuClick(item.id, hasSubmenu)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-lg text-xs group ${
                      isActive ? 'bg-white shadow-md border-l-4 border-blue-500 text-blue-700' : 'text-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon 
                        size={16} 
                        className={`flex-shrink-0 transition-colors ${
                          isActive ? 'text-blue-600' : item.color
                        } group-hover:${item.color}`} 
                      />
                      {!collapsed && (
                        <span className="ml-2.5 font-medium">{item.label}</span>
                      )}
                    </div>
                    {!collapsed && hasSubmenu && (
                      <div className="flex-shrink-0 ml-2">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    )}
                  </button>

                  {/* Submenu */}
                  {!collapsed && hasSubmenu && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveTab(subItem.id)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                            activeTab === subItem.id
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 shadow-sm border border-gray-200">
            <div className="text-xs text-gray-500">Admin Panel v2.0</div>
            <div className="text-xs text-gray-600 mt-0.5 font-medium">GETIT Bangladesh</div>
          </div>
        </div>
      )}
    </div>
  );
};
