
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertCircle, Calculator, Download, RefreshCw, Plus } from 'lucide-react';

// Sample data for profit margin analysis
const profitMarginData = [
  { month: 'Jan', grossMargin: 45.2, netMargin: 12.8, revenue: 850000, costs: 465000 },
  { month: 'Feb', grossMargin: 47.1, netMargin: 14.2, revenue: 920000, costs: 487000 },
  { month: 'Mar', grossMargin: 44.8, netMargin: 11.9, revenue: 1100000, costs: 607000 },
  { month: 'Apr', grossMargin: 46.5, netMargin: 13.5, revenue: 1250000, costs: 668000 },
  { month: 'May', grossMargin: 48.2, netMargin: 15.1, revenue: 1180000, costs: 611000 },
  { month: 'Jun', grossMargin: 49.1, netMargin: 16.3, revenue: 1320000, costs: 672000 }
];

const categoryMargins = [
  { category: 'Electronics', margin: 18.5, revenue: 2800000, trend: 'up' },
  { category: 'Fashion', margin: 22.3, revenue: 2200000, trend: 'up' },
  { category: 'Home & Garden', margin: 15.2, revenue: 1500000, trend: 'down' },
  { category: 'Sports', margin: 19.8, revenue: 980000, trend: 'up' },
  { category: 'Beauty', margin: 25.1, revenue: 1200000, trend: 'up' }
];

const vendorMargins = [
  { vendor: 'TechCorp Ltd', margin: 16.8, orders: 1250, revenue: 850000 },
  { vendor: 'Fashion House', margin: 24.2, orders: 980, revenue: 720000 },
  { vendor: 'Home Essentials', margin: 12.5, orders: 750, revenue: 490000 },
  { vendor: 'Sports Pro', margin: 18.9, orders: 640, revenue: 380000 },
  { vendor: 'Beauty Plus', margin: 28.3, orders: 520, revenue: 420000 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ProfitMarginContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newMarginData, setNewMarginData] = useState({
    product: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    expectedMargin: ''
  });

  const handleMarginCalculation = () => {
    const cost = parseFloat(newMarginData.costPrice);
    const selling = parseFloat(newMarginData.sellingPrice);
    if (cost && selling) {
      const margin = ((selling - cost) / selling * 100).toFixed(2);
      setNewMarginData(prev => ({ ...prev, expectedMargin: margin }));
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-blue-600" />
            Profit Margin Analysis
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive profit margin tracking and optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="ml-auto">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Gross Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47.2%</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.8%</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingUp className="w-3 h-3 mr-1" />
              +1.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳125</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingDown className="w-3 h-3 mr-1" />
              -0.8% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳1.82M</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="vendors">By Vendor</TabsTrigger>
          <TabsTrigger value="calculator">Margin Calculator</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit Margin Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    grossMargin: { label: "Gross Margin", color: "#3b82f6" },
                    netMargin: { label: "Net Margin", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitMarginData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="grossMargin" stroke="#3b82f6" name="Gross Margin %" />
                      <Line type="monotone" dataKey="netMargin" stroke="#10b981" name="Net Margin %" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "#3b82f6" },
                    costs: { label: "Costs", color: "#ef4444" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profitMarginData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      <Bar dataKey="costs" fill="#ef4444" name="Costs" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profit Margins by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryMargins.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Package className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-semibold">{category.category}</h4>
                        <p className="text-sm text-gray-600">Revenue: ৳{(category.revenue / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">{category.margin}%</div>
                        <div className={`flex items-center text-sm ${category.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {category.trend === 'up' ? 
                            <TrendingUp className="w-3 h-3 mr-1" /> : 
                            <TrendingDown className="w-3 h-3 mr-1" />
                          }
                          {category.trend === 'up' ? '+' : '-'}2.1%
                        </div>
                      </div>
                      <Progress value={category.margin} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Profit Margins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorMargins.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{vendor.vendor}</h4>
                      <p className="text-sm text-gray-600">{vendor.orders} orders • ৳{(vendor.revenue / 1000).toFixed(0)}K revenue</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={vendor.margin > 20 ? 'bg-green-100 text-green-800' : vendor.margin > 15 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                        {vendor.margin}% margin
                      </Badge>
                      <Progress value={vendor.margin} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Margin Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profit Margin Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product Name</Label>
                    <Input
                      id="product"
                      value={newMarginData.product}
                      onChange={(e) => setNewMarginData(prev => ({ ...prev, product: e.target.value }))}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newMarginData.category} onValueChange={(value) => setNewMarginData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price (৳)</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      value={newMarginData.costPrice}
                      onChange={(e) => setNewMarginData(prev => ({ ...prev, costPrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling Price (৳)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={newMarginData.sellingPrice}
                      onChange={(e) => setNewMarginData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <Button onClick={handleMarginCalculation} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Margin
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Calculation Results</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Cost Price:</span>
                        <span>৳{newMarginData.costPrice || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Selling Price:</span>
                        <span>৳{newMarginData.sellingPrice || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit:</span>
                        <span>৳{newMarginData.costPrice && newMarginData.sellingPrice ? 
                          (parseFloat(newMarginData.sellingPrice) - parseFloat(newMarginData.costPrice)).toFixed(2) : 
                          '0.00'}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Profit Margin:</span>
                        <span className="text-green-600">{newMarginData.expectedMargin || '0.00'}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">Margin Guidelines:</p>
                        <ul className="mt-1 space-y-1">
                          <li>• 20%+ is excellent</li>
                          <li>• 15-20% is good</li>
                          <li>• 10-15% is average</li>
                          <li>• Below 10% needs attention</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border-l-4 border-green-400">
                    <h4 className="font-semibold text-green-800">High Potential Categories</h4>
                    <p className="text-sm text-green-700 mt-1">Beauty and Fashion categories show strong margin potential</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                    <h4 className="font-semibold text-yellow-800">Cost Optimization</h4>
                    <p className="text-sm text-yellow-700 mt-1">Review supplier contracts for Home & Garden category</p>
                  </div>
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-800">Pricing Strategy</h4>
                    <p className="text-sm text-blue-700 mt-1">Consider dynamic pricing for Electronics to improve margins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Margin Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Margin", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryMargins}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, margin }) => `${category}: ${margin}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="margin"
                      >
                        {categoryMargins.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
