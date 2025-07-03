import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, Database, Cloud, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface InfrastructureComponent {
  id: string;
  name: string;
  type: 'server' | 'database' | 'storage' | 'network';
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  cpu: number;
  memory: number;
  load: number;
}

export const InfrastructureManager = () => {
  const [components, setComponents] = useState<InfrastructureComponent[]>([
    {
      id: '1',
      name: 'API Gateway Cluster',
      type: 'server',
      status: 'healthy',
      uptime: 99.95,
      cpu: 45,
      memory: 62,
      load: 0.8
    },
    {
      id: '2',
      name: 'PostgreSQL Primary',
      type: 'database',
      status: 'healthy',
      uptime: 99.99,
      cpu: 35,
      memory: 78,
      load: 0.6
    },
    {
      id: '3',
      name: 'Redis Cache Cluster',
      type: 'database',
      status: 'warning',
      uptime: 99.87,
      cpu: 68,
      memory: 85,
      load: 1.2
    },
    {
      id: '4',
      name: 'File Storage',
      type: 'storage',
      status: 'healthy',
      uptime: 99.92,
      cpu: 25,
      memory: 45,
      load: 0.4
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'critical': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'storage': return <Cloud className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const healthyCount = components.filter(c => c.status === 'healthy').length;
  const warningCount = components.filter(c => c.status === 'warning').length;
  const criticalCount = components.filter(c => c.status === 'critical').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Infrastructure Management</h1>
          <p className="text-muted-foreground">Monitor and manage system infrastructure</p>
        </div>
        <Button>
          <Activity className="mr-2 h-4 w-4" />
          Health Check
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">Components running normally</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{warningCount}</div>
            <p className="text-xs text-muted-foreground">Components need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Critical issues detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(components.reduce((acc, c) => acc + c.uptime, 0) / components.length).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {components.map((component) => (
              <Card key={component.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(component.type)}
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(component.status)}>
                      {getStatusIcon(component.status)}
                      {component.status}
                    </Badge>
                  </div>
                  <CardDescription>Type: {component.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Uptime</p>
                      <p className="text-2xl font-bold text-success">{component.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">CPU Usage</p>
                      <p className="text-2xl font-bold">{component.cpu}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Memory</p>
                      <p className="text-2xl font-bold">{component.memory}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Load</p>
                      <p className="text-2xl font-bold">{component.load}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">Configure</Button>
                    <Button size="sm" variant="outline">Scale</Button>
                    <Button size="sm" variant="outline">View Logs</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="servers">
          <Card>
            <CardHeader>
              <CardTitle>Server Management</CardTitle>
              <CardDescription>Manage compute resources and load balancing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Server management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="databases">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Monitor database performance and connections</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Database management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scaling">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Scaling Configuration</CardTitle>
              <CardDescription>Configure automatic scaling policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">CPU Scaling</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Scale up threshold</span>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Scale down threshold</span>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Min instances</span>
                          <span className="text-sm font-medium">2</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Max instances</span>
                          <span className="text-sm font-medium">10</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Memory Scaling</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Scale up threshold</span>
                          <span className="text-sm font-medium">80%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Scale down threshold</span>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Min memory</span>
                          <span className="text-sm font-medium">4GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Max memory</span>
                          <span className="text-sm font-medium">32GB</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};