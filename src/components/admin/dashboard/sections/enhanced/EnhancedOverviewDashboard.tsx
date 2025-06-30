import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, Filter, Download, RefreshCw, ChevronDown, 
  TrendingUp, TrendingDown, Eye, Users, Package, 
  ShoppingCart, DollarSign, AlertTriangle, CheckCircle,
  Clock, Bell, Settings, BarChart3, PieChart, Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Enhanced Types for Bangladesh ecommerce platform
interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  target?: number;
  currency?: 'BDT' | 'USD';
  icon: typeof DollarSign;
  color: string;
  bgColor: string;
  description?: string;
}

interface VendorMetric {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  products: number;
  rating: number;
  location: string;
  paymentMethods: string[];
  status: 'active' | 'pending' | 'suspended';
  kycStatus: 'verified' | 'pending' | 'rejected';
  category: string;
}

interface OrderAnalytics {
  id: string;
  region: string;
  orders: number;
  revenue: number;
  averageValue: number;
  paymentMethod: string;
  courierPartner: string;
  deliveryRate: number;
}

interface SystemHealthMetric {
  service: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

// Main Dashboard Component
export const EnhancedGetItDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'bn'>('en');
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mock data - In production, this would come from API
  const dashboardMetrics: DashboardMetric[] = useMemo(() => [
    {
      id: 'revenue',
      title: selectedLanguage === 'bn' ? 'মোট আয়' : 'Total Revenue',
      value: selectedLanguage === 'bn' ? '৳২৮,৪৫,৬৭০' : '₹28,45,670',
      change: 28.5,
      changeType: 'increase',
      period: selectedLanguage === 'bn' ? 'এই মাসে' : 'This Month',
      target: 3000000,
      currency: 'BDT',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: selectedLanguage === 'bn' ? 'সকল পেমেন্ট পদ্ধতি' : 'All payment methods'
    },
    {
      id: 'vendors',
      title: selectedLanguage === 'bn' ? 'সক্রিয় বিক্রেতা' : 'Active Vendors',
      value: '1,247',
      change: 12.3,
      changeType: 'increase',
      period: selectedLanguage === 'bn' ? 'এই সপ্তাহে' : 'This Week',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: selectedLanguage === 'bn' ? 'যাচাইকৃত বিক্রেতা' : 'Verified vendors'
    },
    {
      id: 'orders',
      title: selectedLanguage === 'bn' ? 'মোট অর্ডার' : 'Total Orders',
      value: '5,289',
      change: 42.8,
      changeType: 'increase',
      period: selectedLanguage === 'bn' ? 'এই মাসে' : 'This Month',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: selectedLanguage === 'bn' ? 'সব পণ্য বিভাগ' : 'All categories'
    },
    {
      id: 'customers',
      title: selectedLanguage === 'bn' ? 'সন্তুষ্ট গ্রাহক' : 'Happy Customers',
      value: '12,456',
      change: 56.7,
      changeType: 'increase',
      period: selectedLanguage === 'bn' ? 'মোট সক্রিয়' : 'Total Active',
      icon: CheckCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      description: selectedLanguage === 'bn' ? '৪.৮+ রেটিং' : '4.8+ rating'
    }
  ], [selectedLanguage]);

  const vendorMetrics: VendorMetric[] = useMemo(() => [
    {
      id: 'vendor1',
      name: selectedLanguage === 'bn' ? 'রহিম ট্রেডার্স, ঢাকা' : 'Rahim Traders, Dhaka',
      revenue: 2845670,
      orders: 1234,
      products: 456,
      rating: 4.8,
      location: selectedLanguage === 'bn' ? 'ঢাকা' : 'Dhaka',
      paymentMethods: ['bKash', 'Nagad', 'COD'],
      status: 'active',
      kycStatus: 'verified',
      category: selectedLanguage === 'bn' ? 'ইলেকট্রনিক্স' : 'Electronics'
    },
    {
      id: 'vendor2',
      name: selectedLanguage === 'bn' ? 'করিম এন্টারপ্রাইজ, চট্টগ্রাম' : 'Karim Enterprise, Chittagong',
      revenue: 1789543,
      orders: 892,
      products: 234,
      rating: 4.6,
      location: selectedLanguage === 'bn' ? 'চট্টগ্রাম' : 'Chittagong',
      paymentMethods: ['Rocket', 'bKash', 'COD'],
      status: 'active',
      kycStatus: 'verified',
      category: selectedLanguage === 'bn' ? 'ফ্যাশন' : 'Fashion'
    }
  ], [selectedLanguage]);

