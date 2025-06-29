
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Package, 
  DollarSign, 
  Users, 
  Eye, 
  ShoppingCart,
  Star,
  Target,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

// Mock data for category performance
const categoryPerformanceData = [
  {
    id: 1,
    name: 'Electronics',
    revenue: 15600000,
    orders: 2450,
    conversion: 4.2,
    avgOrderValue: 6367,
    profit: 2340000,
    margin: 15,
    growth: 18.5,
    products: 1247,
    views: 125000,
    customers: 1850,
    rating: 4.3,
    trend: 'up',
    seasonality: 'high',
    competition: 'high',
    status: 'active'
  },
  {
    id: 2,
    name: 'Fashion & Apparel',
    revenue: 12800000,
    orders: 3200,
    conversion: 3.8,
    avgOrderValue: 4000,
    profit: 1920000,
    margin: 15,
    growth: 22.3,
    products: 2150,
    views: 180000,
    customers: 2100,
    rating: 4.1,
    trend: 'up',
    seasonality: 'seasonal',
    competition: 'very_high',
    status: 'active'
  },
  {
    id: 3,
    name: 'Home & Living',
    revenue: 9200000,
    orders: 1800,
    conversion: 3.5,
    avgOrderValue: 5111,
    profit: 1380000,
    margin: 15,
    growth: 15.7,
    products: 890,
    views: 95000,
    customers: 1200,
    rating: 4.4,
    trend: 'up',
    seasonality: 'stable',
    competition: 'medium',
    status: 'active'
  },
  {
    id: 4,
    name: 'Health & Beauty',
    revenue: 8700000,
    orders: 2900,
    conversion: 5.2,
    avgOrderValue: 3000,
    profit: 1305000,
    margin: 15,
    growth: 28.9,
    products: 1580,
    views: 220000,
    customers: 2450,
    rating: 4.5,
    trend: 'up',
    seasonality: 'stable',
    competition: 'high',
    status: 'active'
  },
  {
    id: 5,
    name: 'Sports & Outdoors',
    revenue: 6500000,
    orders: 1300,
    conversion: 2.8,
    avgOrderValue: 5000,
    profit: 975000,
    margin: 15,
    growth: 12.1,
    products: 650,
    views: 85000,
    customers: 980,
    rating: 4.2,
    trend: 'up',
    seasonality: 'seasonal',
    competition: 'medium',
    status: 'active'
  },
  {
    id: 6,
    name: 'Books & Education',
    revenue: 4200000,
    orders: 2100,
    conversion: 6.1,
    avgOrderValue: 2000,
    profit: 630000,
    margin: 15,
    growth: 8.4,
    products: 3200,
    views: 150000,
    customers: 1800,
    rating: 4.6,
    trend: 'stable',
    seasonality: 'seasonal',
    competition: 'low',
    status: 'active'
  },
  {
    id: 7,
    name: 'Automotive',
    revenue: 3800000,
    orders: 450,
    conversion: 1.8,
    avgOrderValue: 8444,
    profit: 570000,
    margin: 15,
    growth: -5.2,
    products: 420,
    views: 45000,
    customers: 380,
    rating: 4.0,
    trend: 'down',
    seasonality: 'stable',
    competition: 'low',
    status: 'review'
  }
];

const monthlyTrendData = [
  { month: 'Jan', electronics: 1200000, fashion: 980000, home: 750000, beauty: 680000, sports: 520000 },
  { month: 'Feb', electronics: 1350000, fashion: 1050000, home: 780000, beauty: 720000, sports: 550000 },
  { month: 'Mar', electronics: 1420000, fashion: 1180000, home: 820000, beauty: 780000, sports: 580000 },
  { month: 'Apr', electronics: 1480000, fashion: 1220000, home: 860000, beauty: 820000, sports: 620000 },
  { month: 'May', electronics: 1550000, fashion: 1280000, home: 900000, beauty: 870000, sports: 650000 },
  { month: 'Jun', electronics: 1600000, fashion: 1320000, home: 920000, beauty: 900000, sports: 680000 }
];

const competitorData = [
  { name: 'Our Platform', market_share: 24.5, growth: 18.2, color: '#3b82f6' },
  { name: 'Competitor A', market_share: 32.1, growth: 12.5, color: '#ef4444' },
  { name: 'Competitor B', market_share: 18.7, growth: 15.8, color: '#10b981' },
  { name: 'Competitor C', market_share: 14.2, growth: 8.3, color: '#f59e0b' },
  { name: 'Others', market_share: 10.5, growth: 5.1, color: '#8b5cf6' }
];

