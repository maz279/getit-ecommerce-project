import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { RefreshCw, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export function ServiceHealthDashboard() {
  const { servicesHealth: services, loading, error, refreshHealthMetrics: refreshHealth } = useServiceHealth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <Clock className="h-4 w-4" />;
      case 'unhealthy': return <AlertCircle className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const groupedServices = (services || []).reduce((groups, service) => {
    let category = 'Other';
    
    if (service.service_name.includes('ai-') || service.service_name.includes('ml-')) {
      category = 'AI/ML Services';
    } else if (service.service_name.includes('payment') || service.service_name.includes('financial')) {
      category = 'Financial Services';
    } else if (service.service_name.includes('infrastructure') || service.service_name.includes('platform') || service.service_name.includes('performance')) {
      category = 'Infrastructure';
    } else if (service.service_name.includes('analytics') || service.service_name.includes('business')) {
      category = 'Business Intelligence';
    } else if (service.service_name.includes('user') || service.service_name.includes('vendor') || service.service_name.includes('product')) {
      category = 'Core Services';
    }
    
    if (!groups[category]) groups[category] = [];
    groups[category].push(service);
    return groups;
  }, {} as Record<string, typeof services>);

  const overallHealth = services.length > 0 ? {
    healthy: services.filter(s => s.status === 'healthy').length,
    total: services.length,
    averageResponseTime: services.reduce((sum, s) => sum + (s.response_time_avg || 0), 0) / services.length
  } : null;

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading service health...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error loading service health: {error}</span>
          </div>
          <Button onClick={refreshHealth} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Health Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Platform Health Overview</CardTitle>
          <Button onClick={refreshHealth} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {overallHealth && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {overallHealth.healthy}/{overallHealth.total}
                </div>
                <div className="text-sm text-muted-foreground">Services Healthy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(overallHealth.averageResponseTime)}ms
                </div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((overallHealth.healthy / overallHealth.total) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Groups */}
      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryServices.map((service) => (
                <div key={service.service_name} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {service.service_name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <Badge variant="secondary" className={`${getStatusColor(service.status)} text-white`}>
                      {getStatusIcon(service.status)}
                      <span className="ml-1">{service.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {service.response_time_avg && (
                      <div>Response: {service.response_time_avg}ms</div>
                    )}
                    {service.uptime_percentage !== undefined && (
                      <div>Uptime: {Math.round(service.uptime_percentage)}%</div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last check: {new Date(service.last_health_check).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}