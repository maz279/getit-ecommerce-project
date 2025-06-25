
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Eye, 
  MousePointer, 
  Timer,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

// Sample real-time data
const generateRealtimeData = () => {
  const now = new Date();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      visitors: Math.floor(Math.random() * 1000) + 500,
      orders: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      pageViews: Math.floor(Math.random() * 2000) + 1000,
      conversionRate: (Math.random() * 5 + 2).toFixed(2),
      bounceRate: (Math.random() * 20 + 30).toFixed(1)
    });
  }
  return data;
};

const topProductsData = [
  { name: 'Smartphone X', sales: 145, revenue: 29000, trend: 'up' },
  { name: 'Laptop Pro', sales: 89, revenue: 44500, trend: 'up' },
  { name: 'Wireless Earbuds', sales: 234, revenue: 11700, trend: 'down' },
  { name: 'Smart Watch', sales: 67, revenue: 13400, trend: 'up' },
  { name: 'Gaming Console', sales: 23, revenue: 11500, trend: 'stable' }
];

const deviceData = [
  { name: 'Mobile', value: 65, color: '#8884d8' },
  { name: 'Desktop', value: 25, color: '#82ca9d' },
  { name: 'Tablet', value: 10, color: '#ffc658' }
];

const geographicData = [
  { country: 'Bangladesh', visitors: 12500, orders: 245, color: '#8884d8' },
  { country: 'India', visitors: 8900, orders: 178, color: '#82ca9d' },
  { country: 'USA', visitors: 6700, orders: 156, color: '#ffc658' },
  { country: 'UK', visitors: 4300, orders: 89, color: '#ff7c7c' },
  { country: 'Others', visitors: 3200, orders: 67, color: '#8dd1e1' }
];

