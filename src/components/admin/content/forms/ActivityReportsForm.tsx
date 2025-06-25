import React, { useState } from 'react';
import { BarChart as BarChartIcon, FileText, TrendingUp, Users, Calendar, Download, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Mock data for activity reports
const activitySummaryData = [
  { period: 'Jan', totalActivities: 12450, uniqueUsers: 3420, averageSessionTime: 8.5 },
  { period: 'Feb', totalActivities: 15600, uniqueUsers: 3890, averageSessionTime: 9.2 },
  { period: 'Mar', totalActivities: 18200, uniqueUsers: 4520, averageSessionTime: 10.1 },
  { period: 'Apr', totalActivities: 21300, uniqueUsers: 5100, averageSessionTime: 11.3 },
  { period: 'May', totalActivities: 24800, uniqueUsers: 5680, averageSessionTime: 12.0 },
  { period: 'Jun', totalActivities: 28500, uniqueUsers: 6200, averageSessionTime: 12.8 }
];

const categoryBreakdown = [
  { category: 'Product Browsing', count: 45600, percentage: 38, color: '#3b82f6' },
  { category: 'Search Activities', count: 32400, percentage: 27, color: '#10b981' },
  { category: 'Cart Operations', count: 18900, percentage: 16, color: '#f59e0b' },
  { category: 'Account Management', count: 12800, percentage: 11, color: '#ef4444' },
  { category: 'Social Interactions', count: 9600, percentage: 8, color: '#8b5cf6' }
];

const deviceAnalytics = [
  { device: 'Mobile', users: 24500, sessions: 45600, bounceRate: 25.4 },
  { device: 'Desktop', users: 18200, sessions: 32800, bounceRate: 18.2 },
  { device: 'Tablet', users: 8900, sessions: 15200, bounceRate: 22.8 }
];

const peakHoursData = [
  { hour: '00:00', activities: 580 },
  { hour: '02:00', activities: 320 },
  { hour: '04:00', activities: 190 },
  { hour: '06:00', activities: 450 },
  { hour: '08:00', activities: 1200 },
  { hour: '10:00', activities: 2800 },
  { hour: '12:00', activities: 3400 },
  { hour: '14:00', activities: 2900 },
  { hour: '16:00', activities: 3200 },
  { hour: '18:00', activities: 4100 },
  { hour: '20:00', activities: 3800 },
  { hour: '22:00', activities: 2200 }
];

const topPages = [
  { page: '/products/electronics', views: 24500, uniqueViews: 18200, avgTime: '3:45' },
  { page: '/categories/fashion', views: 18900, uniqueViews: 14600, avgTime: '4:12' },
  { page: '/deals/flash-sale', views: 15600, uniqueViews: 12800, avgTime: '2:58' },
  { page: '/search/results', views: 12400, uniqueViews: 9800, avgTime: '2:34' },
  { page: '/account/dashboard', views: 8900, uniqueViews: 7200, avgTime: '5:23' }
];

export const ActivityReportsForm: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => setIsGeneratingReport(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Activity Reports
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and reporting for user activities</p>
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
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900">120,850</p>
                <p className="text-sm text-green-600 mt-1">+15.3% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">28,400</p>
                <p className="text-sm text-blue-600 mt-1">+8.7% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
                <p className="text-3xl font-bold text-gray-900">12.8min</p>
                <p className="text-sm text-green-600 mt-1">+12.4% from last month</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Report Growth</p>
                <p className="text-3xl font-bold text-gray-900">+24.5%</p>
                <p className="text-sm text-green-600 mt-1">Activity increase</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="time-period">Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="browsing">Product Browsing</SelectItem>
                  <SelectItem value="search">Search Activities</SelectItem>
                  <SelectItem value="cart">Cart Operations</SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="user-segment">User Segment</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="returning">Returning Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="device">Device Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Devices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Activity Trends</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Trends (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalActivities: { label: "Total Activities", color: "#3b82f6" },
                    uniqueUsers: { label: "Unique Users", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activitySummaryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="totalActivities" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="uniqueUsers" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: { label: "Activities", color: "#8884d8" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                      >
                        {categoryBreakdown.map((entry, index) => (
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

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{page.page}</p>
                      <p className="text-sm text-gray-600">Avg. Time: {page.avgTime}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{page.views.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Total Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{page.uniqueViews.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Unique Views</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Peak Activity Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  activities: { label: "Activities", color: "#3b82f6" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="activities" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryBreakdown.map((category, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{category.category}</p>
                      <p className="text-2xl font-bold text-gray-900">{category.count.toLocaleString()}</p>
                      <Badge variant="secondary" className="mt-2">
                        {category.percentage}% of total
                      </Badge>
                    </div>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceAnalytics.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium">{device.device.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{device.device}</p>
                        <p className="text-sm text-gray-600">{device.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{device.sessions.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Sessions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{device.bounceRate}%</p>
                        <p className="text-xs text-gray-600">Bounce Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-blue-900">Peak Performance Insight</p>
                      <p className="text-sm text-blue-700 mt-1">User activity peaks between 6 PM - 8 PM, suggesting optimal time for promotions and new product launches.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-green-900">Engagement Trend</p>
                      <p className="text-sm text-green-700 mt-1">Mobile users show 23% higher engagement rates. Consider prioritizing mobile experience improvements.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-yellow-900">Opportunity Alert</p>
                      <p className="text-sm text-yellow-700 mt-1">Search activities increased by 45% but conversion decreased by 8%. Review search result relevancy.</p>
                    </div>
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
