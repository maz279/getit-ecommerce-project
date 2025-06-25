
import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Users, 
  Settings, 
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
  Database,
  FileText,
  Globe,
  UserCheck,
  Zap,
  Activity,
  BarChart3
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

export const PermissionsManagementForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPermission, setSelectedPermission] = useState<any>(null);

  // Permission categories and detailed permissions
  const permissionCategories = [
    {
      id: 'user_management',
      name: 'User Management',
      icon: <Users className="w-5 h-5" />,
      description: 'Manage user accounts, profiles, and access',
      permissions: [
        { id: 'user_create', name: 'Create Users', description: 'Add new user accounts', riskLevel: 'medium', assignedRoles: 5 },
        { id: 'user_edit', name: 'Edit Users', description: 'Modify user information and profiles', riskLevel: 'medium', assignedRoles: 8 },
        { id: 'user_delete', name: 'Delete Users', description: 'Remove user accounts permanently', riskLevel: 'high', assignedRoles: 2 },
        { id: 'user_view', name: 'View Users', description: 'Access user information and profiles', riskLevel: 'low', assignedRoles: 15 },
        { id: 'user_suspend', name: 'Suspend Users', description: 'Temporarily disable user accounts', riskLevel: 'high', assignedRoles: 3 },
        { id: 'user_activate', name: 'Activate Users', description: 'Enable suspended user accounts', riskLevel: 'medium', assignedRoles: 5 }
      ]
    },
    {
      id: 'product_management',
      name: 'Product Management',
      icon: <Database className="w-5 h-5" />,
      description: 'Control product catalog and inventory',
      permissions: [
        { id: 'product_create', name: 'Create Products', description: 'Add new products to catalog', riskLevel: 'low', assignedRoles: 12 },
        { id: 'product_edit', name: 'Edit Products', description: 'Modify product details and specifications', riskLevel: 'low', assignedRoles: 15 },
        { id: 'product_delete', name: 'Delete Products', description: 'Remove products from catalog', riskLevel: 'medium', assignedRoles: 6 },
        { id: 'inventory_manage', name: 'Manage Inventory', description: 'Control stock levels and availability', riskLevel: 'medium', assignedRoles: 8 },
        { id: 'pricing_manage', name: 'Manage Pricing', description: 'Set and modify product prices', riskLevel: 'high', assignedRoles: 4 },
        { id: 'category_manage', name: 'Manage Categories', description: 'Create and organize product categories', riskLevel: 'medium', assignedRoles: 7 }
      ]
    },
    {
      id: 'order_management',
      name: 'Order Management',
      icon: <FileText className="w-5 h-5" />,
      description: 'Handle order processing and fulfillment',
      permissions: [
        { id: 'order_view', name: 'View Orders', description: 'Access order information and details', riskLevel: 'low', assignedRoles: 20 },
        { id: 'order_process', name: 'Process Orders', description: 'Handle order fulfillment and shipping', riskLevel: 'medium', assignedRoles: 12 },
        { id: 'order_cancel', name: 'Cancel Orders', description: 'Cancel customer orders', riskLevel: 'medium', assignedRoles: 8 },
        { id: 'order_refund', name: 'Process Refunds', description: 'Handle refund requests and processing', riskLevel: 'high', assignedRoles: 5 },
        { id: 'order_modify', name: 'Modify Orders', description: 'Change order details and specifications', riskLevel: 'medium', assignedRoles: 6 }
      ]
    },
    {
      id: 'financial_management',
      name: 'Financial Management',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Access financial data and controls',
      permissions: [
        { id: 'financial_view', name: 'View Financial Reports', description: 'Access financial dashboards and reports', riskLevel: 'high', assignedRoles: 3 },
        { id: 'payment_manage', name: 'Manage Payments', description: 'Handle payment processing and gateways', riskLevel: 'high', assignedRoles: 4 },
        { id: 'commission_manage', name: 'Manage Commissions', description: 'Control vendor commission rates', riskLevel: 'high', assignedRoles: 2 },
        { id: 'tax_manage', name: 'Manage Tax Settings', description: 'Configure tax rates and policies', riskLevel: 'high', assignedRoles: 2 },
        { id: 'revenue_view', name: 'View Revenue Data', description: 'Access revenue analytics and metrics', riskLevel: 'medium', assignedRoles: 6 }
      ]
    },
    {
      id: 'system_administration',
      name: 'System Administration',
      icon: <Settings className="w-5 h-5" />,
      description: 'System configuration and maintenance',
      permissions: [
        { id: 'system_config', name: 'System Configuration', description: 'Configure system settings and parameters', riskLevel: 'high', assignedRoles: 2 },
        { id: 'backup_manage', name: 'Manage Backups', description: 'Control data backup and recovery', riskLevel: 'high', assignedRoles: 1 },
        { id: 'security_manage', name: 'Security Management', description: 'Configure security policies and access', riskLevel: 'high', assignedRoles: 2 },
        { id: 'logs_view', name: 'View System Logs', description: 'Access system activity and error logs', riskLevel: 'medium', assignedRoles: 5 },
        { id: 'maintenance_mode', name: 'Maintenance Mode', description: 'Enable/disable system maintenance mode', riskLevel: 'high', assignedRoles: 1 }
      ]
    }
  ];

  // Permission analytics data
  const permissionUsageData = [
    { permission: 'View Users', usage: 95, risk: 'low' },
    { permission: 'Edit Products', usage: 87, risk: 'low' },
    { permission: 'Process Orders', usage: 76, risk: 'medium' },
    { permission: 'View Orders', usage: 92, risk: 'low' },
    { permission: 'Manage Pricing', usage: 45, risk: 'high' },
    { permission: 'Financial Reports', usage: 23, risk: 'high' }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 42, color: '#10b981' },
    { name: 'Medium Risk', value: 28, color: '#f59e0b' },
    { name: 'High Risk', value: 18, color: '#ef4444' }
  ];

  const permissionTrends = [
    { month: 'Jan', granted: 45, revoked: 12, modified: 8 },
    { month: 'Feb', granted: 52, revoked: 15, modified: 12 },
    { month: 'Mar', granted: 48, revoked: 8, modified: 15 },
    { month: 'Apr', granted: 61, revoked: 18, modified: 10 },
    { month: 'May', granted: 55, revoked: 12, modified: 18 },
    { month: 'Jun', granted: 63, revoked: 9, modified: 14 }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const filteredCategories = permissionCategories.filter(category => {
    if (selectedCategory === 'all') return true;
    return category.id === selectedCategory;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Key className="w-8 h-8 text-blue-600" />
            Permissions Management
          </h1>
          <p className="text-gray-600 mt-1">Fine-grained permission control and access management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Audit Trail
          </Button>
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Permission
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                <p className="text-3xl font-bold text-gray-900">88</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Key className="w-4 h-4 mr-1" />
                  5 Categories
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-3xl font-bold text-gray-900">234</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <UserCheck className="w-4 h-4 mr-1" />
                  92% Coverage
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
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-gray-900">18</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Needs Review
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-3xl font-bold text-gray-900">96%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Zap className="w-4 h-4 mr-1" />
                  Excellent
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="permissions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
          <TabsTrigger value="assignments">Role Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit & Compliance</TabsTrigger>
          <TabsTrigger value="settings">Access Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search permissions by name, description, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {permissionCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Permission Categories */}
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {category.icon}
                    {category.name}
                    <Badge variant="outline">{category.permissions.length} permissions</Badge>
                  </CardTitle>
                  <p className="text-gray-600">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Assigned Roles</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getRiskIcon(permission.riskLevel)}
                              <span className="font-medium">{permission.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="text-sm text-gray-600">{permission.description}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskColor(permission.riskLevel)}>
                              {permission.riskLevel} risk
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>{permission.assignedRoles} roles</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission-Role Assignment Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Assignment Matrix</h3>
                <p className="text-gray-600 mb-4">Interactive matrix showing which roles have which permissions</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Configure Assignments
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Permission Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    usage: { label: "Usage %", color: "#8884d8" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={permissionUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="permission" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="usage" fill="#8884d8" />
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
                    value: { label: "Permissions", color: "#8884d8" }
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
              <CardTitle>Permission Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  granted: { label: "Granted", color: "#10b981" },
                  revoked: { label: "Revoked", color: "#ef4444" },
                  modified: { label: "Modified", color: "#3b82f6" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={permissionTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="granted" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="revoked" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="modified" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Audit & Compliance Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Compliance Score</h4>
                  <p className="text-2xl font-bold text-green-900">96%</p>
                  <p className="text-sm text-green-600">Meeting all requirements</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Last Audit</h4>
                  <p className="text-2xl font-bold text-blue-900">3 days</p>
                  <p className="text-sm text-blue-600">ago</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Pending Reviews</h4>
                  <p className="text-2xl font-bold text-yellow-900">5</p>
                  <p className="text-sm text-yellow-600">high-risk permissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Access Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Permission Inheritance</h4>
                    <p className="text-sm text-gray-600">Allow permissions to be inherited from parent roles</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Strict Permission Validation</h4>
                    <p className="text-sm text-gray-600">Enforce strict validation for all permission changes</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Real-time Permission Sync</h4>
                    <p className="text-sm text-gray-600">Synchronize permission changes across all sessions</p>
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
