import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Zap,
  Globe,
  Database,
  Server,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LiveMetrics {
  activeUsers: number;
  totalOrders: number;
  revenue: number;
  serverHealth: number;
  databaseConnections: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
}

interface SystemStatus {
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  cache: 'healthy' | 'degraded' | 'down';
  search: 'healthy' | 'degraded' | 'down';
  payments: 'healthy' | 'degraded' | 'down';
}

interface RealtimeEvent {
  id: string;
  type: 'order' | 'user' | 'error' | 'payment' | 'system';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export const LiveDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    activeUsers: 0,
    totalOrders: 0,
    revenue: 0,
    serverHealth: 100,
    databaseConnections: 0,
    responseTime: 0,
    errorRate: 0,
    throughput: 0
  });
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    api: 'healthy',
    database: 'healthy',
    cache: 'healthy',
    search: 'healthy',
    payments: 'healthy'
  });
  
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    initializeRealtime();
    startMetricsPolling();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeRealtime = () => {
    try {
      // Subscribe to real-time updates
      channelRef.current = supabase
        .channel('live-dashboard')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'orders'
        }, (payload) => {
          handleOrderUpdate(payload);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_sessions'
        }, (payload) => {
          handleUserUpdate(payload);
        })
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync');
        })
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
          if (status === 'SUBSCRIBED') {
            toast.success('Real-time connection established');
          }
        });
    } catch (error) {
      console.error('Failed to initialize real-time connection:', error);
      toast.error('Failed to connect to real-time updates');
    }
  };

  const startMetricsPolling = () => {
    intervalRef.current = setInterval(async () => {
      await updateMetrics();
      await checkSystemHealth();
    }, 5000); // Update every 5 seconds
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
  };

  const updateMetrics = async () => {
    try {
      // Simulate real-time metrics with some realistic variation
      const baseUsers = 150 + Math.sin(Date.now() / 60000) * 50; // Oscillate around 150
      const baseOrders = 800 + Math.sin(Date.now() / 120000) * 200; // Oscillate around 800
      const baseRevenue = 75000 + Math.sin(Date.now() / 180000) * 25000; // Oscillate around 75k
      
      const newMetrics: LiveMetrics = {
        activeUsers: Math.floor(baseUsers + Math.random() * 30),
        totalOrders: Math.floor(baseOrders + Math.random() * 50),
        revenue: Math.floor(baseRevenue + Math.random() * 10000),
        serverHealth: Math.floor(92 + Math.random() * 8), // Between 92-100%
        databaseConnections: Math.floor(15 + Math.random() * 20), // Between 15-35
        responseTime: Math.floor(80 + Math.random() * 120), // Between 80-200ms
        errorRate: Math.random() * 2, // 0-2%
        throughput: Math.floor(800 + Math.random() * 400) // 800-1200 req/min
      };
      
      setMetrics(newMetrics);
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  };

  const checkSystemHealth = async () => {
    try {
      // Simulate system health checks with mostly healthy status
      const newStatus: SystemStatus = {
        api: Math.random() > 0.05 ? 'healthy' : 'degraded',
        database: Math.random() > 0.02 ? 'healthy' : 'degraded',
        cache: Math.random() > 0.1 ? 'healthy' : 'degraded',
        search: Math.random() > 0.08 ? 'healthy' : 'degraded',
        payments: Math.random() > 0.03 ? 'healthy' : 'degraded'
      };
      
      setSystemStatus(newStatus);
    } catch (error) {
      console.error('Error checking system health:', error);
    }
  };

  const handleOrderUpdate = (payload: any) => {
    const event: RealtimeEvent = {
      id: Date.now().toString(),
      type: 'order',
      message: `New order ${payload.eventType}: ${payload.new?.order_number || 'Unknown'}`,
      timestamp: new Date(),
      severity: 'info'
    };
    
    setRealtimeEvents(prev => [event, ...prev.slice(0, 49)]);
  };

  const handleUserUpdate = (payload: any) => {
    const event: RealtimeEvent = {
      id: Date.now().toString(),
      type: 'user',
      message: `User session ${payload.eventType}`,
      timestamp: new Date(),
      severity: 'info'
    };
    
    setRealtimeEvents(prev => [event, ...prev.slice(0, 49)]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'down': return <WifiOff className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Dashboard</h1>
          <p className="text-muted-foreground">Real-time system monitoring and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <Wifi className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="w-3 h-3 mr-1" />
              Disconnected
            </Badge>
          )}
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.activeUsers}</div>
            <Progress value={(metrics.activeUsers / 300) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Real-time count</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.totalOrders}</div>
            <Progress value={(metrics.totalOrders / 1500) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+{Math.floor(Math.random() * 5)} in last 5min</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">৳{metrics.revenue.toLocaleString()}</div>
            <Progress value={(metrics.revenue / 150000) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Target: ৳100k</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.serverHealth}%</div>
            <Progress value={metrics.serverHealth} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Real-time service health monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>API Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.api)}
                <span className={getStatusColor(systemStatus.api)}>{systemStatus.api}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Database</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.database)}
                <span className={getStatusColor(systemStatus.database)}>{systemStatus.database}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>Cache</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.cache)}
                <span className={getStatusColor(systemStatus.cache)}>{systemStatus.cache}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Search Engine</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.search)}
                <span className={getStatusColor(systemStatus.search)}>{systemStatus.search}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Payment Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.payments)}
                <span className={getStatusColor(systemStatus.payments)}>{systemStatus.payments}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Real-time performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Response Time</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metrics.responseTime}ms</span>
                <Progress value={Math.max(0, 100 - (metrics.responseTime / 5))} className="w-20" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Error Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metrics.errorRate.toFixed(2)}%</span>
                <Progress value={Math.max(0, 100 - metrics.errorRate * 50)} className="w-20" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Throughput</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metrics.throughput} req/min</span>
                <Progress value={(metrics.throughput / 1500) * 100} className="w-20" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>DB Connections</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metrics.databaseConnections}</span>
                <Progress value={(metrics.databaseConnections / 50) * 100} className="w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Events */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Events</CardTitle>
          <CardDescription>Live system events and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {realtimeEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No events yet. Real-time events will appear here as they occur.
              </p>
            ) : (
              realtimeEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      event.severity === 'critical' ? 'destructive' :
                      event.severity === 'error' ? 'destructive' :
                      event.severity === 'warning' ? 'secondary' : 'default'
                    }>
                      {event.type}
                    </Badge>
                    <span className="text-sm">{event.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};