
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
  Shield,
  Truck,
  CreditCard,
  Target,
  MessageSquare,
  Globe,
  Search,
  AlertTriangle,
  Activity,
  PieChart,
  Megaphone,
  Heart,
  Gift,
  Zap,
  Database,
  Lock,
  Key,
  Eye,
  UserPlus,
  UserMinus,
  UserX,
  Clock,
  Calendar,
  Filter,
  Archive,
  Trash2,
  Edit,
  Plus,
  Download,
  Upload,
  RefreshCw,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Bookmark,
  Flag,
  Tag,
  Layers,
  Grid,
  List,
  Image,
  Video,
  Music,
  File,
  Folder,
  Share,
  Copy,
  Scissors,
  Clipboard,
  ExternalLink,
  Link2,
  Unlink,
  Move,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square as SquareIcon,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Hash,
  AtSign,
  Percent,
  DollarSign as Dollar,
  Euro,
  Pound,
  Yen,
  Rss,
  Wifi,
  Bluetooth,
  Usb,
  HardDrive,
  Cpu,
  Memory,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  Cloud,
  CloudUpload,
  CloudDownload,
  CloudOff,
  Umbrella,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Flame,
  Snowflake,
  Zap as Lightning,
  Flashlight,
  Lightbulb,
  Candle,
  Lamp,
  Lantern,
  Flashlight as Torch,
  Battery,
  BatteryLow,
  Plug,
  Power,
  PowerOff
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      items: [
        { id: 'overview', label: 'Overview', icon: Eye },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'performance', label: 'Performance', icon: TrendingUp },
        { id: 'insights', label: 'Insights', icon: Lightbulb },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'kpi-monitoring', label: 'KPI Monitoring', icon: Target }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      color: 'text-green-500',
      items: [
        { id: 'user-overview', label: 'User Overview', icon: Users },
        { id: 'active-users', label: 'Active Users', icon: UserCheck },
        { id: 'inactive-users', label: 'Inactive Users', icon: UserMinus },
        { id: 'banned-users', label: 'Banned Users', icon: UserX },
        { id: 'user-verification', label: 'User Verification', icon: Shield },
        { id: 'registration-trends', label: 'Registration Trends', icon: TrendingUp },
        { id: 'demographics', label: 'Demographics', icon: PieChart },
        { id: 'user-analytics', label: 'User Analytics', icon: BarChart3 },
        { id: 'role-management', label: 'Role Management', icon: Key },
        { id: 'permissions-management', label: 'Permissions Management', icon: Lock },
        { id: 'access-control', label: 'Access Control', icon: Shield },
        { id: 'activity-logs', label: 'Activity Logs', icon: Activity },
        { id: 'activity-reports', label: 'Activity Reports', icon: FileText },
        { id: 'user-settings', label: 'User Settings', icon: Settings },
        { id: 'admin-list-management', label: 'Admin List Management', icon: UserPlus }
      ]
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management',
      icon: Store,
      color: 'text-purple-500',
      items: [
        { id: 'vendor-directory', label: 'Vendor Directory', icon: Store },
        { id: 'active-vendors', label: 'Active Vendors', icon: UserCheck },
        { id: 'pending-applications', label: 'Pending Applications', icon: Clock },
        { id: 'suspended-vendors', label: 'Suspended Vendors', icon: UserX },
        { id: 'vendor-onboarding', label: 'Vendor Onboarding', icon: UserPlus },
        { id: 'vendor-verification', label: 'Vendor Verification', icon: Shield },
        { id: 'document-review', label: 'Document Review', icon: FileText },
        { id: 'trade-license-verification', label: 'Trade License Verification', icon: Award },
        { id: 'nid-verification', label: 'NID Verification', icon: UserCheck },
        { id: 'tin-verification', label: 'TIN Verification', icon: Hash },
        { id: 'bank-account-verification', label: 'Bank Account Verification', icon: CreditCard },
        { id: 'vendor-performance', label: 'Vendor Performance', icon: TrendingUp },
        { id: 'vendor-performance-metrics', label: 'Performance Metrics', icon: Target },
        { id: 'vendor-performance-reports', label: 'Performance Reports', icon: FileText },
        { id: 'vendor-scorecard', label: 'Vendor Scorecard', icon: Star },
        { id: 'vendor-analytics', label: 'Vendor Analytics', icon: BarChart3 },
        { id: 'vendor-search', label: 'Vendor Search', icon: Search },
        { id: 'vendor-payments', label: 'Vendor Payments', icon: DollarSign },
        { id: 'payout-processing', label: 'Payout Processing', icon: CreditCard },
        { id: 'commission-tracking', label: 'Commission Tracking', icon: Percent },
        { id: 'revenue-sharing', label: 'Revenue Sharing', icon: PieChart },
        { id: 'rating-management', label: 'Rating Management', icon: Star },
        { id: 'vendor-support', label: 'Vendor Support', icon: HelpCircle }
      ]
    },
    {
      id: 'product-management',
      label: 'Product Management',
      icon: Package,
      color: 'text-orange-500',
      items: [
        { id: 'product-catalog-overview', label: 'Product Catalog Overview', icon: Package },
        { id: 'all-products', label: 'All Products', icon: Grid },
        { id: 'featured-products', label: 'Featured Products', icon: Star },
        { id: 'best-sellers', label: 'Best Sellers', icon: Award },
        { id: 'product-search', label: 'Product Search', icon: Search },
        { id: 'category-structure', label: 'Category Structure', icon: Layers },
        { id: 'category-analytics', label: 'Category Analytics', icon: BarChart3 },
        { id: 'inventory-management-overview', label: 'Inventory Management', icon: Database },
        { id: 'stock-overview', label: 'Stock Overview', icon: Archive },
        { id: 'low-stock-alerts', label: 'Low Stock Alerts', icon: AlertTriangle },
        { id: 'inventory-reports', label: 'Inventory Reports', icon: FileText },
        { id: 'warehouse-management', label: 'Warehouse Management', icon: Archive },
        { id: 'quality-control', label: 'Quality Control', icon: Shield },
        { id: 'pending-approval', label: 'Pending Approval', icon: Clock },
        { id: 'rejected-products', label: 'Rejected Products', icon: UserX },
        { id: 'content-review', label: 'Content Review', icon: FileText },
        { id: 'product-import-export', label: 'Product Import/Export', icon: Upload },
        { id: 'market-trends', label: 'Market Trends', icon: TrendingUp }
      ]
    },
    {
      id: 'order-management',
      label: 'Order Management',
      icon: ShoppingCart,
      color: 'text-cyan-500',
      items: [
        { id: 'order-overview', label: 'Order Overview', icon: ShoppingCart },
        { id: 'all-orders', label: 'All Orders', icon: List },
        { id: 'new-orders', label: 'New Orders', icon: Plus },
        { id: 'processing-orders', label: 'Processing Orders', icon: RefreshCw },
        { id: 'shipped-orders', label: 'Shipped Orders', icon: Truck },
        { id: 'delivered-orders', label: 'Delivered Orders', icon: UserCheck },
        { id: 'order-processing', label: 'Order Processing', icon: Settings },
        { id: 'order-tracking', label: 'Order Tracking', icon: MapPin },
        { id: 'bulk-actions', label: 'Bulk Actions', icon: Layers },
        { id: 'order-reports', label: 'Order Reports', icon: FileText },
        { id: 'performance-metrics', label: 'Performance Metrics', icon: Target },
        { id: 'payment-status', label: 'Payment Status', icon: CreditCard },
        { id: 'payment-methods', label: 'Payment Methods', icon: DollarSign },
        { id: 'failed-payments', label: 'Failed Payments', icon: AlertTriangle },
        { id: 'refund-processing', label: 'Refund Processing', icon: RotateCcw }
      ]
    },
    {
      id: 'customer-management',
      label: 'Customer Management',
      icon: Heart,
      color: 'text-pink-500',
      items: [
        { id: 'customer-overview', label: 'Customer Overview', icon: Users },
        { id: 'all-customers', label: 'All Customers', icon: List },
        { id: 'vip-customers', label: 'VIP Customers', icon: Star },
        { id: 'customer-segments', label: 'Customer Segments', icon: PieChart },
        { id: 'customer-search', label: 'Customer Search', icon: Search },
        { id: 'customer-analytics', label: 'Customer Analytics', icon: BarChart3 },
        { id: 'customer-behavior', label: 'Customer Behavior', icon: Activity },
        { id: 'purchase-history', label: 'Purchase History', icon: Archive },
        { id: 'loyalty-analysis', label: 'Loyalty Analysis', icon: Heart },
        { id: 'clv', label: 'Customer Lifetime Value', icon: DollarSign },
        { id: 'customer-support', label: 'Customer Support', icon: HelpCircle },
        { id: 'live-chat', label: 'Live Chat', icon: MessageSquare },
        { id: 'feedback-reviews', label: 'Feedback & Reviews', icon: Star }
      ]
    },
    {
      id: 'sales-management',
      label: 'Sales Management',
      icon: TrendingUp,
      color: 'text-emerald-500',
      items: [
        { id: 'sales-overview', label: 'Sales Overview', icon: TrendingUp },
        { id: 'revenue-dashboard', label: 'Revenue Dashboard', icon: DollarSign },
        { id: 'revenue-analytics', label: 'Revenue Analytics', icon: BarChart3 },
        { id: 'sales-forecast', label: 'Sales Forecast', icon: Target },
        { id: 'profit-margin', label: 'Profit Margin', icon: Percent },
        { id: 'cost-analysis', label: 'Cost Analysis', icon: PieChart },
        { id: 'roi-tracking', label: 'ROI Tracking', icon: TrendingUp },
        { id: 'comparative-analysis', label: 'Comparative Analysis', icon: BarChart3 },
        { id: 'detailed-reports', label: 'Detailed Reports', icon: FileText },
        { id: 'export-data', label: 'Export Data', icon: Download }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Megaphone,
      color: 'text-red-500',
      items: [
        { id: 'campaign-management', label: 'Campaign Management', icon: Megaphone },
        { id: 'promotions', label: 'Promotions', icon: Gift },
        { id: 'email-marketing', label: 'Email Marketing', icon: Mail },
        { id: 'social-media', label: 'Social Media', icon: Share },
        { id: 'seo-optimization', label: 'SEO Optimization', icon: Search },
        { id: 'content-marketing', label: 'Content Marketing', icon: FileText },
        { id: 'affiliate-program', label: 'Affiliate Program', icon: Link2 },
        { id: 'referral-system', label: 'Referral System', icon: Users },
        { id: 'loyalty-programs', label: 'Loyalty Programs', icon: Award },
        { id: 'discount-management', label: 'Discount Management', icon: Tag },
        { id: 'coupon-system', label: 'Coupon System', icon: Tag },
        { id: 'flash-sales', label: 'Flash Sales', icon: Zap },
        { id: 'seasonal-campaigns', label: 'Seasonal Campaigns', icon: Calendar },
        { id: 'marketing-analytics', label: 'Marketing Analytics', icon: BarChart3 },
        { id: 'conversion-tracking', label: 'Conversion Tracking', icon: Target },
        { id: 'customer-acquisition', label: 'Customer Acquisition', icon: UserPlus },
        { id: 'retention-strategies', label: 'Retention Strategies', icon: Heart },
        { id: 'market-research', label: 'Market Research', icon: Search },
        { id: 'competitor-analysis', label: 'Competitor Analysis', icon: BarChart3 },
        { id: 'brand-management', label: 'Brand Management', icon: Award }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-indigo-500',
      items: [
        { id: 'business-intelligence', label: 'Business Intelligence', icon: BarChart3 },
        { id: 'data-visualization', label: 'Data Visualization', icon: PieChart },
        { id: 'performance-metrics', label: 'Performance Metrics', icon: Target },
        { id: 'traffic-analysis', label: 'Traffic Analysis', icon: TrendingUp },
        { id: 'conversion-analytics', label: 'Conversion Analytics', icon: Target },
        { id: 'user-behavior-analysis', label: 'User Behavior Analysis', icon: Activity },
        { id: 'sales-analytics', label: 'Sales Analytics', icon: DollarSign },
        { id: 'product-analytics', label: 'Product Analytics', icon: Package },
        { id: 'marketing-analytics', label: 'Marketing Analytics', icon: Megaphone },
        { id: 'customer-analytics', label: 'Customer Analytics', icon: Users },
        { id: 'financial-analytics', label: 'Financial Analytics', icon: DollarSign },
        { id: 'predictive-analytics', label: 'Predictive Analytics', icon: Target },
        { id: 'real-time-analytics', label: 'Real-time Analytics', icon: Activity },
        { id: 'custom-reports', label: 'Custom Reports', icon: FileText },
        { id: 'data-export', label: 'Data Export', icon: Download },
        { id: 'scheduled-reports', label: 'Scheduled Reports', icon: Calendar },
        { id: 'alerts-notifications', label: 'Alerts & Notifications', icon: Bell },
        { id: 'dashboard-builder', label: 'Dashboard Builder', icon: Grid },
        { id: 'kpi-tracking', label: 'KPI Tracking', icon: Target },
        { id: 'benchmarking', label: 'Benchmarking', icon: BarChart3 }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      color: 'text-blue-600',
      items: [
        { id: 'message-center', label: 'Message Center', icon: MessageSquare },
        { id: 'email-templates', label: 'Email Templates', icon: Mail },
        { id: 'sms-notifications', label: 'SMS Notifications', icon: Phone },
        { id: 'push-notifications', label: 'Push Notifications', icon: Bell },
        { id: 'announcement-system', label: 'Announcement System', icon: Megaphone },
        { id: 'newsletter-management', label: 'Newsletter Management', icon: Mail },
        { id: 'automated-messaging', label: 'Automated Messaging', icon: RefreshCw },
        { id: 'communication-logs', label: 'Communication Logs', icon: FileText },
        { id: 'delivery-tracking', label: 'Delivery Tracking', icon: Truck },
        { id: 'engagement-metrics', label: 'Engagement Metrics', icon: BarChart3 }
      ]
    },
    {
      id: 'payment-management',
      label: 'Payment Management',
      icon: CreditCard,
      color: 'text-green-600',
      items: [
        { id: 'payment-overview', label: 'Payment Overview', icon: CreditCard },
        { id: 'transaction-history', label: 'Transaction History', icon: List },
        { id: 'payment-methods', label: 'Payment Methods', icon: DollarSign },
        { id: 'gateway-management', label: 'Gateway Management', icon: Settings },
        { id: 'fraud-detection', label: 'Fraud Detection', icon: Shield },
        { id: 'chargeback-management', label: 'Chargeback Management', icon: RotateCcw },
        { id: 'settlement-reports', label: 'Settlement Reports', icon: FileText },
        { id: 'payment-analytics', label: 'Payment Analytics', icon: BarChart3 },
        { id: 'reconciliation', label: 'Reconciliation', icon: Balance },
        { id: 'payout-management', label: 'Payout Management', icon: Upload }
      ]
    },
    {
      id: 'logistics-management',
      label: 'Logistics Management',
      icon: Truck,
      color: 'text-yellow-600',
      items: [
        { id: 'shipping-zones', label: 'Shipping Zones', icon: MapPin },
        { id: 'courier-partners', label: 'Courier Partners', icon: Truck },
        { id: 'delivery-tracking', label: 'Delivery Tracking', icon: MapPin },
        { id: 'delivery-performance', label: 'Delivery Performance', icon: Target },
        { id: 'route-optimization', label: 'Route Optimization', icon: MapPin },
        { id: 'warehouse-management', label: 'Warehouse Management', icon: Archive },
        { id: 'inventory-tracking', label: 'Inventory Tracking', icon: Search },
        { id: 'shipping-rates', label: 'Shipping Rates', icon: DollarSign },
        { id: 'packaging-management', label: 'Packaging Management', icon: Package },
        { id: 'return-management', label: 'Return Management', icon: RotateCcw }
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      color: 'text-red-600',
      items: [
        { id: 'security-overview', label: 'Security Overview', icon: Shield },
        { id: 'access-control', label: 'Access Control', icon: Key },
        { id: 'user-permissions', label: 'User Permissions', icon: Lock },
        { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
        { id: 'security-alerts', label: 'Security Alerts', icon: AlertTriangle },
        { id: 'threat-monitoring', label: 'Threat Monitoring', icon: Eye },
        { id: 'firewall-settings', label: 'Firewall Settings', icon: Shield },
        { id: 'backup-management', label: 'Backup Management', icon: Archive },
        { id: 'data-protection', label: 'Data Protection', icon: Lock },
        { id: 'compliance-management', label: 'Compliance Management', icon: FileText }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-600',
      items: [
        { id: 'general-settings', label: 'General Settings', icon: Settings },
        { id: 'system-configuration', label: 'System Configuration', icon: Settings },
        { id: 'email-settings', label: 'Email Settings', icon: Mail },
        { id: 'payment-settings', label: 'Payment Settings', icon: CreditCard },
        { id: 'shipping-settings', label: 'Shipping Settings', icon: Truck },
        { id: 'tax-settings', label: 'Tax Settings', icon: Percent },
        { id: 'currency-settings', label: 'Currency Settings', icon: DollarSign },
        { id: 'language-settings', label: 'Language Settings', icon: Globe },
        { id: 'notification-settings', label: 'Notification Settings', icon: Bell },
        { id: 'security-settings', label: 'Security Settings', icon: Shield },
        { id: 'api-management', label: 'API Management', icon: Database },
        { id: 'integration-settings', label: 'Integration Settings', icon: Link2 },
        { id: 'backup-settings', label: 'Backup Settings', icon: Archive },
        { id: 'maintenance-mode', label: 'Maintenance Mode', icon: Settings },
        { id: 'system-logs', label: 'System Logs', icon: FileText }
      ]
    }
  ];

  return (
    <div className={`fixed left-0 top-[125px] bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800 transition-all duration-300 z-30 shadow-lg border-r border-gray-200 ${
      collapsed ? 'w-16' : 'w-64'
    }`} style={{ height: 'calc(100vh - 125px + 216px)' }}>
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
            {menuSections.map((section) => {
              const SectionIcon = section.icon;
              const isExpanded = expandedSections.includes(section.id);
              
              return (
                <div key={section.id} className="mb-2">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/80 hover:shadow-sm transition-all duration-200 rounded-lg text-xs group ${
                      activeTab === section.id ? 'bg-white shadow-md border-l-4 border-blue-500 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <SectionIcon 
                        size={16} 
                        className={`flex-shrink-0 transition-colors ${
                          activeTab === section.id ? 'text-blue-600' : section.color
                        } group-hover:${section.color}`} 
                      />
                      {!collapsed && (
                        <span className="ml-2.5 font-medium">{section.label}</span>
                      )}
                    </div>
                    {!collapsed && (
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Submenu Items */}
                  {isExpanded && !collapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = activeTab === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-3 py-2 text-left hover:bg-white/60 hover:shadow-sm transition-all duration-200 rounded-md text-xs ${
                              isActive ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500' : 'text-gray-600'
                            }`}
                          >
                            <ItemIcon 
                              size={14} 
                              className={`flex-shrink-0 mr-2 ${
                                isActive ? 'text-blue-600' : 'text-gray-500'
                              }`} 
                            />
                            <span className="font-medium">{item.label}</span>
                          </button>
                        );
                      })}
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
