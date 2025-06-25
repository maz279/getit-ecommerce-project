
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
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertCircle, Calculator, Download, RefreshCw, Plus, Target, ShoppingCart } from 'lucide-react';

// Sample data for cost analysis
const costBreakdownData = [
  { month: 'Jan', productCost: 320000, shippingCost: 45000, marketingCost: 85000, operationalCost: 65000, totalCost: 515000 },
  { month: 'Feb', productCost: 380000, shippingCost: 52000, marketingCost: 95000, operationalCost: 68000, totalCost: 595000 },
  { month: 'Mar', productCost: 450000, shippingCost: 61000, marketingCost: 115000, operationalCost: 72000, totalCost: 698000 },
  { month: 'Apr', productCost: 520000, shippingCost: 68000, marketingCost: 125000, operationalCost: 75000, totalCost: 788000 },
  { month: 'May', productCost: 485000, shippingCost: 64000, marketingCost: 118000, operationalCost: 73000, totalCost: 740000 },
  { month: 'Jun', productCost: 545000, shippingCost: 71000, marketingCost: 135000, operationalCost: 78000, totalCost: 829000 }
];

const costCategoryData = [
  { category: 'Product Costs', amount: 545000, percentage: 65.7, trend: 'up', color: '#3b82f6' },
  { category: 'Shipping & Logistics', amount: 71000, percentage: 8.6, trend: 'up', color: '#10b981' },
  { category: 'Marketing & Advertising', amount: 135000, percentage: 16.3, trend: 'down', color: '#f59e0b' },
  { category: 'Operational Costs', amount: 78000, percentage: 9.4, trend: 'stable', color: '#ef4444' }
];

const vendorCostData = [
  { vendor: 'TechCorp Ltd', totalCost: 185000, productCost: 165000, shippingCost: 20000, orders: 1250 },
  { vendor: 'Fashion House', totalCost: 145000, productCost: 125000, shippingCost: 20000, orders: 980 },
  { vendor: 'Home Essentials', totalCost: 95000, productCost: 80000, shippingCost: 15000, orders: 750 },
  { vendor: 'Sports Pro', totalCost: 75000, productCost: 65000, shippingCost: 10000, orders: 640 },
  { vendor: 'Beauty Plus', totalCost: 68000, productCost: 58000, shippingCost: 10000, orders: 520 }
];

