
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Eye,
  Star,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const OverviewDashboard: React.FC = () => {
  // Mock data for charts
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 240, users: 400 },
    { name: 'Feb', sales: 3000, orders: 139, users: 300 },
    { name: 'Mar', sales: 2000, orders: 980, users: 200 },
    { name: 'Apr', sales: 2780, orders: 390, users: 278 },
    { name: 'May', sales: 1890, orders: 480, users: 189 },
    { name: 'Jun', sales: 2390, orders: 380, users: 239 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400, color: '#0088FE' },
    { name: 'Fashion', value: 300, color: '#00C49F' },
    { name: 'Home & Garden', value: 300, color: '#FFBB28' },
    { name: 'Books', value: 200, color: '#FF8042' },
    { name: 'Sports', value: 150, color: '#8884D8' },
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', product: 'iPhone 14', amount: '৳85,000', status: 'Delivered', time: '2 min ago' },
    { id: '#12346', customer: 'Jane Smith', product: 'Samsung TV', amount: '৳45,000', status: 'Processing', time: '5 min ago' },
    { id: '#12347', customer: 'Bob Johnson', product: 'Nike Shoes', amount: '৳8,500', status: 'Shipped', time: '10 min ago' },
    { id: '#12348', customer: 'Alice Brown', product: 'MacBook Pro', amount: '৳125,000', status: 'Pending', time: '15 min ago' },
  ];

  const topVendors = [
    { name: 'TechHub BD', sales: '৳2.5M', orders: 1250, rating: 4.8, growth: '+12%' },
    { name: 'Fashion Point', sales: '৳1.8M', orders: 890, rating: 4.6, growth: '+8%' },
    { name: 'Home Essentials', sales: '৳1.2M', orders: 650, rating: 4.7, growth: '+15%' },
    { name: 'Sports World', sales: '৳980K', orders: 520, rating: 4.5, growth: '+5%' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome to your comprehensive admin dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>Quick Actions</Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-900">৳24.5M</p>
                <p className="text-sm text-blue-600 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-green-900">18,976</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +8% from last month
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-purple-900">42,345</p>
                <p className="text-sm text-purple-600 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +15% from last month
                </p>
              </div>
              <Users className="w-12 h-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-orange-900">156,789</p>
                <p className="text-sm text-orange-600 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +5% from last month
                </p>
              </div>
              <Package className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
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
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
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
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Badge variant="secondary">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant={
                        order.status === 'Delivered' ? 'default' :
                        order.status === 'Processing' ? 'secondary' :
                        order.status === 'Shipped' ? 'outline' : 'destructive'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer} • {order.product}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Orders</Button>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVendors.map((vendor, index) => (
                <div key={vendor.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{vendor.rating}</span>
                        <span>•</span>
                        <span>{vendor.orders} orders</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{vendor.sales}</p>
                    <p className="text-sm text-green-600">{vendor.growth}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Vendors</Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Progress value={68} className="h-2" />
              </div>
              <span className="text-sm font-medium">68%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Progress value={92} className="h-2" />
              </div>
              <span className="text-sm font-medium">92%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Return Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Progress value={8} className="h-2" />
              </div>
              <span className="text-sm font-medium">8%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">-1% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
