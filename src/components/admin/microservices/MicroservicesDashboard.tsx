import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Server, 
  Settings, 
  BarChart3, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { configManager, userService, productService, orderService, paymentService } from '@/services/microservices/ServiceClient';

interface ServiceHealth {
  service_name: string;
  status: string;
  last_health_check?: string;
  response_time?: number;
  error?: string;
}

interface ServiceMetrics {
  service_name: string;
  requests_count: number;
  avg_response_time: number;
  error_rate: number;
  uptime_percentage: number;
}

export const MicroservicesDashboard: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState<Record<string, ServiceHealth>>({});
  const [metrics, setMetrics] = useState<Record<string, ServiceMetrics>>({});
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load services
      const servicesResponse = await configManager.getServices();
      if (servicesResponse.success && Array.isArray(servicesResponse.data)) {
        setServices(servicesResponse.data);
        
        // Check health for each service
        await checkAllServicesHealth(servicesResponse.data);
      }

      // Load configurations
      const configsResponse = await configManager.getConfigs({ environment: 'production' });
      if (configsResponse.success && Array.isArray(configsResponse.data)) {
        setConfigs(configsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAllServicesHealth = async (servicesList: any[]) => {
    const healthChecks = await Promise.allSettled(
      servicesList.map(async (service) => {
        const startTime = Date.now();
        try {
          const client = getServiceClient(service.service_name);
          const response = await client.healthCheck();
          const responseTime = Date.now() - startTime;
          
          return {
            service_name: service.service_name,
            status: response.success ? 'healthy' : 'unhealthy',
            response_time: responseTime,
            error: response.error
          };
        } catch (error) {
          return {
            service_name: service.service_name,
            status: 'unhealthy',
            response_time: Date.now() - startTime,
            error: error instanceof Error ? error.message : 'Health check failed'
          };
        }
      })
    );

    const healthResults: Record<string, ServiceHealth> = {};
    healthChecks.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        healthResults[servicesList[index].service_name] = result.value;
      } else {
        healthResults[servicesList[index].service_name] = {
          service_name: servicesList[index].service_name,
          status: 'unhealthy',
          error: 'Health check failed'
        };
      }
    });

    setHealthStatus(healthResults);
  };

  const getServiceClient = (serviceName: string) => {
    switch (serviceName) {
      case 'user-service': return userService;
      case 'product-service': return productService;
      case 'order-service': return orderService;
      case 'payment-service': return paymentService;
      default: return configManager;
    }
  };

  const refreshServices = async () => {
    setRefreshing(true);
    await checkAllServicesHealth(services);
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'unhealthy':
      case 'inactive':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'degraded':
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return 'default';
      case 'unhealthy':
      case 'inactive':
        return 'destructive';
      case 'degraded':
      case 'maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const healthyServices = Object.values(healthStatus).filter(h => h.status === 'healthy').length;
  const totalServices = services.length;
  const systemHealth = totalServices > 0 ? Math.round((healthyServices / totalServices) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth}%</div>
            <p className="text-xs text-muted-foreground">
              {healthyServices} of {totalServices} services healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Total: {totalServices} services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurations</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configs.length}</div>
            <p className="text-xs text-muted-foreground">
              Production environment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(healthStatus).reduce((acc, h) => acc + (h.response_time || 0), 0) / Object.keys(healthStatus).length || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Across all services
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="health">Health Status</TabsTrigger>
            <TabsTrigger value="configs">Configurations</TabsTrigger>
          </TabsList>
          
          <Button 
            onClick={refreshServices} 
            disabled={refreshing}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <CardTitle className="text-lg">{service.service_name}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                    <Badge variant="outline">{service.service_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Endpoint</p>
                      <p className="font-mono text-xs">{service.endpoint_url}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Version</p>
                      <p>{service.version}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Last Health Check</p>
                      <p>{service.last_health_check ? new Date(service.last_health_check).toLocaleString() : 'Never'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid gap-4">
            {Object.values(healthStatus).map((health) => (
              <Card key={health.service_name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(health.status)}
                      <CardTitle className="text-lg">{health.service_name}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(health.status)}>
                        {health.status}
                      </Badge>
                    </div>
                    {health.response_time && (
                      <Badge variant="outline">{health.response_time}ms</Badge>
                    )}
                  </div>
                </CardHeader>
                {health.error && (
                  <CardContent>
                    <div className="text-sm text-destructive">
                      <p className="font-medium">Error:</p>
                      <p className="font-mono text-xs">{health.error}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configs" className="space-y-4">
          <div className="grid gap-4">
            {configs.reduce((acc, config) => {
              const key = `${config.service_name}-${config.config_type}`;
              if (!acc[key]) {
                acc[key] = {
                  service_name: config.service_name,
                  config_type: config.config_type,
                  configs: []
                };
              }
              acc[key].configs.push(config);
              return acc;
            }, {} as Record<string, any>)}
            {Object.values(configs.reduce((acc, config) => {
              const key = `${config.service_name}-${config.config_type}`;
              if (!acc[key]) {
                acc[key] = {
                  service_name: config.service_name,
                  config_type: config.config_type,
                  configs: []
                };
              }
              acc[key].configs.push(config);
              return acc;
            }, {} as Record<string, any>)).map((group: any) => (
              <Card key={`${group.service_name}-${group.config_type}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.service_name}</CardTitle>
                    <Badge variant="outline">{group.config_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {group.configs.map((config: any) => (
                      <div key={config.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{config.config_key}</span>
                          {config.is_sensitive && (
                            <Badge variant="secondary" className="text-xs">Sensitive</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {typeof config.config_value === 'object' 
                            ? JSON.stringify(config.config_value).substring(0, 50) + '...'
                            : String(config.config_value).substring(0, 50)
                          }
                        </div>
                      </div>
                    ))}
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