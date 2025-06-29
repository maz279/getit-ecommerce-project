
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, UserCheck, UserX, Activity, Download, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const UserAnalyticsContent: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const userGrowthData = [
    { month: 'Jan', newUsers: 1200, activeUsers: 8500, totalUsers: 45000 },
    { month: 'Feb', newUsers: 1800, activeUsers: 9200, totalUsers: 46800 },
    { month: 'Mar', newUsers: 2200, activeUsers: 10100, totalUsers: 49000 },
    { month: 'Apr', newUsers: 1900, activeUsers: 10800, totalUsers: 50900 },
    { month: 'May', newUsers: 2500, activeUsers: 11500, totalUsers: 53400 },
    { month: 'Jun', newUsers: 2800, activeUsers: 12200, totalUsers: 56200 }
  ];

  const userSegmentData = [
    { name: 'Premium Users', value: 35, count: 19670 },
    { name: 'Regular Users', value: 45, count: 25290 },
    { name: 'New Users', value: 15, count: 8435 },
    { name: 'Inactive Users', value: 5, count: 2805 }
  ];

  const engagementData = [
    { day: 'Mon', sessions: 12000, pageViews: 45000, avgDuration: 8.5 },
    { day: 'Tue', sessions: 13500, pageViews: 48000, avgDuration: 9.2 },
    { day: 'Wed', sessions: 14200, pageViews: 52000, avgDuration: 8.8 },
    { day: 'Thu', sessions: 13800, pageViews: 49500, avgDuration: 9.5 },
    { day: 'Fri', sessions: 15200, pageViews: 55000, avgDuration: 10.2 },
    { day: 'Sat', sessions: 11800, pageViews: 42000, avgDuration: 7.8 },
    { day: 'Sun', sessions: 10500, pageViews: 38000, avgDuration: 7.2 }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive user behavior and performance insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56,200</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">44,960</div>
            <p className="text-xs text-muted-foreground">80% of total users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users (30d)</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2,800</div>
            <p className="text-xs text-muted-foreground">+18% vs previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2.3%</div>
            <p className="text-xs text-muted-foreground">-0.5% improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">User Growth</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalUsers" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly New User Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newUsers" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userSegmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Segment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSegmentData.map((segment, index) => (
                    <div key={segment.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <div className="font-medium">{segment.name}</div>
                          <div className="text-sm text-gray-600">{segment.count.toLocaleString()} users</div>
                        </div>
                      </div>
                      <div className="text-lg font-semibold">{segment.value}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgDuration" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">93,200</div>
                  <div className="text-sm text-gray-600">Weekly Sessions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8.7 min</div>
                  <div className="text-sm text-gray-600">Avg Session Duration</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">3.2</div>
                  <div className="text-sm text-gray-600">Pages per Session</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Retention Cohort</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-8 gap-1 text-xs">
                    <div className="font-medium">Cohort</div>
                    <div className="font-medium">D0</div>
                    <div className="font-medium">D1</div>
                    <div className="font-medium">D7</div>
                    <div className="font-medium">D14</div>
                    <div className="font-medium">D30</div>
                    <div className="font-medium">D60</div>
                    <div className="font-medium">D90</div>
                  </div>
                  {[
                    { cohort: 'Jan 2024', values: [100, 85, 72, 58, 45, 32, 28] },
                    { cohort: 'Feb 2024', values: [100, 87, 75, 62, 48, 35, 30] },
                    { cohort: 'Mar 2024', values: [100, 89, 78, 65, 52, 38, 32] },
                    { cohort: 'Apr 2024', values: [100, 91, 81, 68, 55, 42, 35] },
                    { cohort: 'May 2024', values: [100, 88, 76, 63, 50, 37, 31] }
                  ].map((row) => (
                    <div key={row.cohort} className="grid grid-cols-8 gap-1 text-xs">
                      <div className="font-medium">{row.cohort}</div>
                      {row.values.map((value, index) => (
                        <div 
                          key={index} 
                          className={`text-center p-1 rounded ${
                            value >= 80 ? 'bg-green-100 text-green-800' :
                            value >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            value >= 40 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {value}%
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Churn Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">High Risk Users</div>
                      <div className="text-sm text-gray-600">Haven't logged in 14+ days</div>
                    </div>
                    <div className="text-xl font-bold text-red-600">1,245</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium">Medium Risk Users</div>
                      <div className="text-sm text-gray-600">Low engagement last 7 days</div>
                    </div>
                    <div className="text-xl font-bold text-yellow-600">3,678</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Active Users</div>
                      <div className="text-sm text-gray-600">Regular engagement</div>
                    </div>
                    <div className="text-xl font-bold text-green-600">51,277</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">Recommended Actions:</div>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      Send re-engagement emails to high-risk users
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      Offer incentives to medium-risk users
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      Survey churned users for feedback
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