const costOptimizationData = [
  { area: 'Bulk Purchasing', currentCost: 545000, optimizedCost: 485000, savings: 60000, impact: 'High' },
  { area: 'Shipping Optimization', currentCost: 71000, optimizedCost: 62000, savings: 9000, impact: 'Medium' },
  { area: 'Marketing Efficiency', currentCost: 135000, optimizedCost: 115000, savings: 20000, impact: 'High' },
  { area: 'Process Automation', currentCost: 78000, optimizedCost: 65000, savings: 13000, impact: 'Medium' }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const CostAnalysisContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newCostData, setNewCostData] = useState({
    category: '',
    vendor: '',
    costType: '',
    amount: '',
    description: '',
    targetReduction: ''
  });

  const handleCostCalculation = () => {
    const amount = parseFloat(newCostData.amount);
    const target = parseFloat(newCostData.targetReduction);
    if (amount && target) {
      const reduction = ((amount * target) / 100).toFixed(2);
      console.log(`Target cost reduction: ৳${reduction}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-red-600" />
            Cost Analysis Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive cost tracking and optimization analytics</p>
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
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Cost Entry
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
              <Label>Cost Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="product">Product Costs</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="ml-auto">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳829K</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳195</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingDown className="w-3 h-3 mr-1" />
              -3.2% improvement
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Optimization Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳102K</div>
            <div className="flex items-center text-xs opacity-80">
              <Target className="w-3 h-3 mr-1" />
              12.3% total savings
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Efficiency Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.8% from target
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Costs</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="entry">Cost Entry</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalCost: { label: "Total Cost", color: "#ef4444" },
                    productCost: { label: "Product Cost", color: "#3b82f6" },
                    operationalCost: { label: "Operational Cost", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={costBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="totalCost" stackId="1" stroke="#ef4444" fill="#ef4444" />
                      <Area type="monotone" dataKey="productCost" stackId="2" stroke="#3b82f6" fill="#3b82f6" />
                      <Area type="monotone" dataKey="operationalCost" stackId="3" stroke="#10b981" fill="#10b981" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Cost", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {costCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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

        {/* Cost Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costCategoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                      <div>
                        <h4 className="font-semibold">{category.category}</h4>
                        <p className="text-sm text-gray-600">{category.percentage}% of total costs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">৳{(category.amount / 1000).toFixed(0)}K</div>
                        <div className={`flex items-center text-sm ${
                          category.trend === 'up' ? 'text-red-600' : 
                          category.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {category.trend === 'up' ? 
                            <TrendingUp className="w-3 h-3 mr-1" /> : 
                            category.trend === 'down' ?
                            <TrendingDown className="w-3 h-3 mr-1" /> :
                            <div className="w-3 h-3 mr-1" />
                          }
                          {category.trend === 'stable' ? 'Stable' : 
                           category.trend === 'up' ? '+8.2%' : '-4.1%'}
                        </div>
                      </div>
                      <Progress value={category.percentage} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Costs Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorCostData.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{vendor.vendor}</h4>
                      <p className="text-sm text-gray-600">{vendor.orders} orders • Avg: ৳{(vendor.totalCost / vendor.orders).toFixed(0)} per order</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Product Cost</div>
                        <div className="font-bold">৳{(vendor.productCost / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Shipping Cost</div>
                        <div className="font-bold">৳{(vendor.shippingCost / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Total Cost</div>
                        <div className="font-bold text-lg">৳{(vendor.totalCost / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costOptimizationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{item.area}</h4>
                      <p className="text-sm text-gray-600">Current: ৳{(item.currentCost / 1000).toFixed(0)}K → Optimized: ৳{(item.optimizedCost / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={item.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {item.impact} Impact
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold text-green-600">৳{(item.savings / 1000).toFixed(0)}K Savings</div>
                        <div className="text-sm text-gray-500">{((item.savings / item.currentCost) * 100).toFixed(1)}% reduction</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Entry Tab */}
        <TabsContent value="entry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Cost Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Cost Category</Label>
                    <Select value={newCostData.category} onValueChange={(value) => setNewCostData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product Costs</SelectItem>
                        <SelectItem value="shipping">Shipping & Logistics</SelectItem>
                        <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                        <SelectItem value="operational">Operational Costs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Supplier</Label>
                    <Select value={newCostData.vendor} onValueChange={(value) => setNewCostData(prev => ({ ...prev, vendor: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="techcorp">TechCorp Ltd</SelectItem>
                        <SelectItem value="fashion">Fashion House</SelectItem>
                        <SelectItem value="home">Home Essentials</SelectItem>
                        <SelectItem value="sports">Sports Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costType">Cost Type</Label>
                    <Select value={newCostData.costType} onValueChange={(value) => setNewCostData(prev => ({ ...prev, costType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cost type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Cost</SelectItem>
                        <SelectItem value="variable">Variable Cost</SelectItem>
                        <SelectItem value="one-time">One-time Cost</SelectItem>
                        <SelectItem value="recurring">Recurring Cost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (৳)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newCostData.amount}
                      onChange={(e) => setNewCostData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newCostData.description}
                      onChange={(e) => setNewCostData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter cost description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetReduction">Target Reduction (%)</Label>
                    <Input
                      id="targetReduction"
                      type="number"
                      value={newCostData.targetReduction}
                      onChange={(e) => setNewCostData(prev => ({ ...prev, targetReduction: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <Button onClick={handleCostCalculation} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate & Add Entry
                  </Button>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">Cost Management Tips:</p>
                        <ul className="mt-1 space-y-1">
                          <li>• Track all variable costs regularly</li>
                          <li>• Set reduction targets for optimization</li>
                          <li>• Monitor vendor performance vs costs</li>
                          <li>• Review operational efficiency monthly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Forecasting & Budgeting</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  projected: { label: "Projected Costs", color: "#f59e0b" },
                  actual: { label: "Actual Costs", color: "#ef4444" },
                  budget: { label: "Budget Limit", color: "#10b981" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={costBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="totalCost" stroke="#ef4444" name="Actual Costs" />
                    <Line type="monotone" dataKey="productCost" stroke="#f59e0b" strokeDasharray="5 5" name="Projected Costs" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
