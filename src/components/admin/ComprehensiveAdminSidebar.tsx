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
  CreditCard,
  Bell,
  MessageSquare,
  Eye,
  Lock,
  AlertTriangle,
  HardDrive,
  Webhook,
  Scale,
  Headphones,
  Calendar,
  Image,
  Mail,
  Phone,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  Server,
  Wifi,
  Cloud,
  Menu
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  badge?: number;
  priority?: 'high' | 'medium' | 'low';
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  badge?: number;
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
      priority: 'high',
      subItems: [
        { id: 'overview', label: 'Overview' },
        { id: 'real-time-metrics', label: 'Real-time Metrics', badge: 3 },
        { id: 'revenue-analytics', label: 'Revenue Analytics' },
        { id: 'user-activity', label: 'User Activity', badge: 2 },
        { id: 'vendor-performance', label: 'Vendor Performance' },
        { id: 'order-insights', label: 'Order Insights' },
        { id: 'inventory-alerts', label: 'Inventory Alerts', badge: 8 },
        { id: 'platform-performance', label: 'Platform Performance' },
        { id: 'system-health', label: 'System Health' },
        { id: 'security-monitoring', label: 'Security Monitoring', badge: 1 },
        { id: 'system-logs', label: 'System Logs' },
        { id: 'quick-actions', label: 'Quick Actions' },
        { id: 'executive-summary', label: 'Executive Summary' }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      color: 'text-red-600',
      badge: 45,
      priority: 'high',
      subItems: [
        {
          id: 'notification-center',
          label: 'Notification Center',
          badge: 12,
          subSubItems: ['System Alerts', 'User Notifications', 'Order Updates', 'Payment Alerts', 'Security Warnings']
        },
        {
          id: 'alert-management',
          label: 'Alert Management',
          subSubItems: ['Alert Rules', 'Escalation Policies', 'Alert History', 'Maintenance Windows']
        },
        {
          id: 'communication',
          label: 'Communication',
          subSubItems: ['Announcements', 'Broadcast Messages', 'User Messaging', 'Email Campaigns']
        },
        {
          id: 'notification-settings',
          label: 'Settings',
          subSubItems: ['Notification Preferences', 'Delivery Channels', 'Templates', 'Schedule Rules']
        }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      color: 'text-green-600',
      badge: 23,
      priority: 'high',
      subItems: [
        {
          id: 'customer-management',
          label: 'Customer Management',
          badge: 8,
          subSubItems: ['Customer List', 'Customer Details', 'Customer Analytics', 'Account Verification', 'Customer Support', 'Loyalty Programs']
        },
        {
          id: 'admin-users',
          label: 'Admin Users',
          subSubItems: ['Admin List', 'Role Management', 'Permissions', 'Activity Logs', 'Access Control']
        },
        {
          id: 'user-analytics',
          label: 'User Analytics',
          subSubItems: ['Registration Trends', 'Activity Reports', 'Demographics', 'Behavior Analysis', 'Retention Metrics']
        },
        {
          id: 'user-verification',
          label: 'User Verification',
          subSubItems: ['KYC Documents', 'Identity Verification', 'Phone Verification', 'Email Verification']
        }
      ]
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management',
      icon: Store,
      color: 'text-purple-600',
      badge: 15,
      priority: 'high',
      subItems: [
        {
          id: 'vendor-directory',
          label: 'Vendor Directory',
          badge: 5,
          subSubItems: ['Active Vendors', 'Pending Applications', 'Suspended Vendors', 'Vendor Search', 'Vendor Categories']
        },
        {
          id: 'kyc-verification',
          label: 'KYC Verification',
          badge: 8,
          subSubItems: ['Document Review', 'Trade License Verification', 'TIN Verification', 'NID Verification', 'Bank Account Verification', 'Business Address Verification']
        },
        {
          id: 'vendor-performance',
          label: 'Vendor Performance',
          subSubItems: ['Performance Metrics', 'Vendor Scorecard', 'Rating Management', 'Performance Reports', 'Quality Assurance']
        },
        {
          id: 'vendor-financial',
          label: 'Financial Management',
          subSubItems: ['Commission Tracking', 'Payout Processing', 'Revenue Sharing', 'Financial Reports', 'Tax Management']
        },
        {
          id: 'vendor-support',
          label: 'Vendor Support',
          badge: 2,
          subSubItems: ['Support Tickets', 'Training Programs', 'Resource Center', 'Onboarding Guide', 'FAQ Management']
        }
      ]
    },
    {
      id: 'product-management',
      label: 'Product Management',
      icon: Package,
      color: 'text-orange-600',
      badge: 156,
      priority: 'high',
      subItems: [
        {
          id: 'product-catalog',
          label: 'Product Catalog',
          badge: 45,
          subSubItems: ['All Products', 'Product Search', 'Featured Products', 'Product Import/Export', 'Bulk Operations', 'Product Templates']
        },
        {
          id: 'category-management',
          label: 'Category Management',
          subSubItems: ['Category Structure', 'Category Performance', 'Seasonal Categories', 'Category Analytics', 'Category Mapping']
        },
        {
          id: 'product-moderation',
          label: 'Product Moderation',
          badge: 23,
          subSubItems: ['Pending Approvals', 'Content Review', 'Quality Control', 'Rejected Products', 'Review Appeals']
        },
        {
          id: 'inventory-management',
          label: 'Inventory Management',
          badge: 12,
          subSubItems: ['Stock Overview', 'Low Stock Alerts', 'Inventory Reports', 'Warehouse Management', 'Stock Transfers']
        },
        {
          id: 'product-analytics',
          label: 'Product Analytics',
          subSubItems: ['Best Sellers', 'Performance Metrics', 'Market Trends', 'Price Analytics', 'Competitor Analysis']
        }
      ]
    },
    {
      id: 'order-management',
      label: 'Order Management',
      icon: ShoppingCart,
      color: 'text-cyan-600',
      badge: 78,
      priority: 'high',
      subItems: [
        {
          id: 'order-overview',
          label: 'Order Overview',
          badge: 25,
          subSubItems: ['All Orders', 'Order Search', 'Order Timeline', 'Bulk Actions', 'Order Export', 'Order Analytics']
        },
        {
          id: 'order-processing',
          label: 'Order Processing',
          badge: 15,
          subSubItems: ['New Orders', 'Processing Orders', 'Shipped Orders', 'Delivered Orders', 'Cancelled Orders']
        },
        {
          id: 'payment-management',
          label: 'Payment Management',
          badge: 8,
          subSubItems: ['Payment Status', 'Payment Methods', 'Failed Payments', 'Refund Processing', 'Payment Disputes']
        },
        {
          id: 'shipping-logistics',
          label: 'Shipping & Logistics',
          subSubItems: ['Courier Partners', 'Delivery Tracking', 'Shipping Zones', 'Delivery Performance', 'Route Optimization']
        },
        {
          id: 'order-analytics',
          label: 'Order Analytics',
          subSubItems: ['Order Reports', 'Revenue Analytics', 'Performance Metrics', 'Customer Insights', 'Delivery Analytics']
        }
      ]
    },
    {
      id: 'financial-management',
      label: 'Financial Management',
      icon: DollarSign,
      color: 'text-emerald-600',
      priority: 'high',
      subItems: [
        {
          id: 'revenue-dashboard',
          label: 'Revenue Dashboard',
          subSubItems: ['Revenue Overview', 'Revenue Trends', 'Commission Summary', 'Profit Analytics', 'Financial KPIs']
        },
        {
          id: 'payment-gateways',
          label: 'Payment Gateways',
          subSubItems: ['bKash Integration', 'Nagad Integration', 'Rocket Integration', 'International Gateways', 'Payment Analytics', 'Gateway Health']
        },
        {
          id: 'vendor-payouts',
          label: 'Vendor Payouts',
          badge: 12,
          subSubItems: ['Payout Schedule', 'Pending Payouts', 'Payout History', 'Payout Reports', 'Tax Deductions']
        },
        {
          id: 'financial-reports',
          label: 'Financial Reports',
          subSubItems: ['Daily Reports', 'Monthly Reports', 'Tax Reports', 'Audit Reports', 'P&L Statements']
        },
        {
          id: 'transaction-monitoring',
          label: 'Transaction Monitoring',
          subSubItems: ['Transaction Logs', 'Fraud Detection', 'Security Monitoring', 'Suspicious Activities', 'Risk Assessment']
        }
      ]
    },
    {
      id: 'shipping-logistics',
      label: 'Shipping & Logistics',
      icon: Truck,
      color: 'text-indigo-600',
      badge: 18,
      priority: 'medium',
      subItems: [
        {
          id: 'courier-partners',
          label: 'Courier Partners',
          subSubItems: ['Pathao Management', 'Paperfly Integration', 'Sundarban Coordination', 'RedX Monitoring', 'eCourier Tracking', 'SA Paribahan']
        },
        {
          id: 'delivery-management',
          label: 'Delivery Management',
          badge: 6,
          subSubItems: ['Delivery Zones', 'Delivery Scheduling', 'Route Optimization', 'Delivery Performance', 'Driver Management']
        },
        {
          id: 'shipping-analytics',
          label: 'Shipping Analytics',
          subSubItems: ['Delivery Reports', 'Performance Metrics', 'Cost Analysis', 'Customer Satisfaction', 'Delivery Time Analysis']
        },
        {
          id: 'returns-exchanges',
          label: 'Returns & Exchanges',
          badge: 12,
          subSubItems: ['Return Requests', 'Exchange Processing', 'Refund Management', 'Return Analytics', 'Quality Issues']
        }
      ]
    },
    {
      id: 'content-management',
      label: 'Content Management',
      icon: FileText,
      color: 'text-pink-600',
      priority: 'medium',
      subItems: [
        {
          id: 'cms-pages',
          label: 'CMS Pages',
          subSubItems: ['Home Page', 'About Us', 'Terms & Conditions', 'Privacy Policy', 'Help Center', 'FAQ']
        },
        {
          id: 'banner-management',
          label: 'Banner Management',
          subSubItems: ['Hero Banners', 'Promotional Banners', 'Category Banners', 'Mobile Banners', 'Banner Scheduling']
        },
        {
          id: 'blog-management',
          label: 'Blog Management',
          subSubItems: ['Blog Posts', 'Categories', 'Tags', 'SEO Settings', 'Publishing Schedule']
        },
        {
          id: 'media-library',
          label: 'Media Library',
          subSubItems: ['Images', 'Videos', 'Documents', 'Media Upload', 'CDN Management']
        }
      ]
    },
    {
      id: 'marketing-promotions',
      label: 'Marketing & Promotions',
      icon: Megaphone,
      color: 'text-rose-600',
      priority: 'medium',
      subItems: [
        {
          id: 'campaign-management',
          label: 'Campaign Management',
          subSubItems: ['Active Campaigns', 'Campaign Creation', 'Campaign Analytics', 'Campaign History', 'A/B Testing']
        },
        {
          id: 'promotional-tools',
          label: 'Promotional Tools',
          subSubItems: ['Discount Codes', 'Flash Sales', 'Seasonal Promotions', 'Bundle Offers', 'Loyalty Rewards']
        },
        {
          id: 'email-marketing',
          label: 'Email Marketing',
          subSubItems: ['Email Templates', 'Newsletter', 'Automated Emails', 'Email Analytics', 'Subscriber Management']
        },
        {
          id: 'sms-marketing',
          label: 'SMS Marketing',
          subSubItems: ['SMS Templates', 'Bulk SMS', 'SMS Analytics', 'SMS Automation', 'Opt-in Management']
        },
        {
          id: 'marketing-analytics',
          label: 'Marketing Analytics',
          subSubItems: ['Campaign Performance', 'Customer Acquisition', 'ROI Analysis', 'Conversion Tracking', 'Attribution Models']
        }
      ]
    },
    {
      id: 'communication',
      label: 'Communication Hub',
      icon: MessageSquare,
      color: 'text-blue-500',
      badge: 34,
      priority: 'medium',
      subItems: [
        {
          id: 'customer-support',
          label: 'Customer Support',
          badge: 15,
          subSubItems: ['Support Tickets', 'Live Chat', 'Help Desk', 'Knowledge Base', 'Support Analytics']
        },
        {
          id: 'messaging-system',
          label: 'Messaging System',
          badge: 8,
          subSubItems: ['Internal Messages', 'Vendor Messages', 'Customer Messages', 'Broadcast Messages', 'Message Templates']
        },
        {
          id: 'feedback-reviews',
          label: 'Feedback & Reviews',
          badge: 11,
          subSubItems: ['Product Reviews', 'Vendor Reviews', 'Service Feedback', 'Review Moderation', 'Review Analytics']
        }
      ]
    },
    {
      id: 'security-audit',
      label: 'Security & Audit',
      icon: Shield,
      color: 'text-red-600',
      badge: 5,
      priority: 'high',
      subItems: [
        {
          id: 'access-control',
          label: 'Access Control',
          subSubItems: ['User Permissions', 'Role Management', 'IP Whitelist', 'Two-Factor Auth', 'Session Management']
        },
        {
          id: 'security-monitoring',
          label: 'Security Monitoring',
          badge: 3,
          subSubItems: ['Security Logs', 'Failed Login Attempts', 'Suspicious Activities', 'Vulnerability Scans', 'Security Alerts']
        },
        {
          id: 'audit-trails',
          label: 'Audit Trails',
          subSubItems: ['User Activity Logs', 'Data Changes', 'System Events', 'Compliance Reports', 'Audit Export']
        },
        {
          id: 'compliance',
          label: 'Compliance',
          subSubItems: ['GDPR Compliance', 'Data Protection', 'Privacy Settings', 'Legal Documents', 'Compliance Reports']
        }
      ]
    },
    {
      id: 'system-monitoring',
      label: 'System Monitoring',
      icon: Activity,
      color: 'text-yellow-600',
      badge: 2,
      priority: 'medium',
      subItems: [
        {
          id: 'performance-metrics',
          label: 'Performance Metrics',
          subSubItems: ['Server Performance', 'Database Performance', 'API Response Times', 'Load Balancing', 'Resource Usage']
        },
        {
          id: 'error-monitoring',
          label: 'Error Monitoring',
          badge: 2,
          subSubItems: ['Error Logs', 'Exception Tracking', 'Debug Information', 'Error Analytics', 'Alert Configuration']
        },
        {
          id: 'health-checks',
          label: 'Health Checks',
          subSubItems: ['System Health', 'Service Status', 'Uptime Monitoring', 'Health Dashboard', 'Status Page']
        },
        {
          id: 'infrastructure',
          label: 'Infrastructure',
          subSubItems: ['Server Management', 'Cloud Resources', 'CDN Status', 'Storage Management', 'Network Monitoring']
        }
      ]
    },
    {
      id: 'backup-recovery',
      label: 'Backup & Recovery',
      icon: HardDrive,
      color: 'text-gray-600',
      priority: 'medium',
      subItems: [
        {
          id: 'backup-management',
          label: 'Backup Management',
          subSubItems: ['Automated Backups', 'Manual Backups', 'Backup Schedule', 'Backup Verification', 'Storage Locations']
        },
        {
          id: 'data-recovery',
          label: 'Data Recovery',
          subSubItems: ['Recovery Points', 'Recovery Testing', 'Disaster Recovery', 'Data Restoration', 'Recovery Logs']
        }
      ]
    },
    {
      id: 'api-integrations',
      label: 'API & Integrations',
      icon: Webhook,
      color: 'text-teal-600',
      priority: 'low',
      subItems: [
        {
          id: 'api-management',
          label: 'API Management',
          subSubItems: ['API Keys', 'API Documentation', 'Rate Limiting', 'API Analytics', 'API Versioning']
        },
        {
          id: 'webhooks',
          label: 'Webhooks',
          subSubItems: ['Webhook Configuration', 'Event Triggers', 'Webhook Logs', 'Retry Policies', 'Webhook Testing']
        },
        {
          id: 'third-party',
          label: 'Third-party Integrations',
          subSubItems: ['Payment Gateways', 'Shipping APIs', 'Analytics Tools', 'Marketing Tools', 'Social Media']
        }
      ]
    },
    {
      id: 'analytics-reports',
      label: 'Analytics & Reports',
      icon: PieChart,
      color: 'text-violet-600',
      priority: 'high',
      subItems: [
        {
          id: 'business-intelligence',
          label: 'Business Intelligence',
          subSubItems: ['Executive Dashboard', 'KPI Monitoring', 'Performance Metrics', 'Trend Analysis', 'Predictive Analytics']
        },
        {
          id: 'sales-analytics',
          label: 'Sales Analytics',
          subSubItems: ['Sales Reports', 'Product Performance', 'Vendor Performance', 'Market Analysis', 'Revenue Forecasting']
        },
        {
          id: 'customer-analytics',
          label: 'Customer Analytics',
          subSubItems: ['Customer Behavior', 'Purchase Patterns', 'Customer Segmentation', 'Retention Analysis', 'Lifetime Value']
        },
        {
          id: 'financial-analytics',
          label: 'Financial Analytics',
          subSubItems: ['Revenue Analysis', 'Profit Margins', 'Cost Analysis', 'Financial Forecasting', 'Budget Planning']
        },
        {
          id: 'custom-reports',
          label: 'Custom Reports',
          subSubItems: ['Report Builder', 'Scheduled Reports', 'Export Options', 'Report Templates', 'Data Visualization']
        }
      ]
    },
    {
      id: 'settings-configuration',
      label: 'Settings & Configuration',
      icon: Settings,
      color: 'text-gray-600',
      priority: 'medium',
      subItems: [
        {
          id: 'platform-settings',
          label: 'Platform Settings',
          subSubItems: ['General Settings', 'Security Settings', 'API Configuration', 'System Maintenance', 'Feature Flags']
        },
        {
          id: 'payment-configuration',
          label: 'Payment Configuration',
          subSubItems: ['Gateway Settings', 'Commission Rates', 'Currency Settings', 'Tax Configuration', 'Fee Structure']
        },
        {
          id: 'shipping-configuration',
          label: 'Shipping Configuration',
          subSubItems: ['Courier Settings', 'Zone Management', 'Rate Configuration', 'Delivery Options', 'Packaging Rules']
        },
        {
          id: 'localization',
          label: 'Localization',
          subSubItems: ['Language Settings', 'Regional Settings', 'Cultural Adaptation', 'Festival Management', 'Time Zones']
        },
        {
          id: 'system-administration',
          label: 'System Administration',
          subSubItems: ['User Roles', 'Permissions', 'System Logs', 'Environment Variables', 'Database Settings']
        }
      ]
    }
  ];

  const toggleMenu = (menuId: string) => {
    if (collapsed) return;
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const getPriorityColor = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className={`fixed left-0 top-[125px] bottom-[-144px] bg-white border-r border-gray-200 shadow-lg z-40 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header with Collapse Toggle */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">G</span>
              </div>
            </div>
            <div>
              <div className="font-bold text-xs text-gray-800">GetIt Admin</div>
              <div className="text-xs text-gray-600">Multi-Vendor Platform</div>
              <div className="text-xs text-blue-600 font-medium">v2.0.1</div>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <div className="h-[calc(100vh-81px)] overflow-hidden">
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
                      toggleMenu(item.id);
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 transition-all duration-200 rounded-lg group border-l-4 ${
                      isActive ? 'bg-blue-50 border-blue-500 text-blue-700' : `border-transparent ${getPriorityColor(item.priority)}`
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon 
                      size={18} 
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : item.color
                      }`} 
                    />
                    {!collapsed && (
                      <>
                        <span className="ml-3 font-medium text-xs flex-1">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <BadgeComponent 
                              className={`text-white text-xs px-1.5 py-0.5 ${
                                item.badge > 50 ? 'bg-red-500' : 
                                item.badge > 20 ? 'bg-orange-500' : 
                                'bg-blue-500'
                              }`}
                            >
                              {item.badge}
                            </BadgeComponent>
                          )}
                          {item.subItems && (
                            <ChevronDown 
                              size={14} 
                              className={`transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </button>

                  {/* Sub Menu Items - only show when not collapsed */}
                  {!collapsed && item.subItems && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.id}>
                          <button
                            onClick={() => setActiveTab(`${item.id}-${subItem.id}`)}
                            className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between ${
                              activeTab === `${item.id}-${subItem.id}`
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                          >
                            <span>{subItem.label}</span>
                            {subItem.badge && (
                              <BadgeComponent className="bg-red-500 text-white text-xs px-1 py-0.5">
                                {subItem.badge}
                              </BadgeComponent>
                            )}
                          </button>
                          
                          {/* Sub-Sub Items */}
                          {subItem.subSubItems && activeTab === `${item.id}-${subItem.id}` && (
                            <div className="ml-4 mt-1 space-y-1">
                              {subItem.subSubItems.map((subSubItem, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveTab(`${item.id}-${subItem.id}-${index}`)}
                                  className="w-full text-left px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
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

      {/* Footer - only show when not collapsed */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
            <Shield size={12} />
            <span>Admin Panel Security Enabled</span>
            <div className="flex items-center space-x-1 ml-auto">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            © 2025 GetIt Bangladesh. All rights reserved.
          </div>
        </div>
      )}
    </div>
  );
};
