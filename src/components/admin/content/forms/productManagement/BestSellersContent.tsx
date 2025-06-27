
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { 
  TrendingUp, 
  Crown, 
  Star, 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  Heart,
  Award,
  Target,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  Settings,
  Zap,
  Users,
  Package
} from 'lucide-react';

export const BestSellersContent: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Mock data for best sellers
  const bestSellersData = [
    { 
      id: 'BST001', 
      name: 'Samsung Galaxy S24 Ultra', 
      category: 'Electronics', 
      vendor: 'Samsung Official', 
      unitsSold: 2847, 
      revenue: 85410000, 
      profit: 12811500, 
      rank: 1, 
      previousRank: 2, 
      rating: 4.8, 
      reviews: 1247, 
      wishlistCount: 5892, 
      viewCount: 45673,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
      trend: 'up'
    },
    { 
      id: 'BST002', 
      name: 'iPhone 15 Pro Max', 
      category: 'Electronics', 
      vendor: 'Apple Store BD', 
      unitsSold: 2156, 
      revenue: 81800000, 
      profit: 16360000, 
      rank: 2, 
      previousRank: 1, 
      rating: 4.9, 
      reviews: 987, 
      wishlistCount: 4567, 
      viewCount: 38921,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
      trend: 'down'
    },
    { 
      id: 'BST003', 
      name: 'MacBook Pro M3', 
      category: 'Electronics', 
      vendor: 'Apple Store BD', 
      unitsSold: 1234, 
      revenue: 74040000, 
      profit: 14808000, 
      rank: 3, 
      previousRank: 4, 
      rating: 4.7, 
      reviews: 654, 
      wishlistCount: 3421, 
      viewCount: 29876,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop',
      trend: 'up'
    },
    { 
      id: 'BST004', 
      name: 'Sony WH-1000XM5', 
      category: 'Electronics', 
      vendor: 'Sony Official', 
      unitsSold: 3421, 
      revenue: 68420000, 
      profit: 10263000, 
      rank: 4, 
      previousRank: 5, 
      rating: 4.6, 
      reviews: 892, 
      wishlistCount: 2876, 
      viewCount: 19654,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
      trend: 'up'
    },
    { 
      id: 'BST005', 
      name: 'Air Fryer Pro 5L', 
      category: 'Home & Kitchen', 
      vendor: 'Kitchen Pro', 
      unitsSold: 4567, 
      revenue: 45670000, 
      profit: 9134000, 
      rank: 5, 
      previousRank: 3, 
      rating: 4.5, 
      reviews: 1543, 
      wishlistCount: 1987, 
      viewCount: 15432,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
      trend: 'down'
    }
  ];

  const categoryPerformanceData = [
    { category: 'Electronics', sales: 45, revenue: 2850000, growth: 12.5 },
    { category: 'Fashion', sales: 32, revenue: 1980000, growth: 8.3 },
    { category: 'Home & Kitchen', sales: 28, revenue: 1456000, growth: 15.2 },
    { category: 'Health & Beauty', sales: 22, revenue: 1134000, growth: -2.1 },
    { category: 'Sports', sales: 18, revenue: 890000, growth: 6.7 }
  ];

  const salesTrendData = [
    { month: 'Jan', sales: 2400, revenue: 45000000 },
    { month: 'Feb', sales: 2210, revenue: 42000000 },
    { month: 'Mar', sales: 2890, revenue: 55000000 },
    { month: 'Apr', sales: 3200, revenue: 61000000 },
    { month: 'May', sales: 3850, revenue: 73000000 },
    { month: 'Jun', sales: 4200, revenue: 80000000 }
  ];

  const topVendorsData = [
    { vendor: 'Samsung Official', products: 12, totalSales: 15674, revenue: 234560000 },
    { vendor: 'Apple Store BD', products: 8, totalSales: 12456, revenue: 187400000 },
    { vendor: 'Sony Official', products: 15, totalSales: 9876, revenue: 145320000 },
    { vendor: 'Xiaomi Store', products: 22, totalSales: 8765, revenue: 98450000 },
    { vendor: 'Kitchen Pro', products: 18, totalSales: 7654, revenue: 87650000 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Crown className="h-8 w-8 text-yellow-500 mr-3" />
            Best Sellers Analytics
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of top-performing products</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Top Product Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(85410000)}
            </div>
            <p className="text-xs text-gray-500">Samsung Galaxy S24 Ultra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2 text-blue-500" />
              Total Units Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">14,225</div>
            <p className="text-xs text-gray-500">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(21450)}
            </div>
            <p className="text-xs text-gray-500">+12.5% increase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Avg. Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4.7</div>
            <p className="text-xs text-gray-500">Based on 5,323 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="rankings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Rankings Tab */}
        <TabsContent value="rankings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Best Sellers Ranking</span>
                <div className="flex space-x-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="home">Home & Kitchen</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Search products..." className="w-64" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bestSellersData.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={product.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                            #{product.rank}
                          </Badge>
                          {product.rank <= 3 && <Crown className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.vendor}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {product.unitsSold.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(product.revenue)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{product.rating}</span>
                          <span className="text-gray-500">({product.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {product.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                          )}
                          <span className={product.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                            {product.previousRank > product.rank ? `+${product.previousRank - product.rank}` : 
                             product.previousRank < product.rank ? `-${product.rank - product.previousRank}` : '0'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'sales' ? value.toLocaleString() : formatCurrency(value),
                      name === 'sales' ? 'Units Sold' : 'Revenue'
                    ]} />
                    <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="revenue" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate</span>
                    <span className="font-medium">3.8%</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Repeat Purchase Rate</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Wishlist Add Rate</span>
                    <span className="font-medium">12.5%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryPerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, sales }) => `${category}: ${sales}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sales"
                    >
                      {categoryPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topVendorsData.map((vendor, index) => (
                    <TableRow key={vendor.vendor}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={index < 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            #{index + 1}
                          </Badge>
                          <span className="font-medium">{vendor.vendor}</span>
                        </div>
                      </TableCell>
                      <TableCell>{vendor.products}</TableCell>
                      <TableCell>{vendor.totalSales.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(vendor.revenue)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Peak Performance</h4>
                  <p className="text-sm text-blue-700">Electronics category showing 25% growth this month, driven by smartphone launches.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Opportunity</h4>
                  <p className="text-sm text-green-700">Home & Kitchen products have high demand but low supply. Consider promoting these items.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Alert</h4>
                  <p className="text-sm text-orange-700">Health & Beauty category showing declining trend. Review pricing and promotions.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Optimize Inventory</p>
                      <p className="text-xs text-gray-600">Increase stock for top 10 products to avoid stockouts</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Customer Retention</p>
                      <p className="text-xs text-gray-600">Focus on post-purchase engagement for repeat sales</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Bundle Opportunities</p>
                      <p className="text-xs text-gray-600">Create bundles with complementary products</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Sellers Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Ranking Algorithm</label>
                <Select defaultValue="revenue">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue Based</SelectItem>
                    <SelectItem value="units">Units Sold</SelectItem>
                    <SelectItem value="profit">Profit Margin</SelectItem>
                    <SelectItem value="combined">Combined Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Update Frequency</label>
                <Select defaultValue="realtime">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Minimum Sales Threshold</label>
                <Input type="number" defaultValue="100" className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
