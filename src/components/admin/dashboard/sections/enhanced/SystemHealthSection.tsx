
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, Plus, RefreshCw, Activity } from 'lucide-react';
import { useSystemHealthLogs, useCreateSystemHealthLog } from '@/hooks/useDashboardData';
import { SystemHealthLog } from '@/services/database/DashboardService';
import { toast } from 'sonner';

export const SystemHealthSection: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newLog, setNewLog] = useState<Partial<SystemHealthLog>>({
    service_name: '',
    service_type: 'api',
    health_status: 'healthy',
    response_time_ms: 0,
    success_rate: 100
  });

  const { data: healthLogs = [], isLoading, refetch } = useSystemHealthLogs(20);
  const createLogMutation = useCreateSystemHealthLog();

  const handleCreateLog = async () => {
    try {
      await createLogMutation.mutateAsync(newLog as SystemHealthLog);
      toast.success('System health log created successfully');
      setIsCreateDialogOpen(false);
      setNewLog({
        service_name: '',
        service_type: 'api',
        health_status: 'healthy',
        response_time_ms: 0,
        success_rate: 100
      });
    } catch (error) {
      toast.error('Failed to create system health log');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'down': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
      down: 'bg-red-200 text-red-900'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getServiceTypeColor = (type: string) => {
    const colors = {
      database: 'bg-blue-100 text-blue-800',
      api: 'bg-purple-100 text-purple-800',
      cache: 'bg-orange-100 text-orange-800',
      search: 'bg-green-100 text-green-800',
      payment: 'bg-yellow-100 text-yellow-800',
      notification: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">System Health Monitoring</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">System Health Monitoring</h2>
          <p className="text-gray-600">Monitor system services and performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Health Check
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Health Check Log</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input
                    id="service-name"
                    value={newLog.service_name}
                    onChange={(e) => setNewLog({ ...newLog, service_name: e.target.value })}
                    placeholder="e.g., Main Database"
                  />
                </div>
                <div>
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select
                    value={newLog.service_type}
                    onValueChange={(value) => setNewLog({ ...newLog, service_type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="cache">Cache</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="health-status">Health Status</Label>
                  <Select
                    value={newLog.health_status}
                    onValueChange={(value) => setNewLog({ ...newLog, health_status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">Healthy</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="down">Down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="response-time">Response Time (ms)</Label>
                    <Input
                      id="response-time"
                      type="number"
                      value={newLog.response_time_ms}
                      onChange={(e) => setNewLog({ ...newLog, response_time_ms: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="success-rate">Success Rate (%)</Label>
                    <Input
                      id="success-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={newLog.success_rate}
                      onChange={(e) => setNewLog({ ...newLog, success_rate: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLog} disabled={createLogMutation.isPending}>
                    {createLogMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* System Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthLogs.slice(0, 4).map((log: any) => (
          <Card key={log.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className={getServiceTypeColor(log.service_type)}>
                  {log.service_type}
                </Badge>
                {getStatusIcon(log.health_status)}
              </div>
              <CardTitle className="text-lg">{log.service_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(log.health_status)}>
                    {log.health_status}
                  </Badge>
                </div>
                
                {log.response_time_ms && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-medium">{log.response_time_ms}ms</span>
                  </div>
                )}
                
                {log.success_rate && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-medium">{log.success_rate}%</span>
                    </div>
                    <Progress value={log.success_rate} className="h-2" />
                  </div>
                )}
                
                {log.cpu_usage && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CPU Usage</span>
                      <span className="font-medium">{log.cpu_usage}%</span>
                    </div>
                    <Progress value={log.cpu_usage} className="h-2" />
                  </div>
                )}
                
                {log.memory_usage && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Memory Usage</span>
                      <span className="font-medium">{log.memory_usage}%</span>
                    </div>
                    <Progress value={log.memory_usage} className="h-2" />
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  Last Check: {new Date(log.last_check).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Health Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Health Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(log.health_status)}
                  <div>
                    <h3 className="font-medium">{log.service_name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge size="sm" className={getServiceTypeColor(log.service_type)}>
                        {log.service_type}
                      </Badge>
                      <span>•</span>
                      <span>{new Date(log.last_check).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {log.response_time_ms && (
                    <div className="text-center">
                      <div className="text-sm font-medium">{log.response_time_ms}ms</div>
                      <div className="text-xs text-gray-500">Response</div>
                    </div>
                  )}
                  
                  {log.success_rate && (
                    <div className="text-center">
                      <div className="text-sm font-medium">{log.success_rate}%</div>
                      <div className="text-xs text-gray-500">Success</div>
                    </div>
                  )}
                  
                  <Badge className={getStatusColor(log.health_status)}>
                    {log.health_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
