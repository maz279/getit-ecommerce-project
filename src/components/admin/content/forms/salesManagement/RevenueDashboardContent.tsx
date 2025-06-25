
import React, { useState } from 'react';
import { DollarSign, TrendingUp, BarChart3, PieChart, Calculator, Target, ArrowUpRight, ArrowDownRight, RefreshCw, Download, Settings, Calendar, Filter, Users, ShoppingCart, CreditCard, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export const RevenueDashboardContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock revenue data
  const revenueData = [
    { date: '2024-01-01', revenue: 120000, orders: 450, avgOrder: 267 },
    { date: '2024-01-02', revenue: 135000, orders: 520, avgOrder: 260 },
    { date: '2024-01-03', revenue: 128000, orders: 480, avgOrder: 267 },
    { date: '2024-01-04', revenue: 142000, orders: 560, avgOrder: 254 },
    { date: '2024-01-05', revenue: 156000, orders: 590, avgOrder: 264 },
    { date: '2024-01-06', revenue: 149000, orders: 575, avgOrder: 259 },
    { date: '2024-01-07', revenue: 163000, orders: 610, avgOrder: 267 }
  ];

  const categoryRevenue = [
    { category: 'Electronics', revenue: 2800000, percentage: 35, growth: 15.2, color: '#3b82f6' },
    { category: 'Fashion', revenue: 2240000, percentage: 28, growth: 12.8, color: '#10b981' },
    { category: 'Home & Garden', revenue: 1600000, percentage: 20, growth: 18.5, color: '#f59e0b' },
    { category: 'Sports', revenue: 880000, percentage: 11, growth: 8.3, color: '#ef4444' },
    { category: 'Others', revenue: 480000, percentage: 6, growth: 5.1, color: '#8b5cf6' }
  ];

  const regionRevenue = [
    { region: 'Dhaka', revenue: 3200000, growth: 14.5, orders: 12500 },
    { region: 'Chittagong', revenue: 1800000, growth: 12.3, orders: 7200 },
    { region: 'Sylhet', revenue: 950000, growth: 16.8, orders: 3800 },
    { region: 'Rajshahi', revenue: 720000, growth: 9.2, orders: 2900 },
    { region: 'Khulna', revenue: 650000, growth: 11.7, orders: 2600 }
  ];

  const paymentMethods = [
    { method: 'Mobile Banking', revenue: 3500000, percentage: 45, transactions: 15680 },
    { method: 'Cash on Delivery', revenue: 2800000, percentage: 36, transactions: 12340 },
    { method: 'Credit/Debit Card', revenue: 980000, percentage: 12, transactions: 4250 },
    { method: 'Bank Transfer', revenue: 520000, percentage: 7, transactions: 1890 }
  ];

  const monthlyTargets = [
    { month: 'Jan', target: 8000000, achieved: 7800000, percentage: 97.5 },
    { month: 'Feb', target: 8200000, achieved: 8450000, percentage: 103.0 },
    { month: 'Mar', target: 8500000, achieved: 8200000, percentage: 96.5 },
    { month: 'Apr', target: 8800000, achieved: 9100000, percentage: 103.4 },
    { month: 'May', target: 9000000, achieved: 8750000, percentage: 97.2 },
    { month: 'Jun', target: 9200000, achieved: 9580000, percentage: 104.1 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            Revenue Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive revenue tracking and performance analytics</p>
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
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Filters & Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 3 Months</SelectItem>
                  <SelectItem value="12m">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="dhaka">Dhaka</SelectItem>
                  <SelectItem value="chittagong">Chittagong</SelectItem>
                  <SelectItem value="sylhet">Sylhet</SelectItem>
                  <SelectItem value="other">Other Cities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Currency Display</Label>
              <Select defaultValue="bdt">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bdt">BDT (৳)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳7.8M</div>
            <div className="flex items-center text-xs opacity-80">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12.5% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Order Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28,450</div>
            <div className="flex items-center text-xs opacity-80">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +8.3% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳274</div>
            <div className="flex items-center text-xs opacity-80">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +3.8% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Target Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">104.1%</div>
            <div className="flex items-center text-xs opacity-80">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Above target by 4.1%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="regions">Regional</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="targets">Targets & Goals</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Revenue Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Today's Revenue</p>
                      <p className="text-2xl font-bold text-green-600">৳163,000</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      +9.2%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Weekly Average</p>
                      <p className="text-2xl font-bold text-blue-600">৳142,000</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      +12.5%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Projection</p>
                      <p className="text-2xl font-bold text-purple-600">৳9.6M</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      +8.7%
                    </Badge>
                  </div>
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
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryRevenue}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="revenue"
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                      >
                        {categoryRevenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryRevenue.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">৳{(category.revenue / 1000000).toFixed(1)}M</span>
                          <Badge className={category.growth > 15 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            +{category.growth}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Revenue Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionRevenue.map((region, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        {region.region}
                      </h4>
                      <Badge className={region.growth > 15 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        +{region.growth}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-bold">৳{(region.revenue / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Orders</p>
                        <p className="font-bold">{region.orders.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Order</p>
                        <p className="font-bold">৳{Math.round(region.revenue / region.orders)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {method.method}
                        </span>
                        <span className="text-sm">৳{(method.revenue / 1000000).toFixed(1)}M ({method.percentage}%)</span>
                      </div>
                      <Progress value={method.percentage} className="h-2" />
                      <div className="text-xs text-gray-600">
                        {method.transactions.toLocaleString()} transactions
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentMethods}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="method" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Targets vs Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTargets.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{month.month} 2024</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">৳{(month.achieved / 1000000).toFixed(1)}M / ৳{(month.target / 1000000).toFixed(1)}M</span>
                        <Badge className={month.percentage >= 100 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                          {month.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={month.percentage > 100 ? 100 : month.percentage} className="h-2" />
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