export const RealtimeMetricsSection: React.FC = () => {
  const [realtimeData, setRealtimeData] = useState(generateRealtimeData());
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const form = useForm({
    defaultValues: {
      alertThreshold: '1000',
      refreshInterval: '30',
      notificationEmail: '',
      slackWebhook: ''
    }
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData());
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const currentMetrics = realtimeData[realtimeData.length - 1];
  const previousMetrics = realtimeData[realtimeData.length - 2];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change).toFixed(1), isPositive: change > 0 };
  };

  const onSubmit = (data: any) => {
    console.log('Real-time settings updated:', data);
    // Here you would typically save to backend
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚡ Real-time Metrics Dashboard</h1>
          <p className="text-gray-600 text-lg">Live platform performance monitoring and real-time analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isLive ? "default" : "secondary"} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </Badge>
          <Button 
            variant={isLive ? "outline" : "default"} 
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Pause' : 'Resume'}
          </Button>
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics?.visitors.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {previousMetrics && (() => {
                    const change = calculateChange(currentMetrics.visitors, previousMetrics.visitors);
                    return (
                      <>
                        {change.isPositive ? <TrendingUp className="w-3 h-3 text-green-500 mr-1" /> : <TrendingDown className="w-3 h-3 text-red-500 mr-1" />}
                        <span className={change.isPositive ? 'text-green-500' : 'text-red-500'}>
                          {change.value}% from last period
                        </span>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics?.orders.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {previousMetrics && (() => {
                    const change = calculateChange(currentMetrics.orders, previousMetrics.orders);
                    return (
                      <>
                        {change.isPositive ? <TrendingUp className="w-3 h-3 text-green-500 mr-1" /> : <TrendingDown className="w-3 h-3 text-red-500 mr-1" />}
                        <span className={change.isPositive ? 'text-green-500' : 'text-red-500'}>
                          {change.value}% from last period
                        </span>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentMetrics?.revenue.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {previousMetrics && (() => {
                    const change = calculateChange(currentMetrics.revenue, previousMetrics.revenue);
                    return (
                      <>
                        {change.isPositive ? <TrendingUp className="w-3 h-3 text-green-500 mr-1" /> : <TrendingDown className="w-3 h-3 text-red-500 mr-1" />}
                        <span className={change.isPositive ? 'text-green-500' : 'text-red-500'}>
                          {change.value}% from last period
                        </span>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics?.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Bounce rate: {currentMetrics?.bounceRate}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Visitor Activity (Last 24 Hours)
                </CardTitle>
                <CardDescription>Real-time visitor count updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    visitors: { label: "Visitors", color: "#8884d8" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realtimeData}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="visitors" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisitors)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Revenue Stream
                </CardTitle>
                <CardDescription>Live revenue tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "#82ca9d" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realtimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products and Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Top Selling Products (Live)
                </CardTitle>
                <CardDescription>Real-time best performers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProductsData.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${product.revenue.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          {product.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                          {product.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                          <span className={`text-xs ${product.trend === 'up' ? 'text-green-500' : product.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                            {product.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Device Breakdown
                </CardTitle>
                <CardDescription>Live traffic by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    mobile: { label: "Mobile", color: "#8884d8" },
                    desktop: { label: "Desktop", color: "#82ca9d" },
                    tablet: { label: "Tablet", color: "#ffc658" }
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                      <span className="text-sm">{device.name} ({device.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Page Load Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">1.2s</div>
                <p className="text-sm text-gray-500">Average load time</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">85% under 2s target</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Server Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">99.9%</div>
                <p className="text-sm text-gray-500">Last 30 days</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600">All systems operational</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  API Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">145ms</div>
                <p className="text-sm text-gray-500">Average response</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">92% under 200ms</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Last 24 hours performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    responseTime: { label: "Response Time (ms)", color: "#8884d8" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realtimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="pageViews" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate Monitoring</CardTitle>
                <CardDescription>System health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">API Endpoints</span>
                    </div>
                    <span className="text-green-600 font-medium">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Database</span>
                    </div>
                    <span className="text-green-600 font-medium">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">Third-party Services</span>
                    </div>
                    <span className="text-yellow-600 font-medium">98.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>Live visitor locations and order patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {geographicData.map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: country.color }} />
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{country.visitors.toLocaleString()} visitors</p>
                        <p className="text-sm text-gray-500">{country.orders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
                <ChartContainer
                  config={{
                    visitors: { label: "Visitors", color: "#8884d8" }
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="visitors" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Behavior Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Session Analytics</CardTitle>
                <CardDescription>Live user behavior patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Session Duration</span>
                    <span className="font-bold">4m 32s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pages per Session</span>
                    <span className="font-bold">3.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>New vs Returning</span>
                    <span className="font-bold">65% / 35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cart Abandonment Rate</span>
                    <span className="font-bold text-orange-600">28.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Events</CardTitle>
                <CardDescription>Recent user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Order #12345 completed - $89.99</span>
                    <span className="text-xs text-gray-500 ml-auto">2s ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">New user registration from Dhaka</span>
                    <span className="text-xs text-gray-500 ml-auto">5s ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Product viewed: iPhone 15 Pro</span>
                    <span className="text-xs text-gray-500 ml-auto">8s ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Cart abandoned - $156.50</span>
                    <span className="text-xs text-gray-500 ml-auto">12s ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Order #12346 completed - $234.99</span>
                    <span className="text-xs text-gray-500 ml-auto">15s ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Real-time Settings Form */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring Configuration</CardTitle>
              <CardDescription>Configure alerts, notifications, and monitoring settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="alertThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alert Threshold (Visitors)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1000" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="refreshInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Refresh Interval (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="30" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notificationEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alert Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="admin@getit.com" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slackWebhook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slack Webhook URL</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://hooks.slack.com/..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">Save Settings</Button>
                    <Button type="button" variant="outline">Test Alerts</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Monitoring Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Preferences</CardTitle>
              <CardDescription>Customize what metrics to track and display</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Tracked Metrics</h3>
                  <div className="space-y-2">
                    {[
                      'Real-time Visitors',
                      'Live Orders',
                      'Revenue Tracking',
                      'Conversion Rates',
                      'Page Load Times',
                      'Error Rates',
                      'Geographic Data',
                      'Device Analytics'
                    ].map((metric) => (
                      <label key={metric} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Alert Conditions</h3>
                  <div className="space-y-2">
                    {[
                      'High traffic spikes (>200% increase)',
                      'Low conversion rates (<2%)',
                      'System errors (>1% error rate)',
                      'Slow page loads (>3 seconds)',
                      'Cart abandonment spikes',
                      'Revenue drops (>50% decrease)',
                      'Server downtime',
                      'API failures'
                    ].map((condition) => (
                      <label key={condition} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
