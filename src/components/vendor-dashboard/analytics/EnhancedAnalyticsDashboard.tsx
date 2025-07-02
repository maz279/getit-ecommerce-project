import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  AlertTriangle, Bell, Eye, Calendar, BarChart3, Activity, RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import SalesAnalytics from './SalesAnalytics';
import ProductPerformance from './ProductPerformance';
import RevenueReporting from './RevenueReporting';
import CustomerInsights from './CustomerInsights';

interface DashboardMetrics {
  sales: {
    total_revenue: number;
    order_count: number;
    avg_order_value: number;
    growth_rate: number;
  };
  inventory: {
    low_stock_items: number;
    out_of_stock: number;
    total_products: number;
    turnover_rate: number;
  };
  orders: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
  customers: {
    new_customers: number;
    returning_customers: number;
    total_sessions: number;
    conversion_rate: number;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  priority: string;
  notification_type: string;
  created_at: string;
  is_read: boolean;
  action_required?: boolean;
  action_url?: string;
  metadata?: any;
  read_at?: string;
  vendor_id?: string;
}

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('realtime');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time subscription
  useEffect(() => {
    let subscription: any;
    let interval: NodeJS.Timeout;

    const setupRealtime = async () => {
      // Subscribe to real-time updates
      subscription = supabase
        .channel('vendor-dashboard')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'real_time_metrics' },
          (payload) => {
            console.log('Real-time update:', payload);
            fetchMetrics();
          }
        )
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'vendor_notifications' },
          (payload) => {
            console.log('Notification update:', payload);
            fetchNotifications();
          }
        )
        .subscribe();

      // Auto-refresh interval
      if (autoRefresh) {
        interval = setInterval(() => {
          fetchMetrics();
        }, 30000); // Refresh every 30 seconds
      }
    };

    setupRealtime();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('realtime-analytics', {
        body: {
          action: 'get_metrics',
          timeframe
        }
      });

      if (error) throw error;

      setMetrics(data.metrics);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchNotifications();
  }, [timeframe]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('vendor_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="w-4 h-4 mr-2" />
            Auto Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Bell className="w-5 h-5 mr-2 text-amber-600" />
                Live Alerts ({notifications.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge variant={getPriorityColor(notification.priority) as any}>
                      {notification.priority}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">৳{metrics.sales.total_revenue.toFixed(0)}</p>
                  <div className="flex items-center mt-1">
                    {metrics.sales.growth_rate >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${metrics.sales.growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(metrics.sales.growth_rate).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">{metrics.sales.order_count}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ৳{metrics.sales.avg_order_value.toFixed(0)} avg
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inventory Alerts</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {metrics.inventory.low_stock_items}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {metrics.inventory.out_of_stock} out of stock
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customers</p>
                  <p className="text-2xl font-bold">{metrics.customers.new_customers + metrics.customers.returning_customers}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(metrics.customers.conversion_rate * 100).toFixed(1)}% conversion
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Real-time revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current order pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics && Object.entries(metrics.orders).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="capitalize">{status}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <SalesAnalytics />
        </TabsContent>

        <TabsContent value="products">
          <ProductPerformance />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;