
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, 
  ShoppingCart, Eye, DollarSign, Users, Target,
  Calendar, Filter, Download, RefreshCw
} from 'lucide-react';

export const CategoryPerformanceContent: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock performance data
  const performanceData = {
    totalRevenue: 2450000,
    totalOrders: 18567,
    conversionRate: 4.2,
    avgOrderValue: 132,
    topCategories: [
      { name: 'Electronics', revenue: 980000, orders: 5432, growth: 15.2, conversionRate: 5.1 },
      { name: 'Fashion', revenue: 650000, orders: 7891, growth: 8.7, conversionRate: 3.8 },
      { name: 'Home & Garden', revenue: 420000, orders: 3245, growth: -2.1, conversionRate: 4.5 },
      { name: 'Sports', revenue: 280000, orders: 1999, growth: 12.4, conversionRate: 3.2 },
      { name: 'Books', revenue: 120000, orders: 2890, growth: 5.6, conversionRate: 6.1 }
    ],
    categoryMetrics: [
      { category: 'Electronics', views: 125000, clicks: 15600, sales: 2340, rating: 4.3 },
      { category: 'Fashion', views: 89000, clicks: 12100, sales: 1890, rating: 4.1 },
      { category: 'Home & Garden', views: 67000, clicks: 8900, sales: 1234, rating: 4.5 },
      { category: 'Sports', views: 45000, clicks: 6700, sales: 890, rating: 4.2 },
      { category: 'Books', views: 34000, clicks: 5200, sales: 1456, rating: 4.7 }
    ]
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
              Category Performance Analytics
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              📊 Product Management → Category Management → Category Performance
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Target className="h-3 w-3 mr-1" />
              Comprehensive category performance insights and optimization tools
            </p>
          </div>
          <div className="flex space-x-2">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{performanceData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+12.5% vs last period</span>
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
            <div className="text-2xl font-bold">{performanceData.totalOrders.toLocaleString()}</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+8.3% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.conversionRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">-0.4% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{performanceData.avgOrderValue}</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+3.2% vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="categories">🏷️ Categories</TabsTrigger>
          <TabsTrigger value="trends">📈 Trends</TabsTrigger>
          <TabsTrigger value="comparison">⚖️ Comparison</TabsTrigger>
          <TabsTrigger value="optimization">🎯 Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.topCategories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-gray-600">{category.orders.toLocaleString()} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">৳{category.revenue.toLocaleString()}</p>
                        <div className="flex items-center space-x-1">
                          {category.growth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {category.growth > 0 ? '+' : ''}{category.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Category Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.categoryMetrics.map((metric) => (
                    <div key={metric.category} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{metric.category}</span>
                        <Badge variant="outline">Rating: {metric.rating}/5</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>Views</span>
                          </div>
                          <p className="font-semibold">{metric.views.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>Clicks</span>
                          </div>
                          <p className="font-semibold">{metric.clicks.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <ShoppingCart className="h-3 w-3" />
                            <span>Sales</span>
                          </div>
                          <p className="font-semibold">{metric.sales.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Click-through Rate</span>
                          <span>{((metric.clicks / metric.views) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(metric.clicks / metric.views) * 100} className="h-1" />
                        
                        <div className="flex justify-between text-xs">
                          <span>Conversion Rate</span>
                          <span>{((metric.sales / metric.clicks) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(metric.sales / metric.clicks) * 100} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Category Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceData.topCategories.map((category) => (
                  <div key={category.name} className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <Badge className={category.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {category.growth > 0 ? '+' : ''}{category.growth}% Growth
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-xl font-bold">৳{category.revenue.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="text-xl font-bold">{category.orders.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Conversion</p>
                        <p className="text-xl font-bold">{category.conversionRate}%</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">AOV</p>
                        <p className="text-xl font-bold">৳{Math.round(category.revenue / category.orders)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Performance trend charts and historical analysis will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Category Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Side-by-side category comparison tools will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Recommended Actions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                      <span className="text-sm">Improve Home & Garden category marketing</span>
                      <Badge variant="outline">High Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span className="text-sm">Optimize Electronics pricing strategy</span>
                      <Badge variant="outline">Medium Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="text-sm">Expand Fashion product range</span>
                      <Badge variant="outline">Low Priority</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