export const CategoryPerformanceContent: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into category performance and market trends</p>
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
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Label>Filters:</Label>
            </div>
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Living</SelectItem>
                <SelectItem value="beauty">Health & Beauty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="performance">🎯 Performance</TabsTrigger>
          <TabsTrigger value="trends">📈 Trends</TabsTrigger>
          <TabsTrigger value="comparison">⚖️ Comparison</TabsTrigger>
          <TabsTrigger value="optimization">🔧 Optimization</TabsTrigger>
          <TabsTrigger value="management">⚙️ Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs opacity-80">Active categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳58.5M</div>
                <p className="text-xs text-muted-foreground">+15.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Electronics</div>
                <p className="text-xs text-muted-foreground">₹15.6M revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Growth Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+16.8%</div>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPerformanceData.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="revenue"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {categoryPerformanceData.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    electronics: { label: "Electronics", color: "#3b82f6" },
                    fashion: { label: "Fashion", color: "#10b981" },
                    home: { label: "Home", color: "#f59e0b" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="electronics" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="fashion" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="home" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('name')}>
                        Category {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('revenue')}>
                        Revenue {sortBy === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('orders')}>
                        Orders {sortBy === 'orders' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('conversion')}>
                        Conversion {sortBy === 'conversion' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('avgOrderValue')}>
                        AOV {sortBy === 'avgOrderValue' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-2 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('growth')}>
                        Growth {sortBy === 'growth' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-2">Rating</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryPerformanceData.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-xs text-gray-500">{category.products} products</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">{formatCurrency(category.revenue)}</div>
                          <div className="text-xs text-gray-500">₹{category.profit.toLocaleString()} profit</div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">{category.orders.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{category.customers} customers</div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">{category.conversion}%</div>
                          <div className="text-xs text-gray-500">{category.views.toLocaleString()} views</div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">৳{category.avgOrderValue.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{category.margin}% margin</div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(category.trend)}
                            <span className={`font-medium ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {category.growth > 0 ? '+' : ''}{category.growth}%
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{category.rating}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(category.status)}>
                            {category.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Category Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  electronics: { label: "Electronics", color: "#3b82f6" },
                  fashion: { label: "Fashion", color: "#10b981" },
                  home: { label: "Home & Living", color: "#f59e0b" },
                  beauty: { label: "Health & Beauty", color: "#8b5cf6" },
                  sports: { label: "Sports & Outdoors", color: "#ef4444" }
                }}
                className="h-96"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="electronics" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="fashion" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="home" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="beauty" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="sports" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Seasonal Trends */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Fashion & Apparel</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Seasonal</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sports & Outdoors</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Seasonal</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Books & Education</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Seasonal</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>High Competition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Fashion & Apparel</span>
                  <Badge className="bg-red-100 text-red-800">Very High</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Electronics</span>
                  <Badge className="bg-orange-100 text-orange-800">High</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Health & Beauty</span>
                  <Badge className="bg-orange-100 text-orange-800">High</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Health & Beauty</span>
                  <Badge className="bg-green-100 text-green-800">+28.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fashion & Apparel</span>
                  <Badge className="bg-green-100 text-green-800">+22.3%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Electronics</span>
                  <Badge className="bg-green-100 text-green-800">+18.5%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Market Share Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Market Share Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  market_share: { label: "Market Share", color: "#3b82f6" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={competitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="market_share" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Competitive Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitive Positioning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorData.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: competitor.color }}></div>
                        <span className="font-medium">{competitor.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">{competitor.market_share}%</div>
                          <div className="text-xs text-gray-500">Market Share</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${competitor.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {competitor.growth > 0 ? '+' : ''}{competitor.growth}%
                          </div>
                          <div className="text-xs text-gray-500">Growth</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="text-sm font-medium">4.2% (Industry: 3.8%)</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Average Order Value</span>
                      <span className="text-sm font-medium">৳4,500 (Industry: ৳3,800)</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium">4.3/5 (Industry: 4.1/5)</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Return Rate</span>
                      <span className="text-sm font-medium">2.1% (Industry: 2.8%)</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Optimization Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Optimization Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Electronics Category</h4>
                  <p className="text-sm text-blue-700 mt-1">Increase product variety in smartphone accessories. Potential +15% revenue growth.</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    View Details
                  </Button>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Health & Beauty</h4>
                  <p className="text-sm text-green-700 mt-1">Expand organic and natural products. High demand with 28.9% growth rate.</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    View Details
                  </Button>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Automotive</h4>
                  <p className="text-sm text-yellow-700 mt-1">Requires attention: -5.2% growth. Consider promotional campaigns.</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Targets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Revenue Target</span>
                    <span className="text-sm font-medium">৳65M</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-gray-500">Current: ৳58.5M (90% achieved)</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">New Category Launch</span>
                    <span className="text-sm font-medium">Q3 2024</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <div className="text-xs text-gray-500">Pet Supplies category in planning</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Market Share Goal</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                  <div className="text-xs text-gray-500">Current: 24.5%</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* Category Management Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input id="categoryName" placeholder="Enter category name" />
                </div>
                <div>
                  <Label htmlFor="parentCategory">Parent Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                      <SelectItem value="home">Home & Living</SelectItem>
                      <SelectItem value="beauty">Health & Beauty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input id="commissionRate" type="number" placeholder="15" />
                </div>
                <div>
                  <Label htmlFor="targetRevenue">Target Monthly Revenue</Label>
                  <Input id="targetRevenue" placeholder="5000000" />
                </div>
                <div>
                  <Label htmlFor="seasonality">Seasonality</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select seasonality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="high">High Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="competition">Competition Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select competition level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="very_high">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Add Category</Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Categories
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Metrics
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Set Targets
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