  const orderAnalytics: OrderAnalytics[] = useMemo(() => [
    {
      id: 'dhaka',
      region: selectedLanguage === 'bn' ? 'ঢাকা বিভাগ' : 'Dhaka Division',
      orders: 2456,
      revenue: 12456780,
      averageValue: 5067,
      paymentMethod: 'bKash',
      courierPartner: 'Pathao',
      deliveryRate: 96.5
    },
    {
      id: 'chittagong',
      region: selectedLanguage === 'bn' ? 'চট্টগ্রাম বিভাগ' : 'Chittagong Division',
      orders: 1834,
      revenue: 8234567,
      averageValue: 4489,
      paymentMethod: 'Nagad',
      courierPartner: 'Paperfly',
      deliveryRate: 94.2
    }
  ], [selectedLanguage]);

  const systemHealth: SystemHealthMetric[] = useMemo(() => [
    {
      service: 'Payment Gateway',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 145,
      lastChecked: '2 mins ago'
    },
    {
      service: 'bKash Integration',
      status: 'healthy',
      uptime: 99.7,
      responseTime: 267,
      lastChecked: '1 min ago'
    },
    {
      service: 'Pathao Delivery',
      status: 'warning',
      uptime: 98.5,
      responseTime: 834,
      lastChecked: '3 mins ago'
    },
    {
      service: 'SMS Gateway',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 123,
      lastChecked: '1 min ago'
    }
  ], []);

