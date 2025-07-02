import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, Activity, Server, Database, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  id: string;
  metric_category: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  target_value: number;
  threshold_warning: number;
  threshold_critical: number;
  status: 'healthy' | 'warning' | 'critical';
  recorded_at: string;
  metadata: Record<string, any>;
}

const PerformanceMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      // Mock data until database tables are created
      const mockMetrics: PerformanceMetric[] = [
        {
          id: '1',
          metric_category: 'system',
          metric_name: 'CPU Usage',
          metric_value: 65.2,
          metric_unit: '%',
          target_value: 70,
          threshold_warning: 80,
          threshold_critical: 90,
          status: 'healthy',
          recorded_at: new Date().toISOString(),
          metadata: {}
        },
        {
          id: '2',
          metric_category: 'database',
          metric_name: 'Query Response Time',
          metric_value: 125,
          metric_unit: 'ms',
          target_value: 100,
          threshold_warning: 200,
          threshold_critical: 500,
          status: 'warning',
          recorded_at: new Date().toISOString(),
          metadata: {}
        }
      ];
      
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'system': return <Server className="h-5 w-5" />;
      case 'database': return <Database className="h-5 w-5" />;
      case 'api': return <Globe className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const formatMetricValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'ms') return `${value.toFixed(0)}ms`;
    if (unit === 'MB') return `${value.toFixed(1)}MB`;
    if (unit === 'GB') return `${value.toFixed(2)}GB`;
    return `${value.toFixed(2)} ${unit}`;
  };

  const renderMetricCard = (metric: PerformanceMetric) => (
    <Card key={metric.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(metric.metric_category)}
            <CardTitle className="text-lg">{metric.metric_name}</CardTitle>
          </div>
          <Badge variant={getStatusColor(metric.status)}>
            {getStatusIcon(metric.status)}
            {metric.status}
          </Badge>
        </div>
        <CardDescription className="capitalize">{metric.metric_category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Value</p>
              <p className="text-2xl font-bold">
                {formatMetricValue(metric.metric_value, metric.metric_unit)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Target</p>
              <p className="text-lg font-semibold text-green-600">
                {formatMetricValue(metric.target_value, metric.metric_unit)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Warning</p>
              <p className="text-lg font-semibold text-yellow-600">
                {formatMetricValue(metric.threshold_warning, metric.metric_unit)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical</p>
              <p className="text-lg font-semibold text-red-600">
                {formatMetricValue(metric.threshold_critical, metric.metric_unit)}
              </p>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(metric.recorded_at).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getMetricsByCategory = (category: string) => {
    if (category === 'overview') return metrics;
    return metrics.filter(metric => metric.metric_category.toLowerCase() === category);
  };

  const getHealthSummary = () => {
    const total = metrics.length;
    const healthy = metrics.filter(m => m.status === 'healthy').length;
    const warning = metrics.filter(m => m.status === 'warning').length;
    const critical = metrics.filter(m => m.status === 'critical').length;
    
    return { total, healthy, warning, critical };
  };

  if (loading && metrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const summary = getHealthSummary();
  const filteredMetrics = getMetricsByCategory(activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Monitoring</h2>
          <p className="text-muted-foreground">Real-time system health and performance metrics</p>
        </div>
        <Button onClick={fetchMetrics} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.healthy}</div>
              <div className="text-sm text-muted-foreground">Healthy</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.warning}</div>
              <div className="text-sm text-muted-foreground">Warning</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.critical}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Metrics</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredMetrics.length > 0 ? (
              filteredMetrics.map(renderMetricCard)
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No performance metrics available for this category.</p>
                    <p className="text-sm mt-2">Metrics will appear as they are collected.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMonitoring;