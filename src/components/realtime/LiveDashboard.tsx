import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertTriangle,
  Activity,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWebSocket } from './WebSocketProvider';

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  category: string;
}

interface FraudAlert {
  id: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  entityType: string;
  riskScore: number;
  createdAt: string;
}

interface TrafficData {
  pageUrl: string;
  visitorCount: number;
  uniqueVisitors: number;
  bounceRate: number;
  conversionRate: number;
}

interface LiveDashboardProps {
  vendorId?: string;
  className?: string;
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({
  vendorId,
  className = ''
}) => {
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useWebSocket();

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to real-time updates
    const metricsChannel = supabase
      .channel('live-metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_sales_metrics'
        },
        (payload) => {
          updateMetric(payload.new);
        }
      )
      .subscribe();

    const fraudChannel = supabase
      .channel('fraud-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'real_time_fraud_alerts'
        },
        (payload) => {
          addFraudAlert(payload.new);
        }
      )
      .subscribe();

    const trafficChannel = supabase
      .channel('traffic-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'traffic_monitoring'
        },
        () => {
          loadTrafficData();
        }
      )
      .subscribe();

    return () => {
      metricsChannel.unsubscribe();
      fraudChannel.unsubscribe();
      trafficChannel.unsubscribe();
    };
  }, [vendorId]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadLiveMetrics(),
        loadFraudAlerts(),
        loadTrafficData()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLiveMetrics = async () => {
    try {
      let query = supabase
        .from('live_sales_metrics')
        .select('*')
        .eq('time_period', 'realtime')
        .order('recorded_at', { ascending: false })
        .limit(20);

      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform data into metrics format
      const metrics: LiveMetric[] = data.map(item => ({
        id: item.id,
        name: item.metric_name,
        value: item.metric_value,
        change: calculateChange(item.metric_data),
        trend: getTrend(item.metric_data),
        unit: getUnit(item.metric_name),
        category: item.metric_type
      }));

      setLiveMetrics(metrics);
    } catch (error) {
      console.error('Error loading live metrics:', error);
    }
  };

  const loadFraudAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('real_time_fraud_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const alerts: FraudAlert[] = data.map(item => ({
        id: item.id,
        alertType: item.alert_type,
        severity: item.severity as 'low' | 'medium' | 'high' | 'critical',
        entityType: item.entity_type,
        riskScore: item.risk_score,
        createdAt: item.created_at
      }));

      setFraudAlerts(alerts);
    } catch (error) {
      console.error('Error loading fraud alerts:', error);
    }
  };

  const loadTrafficData = async () => {
    try {
      const { data, error } = await supabase
        .from('traffic_monitoring')
        .select('*')
        .gte('recorded_hour', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_hour', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Aggregate traffic data by page
      const aggregated = data.reduce((acc: Record<string, TrafficData>, item) => {
        if (!acc[item.page_url]) {
          acc[item.page_url] = {
            pageUrl: item.page_url,
            visitorCount: 0,
            uniqueVisitors: 0,
            bounceRate: 0,
            conversionRate: 0
          };
        }
        
        acc[item.page_url].visitorCount += item.visitor_count;
        acc[item.page_url].uniqueVisitors += item.unique_visitors;
        acc[item.page_url].bounceRate = item.bounce_rate;
        acc[item.page_url].conversionRate = item.conversion_rate;
        
        return acc;
      }, {});

      setTrafficData(Object.values(aggregated));
    } catch (error) {
      console.error('Error loading traffic data:', error);
    }
  };

  const updateMetric = (newMetric: any) => {
    setLiveMetrics(prev => {
      const existingIndex = prev.findIndex(m => m.name === newMetric.metric_name);
      const metric: LiveMetric = {
        id: newMetric.id,
        name: newMetric.metric_name,
        value: newMetric.metric_value,
        change: calculateChange(newMetric.metric_data),
        trend: getTrend(newMetric.metric_data),
        unit: getUnit(newMetric.metric_name),
        category: newMetric.metric_type
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = metric;
        return updated;
      } else {
        return [metric, ...prev.slice(0, 19)];
      }
    });
  };

  const addFraudAlert = (newAlert: any) => {
    const alert: FraudAlert = {
      id: newAlert.id,
      alertType: newAlert.alert_type,
      severity: newAlert.severity,
      entityType: newAlert.entity_type,
      riskScore: newAlert.risk_score,
      createdAt: newAlert.created_at
    };

    setFraudAlerts(prev => [alert, ...prev.slice(0, 9)]);
  };

  const calculateChange = (metricData: any): number => {
    try {
      const data = typeof metricData === 'string' ? JSON.parse(metricData) : metricData;
      return data.change || 0;
    } catch {
      return 0;
    }
  };

  const getTrend = (metricData: any): 'up' | 'down' | 'stable' => {
    const change = calculateChange(metricData);
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'stable';
  };

  const getUnit = (metricName: string): string => {
    if (metricName.includes('revenue') || metricName.includes('sales')) return '৳';
    if (metricName.includes('rate') || metricName.includes('percentage')) return '%';
    if (metricName.includes('count') || metricName.includes('users')) return '';
    return '';
  };

  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'sales': return <DollarSign className="w-4 h-4" />;
      case 'users': return <Users className="w-4 h-4" />;
      case 'orders': return <ShoppingCart className="w-4 h-4" />;
      case 'traffic': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '৳') {
      return `৳${value.toLocaleString()}`;
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Live Dashboard</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Monitor</TabsTrigger>
          <TabsTrigger value="security">Security Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveMetrics.slice(0, 8).map((metric) => (
              <Card key={metric.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMetricIcon(metric.category)}
                    <span className="text-sm font-medium text-muted-foreground">
                      {metric.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                    {metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatValue(metric.value, metric.unit)}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-4">
            {trafficData.map((traffic, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground truncate">
                    {traffic.pageUrl}
                  </h3>
                  <Badge variant="outline">{traffic.visitorCount} visitors</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Unique Visitors</div>
                    <div className="font-medium">{traffic.uniqueVisitors}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Bounce Rate</div>
                    <div className="font-medium">{traffic.bounceRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversion</div>
                    <div className="font-medium">{traffic.conversionRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Performance</div>
                    <Progress value={traffic.conversionRate} className="h-2 mt-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="space-y-3">
            {fraudAlerts.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="text-green-600 mb-2">
                  <AlertTriangle className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="font-medium text-foreground mb-1">All Clear</h3>
                <p className="text-sm text-muted-foreground">
                  No active security alerts detected
                </p>
              </Card>
            ) : (
              fraudAlerts.map((alert) => (
                <Card key={alert.id} className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">{alert.alertType}</span>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Entity Type</div>
                      <div className="font-medium">{alert.entityType}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Risk Score</div>
                      <div className="font-medium">{alert.riskScore}/100</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Detected</div>
                      <div className="font-medium">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={alert.riskScore} 
                    className={`h-2 mt-3 ${
                      alert.riskScore >= 75 ? '[&>div]:bg-red-500' :
                      alert.riskScore >= 50 ? '[&>div]:bg-orange-500' :
                      '[&>div]:bg-yellow-500'
                    }`}
                  />
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};