
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Shield, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Settings,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  Smartphone,
  Laptop,
  Target,
  Award,
  BookOpen,
  MessageSquare,
  Bell,
  Zap
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  loginCount: number;
  totalSessions: number;
  averageSessionDuration: number;
  location: string;
  deviceType: string;
  securityLevel: 'high' | 'medium' | 'low';
  twoFactorEnabled: boolean;
  lastActivity: string;
}

const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@getit.com',
    phone: '+880 1712-345678',
    role: 'Super Admin',
    department: 'IT Management',
    status: 'active',
    lastLogin: '2024-06-25 14:30:22',
    createdAt: '2024-01-15',
    permissions: ['user_management', 'system_config', 'financial_reports', 'vendor_management'],
    loginCount: 156,
    totalSessions: 189,
    averageSessionDuration: 45,
    location: 'Dhaka, Bangladesh',
    deviceType: 'Desktop',
    securityLevel: 'high',
    twoFactorEnabled: true,
    lastActivity: '5 minutes ago'
  },
  {
    id: '2',
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@getit.com',
    phone: '+880 1798-765432',
    role: 'Operations Admin',
    department: 'Operations',
    status: 'active',
    lastLogin: '2024-06-25 13:45:15',
    createdAt: '2024-02-10',
    permissions: ['order_management', 'inventory_control', 'vendor_relations'],
    loginCount: 89,
    totalSessions: 102,
    averageSessionDuration: 38,
    location: 'Chittagong, Bangladesh',
    deviceType: 'Mobile',
    securityLevel: 'medium',
    twoFactorEnabled: true,
    lastActivity: '15 minutes ago'
  },
  {
    id: '3',
    name: 'Maria Garcia',
    email: 'maria.garcia@getit.com',
    phone: '+880 1556-123456',
    role: 'Marketing Admin',
    department: 'Marketing',
    status: 'pending',
    lastLogin: 'Never',
    createdAt: '2024-06-20',
    permissions: ['campaign_management', 'content_creation'],
    loginCount: 0,
    totalSessions: 0,
    averageSessionDuration: 0,
    location: 'Sylhet, Bangladesh',
    deviceType: 'Tablet',
    securityLevel: 'medium',
    twoFactorEnabled: false,
    lastActivity: 'Never'
  }
];

const adminStatsData = [
  { category: 'Total Admins', value: 47, change: 12, trend: 'up' },
  { category: 'Active Sessions', value: 23, change: -3, trend: 'down' },
  { category: 'Pending Approvals', value: 8, change: 5, trend: 'up' },
  { category: 'Security Alerts', value: 2, change: -1, trend: 'down' }
];

const adminActivityData = [
  { month: 'Jan', logins: 1250, newAdmins: 5, suspensions: 2 },
  { month: 'Feb', logins: 1380, newAdmins: 8, suspensions: 1 },
  { month: 'Mar', logins: 1420, newAdmins: 6, suspensions: 3 },
  { month: 'Apr', logins: 1580, newAdmins: 12, suspensions: 1 },
  { month: 'May', logins: 1650, newAdmins: 9, suspensions: 2 },
  { month: 'Jun', logins: 1720, newAdmins: 7, suspensions: 0 }
];

const roleDistributionData = [
  { name: 'Super Admin', value: 8, color: '#8884d8' },
  { name: 'Operations Admin', value: 15, color: '#82ca9d' },
  { name: 'Marketing Admin', value: 12, color: '#ffc658' },
  { name: 'Finance Admin', value: 7, color: '#ff7c7c' },
  { name: 'Support Admin', value: 5, color: '#8dd1e1' }
];

const departmentPerformanceData = [
  { department: 'IT', admins: 8, avgLogins: 45, efficiency: 92 },
  { department: 'Operations', admins: 15, avgLogins: 38, efficiency: 88 },
  { department: 'Marketing', admins: 12, avgLogins: 32, efficiency: 85 },
  { department: 'Finance', admins: 7, avgLogins: 28, efficiency: 90 },
  { department: 'Support', admins: 5, avgLogins: 41, efficiency: 87 }
];

