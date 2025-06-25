
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Clock,
  Zap,
  Monitor,
  Globe,
  Smartphone,
  Server,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Download,
  Filter,
  Calendar,
  Plus,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

export const RealtimeMetricsSection: React.FC = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 2345,
    salesPerMinute: 15,
    conversionRate: 3.2,
    serverLoad: 65,
    pageLoadTime: 1.2,
    errorRate: 0.3,
    bounceRate: 42.5,
    sessionDuration: 4.8
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 20 - 10)),
        salesPerMinute: Math.max(0, prev.salesPerMinute + Math.floor(Math.random() * 6 - 3)),
        conversionRate: Math.max(0, prev.conversionRate + (Math.random() * 0.4 - 0.2)),
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + Math.floor(Math.random() * 10 - 5))),
        pageLoadTime: Math.max(0.1, prev.pageLoadTime + (Math.random() * 0.4 - 0.2)),
        errorRate: Math.max(0, prev.errorRate + (Math.random() * 0.2 - 0.1)),
        bounceRate: Math.max(0, Math.min(100, prev.bounceRate + (Math.random() * 4 - 2))),
        sessionDuration: Math.max(0, prev.sessionDuration + (Math.random() * 0.6 - 0.3))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const realtimeData = [
    { time: '00:00', users: 1200, sales: 850, orders: 45, pageViews: 3200, errors: 5 },
    { time: '00:05', users: 1350, sales: 920, orders: 52, pageViews: 3450, errors: 3 },
    { time: '00:10', users: 1480, sales: 1100, orders: 48, pageViews: 3800, errors: 7 },
    { time: '00:15', users: 1650, sales: 1250, orders: 61, pageViews: 4100, errors: 4 },
    { time: '00:20', users: 1820, sales: 1400, orders: 55, pageViews: 4500, errors: 6 },
    { time: '00:25', users: 2100, sales: 1650, orders: 68, pageViews: 4800, errors: 2 },
    { time: '00:30', users: 2345, sales: 1850, orders: 72, pageViews: 5200, errors: 8 }
  ];

  const serverMetrics = [
    { server: 'Web-01', cpu: 45, memory: 62, disk: 35, network: 78 },
    { server: 'Web-02', cpu: 38, memory: 58, disk: 42, network: 65 },
    { server: 'DB-01', cpu: 72, memory: 85, disk: 67, network: 82 },
    { server: 'API-01', cpu: 55, memory: 48, disk: 28, network: 73 }
  ];

  const geographicData = [
    { region: 'Dhaka', users: 1250, percentage: 35.2, color: '#0088FE' },
    { region: 'Chittagong', users: 850, percentage: 24.0, color: '#00C49F' },
    { region: 'Sylhet', users: 520, percentage: 14.7, color: '#FFBB28' },
    { region: 'Khulna', users: 380, percentage: 10.7, color: '#FF8042' },
    { region: 'Others', users: 545, percentage: 15.4, color: '#8884d8' }
  ];

  const deviceBreakdown = [
    { device: 'Mobile', sessions: 58000, percentage: 52.3, color: '#0088FE' },
    { device: 'Desktop', sessions: 42000, percentage: 37.8, color: '#00C49F' },
    { device: 'Tablet', sessions: 11000, percentage: 9.9, color: '#FFBB28' }
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Real-time Metrics Dashboard</h1>
          <p className="text-gray-600 text-lg">Live platform performance monitoring and analytics</p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="6h">6 Hours</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant={alertsEnabled ? "default" : "secondary"} className="bg-green-500">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
            Live
          </Badge>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Enhanced Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Active Users', 
            value: metrics.activeUsers.toLocaleString(), 
            change: '+12.5%', 
            trend: 'up', 
            icon: Users, 
            color: 'text-blue-600',
            bgColor: 'from-blue-50 to-blue-100',
            borderColor: 'border-blue-200'
          },
          { 
            title: 'Sales/Minute', 
            value: metrics.salesPerMinute.toString(), 
            change: '+8.2%', 
            trend: 'up', 
            icon: ShoppingCart, 
            color: 'text-green-600',
            bgColor: 'from-green-50 to-green-100',
            borderColor: 'border-green-200'
          },
          { 
            title: 'Conversion Rate', 
            value: `${metrics.conversionRate.toFixed(1)}%`, 
            change: '+0.5%', 
            trend: 'up', 
            icon: TrendingUp, 
            color: 'text-purple-600',
            bgColor: 'from-purple-50 to-purple-100',
            borderColor: 'border-purple-200'
          },
          { 
            title: 'Server Load', 
            value: `${metrics.serverLoad}%`, 
            change: '-2.1%', 
            trend: 'down', 
            icon: Server, 
            color: 'text-orange-600',
            bgColor: 'from-orange-50 to-orange-100',
            borderColor: 'border-orange-200'
          }
        ].map((metric, index) => {
          const IconComponent = metric.icon;
          
          return (
            <Card key={index} className={`bg-gradient-to-r ${metric.bgColor} ${metric.borderColor} border-2`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-white shadow-sm`}>
                    <IconComponent className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} 
                         className={metric.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}>
                    {metric.change}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <Progress value={Math.random() * 100} className="mt-3 h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Page Load Time', value: `${metrics.pageLoadTime.toFixed(1)}s`, icon: Clock, status: 'warning' },
          { title: 'Error Rate', value: `${metrics.errorRate.toFixed(1)}%`, icon: AlertTriangle, status: 'good' },
          { title: 'Bounce Rate', value: `${metrics.bounceRate.toFixed(1)}%`, icon: Eye, status: 'warning' },
          { title: 'Avg Session', value: `${metrics.sessionDuration.toFixed(1)}m`, icon: Activity, status: 'good' }
        ].map((metric, index) => {
          const IconComponent = metric.icon;
          const statusColor = metric.status === 'good' ? 'text-green-600' : 
                             metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600';
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <IconComponent className={`w-8 h-8 ${statusColor}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabbed Analytics Content */}
      <Tabs defaultValue="realtime-charts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="realtime-charts">Real-time Charts</TabsTrigger>
          <TabsTrigger value="server-monitoring">Server Monitoring</TabsTrigger>
          <TabsTrigger value="geographic-data">Geographic Data</TabsTrigger>
          <TabsTrigger value="device-analytics">Device Analytics</TabsTrigger>
          <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
        </TabsList>

        {/* Real-time Charts */}
        <TabsContent value="realtime-charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Live Activity Stream
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="pageViews" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales & Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={3} />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Error Rate Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={realtimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="errors" fill="#ff6b6b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Server Monitoring */}
        <TabsContent value="server-monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Server Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={serverMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="server" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="CPU Usage" dataKey="cpu" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Memory Usage" dataKey="memory" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Server Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serverMetrics.map((server, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold flex items-center">
                          <Server className="w-4 h-4 mr-2" />
                          {server.server}
                        </h4>
                        <Badge variant={server.cpu > 70 ? 'destructive' : 'default'}>
                          {server.cpu > 70 ? 'High Load' : 'Normal'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">CPU: {server.cpu}%</p>
                          <Progress value={server.cpu} className="mt-1" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Memory: {server.memory}%</p>
                          <Progress value={server.memory} className="mt-1" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Disk: {server.disk}%</p>
                          <Progress value={server.disk} className="mt-1" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Network: {server.network}%</p>
                          <Progress value={server.network} className="mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Data */}
        <TabsContent value="geographic-data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={geographicData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="users"
                      label={({ region, percentage }) => `${region}: ${percentage}%`}
                    >
                      {geographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geographicData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded`} style={{ backgroundColor: region.color }}></div>
                        <div>
                          <p className="font-medium">{region.region}</p>
                          <p className="text-sm text-gray-500">{region.users.toLocaleString()} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{region.percentage}%</p>
                        <Progress value={region.percentage} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Device Analytics */}
        <TabsContent value="device-analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="sessions"
                      label={({ device, percentage }) => `${device}: ${percentage}%`}
                    >
                      {deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  {deviceBreakdown.map((device, index) => {
                    const DeviceIcon = device.device === 'Mobile' ? Smartphone : 
                                     device.device === 'Desktop' ? Monitor : 
                                     Globe;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DeviceIcon className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-medium">{device.device}</p>
                            <p className="text-sm text-gray-500">{device.sessions.toLocaleString()} sessions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl">{device.percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Entry Forms */}
        <TabsContent value="data-entry" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Metrics Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Metrics Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                    <Input id="refresh-interval" type="number" defaultValue="30" min="5" max="300" />
                  </div>
                  <div>
                    <Label htmlFor="data-retention">Data Retention (hours)</Label>
                    <Input id="data-retention" type="number" defaultValue="24" min="1" max="168" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="alerts-enabled" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
                  <Label htmlFor="alerts-enabled">Enable Real-time Alerts</Label>
                </div>

                <div>
                  <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
                  <Input id="alert-threshold" type="number" defaultValue="80" min="0" max="100" />
                </div>

                <Button className="w-full">Update Configuration</Button>
              </CardContent>
            </Card>

            {/* Manual Metric Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Metric Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metric-type">Metric Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active-users">Active Users</SelectItem>
                      <SelectItem value="sales-rate">Sales Rate</SelectItem>
                      <SelectItem value="conversion">Conversion Rate</SelectItem>
                      <SelectItem value="server-load">Server Load</SelectItem>
                      <SelectItem value="page-load">Page Load Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="metric-value">Metric Value</Label>
                  <Input id="metric-value" type="number" placeholder="Enter value" />
                </div>

                <div>
                  <Label htmlFor="timestamp">Timestamp</Label>
                  <Input id="timestamp" type="datetime-local" />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="Additional context or notes" />
                </div>

                <Button className="w-full">Add Metric Entry</Button>
              </CardContent>
            </Card>

            {/* Alert Management */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="alert-name">Alert Name</Label>
                  <Input id="alert-name" placeholder="e.g., High Server Load" />
                </div>

                <div>
                  <Label htmlFor="metric-monitored">Metric to Monitor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="server-load">Server Load</SelectItem>
                      <SelectItem value="error-rate">Error Rate</SelectItem>
                      <SelectItem value="response-time">Response Time</SelectItem>
                      <SelectItem value="active-users">Active Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="threshold-value">Threshold Value</Label>
                    <Input id="threshold-value" type="number" placeholder="80" />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greater">Greater than</SelectItem>
                        <SelectItem value="less">Less than</SelectItem>
                        <SelectItem value="equal">Equal to</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notification-method">Notification Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Create Alert</Button>
              </CardContent>
            </Card>

            {/* System Status Override */}
            <Card>
              <CardHeader>
                <CardTitle>System Status Override</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="system-component">System Component</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-server">Web Server</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="api-gateway">API Gateway</SelectItem>
                      <SelectItem value="payment-system">Payment System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-override">Status Override</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="degraded">Degraded Performance</SelectItem>
                      <SelectItem value="partial">Partial Outage</SelectItem>
                      <SelectItem value="major">Major Outage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="override-reason">Reason</Label>
                  <Textarea id="override-reason" placeholder="Explain the reason for status override" />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="60" />
                </div>

                <Button className="w-full" variant="destructive">Apply Status Override</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Live Events Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Events Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[
                { type: 'sale', message: 'New order #12345 - Samsung Galaxy S23', amount: '৳85,000', time: 'Just now', status: 'success' },
                { type: 'user', message: 'New user registration: john.doe@email.com', time: '2 min ago', status: 'info' },
                { type: 'sale', message: 'Order completed #12344 - iPhone 14 Pro', amount: '৳125,000', time: '3 min ago', status: 'success' },
                { type: 'alert', message: 'Low stock alert: MacBook Air M2', time: '5 min ago', status: 'warning' },
                { type: 'error', message: 'Payment gateway timeout - Order #12346', time: '7 min ago', status: 'error' },
                { type: 'sale', message: 'New order #12343 - Nike Air Max', amount: '৳12,500', time: '8 min ago', status: 'success' }
              ].map((event, index) => {
                const statusColors = {
                  success: 'bg-green-500',
                  info: 'bg-blue-500',
                  warning: 'bg-yellow-500',
                  error: 'bg-red-500'
                };
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${statusColors[event.status]}`}></div>
                      <div>
                        <p className="text-sm font-medium">{event.message}</p>
                        {event.amount && <p className="text-xs text-green-600 font-bold">{event.amount}</p>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{event.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'warning', title: 'High Traffic Alert', message: 'Traffic increased by 45% in the last hour', time: '5 min ago' },
                { type: 'success', title: 'Sales Milestone', message: 'Reached ৳1M in sales today', time: '1 hour ago' },
                { type: 'error', title: 'Database Alert', message: 'Database response time above threshold', time: '2 hours ago' },
                { type: 'info', title: 'Scheduled Maintenance', message: 'System maintenance scheduled for 2 AM', time: '3 hours ago' }
              ].map((alert, index) => {
                const alertStyles = {
                  warning: 'border-l-yellow-400 bg-yellow-50',
                  success: 'border-l-green-400 bg-green-50',
                  error: 'border-l-red-400 bg-red-50',
                  info: 'border-l-blue-400 bg-blue-50'
                };
                
                return (
                  <div key={index} className={`p-4 border-l-4 ${alertStyles[alert.type]}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
