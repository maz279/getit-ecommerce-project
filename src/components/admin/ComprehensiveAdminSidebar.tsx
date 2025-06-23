import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Settings,
  Store,
  Truck,
  Megaphone,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  Activity,
  Shield,
  FileText,
  CreditCard,
  MapPin,
  Bell,
  Award,
  TrendingUp,
  UserCheck,
  Clipboard,
  Target,
  Database,
  Globe,
  Zap
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ComprehensiveAdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  color: string;
  badge?: number;
  children?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  badge?: number;
  children?: SubSubMenuItem[];
}

interface SubSubMenuItem {
  id: string;
  label: string;
  badge?: number;
}

export const ComprehensiveAdminSidebar: React.FC<ComprehensiveAdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['dashboard']));

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      children: [
        { id: 'overview', label: 'Overview' },
        { id: 'analytics', label: 'Analytics Dashboard' },
        { id: 'real-time-metrics', label: 'Real-time Metrics' },
        { id: 'kpi-monitoring', label: 'KPI Monitoring' },
        { id: 'performance-insights', label: 'Performance Insights' }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      color: 'text-green-600',
      badge: 34,
      children: [
        {
          id: 'customer-management',
          label: 'Customer Management',
          badge: 12,
          children: [
            { id: 'customer-list', label: 'Customer List' },
            { id: 'customer-details', label: 'Customer Details' },
            { id: 'customer-analytics', label: 'Customer Analytics' },
            { id: 'account-verification', label: 'Account Verification', badge: 8 },
            { id: 'customer-support', label: 'Customer Support', badge: 4 }
          ]
        },
        {
          id: 'admin-users',
          label: 'Admin Users',
          children: [
            { id: 'admin-list', label: 'Admin List' },
            { id: 'role-management', label: 'Role Management' },
            { id: 'permissions', label: 'Permissions' },
            { id: 'activity-logs', label: 'Activity Logs' }
          ]
        },
        {
          id: 'user-analytics',
          label: 'User Analytics',
          children: [
            { id: 'registration-trends', label: 'Registration Trends' },
            { id: 'activity-reports', label: 'Activity Reports' },
            { id: 'demographics', label: 'Demographics' }
          ]
        }
      ]
    },
    {
      id: 'sales',
      label: 'Sales Management',
      icon: TrendingUp,
      color: 'text-green-600',
      badge: 45,
      children: [
        {
          id: 'sales-overview',
          label: 'Sales Overview',
          children: [
            { id: 'daily-sales', label: 'Daily Sales' },
            { id: 'monthly-trends', label: 'Monthly Trends' },
            { id: 'yearly-reports', label: 'Yearly Reports' },
            { id: 'sales-forecast', label: 'Sales Forecast' }
          ]
        },
        {
          id: 'revenue-analytics',
          label: 'Revenue Analytics',
          children: [
            { id: 'revenue-dashboard', label: 'Revenue Dashboard' },
            { id: 'profit-margins', label: 'Profit Margins' },
            { id: 'cost-analysis', label: 'Cost Analysis' },
            { id: 'roi-tracking', label: 'ROI Tracking' }
          ]
        },
        {
          id: 'sales-reports',
          label: 'Sales Reports',
          children: [
            { id: 'detailed-reports', label: 'Detailed Reports' },
            { id: 'comparative-analysis', label: 'Comparative Analysis' },
            { id: 'export-data', label: 'Export Data' }
          ]
        }
      ]
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: ShoppingCart,
      color: 'text-purple-600',
      badge: 128,
      children: [
        {
          id: 'order-processing',
          label: 'Order Processing',
          badge: 67,
          children: [
            { id: 'new-orders', label: 'New Orders', badge: 23 },
            { id: 'pending-orders', label: 'Pending Orders', badge: 15 },
            { id: 'confirmed-orders', label: 'Confirmed Orders', badge: 29 },
            { id: 'shipped-orders', label: 'Shipped Orders' },
            { id: 'delivered-orders', label: 'Delivered Orders' }
          ]
        },
        {
          id: 'order-tracking',
          label: 'Order Tracking',
          children: [
            { id: 'live-tracking', label: 'Live Tracking' },
            { id: 'delivery-status', label: 'Delivery Status' },
            { id: 'shipment-updates', label: 'Shipment Updates' }
          ]
        },
        {
          id: 'returns-refunds',
          label: 'Returns & Refunds',
          badge: 12,
          children: [
            { id: 'return-requests', label: 'Return Requests', badge: 8 },
            { id: 'refund-processing', label: 'Refund Processing', badge: 4 },
            { id: 'exchange-requests', label: 'Exchange Requests' }
          ]
        }
      ]
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: Package,
      color: 'text-orange-600',
      badge: 89,
      children: [
        {
          id: 'product-catalog',
          label: 'Product Catalog',
          children: [
            { id: 'all-products', label: 'All Products' },
            { id: 'add-product', label: 'Add New Product' },
            { id: 'bulk-upload', label: 'Bulk Upload' },
            { id: 'product-categories', label: 'Categories' }
          ]
        },
        {
          id: 'inventory-management',
          label: 'Inventory Management',
          badge: 25,
          children: [
            { id: 'stock-levels', label: 'Stock Levels' },
            { id: 'low-stock-alerts', label: 'Low Stock Alerts', badge: 15 },
            { id: 'reorder-points', label: 'Reorder Points' },
            { id: 'warehouse-management', label: 'Warehouse Management' }
          ]
        }
      ]
    },
    {
      id: 'customers',
      label: 'Customer Management',
      icon: Users,
      color: 'text-cyan-600',
      badge: 156,
      children: [
        {
          id: 'customer-database',
          label: 'Customer Database',
          children: [
            { id: 'all-customers', label: 'All Customers' },
            { id: 'customer-segments', label: 'Customer Segments' },
            { id: 'vip-customers', label: 'VIP Customers' },
            { id: 'customer-search', label: 'Customer Search' }
          ]
        },
        {
          id: 'customer-analytics',
          label: 'Customer Analytics',
          children: [
            { id: 'customer-behavior', label: 'Customer Behavior' },
            { id: 'purchase-history', label: 'Purchase History' },
            { id: 'loyalty-analysis', label: 'Loyalty Analysis' },
            { id: 'customer-lifetime-value', label: 'Customer Lifetime Value' }
          ]
        },
        {
          id: 'customer-support',
          label: 'Customer Support',
          badge: 34,
          children: [
            { id: 'support-tickets', label: 'Support Tickets', badge: 18 },
            { id: 'live-chat', label: 'Live Chat', badge: 16 },
            { id: 'feedback-reviews', label: 'Feedback & Reviews' }
          ]
        }
      ]
    },
    {
      id: 'vendors',
      label: 'Vendor Management',
      icon: Store,
      color: 'text-indigo-600',
      badge: 78,
      children: [
        {
          id: 'vendor-directory',
          label: 'Vendor Directory',
          children: [
            { id: 'all-vendors', label: 'All Vendors' },
            { id: 'vendor-onboarding', label: 'Vendor Onboarding' },
            { id: 'vendor-verification', label: 'Vendor Verification', badge: 12 },
            { id: 'vendor-performance', label: 'Vendor Performance' }
          ]
        },
        {
          id: 'vendor-analytics',
          label: 'Vendor Analytics',
          children: [
            { id: 'vendor-sales', label: 'Vendor Sales' },
            { id: 'commission-tracking', label: 'Commission Tracking' },
            { id: 'payout-management', label: 'Payout Management' },
            { id: 'vendor-ratings', label: 'Vendor Ratings' }
          ]
        }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing & Promotions',
      icon: Target,
      color: 'text-pink-600',
      children: [
        {
          id: 'campaigns',
          label: 'Marketing Campaigns',
          children: [
            { id: 'active-campaigns', label: 'Active Campaigns' },
            { id: 'create-campaign', label: 'Create Campaign' },
            { id: 'campaign-analytics', label: 'Campaign Analytics' },
            { id: 'a-b-testing', label: 'A/B Testing' }
          ]
        },
        {
          id: 'promotions',
          label: 'Promotions & Discounts',
          children: [
            { id: 'discount-codes', label: 'Discount Codes' },
            { id: 'flash-sales', label: 'Flash Sales' },
            { id: 'seasonal-offers', label: 'Seasonal Offers' },
            { id: 'bundle-deals', label: 'Bundle Deals' }
          ]
        },
        {
          id: 'email-marketing',
          label: 'Email Marketing',
          children: [
            { id: 'email-campaigns', label: 'Email Campaigns' },
            { id: 'newsletter-management', label: 'Newsletter Management' },
            { id: 'automated-emails', label: 'Automated Emails' }
          ]
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      color: 'text-emerald-600',
      children: [
        {
          id: 'business-intelligence',
          label: 'Business Intelligence',
          children: [
            { id: 'executive-dashboard', label: 'Executive Dashboard' },
            { id: 'key-metrics', label: 'Key Metrics' },
            { id: 'trend-analysis', label: 'Trend Analysis' },
            { id: 'predictive-analytics', label: 'Predictive Analytics' }
          ]
        },
        {
          id: 'financial-reports',
          label: 'Financial Reports',
          children: [
            { id: 'profit-loss', label: 'Profit & Loss' },
            { id: 'cash-flow', label: 'Cash Flow' },
            { id: 'tax-reports', label: 'Tax Reports' },
            { id: 'audit-reports', label: 'Audit Reports' }
          ]
        },
        {
          id: 'operational-reports',
          label: 'Operational Reports',
          children: [
            { id: 'inventory-reports', label: 'Inventory Reports' },
            { id: 'shipping-reports', label: 'Shipping Reports' },
            { id: 'performance-reports', label: 'Performance Reports' }
          ]
        }
      ]
    },
    {
      id: 'payments',
      label: 'Payment Management',
      icon: CreditCard,
      color: 'text-yellow-600',
      children: [
        {
          id: 'payment-processing',
          label: 'Payment Processing',
          children: [
            { id: 'transaction-monitoring', label: 'Transaction Monitoring' },
            { id: 'payment-gateways', label: 'Payment Gateways' },
            { id: 'failed-payments', label: 'Failed Payments', badge: 8 },
            { id: 'payment-analytics', label: 'Payment Analytics' }
          ]
        },
        {
          id: 'financial-management',
          label: 'Financial Management',
          children: [
            { id: 'revenue-tracking', label: 'Revenue Tracking' },
            { id: 'expense-management', label: 'Expense Management' },
            { id: 'budget-planning', label: 'Budget Planning' },
            { id: 'financial-forecasting', label: 'Financial Forecasting' }
          ]
        }
      ]
    },
    {
      id: 'logistics',
      label: 'Logistics & Shipping',
      icon: Truck,
      color: 'text-blue-500',
      children: [
        {
          id: 'shipping-management',
          label: 'Shipping Management',
          children: [
            { id: 'courier-partners', label: 'Courier Partners' },
            { id: 'shipping-rates', label: 'Shipping Rates' },
            { id: 'delivery-zones', label: 'Delivery Zones' },
            { id: 'shipping-analytics', label: 'Shipping Analytics' }
          ]
        },
        {
          id: 'warehouse-operations',
          label: 'Warehouse Operations',
          children: [
            { id: 'warehouse-management', label: 'Warehouse Management' },
            { id: 'pick-pack-operations', label: 'Pick & Pack Operations' },
            { id: 'quality-control', label: 'Quality Control' }
          ]
        }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: Bell,
      color: 'text-teal-600',
      badge: 42,
      children: [
        {
          id: 'notifications',
          label: 'Notifications',
          badge: 28,
          children: [
            { id: 'system-notifications', label: 'System Notifications', badge: 15 },
            { id: 'push-notifications', label: 'Push Notifications' },
            { id: 'email-notifications', label: 'Email Notifications', badge: 13 },
            { id: 'sms-notifications', label: 'SMS Notifications' }
          ]
        },
        {
          id: 'messaging',
          label: 'Messaging',
          badge: 14,
          children: [
            { id: 'customer-messages', label: 'Customer Messages', badge: 9 },
            { id: 'vendor-communications', label: 'Vendor Communications', badge: 5 },
            { id: 'broadcast-messages', label: 'Broadcast Messages' }
          ]
        }
      ]
    },
    {
      id: 'security',
      label: 'Security & Compliance',
      icon: Shield,
      color: 'text-red-600',
      children: [
        {
          id: 'security-monitoring',
          label: 'Security Monitoring',
          children: [
            { id: 'threat-detection', label: 'Threat Detection' },
            { id: 'fraud-prevention', label: 'Fraud Prevention' },
            { id: 'access-logs', label: 'Access Logs' },
            { id: 'security-alerts', label: 'Security Alerts' }
          ]
        },
        {
          id: 'compliance',
          label: 'Compliance',
          children: [
            { id: 'data-protection', label: 'Data Protection' },
            { id: 'privacy-settings', label: 'Privacy Settings' },
            { id: 'audit-trails', label: 'Audit Trails' },
            { id: 'compliance-reports', label: 'Compliance Reports' }
          ]
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings & Configuration',
      icon: Settings,
      color: 'text-gray-600',
      children: [
        {
          id: 'system-settings',
          label: 'System Settings',
          children: [
            { id: 'general-settings', label: 'General Settings' },
            { id: 'user-management', label: 'User Management' },
            { id: 'role-permissions', label: 'Role & Permissions' },
            { id: 'api-configuration', label: 'API Configuration' }
          ]
        },
        {
          id: 'platform-configuration',
          label: 'Platform Configuration',
          children: [
            { id: 'store-settings', label: 'Store Settings' },
            { id: 'payment-configuration', label: 'Payment Configuration' },
            { id: 'shipping-configuration', label: 'Shipping Configuration' },
            { id: 'tax-settings', label: 'Tax Settings' }
          ]
        }
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isExpanded = expandedMenus.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              setActiveTab(item.id);
            }
          }}
          className={`w-full flex items-center px-3 py-2.5 text-left hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-lg text-xs group ${
            activeTab === item.id ? 'bg-white shadow-md border-l-4 border-blue-500 text-blue-700' : 'text-gray-600'
          }`}
        >
          <Icon 
            size={20} 
            className={`flex-shrink-0 transition-colors ${
              activeTab === item.id ? 'text-blue-600' : item.color
            } group-hover:${item.color}`} 
          />
          {!collapsed && (
            <>
              <span className="ml-3 font-medium flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-5 flex items-center justify-center ml-2">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                isExpanded ? <ChevronUp size={14} className="ml-2" /> : <ChevronDown size={14} className="ml-2" />
              )}
            </>
          )}
        </button>

        {/* Sub-menu items */}
        {!collapsed && hasChildren && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children?.map((subItem) => (
              <div key={subItem.id}>
                <button
                  onClick={() => {
                    if (subItem.children && subItem.children.length > 0) {
                      toggleMenu(subItem.id);
                    } else {
                      setActiveTab(subItem.id);
                    }
                  }}
                  className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 transition-all duration-200 rounded-md text-xs ${
                    activeTab === subItem.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                  }`}
                >
                  <span className="flex-1">{subItem.label}</span>
                  {subItem.badge && (
                    <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[16px] h-4 flex items-center justify-center ml-2">
                      {subItem.badge}
                    </Badge>
                  )}
                  {subItem.children && subItem.children.length > 0 && (
                    expandedMenus.has(subItem.id) ? <ChevronUp size={12} className="ml-2" /> : <ChevronDown size={12} className="ml-2" />
                  )}
                </button>

                {/* Sub-sub-menu items */}
                {subItem.children && subItem.children.length > 0 && expandedMenus.has(subItem.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {subItem.children.map((subSubItem) => (
                      <button
                        key={subSubItem.id}
                        onClick={() => setActiveTab(subSubItem.id)}
                        className={`w-full flex items-center px-3 py-1.5 text-left hover:bg-gray-100 transition-all duration-200 rounded-md text-xs ${
                          activeTab === subSubItem.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500'
                        }`}
                      >
                        <span className="flex-1">{subSubItem.label}</span>
                        {subSubItem.badge && (
                          <Badge className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full min-w-[14px] h-3.5 flex items-center justify-center ml-2">
                            {subSubItem.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed left-0 top-[120px] bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800 transition-all duration-300 z-30 shadow-lg border-r border-gray-200 ${
      collapsed ? 'w-16' : 'w-80'
    }`} style={{ bottom: '-360px', height: 'calc(100vh + 360px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🏪</span>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-800">GetIt Admin</span>
              <div className="text-xs text-gray-500">Multi-Vendor Platform</div>
              <div className="text-xs text-blue-600 font-medium">v2.0.1</div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh + 200px)' }}>
        <ScrollArea className="h-full">
          <nav className="p-3">
            {menuItems.map(renderMenuItem)}
          </nav>
        </ScrollArea>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute left-4 right-4" style={{ bottom: '20px' }}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="text-xs text-gray-600 font-medium">System Status</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-green-600 font-medium">All Systems Operational</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Last updated: 2 min ago</div>
          </div>
        </div>
      )}
    </div>
  );
};
