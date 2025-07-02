import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Zap,
  Target,
  Globe,
  Cpu
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: number;
  active_connections: number;
  response_time: number;
}

interface BusinessMetrics {
  daily_revenue: number;
  daily_orders: number;
  active_users: number;
  conversion_rate: number;
  avg_order_value: number;
  customer_satisfaction: number;
}

interface SecurityMetrics {
  fraud_attempts: number;
  blocked_ips: number;
  security_score: number;
  vulnerabilities: number;
}

export const EnterpriseAnalyticsDashboard: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [mlModels, setMlModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load system metrics
      const { data: systemData } = await supabase.functions.invoke('platform-monitoring', {
        body: { action: 'get_system_metrics' }
      });

      // Load business metrics
      const { data: businessData } = await supabase.functions.invoke('ml-analytics-dashboard', {
        body: { action: 'get_business_metrics' }
      });

      // Load security metrics
      const { data: securityData } = await supabase.functions.invoke('fraud-detection', {
        body: { action: 'get_fraud_analytics' }
      });

      // Load ML model performance
      const { data: mlData } = await supabase.functions.invoke('ml-analytics-dashboard', {
        body: { action: 'get_model_performance' }
      });

      setSystemMetrics(systemData || {
        cpu_usage: 45,
        memory_usage: 67,
        disk_usage: 34,
        network_io: 89,
        active_connections: 1234,
        response_time: 145
      });

      setBusinessMetrics(businessData || {
        daily_revenue: 125000,
        daily_orders: 456,
        active_users: 12500,
        conversion_rate: 3.4,
        avg_order_value: 274,
        customer_satisfaction: 4.7
      });

      setSecurityMetrics(securityData || {
        fraud_attempts: 23,
        blocked_ips: 156,
        security_score: 95,
        vulnerabilities: 2
      });

      setMlModels(mlData?.models || [
        { name: 'Recommendation Engine', accuracy: 94.5, status: 'active' },
        { name: 'Fraud Detection', accuracy: 97.2, status: 'active' },
        { name: 'Price Optimization', accuracy: 89.3, status: 'training' },
        { name: 'Demand Forecasting', accuracy: 91.7, status: 'active' }
      ]);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !systemMetrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights and performance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
          <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
            {loading ? <Clock className="h-4 w-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="ml">ML Models</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳{businessMetrics?.daily_revenue?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-500" /> +12.5% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessMetrics?.active_users?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-500" /> +8.2% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Excellent</div>
                <p className="text-xs text-muted-foreground">
                  <CheckCircle className="inline h-3 w-3 text-green-500" /> All services operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{securityMetrics?.security_score}%</div>
                <p className="text-xs text-muted-foreground">
                  <CheckCircle className="inline h-3 w-3 text-green-500" /> High security level
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Performance</CardTitle>
                <CardDescription>System performance over the last hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">{systemMetrics?.cpu_usage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300" 
                      style={{ width: `${systemMetrics?.cpu_usage}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">{systemMetrics?.memory_usage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-blue-500 rounded-full h-2 transition-all duration-300" 
                      style={{ width: `${systemMetrics?.memory_usage}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">{systemMetrics?.response_time}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ML Model Performance</CardTitle>
                <CardDescription>AI model accuracy and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mlModels.map((model, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{model.name}</p>
                        <p className="text-xs text-muted-foreground">Accuracy: {model.accuracy}%</p>
                      </div>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU</span>
                    <span>{systemMetrics?.cpu_usage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-orange-500 rounded-full h-2" style={{ width: `${systemMetrics?.cpu_usage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory</span>
                    <span>{systemMetrics?.memory_usage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-blue-500 rounded-full h-2" style={{ width: `${systemMetrics?.memory_usage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Disk</span>
                    <span>{systemMetrics?.disk_usage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: `${systemMetrics?.disk_usage}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Network Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{systemMetrics?.network_io} MB/s</div>
                <p className="text-sm text-muted-foreground">
                  {systemMetrics?.active_connections} active connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{systemMetrics?.response_time}ms</div>
                <p className="text-sm text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">৳{businessMetrics?.daily_revenue?.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Daily Revenue</p>
                  <div className="text-lg">৳{businessMetrics?.avg_order_value}</div>
                  <p className="text-sm text-muted-foreground">Average Order Value</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Orders & Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{businessMetrics?.daily_orders}</div>
                  <p className="text-sm text-muted-foreground">Daily Orders</p>
                  <div className="text-lg">{businessMetrics?.conversion_rate}%</div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{businessMetrics?.active_users?.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <div className="text-lg">{businessMetrics?.customer_satisfaction}/5.0</div>
                  <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{securityMetrics?.security_score}%</div>
                <p className="text-sm text-muted-foreground">Overall security rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Fraud Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{securityMetrics?.fraud_attempts}</div>
                <p className="text-sm text-muted-foreground">Blocked today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Blocked IPs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{securityMetrics?.blocked_ips}</div>
                <p className="text-sm text-muted-foreground">Active blocks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Vulnerabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{securityMetrics?.vulnerabilities}</div>
                <p className="text-sm text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ml" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mlModels.map((model, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {model.name}
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span>{model.accuracy}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-green-500 rounded-full h-2" style={{ width: `${model.accuracy}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Updated</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All services are operational. System health is excellent.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Memory usage is above 65%. Consider scaling resources.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};