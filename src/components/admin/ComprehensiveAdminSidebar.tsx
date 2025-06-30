import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Settings,
  Bell,
  Store,
  DollarSign,
  BarChart3,
  Shield,
  Truck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    dashboard: true,
    userManagement: false,
    customerManagement: false,
    vendorManagement: false,
    productManagement: false,
    orderManagement: false,
    salesManagement: false,
    logisticsManagement: false,
    paymentManagement: false,
    marketing: false,
    analytics: false,
    communications: false,
    security: false,
    settings: false
  });

  const toggleSection = (section: string) => {
    if (!collapsed) {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      submenu: [
        { id: 'overview', label: 'Overview' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'performance', label: 'Performance' },
        { id: 'reports', label: 'Reports' }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      color: 'text-cyan-500',
      submenu: [
        { id: 'user-overview', label: 'User Overview' },
        { id: 'active-users', label: 'Active Users' },
        { id: 'inactive-users', label: 'Inactive Users' },
        { id: 'banned-users', label: 'Banned Users' },
        { id: 'user-verification', label: 'User Verification' },
        { id: 'user-analytics', label: 'User Analytics' },
        { id: 'demographics', label: 'Demographics' },
        { id: 'registration-trends', label: 'Registration Trends' },
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
      id: 'customer-management',
      label: 'Customer Management',
      icon: UserCheck,
      color: 'text-amber-500',
      submenu: [
        { id: 'customer-overview', label: 'Customer Overview' },
        { id: 'customer-profiles', label: 'Customer Profiles' },
        { id: 'customer-segments', label: 'Customer Segments' },
        { id: 'customer-feedback', label: 'Customer Feedback' },
        { id: 'customer-support', label: 'Customer Support' },
        { id: 'loyalty-programs', label: 'Loyalty Programs' },
        { id: 'rewards-management', label: 'Rewards Management' },
        { id: 'referral-programs', label: 'Referral Programs' },
        { id: 'customer-analytics', label: 'Customer Analytics' },
        { id: 'purchase-history', label: 'Purchase History' },
        { id: 'behavioral-analysis', label: 'Behavioral Analysis' },
        { id: 'churn-prediction', label: 'Churn Prediction' },
        { id: 'crm-integration', label: 'CRM Integration' },
        { id: 'data-enrichment', label: 'Data Enrichment' },
        { id: 'compliance-management', label: 'Compliance Management' }
      ]
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management',
      icon: Store,
      color: 'text-green-500',
      submenu: [
        { id: 'vendor-directory', label: 'Vendor Directory' },
        { id: 'vendor-profiles', label: 'Vendor Profiles' },
        { id: 'vendor-onboarding', label: 'Vendor Onboarding' },
        { id: 'vendor-performance', label: 'Vendor Performance' },
        { id: 'vendor-agreements', label: 'Vendor Agreements' },
        { id: 'commission-rates', label: 'Commission Rates' },
        { id: 'payout-management', label: 'Payout Management' },
        { id: 'inventory-management', label: 'Inventory Management' },
        { id: 'quality-control', label: 'Quality Control' },
        { id: 'vendor-communication', label: 'Vendor Communication' },
        { id: 'vendor-analytics', label: 'Vendor Analytics' },
        { id: 'contract-management', label: 'Contract Management' },
        { id: 'dispute-resolution', label: 'Dispute Resolution' },
        { id: 'vendor-compliance', label: 'Vendor Compliance' },
        { id: 'vendor-settings', label: 'Vendor Settings' }
      ]
    },
    {
      id: 'product-management',
      label: 'Product Management',
      icon: Package,
      color: 'text-purple-500',
      submenu: [
        { id: 'product-catalog', label: 'Product Catalog' },
        { id: 'add-new-product', label: 'Add New Product' },
        { id: 'product-categories', label: 'Product Categories' },
        { id: 'inventory-levels', label: 'Inventory Levels' },
        { id: 'pricing-rules', label: 'Pricing Rules' },
        { id: 'discount-rules', label: 'Discount Rules' },
        { id: 'product-reviews', label: 'Product Reviews' },
        { id: 'product-analytics', label: 'Product Analytics' },
        { id: 'stock-alerts', label: 'Stock Alerts' },
        { id: 'product-bundling', label: 'Product Bundling' },
        { id: 'cross-selling', label: 'Cross-Selling' },
        { id: 'up-selling', label: 'Up-Selling' },
        { id: 'product-seo', label: 'Product SEO' },
        { id: 'content-management', label: 'Content Management' },
        { id: 'product-settings', label: 'Product Settings' }
      ]
    },
    {
      id: 'order-management',
      label: 'Order Management',
      icon: ShoppingCart,
      color: 'text-orange-500',
      submenu: [
        { id: 'order-overview', label: 'Order Overview' },
        { id: 'pending-orders', label: 'Pending Orders' },
        { id: 'processing-orders', label: 'Processing Orders' },
        { id: 'completed-orders', label: 'Completed Orders' },
        { id: 'cancelled-orders', label: 'Cancelled Orders' },
        { id: 'refund-requests', label: 'Refund Requests' },
        { id: 'shipping-management', label: 'Shipping Management' },
        { id: 'payment-processing', label: 'Payment Processing' },
        { id: 'fraud-detection', label: 'Fraud Detection' },
        { id: 'order-analytics', label: 'Order Analytics' },
        { id: 'fulfillment-centers', label: 'Fulfillment Centers' },
        { id: 'returns-management', label: 'Returns Management' },
        { id: 'customer-inquiries', label: 'Customer Inquiries' },
        { id: 'order-reports', label: 'Order Reports' },
        { id: 'order-settings', label: 'Order Settings' }
      ]
    },
    {
      id: 'sales-management',
      label: 'Sales Management',
      icon: TrendingUp,
      color: 'text-red-500',
      submenu: [
        { id: 'sales-overview', label: 'Sales Overview' },
        { id: 'sales-targets', label: 'Sales Targets' },
        { id: 'revenue-tracking', label: 'Revenue Tracking' },
        { id: 'commission-tracking', label: 'Commission Tracking' },
        { id: 'sales-forecasting', label: 'Sales Forecasting' },
        { id: 'sales-reporting', label: 'Sales Reporting' },
        { id: 'sales-team', label: 'Sales Team' },
        { id: 'performance-metrics', label: 'Performance Metrics' },
        { id: 'lead-management', label: 'Lead Management' },
        { id: 'opportunity-tracking', label: 'Opportunity Tracking' },
        { id: 'sales-automation', label: 'Sales Automation' },
        { id: 'crm-integration', label: 'CRM Integration' },
        { id: 'sales-enablement', label: 'Sales Enablement' },
        { id: 'sales-incentives', label: 'Sales Incentives' },
        { id: 'sales-settings', label: 'Sales Settings' }
      ]
    },
    {
      id: 'logistics-management',
      label: 'Logistics Management',
      icon: Truck,
      color: 'text-teal-500',
      submenu: [
        { id: 'courier-partners', label: 'Courier Partners' },
        { id: 'shipping-rates', label: 'Shipping Rates' },
        { id: 'delivery-tracking', label: 'Delivery Tracking' },
        { id: 'warehouse-management', label: 'Warehouse Management' },
        { id: 'route-optimization', label: 'Route Optimization' },
        { id: 'fleet-management', label: 'Fleet Management' },
        { id: 'returns-processing', label: 'Returns Processing' },
        { id: 'insurance-management', label: 'Insurance Management' },
        { id: 'logistics-analytics', label: 'Logistics Analytics' },
        { id: 'supply-chain', label: 'Supply Chain' },
        { id: 'customs-clearance', label: 'Customs Clearance' },
        { id: 'international-shipping', label: 'International Shipping' },
        { id: 'packaging-optimization', label: 'Packaging Optimization' },
        { id: 'sustainability', label: 'Sustainability' },
        { id: 'logistics-settings', label: 'Logistics Settings' }
      ]
    },
    {
      id: 'payment-management',
      label: 'Payment Management',
      icon: DollarSign,
      color: 'text-emerald-500',
      submenu: [
        { id: 'revenue-dashboard-payment', label: 'Revenue Dashboard' },
        { id: 'payment-gateways', label: 'Payment Gateways' },
        { id: 'transaction-monitoring', label: 'Transaction Monitoring' },
        { id: 'fraud-prevention', label: 'Fraud Prevention' },
        { id: 'refund-processing-payment', label: 'Refund Processing' },
        { id: 'tax-management', label: 'Tax Management' },
        { id: 'subscription-management', label: 'Subscription Management' },
        { id: 'billing-cycles', label: 'Billing Cycles' },
        { id: 'payment-analytics', label: 'Payment Analytics' },
        { id: 'currency-management', label: 'Currency Management' },
        { id: 'payment-security', label: 'Payment Security' },
        { id: 'compliance-reporting', label: 'Compliance Reporting' },
        { id: 'chargeback-management', label: 'Chargeback Management' },
        { id: 'payout-management-payment', label: 'Payout Management' },
        { id: 'payment-settings', label: 'Payment Settings' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: TrendingUp,
      color: 'text-pink-500',
      submenu: [
        { id: 'marketing-campaigns', label: 'Marketing Campaigns' },
        { id: 'email-marketing', label: 'Email Marketing' },
        { id: 'sms-marketing', label: 'SMS Marketing' },
        { id: 'social-media', label: 'Social Media' },
        { id: 'seo-optimization', label: 'SEO Optimization' },
        { id: 'content-marketing', label: 'Content Marketing' },
        { id: 'affiliate-marketing', label: 'Affiliate Marketing' },
        { id: 'influencer-marketing', label: 'Influencer Marketing' },
        { id: 'advertising', label: 'Advertising' },
        { id: 'promotions', label: 'Promotions' },
        { id: 'loyalty-programs-marketing', label: 'Loyalty Programs' },
        { id: 'marketing-analytics', label: 'Marketing Analytics' },
        { id: 'customer-segmentation', label: 'Customer Segmentation' },
        { id: 'marketing-automation', label: 'Marketing Automation' },
        { id: 'marketing-settings', label: 'Marketing Settings' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-indigo-500',
      submenu: [
        { id: 'business-intelligence', label: 'Business Intelligence' },
        { id: 'sales-analytics', label: 'Sales Analytics' },
        { id: 'customer-analytics-analytics', label: 'Customer Analytics' },
        { id: 'marketing-analytics-analytics', label: 'Marketing Analytics' },
        { id: 'product-analytics-analytics', label: 'Product Analytics' },
        { id: 'financial-analytics', label: 'Financial Analytics' },
        { id: 'operational-analytics', label: 'Operational Analytics' },
        { id: 'cohort-analysis', label: 'Cohort Analysis' },
        { id: 'funnel-analysis', label: 'Funnel Analysis' },
        { id: 'attribution-modeling', label: 'Attribution Modeling' },
        { id: 'predictive-analytics', label: 'Predictive Analytics' },
        { id: 'data-visualization', label: 'Data Visualization' },
        { id: 'custom-reports', label: 'Custom Reports' },
        { id: 'dashboard-customization', label: 'Dashboard Customization' },
        { id: 'analytics-settings', label: 'Analytics Settings' }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      color: 'text-sky-500',
      submenu: [
        { id: 'notifications', label: 'Notifications' },
        { id: 'email-campaigns-communications', label: 'Email Campaigns' },
        { id: 'sms-campaigns', label: 'SMS Campaigns' },
        { id: 'live-chat', label: 'Live Chat' },
        { id: 'customer-feedback-communications', label: 'Customer Feedback' },
        { id: 'announcements', label: 'Announcements' },
        { id: 'newsletters', label: 'Newsletters' },
        { id: 'in-app-messages', label: 'In-App Messages' },
        { id: 'push-notifications', label: 'Push Notifications' },
        { id: 'segmentation-communications', label: 'Segmentation' },
        { id: 'personalization', label: 'Personalization' },
        { id: 'automation-communications', label: 'Automation' },
        { id: 'analytics-communications', label: 'Analytics' },
        { id: 'integration-communications', label: 'Integration' },
        { id: 'settings-communications', label: 'Settings' }
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      color: 'text-zinc-500',
      submenu: [
        { id: 'security-monitoring', label: 'Security Monitoring' },
        { id: 'threat-detection', label: 'Threat Detection' },
        { id: 'intrusion-prevention', label: 'Intrusion Prevention' },
        { id: 'vulnerability-scanning', label: 'Vulnerability Scanning' },
        { id: 'incident-response', label: 'Incident Response' },
        { id: 'data-encryption', label: 'Data Encryption' },
        { id: 'access-control-security', label: 'Access Control' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'authorization', label: 'Authorization' },
        { id: 'audit-logs', label: 'Audit Logs' },
        { id: 'compliance-security', label: 'Compliance' },
        { id: 'security-awareness', label: 'Security Awareness' },
        { id: 'disaster-recovery', label: 'Disaster Recovery' },
        { id: 'business-continuity', label: 'Business Continuity' },
        { id: 'security-settings', label: 'Security Settings' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-500',
      submenu: [
        { id: 'system-settings', label: 'System Settings' },
        { id: 'user-settings-settings', label: 'User Settings' },
        { id: 'application-settings', label: 'Application Settings' },
        { id: 'regional-settings', label: 'Regional Settings' },
        { id: 'notification-settings', label: 'Notification Settings' },
        { id: 'api-settings', label: 'API Settings' },
        { id: 'integration-settings', label: 'Integration Settings' },
        { id: 'security-settings-settings', label: 'Security Settings' },
        { id: 'backup-settings', label: 'Backup Settings' },
        { id: 'maintenance-settings', label: 'Maintenance Settings' },
        { id: 'accessibility-settings', label: 'Accessibility Settings' },
        { id: 'performance-settings', label: 'Performance Settings' },
        { id: 'license-management', label: 'License Management' },
        { id: 'audit-settings', label: 'Audit Settings' },
        { id: 'developer-settings', label: 'Developer Settings' }
      ]
    }
  ];

  return (
    <div className={`fixed left-0 top-[125px] bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800 transition-all duration-300 z-30 shadow-lg border-r border-gray-200 ${
      collapsed ? 'w-12' : 'w-56'
    }`} style={{ height: 'calc(100vh - 125px + 144px)' }}>
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
      <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 140px)' }}>
        <ScrollArea className="h-full">
          <nav className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isMainActive = activeTab === item.id;
              const isSubmenuActive = item.submenu?.some(sub => activeTab === sub.id);
              const isActive = isMainActive || isSubmenuActive;
              
              if (hasSubmenu && !collapsed) {
                return (
                  <Collapsible
                    key={item.id}
                    open={openSections[item.id]}
                    onOpenChange={() => toggleSection(item.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2.5 mb-1 text-left hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-lg text-xs group ${
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
                          <span className="ml-2.5 font-medium">{item.label}</span>
                        </div>
                        {openSections[item.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 border-l border-gray-200">
                      {item.submenu?.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveTab(subItem.id)}
                          className={`w-full flex items-center px-3 py-2 mb-1 text-left hover:bg-white/60 transition-all duration-200 rounded-lg text-xs ${
                            activeTab === subItem.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                          }`}
                        >
                          <span className="ml-2">{subItem.label}</span>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              } else {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2.5 mb-1 text-left hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-lg text-xs group ${
                      isActive ? 'bg-white shadow-md border-l-4 border-blue-500 text-blue-700' : 'text-gray-600'
                    }`}
                  >
                    <Icon 
                      size={16} 
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : item.color
                      } group-hover:${item.color}`} 
                    />
                    {!collapsed && (
                      <span className="ml-2.5 font-medium">{item.label}</span>
                    )}
                  </button>
                );
              }
            })}
          </nav>
        </ScrollArea>
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
