/**
 * Service Health Dashboard
 * Real-time monitoring of all microservices
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Zap,
  TrendingUp,
  Server
} from 'lucide-react';
import { apiGatewayClient, ServiceHealth } from '@/services/apiGateway/ApiGatewayClient';

interface ServiceMetrics {
  totalServices: number;
  healthyServices: number;
  unhealthyServices: number;
  averageResponseTime: number;
  totalRequests: number;
}

export const ServiceHealthDashboard: React.FC = () => {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    totalServices: 0,
    healthyServices: 0,
    unhealthyServices: 0,
    averageResponseTime: 0,
    totalRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchServiceHealth = async () => {
    try {
      setLoading(true);
      const healthData = await apiGatewayClient.getServiceHealth();
      setServices(healthData);
      
      // Calculate metrics
      const totalServices = healthData.length;
      const healthyServices = healthData.filter(s => s.status === 'healthy').length;
      const unhealthyServices = healthData.filter(s => s.status === 'unhealthy').length;
      const averageResponseTime = healthData.reduce((sum, s) => sum + s.responseTime, 0) / totalServices;
      
      setMetrics({
        totalServices,
        healthyServices,
        unhealthyServices,
        averageResponseTime,
        totalRequests: 0 // Will be fetched from analytics
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch service health:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchServiceHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy': 
        return <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>;
      case 'degraded': 
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Degraded</Badge>;
      case 'unhealthy': 
        return <Badge className="bg-red-100 text-red-800 border-red-200">Unhealthy</Badge>;
      default: 
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Health Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring of all microservices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            onClick={fetchServiceHealth} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalServices}</div>
            <p className="text-xs text-muted-foreground">Active microservices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Services</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.healthyServices}</div>
            <p className="text-xs text-muted-foreground">
              {((metrics.healthyServices / metrics.totalServices) * 100).toFixed(1)}% healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.unhealthyServices}</div>
            <p className="text-xs text-muted-foreground">Services with issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">Average latency</p>
          </CardContent>
        </Card>
      </div>

      {/* Service List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Services ({services.length})</TabsTrigger>
          <TabsTrigger value="healthy">
            Healthy ({metrics.healthyServices})
          </TabsTrigger>
          <TabsTrigger value="issues">
            Issues ({metrics.unhealthyServices})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ServiceList services={services} />
        </TabsContent>

        <TabsContent value="healthy" className="space-y-4">
          <ServiceList services={services.filter(s => s.status === 'healthy')} />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <ServiceList services={services.filter(s => s.status !== 'healthy')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ServiceListProps {
  services: ServiceHealth[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  return (
    <div className="grid gap-4">
      {services.map((service) => (
        <Card key={service.service}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                <div>
                  <h3 className="font-medium">{service.service}</h3>
                  <p className="text-sm text-gray-500">
                    Last checked: {new Date(service.lastCheck).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{service.responseTime}ms</div>
                  <div className="text-xs text-gray-500">Response time</div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">{(service.errorRate * 100).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Error rate</div>
                </div>
                
                {getStatusBadge(service.status)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper function moved inside component scope
function getStatusColor(status: ServiceHealth['status']) {
  switch (status) {
    case 'healthy': return 'bg-green-500';
    case 'degraded': return 'bg-yellow-500';
    case 'unhealthy': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function getStatusBadge(status: ServiceHealth['status']) {
  switch (status) {
    case 'healthy': 
      return <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>;
    case 'degraded': 
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Degraded</Badge>;
    case 'unhealthy': 
      return <Badge className="bg-red-100 text-red-800 border-red-200">Unhealthy</Badge>;
    default: 
      return <Badge variant="secondary">Unknown</Badge>;
  }
}