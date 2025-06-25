
import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Star,
  Zap,
  Activity,
  BarChart3,
  Settings,
  Download,
  Filter,
  Calendar,
  Plus,
  Minus,
  RefreshCw,
  Bell,
  Eye,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  BarChart,
  Globe,
  Smartphone,
  Monitor,
  CreditCard,
  Truck,
  UserCheck,
  ShoppingBag,
  Percent
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
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
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
  PolarRadiusAxis,
  ComposedChart
} from 'recharts';

export const KPIMonitoringDashboard: React.FC = () => {
  const [selectedKPICategory, setSelectedKPICategory] = useState('financial');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Simulate real-time KPI updates
  const [liveMetrics, setLiveMetrics] = useState({
    revenue: 2450000,
    orders: 12847,
    customers: 8943,
    conversion: 3.42,
    aov: 185.67,
    retention: 67.8
  });

  useEffect(() => {
    if (!realTimeUpdates) return;
    
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 5000 - 2500),
        orders: prev.orders + Math.floor(Math.random() * 20 - 10),
        customers: prev.customers + Math.floor(Math.random() * 15 - 7),
        conversion: Math.max(0, prev.conversion + (Math.random() * 0.2 - 0.1)),
        aov: Math.max(0, prev.aov + (Math.random() * 10 - 5)),
        retention: Math.max(0, Math.min(100, prev.retention + (Math.random() * 2 - 1)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const kpiTrendData = [
    { period: 'Week 1', revenue: 580000, orders: 2890, customers: 2100, conversion: 3.1, aov: 201, retention: 65 },
    { period: 'Week 2', revenue: 620000, orders: 3120, customers: 2280, conversion: 3.3, aov: 199, retention: 67 },
    { period: 'Week 3', revenue: 590000, orders: 2950, customers: 2150, conversion: 3.2, aov: 200, retention: 66 },
    { period: 'Week 4', revenue: 660000, orders: 3280, customers: 2410, conversion: 3.5, aov: 201, retention: 68 }
  ];

  const competitorBenchmark = [
    { metric: 'Conversion Rate', our: 3.42, competitor: 3.8, industry: 3.2 },
    { metric: 'AOV', our: 185.67, competitor: 195, industry: 175 },
    { metric: 'Customer Retention', our: 67.8, competitor: 72, industry: 65 },
    { metric: 'Cart Abandonment', our: 69.5, competitor: 65, industry: 70 }
  ];

  const financialKPIs = [
    {
      title: 'Total Revenue',
      current: liveMetrics.revenue,
      target: 2500000,
      percentage: (liveMetrics.revenue / 2500000) * 100,
      trend: 'up',
      change: '+12.8%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      benchmark: { competitor: 2680000, industry: 2200000 }
    },
    {
      title: 'Gross Profit Margin',
      current: 28.5,
      target: 30,
      percentage: 95,
      trend: 'up',
      change: '+2.3%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      benchmark: { competitor: 31.2, industry: 27.8 }
    },
    {
      title: 'Customer Acquisition Cost',
      current: 52.30,
      target: 45,
      percentage: 86.2,
      trend: 'down',
      change: '-8.5%',
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      benchmark: { competitor: 48.50, industry: 55.20 }
    },
    {
      title: 'Return on Ad Spend',
      current: 4.8,
      target: 5.0,
      percentage: 96,
      trend: 'up',
      change: '+15.2%',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      benchmark: { competitor: 5.2, industry: 4.1 }
    }
  ];

  const operationalKPIs = [
    {
      title: 'Order Fulfillment Rate',
      current: 97.8,
      target: 98.5,
      percentage: 99.3,
      trend: 'up',
      change: '+1.8%',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      title: 'Average Delivery Time',
      current: 2.3,
      target: 2.0,
      percentage: 87,
      trend: 'down',
      change: '-0.4 days',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Inventory Turnover',
      current: 8.2,
      target: 9.0,
      percentage: 91.1,
      trend: 'up',
      change: '+0.7',
      icon: RefreshCw,
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Return Rate',
      current: 4.2,
      target: 3.5,
      percentage: 83.3,
      trend: 'down',
      change: '-0.8%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    }
  ];

  const customerKPIs = [
    {
      title: 'Customer Retention Rate',
      current: liveMetrics.retention,
      target: 70,
      percentage: (liveMetrics.retention / 70) * 100,
      trend: 'up',
      change: '+3.2%',
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      title: 'Net Promoter Score',
      current: 68,
      target: 75,
      percentage: 90.7,
      trend: 'up',
      change: '+5.8',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Average Order Value',
      current: liveMetrics.aov,
      target: 200,
      percentage: (liveMetrics.aov / 200) * 100,
      trend: 'up',
      change: '+8.5%',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Customer Lifetime Value',
      current: 485.50,
      target: 550,
      percentage: 88.3,
      trend: 'up',
      change: '+12.3%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    }
  ];

  const renderKPICards = (kpis: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight;
        
        return (
          <Card key={index} className={`bg-gradient-to-r ${kpi.bgColor} ${kpi.borderColor} border-2 hover:shadow-lg transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-white shadow-sm`}>
                  <IconComponent className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${kpi.trend === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  {kpi.change}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{kpi.title}</h3>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-bold text-gray-900">
                  {typeof kpi.current === 'number' && kpi.current > 1000 
                    ? kpi.current.toLocaleString() 
                    : typeof kpi.current === 'number' 
                      ? kpi.current.toFixed(kpi.current < 100 ? 1 : 0)
                      : kpi.current}
                  {kpi.title.includes('Rate') || kpi.title.includes('Margin') || kpi.title.includes('Score') ? '%' : ''}
                </span>
                <div className="text-right">
                  <span className="text-sm text-gray-600 block">
                    Target: {kpi.target}{kpi.title.includes('Rate') || kpi.title.includes('Margin') || kpi.title.includes('Score') ? '%' : ''}
                  </span>
                  {kpi.benchmark && (
                    <span className="text-xs text-gray-500">
                      vs Competitor: {typeof kpi.benchmark.competitor === 'number' && kpi.benchmark.competitor > 1000 
                        ? kpi.benchmark.competitor.toLocaleString() 
                        : kpi.benchmark.competitor}
                    </span>
                  )}
                </div>
              </div>
              
              <Progress value={kpi.percentage} className="h-3 mb-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress: {kpi.percentage.toFixed(1)}%</span>
                <span>
                  {kpi.percentage >= 95 ? '🎯 Excellent' : 
                   kpi.percentage >= 85 ? '👍 Good' : 
                   kpi.percentage >= 70 ? '⚠️ Fair' : '🔴 Needs Attention'}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 KPI Monitoring Dashboard</h1>
          <p className="text-gray-600 text-lg">Enterprise-level performance tracking and business intelligence</p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch 
              id="real-time" 
              checked={realTimeUpdates} 
              onCheckedChange={setRealTimeUpdates} 
            />
            <Label htmlFor="real-time" className="text-sm">Real-time</Label>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure KPIs
          </Button>
        </div>
      </div>

      {/* Live Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          { label: 'Revenue', value: `৳${liveMetrics.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
          { label: 'Orders', value: liveMetrics.orders.toLocaleString(), icon: ShoppingCart, color: 'text-blue-600' },
          { label: 'Customers', value: liveMetrics.customers.toLocaleString(), icon: Users, color: 'text-purple-600' },
          { label: 'Conversion', value: `${liveMetrics.conversion.toFixed(2)}%`, icon: Percent, color: 'text-orange-600' },
          { label: 'AOV', value: `৳${liveMetrics.aov.toFixed(0)}`, icon: CreditCard, color: 'text-pink-600' },
          { label: 'Retention', value: `${liveMetrics.retention.toFixed(1)}%`, icon: Heart, color: 'text-red-600' }
        ].map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white border-2 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className={`w-5 h-5 ${metric.color}`} />
                  {realTimeUpdates && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>}
                </div>
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <p className="text-lg font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* KPI Categories */}
      <Tabs value={selectedKPICategory} onValueChange={setSelectedKPICategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial">💰 Financial KPIs</TabsTrigger>
          <TabsTrigger value="operational">⚙️ Operational KPIs</TabsTrigger>
          <TabsTrigger value="customer">👥 Customer KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          {renderKPICards(financialKPIs)}
          
          {/* Financial Trends Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={kpiTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" opacity={0.7} />
                    <Line type="monotone" dataKey="conversion" stroke="#ef4444" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorBenchmark.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3">{item.metric}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Our Performance</span>
                          <span className="font-bold text-blue-600">{item.our}</span>
                        </div>
                        <Progress value={(item.our / Math.max(item.our, item.competitor, item.industry)) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Competitor: {item.competitor}</span>
                          <span>Industry Avg: {item.industry}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          {renderKPICards(operationalKPIs)}
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          {renderKPICards(customerKPIs)}
        </TabsContent>
      </Tabs>

      {/* Advanced Analytics & Data Entry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPI Forecasting */}
        <Card>
          <CardHeader>
            <CardTitle>📈 KPI Forecasting & Projections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="forecast-kpi">Select KPI to Forecast</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose KPI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="customers">Customer Growth</SelectItem>
                  <SelectItem value="retention">Retention Rate</SelectItem>
                  <SelectItem value="aov">Average Order Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="forecast-period">Forecast Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="confidence">Confidence Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                    <SelectItem value="95">95%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="external-factors">External Factors</Label>
              <Textarea 
                id="external-factors" 
                placeholder="Market conditions, seasonality, campaigns..."
                className="min-h-[80px]"
              />
            </div>
            <Button className="w-full">Generate Forecast</Button>
          </CardContent>
        </Card>

        {/* Manual KPI Entry */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Manual KPI Data Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kpi-category">KPI Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specific-kpi">Specific KPI</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Total Revenue</SelectItem>
                    <SelectItem value="orders">Order Count</SelectItem>
                    <SelectItem value="customers">New Customers</SelectItem>
                    <SelectItem value="retention">Retention Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kpi-value">KPI Value</Label>
                <Input id="kpi-value" type="number" placeholder="Enter value" />
              </div>
              <div>
                <Label htmlFor="target-value">Target Value</Label>
                <Input id="target-value" type="number" placeholder="Enter target" />
              </div>
            </div>

            <div>
              <Label htmlFor="reporting-period">Reporting Period</Label>
              <Input id="reporting-period" type="date" />
            </div>

            <div>
              <Label htmlFor="data-source">Data Source</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="google-analytics">Google Analytics</SelectItem>
                  <SelectItem value="sales-system">Sales System</SelectItem>
                  <SelectItem value="crm">CRM System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Context, methodology, assumptions..." />
            </div>

            <Button className="w-full">Submit KPI Data</Button>
          </CardContent>
        </Card>

        {/* Advanced Alert Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>🔔 Advanced KPI Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="alert-kpi">KPI to Monitor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select KPI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Drop</SelectItem>
                  <SelectItem value="conversion">Conversion Rate</SelectItem>
                  <SelectItem value="retention">Customer Churn</SelectItem>
                  <SelectItem value="inventory">Stock Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="threshold-type">Threshold Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="absolute">Absolute Value</SelectItem>
                    <SelectItem value="percentage">Percentage Change</SelectItem>
                    <SelectItem value="trend">Trend Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="threshold-value">Threshold Value</Label>
                <Input id="threshold-value" type="number" placeholder="Value" />
              </div>
              <div>
                <Label htmlFor="severity">Severity Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="alert-frequency">Alert Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notification-channels">Notification Channels</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Email', 'SMS', 'Slack', 'Discord', 'Webhook', 'Push'].map((channel) => (
                  <div key={channel} className="flex items-center space-x-2">
                    <Switch id={channel} />
                    <Label htmlFor={channel} className="text-sm">{channel}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full">Create Alert Rule</Button>
          </CardContent>
        </Card>

        {/* KPI Performance Scorecard */}
        <Card>
          <CardHeader>
            <CardTitle>🏆 Performance Scorecard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Financial Performance', score: 85, status: 'good' },
                { category: 'Operational Excellence', score: 78, status: 'fair' },
                { category: 'Customer Satisfaction', score: 92, status: 'excellent' },
                { category: 'Market Position', score: 71, status: 'fair' }
              ].map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{item.category}</h4>
                    <Badge 
                      variant={item.status === 'excellent' ? 'default' : 
                              item.status === 'good' ? 'secondary' : 'outline'}
                      className={
                        item.status === 'excellent' ? 'bg-green-500' :
                        item.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                      }
                    >
                      {item.score}/100
                    </Badge>
                  </div>
                  <Progress value={item.score} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {item.status === 'excellent' ? '🌟 Outstanding performance' :
                     item.status === 'good' ? '👍 Good performance' : '⚠️ Needs improvement'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
