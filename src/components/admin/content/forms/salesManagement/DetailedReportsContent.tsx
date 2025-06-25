
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
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
import { FileText, Download, Filter, Calendar, TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Users, Package, ShoppingCart, DollarSign, Eye, RefreshCw, Plus, AlertCircle } from 'lucide-react';

// Sample data for detailed reports
const salesPerformanceData = [
  { month: 'Jan', totalSales: 1250000, orders: 8500, customers: 6200, avgOrderValue: 147, conversionRate: 3.2, returnRate: 2.1 },
  { month: 'Feb', totalSales: 1480000, orders: 9800, customers: 7100, avgOrderValue: 151, conversionRate: 3.5, returnRate: 1.9 },
  { month: 'Mar', totalSales: 1750000, orders: 11200, customers: 8300, avgOrderValue: 156, conversionRate: 3.8, returnRate: 1.7 },
  { month: 'Apr', totalSales: 2100000, orders: 13500, customers: 9800, avgOrderValue: 156, conversionRate: 4.1, returnRate: 1.5 },
  { month: 'May', totalSales: 2350000, orders: 15200, customers: 11200, avgOrderValue: 155, conversionRate: 4.3, returnRate: 1.4 },
  { month: 'Jun', totalSales: 2650000, orders: 17100, customers: 12800, avgOrderValue: 155, conversionRate: 4.5, returnRate: 1.3 }
];

const categoryPerformanceData = [
  { category: 'Electronics', sales: 2100000, orders: 12500, margin: 18.5, growth: 22.3, marketShare: 28.5 },
  { category: 'Fashion', sales: 1850000, orders: 18200, margin: 42.1, growth: 18.7, marketShare: 25.1 },
  { category: 'Home & Garden', sales: 1200000, orders: 8900, margin: 35.2, growth: 15.2, marketShare: 16.3 },
  { category: 'Sports', sales: 890000, orders: 6200, margin: 28.7, growth: 12.1, marketShare: 12.1 },
  { category: 'Beauty', sales: 750000, orders: 9800, margin: 48.3, growth: 28.5, marketShare: 10.2 },
  { category: 'Books', sales: 450000, orders: 5400, margin: 25.1, growth: 8.3, marketShare: 6.1 },
  { category: 'Others', sales: 160000, orders: 1200, margin: 15.8, growth: 5.2, marketShare: 1.7 }
];

const customerSegmentData = [
  { segment: 'Premium', customers: 2850, revenue: 1850000, avgSpend: 649, lifetimeValue: 2850, color: '#3b82f6' },
  { segment: 'Regular', customers: 12500, revenue: 3200000, avgSpend: 256, lifetimeValue: 980, color: '#10b981' },
  { segment: 'Occasional', customers: 18200, revenue: 2800000, avgSpend: 154, lifetimeValue: 420, color: '#f59e0b' },
  { segment: 'New', customers: 8900, revenue: 650000, avgSpend: 73, lifetimeValue: 185, color: '#ef4444' }
];

const vendorPerformanceData = [
  { vendor: 'TechWorld Electronics', sales: 580000, orders: 2850, rating: 4.8, commission: 45000, returnRate: 1.2 },
  { vendor: 'Fashion Hub BD', sales: 520000, orders: 4200, rating: 4.6, commission: 78000, returnRate: 2.1 },
  { vendor: 'Home Essentials', sales: 420000, orders: 1850, rating: 4.7, commission: 42000, returnRate: 1.8 },
  { vendor: 'Sports Galaxy', sales: 380000, orders: 1650, rating: 4.5, commission: 38000, returnRate: 1.5 },
  { vendor: 'Beauty Corner', sales: 350000, orders: 2800, rating: 4.9, commission: 52500, returnRate: 0.9 }
];

