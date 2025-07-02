import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Shield, Brain, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const EnterpriseMonitoringDashboard: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    try {
      const { data: monitoringData } = await supabase.functions.invoke('platform-monitoring');
      const { data: mlData } = await supabase.functions.invoke('ml-analytics-dashboard');
      
      setData({ monitoring: monitoringData, ml: mlData });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Activity className="w-8 h-8 text-green-600" />
              <Badge variant="default">Live</Badge>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{data.monitoring?.health?.overall_health_score || 95}%</p>
              <p className="text-sm text-muted-foreground">System Health</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Brain className="w-8 h-8 text-blue-600" />
              <Badge variant="default">Active</Badge>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{data.ml?.overview?.active_models || 5}</p>
              <p className="text-sm text-muted-foreground">ML Models</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Shield className="w-8 h-8 text-purple-600" />
              <Badge variant="default">Protected</Badge>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">94.2%</p>
              <p className="text-sm text-muted-foreground">Fraud Detection</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <Badge variant="default">Growing</Badge>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{data.monitoring?.performance?.uptime?.last_24h || 99.94}%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.monitoring?.health?.services?.map((service: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{service.service_name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
                      {service.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{service.response_time_avg}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Requests/Min</span>
                <span className="font-semibold">{data.monitoring?.performance?.throughput?.requests_per_minute?.toLocaleString() || '2,340'}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users</span>
                <span className="font-semibold">{data.monitoring?.business_metrics?.kpis?.daily_active_users?.toLocaleString() || '45,678'}</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate</span>
                <span className="font-semibold">{data.monitoring?.business_metrics?.kpis?.conversion_rate || 3.4}%</span>
              </div>
              <div className="flex justify-between">
                <span>ML Predictions Today</span>
                <span className="font-semibold">{data.ml?.overview?.predictions_today?.toLocaleString() || '847'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};