/**
 * Live Real-time Monitoring Dashboard
 * Comprehensive real-time system monitoring
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRealtime } from '@/hooks/useRealtime';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { Activity, TrendingUp, Users, ShoppingCart, AlertTriangle, Zap } from 'lucide-react';

interface LiveMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit?: string;
}

interface RealtimeEvent {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
  service?: string;
}

export const LiveDashboard: React.FC = () => {
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const { addEventListener, removeEventListener } = useRealtime();
  const { systemHealth, servicesHealth } = useServiceHealth(10000); // 10 second refresh

  useEffect(() => {
    // Subscribe to real-time metrics
    const metricsUnsubscribe = subscribe('system-metrics', (data: any) => {
      if (data.type === 'metrics-update') {
        setLiveMetrics(data.metrics);
      }
    });

    // Subscribe to real-time events
    const eventsUnsubscribe = subscribe('system-events', (data: any) => {
      if (data.type === 'system-event') {
        setRealtimeEvents(prev => [data.event, ...prev.slice(0, 99)]); // Keep last 100 events
      }
    });

    // Subscribe to connection status
    const statusUnsubscribe = subscribe('connection-status', (data: any) => {
      setIsConnected(data.connected);
    });

    // Generate mock real-time data
    const mockDataInterval = setInterval(() => {
      generateMockMetrics();
      generateMockEvents();
    }, 5000);

    setIsConnected(true);

    return () => {
      metricsUnsubscribe();
      eventsUnsubscribe();
      statusUnsubscribe();
      clearInterval(mockDataInterval);
    };
  }, [subscribe, unsubscribe]);

  const generateMockMetrics = () => {
    const mockMetrics: LiveMetric[] = [
      {
        name: 'Active Users',
        value: Math.floor(Math.random() * 1000) + 500,
        change: (Math.random() - 0.5) * 20,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        unit: 'users'
      },
      {
        name: 'Orders/Min',
        value: Math.floor(Math.random() * 50) + 10,
        change: (Math.random() - 0.5) * 10,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        unit: 'orders'
      },
      {
        name: 'Revenue/Hr',
        value: Math.floor(Math.random() * 10000) + 5000,
        change: (Math.random() - 0.5) * 1000,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        unit: 'BDT'
      },
      {
        name: 'Response Time',
        value: Math.floor(Math.random() * 200) + 50,
        change: (Math.random() - 0.5) * 50,
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better for response time
        unit: 'ms'
      },
      {
        name: 'Error Rate',
        value: Math.random() * 2,
        change: (Math.random() - 0.5) * 1,
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better for error rate
        unit: '%'
      },
      {
        name: 'CPU Usage',
        value: Math.random() * 80 + 10,
        change: (Math.random() - 0.5) * 10,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        unit: '%'
      }
    ];

    setLiveMetrics(mockMetrics);
  };

  const generateMockEvents = () => {
    const eventTypes = [
      { type: 'order', message: 'New order placed', severity: 'info' as const },
      { type: 'user', message: 'User registration', severity: 'info' as const },
      { type: 'payment', message: 'Payment processed', severity: 'info' as const },
      { type: 'error', message: 'Service timeout detected', severity: 'warning' as const },
      { type: 'alert', message: 'High CPU usage detected', severity: 'warning' as const },
      { type: 'critical', message: 'Service down', severity: 'error' as const }
    ];

    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const newEvent: RealtimeEvent = {
      id: Date.now().toString(),
      type: randomEvent.type,
      message: randomEvent.message,
      timestamp: new Date().toISOString(),
      severity: randomEvent.severity,
      service: `service-${Math.floor(Math.random() * 10) + 1}`
    };

    setRealtimeEvents(prev => [newEvent, ...prev.slice(0, 99)]);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Dashboard</h1>
          <p className="text-muted-foreground">Real-time system monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            <Activity className="h-3 w-3 mr-1" />
            {isConnected ? 'Live' : 'Disconnected'}
          </Badge>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveMetrics.map((metric) => (
          <Card key={metric.name} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">
                    {typeof metric.value === 'number' && metric.value < 1 
                      ? metric.value.toFixed(2) 
                      : Math.round(metric.value).toLocaleString()}
                    {metric.unit && <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-xs ${
                      metric.change > 0 ? 'text-success' : metric.change < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary opacity-50" />
          </Card>
        ))}
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Live Events</TabsTrigger>
          <TabsTrigger value="services">Service Status</TabsTrigger>
          <TabsTrigger value="analytics">Real-time Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Live Events Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {realtimeEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                        {event.service && <span>• {event.service}</span>}
                        <span>• {event.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesHealth.map((service) => (
              <Card key={service.service_name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{service.service_name}</CardTitle>
                    <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Health Score</span>
                      <span className="font-medium">{service.health_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span className="font-medium">{service.response_time_avg}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-medium">{service.error_rate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Sessions</span>
                    <span className="text-lg font-bold">{liveMetrics.find(m => m.name === 'Active Users')?.value || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Page Views/Min</span>
                    <span className="text-lg font-bold">{Math.floor(Math.random() * 500) + 100}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bounce Rate</span>
                    <span className="text-lg font-bold">{(Math.random() * 30 + 20).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Sales Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Orders/Hour</span>
                    <span className="text-lg font-bold">{Math.floor(Math.random() * 100) + 50}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="text-lg font-bold">{(Math.random() * 5 + 2).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cart Abandonment</span>
                    <span className="text-lg font-bold">{(Math.random() * 20 + 60).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};