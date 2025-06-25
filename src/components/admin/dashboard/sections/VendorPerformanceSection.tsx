
import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  Award, 
  Star, 
  DollarSign,
  Package,
  Users,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
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

export const VendorPerformanceSection: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const topVendors = [
    { id: 1, name: 'TechHub Bangladesh', sales: 2450000, orders: 1250, rating: 4.8, growth: 15.2, category: 'Electronics' },
    { id: 2, name: 'Fashion Point BD', sales: 1850000, orders: 890, rating: 4.6, growth: 12.8, category: 'Fashion' },
    { id: 3, name: 'Home Essentials', sales: 1250000, orders: 650, rating: 4.7, growth: 18.5, category: 'Home & Garden' },
    { id: 4, name: 'Sports World BD', sales: 980000, orders: 520, rating: 4.5, growth: 8.2, category: 'Sports' },
    { id: 5, name: 'Book Paradise', sales: 750000, orders: 380, rating: 4.9, growth: 22.1, category: 'Books' }
  ];

  const performanceData = [
    { month: 'Jan', sales: 1200000, orders: 580, vendors: 45 },
    { month: 'Feb', sales: 1350000, orders: 620, vendors: 48 },
    { month: 'Mar', sales: 1500000, orders: 720, vendors: 52 },
    { month: 'Apr', sales: 1800000, orders: 850, vendors: 55 },
    { month: 'May', sales: 2100000, orders: 980, vendors: 58 },
    { month: 'Jun', sales: 2450000, orders: 1150, vendors: 62 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#0088FE' },
    { name: 'Fashion', value: 25, color: '#00C49F' },
    { name: 'Home & Garden', value: 20, color: '#FFBB28' },
    { name: 'Sports', value: 12, color: '#FF8042' },
    { name: 'Books', value: 8, color: '#8884D8' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Performance</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze vendor metrics and performance</p>
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
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Vendors</p>
                <p className="text-3xl font-bold text-blue-900">1,247</p>
                <p className="text-sm text-blue-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15 this month
                </p>
              </div>
              <Store className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Active Vendors</p>
                <p className="text-3xl font-bold text-green-900">1,089</p>
                <p className="text-sm text-green-600">87.3% active rate</p>
              </div>
              <Users className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Top Performers</p>
                <p className="text-3xl font-bold text-purple-900">156</p>
                <p className="text-sm text-purple-600">4.5+ rating</p>
              </div>
              <Award className="w-12 h-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Avg Commission</p>
                <p className="text-3xl font-bold text-orange-900">৳12.5K</p>
                <p className="text-sm text-orange-600">Per vendor/month</p>
              </div>
              <DollarSign className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Vendor Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" name="Sales (৳)" />
                <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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

      {/* Top Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Vendor</th>
                  <th className="text-left py-3 px-4">Sales</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Rating</th>
                  <th className="text-left py-3 px-4">Growth</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topVendors.map((vendor, index) => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-sm text-gray-500">{vendor.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-green-600">৳{vendor.sales.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">{vendor.orders.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{vendor.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-100 text-green-800">
                        +{vendor.growth}%
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Contact</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Management Form */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="commission-rate">Default Commission Rate (%)</Label>
              <Input id="commission-rate" type="number" defaultValue="15" />
            </div>
            <div>
              <Label htmlFor="minimum-rating">Minimum Rating Requirement</Label>
              <Input id="minimum-rating" type="number" step="0.1" defaultValue="4.0" />
            </div>
            <div>
              <Label htmlFor="performance-threshold">Performance Review Threshold</Label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="auto-suspend">Auto-suspend Low Performers</Label>
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
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};
