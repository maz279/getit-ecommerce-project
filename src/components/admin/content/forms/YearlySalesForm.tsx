
import React, { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, PieChart, Target, Users, ShoppingCart, DollarSign, Download, Filter, RefreshCw, AlertCircle, ArrowUp, ArrowDown, Eye, Settings, FileText, Zap, Globe, Award, Clock, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Mock data for yearly analysis
const yearlyTrendsData = [
  { year: '2019', revenue: 18500000, orders: 125000, customers: 65000, growth: 15.2, profit: 3700000, vendors: 1200 },
  { year: '2020', revenue: 22100000, orders: 148000, customers: 78000, growth: 19.5, profit: 4420000, vendors: 1450 },
  { year: '2021', revenue: 28600000, orders: 185000, customers: 98000, growth: 29.4, profit: 5720000, vendors: 1800 },
  { year: '2022', revenue: 35200000, orders: 228000, customers: 125000, growth: 23.1, profit: 7040000, vendors: 2200 },
  { year: '2023', revenue: 44800000, orders: 285000, customers: 156000, growth: 27.3, profit: 8960000, vendors: 2650 },
  { year: '2024', revenue: 58500000, orders: 365000, customers: 198000, growth: 30.6, profit: 11700000, vendors: 3200 }
];

const quarterlyBreakdown = [
  { quarter: 'Q1 2024', revenue: 12800000, orders: 82000, growth: 28.5, customers: 45000 },
  { quarter: 'Q2 2024', revenue: 14200000, orders: 89000, growth: 31.2, customers: 48500 },
  { quarter: 'Q3 2024', revenue: 15600000, orders: 96000, growth: 32.8, customers: 52000 },
  { quarter: 'Q4 2024', revenue: 15900000, orders: 98000, growth: 29.9, customers: 52500 }
];

const categoryPerformanceData = [
  { category: 'Electronics', revenue: 18500000, growth: 32.5, marketShare: 31.6, orders: 115000 },
  { category: 'Fashion', revenue: 15200000, growth: 28.9, marketShare: 26.0, orders: 98000 },
  { category: 'Home & Garden', revenue: 9800000, growth: 25.1, marketShare: 16.8, orders: 65000 },
  { category: 'Books & Education', revenue: 6200000, growth: 22.3, marketShare: 10.6, orders: 42000 },
  { category: 'Sports & Outdoors', revenue: 5100000, growth: 29.8, marketShare: 8.7, orders: 28000 },
  { category: 'Health & Beauty', revenue: 3700000, growth: 35.2, marketShare: 6.3, orders: 17000 }
];

const customerSegmentAnalysis = [
  { segment: 'Premium Customers', count: 28500, revenue: 23400000, avgOrderValue: 821, retention: 92 },
  { segment: 'Regular Customers', count: 89200, revenue: 26300000, avgOrderValue: 295, retention: 78 },
  { segment: 'New Customers', count: 58600, revenue: 7200000, avgOrderValue: 123, retention: 45 },
  { segment: 'Inactive Customers', count: 21700, revenue: 1600000, avgOrderValue: 74, retention: 12 }
];

const vendorPerformanceData = [
  { tier: 'Top Tier (1-50)', count: 50, revenue: 29200000, avgRevenue: 584000, commission: 4380000 },
  { tier: 'Mid Tier (51-200)', count: 150, revenue: 18600000, avgRevenue: 124000, commission: 2790000 },
  { tier: 'Growing (201-500)', count: 300, revenue: 8500000, avgRevenue: 28333, commission: 1275000 },
  { tier: 'New Vendors (500+)', count: 2700, revenue: 2200000, avgRevenue: 815, commission: 330000 }
];

const businessMetrics = [
  { metric: 'Customer Acquisition Cost', value: 45, target: 40, unit: '৳', trend: 'up', performance: 'warning' },
  { metric: 'Customer Lifetime Value', value: 2850, target: 3000, unit: '৳', trend: 'up', performance: 'good' },
  { metric: 'Average Order Value', value: 160, target: 180, unit: '৳', trend: 'down', performance: 'warning' },
  { metric: 'Conversion Rate', value: 3.8, target: 4.2, unit: '%', trend: 'up', performance: 'good' },
  { metric: 'Cart Abandonment Rate', value: 68, target: 60, unit: '%', trend: 'down', performance: 'warning' },
  { metric: 'Return Rate', value: 12, target: 10, unit: '%', trend: 'up', performance: 'critical' }
];

const competitiveAnalysis = [
  { metric: 'Market Share', our: 12.5, competitor1: 28.3, competitor2: 15.8, competitor3: 11.2 },
  { metric: 'Customer Satisfaction', our: 4.2, competitor1: 4.5, competitor2: 3.9, competitor3: 4.1 },
  { metric: 'Delivery Speed', our: 2.1, competitor1: 1.8, competitor2: 2.5, competitor3: 2.3 },
  { metric: 'Price Competitiveness', our: 4.1, competitor1: 3.8, competitor2: 4.3, competitor3: 3.6 },
  { metric: 'Product Variety', our: 3.9, competitor1: 4.7, competitor2: 3.5, competitor3: 4.0 }
];

const forecastData = [
  { period: '2025 Q1', conservative: 16800000, optimistic: 18900000, realistic: 17650000 },
  { period: '2025 Q2', conservative: 18200000, optimistic: 21500000, realistic: 19400000 },
  { period: '2025 Q3', conservative: 19500000, optimistic: 23800000, realistic: 21200000 },
  { period: '2025 Q4', conservative: 21000000, optimistic: 26200000, realistic: 23100000 }
];

export const YearlySalesForm: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedComparison, setSelectedComparison] = useState('year-over-year');
  const [selectedView, setSelectedView] = useState('overview');
  const [activeTab, setActiveTab] = useState('performance');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => setIsGeneratingReport(false), 3000);
  };

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* Year-over-Year Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Year-over-Year Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "#3b82f6" },
              orders: { label: "Orders", color: "#10b981" },
              customers: { label: "Customers", color: "#f59e0b" }
            }}
            className="h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={yearlyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Bar yAxisId="right" dataKey="orders" fill="#10b981" />
                <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#f59e0b" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Quarterly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>2024 Quarterly Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "#8b5cf6" }
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quarterlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="space-y-4">
              {quarterlyBreakdown.map((quarter, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{quarter.quarter}</h4>
                    <Badge className={quarter.growth > 30 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      +{quarter.growth}% Growth
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-medium">৳{(quarter.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Orders</p>
                      <p className="font-medium">{(quarter.orders / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Customers</p>
                      <p className="font-medium">{(quarter.customers / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryPerformanceData.map((category, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{category.category}</h4>
                  <div className="flex items-center gap-2">
                    <Badge>Share: {category.marketShare}%</Badge>
                    <Badge className={category.growth > 30 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      +{category.growth}%
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-lg font-bold">৳{(category.revenue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Orders</p>
                    <p className="text-lg font-bold">{(category.orders / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Growth</p>
                    <p className="text-lg font-bold text-green-600">+{category.growth}%</p>
                  </div>
                </div>
                <Progress value={category.marketShare * 3} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "#06b6d4" }
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="space-y-3">
              {customerSegmentAnalysis.map((segment, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">{segment.segment}</h5>
                    <Badge className={segment.retention > 80 ? 'bg-green-100 text-green-800' : segment.retention > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                      {segment.retention}% Retention
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Count</p>
                      <p className="font-medium">{segment.count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-medium">৳{(segment.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-gray-600">AOV</p>
                      <p className="font-medium">৳{segment.avgOrderValue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      {/* Business Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Business Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-sm">{metric.metric}</h5>
                  <Badge className={
                    metric.performance === 'critical' ? 'bg-red-100 text-red-800' :
                    metric.performance === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {metric.performance}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold">{metric.value}{metric.unit}</span>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  Target: {metric.target}{metric.unit}
                </div>
                <Progress 
                  value={metric.performance === 'critical' ? 25 : metric.performance === 'warning' ? 65 : 85} 
                  className="h-2 mt-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Competitive Benchmarking</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              our: { label: "Our Platform", color: "#3b82f6" },
              competitor1: { label: "Competitor A", color: "#ef4444" },
              competitor2: { label: "Competitor B", color: "#10b981" },
              competitor3: { label: "Competitor C", color: "#f59e0b" }
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competitiveAnalysis}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar name="Our Platform" dataKey="our" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Competitor A" dataKey="competitor1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderForecastTab = () => (
    <div className="space-y-6">
      {/* Revenue Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>2025 Revenue Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              conservative: { label: "Conservative", color: "#ef4444" },
              realistic: { label: "Realistic", color: "#3b82f6" },
              optimistic: { label: "Optimistic", color: "#10b981" }
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="conservative" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="realistic" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="optimistic" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Vendor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Tier Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendorPerformanceData.map((tier, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{tier.tier}</h4>
                  <Badge className="bg-purple-100 text-purple-800">
                    {tier.count} Vendors
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-lg font-bold">৳{(tier.revenue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Revenue</p>
                    <p className="text-lg font-bold">৳{(tier.avgRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Commission</p>
                    <p className="text-lg font-bold">৳{(tier.commission / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Performance</p>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{index === 0 ? 'Excellent' : index === 1 ? 'Good' : index === 2 ? 'Average' : 'Growing'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Yearly Sales Reports
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive annual performance analysis and strategic insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateReport} disabled={isGeneratingReport}>
            {isGeneratingReport ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Generate Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Report Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Report Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Comparison</label>
              <Select value={selectedComparison} onValueChange={setSelectedComparison}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year-over-year">Year over Year</SelectItem>
                  <SelectItem value="quarterly">Quarterly Analysis</SelectItem>
                  <SelectItem value="historical">Historical Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">View Type</label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Executive Overview</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="forecast">Forecast & Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Revenue</p>
                <p className="text-3xl font-bold">৳58.5M</p>
                <p className="text-sm opacity-80 mt-1 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +30.6% vs 2023
                </p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Orders</p>
                <p className="text-3xl font-bold">365K</p>
                <p className="text-sm opacity-80 mt-1 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +28.1% vs 2023
                </p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Active Customers</p>
                <p className="text-3xl font-bold">198K</p>
                <p className="text-sm opacity-80 mt-1 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +26.9% vs 2023
                </p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Active Vendors</p>
                <p className="text-3xl font-bold">3.2K</p>
                <p className="text-sm opacity-80 mt-1 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +20.8% vs 2023
                </p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="mt-6">
              {renderPerformanceTab()}
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              {renderAnalyticsTab()}
            </TabsContent>
            
            <TabsContent value="insights" className="mt-6">
              {renderInsightsTab()}
            </TabsContent>
            
            <TabsContent value="forecast" className="mt-6">
              {renderForecastTab()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
