
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Star, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Crown,
  Target,
  BarChart3,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const BestSellersContent: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for best sellers
  const bestSellersData = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      category: 'Electronics',
      vendor: 'TechCorp',
      unitsSold: 2847,
      revenue: 427050,
      growth: 23.5,
      rating: 4.8,
      stockLevel: 145,
      image: '/placeholder-product.jpg',
      rank: 1,
      previousRank: 2,
      daysInTop10: 45
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      category: 'Wearables',
      vendor: 'FitTech',
      unitsSold: 2134,
      revenue: 320100,
      growth: 18.2,
      rating: 4.6,
      stockLevel: 89,
      image: '/placeholder-product.jpg',
      rank: 2,
      previousRank: 1,
      daysInTop10: 67
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      category: 'Fashion',
      vendor: 'EcoWear',
      unitsSold: 1856,
      revenue: 92800,
      growth: 31.7,
      rating: 4.9,
      stockLevel: 234,
      image: '/placeholder-product.jpg',
      rank: 3,
      previousRank: 5,
      daysInTop10: 23
    }
  ];

  const trendData = [
    { date: '2024-01-01', sales: 1200, revenue: 18000, orders: 85 },
    { date: '2024-01-02', sales: 1450, revenue: 21750, orders: 92 },
    { date: '2024-01-03', sales: 1680, revenue: 25200, orders: 108 },
    { date: '2024-01-04', sales: 1520, revenue: 22800, orders: 98 },
    { date: '2024-01-05', sales: 1890, revenue: 28350, orders: 125 },
    { date: '2024-01-06', sales: 2100, revenue: 31500, orders: 142 },
    { date: '2024-01-07', sales: 1950, revenue: 29250, orders: 135 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Fashion', value: 28, color: '#10b981' },
    { name: 'Home & Garden', value: 18, color: '#f59e0b' },
    { name: 'Sports', value: 12, color: '#ef4444' },
    { name: 'Books', value: 7, color: '#8b5cf6' }
  ];

  const vendorPerformance = [
    { vendor: 'TechCorp', products: 12, totalSales: 156000, avgRating: 4.7, growth: 25.3 },
    { vendor: 'FashionHub', products: 8, totalSales: 89000, avgRating: 4.5, growth: 18.9 },
    { vendor: 'HomeEssentials', products: 15, totalSales: 125000, avgRating: 4.6, growth: 22.1 },
    { vendor: 'SportsPro', products: 6, totalSales: 67000, avgRating: 4.4, growth: 15.7 }
  ];

  const BestSellersHeader = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Crown className="mr-3 h-8 w-8 text-yellow-600" />
            Best Sellers Analytics
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            📊 Product Management → Product Analytics → Best Sellers
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Real-time best seller tracking, performance insights, and market intelligence
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
          <Button className="bg-yellow-600 hover:bg-yellow-700">
            <Target className="h-4 w-4 mr-2" />
            Set Targets
          </Button>
        </div>
      </div>
    </div>
  );

  const BestSellersStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Top Seller Revenue</p>
              <p className="text-3xl font-bold text-yellow-800">৳ 4.2L</p>
              <p className="text-xs text-yellow-600 font-medium flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                +23.5% vs last month
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-full">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Units Sold</p>
              <p className="text-3xl font-bold text-blue-800">28,475</p>
              <p className="text-xs text-blue-600 font-medium flex items-center mt-1">
                <Package size={12} className="mr-1" />
                Last 30 days
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Avg Rating</p>
              <p className="text-3xl font-bold text-green-800">4.7</p>
              <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                <Star size={12} className="mr-1" />
                Top 100 products
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Active Vendors</p>
              <p className="text-3xl font-bold text-purple-800">156</p>
              <p className="text-xs text-purple-600 font-medium flex items-center mt-1">
                <Users size={12} className="mr-1" />
                With best sellers
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SearchAndFilters = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search best sellers..."
                className="pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RankingsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {bestSellersData.map((product, index) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {product.rank}
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Category: {product.category}</span>
                        <span>•</span>
                        <span>Vendor: {product.vendor}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {product.rank < product.previousRank && (
                          <Badge className="bg-green-100 text-green-800">
                            ↑ {product.previousRank - product.rank}
                          </Badge>
                        )}
                        {product.rank > product.previousRank && (
                          <Badge className="bg-red-100 text-red-800">
                            ↓ {product.rank - product.previousRank}
                          </Badge>
                        )}
                        <Badge variant="outline">{product.daysInTop10} days in top 10</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Units Sold</p>
                      <p className="font-semibold text-lg">{product.unitsSold.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-semibold text-lg">৳{product.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Growth</p>
                      <p className={`font-semibold text-lg ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock Level</p>
                      <p className={`font-semibold text-lg ${product.stockLevel < 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stockLevel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const TrendsTab = () => (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-3 h-5 w-5 text-blue-600" />
              Sales Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number, name: string) => [
                  name === 'sales' ? value.toLocaleString() : 
                  name === 'revenue' ? `৳${value.toLocaleString()}` : 
                  value.toLocaleString(),
                  name === 'sales' ? 'Sales' : 
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]} />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Conversion Rate</p>
                    <p className="text-sm text-gray-600">Best sellers average</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">8.7%</p>
                  <p className="text-sm text-green-600">+2.3% vs avg</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Revenue per Unit</p>
                    <p className="text-sm text-gray-600">Average selling price</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">৳1,247</p>
                  <p className="text-sm text-green-600">+15.2% vs avg</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium">Velocity Score</p>
                    <p className="text-sm text-gray-600">Sales momentum</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">94.2</p>
                  <p className="text-sm text-green-600">Excellent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const CategoriesTab = () => (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{category.value}% of sales</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const VendorsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendorPerformance.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{vendor.vendor}</h4>
                    <p className="text-sm text-gray-600">{vendor.products} best-selling products</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="font-semibold">৳{vendor.totalSales.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <div className="flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <p className="font-semibold">{vendor.avgRating}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Growth</p>
                    <p className="font-semibold text-green-600">+{vendor.growth}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AIInsightsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-3 h-5 w-5 text-purple-600" />
            AI-Powered Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">🎯 Key Insights</h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Seasonal Trend Detected</p>
                  <p className="text-sm text-blue-600 mt-1">Electronics sales are 35% higher this month, likely due to back-to-school season.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">Inventory Opportunity</p>
                  <p className="text-sm text-green-600 mt-1">Top 3 products have low stock levels. Consider restocking to maximize sales.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="font-medium text-orange-800">Price Optimization</p>
                  <p className="text-sm text-orange-600 mt-1">Premium Wireless Headphones could support a 10% price increase based on demand.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">💡 Recommendations</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Target className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Promote Similar Products</p>
                    <p className="text-sm text-gray-600">Cross-sell accessories to headphone buyers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Users className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Vendor Expansion</p>
                    <p className="text-sm text-gray-600">Consider onboarding more fitness wearable vendors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium">Marketing Focus</p>
                    <p className="text-sm text-gray-600">Increase ad spend on Fashion category for higher ROI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <BestSellersHeader />
      <BestSellersStatsCards />
      <SearchAndFilters />
      
      <Tabs defaultValue="rankings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="rankings">🏆 Rankings</TabsTrigger>
          <TabsTrigger value="trends">📈 Trends</TabsTrigger>
          <TabsTrigger value="categories">📊 Categories</TabsTrigger>
          <TabsTrigger value="vendors">🏪 Vendors</TabsTrigger>
          <TabsTrigger value="insights">🤖 AI Insights</TabsTrigger>
          <TabsTrigger value="reports">📋 Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="rankings">
          <RankingsTab />
        </TabsContent>

        <TabsContent value="trends">
          <TrendsTab />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="vendors">
          <VendorsTab />
        </TabsContent>

        <TabsContent value="insights">
          <AIInsightsTab />
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>📋 Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Advanced reporting features coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
