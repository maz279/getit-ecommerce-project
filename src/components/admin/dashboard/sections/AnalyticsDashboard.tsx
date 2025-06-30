
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Users,
  ShoppingCart,
  DollarSign,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  icon: typeof DollarSign;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const analyticsMetrics: AnalyticsMetric[] = [
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: '3.8%',
      change: 12.5,
      changeType: 'increase',
      period: 'vs last month',
      icon: TrendingUp,
      color: 'text-emerald-600'
    },
    {
      id: 'sessions',
      title: 'Total Sessions',
      value: '89,247',
      change: 8.2,
      changeType: 'increase',
      period: 'vs last month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 'avg_order',
      title: 'Avg Order Value',
      value: '₹2,456',
      change: -2.1,
      changeType: 'decrease',
      period: 'vs last month',
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
    {
      id: 'bounce_rate',
      title: 'Bounce Rate',
      value: '42.3%',
      change: -5.7,
      changeType: 'decrease',
      period: 'vs last month',
      icon: Activity,
      color: 'text-orange-600'
    }
  ];

  const salesChannelData: ChartData[] = [
    { name: 'Organic Search', value: 45672, percentage: 35.2 },
    { name: 'Direct Traffic', value: 32890, percentage: 25.3 },
    { name: 'Social Media', value: 28456, percentage: 21.9 },
    { name: 'Email Campaign', value: 15234, percentage: 11.7 },
    { name: 'Paid Ads', value: 7890, percentage: 6.1 }
  ];

  const topProductCategories: ChartData[] = [
    { name: 'Electronics', value: 125000, percentage: 32.5 },
    { name: 'Fashion', value: 89000, percentage: 23.1 },
    { name: 'Home & Kitchen', value: 67000, percentage: 17.4 },
    { name: 'Health & Beauty', value: 45000, percentage: 11.7 },
    { name: 'Sports & Outdoors', value: 58000, percentage: 15.1 }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshTime(new Date());
    setIsLoading(false);
  };

  const handleExport = () => {
    console.log('Exporting analytics data...');
  };

  const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {metric.title}
        </CardTitle>
        <metric.icon className={`h-4 w-4 ${metric.color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {metric.value}
        </div>
        <div className="flex items-center text-xs">
          <TrendingUp className={`h-3 w-3 mr-1 ${
            metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
          }`} />
          <span className={`font-medium ${
            metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </span>
          <span className="text-gray-500 ml-1">{metric.period}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive analytics and insights for your e-commerce platform
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Sales Channels Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesChannelData.map((channel, index) => (
                      <div key={channel.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full`} 
                               style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                          <span className="text-sm font-medium">{channel.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{channel.value.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{channel.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Top Product Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProductCategories.map((category, index) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-600">
                            ₹{category.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">124,567</div>
                    <div className="text-sm text-gray-600">Page Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">89,247</div>
                    <div className="text-sm text-gray-600">Unique Visitors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">5:23</div>
                    <div className="text-sm text-gray-600">Avg Session Duration</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">₹12,45,678</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">3,456</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">₹3,604</div>
                    <div className="text-sm text-gray-600">Avg Order Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">3.8%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">45,678</div>
                    <div className="text-sm text-gray-600">Total Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">12,345</div>
                    <div className="text-sm text-gray-600">New Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">67.8%</div>
                    <div className="text-sm text-gray-600">Returning Customers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-4">
        <div className="px-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>Last updated: {refreshTime.toLocaleTimeString()}</div>
            <div>Analytics Dashboard © 2025</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
