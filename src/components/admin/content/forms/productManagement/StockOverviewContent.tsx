
import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Plus, Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const StockOverviewContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app this would come from API
  const stockMetrics = {
    totalProducts: 12456,
    inStock: 11234,
    outOfStock: 456,
    lowStock: 766,
    totalValue: 2456789,
    avgStockLevel: 85.4
  };

  const stockTrendData = [
    { month: 'Jan', inStock: 11000, outOfStock: 400, lowStock: 600 },
    { month: 'Feb', inStock: 11200, outOfStock: 350, lowStock: 550 },
    { month: 'Mar', inStock: 11400, outOfStock: 300, lowStock: 500 },
    { month: 'Apr', inStock: 11300, outOfStock: 400, lowStock: 600 },
    { month: 'May', inStock: 11500, outOfStock: 250, lowStock: 450 },
    { month: 'Jun', inStock: 11234, outOfStock: 456, lowStock: 766 }
  ];

  const categoryStockData = [
    { name: 'Electronics', value: 3500, color: '#0088FE' },
    { name: 'Fashion', value: 2800, color: '#00C49F' },
    { name: 'Home & Garden', value: 2200, color: '#FFBB28' },
    { name: 'Sports', value: 1900, color: '#FF8042' },
    { name: 'Books', value: 1200, color: '#8884D8' },
    { name: 'Others', value: 856, color: '#82CA9D' }
  ];

  const lowStockProducts = [
    { id: 1, name: 'iPhone 15 Pro Max', sku: 'APL-IP15PM-256', category: 'Electronics', currentStock: 5, minStock: 50, status: 'critical' },
    { id: 2, name: 'Nike Air Jordan', sku: 'NIK-AJ1-42', category: 'Fashion', currentStock: 12, minStock: 25, status: 'low' },
    { id: 3, name: 'MacBook Air M3', sku: 'APL-MBA-M3', category: 'Electronics', currentStock: 8, minStock: 20, status: 'critical' },
    { id: 4, name: 'Samsung Galaxy S24', sku: 'SAM-GS24-128', category: 'Electronics', currentStock: 15, minStock: 30, status: 'low' },
    { id: 5, name: 'Adidas Ultraboost', sku: 'ADI-UB22-43', category: 'Fashion', currentStock: 18, minStock: 35, status: 'low' }
  ];

  const topSellingProducts = [
    { name: 'iPhone 15 Pro', sales: 234, revenue: 234000, trend: '+15%' },
    { name: 'Samsung Galaxy S24', sales: 189, revenue: 189000, trend: '+12%' },
    { name: 'MacBook Air M3', sales: 156, revenue: 156000, trend: '+8%' },
    { name: 'AirPods Pro', sales: 345, revenue: 69000, trend: '+22%' },
    { name: 'iPad Air', sales: 123, revenue: 98400, trend: '+5%' }
  ];

  const renderStockMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Total Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stockMetrics.totalProducts.toLocaleString()}</div>
          <p className="text-xs text-gray-500">Active SKUs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
            In Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stockMetrics.inStock.toLocaleString()}</div>
          <p className="text-xs text-gray-500">{((stockMetrics.inStock / stockMetrics.totalProducts) * 100).toFixed(1)}% of total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
            Low Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stockMetrics.lowStock}</div>
          <p className="text-xs text-gray-500">Need attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
            Out of Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stockMetrics.outOfStock}</div>
          <p className="text-xs text-gray-500">Immediate action</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Stock Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">৳{(stockMetrics.totalValue / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-gray-500">Total inventory</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Avg Stock Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">{stockMetrics.avgStockLevel}%</div>
          <Progress value={stockMetrics.avgStockLevel} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );

  const renderStockAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Stock Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="inStock" fill="#22c55e" name="In Stock" />
              <Bar dataKey="lowStock" fill="#f59e0b" name="Low Stock" />
              <Bar dataKey="outOfStock" fill="#ef4444" name="Out of Stock" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryStockData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryStockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderLowStockAlerts = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Low Stock Alerts
          </span>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Product</th>
                <th className="text-left p-2">SKU</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Current Stock</th>
                <th className="text-left p-2">Min Stock</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{product.name}</td>
                  <td className="p-2 text-gray-600">{product.sku}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2 font-bold text-orange-600">{product.currentStock}</td>
                  <td className="p-2">{product.minStock}</td>
                  <td className="p-2">
                    <Badge className={product.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <Button size="sm" variant="outline">
                      Reorder
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderTopPerformers = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Top Performing Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topSellingProducts.map((product, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">{product.sales} units sold this month</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">৳{product.revenue.toLocaleString()}</p>
                <Badge className="bg-green-100 text-green-800">{product.trend}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderStockManagementTools = () => (
    <Card>
      <CardHeader>
        <CardTitle>Stock Management Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-20 flex flex-col items-center justify-center">
            <Plus className="h-6 w-6 mb-2" />
            Add New Product
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Package className="h-6 w-6 mb-2" />
            Bulk Stock Update
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <BarChart3 className="h-6 w-6 mb-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stock Overview</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderStockMetrics()}
          {renderStockAnalytics()}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderTopPerformers()}
            {renderStockManagementTools()}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {renderStockMetrics()}
          {renderStockAnalytics()}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {renderStockMetrics()}
          {renderLowStockAlerts()}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex flex-col">
                  <span className="font-semibold">Inventory Valuation Report</span>
                  <span className="text-sm text-gray-500">Current stock value by category</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <span className="font-semibold">Stock Movement Report</span>
                  <span className="text-sm text-gray-500">In/Out transactions</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <span className="font-semibold">Reorder Point Analysis</span>
                  <span className="text-sm text-gray-500">Optimize reorder levels</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <span className="font-semibold">Dead Stock Report</span>
                  <span className="text-sm text-gray-500">Slow-moving inventory</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
