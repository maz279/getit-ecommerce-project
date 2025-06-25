
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart } from 'recharts';
import { 
  Target, 
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
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Award,
  Building,
  Percent,
  BarChart3,
  PieChart as PieChartIcon,
  Settings,
  Download,
  Filter,
  Plus
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// KPI Data Types
interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'behind';
}

interface GoalSetting {
  id: string;
  kpiId: string;
  target: number;
  timeframe: string;
  description: string;
  responsible: string;
}

// Sample KPI Data
const generateKPIData = () => {
  const kpis: KPIMetric[] = [
    // Revenue KPIs
    { id: 'revenue', name: 'Monthly Revenue', value: 2850000, target: 3000000, unit: 'BDT', trend: 8.5, category: 'Revenue', priority: 'high', status: 'on-track' },
    { id: 'aov', name: 'Average Order Value', value: 1850, target: 2000, unit: 'BDT', trend: 5.2, category: 'Revenue', priority: 'high', status: 'at-risk' },
    { id: 'ltv', name: 'Customer Lifetime Value', value: 8500, target: 10000, unit: 'BDT', trend: 12.3, category: 'Revenue', priority: 'medium', status: 'on-track' },
    
    // Customer KPIs
    { id: 'cac', name: 'Customer Acquisition Cost', value: 450, target: 400, unit: 'BDT', trend: -8.2, category: 'Customer', priority: 'high', status: 'behind' },
    { id: 'retention', name: 'Customer Retention Rate', value: 78, target: 85, unit: '%', trend: 3.1, category: 'Customer', priority: 'high', status: 'at-risk' },
    { id: 'churn', name: 'Churn Rate', value: 5.8, target: 5.0, unit: '%', trend: -12.5, category: 'Customer', priority: 'medium', status: 'behind' },
    
    // Operations KPIs
    { id: 'inventory_turnover', name: 'Inventory Turnover', value: 6.2, target: 8.0, unit: 'x', trend: 15.8, category: 'Operations', priority: 'medium', status: 'at-risk' },
    { id: 'fulfillment_time', name: 'Order Fulfillment Time', value: 1.8, target: 1.5, unit: 'days', trend: -5.3, category: 'Operations', priority: 'high', status: 'behind' },
    { id: 'return_rate', name: 'Return Rate', value: 3.2, target: 2.5, unit: '%', trend: -18.7, category: 'Operations', priority: 'medium', status: 'behind' },
    
    // Marketing KPIs
    { id: 'conversion_rate', name: 'Conversion Rate', value: 3.8, target: 4.5, unit: '%', trend: 8.9, category: 'Marketing', priority: 'high', status: 'at-risk' },
    { id: 'roas', name: 'Return on Ad Spend', value: 4.2, target: 5.0, unit: 'x', trend: 15.6, category: 'Marketing', priority: 'high', status: 'on-track' },
    { id: 'ctr', name: 'Click-Through Rate', value: 2.1, target: 2.5, unit: '%', trend: 6.3, category: 'Marketing', priority: 'medium', status: 'at-risk' },
  ];
  return kpis;
};

const monthlyTrendData = [
  { month: 'Jan', revenue: 2200000, customers: 15000, orders: 1200, aov: 1833, conversionRate: 3.2 },
  { month: 'Feb', revenue: 2400000, customers: 16500, orders: 1350, aov: 1778, conversionRate: 3.4 },
  { month: 'Mar', revenue: 2650000, customers: 18200, orders: 1450, aov: 1828, conversionRate: 3.6 },
  { month: 'Apr', revenue: 2750000, customers: 19500, orders: 1520, aov: 1809, conversionRate: 3.7 },
  { month: 'May', revenue: 2820000, customers: 20800, orders: 1580, aov: 1785, conversionRate: 3.8 },
  { month: 'Jun', revenue: 2850000, customers: 21500, orders: 1620, aov: 1759, conversionRate: 3.8 },
];

const categoryPerformanceData = [
  { category: 'Electronics', revenue: 1200000, target: 1100000, growth: 9.1 },
  { category: 'Fashion', revenue: 850000, target: 900000, growth: -5.6 },
  { category: 'Home & Garden', revenue: 450000, target: 500000, growth: -10.0 },
  { category: 'Sports', revenue: 350000, target: 400000, growth: -12.5 },
];

const goalProgressData = [
  { goal: 'Q2 Revenue Target', current: 8500000, target: 9000000, progress: 94.4, status: 'on-track' },
  { goal: 'Customer Acquisition', current: 62000, target: 75000, progress: 82.7, status: 'at-risk' },
  { goal: 'Market Share Growth', current: 12.5, target: 15.0, progress: 83.3, status: 'on-track' },
  { goal: 'Operational Efficiency', current: 78, target: 85, progress: 91.8, status: 'on-track' },
];

