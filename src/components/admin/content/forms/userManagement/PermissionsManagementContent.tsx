
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Lock, Users, Settings, Eye, Edit, Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const PermissionsManagementContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      permissions: []
    }
  });

  const permissionGroups = [
    {
      id: 1,
      name: 'User Management',
      description: 'Manage users, roles, and permissions',
      permissions: [
        { id: 'user_create', name: 'Create Users', enabled: true },
        { id: 'user_read', name: 'View Users', enabled: true },
        { id: 'user_update', name: 'Update Users', enabled: true },
        { id: 'user_delete', name: 'Delete Users', enabled: false },
        { id: 'user_permissions', name: 'Manage User Permissions', enabled: false }
      ],
      assignedRoles: ['Super Admin', 'Admin'],
      usersWithAccess: 15
    },
    {
      id: 2,
      name: 'Order Management',
      description: 'Handle orders, refunds, and transactions',
      permissions: [
        { id: 'order_create', name: 'Create Orders', enabled: true },
        { id: 'order_read', name: 'View Orders', enabled: true },
        { id: 'order_update', name: 'Update Orders', enabled: true },
        { id: 'order_cancel', name: 'Cancel Orders', enabled: true },
        { id: 'order_refund', name: 'Process Refunds', enabled: false }
      ],
      assignedRoles: ['Super Admin', 'Admin', 'Support'],
      usersWithAccess: 32
    },
    {
      id: 3,
      name: 'Product Management',
      description: 'Manage products, categories, and inventory',
      permissions: [
        { id: 'product_create', name: 'Create Products', enabled: true },
        { id: 'product_read', name: 'View Products', enabled: true },
        { id: 'product_update', name: 'Update Products', enabled: true },
        { id: 'product_delete', name: 'Delete Products', enabled: false },
        { id: 'inventory_manage', name: 'Manage Inventory', enabled: true }
      ],
      assignedRoles: ['Super Admin', 'Product Manager'],
      usersWithAccess: 8
    }
  ];

  const rolePermissions = [
    {
      role: 'Super Admin',
      permissions: 45,
      users: 3,
      description: 'Full system access',
      lastModified: '2024-01-10'
    },
    {
      role: 'Admin',
      permissions: 32,
      users: 12,
      description: 'Administrative access',
      lastModified: '2024-01-08'
    },
    {
      role: 'Support',
      permissions: 18,
      users: 25,
      description: 'Customer support access',
      lastModified: '2024-01-05'
    },
    {
      role: 'Moderator',
      permissions: 12,
      users: 15,
      description: 'Content moderation access',
      lastModified: '2024-01-03'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permissions Management</h1>
          <p className="text-gray-600 mt-1">Control user access and system permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Permission Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Permission Group</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(() => setIsCreateDialogOpen(false))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter group name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe this permission group" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Group</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Across all modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permission Groups</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Organized by function</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">With assigned permissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users with Custom Permissions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Individual overrides</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="groups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="groups">Permission Groups</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Permission Groups</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissionGroups.map((group) => (
                  <Card key={group.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{group.name}</h3>
                          <p className="text-gray-600 text-sm">{group.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">Permissions ({group.permissions.length})</h4>
                          <div className="space-y-2">
                            {group.permissions.map((permission) => (
                              <div key={permission.id} className="flex items-center justify-between">
                                <span className="text-sm">{permission.name}</span>
                                <Switch checked={permission.enabled} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Assigned Roles</h4>
                          <div className="space-y-2">
                            {group.assignedRoles.map((role) => (
                              <Badge key={role} variant="outline">{role}</Badge>
                            ))}
                          </div>
                          <div className="mt-4 text-sm text-gray-600">
                            <Users className="h-4 w-4 inline mr-1" />
                            {group.usersWithAccess} users have access
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rolePermissions.map((role) => (
                  <div key={role.role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        role.role === 'Super Admin' ? 'bg-red-100' :
                        role.role === 'Admin' ? 'bg-blue-100' :
                        role.role === 'Support' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Shield className={`h-4 w-4 ${
                          role.role === 'Super Admin' ? 'text-red-600' :
                          role.role === 'Admin' ? 'text-blue-600' :
                          role.role === 'Support' ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{role.role}</div>
                        <div className="text-sm text-gray-600">{role.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{role.permissions}</div>
                        <div className="text-xs text-gray-500">Permissions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{role.users}</div>
                        <div className="text-xs text-gray-500">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Last Modified</div>
                        <div className="text-sm font-medium">{role.lastModified}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Module</th>
                      <th className="text-center p-2">Super Admin</th>
                      <th className="text-center p-2">Admin</th>
                      <th className="text-center p-2">Support</th>
                      <th className="text-center p-2">Moderator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { module: 'User Management', superAdmin: true, admin: true, support: false, moderator: false },
                      { module: 'Order Management', superAdmin: true, admin: true, support: true, moderator: false },
                      { module: 'Product Management', superAdmin: true, admin: true, support: false, moderator: false },
                      { module: 'Content Management', superAdmin: true, admin: true, support: true, moderator: true },
                      { module: 'Analytics', superAdmin: true, admin: true, support: true, moderator: false },
                      { module: 'System Settings', superAdmin: true, admin: false, support: false, moderator: false }
                    ].map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{row.module}</td>
                        <td className="text-center p-2">
                          {row.superAdmin ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}
                        </td>
                        <td className="text-center p-2">
                          {row.admin ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}
                        </td>
                        <td className="text-center p-2">
                          {row.support ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}
                        </td>
                        <td className="text-center p-2">
                          {row.moderator ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '2024-01-15 14:30', user: 'John Smith', action: 'Added permission', target: 'order_refund', role: 'Support' },
                  { time: '2024-01-15 12:15', user: 'Sarah Johnson', action: 'Removed permission', target: 'user_delete', role: 'Admin' },
                  { time: '2024-01-14 16:45', user: 'Mike Wilson', action: 'Created role', target: 'Content Manager', role: null },
                  { time: '2024-01-14 10:20', user: 'John Smith', action: 'Modified permissions', target: 'product_management', role: 'Moderator' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.action.includes('Added') || log.action.includes('Created') ? 'bg-green-500' :
                        log.action.includes('Removed') ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <div className="font-medium">{log.user}</div>
                        <div className="text-sm text-gray-600">
                          {log.action} <span className="font-mono">{log.target}</span>
                          {log.role && <> for {log.role}</>}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{log.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
