import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, Activity, Database, Server, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ServiceHealth {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastCheck: string;
  endpoint: string;
  dependencies: string[];
  metrics: {
    cpu: number;
    memory: number;
    requests: number;
    errors: number;
  };
}

interface ServiceHealthDashboardProps {
  className?: string;
}

export const ServiceHealthDashboard: React.FC<ServiceHealthDashboardProps> = ({
  className = ""
}) => {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockServices: ServiceHealth[] = [
      {
        id: 'user-service',
        name: 'User Management Service',
        status: 'healthy',
        uptime: 99.9,
        responseTime: 45,
        errorRate: 0.1,
        lastCheck: new Date().toISOString(),
        endpoint: '/api/v1/users',
        dependencies: ['postgres-users', 'redis-sessions'],
        metrics: { cpu: 25, memory: 512, requests: 1250, errors: 2 }
      },
      {
        id: 'product-service',
        name: 'Product Catalog Service',
        status: 'warning',
        uptime: 98.5,
        responseTime: 120,
        errorRate: 2.1,
        lastCheck: new Date().toISOString(),
        endpoint: '/api/v1/products',
        dependencies: ['mongodb-products', 'elasticsearch'],
        metrics: { cpu: 65, memory: 1024, requests: 3400, errors: 71 }
      },
      {
        id: 'payment-service',
        name: 'Payment Processing Service',
        status: 'healthy',
        uptime: 99.99,
        responseTime: 35,
        errorRate: 0.05,
        lastCheck: new Date().toISOString(),
        endpoint: '/api/v1/payments',
        dependencies: ['postgres-payments', 'bkash-api', 'nagad-api'],
        metrics: { cpu: 15, memory: 256, requests: 850, errors: 0 }
      },
      {
        id: 'order-service',
        name: 'Order Management Service',
        status: 'critical',
        uptime: 95.2,
        responseTime: 250,
        errorRate: 5.5,
        lastCheck: new Date().toISOString(),
        endpoint: '/api/v1/orders',
        dependencies: ['postgres-orders', 'rabbitmq'],
        metrics: { cpu: 85, memory: 1536, requests: 2100, errors: 115 }
      },
      {
        id: 'vendor-service',
        name: 'Vendor Management Service',
        status: 'healthy',
        uptime: 99.7,
        responseTime: 55,
        errorRate: 0.3,
        lastCheck: new Date().toISOString(),
        endpoint: '/api/v1/vendors',
        dependencies: ['postgres-vendors', 'file-storage'],
        metrics: { cpu: 30, memory: 768, requests: 950, errors: 3 }
      }
    ];

    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      critical: 'destructive',
      unknown: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredServices = services.filter(service => 
    filter === 'all' || service.status === filter
  );

  const overallHealth = {
    total: services.length,
    healthy: services.filter(s => s.status === 'healthy').length,
    warning: services.filter(s => s.status === 'warning').length,
    critical: services.filter(s => s.status === 'critical').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallHealth.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{overallHealth.healthy}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{overallHealth.warning}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overallHealth.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="healthy">Healthy</TabsTrigger>
          <TabsTrigger value="warning">Warning</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {/* Critical Alerts */}
          {overallHealth.critical > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {overallHealth.critical} service(s) are in critical state and require immediate attention.
              </AlertDescription>
            </Alert>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                  <CardDescription>{service.endpoint}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                      <div className="text-lg font-semibold">{service.uptime}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                      <div className="text-lg font-semibold">{service.responseTime}ms</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Error Rate</div>
                      <div className="text-lg font-semibold">{service.errorRate}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Requests/min</div>
                      <div className="text-lg font-semibold">{service.metrics.requests}</div>
                    </div>
                  </div>

                  {/* Resource Usage */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>{service.metrics.cpu}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${service.metrics.cpu}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{service.metrics.memory}MB</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min(service.metrics.memory / 2048 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Dependencies */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Dependencies</div>
                    <div className="flex flex-wrap gap-1">
                      {service.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-1" />
                      View Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Zap className="h-4 w-4 mr-1" />
                      Restart
                    </Button>
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