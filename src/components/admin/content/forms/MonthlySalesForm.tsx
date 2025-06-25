
import React, { useState } from 'react';
import { TrendingUp, Calendar, BarChart3, PieChart, Target, Users, ShoppingCart, DollarSign, Download, Filter, RefreshCw, AlertCircle, ArrowUp, ArrowDown, Eye, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';

// Mock data for monthly trends
const monthlyTrendsData = [
  { month: 'Jan', sales: 2400000, orders: 12000, customers: 8500, growth: 12.5, revenue: 2400000, profit: 480000 },
  { month: 'Feb', sales: 2100000, orders: 10500, customers: 7800, growth: -12.5, revenue: 2100000, profit: 420000 },
  { month: 'Mar', sales: 2800000, orders: 14000, customers: 9200, growth: 33.3, revenue: 2800000, profit: 560000 },
  { month: 'Apr', sales: 3200000, orders: 16000, customers: 10500, growth: 14.3, revenue: 3200000, profit: 640000 },
  { month: 'May', sales: 2900000, orders: 14500, customers: 9800, growth: -9.4, revenue: 2900000, profit: 580000 },
  { month: 'Jun', sales: 3500000, orders: 17500, customers: 11200, growth: 20.7, revenue: 3500000, profit: 700000 },
  { month: 'Jul', sales: 3800000, orders: 19000, customers: 12000, growth: 8.6, revenue: 3800000, profit: 760000 },
  { month: 'Aug', sales: 3600000, orders: 18000, customers: 11500, growth: -5.3, revenue: 3600000, profit: 720000 },
  { month: 'Sep', sales: 4200000, orders: 21000, customers: 13500, growth: 16.7, revenue: 4200000, profit: 840000 },
  { month: 'Oct', sales: 4500000, orders: 22500, customers: 14200, growth: 7.1, revenue: 4500000, profit: 900000 },
  { month: 'Nov', sales: 5200000, orders: 26000, customers: 16500, growth: 15.6, revenue: 5200000, profit: 1040000 },
  { month: 'Dec', sales: 6800000, orders: 34000, customers: 21000, growth: 30.8, revenue: 6800000, profit: 1360000 }
];

const categoryTrendsData = [
  { category: 'Electronics', jan: 850000, feb: 780000, mar: 920000, apr: 1050000, may: 980000, jun: 1200000, growth: 15.2 },
  { category: 'Fashion', jan: 650000, feb: 580000, mar: 720000, apr: 820000, may: 750000, jun: 890000, growth: 12.8 },
  { category: 'Home & Garden', jan: 420000, feb: 390000, mar: 480000, apr: 520000, may: 490000, jun: 580000, growth: 11.5 },
  { category: 'Books', jan: 180000, feb: 160000, mar: 200000, apr: 220000, may: 210000, jun: 240000, growth: 8.7 },
  { category: 'Sports', jan: 290000, feb: 270000, mar: 320000, apr: 350000, may: 340000, jun: 390000, growth: 14.2 }
];

const customerSegmentData = [
  { segment: 'New Customers', count: 45200, percentage: 35, revenue: 1580000, growth: 28.5 },
  { segment: 'Returning Customers', count: 58700, percentage: 45, revenue: 2350000, growth: 12.3 },
  { segment: 'VIP Customers', count: 12800, percentage: 10, revenue: 1920000, growth: 18.7 },
  { segment: 'Premium Members', count: 13100, percentage: 10, revenue: 1650000, growth: 22.1 }
];

const monthlyGoalsData = [
  { metric: 'Sales Revenue', target: 4000000, actual: 3500000, achievement: 87.5, status: 'warning' },
  { metric: 'New Customers', target: 12000, actual: 11200, achievement: 93.3, status: 'good' },
  { metric: 'Order Volume', target: 18000, actual: 17500, achievement: 97.2, status: 'excellent' },
  { metric: 'Profit Margin', target: 22, actual: 20, achievement: 90.9, status: 'good' }
];

const predictiveData = [
  { month: 'Jul', actual: 3800000, predicted: 3750000, confidence: 85 },
  { month: 'Aug', actual: 3600000, predicted: 3650000, confidence: 82 },
  { month: 'Sep', actual: 4200000, predicted: 4100000, confidence: 88 },
  { month: 'Oct', actual: null, predicted: 4650000, confidence: 78 },
  { month: 'Nov', actual: null, predicted: 5100000, confidence: 75 },
  { month: 'Dec', actual: null, predicted: 5800000, confidence: 72 }
];

export const MonthlySalesForm: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('trends');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => setIsGeneratingReport(false), 2000);
  };

  const renderTrendsView = () => (
    <div className="space-y-6">
      {/* Monthly Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Monthly Sales Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: { label: "Sales", color: "#3b82f6" },
                orders: { label: "Orders", color: "#10b981" }
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Bar yAxisId="right" dataKey="orders" fill="#10b981" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Rate Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                growth: { label: "Growth %", color: "#f59e0b" }
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryTrendsData.map((category, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{category.category}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={category.growth > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {['jan', 'feb', 'mar', 'apr', 'may', 'jun'].map((month) => (
                    <div key={month} className="text-center">
                      <p className="text-xs text-gray-600 capitalize">{month}</p>
                      <p className="text-sm font-medium">৳{(category[month as keyof typeof category] as number / 1000).toFixed(0)}K</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerSegmentData.map((segment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm mb-2">{segment.segment}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Count:</span>
                    <span className="text-sm font-medium">{segment.count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Revenue:</span>
                    <span className="text-sm font-medium">৳{(segment.revenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Growth:</span>
                    <Badge className={segment.growth > 15 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      +{segment.growth}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGoalsView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Goals & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {monthlyGoalsData.map((goal, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{goal.metric}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {goal.actual.toLocaleString()} / {goal.target.toLocaleString()}
                    </span>
                    <Badge className={
                      goal.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      goal.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {goal.achievement}%
                    </Badge>
                  </div>
                </div>
                <Progress value={goal.achievement} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              actual: { label: "Actual", color: "#3b82f6" },
              predicted: { label: "Predicted", color: "#f59e0b" }
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictiveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
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
            <Calendar className="w-8 h-8 text-blue-600" />
            Monthly Sales Trends
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive monthly performance analysis and forecasting</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateReport} disabled={isGeneratingReport}>
            {isGeneratingReport ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure Goals
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Quarter</label>
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quarters</SelectItem>
                  <SelectItem value="q1">Q1 (Jan-Mar)</SelectItem>
                  <SelectItem value="q2">Q2 (Apr-Jun)</SelectItem>
                  <SelectItem value="q3">Q3 (Jul-Sep)</SelectItem>
                  <SelectItem value="q4">Q4 (Oct-Dec)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
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
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">View Mode</label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trends">Trends Analysis</SelectItem>
                  <SelectItem value="goals">Goals & Forecasts</SelectItem>
                  <SelectItem value="comparison">Year Comparison</SelectItem>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">৳3.5M</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +20.7% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Orders</p>
                <p className="text-3xl font-bold text-gray-900">17.5K</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +8.6% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-3xl font-bold text-gray-900">11.2K</p>
                <p className="text-sm text-blue-600 mt-1 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +14.2% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900">৳200</p>
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <ArrowDown className="w-4 h-4 mr-1" />
                  -3.2% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Content Based on View Mode */}
      {viewMode === 'trends' && renderTrendsView()}
      {viewMode === 'goals' && renderGoalsView()}
      {viewMode === 'comparison' && renderTrendsView()}
    </div>
  );
};
