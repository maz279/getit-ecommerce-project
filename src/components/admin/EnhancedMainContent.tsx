
import React, { useState } from 'react';
import { 
  Home, 
  Clock, 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  DollarSign,
  BarChart3,
  Filter,
  Search,
  Download,
  RefreshCw,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnhancedMainContentProps {
  activeTab: string;
}

export const EnhancedMainContent: React.FC<EnhancedMainContentProps> = ({ activeTab }) => {
  const [currentSubTab, setCurrentSubTab] = useState('overview');

  const getTabConfiguration = (tabId: string) => {
    const tabConfigs: Record<string, any> = {
      'dashboard': {
        title: 'Dashboard Overview',
        breadcrumb: 'Home > Dashboard > Overview',
        tabs: [
          { id: 'overview', label: 'Overview', active: true },
          { id: 'metrics', label: 'Metrics' },
          { id: 'performance', label: 'Performance' },
          { id: 'health', label: 'Health' },
          { id: 'reports', label: 'Reports' }
        ]
      },
      'user-management': {
        title: 'User Management',
        breadcrumb: 'Home > User Management > Customers',
        tabs: [
          { id: 'customers', label: 'Customers', active: true },
          { id: 'admins', label: 'Admins' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'verification', label: 'Verification' },
          { id: 'support', label: 'Support' }
        ]
      },
      'vendor-management': {
        title: 'Vendor Management',
        breadcrumb: 'Home > Vendor Management > Directory',
        tabs: [
          { id: 'directory', label: 'Directory', active: true },
          { id: 'applications', label: 'Applications' },
          { id: 'kyc', label: 'KYC' },
          { id: 'performance', label: 'Performance' },
          { id: 'payouts', label: 'Payouts' },
          { id: 'support', label: 'Support' }
        ]
      },
      'product-management': {
        title: 'Product Management',
        breadcrumb: 'Home > Product Management > Catalog',
        tabs: [
          { id: 'catalog', label: 'Catalog', active: true },
          { id: 'categories', label: 'Categories' },
          { id: 'moderation', label: 'Moderation' },
          { id: 'inventory', label: 'Inventory' },
          { id: 'analytics', label: 'Analytics' }
        ]
      },
      'order-management': {
        title: 'Order Management',
        breadcrumb: 'Home > Order Management > Overview',
        tabs: [
          { id: 'overview', label: 'Overview', active: true },
          { id: 'processing', label: 'Processing' },
          { id: 'payments', label: 'Payments' },
          { id: 'shipping', label: 'Shipping' },
          { id: 'analytics', label: 'Analytics' }
        ]
      },
      'financial-management': {
        title: 'Financial Management',
        breadcrumb: 'Home > Financial Management > Revenue',
        tabs: [
          { id: 'revenue', label: 'Revenue', active: true },
          { id: 'gateways', label: 'Gateways' },
          { id: 'payouts', label: 'Payouts' },
          { id: 'reports', label: 'Reports' },
          { id: 'monitoring', label: 'Monitoring' }
        ]
      }
    };

    return tabConfigs[tabId] || tabConfigs['dashboard'];
  };

  const config = getTabConfiguration(activeTab);

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold text-blue-800">BDT 2,34,567</p>
                <p className="text-xs text-green-600 font-medium">+12.5% vs yesterday</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Users</p>
                <p className="text-2xl font-bold text-green-800">45,678</p>
                <p className="text-xs text-green-600 font-medium">+8.3% vs yesterday</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Vendors</p>
                <p className="text-2xl font-bold text-purple-800">1,234</p>
                <p className="text-xs text-green-600 font-medium">+15.2% vs yesterday</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Orders</p>
                <p className="text-2xl font-bold text-orange-800">8,901</p>
                <p className="text-xs text-green-600 font-medium">+6.7% vs yesterday</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Revenue Trend Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-600">Revenue Chart (6 months)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-green-600" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-600">Map of Bangladesh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-orange-600" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: '🔔', text: 'New vendor application received', time: '2 min ago' },
              { icon: '📦', text: '100 new products added today', time: '15 min ago' },
              { icon: '💰', text: 'BDT 45,000 in payouts processed', time: '1 hour ago' },
              { icon: '⚠️', text: '3 orders requiring attention', time: '2 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl mr-3">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVendorContent = () => (
    <div className="space-y-6">
      {/* Vendor Directory Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search Vendors..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Name A-Z</option>
                <option>Name Z-A</option>
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Photo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vendor Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Products</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'ABC Electronics', status: 'Active', products: '234', statusColor: 'bg-green-100 text-green-800' },
                  { name: 'Fashion House', status: 'Pending', products: '56', statusColor: 'bg-yellow-100 text-yellow-800' },
                  { name: 'Home Decor Ltd', status: 'Active', products: '189', statusColor: 'bg-green-100 text-green-800' }
                ].map((vendor, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">👤</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{vendor.name}</td>
                    <td className="py-3 px-4">
                      <Badge className={vendor.statusColor}>
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{vendor.products} items</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">Showing 1-10 of 1,234 vendors</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">← Previous</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next →</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrderContent = () => (
    <div className="space-y-6">
      {/* Order Overview Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Orders</option>
                <option>New Orders</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Failed</option>
              </select>
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                📊 CSV
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '12345', customer: 'John Rahman', amount: 'BDT 2,340', status: 'Processing', statusColor: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
                  { id: '12346', customer: 'Sarah Ahmed', amount: 'BDT 1,890', status: 'Shipped', statusColor: 'bg-blue-100 text-blue-800', icon: '🟢' },
                  { id: '12347', customer: 'Karim Hassan', amount: 'BDT 3,450', status: 'Failed', statusColor: 'bg-red-100 text-red-800', icon: '🔴' }
                ].map((order, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-blue-600">#{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4 font-medium">{order.amount}</td>
                    <td className="py-3 px-4">
                      <Badge className={order.statusColor}>
                        {order.icon} {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">Showing 1-25 of 8,901 orders</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">← Previous</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next →</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (activeTab.includes('dashboard') || activeTab === 'overview') {
      return renderDashboardContent();
    } else if (activeTab.includes('vendor')) {
      return renderVendorContent();
    } else if (activeTab.includes('order')) {
      return renderOrderContent();
    } else {
      return renderDashboardContent(); // Default fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <BarChart3 className="mr-3 h-6 w-6 text-blue-600" />
              {config.title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Breadcrumb: {config.breadcrumb}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex border-b overflow-x-auto">
          {config.tabs.map((tab: any, index: number) => (
            <button
              key={tab.id}
              onClick={() => setCurrentSubTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                currentSubTab === tab.id || (index === 0 && !currentSubTab)
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.active && (
                <Badge className="ml-2 bg-blue-500 text-white">Active</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
};
