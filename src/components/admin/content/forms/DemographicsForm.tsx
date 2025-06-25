
import React, { useState } from 'react';
import { Users, MapPin, Calendar, Globe, TrendingUp, Download, Filter, RefreshCw, BarChart3, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Mock demographic data
const ageGroupData = [
  { ageGroup: '18-24', users: 15600, percentage: 22.3, growth: 15.2 },
  { ageGroup: '25-34', users: 28400, percentage: 40.6, growth: 8.7 },
  { ageGroup: '35-44', users: 16800, percentage: 24.0, growth: 12.4 },
  { ageGroup: '45-54', users: 7200, percentage: 10.3, growth: 5.1 },
  { ageGroup: '55+', users: 1800, percentage: 2.8, growth: 18.9 }
];

const genderData = [
  { gender: 'Female', users: 38200, percentage: 54.6, color: '#ec4899' },
  { gender: 'Male', users: 28600, percentage: 40.9, color: '#3b82f6' },
  { gender: 'Other', users: 2100, percentage: 3.0, color: '#10b981' },
  { gender: 'Prefer not to say', users: 1100, percentage: 1.5, color: '#f59e0b' }
];

const geographicData = [
  { region: 'Dhaka Division', users: 28500, percentage: 40.7, growth: 12.3 },
  { region: 'Chittagong Division', users: 15200, percentage: 21.7, growth: 8.9 },
  { region: 'Sylhet Division', users: 8900, percentage: 12.7, growth: 15.6 },
  { region: 'Rajshahi Division', users: 6800, percentage: 9.7, growth: 7.2 },
  { region: 'Khulna Division', users: 5400, percentage: 7.7, growth: 9.8 },
  { region: 'Barisal Division', users: 3200, percentage: 4.6, growth: 6.4 },
  { region: 'Rangpur Division', users: 2000, percentage: 2.9, growth: 11.1 }
];

const educationData = [
  { education: 'Bachelor\'s Degree', users: 24600, percentage: 35.1 },
  { education: 'Master\'s Degree', users: 18400, percentage: 26.3 },
  { education: 'High School', users: 12800, percentage: 18.3 },
  { education: 'Diploma', users: 8900, percentage: 12.7 },
  { education: 'PhD', users: 3200, percentage: 4.6 },
  { education: 'Other', users: 2100, percentage: 3.0 }
];

const incomeData = [
  { range: 'Below 25,000 BDT', users: 16800, percentage: 24.0 },
  { range: '25,000 - 50,000 BDT', users: 21600, percentage: 30.9 },
  { range: '50,000 - 100,000 BDT', users: 18200, percentage: 26.0 },
  { range: '100,000 - 200,000 BDT', users: 9800, percentage: 14.0 },
  { range: 'Above 200,000 BDT', users: 3600, percentage: 5.1 }
];

const deviceUsageData = [
  { device: 'Mobile', users: 52400, percentage: 74.9, sessions: 98600 },
  { device: 'Desktop', users: 14200, percentage: 20.3, sessions: 28400 },
  { device: 'Tablet', users: 3400, percentage: 4.8, sessions: 6800 }
];

const languageData = [
  { language: 'Bengali', users: 45600, percentage: 65.1 },
  { language: 'English', users: 21800, percentage: 31.2 },
  { language: 'Hindi', users: 1800, percentage: 2.6 },
  { language: 'Urdu', users: 800, percentage: 1.1 }
];

const behaviorTrends = [
  { month: 'Jan', newUsers: 3200, activeUsers: 28400, retention: 82.4 },
  { month: 'Feb', newUsers: 4100, activeUsers: 31200, retention: 84.1 },
  { month: 'Mar', newUsers: 3800, activeUsers: 33600, retention: 85.8 },
  { month: 'Apr', newUsers: 4600, activeUsers: 36200, retention: 87.2 },
  { month: 'May', newUsers: 5200, activeUsers: 39800, retention: 88.6 },
  { month: 'Jun', newUsers: 4900, activeUsers: 42400, retention: 89.3 }
];

export const DemographicsForm: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [selectedSegment, setSelectedSegment] = useState('all');
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
            <Users className="w-8 h-8 text-blue-600" />
            User Demographics
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive user demographic analysis and insights</p>
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
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">70,000</p>
                <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Regions</p>
                <p className="text-3xl font-bold text-gray-900">7</p>
                <p className="text-sm text-blue-600 mt-1">All divisions covered</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Age</p>
                <p className="text-3xl font-bold text-gray-900">31.4</p>
                <p className="text-sm text-green-600 mt-1">Optimal target group</p>
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
                <p className="text-sm font-medium text-gray-600">Diversity Score</p>
                <p className="text-3xl font-bold text-gray-900">8.7/10</p>
                <p className="text-sm text-green-600 mt-1">Excellent diversity</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                  <SelectItem value="lastyear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="segment">User Segment</Label>
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="dhaka">Dhaka Division</SelectItem>
                  <SelectItem value="chittagong">Chittagong Division</SelectItem>
                  <SelectItem value="sylhet">Sylhet Division</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="demographic">Demographic</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Demographics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Demographics</SelectItem>
                  <SelectItem value="age">Age Groups</SelectItem>
                  <SelectItem value="gender">Gender</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="age-gender">Age & Gender</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="socioeconomic">Socioeconomic</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: { label: "Users", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageGroupData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="users" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: { label: "Users", color: "#8884d8" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="users"
                        label={({ gender, percentage }) => `${gender} ${percentage}%`}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{region.region}</p>
                      <p className="text-sm text-gray-600">{region.users.toLocaleString()} users ({region.percentage}%)</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={region.growth > 10 ? "default" : "secondary"}>
                        +{region.growth}% growth
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="age-gender" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Group Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ageGroupData.map((group, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{group.ageGroup} years</p>
                        <p className="text-sm text-gray-600">{group.users.toLocaleString()} users</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{group.percentage}%</p>
                        <p className="text-sm text-green-600">+{group.growth}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {genderData.map((gender, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: gender.color }}></div>
                        <div>
                          <p className="font-medium">{gender.gender}</p>
                          <p className="text-sm text-gray-600">{gender.users.toLocaleString()} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{gender.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: { label: "Users", color: "#10b981" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geographicData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="region" type="category" width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="users" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="socioeconomic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Education Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {educationData.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{edu.education}</p>
                        <p className="text-sm text-gray-600">{edu.users.toLocaleString()} users</p>
                      </div>
                      <Badge variant="outline">{edu.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incomeData.map((income, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{income.range}</p>
                        <p className="text-sm text-gray-600">{income.users.toLocaleString()} users</p>
                      </div>
                      <Badge variant="outline">{income.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Usage Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceUsageData.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{device.device}</p>
                        <p className="text-sm text-gray-600">{device.users.toLocaleString()} users</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{device.percentage}%</p>
                        <p className="text-sm text-gray-600">{device.sessions.toLocaleString()} sessions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {languageData.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{lang.language}</p>
                        <p className="text-sm text-gray-600">{lang.users.toLocaleString()} users</p>
                      </div>
                      <Badge variant="outline">{lang.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Growth & Retention Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  newUsers: { label: "New Users", color: "#3b82f6" },
                  activeUsers: { label: "Active Users", color: "#10b981" },
                  retention: { label: "Retention Rate", color: "#f59e0b" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={behaviorTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="newUsers" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="retention" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Demographic Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-blue-900">Target Demographic Insight</p>
                      <p className="text-sm text-blue-700 mt-1">The 25-34 age group represents 40.6% of your user base and shows strong engagement. Consider targeted campaigns for this segment.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-green-900">Growth Opportunity</p>
                      <p className="text-sm text-green-700 mt-1">Sylhet Division shows 15.6% growth rate - highest among all regions. Consider expanding marketing efforts there.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-yellow-900">Gender Balance Alert</p>
                      <p className="text-sm text-yellow-700 mt-1">Female users represent 54.6% of your base. Consider gender-specific product recommendations and marketing.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-purple-900">Device Usage Pattern</p>
                      <p className="text-sm text-purple-700 mt-1">74.9% users prefer mobile. Ensure mobile-first design and optimize mobile checkout experience.</p>
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
