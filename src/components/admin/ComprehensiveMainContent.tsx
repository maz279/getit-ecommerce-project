
import React, { useState } from 'react';
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
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Clock,
  Bell,
  FileText,
  CreditCard,
  Activity,
  Target,
  Zap,
  Database,
  UserCheck,
  Globe,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ComprehensiveMainContentProps {
  activeTab: string;
}

export const ComprehensiveMainContent: React.FC<ComprehensiveMainContentProps> = ({ activeTab }) => {
  const [currentSubTab, setCurrentSubTab] = useState('overview');

  // Configuration for all sections
  const getTabConfiguration = (tabId: string) => {
    const tabConfigs: Record<string, any> = {
      'dashboard': {
        title: 'Dashboard Overview',
        breadcrumb: 'Home > Dashboard > Overview',
        icon: BarChart3,
        tabs: [
          { id: 'overview', label: 'Overview', active: true },
          { id: 'real-time-metrics', label: 'Real-time Metrics' },
          { id: 'platform-performance', label: 'Platform Performance' },
          { id: 'system-health', label: 'System Health' },
          { id: 'quick-actions', label: 'Quick Actions' }
        ]
      },
      'user-management': {
        title: 'User Management',
        breadcrumb: 'Home > User Management > Customer Management',
        icon: Users,
        tabs: [
          { id: 'customer-management', label: 'Customer Management', active: true },
          { id: 'admin-users', label: 'Admin Users' },
          { id: 'user-analytics', label: 'User Analytics' },
          { id: 'account-verification', label: 'Verification' },
          { id: 'customer-support', label: 'Support' }
        ]
      },
      'vendor-management': {
        title: 'Vendor Management',
        breadcrumb: 'Home > Vendor Management > Directory',
        icon: Store,
        tabs: [
          { id: 'vendor-directory', label: 'Directory', active: true },
          { id: 'kyc-verification', label: 'KYC Verification' },
          { id: 'vendor-performance', label: 'Performance' },
          { id: 'vendor-financial', label: 'Financial' },
          { id: 'vendor-support', label: 'Support' }
        ]
      },
      'product-management': {
        title: 'Product Management',
        breadcrumb: 'Home > Product Management > Product Catalog',
        icon: Package,
        tabs: [
          { id: 'product-catalog', label: 'Product Catalog', active: true },
          { id: 'category-management', label: 'Categories' },
          { id: 'product-moderation', label: 'Moderation' },
          { id: 'inventory-management', label: 'Inventory' },
          { id: 'product-analytics', label: 'Analytics' }
        ]
      },
      'order-management': {
        title: 'Order Management',
        breadcrumb: 'Home > Order Management > Order Overview',
        icon: ShoppingCart,
        tabs: [
          { id: 'order-overview', label: 'Overview', active: true },
          { id: 'order-processing', label: 'Processing' },
          { id: 'payment-management', label: 'Payments' },
          { id: 'shipping-logistics', label: 'Shipping' },
          { id: 'order-analytics', label: 'Analytics' }
        ]
      },
      'financial-management': {
        title: 'Financial Management',
        breadcrumb: 'Home > Financial Management > Revenue Dashboard',
        icon: DollarSign,
        tabs: [
          { id: 'revenue-dashboard', label: 'Revenue', active: true },
          { id: 'payment-gateways', label: 'Gateways' },
          { id: 'vendor-payouts', label: 'Payouts' },
          { id: 'financial-reports', label: 'Reports' },
          { id: 'transaction-monitoring', label: 'Monitoring' }
        ]
      },
      'shipping-logistics': {
        title: 'Shipping & Logistics',
        breadcrumb: 'Home > Shipping & Logistics > Courier Partners',
        icon: Truck,
        tabs: [
          { id: 'courier-partners', label: 'Courier Partners', active: true },
          { id: 'delivery-management', label: 'Delivery Management' },
          { id: 'shipping-analytics', label: 'Analytics' },
          { id: 'returns-exchanges', label: 'Returns & Exchanges' }
        ]
      },
      'marketing-promotions': {
        title: 'Marketing & Promotions',
        breadcrumb: 'Home > Marketing & Promotions > Campaign Management',
        icon: Megaphone,
        tabs: [
          { id: 'campaign-management', label: 'Campaigns', active: true },
          { id: 'promotional-tools', label: 'Promotional Tools' },
          { id: 'content-management', label: 'Content Management' },
          { id: 'marketing-analytics', label: 'Analytics' }
        ]
      },
      'analytics-reports': {
        title: 'Analytics & Reports',
        breadcrumb: 'Home > Analytics & Reports > Business Intelligence',
        icon: BarChart3,
        tabs: [
          { id: 'business-intelligence', label: 'Business Intelligence', active: true },
          { id: 'sales-analytics', label: 'Sales Analytics' },
          { id: 'customer-analytics', label: 'Customer Analytics' },
          { id: 'financial-analytics', label: 'Financial Analytics' },
          { id: 'custom-reports', label: 'Custom Reports' }
        ]
      },
      'settings-configuration': {
        title: 'Settings & Configuration',
        breadcrumb: 'Home > Settings & Configuration > Platform Settings',
        icon: Settings,
        tabs: [
          { id: 'platform-settings', label: 'Platform Settings', active: true },
          { id: 'payment-configuration', label: 'Payment Config' },
          { id: 'shipping-configuration', label: 'Shipping Config' },
          { id: 'localization', label: 'Localization' },
          { id: 'system-administration', label: 'System Admin' }
        ]
      }
    };

    return tabConfigs[tabId] || tabConfigs['dashboard'];
  };

  const config = getTabConfiguration(activeTab);
  const IconComponent = config.icon;

  // Enhanced Dashboard Content
  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-800">৳ 2,34,567</p>
                <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +12.5% from yesterday
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-green-800">45,678</p>
                <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +8.3% from yesterday
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Active Vendors</p>
                <p className="text-3xl font-bold text-purple-800">1,234</p>
                <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +15.2% from yesterday
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Store className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-orange-800">8,901</p>
                <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +6.7% from yesterday
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="mr-3 h-5 w-5 text-blue-600" />
              Revenue Trend (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Interactive Revenue Chart</p>
                <p className="text-sm text-gray-500">Line chart showing 6-month trend</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="mr-3 h-5 w-5 text-green-600" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Bangladesh Map</p>
                <p className="text-sm text-gray-500">User distribution across divisions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Clock className="mr-3 h-5 w-5 text-orange-600" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: '🔔', text: 'New vendor application received from Dhaka Electronics', time: '2 min ago', type: 'info' },
              { icon: '📦', text: '100 new products added today across all categories', time: '15 min ago', type: 'success' },
              { icon: '💰', text: 'BDT 45,000 in vendor payouts processed successfully', time: '1 hour ago', type: 'success' },
              { icon: '⚠️', text: '3 orders requiring immediate attention for delivery issues', time: '2 hours ago', type: 'warning' },
              { icon: '🎯', text: 'Flash sale campaign started - 25% off electronics', time: '3 hours ago', type: 'info' },
              { icon: '📊', text: 'Weekly analytics report generated and sent to stakeholders', time: '4 hours ago', type: 'info' }
            ].map((activity, index) => (
              <div key={index} className={`flex items-center p-4 rounded-lg border-l-4 ${
                activity.type === 'success' ? 'bg-green-50 border-green-400' :
                activity.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <span className="text-2xl mr-4">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Generic content renderer for other sections
  const renderGenericContent = (sectionName: string, stats: any[], features: string[]) => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br ${stat.gradient}`}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                <div className={`text-xs ${stat.labelColor}`}>{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{sectionName} Management</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={`Search ${sectionName.toLowerCase()}...`}
                  className="pl-10 pr-4 py-2"
                />
              </div>
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filter
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow border-l-4 border-blue-400">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{feature}</h3>
                      <p className="text-sm text-gray-500">Manage and monitor</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    const sectionConfigs = {
      'product-management': {
        name: 'Product',
        stats: [
          { icon: '📦', value: '12,345', label: 'Total Products', gradient: 'from-blue-50 to-blue-100', textColor: 'text-blue-800', labelColor: 'text-blue-600' },
          { icon: '✅', value: '11,890', label: 'Active Products', gradient: 'from-green-50 to-green-100', textColor: 'text-green-800', labelColor: 'text-green-600' },
          { icon: '⏳', value: '156', label: 'Pending Approval', gradient: 'from-yellow-50 to-yellow-100', textColor: 'text-yellow-800', labelColor: 'text-yellow-600' },
          { icon: '🚫', value: '23', label: 'Rejected', gradient: 'from-red-50 to-red-100', textColor: 'text-red-800', labelColor: 'text-red-600' }
        ],
        features: ['Product Catalog Management', 'Category Structure', 'Quality Control', 'Inventory Tracking', 'Performance Analytics', 'Import/Export Tools']
      },
      'financial-management': {
        name: 'Financial',
        stats: [
          { icon: '💰', value: '৳ 45L', label: 'Monthly Revenue', gradient: 'from-green-50 to-green-100', textColor: 'text-green-800', labelColor: 'text-green-600' },
          { icon: '🏪', value: '৳ 12L', label: 'Vendor Payouts', gradient: 'from-blue-50 to-blue-100', textColor: 'text-blue-800', labelColor: 'text-blue-600' },
          { icon: '📊', value: '8.5%', label: 'Commission Rate', gradient: 'from-purple-50 to-purple-100', textColor: 'text-purple-800', labelColor: 'text-purple-600' },
          { icon: '🔒', value: '99.8%', label: 'Payment Success', gradient: 'from-emerald-50 to-emerald-100', textColor: 'text-emerald-800', labelColor: 'text-emerald-600' }
        ],
        features: ['Revenue Tracking', 'Payment Gateways', 'Vendor Payouts', 'Transaction Monitoring', 'Financial Reports', 'Fraud Detection']
      },
      'shipping-logistics': {
        name: 'Shipping',
        stats: [
          { icon: '🚛', value: '1,234', label: 'Daily Deliveries', gradient: 'from-indigo-50 to-indigo-100', textColor: 'text-indigo-800', labelColor: 'text-indigo-600' },
          { icon: '⚡', value: '24h', label: 'Avg Delivery Time', gradient: 'from-yellow-50 to-yellow-100', textColor: 'text-yellow-800', labelColor: 'text-yellow-600' },
          { icon: '📍', value: '64', label: 'Delivery Zones', gradient: 'from-green-50 to-green-100', textColor: 'text-green-800', labelColor: 'text-green-600' },
          { icon: '🎯', value: '96%', label: 'Success Rate', gradient: 'from-emerald-50 to-emerald-100', textColor: 'text-emerald-800', labelColor: 'text-emerald-600' }
        ],
        features: ['Courier Management', 'Delivery Tracking', 'Zone Configuration', 'Returns Processing', 'Performance Analytics', 'Route Optimization']
      },
      'marketing-promotions': {
        name: 'Marketing',
        stats: [
          { icon: '📢', value: '25', label: 'Active Campaigns', gradient: 'from-pink-50 to-pink-100', textColor: 'text-pink-800', labelColor: 'text-pink-600' },
          { icon: '🎯', value: '15%', label: 'Conversion Rate', gradient: 'from-purple-50 to-purple-100', textColor: 'text-purple-800', labelColor: 'text-purple-600' },
          { icon: '💳', value: '450', label: 'Active Coupons', gradient: 'from-blue-50 to-blue-100', textColor: 'text-blue-800', labelColor: 'text-blue-600' },
          { icon: '📈', value: '₹ 8.5L', label: 'Campaign ROI', gradient: 'from-green-50 to-green-100', textColor: 'text-green-800', labelColor: 'text-green-600' }
        ],
        features: ['Campaign Management', 'Promotional Tools', 'Content Creation', 'Email Marketing', 'Social Media', 'Analytics & ROI']
      },
      'analytics-reports': {
        name: 'Analytics',
        stats: [
          { icon: '📊', value: '500+', label: 'Data Points', gradient: 'from-violet-50 to-violet-100', textColor: 'text-violet-800', labelColor: 'text-violet-600' },
          { icon: '📈', value: '25', label: 'Key Metrics', gradient: 'from-blue-50 to-blue-100', textColor: 'text-blue-800', labelColor: 'text-blue-600' },
          { icon: '📋', value: '150', label: 'Custom Reports', gradient: 'from-green-50 to-green-100', textColor: 'text-green-800', labelColor: 'text-green-600' },
          { icon: '⚡', value: 'Real-time', label: 'Data Updates', gradient: 'from-yellow-50 to-yellow-100', textColor: 'text-yellow-800', labelColor: 'text-yellow-600' }
        ],
        features: ['Business Intelligence', 'Sales Analytics', 'Customer Insights', 'Financial Forecasting', 'Custom Reports', 'Data Export']
      },
      'settings-configuration': {
        name: 'Settings',
        stats: [
          { icon: '⚙️', value: '99.9%', label: 'System Uptime', gradient: 'from-gray-50 to-gray-100', textColor: 'text-gray-800', labelColor: 'text-gray-600' },
          { icon: '🔐', value: '256-bit', label: 'Encryption', gradient: 'from-blue-50 to-blue-100', textColor: 'text-blue-800', labelColor: 'text-blue-600' },
          { icon: '🌍', value: '3', label: 'Languages', gradient: 'from-green-50 to-green-100', textColor: 'text-green-800', labelColor: 'text-green-600' },
          { icon: '👥', value: '15', label: 'Admin Users', gradient: 'from-purple-50 to-purple-100', textColor: 'text-purple-800', labelColor: 'text-purple-600' }
        ],
        features: ['Platform Configuration', 'Security Settings', 'User Management', 'API Configuration', 'Backup Systems', 'System Maintenance']
      }
    };

    if (activeTab.includes('dashboard') || activeTab === 'overview') {
      return renderDashboardContent();
    } else if (sectionConfigs[activeTab]) {
      const config = sectionConfigs[activeTab];
      return renderGenericContent(config.name, config.stats, config.features);
    } else {
      return renderDashboardContent();
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <IconComponent className="mr-3 h-8 w-8 text-blue-600" />
              {config.title}
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              📍 Breadcrumb: {config.breadcrumb}
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {config.tabs.map((tab: any, index: number) => (
            <button
              key={tab.id}
              onClick={() => setCurrentSubTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 relative ${
                currentSubTab === tab.id || (index === 0 && !currentSubTab)
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.active && (
                <Badge className="ml-2 bg-blue-500 text-white text-xs">Active</Badge>
              )}
              {(currentSubTab === tab.id || (index === 0 && !currentSubTab)) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  );
};
