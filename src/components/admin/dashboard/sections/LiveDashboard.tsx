import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  Zap,
  RefreshCw,
  Wifi,
  WifiOff,
  MapPin,
  Package
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LiveMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface RealtimeEvent {
  id: string;
  type: 'order' | 'user' | 'payment' | 'product_view';
  message: string;
  timestamp: Date;
  location?: string;
  amount?: number;
}

export const LiveDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupRealtimeConnection();
    loadInitialData();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadInitialData, 5000); // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const setupRealtimeConnection = () => {
    const channel = supabase
      .channel('live-dashboard')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'real_time_metrics'
        },
        (payload) => {
          handleRealtimeUpdate(payload.new);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleRealtimeUpdate = (newMetric: any) => {
    const event: RealtimeEvent = {
      id: newMetric.id,
      type: newMetric.metric_type,
      message: generateEventMessage(newMetric),
      timestamp: new Date(),
      location: newMetric.metric_value?.location,
      amount: newMetric.metric_value?.amount
    };

    setRealtimeEvents(prev => {
      const updated = [event, ...prev.slice(0, 49)]; // Keep last 50 events
      return updated;
    });

    // Scroll to top of events
    if (eventsRef.current) {
      eventsRef.current.scrollTop = 0;
    }

    // Update metrics
    updateMetricsFromEvent(newMetric);
  };

  const generateEventMessage = (metric: any): string => {
    switch (metric.metric_type) {
      case 'sales':
        return `New order placed - ৳${metric.metric_value?.amount?.toLocaleString()}`;
      case 'inventory':
        return `Stock updated for product ${metric.metric_value?.product_id}`;
      case 'user':
        return `New user registered from ${metric.metric_value?.location || 'Bangladesh'}`;
      case 'payment':
        return `Payment processed - ${metric.metric_value?.method}`;
      default:
        return `System update: ${metric.metric_key}`;
    }
  };

  const updateMetricsFromEvent = (metric: any) => {
    setMetrics(prev => {
      return prev.map(m => {
        if (m.label === 'Live Orders' && metric.metric_type === 'sales') {
          return { ...m, value: (Number(m.value) + 1).toString(), trend: 'up' as const };
        }
        if (m.label === 'Revenue Today' && metric.metric_type === 'sales') {
          const currentRevenue = Number(m.value.toString().replace(/[^0-9]/g, ''));
          const newRevenue = currentRevenue + (metric.metric_value?.amount || 0);
          return { ...m, value: `৳${newRevenue.toLocaleString()}`, trend: 'up' as const };
        }
        return m;
      });
    });
  };

  const loadInitialData = async () => {
    try {
      // Simulate loading real-time metrics
      const mockMetrics: LiveMetric[] = [
        {
          label: 'Active Users',
          value: Math.floor(Math.random() * 1000) + 2000,
          change: Math.floor(Math.random() * 20) - 10,
          trend: 'up',
          icon: Users,
          color: 'text-blue-500'
        },
        {
          label: 'Live Orders',
          value: Math.floor(Math.random() * 50) + 120,
          change: Math.floor(Math.random() * 10),
          trend: 'up',
          icon: ShoppingCart,
          color: 'text-green-500'
        },
        {
          label: 'Revenue Today',
          value: `৳${(Math.floor(Math.random() * 100000) + 500000).toLocaleString()}`,
          change: Math.floor(Math.random() * 15) + 5,
          trend: 'up',
          icon: DollarSign,
          color: 'text-yellow-500'
        },
        {
          label: 'Page Views',
          value: Math.floor(Math.random() * 5000) + 15000,
          change: Math.floor(Math.random() * 25) - 5,
          trend: 'up',
          icon: Eye,
          color: 'text-purple-500'
        },
        {
          label: 'Response Time',
          value: `${Math.floor(Math.random() * 50) + 100}ms`,
          change: Math.floor(Math.random() * 10) - 5,
          trend: 'stable',
          icon: Zap,
          color: 'text-orange-500'
        },
        {
          label: 'Products Viewed',
          value: Math.floor(Math.random() * 500) + 1200,
          change: Math.floor(Math.random() * 15),
          trend: 'up',
          icon: Package,
          color: 'text-indigo-500'
        }
      ];

      setMetrics(mockMetrics);
      setLastUpdate(new Date());

      // Simulate some new events
      if (Math.random() > 0.7) {
        const eventTypes = ['order', 'user', 'payment', 'product_view'] as const;
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        const newEvent: RealtimeEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: randomType,
          message: generateMockEventMessage(randomType),
          timestamp: new Date(),
          location: getMockLocation(),
          amount: randomType === 'order' ? Math.floor(Math.random() * 5000) + 500 : undefined
        };

        setRealtimeEvents(prev => [newEvent, ...prev.slice(0, 49)]);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const generateMockEventMessage = (type: string): string => {
    const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    switch (type) {
      case 'order':
        return `New order from ${location} - ৳${(Math.floor(Math.random() * 5000) + 500).toLocaleString()}`;
      case 'user':
        return `New user registered from ${location}`;
      case 'payment':
        return `Payment completed via bKash from ${location}`;
      case 'product_view':
        return `Product viewed from ${location}`;
      default:
        return `System event from ${location}`;
    }
  };

  const getMockLocation = (): string => {
    const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'order':
        return ShoppingCart;
      case 'user':
        return Users;
      case 'payment':
        return DollarSign;
      case 'product_view':
        return Eye;
      default:
        return Activity;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-green-500';
      case 'user':
        return 'text-blue-500';
      case 'payment':
        return 'text-yellow-500';
      case 'product_view':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Dashboard</h1>
          <p className="text-muted-foreground">Real-time business activity monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isConnected ? 'default' : 'destructive'} className="flex items-center gap-1">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Activity;
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                {metric.change !== undefined && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendIcon className={`h-3 w-3 mr-1 ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`} />
                    {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                  </div>
                )}
              </CardContent>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-primary/5 rounded-full -mr-10 -mt-10" />
            </Card>
          );
        })}
      </div>

      {/* Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Real-time events as they happen</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              ref={eventsRef}
              className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
            >
              {realtimeEvents.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Waiting for live events...</p>
                </div>
              ) : (
                realtimeEvents.map((event) => {
                  const EventIcon = getEventIcon(event.type);
                  const eventColor = getEventColor(event.type);
                  
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-in slide-in-from-top-2 duration-300">
                      <div className={`p-2 rounded-full bg-background ${eventColor}`}>
                        <EventIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {event.timestamp.toLocaleTimeString()}
                          {event.location && (
                            <>
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </>
                          )}
                        </div>
                      </div>
                      {event.amount && (
                        <Badge variant="outline" className="ml-auto">
                          ৳{event.amount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Gateway</span>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Service</span>
              <Badge variant="default">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Notification Service</span>
              <Badge variant="secondary">Degraded</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Search Engine</span>
              <Badge variant="default">Operational</Badge>
            </div>
            
            <Alert className="mt-4">
              <Activity className="h-4 w-4" />
              <AlertDescription>
                All critical services are operational. Minor issues with notification delivery.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};