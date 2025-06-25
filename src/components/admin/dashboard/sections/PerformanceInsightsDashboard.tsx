
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
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
  Plus,
  Lightbulb,
  Activity,
  Database,
  ChartLine,
  Cpu,
  HardDrive,
  Network,
  Server,
  Shield,
  UserCheck,
  Search,
  Bell
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Performance Insights Data Types
interface PerformanceInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'opportunity' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  confidence: number;
  actionRequired: boolean;
  estimatedImpact: string;
  timeframe: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
}

interface UserBehaviorMetrics {
  bounceRate: number;
  sessionDuration: number;
  pageViews: number;
  conversionFunnel: Array<{ stage: string; users: number; dropoff: number }>;
  heatmapData: Array<{ x: number; y: number; intensity: number }>;
}

// Sample Data Generation
const generatePerformanceInsights = (): PerformanceInsight[] => [
  {
    id: '1',
    type: 'recommendation',
    title: 'Optimize Product Image Loading',
    description: 'Product images are loading 2.3s slower than optimal. Implementing lazy loading could improve page load times by 40%.',
    impact: 'high',
    category: 'Performance',
    confidence: 92,
    actionRequired: true,
    estimatedImpact: '+15% conversion rate',
    timeframe: '2-3 days'
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Cross-sell Opportunity Detected',
    description: 'Users viewing electronics show 78% likelihood to purchase accessories. Implement dynamic recommendations.',
    impact: 'high',
    category: 'Revenue',
    confidence: 87,
    actionRequired: false,
    estimatedImpact: '+৳45,000 monthly revenue',
    timeframe: '1 week'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Unusual Traffic Pattern',
    description: 'Traffic from mobile devices dropped 15% in the last 24 hours. Potential mobile UX issue detected.',
    impact: 'medium',
    category: 'User Experience',
    confidence: 76,
    actionRequired: true,
    estimatedImpact: 'Prevent 8% revenue loss',
    timeframe: 'Immediate'
  },
  {
    id: '4',
    type: 'trend',
    title: 'Seasonal Demand Prediction',
    description: 'Fashion category expected to surge 35% next week based on historical patterns and social trends.',
    impact: 'medium',
    category: 'Inventory',
    confidence: 84,
    actionRequired: false,
    estimatedImpact: '+12% margin optimization',
    timeframe: '1 week'
  }
];

const systemMetricsData: SystemMetrics = {
  cpu: 67,
  memory: 74,
  disk: 82,
  network: 56,
  responseTime: 245,
  throughput: 1247,
  errorRate: 0.12,
  availability: 99.97
};

const userBehaviorData: UserBehaviorMetrics = {
  bounceRate: 32,
  sessionDuration: 4.2,
  pageViews: 8.7,
  conversionFunnel: [
    { stage: 'Homepage', users: 10000, dropoff: 0 },
    { stage: 'Category Page', users: 7500, dropoff: 25 },
    { stage: 'Product Page', users: 5200, dropoff: 31 },
    { stage: 'Add to Cart', users: 2800, dropoff: 46 },
    { stage: 'Checkout', users: 1900, dropoff: 32 },
    { stage: 'Purchase', users: 1520, dropoff: 20 }
  ],
  heatmapData: Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    intensity: Math.random() * 100
  }))
};

const performanceTrendData = [
  { date: '2024-06-20', pageLoad: 2.1, conversionRate: 3.2, bounceRate: 35, revenue: 185000 },
  { date: '2024-06-21', pageLoad: 2.3, conversionRate: 3.0, bounceRate: 38, revenue: 172000 },
  { date: '2024-06-22', pageLoad: 1.9, conversionRate: 3.8, bounceRate: 29, revenue: 203000 },
  { date: '2024-06-23', pageLoad: 2.0, conversionRate: 3.6, bounceRate: 31, revenue: 198000 },
  { date: '2024-06-24', pageLoad: 1.8, conversionRate: 4.1, bounceRate: 27, revenue: 225000 },
  { date: '2024-06-25', pageLoad: 1.7, conversionRate: 4.3, bounceRate: 25, revenue: 234000 }
];

const competitorBenchmarkData = [
  { metric: 'Page Load Speed', ourValue: 1.8, competitor1: 2.1, competitor2: 2.4, industry: 2.2 },
  { metric: 'Conversion Rate', ourValue: 4.3, competitor1: 3.8, competitor2: 3.5, industry: 3.9 },
  { metric: 'Mobile Experience', ourValue: 87, competitor1: 82, competitor2: 79, industry: 83 },
  { metric: 'Customer Satisfaction', ourValue: 4.6, competitor1: 4.2, competitor2: 4.1, industry: 4.3 }
];

