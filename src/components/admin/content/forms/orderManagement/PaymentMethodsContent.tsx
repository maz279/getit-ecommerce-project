
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  Edit,
  Plus,
  Settings,
  CreditCard,
  Smartphone,
  Building,
  Globe,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  FileText,
  Zap,
  Star,
  Activity
} from 'lucide-react';

export const PaymentMethodsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock payment methods data
  const paymentMethodsStats = {
    totalMethods: 12,
    activeMethods: 10,
    inactiveMethods: 2,
    pendingSetup: 1,
    totalTransactions: 45620,
    totalRevenue: 8945230,
    averageTransactionValue: 196.5,
    successRate: 97.2
  };

  const paymentMethods = [
    {
      id: 'pm001',
      name: 'Credit Card (Visa/Mastercard)',
      provider: 'Stripe',
      type: 'Credit Card',
      status: 'Active',
      setupDate: '2024-01-15',
      transactionCount: 15420,
      revenue: 3245000,
      successRate: 98.5,
      avgProcessingTime: '2.3s',
      fees: '2.9% + ৳3',
      regions: ['Bangladesh', 'Global'],
      currency: ['BDT', 'USD'],
      icon: CreditCard,
      color: 'blue'
    },
    {
      id: 'pm002',
      name: 'bKash',
      provider: 'bKash API',
      type: 'Mobile Banking',
      status: 'Active',
      setupDate: '2024-01-20',
      transactionCount: 12850,
      revenue: 2145000,
      successRate: 96.8,
      avgProcessingTime: '3.1s',
      fees: '1.85%',
      regions: ['Bangladesh'],
      currency: ['BDT'],
      icon: Smartphone,
      color: 'pink'
    },
    {
      id: 'pm003',
      name: 'Nagad',
      provider: 'Nagad API',
      type: 'Mobile Banking',
      status: 'Active',
      setupDate: '2024-02-01',
      transactionCount: 8745,
      revenue: 1564000,
      successRate: 95.2,
      avgProcessingTime: '2.8s',
      fees: '1.99%',
      regions: ['Bangladesh'],
      currency: ['BDT'],
      icon: Smartphone,
      color: 'orange'
    },
    {
      id: 'pm004',
      name: 'Rocket',
      provider: 'DBBL Rocket',
      type: 'Mobile Banking',
      status: 'Active',
      setupDate: '2024-02-10',
      transactionCount: 4520,
      revenue: 785000,
      successRate: 94.5,
      avgProcessingTime: '3.5s',
      fees: '2.25%',
      regions: ['Bangladesh'],
      currency: ['BDT'],
      icon: Smartphone,
      color: 'purple'
    },
    {
      id: 'pm005',
      name: 'Bank Transfer',
      provider: 'Local Banks',
      type: 'Bank Transfer',
      status: 'Active',
      setupDate: '2024-01-10',
      transactionCount: 2845,
      revenue: 942000,
      successRate: 99.1,
      avgProcessingTime: '1-2 business days',
      fees: '0.5%',
      regions: ['Bangladesh'],
      currency: ['BDT'],
      icon: Building,
      color: 'green'
    },
    {
      id: 'pm006',
      name: 'PayPal',
      provider: 'PayPal',
      type: 'Digital Wallet',
      status: 'Inactive',
      setupDate: '2024-03-01',
      transactionCount: 0,
      revenue: 0,
      successRate: 0,
      avgProcessingTime: 'N/A',
      fees: '3.4% + ৳5',
      regions: ['Global'],
      currency: ['USD', 'EUR'],
      icon: Globe,
      color: 'blue'
    },
    {
      id: 'pm007',
      name: 'SSLCOMMERZ',
      provider: 'SSLCOMMERZ',
      type: 'Payment Gateway',
      status: 'Active',
      setupDate: '2024-01-25',
      transactionCount: 1236,
      revenue: 263000,
      successRate: 97.8,
      avgProcessingTime: '2.1s',
      fees: '2.75%',
      regions: ['Bangladesh'],
      currency: ['BDT'],
      icon: Shield,
      color: 'indigo'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'maintenance':
        return <Settings className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Payment Methods Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Active Methods</p>
                <p className="text-3xl font-bold text-blue-800">{paymentMethodsStats.activeMethods}</p>
                <p className="text-xs text-blue-600 font-medium flex items-center mt-1">
                  <CheckCircle size={12} className="mr-1" />
                  {((paymentMethodsStats.activeMethods / paymentMethodsStats.totalMethods) * 100).toFixed(0)}% active
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Transactions</p>
                <p className="text-3xl font-bold text-green-800">{paymentMethodsStats.totalTransactions.toLocaleString()}</p>
                <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  {paymentMethodsStats.successRate}% success rate
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-800">৳ {paymentMethodsStats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-purple-600 font-medium flex items-center mt-1">
                  <DollarSign size={12} className="mr-1" />
                  Avg: ৳ {paymentMethodsStats.averageTransactionValue}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Pending Setup</p>
                <p className="text-3xl font-bold text-orange-800">{paymentMethodsStats.pendingSetup}</p>
                <p className="text-xs text-orange-600 font-medium flex items-center mt-1">
                  <Clock size={12} className="mr-1" />
                  Requires attention
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Performance Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-3 h-5 w-5 text-blue-600" />
              Revenue by Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.slice(0, 5).map((method, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full`} style={{ 
                      backgroundColor: `hsl(${index * 60}, 60%, 50%)` 
                    }}></div>
                    <div>
                      <p className="font-medium text-gray-800">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.transactionCount.toLocaleString()} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">৳ {method.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{method.successRate}% success</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-3 h-5 w-5 text-green-600" />
              Transaction Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Transaction Distribution Chart</p>
                <p className="text-sm text-gray-500">Payment method usage breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMethodsTab = () => (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search payment methods..."
                  className="pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                <option value="all">All Providers</option>
                <option value="stripe">Stripe</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="local">Local Banks</option>
              </select>
              <select 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">✅ Active</option>
                <option value="inactive">❌ Inactive</option>
                <option value="pending">⏳ Pending</option>
                <option value="maintenance">🔧 Maintenance</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method, index) => {
          const IconComponent = method.icon;
          return (
            <Card key={index} className={`border-l-4 hover:shadow-lg transition-shadow ${
              method.status === 'Active' ? 'border-l-green-500 bg-green-50' :
              method.status === 'Inactive' ? 'border-l-red-500 bg-red-50' :
              'border-l-yellow-500 bg-yellow-50'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${method.color}-100`}>
                      <IconComponent className={`h-6 w-6 text-${method.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.provider}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(method.status)} flex items-center space-x-1`}>
                    {getStatusIcon(method.status)}
                    <span>{method.status}</span>
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Transactions:</span>
                      <p className="font-medium">{method.transactionCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Revenue:</span>
                      <p className="font-medium">৳ {method.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Success Rate:</span>
                      <p className="font-medium text-green-600">{method.successRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Time:</span>
                      <p className="font-medium">{method.avgProcessingTime}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-500">Fees:</span>
                    <p className="font-medium text-orange-600">{method.fees}</p>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-500">Regions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {method.regions.map((region, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderConfigurationTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-3 h-5 w-5 text-purple-600" />
            Payment Method Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Global Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Global Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Currency
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="BDT">BDT - Bangladeshi Taka</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Timeout (seconds)
                  </label>
                  <Input type="number" defaultValue="300" className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-retry Failed Payments
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Transaction Amount
                  </label>
                  <Input type="number" defaultValue="10" className="w-full" />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3D Secure Authentication
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="always">Always Required</option>
                    <option value="adaptive">Adaptive (Risk-based)</option>
                    <option value="optional">Optional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fraud Detection Level
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="high">High Sensitivity</option>
                    <option value="medium">Medium Sensitivity</option>
                    <option value="low">Low Sensitivity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Transaction Limit
                  </label>
                  <Input type="number" defaultValue="100000" className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Security
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-3 h-5 w-5 text-green-600" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Performance Trends Chart</p>
                <p className="text-sm text-gray-500">Payment method success rates over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-3 h-5 w-5 text-blue-600" />
              Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Transaction Volume Chart</p>
                <p className="text-sm text-gray-500">Daily transaction volumes by method</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">97.2%</div>
              <div className="text-sm text-gray-600 mt-1">Average Success Rate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">2.8s</div>
              <div className="text-sm text-gray-600 mt-1">Average Processing Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">৳ 196.5</div>
              <div className="text-sm text-gray-600 mt-1">Average Transaction Value</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">0.3%</div>
              <div className="text-sm text-gray-600 mt-1">Failure Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <CreditCard className="mr-3 h-8 w-8 text-purple-600" />
              Payment Methods Management
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              📍 Order Management → Payment Management → Payment Methods
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="py-3 px-4 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="methods" className="py-3 px-4 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600">
              <CreditCard className="h-4 w-4 mr-2" />
              Methods
            </TabsTrigger>
            <TabsTrigger value="configuration" className="py-3 px-4 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="analytics" className="py-3 px-4 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600">
              <PieChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="methods" className="mt-6">
          {renderMethodsTab()}
        </TabsContent>

        <TabsContent value="configuration" className="mt-6">
          {renderConfigurationTab()}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {renderAnalyticsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
