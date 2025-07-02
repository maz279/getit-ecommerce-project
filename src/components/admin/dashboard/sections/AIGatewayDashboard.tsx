import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Activity, Shield, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";

interface RoutingAnalytics {
  id: string;
  route_path: string;
  selected_service: string;
  confidence_score: number;
  response_time_ms: number;
  success_rate: number;
  created_at: string;
}

interface AnomalyEvent {
  id: string;
  event_type: string;
  anomaly_score: number;
  severity_level: string;
  affected_service: string;
  threat_classification: string;
  created_at: string;
}

interface ScalingMetric {
  id: string;
  service_name: string;
  current_instances: number;
  recommended_instances: number;
  confidence_level: number;
  scaling_trigger_reason: string;
  created_at: string;
}

export const AIGatewayDashboard: React.FC = () => {
  const [routingData, setRoutingData] = useState<RoutingAnalytics[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>([]);
  const [scalingMetrics, setScalingMetrics] = useState<ScalingMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [routingResponse, anomalyResponse, scalingResponse] = await Promise.all([
        supabase
          .from('ai_routing_analytics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('anomaly_detection_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('predictive_scaling_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (routingResponse.data) setRoutingData(routingResponse.data);
      if (anomalyResponse.data) setAnomalies(anomalyResponse.data);
      if (scalingResponse.data) setScalingMetrics(scalingResponse.data);
    } catch (error) {
      console.error('Error fetching AI Gateway data:', error);
      toast.error('Failed to fetch AI Gateway data');
    } finally {
      setLoading(false);
    }
  };

  const testAIRouter = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-intelligent-router', {
        body: {
          route_path: '/api/products',
          services: ['product-service-1', 'product-service-2', 'product-service-3'],
          user_context: { country: 'BD', user_type: 'customer' }
        }
      });

      if (error) throw error;
      toast.success(`AI Router selected: ${data.selected_service}`);
      fetchData();
    } catch (error) {
      console.error('AI Router test failed:', error);
      toast.error('AI Router test failed');
    }
  };

  const testAnomalyDetector = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-anomaly-detector', {
        body: {
          request_data: {
            requests_per_minute: 75,
            user_agent: 'bot-crawler',
            payload_size: 1000,
            query_params: { search: 'normal query' }
          },
          user_context: { country: 'BD', ip: '192.168.1.1' },
          endpoint_info: { service_name: 'api-gateway', endpoint_path: '/api/test' }
        }
      });

      if (error) throw error;
      toast.success(`Anomaly detection result: ${data.recommended_action}`);
      fetchData();
    } catch (error) {
      console.error('Anomaly detector test failed:', error);
      toast.error('Anomaly detector test failed');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Gateway Dashboard</h1>
          <p className="text-muted-foreground">AI-powered request routing, scaling, and security</p>
        </div>
        <div className="space-x-2">
          <Button onClick={testAIRouter} variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            Test AI Router
          </Button>
          <Button onClick={testAnomalyDetector} variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Test Anomaly Detector
          </Button>
        </div>
      </div>

      <Tabs defaultValue="routing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routing">
            <Brain className="h-4 w-4 mr-2" />
            Intelligent Routing
          </TabsTrigger>
          <TabsTrigger value="scaling">
            <TrendingUp className="h-4 w-4 mr-2" />
            Predictive Scaling
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Anomaly Detection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence Score</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {routingData.length > 0 
                    ? Math.round(routingData.reduce((sum, r) => sum + r.confidence_score, 0) / routingData.length)
                    : 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {routingData.length > 0 
                    ? Math.round(routingData.reduce((sum, r) => sum + r.response_time_ms, 0) / routingData.length)
                    : 0}ms
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {routingData.length > 0 
                    ? Math.round(routingData.reduce((sum, r) => sum + r.success_rate, 0) / routingData.length * 100)
                    : 100}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Routing Decisions</CardTitle>
              <CardDescription>AI-powered service selection and routing analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routingData.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{route.route_path}</p>
                      <p className="text-sm text-muted-foreground">
                        Routed to: {route.selected_service}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="outline">
                        {Math.round(route.confidence_score)}% confidence
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {route.response_time_ms}ms
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scaling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Scaling Recommendations</CardTitle>
              <CardDescription>ML-powered auto-scaling decisions and predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scalingMetrics.map((metric) => (
                  <div key={metric.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{metric.service_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {metric.scaling_trigger_reason.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {Math.round(metric.confidence_level * 100)}% confidence
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Instances</p>
                        <p className="text-lg font-semibold">{metric.current_instances}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Recommended</p>
                        <p className="text-lg font-semibold">{metric.recommended_instances}</p>
                      </div>
                    </div>
                    
                    <Progress 
                      value={metric.confidence_level * 100} 
                      className="mt-3"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {anomalies.filter(a => a.severity_level === 'critical' || a.severity_level === 'high').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Anomalies</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{anomalies.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Anomalies</CardTitle>
              <CardDescription>AI-detected security threats and suspicious activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <div key={anomaly.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{anomaly.event_type.replace(/_/g, ' ')}</p>
                        <Badge variant={getSeverityColor(anomaly.severity_level)}>
                          {anomaly.severity_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Service: {anomaly.affected_service || 'Unknown'}
                        {anomaly.threat_classification && ` • ${anomaly.threat_classification}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{Math.round(anomaly.anomaly_score)}%</p>
                      <p className="text-xs text-muted-foreground">risk score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIGatewayDashboard;