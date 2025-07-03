/**
 * API Gateway Management Interface
 * Manage routing, load balancing, and traffic control
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Activity, 
  Settings, 
  BarChart3,
  Route,
  Shield,
  Zap,
  Timer
} from 'lucide-react';
import { apiGatewayClient } from '@/services/apiGateway/ApiGatewayClient';

interface RouteConfig {
  path: string;
  services: string[];
  strategy: string;
  requestCount: number;
  successRate: number;
  avgResponseTime: number;
}

interface TrafficMetrics {
  totalRequests: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  activeConnections: number;
}

export const ApiGatewayManagement: React.FC = () => {
  const [routes, setRoutes] = useState<RouteConfig[]>([]);
  const [metrics, setMetrics] = useState<TrafficMetrics>({
    totalRequests: 0,
    requestsPerSecond: 0,
    averageResponseTime: 0,
    errorRate: 0,
    activeConnections: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGatewayData();
    const interval = setInterval(fetchGatewayData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchGatewayData = async () => {
    try {
      setLoading(true);
      
      // Fetch service registry and routes
      const registry = await apiGatewayClient.getServiceRegistry();
      
      // Mock route data for demonstration
      const mockRoutes: RouteConfig[] = [
        {
          path: '/products',
          services: ['product-service', 'enhanced-products-api'],
          strategy: 'round-robin',
          requestCount: 15420,
          successRate: 99.2,
          avgResponseTime: 145
        },
        {
          path: '/orders',
          services: ['order-service', 'orders-api'],
          strategy: 'least-connections',
          requestCount: 8930,
          successRate: 98.8,
          avgResponseTime: 89
        },
        {
          path: '/payments',
          services: ['payment-processing', 'bangladesh-payment-gateway'],
          strategy: 'weighted',
          requestCount: 5240,
          successRate: 99.9,
          avgResponseTime: 201
        },
        {
          path: '/analytics',
          services: ['analytics-engine', 'advanced-analytics-service'],
          strategy: 'round-robin',
          requestCount: 3670,
          successRate: 97.5,
          avgResponseTime: 320
        }
      ];

      setRoutes(mockRoutes);

      // Calculate overall metrics
      const totalRequests = mockRoutes.reduce((sum, route) => sum + route.requestCount, 0);
      const avgResponseTime = mockRoutes.reduce((sum, route) => 
        sum + (route.avgResponseTime * route.requestCount), 0) / totalRequests;
      const avgSuccessRate = mockRoutes.reduce((sum, route) => 
        sum + (route.successRate * route.requestCount), 0) / totalRequests;

      setMetrics({
        totalRequests,
        requestsPerSecond: Math.floor(totalRequests / 3600), // Rough calculation
        averageResponseTime: avgResponseTime,
        errorRate: 100 - avgSuccessRate,
        activeConnections: 1250
      });

    } catch (error) {
      console.error('Failed to fetch gateway data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Gateway Management</h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage traffic routing and load balancing
          </p>
        </div>
        <Button onClick={fetchGatewayData} disabled={loading}>
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests/Second</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.requestsPerSecond}</div>
            <p className="text-xs text-muted-foreground">Current throughput</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">Average latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Failed requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeConnections}</div>
            <p className="text-xs text-muted-foreground">Current connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Route Management */}
      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <div className="grid gap-4">
            {routes.map((route) => (
              <Card key={route.path}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Route className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{route.path}</CardTitle>
                        <CardDescription>
                          Strategy: {route.strategy} | Services: {route.services.length}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={route.successRate > 99 ? "default" : "destructive"}
                    >
                      {route.successRate.toFixed(1)}% Success
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Requests</div>
                      <div className="text-2xl font-bold">{route.requestCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Avg Response</div>
                      <div className="text-2xl font-bold">{route.avgResponseTime}ms</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Success Rate</div>
                      <div className="flex items-center gap-2">
                        <Progress value={route.successRate} className="flex-1" />
                        <span className="text-sm font-medium">{route.successRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Target Services</div>
                    <div className="flex flex-wrap gap-2">
                      {route.services.map((service) => (
                        <Badge key={service} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Analysis</CardTitle>
              <CardDescription>Real-time traffic patterns and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  Traffic visualization charts will be implemented here
                  <br />
                  (Integration with analytics services)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gateway Configuration</CardTitle>
              <CardDescription>Manage rate limiting, CORS, and security policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  Configuration interface will be implemented here
                  <br />
                  (Rate limiting, security policies, CORS settings)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};