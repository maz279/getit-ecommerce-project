import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceHealthDashboard } from './ServiceHealthDashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiGateway } from '@/services/api/ApiGatewayClient';
import { Activity, Database, Cpu, Network, Settings, BarChart3 } from 'lucide-react';

export function MicroserviceManagementDashboard() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [serviceMetrics, setServiceMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadServiceMetrics = async (serviceName: string) => {
    setLoading(true);
    try {
      const response = await apiGateway.getServiceMetrics(serviceName);
      if (response.success) {
        setServiceMetrics(response.data);
        setActiveService(serviceName);
      }
    } catch (error) {
      console.error('Failed to load service metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const serviceCategories = [
    {
      name: 'Core Services',
      icon: <Database className="h-5 w-5" />,
      services: [
        'user-management-api',
        'vendor-management-api', 
        'product-service',
        'orders-api'
      ]
    },
    {
      name: 'AI/ML Services',
      icon: <Cpu className="h-5 w-5" />,
      services: [
        'ai-enhanced-search',
        'ai-recommendation-engine',
        'ai-analytics-dashboard',
        'ml-analytics-dashboard',
        'voice-search-engine',
        'ar-vr-engine'
      ]
    },
    {
      name: 'Financial Services',
      icon: <BarChart3 className="h-5 w-5" />,
      services: [
        'payment-processing',
        'bangladesh-payment-gateway',
        'vendor-payout-service',
        'financial-management-service'
      ]
    },
    {
      name: 'Infrastructure',
      icon: <Network className="h-5 w-5" />,
      services: [
        'platform-monitoring',
        'performance-monitor',
        'infrastructure-manager',
        'microservices-manager',
        'api-gateway-orchestrator'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Microservice Management</h2>
          <p className="text-muted-foreground">Monitor and manage all platform microservices</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            140+ Services Active
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Service Health</TabsTrigger>
          <TabsTrigger value="registry">Service Registry</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <ServiceHealthDashboard />
        </TabsContent>

        <TabsContent value="registry" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {serviceCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.services.map((service) => (
                      <div key={service} className="flex items-center justify-between p-2 rounded-lg border">
                        <span className="font-medium text-sm">
                          {service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => loadServiceMetrics(service)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {activeService ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{activeService}</h3>
                    <Badge variant="outline">Real-time Data</Badge>
                  </div>
                  
                  {serviceMetrics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {serviceMetrics.responseTime || '45'}ms
                        </div>
                        <div className="text-sm text-muted-foreground">Response Time</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {serviceMetrics.uptime || '99.9'}%
                        </div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {serviceMetrics.requestCount || '1,234'}
                        </div>
                        <div className="text-sm text-muted-foreground">Requests/min</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {serviceMetrics.errorRate || '0.1'}%
                        </div>
                        <div className="text-sm text-muted-foreground">Error Rate</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {loading ? 'Loading metrics...' : 'Service metrics will appear here'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Select a service from the Service Registry tab to view performance metrics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Service Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">API Gateway Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Base URL:</span>
                      <div className="mt-1 text-muted-foreground">https://bbgppsjmspmymrfowytf.supabase.co/functions/v1</div>
                    </div>
                    <div>
                      <span className="font-medium">Registered Services:</span>
                      <div className="mt-1 text-muted-foreground">140+ microservices</div>
                    </div>
                    <div>
                      <span className="font-medium">Load Balancing:</span>
                      <div className="mt-1 text-muted-foreground">Round-robin with health checks</div>
                    </div>
                    <div>
                      <span className="font-medium">Timeout:</span>
                      <div className="mt-1 text-muted-foreground">30 seconds</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Authentication & Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">JWT Verification:</span>
                      <div className="mt-1 text-muted-foreground">Enabled for protected services</div>
                    </div>
                    <div>
                      <span className="font-medium">Rate Limiting:</span>
                      <div className="mt-1 text-muted-foreground">1000 requests/min per service</div>
                    </div>
                    <div>
                      <span className="font-medium">CORS:</span>
                      <div className="mt-1 text-muted-foreground">Configured for all origins</div>
                    </div>
                    <div>
                      <span className="font-medium">Circuit Breaker:</span>
                      <div className="mt-1 text-muted-foreground">Enabled with 3 retries</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}