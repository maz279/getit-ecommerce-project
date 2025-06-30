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
  MessageSquare,
  Truck,
  CreditCard,
  Megaphone,
  Target
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
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['dashboard']));

  const toggleGroup = (groupId: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupId)) {
      newOpenGroups.delete(groupId);
    } else {
      newOpenGroups.add(groupId);
    }
    setOpenGroups(newOpenGroups);
  };

  const menuGroups = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'performance', label: 'Performance' },
        { id: 'insights', label: 'Insights' },
        { id: 'reports', label: 'Reports' }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      color: 'text-cyan-500',
      items: [
        { id: 'user-overview', label: 'User Overview' },
        { id: 'active-users', label: 'Active Users' },
        { id: 'inactive-users', label: 'Inactive Users' },
        { id: 'banned-users', label: 'Banned Users' },
        { id: 'user-verification', label: 'User Verification' },
        { id: 'role-management', label: 'Role Management' },
        { id: 'permissions-management', label: 'Permissions Management' },
        { id: 'access-control', label: 'Access Control' },
        { id: 'admin-list-management', label: 'Admin List Management' },
        { id: 'user-analytics', label: 'User Analytics' },
        { id: 'demographics', label: 'Demographics' },
        { id: 'registration-trends', label: 'Registration Trends' },
        { id: 'activity-logs', label: 'Activity Logs' },
        { id: 'activity-reports', label: 'Activity Reports' },
        { id: 'user-settings', label: 'User Settings' }
      ]
    },
    {
      id: 'customer-management',
      label: 'Customer Management',
      icon: UserCheck,
      color: 'text-green-500',
      items: [
        { id: 'customer-overview', label: 'Customer Overview' },
        { id: 'all-customers', label: 'All Customers' },
        { id: 'vip-customers', label: 'VIP Customers' },
        { id: 'customer-segments', label: 'Customer Segments' },
        { id: 'customer-behavior', label: 'Customer Behavior' },
        { id: 'purchase-history', label: 'Purchase History' },
        { id: 'customer-support', label: 'Customer Support' },
        { id: 'live-chat', label: 'Live Chat' },
        { id: 'feedback-reviews', label: 'Feedback & Reviews' },
        { id: 'loyalty-analysis', label: 'Loyalty Analysis' },
        { id: 'clv', label: 'Customer Lifetime Value' },
        { id: 'customer-analytics', label: 'Customer Analytics' },
        { id: 'customer-search', label: 'Customer Search' }
      ]
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management',
      icon: Store,
      color: 'text-purple-500',
      items: [
        { id: 'vendor-directory', label: 'Vendor Directory' },
        { id: 'active-vendors', label: 'Active Vendors' },
        { id: 'pending-applications', label: 'Pending Applications' },
        { id: 'suspended-vendors', label: 'Suspended Vendors' },
        { id: 'vendor-onboarding', label: 'Vendor Onboarding' },
        { id: 'vendor-verification', label: 'Vendor Verification' },
        { id: 'nid-verification', label: 'NID Verification' },
        { id: 'tin-verification', label: 'TIN Verification' },
        { id: 'trade-license-verification', label: 'Trade License Verification' },
        { id: 'bank-account-verification', label: 'Bank Account Verification' },
        { id: 'document-review', label: 'Document Review' },
        { id: 'vendor-performance', label: 'Vendor Performance' },
        { id: 'vendor-performance-metrics', label: 'Performance Metrics' },
        { id: 'vendor-performance-reports', label: 'Performance Reports' },
        { id: 'vendor-scorecard', label: 'Vendor Scorecard' },
        { id: 'rating-management', label: 'Rating Management' },
        { id: 'vendor-payments', label: 'Vendor Payments' },
        { id: 'payout-processing', label: 'Payout Processing' },
        { id: 'commission-tracking', label: 'Commission Tracking' },
        { id: 'revenue-sharing', label: 'Revenue Sharing' },
        { id: 'vendor-support', label: 'Vendor Support' },
        { id: 'vendor-analytics', label: 'Vendor Analytics' },
        { id: 'vendor-search', label: 'Vendor Search' }
      ]
    },
    {
      id: 'product-management',
      label: 'Product Management',
      icon: Package,
      color: 'text-orange-500',
      items: [
        { id: 'product-catalog', label: 'Product Catalog' },
        { id: 'all-products', label: 'All Products' },
        { id: 'featured-products', label: 'Featured Products' },
        { id: 'best-sellers', label: 'Best Sellers' },
        { id: 'pending-approval', label: 'Pending Approval' },
        { id: 'rejected-products', label: 'Rejected Products' },
        { id: 'content-review', label: 'Content Review' },
        { id: 'quality-control', label: 'Quality Control' },
        { id: 'category-structure', label: 'Category Structure' },
        { id: 'category-analytics', label: 'Category Analytics' },
        { id: 'product-search', label: 'Product Search' },
        { id: 'product-import-export', label: 'Import/Export' },
        { id: 'inventory-management-overview', label: 'Inventory Overview' },
        { id: 'stock-overview', label: 'Stock Overview' },
        { id: 'low-stock-alerts', label: 'Low Stock Alerts' },
        { id: 'warehouse-management', label: 'Warehouse Management' },
        { id: 'inventory-reports', label: 'Inventory Reports' },
        { id: 'market-trends', label: 'Market Trends' }
      ]
    },
    {
      id: 'order-management',
      label: 'Order Management',
      icon: ShoppingCart,
      color: 'text-red-500',
      items: [
        { id: 'order-overview', label: 'Order Overview' },
        { id: 'all-orders', label: 'All Orders' },
        { id: 'new-orders', label: 'New Orders' },
        { id: 'processing-orders', label: 'Processing Orders' },
        { id: 'shipped-orders', label: 'Shipped Orders' },
        { id: 'delivered-orders', label: 'Delivered Orders' },
        { id: 'order-processing', label: 'Order Processing' },
        { id: 'order-tracking', label: 'Order Tracking' },
        { id: 'bulk-actions', label: 'Bulk Actions' },
        { id: 'payment-status', label: 'Payment Status' },
        { id: 'payment-methods', label: 'Payment Methods' },
        { id: 'failed-payments', label: 'Failed Payments' },
        { id: 'refund-processing', label: 'Refund Processing' },
        { id: 'order-reports', label: 'Order Reports' },
        { id: 'performance-metrics', label: 'Performance Metrics' }
      ]
    },
    {
      id: 'sales-management',
      label: 'Sales Management',
      icon: TrendingUp,
      color: 'text-emerald-500',
      items: [
        { id: 'sales-overview', label: 'Sales Overview' },
        { id: 'revenue-dashboard-sales', label: 'Revenue Dashboard' },
        { id: 'revenue-analytics', label: 'Revenue Analytics' },
        { id: 'sales-forecast', label: 'Sales Forecast' },
        { id: 'profit-margin', label: 'Profit Margin' },
        { id: 'cost-analysis', label: 'Cost Analysis' },
        { id: 'roi-tracking', label: 'ROI Tracking' },
        { id: 'comparative-analysis', label: 'Comparative Analysis' },
        { id: 'detailed-reports', label: 'Detailed Reports' },
        { id: 'export-data', label: 'Export Data' }
      ]
    },
    {
      id: 'logistics-management',
      label: 'Logistics',
      icon: Truck,
      color: 'text-indigo-500',
      items: [
        { id: 'courier-partners', label: 'Courier Partners' },
        { id: 'delivery-tracking', label: 'Delivery Tracking' },
        { id: 'delivery-performance', label: 'Delivery Performance' },
        { id: 'shipping-zones', label: 'Shipping Zones' }
      ]
    },
    {
      id: 'payment-management',
      label: 'Payments',
      icon: CreditCard,
      color: 'text-pink-500',
      items: [
        { id: 'revenue-dashboard-payment', label: 'Revenue Dashboard' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Megaphone,
      color: 'text-yellow-500',
      items: [
        { id: 'marketing-campaigns', label: 'Campaigns' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-teal-500',
      items: [
        { id: 'business-intelligence', label: 'Business Intelligence' }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      color: 'text-rose-500',
      items: [
        { id: 'notifications', label: 'Notifications' }
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      color: 'text-gray-500',
      items: [
        { id: 'security-monitoring', label: 'Security Monitoring' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-slate-500',
      items: [
        { id: 'system-settings', label: 'System Settings' }
      ]
    }
  ];

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId);
  };

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
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="p-2">
            {menuGroups.map((group) => {
              const Icon = group.icon;
              const isGroupOpen = openGroups.has(group.id);
              const hasActiveItem = group.items.some(item => activeTab === item.id);
              
              return (
                <Collapsible key={group.id} open={isGroupOpen} onOpenChange={() => toggleGroup(group.id)}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2.5 mb-1 text-left hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-lg text-xs group ${
                        hasActiveItem ? 'bg-white shadow-md border-l-4 border-blue-500 text-blue-700' : 'text-gray-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon 
                          size={16} 
                          className={`flex-shrink-0 transition-colors ${
                            hasActiveItem ? 'text-blue-600' : group.color
                          } group-hover:${group.color}`} 
                        />
                        {!collapsed && (
                          <span className="ml-2.5 font-medium">{group.label}</span>
                        )}
                      </div>
                      {!collapsed && (
                        <div className="flex-shrink-0">
                          {isGroupOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </div>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  
                  {!collapsed && (
                    <CollapsibleContent className="ml-6 space-y-1">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
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