export const PerformanceInsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<PerformanceInsight[]>(generatePerformanceInsights());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7d');
  const [showInsightForm, setShowInsightForm] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const form = useForm({
    defaultValues: {
      insightType: '',
      category: '',
      title: '',
      description: '',
      impact: 'medium',
      actionRequired: false,
      estimatedImpact: '',
      timeframe: ''
    }
  });

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category.toLowerCase() === selectedCategory);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'opportunity': return <Target className="w-5 h-5 text-green-500" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const onSubmitInsight = (data: any) => {
    const newInsight: PerformanceInsight = {
      id: Date.now().toString(),
      type: data.insightType,
      title: data.title,
      description: data.description,
      impact: data.impact,
      category: data.category,
      confidence: Math.floor(Math.random() * 20) + 80,
      actionRequired: data.actionRequired,
      estimatedImpact: data.estimatedImpact,
      timeframe: data.timeframe
    };
    setInsights([newInsight, ...insights]);
    setShowInsightForm(false);
    form.reset();
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        console.log('Refreshing performance insights...');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🧠 Performance Insights Dashboard</h1>
          <p className="text-gray-600 text-lg">AI-powered insights and advanced performance optimization recommendations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <Label className="text-sm">Auto Refresh</Label>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button 
            onClick={() => setShowInsightForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Insight
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
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="user experience">User Experience</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
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
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="user-behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="benchmarks">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Insights</p>
                    <p className="text-3xl font-bold text-blue-800">{insights.length}</p>
                  </div>
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Action Required</p>
                    <p className="text-3xl font-bold text-red-800">
                      {insights.filter(i => i.actionRequired).length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Opportunities</p>
                    <p className="text-3xl font-bold text-green-800">
                      {insights.filter(i => i.type === 'opportunity').length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Avg Confidence</p>
                    <p className="text-3xl font-bold text-purple-800">
                      {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>Actionable recommendations powered by machine learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getInsightIcon(insight.type)}
                        <div>
                          <h3 className="font-semibold text-lg">{insight.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{insight.type} • {insight.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                        <Badge variant="outline">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{insight.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm"><strong>Impact:</strong> {insight.estimatedImpact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm"><strong>Timeframe:</strong> {insight.timeframe}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {insight.actionRequired ? (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm">
                          <strong>Status:</strong> {insight.actionRequired ? 'Action Required' : 'Monitoring'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {insight.actionRequired && (
                        <Button size="sm" variant="outline">
                          <Zap className="w-4 h-4 mr-1" />
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">CPU Usage</span>
                  </div>
                  <span className="text-2xl font-bold">{systemMetricsData.cpu}%</span>
                </div>
                <Progress value={systemMetricsData.cpu} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Memory Usage</span>
                  </div>
                  <span className="text-2xl font-bold">{systemMetricsData.memory}%</span>
                </div>
                <Progress value={systemMetricsData.memory} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Network I/O</span>
                  </div>
                  <span className="text-2xl font-bold">{systemMetricsData.network}%</span>
                </div>
                <Progress value={systemMetricsData.network} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Availability</span>
                  </div>
                  <span className="text-2xl font-bold">{systemMetricsData.availability}%</span>
                </div>
                <Progress value={systemMetricsData.availability} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Key performance metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  pageLoad: { label: "Page Load (s)", color: "#8884d8" },
                  conversionRate: { label: "Conversion Rate (%)", color: "#82ca9d" },
                  bounceRate: { label: "Bounce Rate (%)", color: "#ffc658" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line yAxisId="left" type="monotone" dataKey="pageLoad" stroke="#8884d8" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#82ca9d" strokeWidth={2} />
                    <Bar yAxisId="right" dataKey="bounceRate" fill="#ffc658" opacity={0.6} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-behavior" className="space-y-6">
          {/* User Behavior Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                    <p className="text-3xl font-bold">{userBehaviorData.bounceRate}%</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                    <p className="text-3xl font-bold">{userBehaviorData.sessionDuration}m</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pages per Session</p>
                    <p className="text-3xl font-bold">{userBehaviorData.pageViews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
              <CardDescription>User journey and drop-off points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBehaviorData.conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{stage.stage}</h3>
                          <p className="text-sm text-gray-600">{stage.users.toLocaleString()} users</p>
                        </div>
                      </div>
                      {stage.dropoff > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-red-600 font-medium">-{stage.dropoff}% drop-off</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(stage.users * stage.dropoff / 100).toLocaleString()} users lost
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <Progress value={100 - stage.dropoff} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          {/* Competitive Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Benchmark Analysis</CardTitle>
              <CardDescription>Performance comparison with industry leaders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Our Performance</TableHead>
                    <TableHead>Competitor A</TableHead>
                    <TableHead>Competitor B</TableHead>
                    <TableHead>Industry Average</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitorBenchmarkData.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{metric.metric}</TableCell>
                      <TableCell className="font-bold text-blue-600">
                        {metric.ourValue}{metric.metric.includes('Rate') || metric.metric.includes('Experience') || metric.metric.includes('Satisfaction') ? (metric.ourValue > 10 ? '' : '%') : 's'}
                      </TableCell>
                      <TableCell>{metric.competitor1}{metric.metric.includes('Rate') || metric.metric.includes('Experience') || metric.metric.includes('Satisfaction') ? (metric.competitor1 > 10 ? '' : '%') : 's'}</TableCell>
                      <TableCell>{metric.competitor2}{metric.metric.includes('Rate') || metric.metric.includes('Experience') || metric.metric.includes('Satisfaction') ? (metric.competitor2 > 10 ? '' : '%') : 's'}</TableCell>
                      <TableCell>{metric.industry}{metric.metric.includes('Rate') || metric.metric.includes('Experience') || metric.metric.includes('Satisfaction') ? (metric.industry > 10 ? '' : '%') : 's'}</TableCell>
                      <TableCell>
                        {metric.ourValue > metric.industry ? (
                          <Badge className="bg-green-100 text-green-800">Above Average</Badge>
                        ) : metric.ourValue === metric.industry ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Below Average</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Predictive Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Predictive Analytics & Forecasting
              </CardTitle>
              <CardDescription>AI-powered predictions based on historical data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Revenue Forecast (Next 30 Days)</h3>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-800">৳ 7,235,000</div>
                    <div className="text-sm text-green-600">+18.5% vs last month</div>
                    <div className="text-xs text-gray-600 mt-2">Confidence: 87%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Traffic Prediction</h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-800">2.4M visits</div>
                    <div className="text-sm text-blue-600">+12.3% expected growth</div>
                    <div className="text-xs text-gray-600 mt-2">Confidence: 82%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Inventory Alerts</h3>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-800">15 items</div>
                    <div className="text-sm text-yellow-600">Expected stockouts</div>
                    <div className="text-xs text-gray-600 mt-2">Next 7 days</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Customer Churn Risk</h3>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-800">3.2%</div>
                    <div className="text-sm text-red-600">At-risk customers</div>
                    <div className="text-xs text-gray-600 mt-2">Require attention</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Performance Insights Configuration
              </CardTitle>
              <CardDescription>Configure AI insights, alerts, and monitoring settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">AI Insights Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Insight Generation Frequency</Label>
                      <Select defaultValue="hourly">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
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
                      <Label>Minimum Confidence Threshold</Label>
                      <Input type="number" placeholder="75" className="mt-1" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Alert Preferences</h3>
                  <div className="space-y-3">
                    {[
                      'Performance degradation alerts',
                      'Revenue opportunity notifications',
                      'User behavior anomaly detection',
                      'Competitive benchmark changes',
                      'Predictive model updates'
                    ].map((setting, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{setting}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Data Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Analytics Platform</Label>
                      <Select defaultValue="internal">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal Analytics</SelectItem>
                          <SelectItem value="google">Google Analytics</SelectItem>
                          <SelectItem value="mixpanel">Mixpanel</SelectItem>
                          <SelectItem value="custom">Custom Integration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Performance Monitoring</Label>
                      <Select defaultValue="built-in">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="built-in">Built-in Monitoring</SelectItem>
                          <SelectItem value="newrelic">New Relic</SelectItem>
                          <SelectItem value="datadog">Datadog</SelectItem>
                          <SelectItem value="custom">Custom Solution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Insight Form */}
          {showInsightForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add Custom Performance Insight</CardTitle>
                <CardDescription>Create a custom insight or recommendation</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitInsight)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="insightType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insight Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="recommendation">Recommendation</SelectItem>
                                <SelectItem value="alert">Alert</SelectItem>
                                <SelectItem value="opportunity">Opportunity</SelectItem>
                                <SelectItem value="trend">Trend</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Performance, Revenue" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="impact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Impact Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Implementation Timeframe</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1 week, 2-3 days" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief insight title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Detailed description of the insight" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedImpact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Impact</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., +15% conversion rate, +৳50,000 revenue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="actionRequired"
                        {...form.register('actionRequired')}
                      />
                      <Label htmlFor="actionRequired">Requires immediate action</Label>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit">Add Insight</Button>
                      <Button type="button" variant="outline" onClick={() => setShowInsightForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
