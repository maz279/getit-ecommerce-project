
import React, { useState } from 'react';
import { 
  Activity, 
  User, 
  Shield, 
  Clock, 
  Search, 
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Settings,
  Database,
  FileText,
  Calendar,
  MapPin,
  Monitor
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const ActivityLogsForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7days');
  const [selectedLogType, setSelectedLogType] = useState('all');

  // Mock activity logs data
  const activityLogs = [
    {
      id: 1,
      timestamp: '2024-06-25 14:30:22',
      user: 'john.doe@getit.com',
      action: 'User Login',
      category: 'Authentication',
      status: 'Success',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 125.0.0.0',
      location: 'Dhaka, Bangladesh',
      details: 'Successful login via email/password',
      riskLevel: 'low'
    },
    {
      id: 2,
      timestamp: '2024-06-25 14:25:15',
      user: 'admin@getit.com',
      action: 'Product Updated',
      category: 'Product Management',
      status: 'Success',
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox 126.0',
      location: 'Chittagong, Bangladesh',
      details: 'Updated product "Samsung Galaxy S24" - Changed price from ৳85,000 to ৳82,000',
      riskLevel: 'medium'
    },
    {
      id: 3,
      timestamp: '2024-06-25 14:20:08',
      user: 'vendor@getit.com',
      action: 'Failed Login Attempt',
      category: 'Authentication',
      status: 'Failed',
      ipAddress: '45.123.456.789',
      userAgent: 'Chrome 124.0.0.0',
      location: 'Unknown',
      details: 'Failed login attempt - Invalid password (5th attempt)',
      riskLevel: 'high'
    },
    {
      id: 4,
      timestamp: '2024-06-25 14:15:33',
      user: 'customer@getit.com',
      action: 'Order Placed',
      category: 'Order Management',
      status: 'Success',
      ipAddress: '192.168.1.102',
      userAgent: 'Safari 17.0',
      location: 'Sylhet, Bangladesh',
      details: 'Order #ORD-2024-001234 placed - Total: ৳12,500',
      riskLevel: 'low'
    },
    {
      id: 5,
      timestamp: '2024-06-25 14:10:45',
      user: 'admin@getit.com',
      action: 'User Role Changed',
      category: 'User Management',
      status: 'Success',
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome 125.0.0.0',
      location: 'Dhaka, Bangladesh',
      details: 'Changed user jane.doe@getit.com role from "Customer" to "Vendor"',
      riskLevel: 'high'
    }
  ];

  // Activity analytics data
  const activityAnalytics = [
    { hour: '00:00', logins: 12, failures: 2, actions: 45 },
    { hour: '04:00', logins: 8, failures: 1, actions: 23 },
    { hour: '08:00', logins: 156, failures: 8, actions: 234 },
    { hour: '12:00', logins: 234, failures: 15, actions: 456 },
    { hour: '16:00', logins: 189, failures: 12, actions: 378 },
    { hour: '20:00', logins: 98, failures: 5, actions: 189 }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 65, color: '#10b981' },
    { name: 'Medium Risk', value: 25, color: '#f59e0b' },
    { name: 'High Risk', value: 10, color: '#ef4444' }
  ];

  const topActions = [
    { action: 'User Login', count: 1234, percentage: 35 },
    { action: 'Product View', count: 987, percentage: 28 },
    { action: 'Order Placed', count: 456, percentage: 13 },
    { action: 'Product Updated', count: 234, percentage: 7 },
    { action: 'User Registration', count: 189, percentage: 5 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Login')) return <LogIn className="w-4 h-4" />;
    if (action.includes('Logout')) return <LogOut className="w-4 h-4" />;
    if (action.includes('Updated') || action.includes('Edit')) return <Edit className="w-4 h-4" />;
    if (action.includes('Delete')) return <Trash2 className="w-4 h-4" />;
    if (action.includes('View')) return <Eye className="w-4 h-4" />;
    if (action.includes('Order')) return <FileText className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            Activity Logs
          </h1>
          <p className="text-gray-600 mt-1">Monitor and analyze user activities across the platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900">24,567</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  +12% from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <User className="w-4 h-4 mr-1" />
                  156 online now
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Events</p>
                <p className="text-3xl font-bold text-gray-900">89</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  23 high risk
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-3xl font-bold text-gray-900">98.5%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Monitor className="w-4 h-4 mr-1" />
                  Excellent
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="settings">Log Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          {/* Search and Filter Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by user, action, or IP address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedLogType} onValueChange={setSelectedLogType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="user-management">User Management</SelectItem>
                    <SelectItem value="product-management">Product Management</SelectItem>
                    <SelectItem value="order-management">Order Management</SelectItem>
                    <SelectItem value="system">System Events</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">Last Hour</SelectItem>
                    <SelectItem value="24hours">Last 24 Hours</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{log.timestamp}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <span className="text-sm">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(log.status)}
                          <span className="text-sm">{log.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{log.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(log.riskLevel)}>
                          {log.riskLevel} risk
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-xs text-gray-600 truncate" title={log.details}>
                            {log.details}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Trends (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    logins: { label: "Logins", color: "#3b82f6" },
                    failures: { label: "Failures", color: "#ef4444" },
                    actions: { label: "Actions", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="failures" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="actions" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Activities", color: "#8884d8" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
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
              <CardTitle>Top Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topActions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getActionIcon(item.action)}
                      <span className="font-medium">{item.action}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Monitor suspicious activities and security threats.</p>
                <Button>Configure Security Alerts</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Complete audit trail for compliance and investigation purposes.</p>
                <Button>Generate Audit Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="retention-period">Log Retention Period</Label>
                  <Select defaultValue="90days">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="180days">180 Days</SelectItem>
                      <SelectItem value="365days">1 Year</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="log-level">Logging Level</Label>
                  <Select defaultValue="detailed">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="verbose">Verbose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
