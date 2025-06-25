
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  Package, 
  Truck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const OrderInsightsSection: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [filterStatus, setFilterStatus] = useState('all');

  const orderStats = [
    { status: 'Pending', count: 156, color: '#f59e0b', percentage: 12 },
    { status: 'Processing', count: 234, color: '#3b82f6', percentage: 18 },
    { status: 'Shipped', count: 567, color: '#8b5cf6', percentage: 43 },
    { status: 'Delivered', count: 1289, color: '#10b981', percentage: 27 }
  ];

  const orderTrends = [
    { date: '2024-06-01', orders: 145, revenue: 285000, avgValue: 1965 },
    { date: '2024-06-02', orders: 167, revenue: 324000, avgValue: 1940 },
    { date: '2024-06-03', orders: 189, revenue: 378000, avgValue: 2000 },
    { date: '2024-06-04', orders: 156, revenue: 298000, avgValue: 1910 },
    { date: '2024-06-05', orders: 234, revenue: 456000, avgValue: 1949 },
    { date: '2024-06-06', orders: 278, revenue: 534000, avgValue: 1921 },
    { date: '2024-06-07', orders: 198, revenue: 387000, avgValue: 1955 }
  ];

  const recentOrders = [
    { 
      id: '#12567', 
      customer: 'Ahmed Rahman', 
      items: 3, 
      total: 45600, 
      status: 'processing', 
      time: '5 min ago',
      vendor: 'TechHub BD'
    },
    { 
      id: '#12566', 
      customer: 'Fatima Khan', 
      items: 1, 
      total: 125000, 
      status: 'shipped', 
      time: '12 min ago',
      vendor: 'Electronics Pro'
    },
    { 
      id: '#12565', 
      customer: 'Mohammad Ali', 
      items: 2, 
      total: 8500, 
      status: 'delivered', 
      time: '18 min ago',
      vendor: 'Fashion Point'
    },
    { 
      id: '#12564', 
      customer: 'Rashida Begum', 
      items: 4, 
      total: 23400, 
      status: 'pending', 
      time: '25 min ago',
      vendor: 'Home Essentials'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Insights</h1>
          <p className="text-gray-600 mt-1">Comprehensive order analytics and management</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.status} Orders</p>
                  <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.count}</p>
                  <Progress value={stat.percentage} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">{stat.percentage}% of total</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  {getStatusIcon(stat.status.toLowerCase())}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Order Volume Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (৳)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <div className="flex space-x-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{order.id}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer} • {order.vendor}</p>
                    <p className="text-xs text-gray-500">{order.items} items • {order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">৳{order.total.toLocaleString()}</p>
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="auto-confirm">Auto-confirm Orders</Label>
              <Select defaultValue="disabled">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="processing-time">Default Processing Time (hours)</Label>
              <Input id="processing-time" type="number" defaultValue="24" />
            </div>
            <div>
              <Label htmlFor="notification-threshold">Low Stock Alert Threshold</Label>
              <Input id="notification-threshold" type="number" defaultValue="10" />
            </div>
            <div>
              <Label htmlFor="refund-policy">Refund Window (days)</Label>
              <Input id="refund-policy" type="number" defaultValue="7" />
            </div>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};