  // Handlers
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshTime(new Date());
    setIsLoading(false);
  }, []);

  const handleExport = useCallback(() => {
    // In production, this would generate and download reports
    console.log('Exporting dashboard data...');
  }, []);

  const toggleLanguage = useCallback(() => {
    setSelectedLanguage(prev => prev === 'en' ? 'bn' : 'en');
  }, []);

  // Components
  const MetricCard: React.FC<{ metric: DashboardMetric }> = ({ metric }) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={`absolute top-0 left-0 w-full h-1 ${metric.bgColor}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {metric.title}
        </CardTitle>
        <div className={`p-2 ${metric.bgColor} rounded-lg`}>
          <metric.icon className={`h-4 w-4 ${metric.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs">
            {metric.changeType === 'increase' ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : metric.changeType === 'decrease' ? (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            ) : (
              <Activity className="h-3 w-3 text-gray-500 mr-1" />
            )}
            <span className={`font-medium ${
              metric.changeType === 'increase' ? 'text-green-600' : 
              metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
            <span className="text-gray-500 ml-1">{metric.period}</span>
          </div>
        </div>
        {metric.description && (
          <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
        )}
      </CardContent>
    </Card>
  );

  const VendorCard: React.FC<{ vendor: VendorMetric }> = ({ vendor }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{vendor.name}</h3>
            <p className="text-xs text-gray-500">{vendor.location}</p>
          </div>
          <div className="flex gap-1">
            <Badge 
              variant={vendor.status === 'active' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {vendor.status}
            </Badge>
            <Badge 
              variant={vendor.kycStatus === 'verified' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {vendor.kycStatus}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <span className="text-gray-500">Revenue:</span>
            <span className="font-medium ml-1">
              {selectedLanguage === 'bn' ? '৳' : '₹'}{vendor.revenue.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Orders:</span>
            <span className="font-medium ml-1">{vendor.orders}</span>
          </div>
          <div>
            <span className="text-gray-500">Products:</span>
            <span className="font-medium ml-1">{vendor.products}</span>
          </div>
          <div>
            <span className="text-gray-500">Rating:</span>
            <span className="font-medium ml-1">★ {vendor.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {vendor.paymentMethods.map(method => (
            <Badge key={method} variant="outline" className="text-xs">
              {method}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const SystemHealthCard: React.FC<{ health: SystemHealthMetric }> = ({ health }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          health.status === 'healthy' ? 'bg-green-500' :
          health.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <div>
          <p className="font-medium text-sm">{health.service}</p>
          <p className="text-xs text-gray-500">{health.uptime}% uptime</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{health.responseTime}ms</p>
        <p className="text-xs text-gray-500">{health.lastChecked}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedLanguage === 'bn' ? 'গেটইট ড্যাশবোর্ড' : 'GetIt Dashboard'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedLanguage === 'bn' ? 'মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম' : 'Multi-Vendor Ecommerce Platform'}
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                🇧🇩 Bangladesh
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="text-xs"
              >
                {selectedLanguage === 'bn' ? 'English' : 'বাংলা'}
              </Button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={selectedLanguage === 'bn' ? 'মেট্রিক্স খুঁজুন...' : 'Search metrics...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 h-9"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {selectedLanguage === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {selectedLanguage === 'bn' ? 'রিপোর্ট' : 'Export'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview" className="text-xs lg:text-sm">
              {selectedLanguage === 'bn' ? 'ওভারভিউ' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="vendors" className="text-xs lg:text-sm">
              {selectedLanguage === 'bn' ? 'বিক্রেতা' : 'Vendors'}
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs lg:text-sm">
              {selectedLanguage === 'bn' ? 'অর্ডার' : 'Orders'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs lg:text-sm">
              {selectedLanguage === 'bn' ? 'বিশ্লেষণ' : 'Analytics'}
            </TabsTrigger>
            <TabsTrigger value="health" className="text-xs lg:text-sm">
              {selectedLanguage === 'bn' ? 'স্বাস্থ্য' : 'Health'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment Methods Analytics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    {selectedLanguage === 'bn' ? 'পেমেন্ট পদ্ধতি বিতরণ' : 'Payment Method Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { method: 'bKash', percentage: 42, color: 'bg-pink-500' },
                      { method: 'Nagad', percentage: 28, color: 'bg-orange-500' },
                      { method: 'Cash on Delivery', percentage: 20, color: 'bg-green-500' },
                      { method: 'Rocket', percentage: 10, color: 'bg-purple-500' }
                    ].map(payment => (
                      <div key={payment.method} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded ${payment.color}`} />
                          <span className="text-sm font-medium">{payment.method}</span>
                        </div>
                        <div className="text-sm text-gray-600">{payment.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Regional Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {selectedLanguage === 'bn' ? 'আঞ্চলিক কর্মক্ষমতা' : 'Regional Performance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderAnalytics.map(region => (
                      <div key={region.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{region.region}</h4>
                          <Badge variant="outline" className="text-xs">
                            {region.deliveryRate}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>Orders: {region.orders}</div>
                          <div>Revenue: {selectedLanguage === 'bn' ? '৳' : '₹'}{region.revenue.toLocaleString()}</div>
                          <div>Avg: {selectedLanguage === 'bn' ? '৳' : '₹'}{region.averageValue}</div>
                          <div>Method: {region.paymentMethod}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedLanguage === 'bn' ? 'শীর্ষ পারফরমিং বিক্রেতা' : 'Top Performing Vendors'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {vendorMetrics.map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Courier Partners Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedLanguage === 'bn' ? 'কুরিয়ার পার্টনার পারফরমেন্স' : 'Courier Partner Performance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Pathao', deliveryRate: 96.5, avgTime: '24h', orders: 1456 },
                      { name: 'Paperfly', deliveryRate: 94.2, avgTime: '36h', orders: 1234 },
                      { name: 'Sundarban', deliveryRate: 92.8, avgTime: '48h', orders: 892 },
                      { name: 'RedX', deliveryRate: 95.1, avgTime: '30h', orders: 678 }
                    ].map(courier => (
                      <div key={courier.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{courier.name}</p>
                          <p className="text-xs text-gray-500">{courier.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{courier.deliveryRate}%</p>
                          <p className="text-xs text-gray-500">{courier.avgTime} avg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedLanguage === 'bn' ? 'অর্ডার অবস্থা বিতরণ' : 'Order Status Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { status: 'Delivered', count: 3456, color: 'bg-green-500' },
                      { status: 'Processing', count: 892, color: 'bg-blue-500' },
                      { status: 'Shipped', count: 456, color: 'bg-yellow-500' },
                      { status: 'Cancelled', count: 123, color: 'bg-red-500' }
                    ].map(status => (
                      <div key={status.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded ${status.color}`} />
                          <span className="text-sm font-medium">{status.status}</span>
                        </div>
                        <div className="text-sm text-gray-600">{status.count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedLanguage === 'bn' ? 'উন্নত বিশ্লেষণ' : 'Advanced Analytics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Festival Analytics */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      {selectedLanguage === 'bn' ? 'উৎসবের বিশ্লেষণ' : 'Festival Analytics'}
                    </h3>
                    <div className="space-y-2">
                      {[
                        { festival: 'Eid ul-Fitr', impact: '+287%', period: 'Apr 2024' },
                        { festival: 'Durga Puja', impact: '+156%', period: 'Oct 2023' },
                        { festival: 'Pohela Boishakh', impact: '+89%', period: 'Apr 2024' }
                      ].map(festival => (
                        <div key={festival.festival} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{festival.festival}</span>
                          <div className="text-right">
                            <span className="text-sm text-green-600 font-medium">{festival.impact}</span>
                            <p className="text-xs text-gray-500">{festival.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Behavior */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      {selectedLanguage === 'bn' ? 'গ্রাহক আচরণ' : 'Customer Behavior'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Mobile Shoppers</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Repeat Customers</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Session Duration</span>
                        <span className="text-sm font-medium">12m 34s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cart Abandonment</span>
                        <span className="text-sm font-medium">24%</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Insights */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      {selectedLanguage === 'bn' ? 'পণ্য অন্তর্দৃষ্টি' : 'Product Insights'}
                    </h3>
                    <div className="space-y-2">
                      {[
                        { category: 'Electronics', growth: '+45%' },
                        { category: 'Fashion', growth: '+23%' },
                        { category: 'Home & Kitchen', growth: '+67%' },
                        { category: 'Health & Beauty', growth: '+34%' }
                      ].map(product => (
                        <div key={product.category} className="flex justify-between items-center">
                          <span className="text-sm">{product.category}</span>
                          <span className="text-sm font-medium text-green-600">{product.growth}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {selectedLanguage === 'bn' ? 'সিস্টেম স্বাস্থ্য' : 'System Health'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemHealth.map(health => (
                      <SystemHealthCard key={health.service} health={health} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {selectedLanguage === 'bn' ? 'সাম্প্রতিক সতর্কতা' : 'Recent Alerts'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        type: 'warning',
                        message: 'Pathao API response time increased',
                        time: '5 mins ago'
                      },
                      {
                        type: 'info',
                        message: 'New vendor registration: TechMart Dhaka',
                        time: '15 mins ago'
                      },
                      {
                        type: 'success',
                        message: 'bKash integration successfully updated',
                        time: '1 hour ago'
                      }
                    ].map((alert, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.type === 'warning' ? 'bg-yellow-500' :
                          alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="px-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              {selectedLanguage === 'bn' ? 'শেষ আপডেট:' : 'Last updated:'} {refreshTime.toLocaleTimeString()}
            </div>
            <div>
              {selectedLanguage === 'bn' ? 'গেটইট মাল্টি-ভেন্ডর ই-কমার্স © ২০২৫' : 'GetIt Multi-Vendor Ecommerce © 2025'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedGetItDashboard;