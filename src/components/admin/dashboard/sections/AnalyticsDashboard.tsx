
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Eye,
  Target,
  Zap,
  FileText,
  Download,
  Settings,
  Calendar,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [analyticsType, setAnalyticsType] = useState('sales');

  // Sample data for analytics
  const salesData = [
    { name: 'Jan', sales: 65000, profit: 28000, orders: 450 },
    { name: 'Feb', sales: 75000, profit: 32000, orders: 520 },
    { name: 'Mar', sales: 85000, profit: 38000, orders: 680 },
    { name: 'Apr', sales: 95000, profit: 45000, orders: 750 },
    { name: 'May', sales: 105000, profit: 52000, orders: 820 },
    { name: 'Jun', sales: 125000, profit: 62000, orders: 950 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35000, color: '#0088FE' },
    { name: 'Fashion', value: 28000, color: '#00C49F' },
    { name: 'Home & Garden', value: 22000, color: '#FFBB28' },
    { name: 'Books', value: 15000, color: '#FF8042' },
    { name: 'Sports', value: 12000, color: '#8884d8' }
  ];

  const customerBehaviorData = [
    { time: '00:00', pageViews: 1200, uniqueVisitors: 850, bounceRate: 45 },
    { time: '04:00', pageViews: 800, uniqueVisitors: 620, bounceRate: 48 },
    { time: '08:00', pageViews: 2500, uniqueVisitors: 1800, bounceRate: 35 },
    { time: '12:00', pageViews: 3200, uniqueVisitors: 2400, bounceRate: 28 },
    { time: '16:00', pageViews: 2800, uniqueVisitors: 2100, bounceRate: 32 },
    { time: '20:00', pageViews: 1800, uniqueVisitors: 1350, bounceRate: 40 }
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 text-lg">Comprehensive data insights and business intelligence</p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={analyticsType} onValueChange={setAnalyticsType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="customer">Customer Analytics</TabsTrigger>
          <TabsTrigger value="product">Product Analytics</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Analytics</TabsTrigger>
        </TabsList>

        {/* Sales Analytics */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sales Data Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Sales Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="sale-amount">Sale Amount (৳)</Label>
                  <Input id="sale-amount" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="sale-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sale-date">Date</Label>
                  <Input id="sale-date" type="date" />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Add Sale Record</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Analytics */}
        <TabsContent value="customer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Behavior Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerBehaviorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pageViews" stroke="#8884d8" />
                  <Line type="monotone" dataKey="uniqueVisitors" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="bounceRate" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Customer Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="customer-id">Customer ID</Label>
                  <Input id="customer-id" placeholder="Enter customer ID" />
                </div>
                <div>
                  <Label htmlFor="feedback-rating">Rating</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Analyze Feedback</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Analytics */}
        <TabsContent value="product" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="text-2xl font-bold text-blue-600">156,789</h3>
                  <p className="text-gray-600">Total Products</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="text-2xl font-bold text-green-600">98.5%</h3>
                  <p className="text-gray-600">In Stock</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="text-2xl font-bold text-orange-600">2,345</h3>
                  <p className="text-gray-600">Low Stock</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="text-2xl font-bold text-red-600">456</h3>
                  <p className="text-gray-600">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Analytics */}
        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Summer Sale 2024', clicks: 12500, conversions: 850, ctr: '6.8%', status: 'Active' },
                  { name: 'Electronics Mega Deal', clicks: 8900, conversions: 620, ctr: '7.0%', status: 'Active' },
                  { name: 'Fashion Week Special', clicks: 6700, conversions: 480, ctr: '7.2%', status: 'Completed' }
                ].map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">{campaign.clicks} clicks • {campaign.conversions} conversions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold">{campaign.ctr}</span>
                      <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
