import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database,
  Globe,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Zap,
  RefreshCw
} from 'lucide-react';
import { ApiClient } from '@/services/api/ApiClient';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: number;
  responseTime: number;
  errorRate: number;
  version: string;
  lastChecked: string;
  dependencies: string[];
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    connections: number;
  };
}

const microservices: ServiceHealth[] = [
  {
    name: 'API Gateway',
    status: 'healthy',
    uptime: 99.99,
    responseTime: 45,
    errorRate: 0.01,
    version: '2.1.0',
    lastChecked: '2 minutes ago',
    dependencies: ['User Service', 'Product Service'],
    metrics: { cpuUsage: 15, memoryUsage: 68, diskUsage: 25, connections: 1250 }
  },
  {
    name: 'User Service',
    status: 'healthy',
    uptime: 99.95,
    responseTime: 120,
    errorRate: 0.05,
    version: '1.8.2',
    lastChecked: '1 minute ago',
    dependencies: ['Database', 'Auth Service'],
    metrics: { cpuUsage: 25, memoryUsage: 72, diskUsage: 30, connections: 850 }
  },
  {
    name: 'Product Service',
    status: 'warning',
    uptime: 99.85,
    responseTime: 250,
    errorRate: 0.15,
    version: '2.0.1',
    lastChecked: '3 minutes ago',
    dependencies: ['Database', 'Search Service'],
    metrics: { cpuUsage: 45, memoryUsage: 85, diskUsage: 60, connections: 1100 }
  },
  {
    name: 'Order Service',
    status: 'healthy',
    uptime: 99.98,
    responseTime: 95,
    errorRate: 0.02,
    version: '1.9.5',
    lastChecked: '1 minute ago',
    dependencies: ['Payment Service', 'Inventory Service'],
    metrics: { cpuUsage: 20, memoryUsage: 65, diskUsage: 35, connections: 650 }
  },
  {
    name: 'Payment Service',
    status: 'healthy',
    uptime: 99.99,
    responseTime: 180,
    errorRate: 0.01,
    version: '2.2.0',
    lastChecked: '2 minutes ago',
    dependencies: ['External Payment APIs'],
    metrics: { cpuUsage: 18, memoryUsage: 55, diskUsage: 20, connections: 450 }
  },
  {
    name: 'Shipping Service',
    status: 'critical',
    uptime: 98.50,
    responseTime: 800,
    errorRate: 1.2,
    version: '1.5.3',
    lastChecked: '5 minutes ago',
    dependencies: ['External Shipping APIs'],
    metrics: { cpuUsage: 75, memoryUsage: 92, diskUsage: 80, connections: 200 }
  },
  {
    name: 'Search Service',
    status: 'healthy',
    uptime: 99.92,
    responseTime: 85,
    errorRate: 0.08,
    version: '1.7.1',
    lastChecked: '1 minute ago',
    dependencies: ['Elasticsearch', 'ML Service'],
    metrics: { cpuUsage: 35, memoryUsage: 78, diskUsage: 45, connections: 980 }
  },
  {
    name: 'ML Recommendation',
    status: 'healthy',
    uptime: 99.88,
    responseTime: 350,
    errorRate: 0.12,
    version: '1.4.2',
    lastChecked: '2 minutes ago',
    dependencies: ['Data Lake', 'Feature Store'],
    metrics: { cpuUsage: 60, memoryUsage: 88, diskUsage: 70, connections: 300 }
  }
];

export const MicroserviceHealthMonitor: React.FC = () => {
  const [services, setServices] = useState<ServiceHealth[]>(microservices);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [filter, setFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');

  const apiClient = ApiClient.getInstance();

  useEffect(() => {
    refreshHealthData();
    const interval = setInterval(refreshHealthData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshHealthData = async () => {
    setLoading(true);
    try {
      // In real implementation, this would fetch from monitoring endpoints
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredServices = services.filter(service => 
    filter === 'all' || service.status === filter
  );

  const statusCounts = {
    healthy: services.filter(s => s.status === 'healthy').length,
    warning: services.filter(s => s.status === 'warning').length,
    critical: services.filter(s => s.status === 'critical').length,
    total: services.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Microservice Health Monitor</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={refreshHealthData} disabled={loading} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              Microservices monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.healthy}</div>
            <p className="text-xs text-muted-foreground">
              {((statusCounts.healthy / statusCounts.total) * 100).toFixed(1)}% of services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</div>
            <p className="text-xs text-muted-foreground">
              Services needing attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.critical}</div>
            <p className="text-xs text-muted-foreground">
              Services requiring immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service List */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Resource Metrics</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('all')}
            >
              All Services
            </Button>
            <Button 
              variant={filter === 'healthy' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('healthy')}
            >
              Healthy
            </Button>
            <Button 
              variant={filter === 'warning' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('warning')}
            >
              Warning
            </Button>
            <Button 
              variant={filter === 'critical' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('critical')}
            >
              Critical
            </Button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.name} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {getStatusIcon(service.status)}
                      <span className="ml-2">{service.name}</span>
                    </CardTitle>
                    {getStatusBadge(service.status)}
                  </div>
                  <CardDescription>
                    Version {service.version} • Last checked {service.lastChecked}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Uptime</p>
                        <p className="font-medium">{service.uptime}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Response Time</p>
                        <p className="font-medium">{service.responseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Error Rate</p>
                        <p className="font-medium">{service.errorRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Connections</p>
                        <p className="font-medium">{service.metrics.connections}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>{service.metrics.cpuUsage}%</span>
                      </div>
                      <Progress value={service.metrics.cpuUsage} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Memory Usage</span>
                        <span>{service.metrics.memoryUsage}%</span>
                      </div>
                      <Progress value={service.metrics.memoryUsage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card key={service.name}>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    {getStatusIcon(service.status)}
                    <span className="ml-2">{service.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Cpu className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>CPU</span>
                          <span>{service.metrics.cpuUsage}%</span>
                        </div>
                        <Progress value={service.metrics.cpuUsage} className="h-2 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MemoryStick className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Memory</span>
                          <span>{service.metrics.memoryUsage}%</span>
                        </div>
                        <Progress value={service.metrics.memoryUsage} className="h-2 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <HardDrive className="h-4 w-4 text-purple-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Disk</span>
                          <span>{service.metrics.diskUsage}%</span>
                        </div>
                        <Progress value={service.metrics.diskUsage} className="h-2 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Network className="h-4 w-4 text-orange-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Connections</span>
                          <span>{service.metrics.connections}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.name}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getStatusIcon(service.status)}
                    <span className="ml-2">{service.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Dependencies and service connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Dependencies:</p>
                    {service.dependencies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {service.dependencies.map((dep) => (
                          <Badge key={dep} variant="outline">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No dependencies</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};