
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
  MessageSquare,
  CreditCard,
  Target,
  PieChart,
  Activity,
  Database,
  Lock,
  Zap,
  Globe,
  Headphones,
  Map,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Search,
  Filter,
  Archive,
  Star,
  Award,
  Briefcase
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
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
  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['dashboard']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleMenuClick = (menuId: string) => {
    console.log('🎯 ComprehensiveAdminSidebar - Menu clicked:', menuId);
    setActiveTab(menuId);
  };

  // Define comprehensive menu structure with proper hierarchy
  const menuStructure = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      submenus: [
        { id: 'overview', label: 'Overview', icon: Eye },
        { id: 'dashboard-analytics', label: 'Analytics Dashboard', icon: BarChart3 },
        { id: 'real-time-metrics', label: 'Real-time Metrics', icon: Activity },
        { id: 'kpi-monitoring', label: 'KPI Monitoring', icon: Target },
        { id: 'performance-insights', label: 'Performance Insights', icon: TrendingUp }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      color: 'text-cyan-500',
      submenus: [
        { id: 'user-overview', label: 'User Overview', icon: Eye },
        { id: 'admin-list', label: 'Admin Users', icon: Shield },
        { id: 'active-users', label: 'Active Users', icon: CheckCircle },
        { id: 'inactive-users', label: 'Inactive Users', icon: Clock },
        { id: 'banned-users', label: 'Banned Users', icon: AlertTriangle },
        { id: 'user-verification', label: 'User Verification', icon: FileCheck },
        { id: 'role-management', label: 'Role Management', icon: Award },
        { id: 'permissions', label: 'Permissions', icon: Lock },
        { id: 'activity-logs', label: 'Activity Logs', icon: FileText },
        { id: 'user-analytics', label: 'User Analytics', icon: BarChart3 },
        { id: 'registration-trends', label: 'Registration Trends', icon: TrendingUp },
        { id: 'demographics', label: 'Demographics', icon: PieChart },
        { id: 'user-settings', label: 'User Settings', icon: Settings }
      ]
    },
    {
      id: 'customer-management',
      label: 'Customer Management',
      icon: UserCheck,
      color: 'text-green-500',
      submenus: [
        { id: 'customer-overview', label: 'Customer Overview', icon: Eye },
        { id: 'customer-database', label: 'Customer Database', icon: Database },
        { id: 'customer-analytics', label: 'Customer Analytics', icon: BarChart3 },
        { id: 'customer-search', label: 'Customer Search', icon: Search },
        { id: 'customer-segments', label: 'Customer Segments', icon: Filter },
        { id: 'vip-customers', label: 'VIP Customers', icon: Star },
        { id: 'purchase-history', label: 'Purchase History', icon: Archive },
        { id: 'customer-behavior', label: 'Customer Behavior', icon: Activity },
        { id: 'clv-analysis', label: 'CLV Analysis', icon: TrendingUp },
        { id: 'loyalty-analysis', label: 'Loyalty Analysis', icon: Award },
        { id: 'customer-support', label: 'Customer Support', icon: Headphones },
        { id: 'live-chat', label: 'Live Chat', icon: MessageSquare },
        { id: 'feedback-reviews', label: 'Feedback & Reviews', icon: Star }
      ]
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management',
      icon: Store,
      color: 'text-purple-500',
      submenus: [
        { id: 'vendor-directory', label: 'Vendor Directory', icon: Database },
        { id: 'active-vendors', label: 'Active Vendors', icon: CheckCircle },
        { id: 'pending-applications', label: 'Pending Applications', icon: Clock },
        { id: 'suspended-vendors', label: 'Suspended Vendors', icon: AlertTriangle },
        { id: 'vendor-search', label: 'Vendor Search', icon: Search },
        { id: 'vendor-analytics', label: 'Vendor Analytics', icon: BarChart3 },
        { id: 'nid-verification', label: 'NID Verification', icon: FileCheck },
        { id: 'tin-verification', label: 'TIN Verification', icon: FileText },
        { id: 'trade-license-verification', label: 'Trade License', icon: Briefcase },
        { id: 'bank-account-verification', label: 'Bank Account', icon: CreditCard },
        { id: 'document-review', label: 'Document Review', icon: FileCheck },
        { id: 'vendor-performance', label: 'Performance', icon: TrendingUp },
        { id: 'performance-metrics', label: 'Performance Metrics', icon: Target },
        { id: 'performance-reports', label: 'Performance Reports', icon: FileText },
        { id: 'vendor-scorecard', label: 'Vendor Scorecard', icon: Award },
        { id: 'rating-management', label: 'Rating Management', icon: Star },
        { id: 'vendor-payments', label: 'Vendor Payments', icon: CreditCard },
        { id: 'commission-tracking', label: 'Commission Tracking', icon: DollarSign },
        { id: 'payout-processing', label: 'Payout Processing', icon: Zap },
        { id: 'revenue-sharing', label: 'Revenue Sharing', icon: PieChart },
        { id: 'vendor-support', label: 'Vendor Support', icon: Headphones }
      ]
    },
    {
      id: 'product-management',
      label: 'Product Management',
      icon: Package,
      color: 'text-orange-500',
      submenus: [
        { id: 'product-catalog', label: 'Product Catalog', icon: Database },
        { id: 'all-products', label: 'All Products', icon: Package },
        { id: 'product-search', label: 'Product Search', icon: Search },
        { id: 'featured-products', label: 'Featured Products', icon: Star },
        { id: 'category-management', label: 'Category Management', icon: Filter },
        { id: 'category-structure', label: 'Category Structure', icon: Map },
        { id: 'pending-approval', label: 'Pending Approval', icon: Clock },
        { id: 'content-review', label: 'Content Review', icon: FileCheck },
        { id: 'quality-control', label: 'Quality Control', icon: Shield },
        { id: 'rejected-products', label: 'Rejected Products', icon: AlertTriangle },
        { id: 'inventory-management', label: 'Inventory Management', icon: Archive },
        { id: 'stock-overview', label: 'Stock Overview', icon: Eye },
        { id: 'low-stock-alerts', label: 'Low Stock Alerts', icon: AlertTriangle },
        { id: 'product-analytics', label: 'Product Analytics', icon: BarChart3 },
        { id: 'best-sellers', label: 'Best Sellers', icon: TrendingUp },
        { id: 'market-trends', label: 'Market Trends', icon: Activity }
      ]
    },
    {
      id: 'order-management',
      label: 'Order Management',
      icon: ShoppingCart,
      color: 'text-red-500',
      submenus: [
        { id: 'order-overview', label: 'Order Overview', icon: Eye },
        { id: 'all-orders', label: 'All Orders', icon: ShoppingCart },
        { id: 'new-orders', label: 'New Orders', icon: Zap },
        { id: 'processing-orders', label: 'Processing Orders', icon: Clock },
        { id: 'shipped-orders', label: 'Shipped Orders', icon: Truck },
        { id: 'delivered-orders', label: 'Delivered Orders', icon: CheckCircle },
        { id: 'order-tracking', label: 'Order Tracking', icon: Map },
        { id: 'bulk-actions', label: 'Bulk Actions', icon: Archive },
        { id: 'payment-status', label: 'Payment Status', icon: CreditCard },
        { id: 'payment-methods', label: 'Payment Methods', icon: DollarSign },
        { id: 'refund-processing', label: 'Refund Processing', icon: AlertTriangle },
        { id: 'order-reports', label: 'Order Reports', icon: FileText },
        { id: 'performance-metrics-orders', label: 'Performance Metrics', icon: Target }
      ]
    },
    {
      id: 'sales-management',
      label: 'Sales Management',
      icon: TrendingUp,
      color: 'text-emerald-500',
      submenus: [
        { id: 'sales-overview', label: 'Sales Overview', icon: Eye },
        { id: 'revenue-dashboard', label: 'Revenue Dashboard', icon: DollarSign },
        { id: 'revenue-analytics', label: 'Revenue Analytics', icon: BarChart3 },
        { id: 'profit-margins', label: 'Profit Margins', icon: TrendingUp },
        { id: 'cost-analysis', label: 'Cost Analysis', icon: PieChart },
        { id: 'roi-tracking', label: 'ROI Tracking', icon: Target },
        { id: 'sales-reports', label: 'Sales Reports', icon: FileText },
        { id: 'detailed-reports', label: 'Detailed Reports', icon: FileCheck },
        { id: 'comparative-analysis', label: 'Comparative Analysis', icon: BarChart3 },
        { id: 'export-data', label: 'Export Data', icon: Archive }
      ]
    },
    {
      id: 'logistics-management',
      label: 'Logistics',
      icon: Truck,
      color: 'text-indigo-500',
      submenus: [
        { id: 'courier-partners', label: 'Courier Partners', icon: Truck },
        { id: 'delivery-management', label: 'Delivery Management', icon: Map },
        { id: 'delivery-tracking', label: 'Delivery Tracking', icon: Eye },
        { id: 'shipping-zones', label: 'Shipping Zones', icon: Globe },
        { id: 'delivery-performance', label: 'Delivery Performance', icon: TrendingUp },
        { id: 'returns-exchanges', label: 'Returns & Exchanges', icon: AlertTriangle }
      ]
    },
    {
      id: 'payment-management',
      label: 'Payment Management',
      icon: DollarSign,
      color: 'text-yellow-500',
      submenus: [
        { id: 'revenue-dashboard-payment', label: 'Revenue Dashboard', icon: DollarSign },
        { id: 'payment-gateways', label: 'Payment Gateways', icon: CreditCard },
        { id: 'vendor-payouts', label: 'Vendor Payouts', icon: Zap },
        { id: 'transaction-monitoring', label: 'Transaction Monitoring', icon: Eye },
        { id: 'financial-reports', label: 'Financial Reports', icon: FileText }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Target,
      color: 'text-pink-500',
      submenus: [
        { id: 'marketing-campaigns', label: 'Campaigns', icon: Target },
        { id: 'promotions-discounts', label: 'Promotions & Discounts', icon: Star },
        { id: 'email-marketing', label: 'Email Marketing', icon: MessageSquare }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-blue-600',
      submenus: [
        { id: 'business-intelligence', label: 'Business Intelligence', icon: BarChart3 },
        { id: 'financial-reports-analytics', label: 'Financial Reports', icon: FileText },
        { id: 'operational-reports', label: 'Operational Reports', icon: Activity }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      color: 'text-teal-500',
      submenus: [
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'messaging', label: 'Messaging', icon: MessageSquare },
        { id: 'announcements', label: 'Announcements', icon: Globe }
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      color: 'text-red-600',
      submenus: [
        { id: 'security-monitoring', label: 'Security Monitoring', icon: Shield },
        { id: 'compliance', label: 'Compliance', icon: FileCheck }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-500',
      submenus: [
        { id: 'system-settings', label: 'System Settings', icon: Settings },
        { id: 'platform-configuration', label: 'Platform Configuration', icon: Globe }
      ]
    }
  ];

  return (
    <div className={`fixed left-0 top-[125px] bottom-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800 transition-all duration-300 z-30 shadow-lg border-r border-gray-200 ${
      collapsed ? 'w-12' : 'w-56'
    }`} style={{ height: 'calc(100vh - 125px + 144px)' }}>
      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

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
      <div className="flex-1 h-[calc(100vh-200px)] overflow-hidden">
        <ScrollArea className="h-full custom-scrollbar">
          <nav className="p-2">
            {menuStructure.map((section) => {
              const SectionIcon = section.icon;
              const isExpanded = expandedSections.has(section.id);
              const hasActiveSubmenu = section.submenus?.some(sub => sub.id === activeTab);
              
              return (
                <div key={section.id} className="mb-1">
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-lg text-xs group ${
                          hasActiveSubmenu || activeTab === section.id ? 'bg-white shadow-md border-l-4 border-blue-500 text-blue-700' : 'text-gray-600'
                        }`}
                        onClick={() => {
                          if (!section.submenus || section.submenus.length === 0) {
                            handleMenuClick(section.id);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <SectionIcon 
                            size={16} 
                            className={`flex-shrink-0 transition-colors ${
                              hasActiveSubmenu || activeTab === section.id ? 'text-blue-600' : section.color
                            } group-hover:${section.color}`} 
                          />
                          {!collapsed && (
                            <span className="ml-2.5 font-medium">{section.label}</span>
                          )}
                        </div>
                        {!collapsed && section.submenus && section.submenus.length > 0 && (
                          <div className="flex-shrink-0">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    {!collapsed && section.submenus && section.submenus.length > 0 && (
                      <CollapsibleContent className="space-y-1 mt-1">
                        {section.submenus.map((submenu) => {
                          const SubmenuIcon = submenu.icon;
                          const isActive = activeTab === submenu.id;
                          
                          return (
                            <button
                              key={submenu.id}
                              onClick={() => handleMenuClick(submenu.id)}
                              className={`w-full flex items-center px-6 py-2 text-left hover:bg-white/60 hover:shadow-sm transition-all duration-200 rounded-lg text-xs ml-2 ${
                                isActive ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-400' : 'text-gray-600'
                              }`}
                            >
                              <SubmenuIcon 
                                size={14} 
                                className={`flex-shrink-0 mr-2 ${
                                  isActive ? 'text-blue-600' : 'text-gray-400'
                                }`} 
                              />
                              <span className="text-xs">{submenu.label}</span>
                            </button>
                          );
                        })}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
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
