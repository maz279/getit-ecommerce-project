/**
 * Microservices Orchestrator Dashboard
 * Manages and monitors all microservice operations
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMicroservices } from '@/hooks/useMicroservices';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { Play, Pause, RefreshCw, Settings, AlertTriangle, Database, Cloud, Cpu } from 'lucide-react';

export const MicroservicesOrchestrator: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const {
    services,
    systemHealth: microserviceHealth,
    loading: servicesLoading,
    error: servicesError,
    getServiceClient
  } = useMicroservices();

  const {
    servicesHealth,
    systemHealth,
    loading: healthLoading,
    error: healthError
  } = useServiceHealth();

  // Service action handlers
  const handleServiceAction = async (serviceName: string, action: 'start' | 'stop' | 'restart') => {
    setActionLoading(true);
    try {
      const client = await getServiceClient(serviceName);
      
      switch (action) {
        case 'start':
          await client.post('/admin/start');
          break;
        case 'stop':
          await client.post('/admin/stop');
          break;
        case 'restart':
          await client.post('/admin/restart');
          break;
      }
      
      // Refresh services list
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(`Failed to ${action} service:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  // Scale service
  const handleScaleService = async (serviceName: string, instances: number) => {
    setActionLoading(true);
    try {
      const client = await getServiceClient(serviceName);
      await client.post('/admin/scale', { instances });
    } catch (error) {
      console.error('Failed to scale service:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success/10 text-success border-success/20';
      case 'degraded':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'down':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (servicesLoading || healthLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Microservices Orchestrator</h1>
          <p className="text-muted-foreground">Manage and monitor all microservice operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Total Services</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">{services.length}</span>
              <p className="text-xs text-muted-foreground">Active microservices</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">Healthy Services</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-success">{systemHealth?.healthy_services || 0}</span>
              <p className="text-xs text-muted-foreground">Running normally</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="text-sm font-medium">Issues</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-warning">
                {(systemHealth?.degraded_services || 0) + (systemHealth?.down_services || 0)}
              </span>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Requests</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">{systemHealth?.total_requests_per_minute || 0}</span>
              <p className="text-xs text-muted-foreground">Per minute</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="scaling">Auto Scaling</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <ServiceManagementPanel 
            services={services}
            servicesHealth={servicesHealth}
            onServiceAction={handleServiceAction}
            onScaleService={handleScaleService}
            getServiceStatusColor={getServiceStatusColor}
            actionLoading={actionLoading}
          />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <ServiceMonitoringPanel servicesHealth={servicesHealth} />
        </TabsContent>

        <TabsContent value="scaling" className="space-y-4">
          <AutoScalingPanel services={services} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <ServiceLogsPanel services={services} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Service Management Panel
interface ServiceManagementPanelProps {
  services: any[];
  servicesHealth: any[];
  onServiceAction: (serviceName: string, action: 'start' | 'stop' | 'restart') => void;
  onScaleService: (serviceName: string, instances: number) => void;
  getServiceStatusColor: (status: string) => string;
  actionLoading: boolean;
}

const ServiceManagementPanel: React.FC<ServiceManagementPanelProps> = ({
  services,
  servicesHealth,
  onServiceAction,
  onScaleService,
  getServiceStatusColor,
  actionLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    const healthInfo = servicesHealth.find(h => h.service_name === service.service_name);
    const matchesStatus = statusFilter === 'all' || healthInfo?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="down">Down</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredServices.map((service) => {
          const healthInfo = servicesHealth.find(h => h.service_name === service.service_name);
          
          return (
            <Card key={service.service_name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{service.service_name}</CardTitle>
                  <Badge className={getServiceStatusColor(healthInfo?.status || 'unknown')}>
                    {healthInfo?.status || 'unknown'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{service.endpoint}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Health</span>
                    <p className="font-medium">{healthInfo?.health_score || 0}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response</span>
                    <p className="font-medium">{healthInfo?.response_time_avg || 0}ms</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Errors</span>
                    <p className="font-medium">{healthInfo?.error_rate || 0}%</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onServiceAction(service.service_name, 'restart')}
                    disabled={actionLoading}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Restart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onServiceAction(service.service_name, 'stop')}
                    disabled={actionLoading}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onServiceAction(service.service_name, 'start')}
                    disabled={actionLoading}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Service Monitoring Panel
const ServiceMonitoringPanel: React.FC<{ servicesHealth: any[] }> = ({ servicesHealth }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {servicesHealth.map((service) => (
        <Card key={service.service_name}>
          <CardHeader>
            <CardTitle className="text-base">{service.service_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>{service.cpu_utilization}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{service.memory_utilization}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Response Time</span>
                <span>{service.response_time_avg}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Error Rate</span>
                <span>{service.error_rate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Auto Scaling Panel
const AutoScalingPanel: React.FC<{ services: any[] }> = ({ services }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto Scaling Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Auto scaling configuration panel will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

// Service Logs Panel
const ServiceLogsPanel: React.FC<{ services: any[] }> = ({ services }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Real-time service logs will be displayed here.</p>
      </CardContent>
    </Card>
  );
};