const geographicData = [
  { region: 'Dhaka Division', sales: 3250000, orders: 22500, population: 36054418, penetration: 12.5 },
  { region: 'Chittagong Division', sales: 1850000, orders: 12800, population: 28423019, penetration: 8.9 },
  { region: 'Sylhet Division', sales: 650000, orders: 4200, population: 9910219, penetration: 6.2 },
  { region: 'Rajshahi Division', sales: 580000, orders: 3800, population: 18484858, penetration: 4.8 },
  { region: 'Khulna Division', sales: 520000, orders: 3200, population: 15563000, penetration: 4.2 },
  { region: 'Barisal Division', sales: 380000, orders: 2100, population: 8325666, penetration: 3.8 },
  { region: 'Rangpur Division', sales: 320000, orders: 1850, population: 15665000, penetration: 3.1 },
  { region: 'Mymensingh Division', sales: 180000, orders: 950, population: 11370000, penetration: 2.1 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export const DetailedReportsContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('sales');
  const [reportData, setReportData] = useState({
    reportName: '',
    reportType: '',
    dateRange: '',
    filters: '',
    includeCharts: true,
    includeComparison: false,
    emailRecipients: '',
    scheduleFrequency: 'manual'
  });

  const generateReport = () => {
    console.log('Generating detailed report with data:', reportData);
    // Here you would typically call an API to generate the report
  };

  const exportReport = (format: string) => {
    console.log(`Exporting report in ${format} format`);
    // Here you would typically trigger the export functionality
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Detailed Sales Reports
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and detailed performance insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Report
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
                  <SelectItem value="custom">Custom Range</SelectItem>
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
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Revenue</SelectItem>
                  <SelectItem value="orders">Order Volume</SelectItem>
                  <SelectItem value="customers">Customer Count</SelectItem>
                  <SelectItem value="conversion">Conversion Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="ml-auto">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="generator">Report Builder</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳11.42M</div>
                <div className="flex items-center text-xs opacity-80">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.3% vs last period
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75.3K</div>
                <div className="flex items-center text-xs opacity-80">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +22.1% vs last period
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">55.6K</div>
                <div className="flex items-center text-xs opacity-80">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.7% vs last period
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳152</div>
                <div className="flex items-center text-xs opacity-80">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -2.3% vs last period
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalSales: { label: "Total Sales", color: "#3b82f6" },
                    orders: { label: "Orders", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={salesPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar yAxisId="left" dataKey="totalSales" fill="#3b82f6" name="Sales (৳)" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} name="Orders" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion & Return Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    conversionRate: { label: "Conversion Rate", color: "#10b981" },
                    returnRate: { label: "Return Rate", color: "#ef4444" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="conversionRate" stroke="#10b981" strokeWidth={3} />
                      <Line type="monotone" dataKey="returnRate" stroke="#ef4444" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesPerformanceData.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold w-12">{month.month}</div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Sales: ৳{(month.totalSales / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-gray-600">Orders: {month.orders}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Customers</div>
                        <div className="font-bold">{month.customers}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">AOV</div>
                        <div className="font-bold">৳{month.avgOrderValue}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Conv Rate</div>
                        <div className="font-bold text-green-600">{month.conversionRate}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Return Rate</div>
                        <div className="font-bold text-red-600">{month.returnRate}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sales: { label: "Sales", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryPerformanceData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="sales" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Share Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    marketShare: { label: "Market Share", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, marketShare }) => `${category}: ${marketShare}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="marketShare"
                      >
                        {categoryPerformanceData.map((entry, index) => (
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

          <Card>
            <CardHeader>
              <CardTitle>Detailed Category Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryPerformanceData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{category.category}</h4>
                      <p className="text-sm text-gray-600">Orders: {category.orders} • Market Share: {category.marketShare}%</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Sales</div>
                        <div className="font-bold">৳{(category.sales / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Margin</div>
                        <div className="font-bold text-green-600">{category.margin}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Growth</div>
                        <div className={`font-bold ${category.growth > 15 ? 'text-green-600' : 'text-orange-600'}`}>
                          +{category.growth}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ segment, revenue }) => `${segment}: ৳${(revenue/1000).toFixed(0)}K`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {customerSegmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Value Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegmentData.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{segment.segment} Customers</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Count: {segment.customers}</span>
                          <span className="text-sm">LTV: ৳{segment.lifetimeValue}</span>
                        </div>
                      </div>
                      <Progress value={(segment.customers / 42450) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Avg Spend: ৳{segment.avgSpend}</span>
                        <span>Revenue: ৳{(segment.revenue / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Vendor Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorPerformanceData.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{vendor.vendor}</h4>
                      <p className="text-sm text-gray-600">Orders: {vendor.orders} • Rating: {vendor.rating}/5.0</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Sales</div>
                        <div className="font-bold">৳{(vendor.sales / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Commission</div>
                        <div className="font-bold">৳{(vendor.commission / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Return Rate</div>
                        <div className={`font-bold ${vendor.returnRate < 2 ? 'text-green-600' : 'text-orange-600'}`}>
                          {vendor.returnRate}%
                        </div>
                      </div>
                      <Badge className={vendor.rating >= 4.7 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {vendor.rating >= 4.7 ? 'Excellent' : 'Good'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sales: { label: "Sales", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="sales" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Penetration by Division</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geographicData.map((region, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{region.region}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Sales: ৳{(region.sales / 1000).toFixed(0)}K</span>
                          <span className="text-sm">Penetration: {region.penetration}%</span>
                        </div>
                      </div>
                      <Progress value={region.penetration} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Orders: {region.orders}</span>
                        <span>Population: {(region.population / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Report Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Report Name</Label>
                    <Input
                      id="reportName"
                      value={reportData.reportName}
                      onChange={(e) => setReportData(prev => ({ ...prev, reportName: e.target.value }))}
                      placeholder="Enter report name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select value={reportData.reportType} onValueChange={(value) => setReportData(prev => ({ ...prev, reportType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales-summary">Sales Summary</SelectItem>
                        <SelectItem value="performance-analysis">Performance Analysis</SelectItem>
                        <SelectItem value="customer-insights">Customer Insights</SelectItem>
                        <SelectItem value="vendor-report">Vendor Report</SelectItem>
                        <SelectItem value="geographic-analysis">Geographic Analysis</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select value={reportData.dateRange} onValueChange={(value) => setReportData(prev => ({ ...prev, dateRange: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filters">Additional Filters</Label>
                    <Input
                      id="filters"
                      value={reportData.filters}
                      onChange={(e) => setReportData(prev => ({ ...prev, filters: e.target.value }))}
                      placeholder="e.g., category:electronics, region:dhaka"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailRecipients">Email Recipients</Label>
                    <Input
                      id="emailRecipients"
                      value={reportData.emailRecipients}
                      onChange={(e) => setReportData(prev => ({ ...prev, emailRecipients: e.target.value }))}
                      placeholder="email1@example.com, email2@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduleFrequency">Schedule Frequency</Label>
                    <Select value={reportData.scheduleFrequency} onValueChange={(value) => setReportData(prev => ({ ...prev, scheduleFrequency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeCharts"
                        checked={reportData.includeCharts}
                        onChange={(e) => setReportData(prev => ({ ...prev, includeCharts: e.target.checked }))}
                      />
                      <Label htmlFor="includeCharts">Include Charts & Visualizations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeComparison"
                        checked={reportData.includeComparison}
                        onChange={(e) => setReportData(prev => ({ ...prev, includeComparison: e.target.checked }))}
                      />
                      <Label htmlFor="includeComparison">Include Period Comparison</Label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={generateReport} className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" onClick={() => exportReport('pdf')}>
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" onClick={() => exportReport('excel')}>
                      <Download className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Report Generation Tips:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Use specific filters to focus on relevant data</li>
                      <li>• Include visualizations for better insights</li>
                      <li>• Schedule regular reports for consistent monitoring</li>
                      <li>• Compare periods to identify trends and patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
