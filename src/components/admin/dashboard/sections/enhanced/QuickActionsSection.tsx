
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCreateQuickAction, useQuickActions } from '@/hooks/useDashboardData';
import { 
  Plus, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Settings, 
  AlertTriangle,
  Play,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const EnhancedQuickActionsSection: React.FC = () => {
  const [actionName, setActionName] = useState('');
  const [actionType, setActionType] = useState('bulk_update');
  const [parameters, setParameters] = useState('');

  const { data: quickActions, isLoading } = useQuickActions(10);
  const createActionMutation = useCreateQuickAction();

  const handleCreateAction = () => {
    const newAction = {
      id: `qa-${Date.now()}`,
      action_name: actionName,
      action_type: actionType as any,
      parameters: parameters ? JSON.parse(parameters) : {},
      executed_by: 'admin@getit.com',
      execution_status: 'pending' as any,
      progress_percentage: 0,
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      completed_at: '',
      execution_time_ms: 0,
      result_data: {},
      error_message: ''
    };

    createActionMutation.mutate(newAction);
    setActionName('');
    setParameters('');
  };

  const quickActionTemplates = [
    { icon: Plus, label: 'Add Product', type: 'bulk_update', color: 'bg-blue-500' },
    { icon: CheckCircle, label: 'Approve Vendor', type: 'user_management', color: 'bg-green-500' },
    { icon: DollarSign, label: 'Process Payout', type: 'order_processing', color: 'bg-purple-500' },
    { icon: FileText, label: 'Generate Report', type: 'data_export', color: 'bg-orange-500' },
    { icon: Settings, label: 'System Maintenance', type: 'system_maintenance', color: 'bg-gray-500' },
    { icon: AlertTriangle, label: 'Emergency Alert', type: 'bulk_update', color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Action</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Actions</CardTitle>
                <Play className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">Success rate: 97%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Action Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickActionTemplates.map((template, index) => {
                  const IconComponent = template.icon;
                  return (
                    <Button
                      key={index}
                      className={`${template.color} hover:opacity-90 text-white h-20 flex-col space-y-2`}
                      variant="default"
                      onClick={() => {
                        setActionName(template.label);
                        setActionType(template.type);
                      }}
                    >
                      <IconComponent size={20} />
                      <span className="text-xs text-center">{template.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Quick Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="actionName">Action Name</Label>
                <Input
                  id="actionName"
                  value={actionName}
                  onChange={(e) => setActionName(e.target.value)}
                  placeholder="Enter action name"
                />
              </div>

              <div>
                <Label htmlFor="actionType">Action Type</Label>
                <select
                  id="actionType"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bulk_update">Bulk Update</option>
                  <option value="data_export">Data Export</option>
                  <option value="system_maintenance">System Maintenance</option>
                  <option value="user_management">User Management</option>
                  <option value="order_processing">Order Processing</option>
                  <option value="inventory_sync">Inventory Sync</option>
                </select>
              </div>

              <div>
                <Label htmlFor="parameters">Parameters (JSON)</Label>
                <Input
                  id="parameters"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  placeholder='{"key": "value"}'
                />
              </div>

              <Button 
                onClick={handleCreateAction}
                disabled={!actionName || createActionMutation.isPending}
                className="w-full"
              >
                {createActionMutation.isPending ? 'Creating...' : 'Create Action'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Action History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading actions...</p>
              ) : (
                <div className="space-y-4">
                  {quickActions?.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{action.action_name}</h4>
                        <p className="text-sm text-gray-600">{action.action_type}</p>
                        <p className="text-xs text-gray-500">{new Date(action.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={action.execution_status === 'completed' ? 'default' : 'secondary'}>
                          {action.execution_status}
                        </Badge>
                        {action.execution_status === 'running' && (
                          <Clock className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
