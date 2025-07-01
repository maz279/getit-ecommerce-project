import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Package, DollarSign, ShoppingCart, TrendingUp, Users, 
  Star, AlertCircle, Eye, Plus, Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';

// Mock data - replace with real API calls
const mockVendorData = {
  summary: {
    totalProducts: 156,
    totalOrders: 1243,
    totalRevenue: 892340,
    totalCustomers: 567,
    rating: 4.6,
    completionRate: 94
  },
  recentOrders: [
    { id: '1', customer: 'Ahmed Rahman', product: 'Wireless Headphones', amount: 4500, status: 'processing' },
    { id: '2', customer: 'Fatima Khan', product: 'Smart Watch', amount: 12000, status: 'shipped' },
    { id: '3', customer: 'Mohammad Ali', product: 'Phone Case', amount: 800, status: 'delivered' },
  ],
  salesData: [
    { month: 'Jan', sales: 45000, orders: 123 },
    { month: 'Feb', sales: 52000, orders: 145 },
    { month: 'Mar', sales: 48000, orders: 134 },
    { month: 'Apr', sales: 61000, orders: 167 },
    { month: 'May', sales: 58000, orders: 156 },
    { month: 'Jun', sales: 67000, orders: 189 },
  ],
  topProducts: [
    { name: 'Wireless Earbuds', sales: 234, revenue: 234000 },
    { name: 'Smart Watch', sales: 189, revenue: 189000 },
    { name: 'Phone Accessories', sales: 167, revenue: 89000 },
    { name: 'Bluetooth Speaker', sales: 145, revenue: 145000 },
  ],
  categoryPerformance: [
    { name: 'Electronics', value: 45, color: '#8884d8' },
    { name: 'Accessories', value: 30, color: '#82ca9d' },
    { name: 'Smart Devices', value: 25, color: '#ffc658' },
  ]
};

const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {trend && (
            <span className={`inline-flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name || 'Vendor'}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(mockVendorData.summary.totalRevenue)}
                subtitle="from last month"
                icon={DollarSign}
                trend={12.5}
              />
              <StatCard
                title="Total Orders"
                value={mockVendorData.summary.totalOrders.toLocaleString()}
                subtitle="this month"
                icon={ShoppingCart}
                trend={8.2}
              />
              <StatCard
                title="Total Products"
                value={mockVendorData.summary.totalProducts}
                subtitle="active listings"
                icon={Package}
                trend={5.1}
              />
              <StatCard
                title="Customer Rating"
                value={`${mockVendorData.summary.rating}/5`}
                subtitle={`${mockVendorData.summary.completionRate}% completion rate`}
                icon={Star}
                trend={2.1}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockVendorData.salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Sales by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockVendorData.categoryPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockVendorData.categoryPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockVendorData.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.product}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(order.amount)}</p>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'shipped' ? 'secondary' : 'outline'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>Best sellers this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockVendorData.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.sales} sales</p>
                          </div>
                        </div>
                        <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Product Management</h3>
                  <p className="text-gray-600 mb-4">Add, edit, and manage your product listings</p>
                  <Button>Add Your First Product</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Order Management</h3>
                  <p className="text-gray-600">View and process customer orders</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Detailed insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600">Detailed reports and business insights</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>Manage customer relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Insights</h3>
                  <p className="text-gray-600">View customer data and communication</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Settings</CardTitle>
                <CardDescription>Configure your vendor account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
                  <p className="text-gray-600">Manage your vendor profile and preferences</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default VendorDashboard;