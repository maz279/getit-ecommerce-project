
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Users, Package, FileText, Settings, Mail, Download, Upload, RefreshCw } from 'lucide-react';
import { useCreateQuickAction, useQuickActions } from '@/hooks/useDashboardData';

export const QuickActionsSection: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState('');
  const [actionParameters, setActionParameters] = useState({});
  const { data: actions, isLoading } = useQuickActions(10);
  const createAction = useCreateQuickAction();

  const quickActionCategories = [
    {
      title: 'User Management',
      icon: Users,
      actions: [
        { id: 'bulk-user-update', name: 'Bulk Update Users', description: 'Update multiple user profiles' },
        { id: 'user-notification', name: 'Send User Notifications', description: 'Send notifications to users' },
        { id: 'user-export', name: 'Export User Data', description: 'Export user information' },
      ]
    },
    {
      title: 'Product Management',
      icon: Package,
      actions: [
        { id: 'inventory-sync', name: 'Sync Inventory', description: 'Synchronize product inventory' },
        { id: 'bulk-price-update', name: 'Bulk Price Update', description: 'Update product prices' },
        { id: 'product-import', name: 'Import Products', description: 'Import product catalog' },
      ]
    },
    {
      title: 'System Maintenance',
      icon: Settings,
      actions: [
        { id: 'cache-clear', name: 'Clear Cache', description: 'Clear system cache' },
        { id: 'backup-database', name: 'Backup Database', description: 'Create database backup' },
        { id: 'system-cleanup', name: 'System Cleanup', description: 'Clean temporary files' },
      ]
    },
    {
      title: 'Data Export',
      icon: Download,
      actions: [
        { id: 'sales-report', name: 'Generate Sales Report', description: 'Export sales analytics' },
        { id: 'vendor-report', name: 'Vendor Performance Report', description: 'Export vendor metrics' },
        { id: 'customer-report', name: 'Customer Analytics', description: 'Export customer data' },
      ]
    },
  ];

  const recentActions = [
    { name: 'Cache Clear', status: 'completed', progress: 100, time: '2 min ago', duration: '15s' },
    { name: 'User Export', status: 'in_progress', progress: 67, time: '5 min ago', duration: 'Running...' },
    { name: 'Inventory Sync', status: 'completed', progress: 100, time: '10 min ago', duration: '2m 34s' },
    { name: 'Price Update', status: 'failed', progress: 45, time: '15 min ago', duration: 'Failed' },
  ];

  const handleActionSubmit = async (actionType: string, parameters: any) => {
    try {
      await createAction.mutateAsync({
        action_name: actionType,
        action_type: actionType as any,
        parameters: parameters,
        executed_by: 'current-user-id', // This would come from auth context
      });
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quick Actions</h1>
          <p className="text-gray-600 mt-1">Execute common administrative tasks efficiently</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Schedule Action
          </Button>
        </div>
      </div>

      <Tabs defaultValue="actions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="forms">Action Forms</TabsTrigger>
          <TabsTrigger value="history">Action History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {quickActionCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <category.icon className="w-5 h-5 mr-2" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{action.name}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleActionSubmit(action.id, {})}
                        >
                          Execute
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{action.name}</span>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Progress value={action.progress} className="flex-1" />
                        <span className="text-xs text-gray-500">{action.progress}%</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-500">{action.time}</p>
                      <p className="text-xs text-gray-600">{action.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk User Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notification-type">Notification Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="user-segment">User Segment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="inactive">Inactive Users</SelectItem>
                      <SelectItem value="premium">Premium Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter notification message..." />
                </div>
                <Button onClick={() => handleActionSubmit('user-notification', {})}>
                  Send Notifications
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Price Update</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Product Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="update-type">Update Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input id="value" type="number" placeholder="Enter value..." />
                </div>
                <Button onClick={() => handleActionSubmit('bulk-price-update', {})}>
                  Update Prices
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maintenance-type">Maintenance Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cache-clear">Clear Cache</SelectItem>
                      <SelectItem value="database-optimize">Optimize Database</SelectItem>
                      <SelectItem value="log-cleanup">Clean Logs</SelectItem>
                      <SelectItem value="backup">Create Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="schedule">Schedule</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Execute Now</SelectItem>
                      <SelectItem value="low-traffic">During Low Traffic</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleActionSubmit('system-maintenance', {})}>
                  Execute Maintenance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="export-type">Export Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="users">User Data</SelectItem>
                      <SelectItem value="orders">Order Data</SelectItem>
                      <SelectItem value="products">Product Data</SelectItem>
                      <SelectItem value="analytics">Analytics Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleActionSubmit('data-export', {})}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Action History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actions?.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{action.action_name}</h3>
                      <p className="text-sm text-gray-600">Type: {action.action_type}</p>
                      <p className="text-xs text-gray-500">{action.created_at}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(action.execution_status || 'pending')}>
                        {action.execution_status || 'pending'}
                      </Badge>
                      {action.execution_time_ms && (
                        <p className="text-xs text-gray-500 mt-1">
                          Duration: {action.execution_time_ms}ms
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Action Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Action templates and saved configurations would be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
