import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Zap, TrendingUp, Database, Network, Gauge, Activity,
  Settings, RefreshCw, AlertTriangle, CheckCircle
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface CacheMetric {
  cache_key: string;
  hit_rate: number;
  miss_rate: number;
  optimization_score: number;
  access_pattern: any;
  recommendations: any;
}

interface OptimizationLog {
  request_id: string;
  original_size: number;
  optimized_size: number;
  compression_ratio: number;
  optimization_type: string;
  processing_time_ms: number;
  bandwidth_saved: number;
  created_at: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function PerformanceOptimizationDashboard() {
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetric[]>([]);
  const [optimizationLogs, setOptimizationLogs] = useState<OptimizationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const [cacheResponse, logsResponse] = await Promise.all([
        supabase
          .from('cache_optimization_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('request_optimization_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)
      ]);

      if (cacheResponse.data) setCacheMetrics(cacheResponse.data as CacheMetric[]);
      if (logsResponse.data) setOptimizationLogs(logsResponse.data as OptimizationLog[]);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runCacheOptimization = async () => {
    try {
      await supabase.functions.invoke('intelligent-cache-optimizer', {
        body: { action: 'optimize' }
      });
      await fetchPerformanceData();
    } catch (error) {
      console.error('Error running cache optimization:', error);
    }
  };

  const runRequestOptimization = async () => {
    try {
      await supabase.functions.invoke('request-optimization-engine', {
        body: { action: 'optimize' }
      });
      await fetchPerformanceData();
    } catch (error) {
      console.error('Error running request optimization:', error);
    }
  };

  const calculateOverallMetrics = () => {
    const totalBandwidthSaved = optimizationLogs.reduce((sum, log) => sum + (log.bandwidth_saved || 0), 0);
    const avgCompressionRatio = optimizationLogs.reduce((sum, log) => sum + log.compression_ratio, 0) / optimizationLogs.length;
    const avgProcessingTime = optimizationLogs.reduce((sum, log) => sum + log.processing_time_ms, 0) / optimizationLogs.length;
    const avgCacheHitRate = cacheMetrics.reduce((sum, metric) => sum + metric.hit_rate, 0) / cacheMetrics.length;

    return {
      totalBandwidthSaved: Math.round(totalBandwidthSaved / 1024), // KB
      avgCompressionRatio: (avgCompressionRatio * 100).toFixed(1),
      avgProcessingTime: Math.round(avgProcessingTime),
      avgCacheHitRate: (avgCacheHitRate * 100).toFixed(1)
    };
  };

  const getOptimizationTypeData = () => {
    const types: Record<string, { count: number; totalSaved: number }> = {};
    optimizationLogs.forEach(log => {
      const type = log.optimization_type;
      if (!types[type]) {
        types[type] = { count: 0, totalSaved: 0 };
      }
      types[type].count++;
      types[type].totalSaved += log.bandwidth_saved || 0;
    });

    return Object.entries(types).map(([type, data]) => ({
      type,
      count: data.count,
      totalSaved: Math.round(data.totalSaved / 1024)
    }));
  };

  const getCachePerformanceData = () => {
    return cacheMetrics.slice(0, 10).map(metric => ({
      cache_key: metric.cache_key.substring(0, 20) + '...',
      hit_rate: metric.hit_rate * 100,
      optimization_score: metric.optimization_score
    }));
  };

  const getTimeSeriesData = () => {
    const grouped = {};
    optimizationLogs.forEach(log => {
      const date = new Date(log.created_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { date, count: 0, totalSaved: 0 };
      }
      grouped[date].count++;
      grouped[date].totalSaved += log.bandwidth_saved || 0;
    });

    return Object.values(grouped).slice(-7);
  };

  const metrics = calculateOverallMetrics();
  const optimizationTypeData = getOptimizationTypeData();
  const cachePerformanceData = getCachePerformanceData();
  const timeSeriesData = getTimeSeriesData();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading performance data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Optimization</h2>
          <p className="text-muted-foreground">
            Monitor and optimize caching, compression, and request handling
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={runCacheOptimization} variant="outline">
            <Database className="mr-2 h-4 w-4" />
            Optimize Cache
          </Button>
          <Button onClick={runRequestOptimization}>
            <Zap className="mr-2 h-4 w-4" />
            Optimize Requests
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgCacheHitRate}%</div>
            <Progress value={parseFloat(metrics.avgCacheHitRate)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBandwidthSaved} KB</div>
            <p className="text-xs text-muted-foreground">Total across all optimizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compression Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgCompressionRatio}%</div>
            <p className="text-xs text-muted-foreground">Average compression achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgProcessingTime}ms</div>
            <p className="text-xs text-muted-foreground">Average optimization time</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cache">Intelligent Cache</TabsTrigger>
          <TabsTrigger value="optimization">Request Optimization</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Types Distribution</CardTitle>
                <CardDescription>Breakdown of optimization techniques used</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={optimizationTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {optimizationTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Daily optimization performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="totalSaved" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Performance Analysis</CardTitle>
              <CardDescription>Intelligent caching system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cachePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cache_key" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hit_rate" fill="hsl(var(--primary))" name="Hit Rate %" />
                  <Bar dataKey="optimization_score" fill="hsl(var(--secondary))" name="Optimization Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cache Recommendations</CardTitle>
                <CardDescription>AI-generated optimization suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {cacheMetrics.slice(0, 5).map((metric, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {metric.hit_rate > 0.8 ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{metric.cache_key}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {metric.recommendations?.map((rec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {rec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
                <CardDescription>Real-time cache performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Cache Entries</span>
                  <Badge variant="secondary">{cacheMetrics.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Performance Entries</span>
                  <Badge variant="secondary">
                    {cacheMetrics.filter(m => m.optimization_score > 80).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Needs Optimization</span>
                  <Badge variant="destructive">
                    {cacheMetrics.filter(m => m.optimization_score < 50).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Optimization Logs</CardTitle>
              <CardDescription>Recent optimization activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {optimizationLogs.slice(0, 20).map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{log.optimization_type}</Badge>
                      <div>
                        <p className="text-sm font-medium">Request {log.request_id.substring(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {((1 - log.compression_ratio) * 100).toFixed(1)}% saved
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(log.bandwidth_saved / 1024)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Settings</CardTitle>
              <CardDescription>Configure performance optimization parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Cache Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Predictive Caching</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Geographic Caching</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Behavior Analysis</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Request Optimization</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Request Deduplication</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Compression</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Request Batching</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Advanced Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}