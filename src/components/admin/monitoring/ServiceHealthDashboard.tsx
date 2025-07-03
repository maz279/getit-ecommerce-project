/**
 * Service Health Monitoring Dashboard
 * Real-time visualization of all microservices health
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { AlertCircle, CheckCircle, XCircle, Clock, TrendingUp, Server } from 'lucide-react';

export const ServiceHealthDashboard: React.FC = () => {
  const {
    servicesHealth,
    systemHealth,
    loading,
    error,
    getServicesByStatus,
    getCriticalServices,
    hasCriticalIssues,
    getSLACompliance
  } = useServiceHealth();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  if (error) {
    return (
      <Card className="m-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load health metrics: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const slaCompliance = getSLACompliance();
  const criticalServices = getCriticalServices();
  const healthyServices = getServicesByStatus('healthy');
  const degradedServices = getServicesByStatus('degraded');
  const downServices = getServicesByStatus('down');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'degraded':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
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

  return (
    <div className="p-6 space-y-6">
      {/* Alert Banner */}
      {hasCriticalIssues() && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">
                Critical services are experiencing issues. Immediate attention required.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Overall Health</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{systemHealth?.overall_score || 0}%</span>
              <Badge variant={systemHealth?.overall_score && systemHealth.overall_score >= 95 ? 'default' : 'destructive'}>
                {systemHealth?.overall_score && systemHealth.overall_score >= 95 ? 'Excellent' : 'Needs Attention'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">SLA Compliance</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{slaCompliance.current.toFixed(2)}%</span>
              <Badge variant={slaCompliance.isCompliant ? 'default' : 'destructive'}>
                Target: {slaCompliance.target}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Avg Response Time</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">{systemHealth?.average_response_time || 0}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span className="text-sm font-medium">Error Rate</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">{systemHealth?.error_rate_percentage || 0}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Services ({servicesHealth.length})</TabsTrigger>
          <TabsTrigger value="critical">Critical ({criticalServices.length})</TabsTrigger>
          <TabsTrigger value="healthy">Healthy ({healthyServices.length})</TabsTrigger>
          <TabsTrigger value="issues">Issues ({degradedServices.length + downServices.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ServiceGrid services={servicesHealth} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <ServiceGrid services={criticalServices} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
        </TabsContent>

        <TabsContent value="healthy" className="space-y-4">
          <ServiceGrid services={healthyServices} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <ServiceGrid services={[...degradedServices, ...downServices]} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ServiceGridProps {
  services: any[];
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services, getStatusIcon, getStatusColor }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.service_name}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{service.service_name}</CardTitle>
              <Badge className={getStatusColor(service.status)}>
                {getStatusIcon(service.status)}
                <span className="ml-1">{service.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Health Score</span>
                <span className="font-medium">{service.health_score}%</span>
              </div>
              <Progress value={service.health_score} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Response Time</span>
                <p className="font-medium">{service.response_time_avg}ms</p>
              </div>
              <div>
                <span className="text-muted-foreground">Error Rate</span>
                <p className="font-medium">{service.error_rate}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">CPU Usage</span>
                <p className="font-medium">{service.cpu_utilization}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">Memory</span>
                <p className="font-medium">{service.memory_utilization}%</p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium">{service.uptime_percentage.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Last Check:</span>
                <span>{new Date(service.last_health_check).toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};