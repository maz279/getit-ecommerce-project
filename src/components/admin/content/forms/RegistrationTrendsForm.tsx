
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Filter,
  Download,
  UserPlus,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Target,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  MapPin,
  UserCheck,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export const RegistrationTrendsForm: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Mock registration data
  const registrationTrends = [
    { date: '2024-06-01', registrations: 245, verified: 210, mobile: 180, desktop: 65 },
    { date: '2024-06-02', registrations: 312, verified: 280, mobile: 220, desktop: 92 },
    { date: '2024-06-03', registrations: 189, verified: 165, mobile: 140, desktop: 49 },
    { date: '2024-06-04', registrations: 434, verified: 398, mobile: 310, desktop: 124 },
    { date: '2024-06-05', registrations: 567, verified: 520, mobile: 420, desktop: 147 },
    { date: '2024-06-06', registrations: 398, verified: 356, mobile: 290, desktop: 108 },
    { date: '2024-06-07', registrations: 445, verified: 401, mobile: 335, desktop: 110 }
  ];

  const channelDistribution = [
    { name: 'Organic Search', value: 35, color: '#3b82f6' },
    { name: 'Social Media', value: 28, color: '#10b981' },
    { name: 'Direct Traffic', value: 18, color: '#f59e0b' },
    { name: 'Email Marketing', value: 12, color: '#ef4444' },
    { name: 'Paid Ads', value: 7, color: '#8b5cf6' }
  ];

  const deviceAnalytics = [
    { device: 'Mobile', users: 1234, percentage: 72, growth: '+15%' },
    { device: 'Desktop', users: 456, percentage: 26, growth: '+8%' },
    { device: 'Tablet', users: 34, percentage: 2, growth: '-2%' }
  ];

  const topCountries = [
    { country: 'Bangladesh', flag: '🇧🇩', registrations: 2345, percentage: 68, growth: '+12%' },
    { country: 'India', flag: '🇮🇳', registrations: 567, percentage: 16, growth: '+18%' },
    { country: 'Pakistan', flag: '🇵🇰', registrations: 234, percentage: 7, growth: '+25%' },
    { country: 'Sri Lanka', flag: '🇱🇰', registrations: 156, percentage: 5, growth: '+8%' },
    { country: 'Others', flag: '🌍', registrations: 134, percentage: 4, growth: '+5%' }
  ];

  const conversionFunnel = [
    { stage: 'Visited Signup Page', users: 15420, conversion: 100, color: '#3b82f6' },
    { stage: 'Started Registration', users: 8934, conversion: 58, color: '#10b981' },
    { stage: 'Completed Form', users: 5678, conversion: 37, color: '#f59e0b' },
    { stage: 'Email Verified', users: 4892, conversion: 32, color: '#ef4444' },
    { stage: 'Profile Completed', users: 3456, conversion: 22, color: '#8b5cf6' }
  ];

  const registrationSources = [
    { source: 'Homepage CTA', registrations: 1234, conversion: '3.2%', revenue: '৳45,000' },
    { source: 'Product Pages', registrations: 987, conversion: '2.8%', revenue: '৳38,500' },
    { source: 'Flash Sale Banner', registrations: 765, conversion: '4.1%', revenue: '৳52,300' },
    { source: 'Email Campaign', registrations: 543, conversion: '8.7%', revenue: '৳67,800' },
    { source: 'Social Media Ads', registrations: 432, conversion: '2.1%', revenue: '৳29,400' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Registration Trends
          </h1>
          <p className="text-gray-600 mt-1">Analyze user registration patterns and conversion metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-900">12,456</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +18% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-3xl font-bold text-gray-900">10,234</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <UserCheck className="w-4 h-4 mr-1" />
                  82.2% verification rate
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">3.4%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Target className="w-4 h-4 mr-1" />
                  +0.8% improvement
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mobile Registration</p>
                <p className="text-3xl font-bold text-gray-900">8,969</p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <Smartphone className="w-4 h-4 mr-1" />
                  72% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Traffic Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="organic">Organic Search</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="direct">Direct Traffic</SelectItem>
                  <SelectItem value="email">Email Marketing</SelectItem>
                  <SelectItem value="paid">Paid Advertising</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="pakistan">Pakistan</SelectItem>
                  <SelectItem value="srilanka">Sri Lanka</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="trends">Registration Trends</TabsTrigger>
          <TabsTrigger value="channels">Traffic Channels</TabsTrigger>
          <TabsTrigger value="devices">Device Analytics</TabsTrigger>
          <TabsTrigger value="geography">Geographic Data</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="sources">Registration Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Registration Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    registrations: { label: "Total Registrations", color: "#3b82f6" },
                    verified: { label: "Verified Users", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="registrations" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="verified" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    mobile: { label: "Mobile", color: "#8b5cf6" },
                    desktop: { label: "Desktop", color: "#f59e0b" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={registrationTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="mobile" stroke="#8b5cf6" strokeWidth={3} />
                      <Line type="monotone" dataKey="desktop" stroke="#f59e0b" strokeWidth={3} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registration Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deviceAnalytics.map((device, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{device.device}</h4>
                      <Badge variant={device.growth.includes('+') ? 'default' : 'destructive'}>
                        {device.growth}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{device.users.toLocaleString()}</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{device.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Percentage", color: "#8884d8" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={channelDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {channelDistribution.map((entry, index) => (
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
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelDistribution.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: channel.color }}
                        ></div>
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{channel.value}%</div>
                        <div className="text-sm text-gray-600">
                          {Math.round((channel.value / 100) * 12456)} users
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device Type</TableHead>
                    <TableHead>Total Users</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceAnalytics.map((device, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center space-x-2">
                        {device.device === 'Mobile' && <Smartphone className="w-4 h-4" />}
                        {device.device === 'Desktop' && <Monitor className="w-4 h-4" />}
                        {device.device === 'Tablet' && <Monitor className="w-4 h-4" />}
                        <span>{device.device}</span>
                      </TableCell>
                      <TableCell className="font-medium">{device.users.toLocaleString()}</TableCell>
                      <TableCell>{device.percentage}%</TableCell>
                      <TableCell>
                        <Badge variant={device.growth.includes('+') ? 'default' : 'destructive'}>
                          {device.growth}
                        </Badge>
                      </TableCell>
                      <TableCell>{(Math.random() * 5 + 2).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Countries by Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Registrations</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCountries.map((country, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center space-x-2">
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-medium">{country.country}</span>
                      </TableCell>
                      <TableCell className="font-medium">{country.registrations.toLocaleString()}</TableCell>
                      <TableCell>{country.percentage}%</TableCell>
                      <TableCell>
                        <Badge variant="default">{country.growth}</Badge>
                      </TableCell>
                      <TableCell>{(Math.random() * 3 + 2).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        ></div>
                        <span className="font-medium">{stage.stage}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{stage.users.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{stage.conversion}% of total</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full"
                          style={{ 
                            width: `${stage.conversion}%`,
                            backgroundColor: stage.color
                          }}
                        ></div>
                      </div>
                    </div>
                    {index < conversionFunnel.length - 1 && (
                      <div className="flex justify-center mt-2">
                        <ArrowDown className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Sources Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration Source</TableHead>
                    <TableHead>Total Registrations</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Generated Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationSources.map((source, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{source.source}</TableCell>
                      <TableCell>{source.registrations.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{source.conversion}</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">{source.revenue}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