export const KPIMonitoringDashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIMetric[]>(generateKPIData());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('monthly');
  const [showGoalForm, setShowGoalForm] = useState(false);
  
  const form = useForm({
    defaultValues: {
      kpiSelect: '',
      targetValue: '',
      timeframe: 'monthly',
      description: '',
      responsible: ''
    }
  });

  const filteredKPIs = selectedCategory === 'all' 
    ? kpiData 
    : kpiData.filter(kpi => kpi.category.toLowerCase() === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-50 border-green-200';
      case 'at-risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'behind': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const onSubmitGoal = (data: any) => {
    console.log('New KPI Goal:', data);
    setShowGoalForm(false);
    // Here you would typically save to backend
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 KPI Monitoring Dashboard</h1>
          <p className="text-gray-600 text-lg">Key Performance Indicators tracking and goal management system</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button 
            onClick={() => setShowGoalForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Set KPI Goal
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Label>Category:</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Label>Timeframe:</Label>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">KPI Overview</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="goals">Goal Tracking</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredKPIs.slice(0, 8).map((kpi) => (
              <Card key={kpi.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">{kpi.name}</CardTitle>
                    <Badge className={`text-xs ${getStatusColor(kpi.status)}`}>
                      {kpi.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {kpi.unit === 'BDT' ? `${(kpi.value / 1000).toFixed(0)}K` : kpi.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">{kpi.unit !== 'BDT' ? kpi.unit : ''}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Target: {kpi.unit === 'BDT' ? `${(kpi.target / 1000).toFixed(0)}K` : kpi.target.toLocaleString()}</span>
                        <span>{((kpi.value / kpi.target) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(kpi.trend)}
                        <span className={`text-xs font-medium ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(kpi.trend).toFixed(1)}%
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {kpi.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                KPI Performance Matrix
              </CardTitle>
              <CardDescription>Performance vs Target achievement across all KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Achievement Rate by Category</h3>
                  <ChartContainer
                    config={{
                      achievement: { label: "Achievement %", color: "#8884d8" }
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { category: 'Revenue', achievement: 85.2, target: 100 },
                        { category: 'Customer', achievement: 72.8, target: 100 },
                        { category: 'Operations', achievement: 68.5, target: 100 },
                        { category: 'Marketing', achievement: 78.9, target: 100 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="achievement" fill="#8884d8" />
                        <Bar dataKey="target" fill="#e0e0e0" opacity={0.3} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Priority Distribution</h3>
                  <ChartContainer
                    config={{
                      high: { label: "High Priority", color: "#ff4d4f" },
                      medium: { label: "Medium Priority", color: "#faad14" },
                      low: { label: "Low Priority", color: "#52c41a" }
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'High Priority', value: 7, color: '#ff4d4f' },
                            { name: 'Medium Priority', value: 4, color: '#faad14' },
                            { name: 'Low Priority', value: 1, color: '#52c41a' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'High Priority', value: 7, color: '#ff4d4f' },
                            { name: 'Medium Priority', value: 4, color: '#faad14' },
                            { name: 'Low Priority', value: 1, color: '#52c41a' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                KPI Trends Over Time
              </CardTitle>
              <CardDescription>Historical performance tracking for key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: { label: "Revenue (M)", color: "#8884d8" },
                  customers: { label: "Customers (K)", color: "#82ca9d" },
                  aov: { label: "AOV (K)", color: "#ffc658" },
                  conversionRate: { label: "Conversion %", color: "#ff7c7c" }
                }}
                className="h-96"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
                    <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#ff7c7c" strokeWidth={2} name="Conversion Rate" />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Analysis</CardTitle>
              <CardDescription>Revenue performance by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryPerformanceData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.category}</h3>
                        <p className="text-sm text-gray-500">Target: BDT {(category.target / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">BDT {(category.revenue / 1000).toFixed(0)}K</p>
                      <div className="flex items-center gap-1">
                        {category.growth > 0 ? 
                          <TrendingUp className="w-4 h-4 text-green-500" /> : 
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        }
                        <span className={`text-sm font-medium ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(category.growth).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Goal Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goal Progress Tracking
              </CardTitle>
              <CardDescription>Current progress towards strategic goals and objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goalProgressData.map((goal, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{goal.goal}</h3>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Current: {goal.current.toLocaleString()}</span>
                        <span>Target: {goal.target.toLocaleString()}</span>
                        <span>{goal.progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goal Setting Form */}
          {showGoalForm && (
            <Card>
              <CardHeader>
                <CardTitle>Set New KPI Goal</CardTitle>
                <CardDescription>Define targets and timeframes for KPI achievement</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitGoal)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="kpiSelect"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select KPI</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a KPI" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {kpiData.map(kpi => (
                                  <SelectItem key={kpi.id} value={kpi.id}>{kpi.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Value</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter target value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeframe</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="responsible"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Responsible Person</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter responsible person" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Describe the goal and success criteria" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button type="submit">Set Goal</Button>
                      <Button type="button" variant="outline" onClick={() => setShowGoalForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          {/* Industry Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Industry Benchmarks
              </CardTitle>
              <CardDescription>Compare your KPIs against industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>KPI</TableHead>
                    <TableHead>Your Value</TableHead>
                    <TableHead>Industry Average</TableHead>
                    <TableHead>Top Quartile</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Conversion Rate</TableCell>
                    <TableCell>3.8%</TableCell>
                    <TableCell>3.2%</TableCell>
                    <TableCell>4.8%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Above Average</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Acquisition Cost</TableCell>
                    <TableCell>BDT 450</TableCell>
                    <TableCell>BDT 380</TableCell>
                    <TableCell>BDT 320</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800">Below Average</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Average Order Value</TableCell>
                    <TableCell>BDT 1,850</TableCell>
                    <TableCell>BDT 1,650</TableCell>
                    <TableCell>BDT 2,200</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Above Average</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Retention Rate</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell>75%</TableCell>
                    <TableCell>85%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Above Average</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* KPI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                KPI Configuration
              </CardTitle>
              <CardDescription>Customize KPI tracking and alert settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Alert Thresholds</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Revenue Alert (% below target)</Label>
                      <Input type="number" placeholder="10" className="mt-1" />
                    </div>
                    <div>
                      <Label>Customer Metrics Alert</Label>
                      <Input type="number" placeholder="15" className="mt-1" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Notification Settings</h3>
                  <div className="space-y-3">
                    {[
                      'Daily KPI summary email',
                      'Weekly performance report',
                      'Goal achievement alerts',
                      'Benchmark comparison updates',
                      'Trend anomaly detection'
                    ].map((setting, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{setting}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Export Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Report Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Automated Reports</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
