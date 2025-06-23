
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3,
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  Truck,
  Megaphone,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Badge,
  FileText,
  Shield,
  Globe,
  Zap,
  Activity,
  Target,
  Database,
  CreditCard
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge as BadgeComponent } from '@/components/ui/badge';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  badge?: number;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  subSubItems?: string[];
}

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
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      color: 'text-blue-600',
      subItems: [
        { id: 'overview', label: 'Overview' },
        { id: 'real-time-metrics', label: 'Real-time Metrics' },
        { id: 'platform-performance', label: 'Platform Performance' },
        { id: 'system-health', label: 'System Health' },
        { id: 'quick-actions', label: 'Quick Actions' }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      color: 'text-green-600',
      badge: 23,
      subItems: [
        {
          id: 'customer-management',
          label: 'Customer Management',
          subSubItems: ['Customer List', 'Customer Details', 'Customer Analytics', 'Account Verification', 'Customer Support']
        },
        {
          id: 'admin-users',
          label: 'Admin Users',
          subSubItems: ['Admin List', 'Role Management', 'Permissions', 'Activity Logs']
        },
        {
          id: 'user-analytics',
          label: 'User Analytics',
          subSubItems: ['Registration Trends', 'Activity Reports', 'Demographics']
        }
      ]
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management',
      icon: Store,
      color: 'text-purple-600',
      badge: 8,
      subItems: [
        {
          id: 'vendor-directory',
          label: 'Vendor Directory',
          subSubItems: ['Active Vendors', 'Pending Applications', 'Suspended Vendors', 'Vendor Search']
        },
        {
          id: 'kyc-verification',
          label: 'KYC Verification',
          subSubItems: ['Document Review', 'Trade License Verification', 'TIN Verification', 'NID Verification', 'Bank Account Verification']
        },
        {
          id: 'vendor-performance',
          label: 'Vendor Performance',
          subSubItems: ['Performance Metrics', 'Vendor Scorecard', 'Rating Management', 'Performance Reports']
        },
        {
          id: 'vendor-financial',
          label: 'Financial Management',
          subSubItems: ['Commission Tracking', 'Payout Processing', 'Revenue Sharing', 'Financial Reports']
        },
        {
          id: 'vendor-support',
          label: 'Vendor Support',
          subSubItems: ['Support Tickets', 'Training Programs', 'Resource Center']
        }
      ]
    },
    {
      id: 'product-management',
      label: 'Product Management',
      icon: Package,
      color: 'text-orange-600',
      badge: 156,
      subItems: [
        {
          id: 'product-catalog',
          label: 'Product Catalog',
          subSubItems: ['All Products', 'Product Search', 'Featured Products', 'Product Import/Export']
        },
        {
          id: 'category-management',
          label: 'Category Management',
          subSubItems: ['Category Structure', 'Category Performance', 'Seasonal Categories', 'Category Analytics']
        },
        {
          id: 'product-moderation',
          label: 'Product Moderation',
          subSubItems: ['Pending Approvals', 'Content Review', 'Quality Control', 'Rejected Products']
        },
        {
          id: 'inventory-management',
          label: 'Inventory Management',
          subSubItems: ['Stock Overview', 'Low Stock Alerts', 'Inventory Reports', 'Warehouse Management']
        },
        {
          id: 'product-analytics',
          label: 'Product Analytics',
          subSubItems: ['Best Sellers', 'Performance Metrics', 'Market Trends']
        }
      ]
    },
    {
      id: 'order-management',
      label: 'Order Management',
      icon: ShoppingCart,
      color: 'text-cyan-600',
      badge: 45,
      subItems: [
        {
          id: 'order-overview',
          label: 'Order Overview',
          subSubItems: ['All Orders', 'Order Search', 'Order Timeline', 'Bulk Actions']
        },
        {
          id: 'order-processing',
          label: 'Order Processing',
          subSubItems: ['New Orders', 'Processing Orders', 'Shipped Orders', 'Delivered Orders']
        },
        {
          id: 'payment-management',
          label: 'Payment Management',
          subSubItems: ['Payment Status', 'Payment Methods', 'Failed Payments', 'Refund Processing']
        },
        {
          id: 'shipping-logistics',
          label: 'Shipping & Logistics',
          subSubItems: ['Courier Partners', 'Delivery Tracking', 'Shipping Zones', 'Delivery Performance']
        },
        {
          id: 'order-analytics',
          label: 'Order Analytics',
          subSubItems: ['Order Reports', 'Revenue Analytics', 'Performance Metrics']
        }
      ]
    },
    {
      id: 'financial-management',
      label: 'Financial Management',
      icon: DollarSign,
      color: 'text-emerald-600',
      subItems: [
        {
          id: 'revenue-dashboard',
          label: 'Revenue Dashboard',
          subSubItems: ['Revenue Overview', 'Revenue Trends', 'Commission Summary', 'Profit Analytics']
        },
        {
          id: 'payment-gateways',
          label: 'Payment Gateways',
          subSubItems: ['bKash Integration', 'Nagad Integration', 'Rocket Integration', 'International Gateways', 'Payment Analytics']
        },
        {
          id: 'vendor-payouts',
          label: 'Vendor Payouts',
          subSubItems: ['Payout Schedule', 'Pending Payouts', 'Payout History', 'Payout Reports']
        },
        {
          id: 'financial-reports',
          label: 'Financial Reports',
          subSubItems: ['Daily Reports', 'Monthly Reports', 'Tax Reports', 'Audit Reports']
        },
        {
          id: 'transaction-monitoring',
          label: 'Transaction Monitoring',
          subSubItems: ['Transaction Logs', 'Fraud Detection', 'Security Monitoring']
        }
      ]
    },
    {
      id: 'shipping-logistics',
      label: 'Shipping & Logistics',
      icon: Truck,
      color: 'text-indigo-600',
      badge: 12,
      subItems: [
        {
          id: 'courier-partners',
          label: 'Courier Partners',
          subSubItems: ['Pathao Management', 'Paperfly Integration', 'Sundarban Coordination', 'RedX Monitoring', 'eCourier Tracking']
        },
        {
          id: 'delivery-management',
          label: 'Delivery Management',
          subSubItems: ['Delivery Zones', 'Delivery Scheduling', 'Route Optimization', 'Delivery Performance']
        },
        {
          id: 'shipping-analytics',
          label: 'Shipping Analytics',
          subSubItems: ['Delivery Reports', 'Performance Metrics', 'Cost Analysis', 'Customer Satisfaction']
        },
        {
          id: 'returns-exchanges',
          label: 'Returns & Exchanges',
          subSubItems: ['Return Requests', 'Exchange Processing', 'Refund Management', 'Return Analytics']
        }
      ]
    },
    {
      id: 'marketing-promotions',
      label: 'Marketing & Promotions',
      icon: Megaphone,
      color: 'text-pink-600',
      subItems: [
        {
          id: 'campaign-management',
          label: 'Campaign Management',
          subSubItems: ['Active Campaigns', 'Campaign Creation', 'Campaign Analytics', 'Campaign History']
        },
        {
          id: 'promotional-tools',
          label: 'Promotional Tools',
          subSubItems: ['Discount Codes', 'Flash Sales', 'Seasonal Promotions', 'Bundle Offers']
        },
        {
          id: 'content-management',
          label: 'Content Management',
          subSubItems: ['Banner Management', 'Email Templates', 'SMS Templates', 'Push Notifications']
        },
        {
          id: 'marketing-analytics',
          label: 'Marketing Analytics',
          subSubItems: ['Campaign Performance', 'Customer Acquisition', 'ROI Analysis']
        }
      ]
    },
    {
      id: 'analytics-reports',
      label: 'Analytics & Reports',
      icon: BarChart3,
      color: 'text-violet-600',
      subItems: [
        {
          id: 'business-intelligence',
          label: 'Business Intelligence',
          subSubItems: ['Executive Dashboard', 'KPI Monitoring', 'Performance Metrics', 'Trend Analysis']
        },
        {
          id: 'sales-analytics',
          label: 'Sales Analytics',
          subSubItems: ['Sales Reports', 'Product Performance', 'Vendor Performance', 'Market Analysis']
        },
        {
          id: 'customer-analytics',
          label: 'Customer Analytics',
          subSubItems: ['Customer Behavior', 'Purchase Patterns', 'Customer Segmentation', 'Retention Analysis']
        },
        {
          id: 'financial-analytics',
          label: 'Financial Analytics',
          subSubItems: ['Revenue Analysis', 'Profit Margins', 'Cost Analysis', 'Financial Forecasting']
        },
        {
          id: 'custom-reports',
          label: 'Custom Reports',
          subSubItems: ['Report Builder', 'Scheduled Reports', 'Export Options']
        }
      ]
    },
    {
      id: 'settings-configuration',
      label: 'Settings & Configuration',
      icon: Settings,
      color: 'text-gray-600',
      subItems: [
        {
          id: 'platform-settings',
          label: 'Platform Settings',
          subSubItems: ['General Settings', 'Security Settings', 'API Configuration', 'System Maintenance']
        },
        {
          id: 'payment-configuration',
          label: 'Payment Configuration',
          subSubItems: ['Gateway Settings', 'Commission Rates', 'Currency Settings', 'Tax Configuration']
        },
        {
          id: 'shipping-configuration',
          label: 'Shipping Configuration',
          subSubItems: ['Courier Settings', 'Zone Management', 'Rate Configuration', 'Delivery Options']
        },
        {
          id: 'localization',
          label: 'Localization',
          subSubItems: ['Language Settings', 'Regional Settings', 'Cultural Adaptation', 'Festival Management']
        },
        {
          id: 'system-administration',
          label: 'System Administration',
          subSubItems: ['User Roles', 'Permissions', 'Backup Management', 'System Logs']
        }
      ]
    }
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <div className={`fixed left-0 top-[70px] bottom-0 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-800">GetIt Admin</div>
              <div className="text-xs text-gray-600">Multi-Vendor Platform</div>
              <div className="text-xs text-blue-600 font-medium">v2.0.1</div>
            </div>
          </Link>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="h-[calc(100vh-140px)] overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenus.includes(item.id);
              const isActive = activeTab.startsWith(item.id);
              
              return (
                <div key={item.id} className="mb-1">
                  {/* Main Menu Item */}
                  <button
                    onClick={() => {
                      if (!collapsed) {
                        toggleMenu(item.id);
                      }
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center px-3 py-3 text-left hover:bg-gray-50 transition-all duration-200 rounded-lg group ${
                      isActive ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : item.color
                      }`} 
                    />
                    {!collapsed && (
                      <>
                        <span className="ml-3 font-medium text-sm flex-1">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <BadgeComponent className="bg-red-500 text-white text-xs px-2 py-1">
                              {item.badge}
                            </BadgeComponent>
                          )}
                          {item.subItems && (
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </button>

                  {/* Sub Menu Items */}
                  {!collapsed && item.subItems && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.id}>
                          <button
                            onClick={() => setActiveTab(`${item.id}-${subItem.id}`)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              activeTab === `${item.id}-${subItem.id}`
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                          >
                            {subItem.label}
                          </button>
                          
                          {/* Sub-Sub Items */}
                          {subItem.subSubItems && activeTab === `${item.id}-${subItem.id}` && (
                            <div className="ml-4 mt-1 space-y-1">
                              {subItem.subSubItems.map((subSubItem, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveTab(`${item.id}-${subItem.id}-${index}`)}
                                  className="w-full text-left px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded"
                                >
                                  • {subSubItem}
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
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Shield size={14} />
            <span>Admin Panel Security Enabled</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            © 2025 GetIt Bangladesh. All rights reserved.
          </div>
        </div>
      )}
    </div>
  );
};
