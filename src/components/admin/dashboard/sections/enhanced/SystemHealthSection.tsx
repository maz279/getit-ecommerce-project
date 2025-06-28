
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useSystemHealthLogs, useCreateSystemHealthLog } from '@/hooks/useDashboardData';

export const SystemHealthSection: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { data: healthLogs, isLoading, refetch } = useSystemHealthLogs(20);
  const createHealthLog = useCreateSystemHealthLog();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'down': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'down': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'database': return <Database className="h-5 w-5" />;
      case 'api': return <Server className="h-5 w-5" />;
      case 'cache': return <Cpu className="h-5 w-5" />;
      case 'search': return <Activity className="h-5 w-5" />;
      case 'payment': return <TrendingUp className="h-5 w-5" />;
      case 'notification': return <Wifi className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">System Health Monitoring</h2>
          <Button variant="outline" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const healthyServices = healthLogs?.filter(log => log.health_status === 'healthy') || [];
  const warningServices = healthLogs?.filter(log => log.health_status === 'warning') || [];
  const criticalServices = healthLogs?.filter(log => log.health_status === 'critical') || [];
  const downServices = healthLogs?.filter(log => log.health_status === 'down') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Health Monitoring</h2>
          <p className="text-gray-600">Real-time monitoring of system components and services</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{healthyServices.length}</div>
                <div className="text-sm text-gray-500">Healthy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{warningServices.length}</div>
                <div className="text-sm text-gray-500">Warning</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{criticalServices.length}</div>
                <div className="text-sm text-gray-500">Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{downServices.length}</div>
                <div className="text-sm text-gray-500">Down</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthLogs?.map((log) => (
              <Card key={log.id} className={`border-l-4 ${getStatusColor(log.health_status)}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {getServiceIcon(log.service_type)}
                      <span>{log.service_name}</span>
                    </div>
                    {getStatusIcon(log.health_status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant={log.health_status === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                      {log.health_status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {log.response_time_ms && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="text-sm font-medium">{log.response_time_ms}ms</span>
                    </div>
                  )}
                  
                  {log.success_rate && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="text-sm font-medium">{log.success_rate}%</span>
                      </div>
                      <Progress value={log.success_rate} className="h-2" />
                    </div>
                  )}
                  
                  {log.cpu_usage && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CPU Usage</span>
                        <span className="text-sm font-medium">{log.cpu_usage}%</span>
                      </div>
                      <Progress value={log.cpu_usage} className="h-2" />
                    </div>
                  )}
                  
                  {log.memory_usage && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Memory Usage</span>
                        <span className="text-sm font-medium">{log.memory_usage}%</span>
                      </div>
                      <Progress value={log.memory_usage} className="h-2" />
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2">
                    Last check: {new Date(log.last_check).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthLogs?.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getServiceIcon(log.service_type)}
                      <div>
                        <div className="font-medium">{log.service_name}</div>
                        <div className="text-sm text-gray-500">{log.service_type}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      {log.response_time_ms && (
                        <div className="text-center">
                          <div className="font-medium">{log.response_time_ms}ms</div>
                          <div className="text-gray-500">Response</div>
                        </div>
                      )}
                      {log.success_rate && (
                        <div className="text-center">
                          <div className="font-medium">{log.success_rate}%</div>
                          <div className="text-gray-500">Success</div>
                        </div>
                      )}
                      {log.uptime_seconds && (
                        <div className="text-center">
                          <div className="font-medium">{Math.floor(log.uptime_seconds / 3600)}h</div>
                          <div className="text-gray-500">Uptime</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthLogs?.filter(log => log.health_status !== 'healthy').map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg border-l-4 border-l-red-500">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-medium">{log.service_name} - {log.health_status.toUpperCase()}</div>
                        <div className="text-sm text-gray-500">
                          {log.error_count > 0 && `${log.error_count} errors detected`}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.last_check).toLocaleString()}
                    </div>
                  </div>
                ))}
                {healthLogs?.filter(log => log.health_status !== 'healthy').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No system alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Check History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {healthLogs?.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(log.health_status)}
                      <div>
                        <div className="font-medium">{log.service_name}</div>
                        <div className="text-sm text-gray-500">{log.service_type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{log.health_status}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.last_check).toLocaleString()}
                      </div>
                    </div>
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
