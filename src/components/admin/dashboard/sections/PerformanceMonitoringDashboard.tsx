import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity, Database, Zap, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PerformanceMetrics {
  timestamp: string;
  performance: {
    avgResponseTime: number;
    slowQueries: number;
    cacheHitRate: number;
    totalQueries: number;
  };
  realtime: {
    activeConnections: number;
    messagesPerMinute: number;
  };
}

interface SystemHealth {
  status: string;
  database: any;
  timestamp: string;
  uptime: string;
  services: {
    api: string;
    database: string;
    storage: string;
    realtime: string;
  };
}

interface AlertsSummary {
  active: number;
  critical: number;
  warning: number;
  alerts: any[];
}

export const PerformanceMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<AlertsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch performance metrics
      const { data: metricsData } = await supabase.functions.invoke('performance-monitor', {
        body: { action: 'metrics' }
      });

      // Fetch system health
      const { data: healthData } = await supabase.functions.invoke('performance-monitor', {
        body: { action: 'health' }
      });

      // Fetch alerts
      const { data: alertsData } = await supabase.functions.invoke('performance-monitor', {
        body: { action: 'alerts' }
      });

      setMetrics(metricsData);
      setHealth(healthData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch monitoring data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'critical': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Monitoring</h2>
        <Button onClick={fetchData} disabled={loading} size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Overall Status</p>
                <Badge className={getStatusColor(health?.status || 'unknown')}>
                  {health?.status || 'Loading...'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Database</p>
                <Badge className={getStatusColor(health?.services?.database || 'unknown')}>
                  {health?.services?.database || 'Loading...'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-lg font-bold">
                  {metrics?.performance?.avgResponseTime || 0}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Active Alerts</p>
                <p className="text-lg font-bold text-warning">
                  {alerts?.active || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Query Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Queries (1h)</span>
              <span className="font-bold">{metrics?.performance?.totalQueries || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Slow Queries</span>
              <span className="font-bold text-warning">{metrics?.performance?.slowQueries || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Cache Hit Rate</span>
              <span className="font-bold text-success">{metrics?.performance?.cacheHitRate || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Active Connections</span>
              <span className="font-bold">{metrics?.realtime?.activeConnections || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Messages/Min</span>
              <span className="font-bold">{metrics?.realtime?.messagesPerMinute || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime</span>
              <span className="font-bold text-success">{health?.uptime || '0%'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {alerts && alerts.active > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Active Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{alert.summary}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                  <Badge className={getStatusColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {health?.services && Object.entries(health.services).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="capitalize">{service}</span>
                <Badge className={getStatusColor(status as string)}>
                  {status as string}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};