export const AdminListManagement: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const filteredAdmins = mockAdminUsers.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || admin.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || admin.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 Admin List Management</h1>
          <p className="text-gray-600 text-lg">Comprehensive admin user management system</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add New Admin
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatsData.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.category}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{Math.abs(stat.change)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admins">Admin Directory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Admin Activity Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Admin Activity Trends
                </CardTitle>
                <CardDescription>Monthly login activity and admin management</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    logins: { label: "Total Logins", color: "#8884d8" },
                    newAdmins: { label: "New Admins", color: "#82ca9d" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={adminActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="logins" fill="#8884d8" name="Total Logins" />
                      <Bar dataKey="newAdmins" fill="#82ca9d" name="New Admins" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Role Distribution
                </CardTitle>
                <CardDescription>Admin roles across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    superAdmin: { label: "Super Admin", color: "#8884d8" },
                    operationsAdmin: { label: "Operations Admin", color: "#82ca9d" },
                    marketingAdmin: { label: "Marketing Admin", color: "#ffc658" },
                    financeAdmin: { label: "Finance Admin", color: "#ff7c7c" },
                    supportAdmin: { label: "Support Admin", color: "#8dd1e1" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {roleDistributionData.map((entry, index) => (
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

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Overview</CardTitle>
              <CardDescription>Admin performance metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPerformanceData.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{dept.department}</h3>
                        <p className="text-sm text-gray-500">{dept.admins} admins</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Avg Logins/Month</p>
                        <p className="font-semibold">{dept.avgLogins}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Efficiency</p>
                        <p className="font-semibold text-green-600">{dept.efficiency}%</p>
                      </div>
                      <div className="w-24">
                        <Progress value={dept.efficiency} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search admins by name, email, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Operations Admin">Operations Admin</SelectItem>
                    <SelectItem value="Marketing Admin">Marketing Admin</SelectItem>
                    <SelectItem value="Finance Admin">Finance Admin</SelectItem>
                    <SelectItem value="Support Admin">Support Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Admin Directory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Directory</CardTitle>
              <CardDescription>Manage all administrative users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin Details</TableHead>
                    <TableHead>Role & Department</TableHead>
                    <TableHead>Status & Security</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                            <p className="text-xs text-gray-400">{admin.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline" className="mb-1">{admin.role}</Badge>
                          <p className="text-sm text-gray-600">{admin.department}</p>
                          <p className="text-xs text-gray-400">{admin.location}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusColor(admin.status)}>
                            {admin.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Shield className={`w-3 h-3 ${getSecurityLevelColor(admin.securityLevel)}`} />
                            <span className={`text-xs ${getSecurityLevelColor(admin.securityLevel)}`}>
                              {admin.securityLevel} security
                            </span>
                          </div>
                          {admin.twoFactorEnabled && (
                            <div className="flex items-center gap-1">
                              <Lock className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600">2FA</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Last: {admin.lastActivity}</p>
                          <p className="text-gray-500">Sessions: {admin.totalSessions}</p>
                          <p className="text-gray-500">Avg: {admin.averageSessionDuration}min</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{admin.loginCount} logins</p>
                          <p className="text-gray-500">{admin.deviceType}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">Online</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedAdmin(admin)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Frequency Analysis</CardTitle>
                <CardDescription>Admin login patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    logins: { label: "Daily Logins", color: "#8884d8" }
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={adminActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="logins" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
                <CardDescription>Security compliance across admin accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Strong Password Policy</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-20" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session Security</span>
                    <div className="flex items-center gap-2">
                      <Progress value={88} className="w-20" />
                      <span className="text-sm font-medium">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Access Control Compliance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={95} className="w-20" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Performance Metrics</CardTitle>
              <CardDescription>Comprehensive performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">456</p>
                  <p className="text-sm text-blue-600">Total Admin Actions</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">98.5%</p>
                  <p className="text-sm text-green-600">Success Rate</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">2.3min</p>
                  <p className="text-sm text-purple-600">Avg Response Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {/* Permission Management */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
              <CardDescription>Manage admin roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={() => setShowPermissionModal(true)}>
                  Configure Role Permissions
                </Button>
                <p className="text-sm text-gray-600">
                  Set up granular permissions for different admin roles to ensure proper access control.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>Advanced security settings for admin accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Password Policy</Label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basic (8+ chars)</SelectItem>
                        <SelectItem value="medium">Medium (12+ chars, mixed)</SelectItem>
                        <SelectItem value="high">High (16+ chars, complex)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Session Timeout (minutes)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Force 2FA for all admin accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Address Restrictions</Label>
                      <p className="text-sm text-gray-500">Limit access to specific IP ranges</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Device Fingerprinting</Label>
                      <p className="text-sm text-gray-500">Track and verify admin devices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Admin System Settings</CardTitle>
              <CardDescription>Configure system-wide admin management settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Auto-Archive Inactive Admins (days)</Label>
                  <Input type="number" defaultValue="90" className="mt-1" />
                </div>
                <div>
                  <Label>Admin Approval Workflow</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic Approval</SelectItem>
                      <SelectItem value="manual">Manual Approval</SelectItem>
                      <SelectItem value="department">Department Head Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Settings</h3>
                  {[
                    'New admin registration',
                    'Admin login from new device',
                    'Failed login attempts',
                    'Permission changes',
                    'Security alerts'
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{setting}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add New Admin Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
              <CardDescription>Create a new administrative user account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="Enter full name" />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="admin@getit.com" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input placeholder="+880 1XXX-XXXXXX" />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT Management</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Admin Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super">Super Admin</SelectItem>
                      <SelectItem value="operations">Operations Admin</SelectItem>
                      <SelectItem value="marketing">Marketing Admin</SelectItem>
                      <SelectItem value="finance">Finance Admin</SelectItem>
                      <SelectItem value="support">Support Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Security Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select security level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Security</SelectItem>
                      <SelectItem value="medium">Medium Security</SelectItem>
                      <SelectItem value="low">Low Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'User Management',
                    'System Configuration',
                    'Financial Reports',
                    'Vendor Management',
                    'Order Management',
                    'Inventory Control',
                    'Campaign Management',
                    'Content Creation'
                  ].map((permission, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button className="flex-1">Create Admin Account</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
