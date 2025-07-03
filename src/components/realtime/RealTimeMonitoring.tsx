import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebSocket } from './WebSocketProvider';
import { Activity, Database, Server, Users, Package, CreditCard, Truck, AlertTriangle } from 'lucide-react';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: 'orders' | 'users' | 'products' | 'payments' | 'inventory' | 'system';
  timestamp: number;
}

interface SystemEvent {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
  timestamp: number;
  metadata?: any;
}

export const RealTimeMonitoring: React.FC = () => {
  const { isConnected, subscribe, sendMessage } = useWebSocket();
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [activeConnections, setActiveConnections] = useState(0);

  useEffect(() => {
    // Subscribe to real-time metrics
    const unsubscribeMetrics = subscribe('metrics_update', (message) => {
      const metric = message.payload as RealTimeMetric;
      setMetrics(prev => {
        const existing = prev.find(m => m.id === metric.id);
        if (existing) {
          return prev.map(m => m.id === metric.id ? metric : m);
        }
        return [...prev, metric];
      });
    });

    // Subscribe to system events
    const unsubscribeEvents = subscribe('system_event', (message) => {
      const event = message.payload as SystemEvent;
      setEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
    });

    // Subscribe to connection updates
    const unsubscribeConnections = subscribe('connection_update', (message) => {
      setActiveConnections(message.payload.count);
    });

    // Request initial data
    sendMessage({
      type: 'request_metrics',
      payload: { categories: ['orders', 'users', 'products', 'payments', 'inventory', 'system'] },
      timestamp: Date.now(),
      source: 'monitoring_dashboard'
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeEvents();
      unsubscribeConnections();
    };
  }, [subscribe, sendMessage]);

  const getMetricsByCategory = (category: string) => {
    return metrics.filter(m => m.category === category);
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <span className="text-success">↗ +{change}%</span>;
    if (trend === 'down') return <span className="text-destructive">↘ -{Math.abs(change)}%</span>;
    return <span className="text-muted-foreground">→ {change}%</span>;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'success':
        return <Activity className="h-4 w-4 text-success" />;
      default:
        return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  const MetricCard: React.FC<{ metric: RealTimeMetric }> = ({ metric }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
        <div className="text-xs">{getTrendIcon(metric.trend, metric.change)}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        <p className="text-xs text-muted-foreground">
          {new Date(metric.timestamp).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'} • {activeConnections} active connections
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => sendMessage({
            type: 'refresh_metrics',
            payload: {},
            timestamp: Date.now(),
            source: 'monitoring_dashboard'
          })}
        >
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.slice(0, 8).map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getMetricsByCategory('orders').map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getMetricsByCategory('users').map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getMetricsByCategory('inventory').map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getMetricsByCategory('system').map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Events</CardTitle>
              <CardDescription>Real-time system events and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {events.map(event => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      {getEventIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Badge variant={event.type === 'error' ? 'destructive' : 'default'}>
                            {event.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{event.message}</p>
                        <p className="text-xs text-muted-foreground">{event.source}</p>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No events to display
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};