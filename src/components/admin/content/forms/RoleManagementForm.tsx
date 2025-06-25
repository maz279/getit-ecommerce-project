
import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Settings, 
  Lock, 
  CheckCircle, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Save,
  AlertTriangle,
  Crown,
  Key,
  UserCheck,
  Globe,
  Database,
  FileText,
  BarChart3,
  Zap
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const RoleManagementForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock roles data comparable to Amazon/Shopee admin systems
  const rolesData = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      userCount: 3,
      permissions: ['*'],
      level: 'system',
      lastModified: '2024-06-20',
      status: 'active',
      riskLevel: 'high'
    },
    {
      id: 2,
      name: 'Platform Admin',
      description: 'Platform-wide administration capabilities',
      userCount: 8,
      permissions: ['user_management', 'vendor_management', 'product_management', 'order_management'],
      level: 'platform',
      lastModified: '2024-06-19',
      status: 'active',
      riskLevel: 'high'
    },
    {
      id: 3,
      name: 'Category Manager',
      description: 'Manage product categories and inventory',
      userCount: 15,
      permissions: ['product_management', 'inventory_management', 'category_management'],
      level: 'departmental',
      lastModified: '2024-06-18',
      status: 'active',
      riskLevel: 'medium'
    },
    {
      id: 4,
      name: 'Customer Support',
      description: 'Handle customer inquiries and basic operations',
      userCount: 45,
      permissions: ['customer_support', 'order_view', 'ticket_management'],
      level: 'operational',
      lastModified: '2024-06-17',
      status: 'active',
      riskLevel: 'low'
    },
    {
      id: 5,
      name: 'Marketing Manager',
      description: 'Campaign and promotion management',
      userCount: 12,
      permissions: ['campaign_management', 'promotion_management', 'analytics_view'],
      level: 'departmental',
      lastModified: '2024-06-16',
      status: 'active',
      riskLevel: 'medium'
    }
  ];

  // Permission categories similar to Amazon/Shopee
  const permissionCategories = [
    {
      category: 'User Management',
      permissions: [
        { name: 'user_create', label: 'Create Users', description: 'Add new users to the system' },
        { name: 'user_edit', label: 'Edit Users', description: 'Modify user information' },
        { name: 'user_delete', label: 'Delete Users', description: 'Remove users from system' },
        { name: 'user_view', label: 'View Users', description: 'Access user information' },
        { name: 'role_assign', label: 'Assign Roles', description: 'Assign roles to users' }
      ]
    },
    {
      category: 'Product Management',
      permissions: [
        { name: 'product_create', label: 'Create Products', description: 'Add new products' },
        { name: 'product_edit', label: 'Edit Products', description: 'Modify product details' },
        { name: 'product_delete', label: 'Delete Products', description: 'Remove products' },
        { name: 'inventory_manage', label: 'Manage Inventory', description: 'Control stock levels' },
        { name: 'pricing_manage', label: 'Manage Pricing', description: 'Set product prices' }
      ]
    },
    {
      category: 'Order Management',
      permissions: [
        { name: 'order_view', label: 'View Orders', description: 'Access order information' },
        { name: 'order_process', label: 'Process Orders', description: 'Handle order fulfillment' },
        { name: 'order_cancel', label: 'Cancel Orders', description: 'Cancel customer orders' },
        { name: 'refund_process', label: 'Process Refunds', description: 'Handle refund requests' }
      ]
    },
    {
      category: 'Financial',
      permissions: [
        { name: 'financial_view', label: 'View Financials', description: 'Access financial reports' },
        { name: 'payment_manage', label: 'Manage Payments', description: 'Handle payment processing' },
        { name: 'commission_manage', label: 'Manage Commissions', description: 'Control vendor commissions' }
      ]
    }
  ];

  // Role analytics data
  const roleAnalytics = [
    { role: 'Super Admin', users: 3, activity: 95, risk: 100 },
    { role: 'Platform Admin', users: 8, activity: 88, risk: 85 },
    { role: 'Category Manager', users: 15, activity: 72, risk: 45 },
    { role: 'Customer Support', users: 45, activity: 85, risk: 20 },
    { role: 'Marketing Manager', users: 12, activity: 78, risk: 40 }
  ];

  const riskDistribution = [
    { name: 'High Risk', value: 11, color: '#ef4444' },
    { name: 'Medium Risk', value: 27, color: '#f59e0b' },
    { name: 'Low Risk', value: 45, color: '#10b981' }
  ];

  const permissionUsage = [
    { month: 'Jan', created: 12, modified: 8, deleted: 2 },
    { month: 'Feb', created: 15, modified: 12, deleted: 1 },
    { month: 'Mar', created: 18, modified: 15, deleted: 3 },
    { month: 'Apr', created: 22, modified: 18, deleted: 2 },
    { month: 'May', created: 25, modified: 20, deleted: 4 },
    { month: 'Jun', created: 28, modified: 22, deleted: 1 }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'system': return <Crown className="w-4 h-4" />;
      case 'platform': return <Shield className="w-4 h-4" />;
      case 'departmental': return <Users className="w-4 h-4" />;
      case 'operational': return <Settings className="w-4 h-4" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Role Management
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive role and permission management system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  5 Active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Users</p>
                <p className="text-3xl font-bold text-gray-900">83</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Users className="w-4 h-4 mr-1" />
                  11 Admins
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permissions</p>
                <p className="text-3xl font-bold text-gray-900">156</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  12 High Risk
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-3xl font-bold text-gray-900">87%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Zap className="w-4 h-4 mr-1" />
                  Excellent
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="roles">Role Directory</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="analytics">Role Analytics</TabsTrigger>
          <TabsTrigger value="security">Security Center</TabsTrigger>
          <TabsTrigger value="settings">Role Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search roles by name, description, or permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="platform">Platform</SelectItem>
                    <SelectItem value="departmental">Departmental</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle>Role Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesData.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {getLevelIcon(role.level)}
                          </div>
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <p className="text-sm text-gray-500">{role.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {role.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{role.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {role.permissions.includes('*') ? (
                            <Badge className="bg-red-100 text-red-800">All Permissions</Badge>
                          ) : (
                            <span>{role.permissions.length} permissions</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(role.riskLevel)}>
                          {role.riskLevel} risk
                        </Badge>
                      </TableCell>
                      <TableCell>{role.lastModified}</TableCell>
                      <TableCell>
                        <Badge variant={role.status === 'active' ? 'default' : 'secondary'}>
                          {role.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
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

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Permission Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {permissionCategories.map((category, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.permissions.map((permission, permIndex) => (
                      <div key={permIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{permission.label}</p>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Role Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: { label: "Users", color: "#8884d8" },
                    activity: { label: "Activity %", color: "#82ca9d" },
                    risk: { label: "Risk Level", color: "#ffc658" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="role" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="users" fill="#8884d8" />
                    </BarChart>
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
                    value: { label: "Users", color: "#8884d8" }
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
              <CardTitle>Permission Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  created: { label: "Created", color: "#10b981" },
                  modified: { label: "Modified", color: "#3b82f6" },
                  deleted: { label: "Deleted", color: "#ef4444" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={permissionUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="created" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="modified" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="deleted" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">High Risk Roles</h4>
                  <p className="text-2xl font-bold text-red-900">11</p>
                  <p className="text-sm text-red-600">Require immediate attention</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Privilege Escalation</h4>
                  <p className="text-2xl font-bold text-yellow-900">3</p>
                  <p className="text-sm text-yellow-600">Recent role modifications</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Compliance Score</h4>
                  <p className="text-2xl font-bold text-green-900">94%</p>
                  <p className="text-sm text-green-600">Meeting security standards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Configuration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Role Assignment</h4>
                    <p className="text-sm text-gray-600">Automatically assign roles based on user attributes</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Role Hierarchy Enforcement</h4>
                    <p className="text-sm text-gray-600">Enforce strict role hierarchy rules</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Permission Inheritance</h4>
                    <p className="text-sm text-gray-600">Allow child roles to inherit parent permissions</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
