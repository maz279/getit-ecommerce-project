/**
 * Microservices Dashboard - Real-time monitoring and management
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  MemoryStick,
  Network,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import useMicroservices from '@/hooks/useMicroservices';

export const MicroservicesDashboard: React.FC = () => {
  const { 
    services, 
    healthStatus, 
    systemHealth, 
    loading, 
    error,
    loadServices 
  } = useMicroservices();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4" />;
      case 'down': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span>Error loading microservices: {error}</span>
          </div>
          <Button onClick={loadServices} className="mt-4" variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Services</p>
                <p className="text-2xl font-bold">{systemHealth.totalServices}</p>
              </div>
              <Server className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy</p>
                <p className="text-2xl font-bold text-green-600">{systemHealth.healthyServices}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{Math.round(systemHealth.averageResponseTime)}ms</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {(systemHealth.totalErrorRate * 100).toFixed(2)}%
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="health">Health Monitoring</TabsTrigger>
          <TabsTrigger value="logs">Communication Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4">
            {services.map((service) => {
              const health = healthStatus[service.service_name];
              return (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(service.status)}
                          <CardTitle className="text-lg">{service.service_name}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        v{service.version}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Activity className="w-4 h-4" />
                          <span className="text-sm text-muted-foreground">Response Time</span>
                        </div>
                        <p className="text-lg font-semibold">
                          {health ? `${health.response_time_ms}ms` : 'N/A'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm text-muted-foreground">Error Rate</span>
                        </div>
                        <p className="text-lg font-semibold">
                          {health ? `${(health.error_rate * 100).toFixed(2)}%` : 'N/A'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Cpu className="w-4 h-4" />
                          <span className="text-sm text-muted-foreground">CPU Usage</span>
                        </div>
                        <p className="text-lg font-semibold">
                          {health ? `${Math.round(health.cpu_usage * 100)}%` : 'N/A'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <MemoryStick className="w-4 h-4" />
                          <span className="text-sm text-muted-foreground">Memory</span>
                        </div>
                        <p className="text-lg font-semibold">
                          {health ? `${Math.round(health.memory_usage * 100)}%` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Endpoint:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {service.endpoint_url}
                        </code>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Last Check:</span>
                        <span>{health ? new Date(health.last_check).toLocaleTimeString() : 'Never'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall System Health</span>
                    <span>{Math.round((systemHealth.healthyServices / systemHealth.totalServices) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(systemHealth.healthyServices / systemHealth.totalServices) * 100}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{systemHealth.healthyServices}</p>
                    <p className="text-sm text-green-700">Healthy Services</p>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{systemHealth.degradedServices}</p>
                    <p className="text-sm text-yellow-700">Degraded Services</p>
                  </div>

                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{systemHealth.downServices}</p>
                    <p className="text-sm text-red-700">Down Services</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Communication Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Communication logs will appear here as services interact</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MicroservicesDashboard;