
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, TrendingUp, TrendingDown, Eye, ShoppingCart, DollarSign, 
  Users, Target, Filter, Download, RefreshCw, Calendar, ArrowUpRight,
  ArrowDownRight, PieChart, LineChart, Activity, Zap, Star, AlertTriangle,
  Search, SortAsc, SortDesc, Plus, Edit, Trash2, MoreHorizontal
} from 'lucide-react';

interface CategoryAnalyticsData {
  id: string;
  name: string;
  views: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  avgOrderValue: number;
  returnRate: number;
  customerSatisfaction: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
  topProducts: string[];
  seasonality: 'high' | 'medium' | 'low';
}

export const CategoryAnalyticsContent: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for category analytics
  const categoryData: CategoryAnalyticsData[] = [
    {
      id: '1',
      name: 'Electronics & Technology',
      views: 125430,
      orders: 8765,
      revenue: 2850000,
      conversionRate: 7.2,
      avgOrderValue: 325,
      returnRate: 8.5,
      customerSatisfaction: 4.3,
      growth: 18.5,
      trend: 'up',
      topProducts: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Air M3'],
      seasonality: 'high'
    },
    {
      id: '2',
      name: 'Fashion & Clothing',
      views: 98765,
      orders: 12456,
      revenue: 1920000,
      conversionRate: 12.6,
      avgOrderValue: 154,
      returnRate: 15.2,
      customerSatisfaction: 4.1,
      growth: 12.3,
      trend: 'up',
      topProducts: ['Winter Jacket', 'Jeans Collection', 'T-Shirt Bundle'],
      seasonality: 'high'
    },
    {
      id: '3',
      name: 'Home & Living',
      views: 76543,
      orders: 6789,
      revenue: 1340000,
      conversionRate: 8.9,
      avgOrderValue: 197,
      returnRate: 6.8,
      customerSatisfaction: 4.5,
      growth: 22.7,
      trend: 'up',
      topProducts: ['Sofa Set', 'Dining Table', 'LED Lights'],
      seasonality: 'medium'
    },
    {
      id: '4',
      name: 'Health & Beauty',
      views: 65432,
      orders: 9876,
      revenue: 890000,
      conversionRate: 15.1,
      avgOrderValue: 90,
      returnRate: 4.2,
      customerSatisfaction: 4.6,
      growth: -3.2,
      trend: 'down',
      topProducts: ['Skincare Set', 'Vitamin Supplements', 'Hair Care'],
      seasonality: 'low'
    },
    {
      id: '5',
      name: 'Sports & Outdoor',
      views: 54321,
      orders: 4567,
      revenue: 756000,
      conversionRate: 8.4,
      avgOrderValue: 165,
      returnRate: 7.1,
      customerSatisfaction: 4.2,
      growth: 31.8,
      trend: 'up',
      topProducts: ['Running Shoes', 'Gym Equipment', 'Outdoor Gear'],
      seasonality: 'medium'
    }
  ];

  const overallMetrics = {
    totalRevenue: categoryData.reduce((sum, cat) => sum + cat.revenue, 0),
    totalOrders: categoryData.reduce((sum, cat) => sum + cat.orders, 0),
    totalViews: categoryData.reduce((sum, cat) => sum + cat.views, 0),
    avgConversionRate: categoryData.reduce((sum, cat) => sum + cat.conversionRate, 0) / categoryData.length,
    avgSatisfaction: categoryData.reduce((sum, cat) => sum + cat.customerSatisfaction, 0) / categoryData.length
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeasonalityColor = (seasonality: string) => {
    switch (seasonality) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
              Category Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              🗂️ Product Management → Category Management → Category Analytics
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Target className="h-3 w-3 mr-1" />
              Comprehensive category performance analysis and optimization insights
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{(overallMetrics.totalRevenue / 1000000).toFixed(1)}M</div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+15.8% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.totalOrders.toLocaleString()}</div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+12.4% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(overallMetrics.totalViews / 1000).toFixed(0)}K</div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+8.7% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Avg Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.avgConversionRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+2.3% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Avg Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.avgSatisfaction.toFixed(1)}/5</div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+0.2 vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="performance">🎯 Performance</TabsTrigger>
          <TabsTrigger value="trends">📈 Trends</TabsTrigger>
          <TabsTrigger value="comparison">⚖️ Comparison</TabsTrigger>
          <TabsTrigger value="insights">💡 Insights</TabsTrigger>
          <TabsTrigger value="optimization">🚀 Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Category Performance Overview</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search categories..."
                        className="pl-8 w-64"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="orders">Orders</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="conversion">Conversion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <Badge className={getSeasonalityColor(category.seasonality)}>
                            {category.seasonality} seasonality
                          </Badge>
                          {getTrendIcon(category.trend)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Revenue</p>
                          <p className="font-bold text-green-600">৳{(category.revenue / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Orders</p>
                          <p className="font-bold">{category.orders.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Views</p>
                          <p className="font-bold">{(category.views / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Conversion</p>
                          <p className="font-bold">{category.conversionRate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">AOV</p>
                          <p className="font-bold">৳{category.avgOrderValue}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Return Rate</p>
                          <p className="font-bold text-orange-600">{category.returnRate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Growth</p>
                          <p className={`font-bold ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {category.growth > 0 ? '+' : ''}{category.growth}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600 mb-2">Top Products:</p>
                        <div className="flex flex-wrap gap-2">
                          {category.topProducts.map((product) => (
                            <Badge key={product} variant="outline">{product}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Deep Dive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Conversion Rate</span>
                          <span className="font-medium">{category.conversionRate}%</span>
                        </div>
                        <Progress value={category.conversionRate} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Customer Satisfaction</span>
                          <span className="font-medium">{category.customerSatisfaction}/5</span>
                        </div>
                        <Progress value={(category.customerSatisfaction / 5) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Return Rate</span>
                          <span className="font-medium text-orange-600">{category.returnRate}%</span>
                        </div>
                        <Progress value={category.returnRate} className="h-2" />
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Growth Trend</span>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(category.trend)}
                            <span className={`text-sm font-medium ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {category.growth > 0 ? '+' : ''}{category.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Category Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed trend analysis charts and seasonal patterns will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Category Comparison & Benchmarking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Side-by-side category comparison tools and industry benchmarks will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Growth Opportunity</h4>
                  </div>
                  <p className="text-blue-700">Sports & Outdoor category shows 31.8% growth. Consider increasing inventory and marketing spend.</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Attention Required</h4>
                  </div>
                  <p className="text-orange-700">Health & Beauty category shows declining trend (-3.2%). Review product mix and pricing strategy.</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Top Performer</h4>
                  </div>
                  <p className="text-green-700">Home & Living has highest customer satisfaction (4.5/5) and strong growth (22.7%).</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Category Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Actionable optimization strategies and A/B testing recommendations will be provided here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
