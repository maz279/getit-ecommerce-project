
import React, { useState } from 'react';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
  Star,
  Activity,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const PerformanceInsightsDashboard: React.FC = () => {
  const [selectedInsightType, setSelectedInsightType] = useState('ai-insights');

  const performanceMetrics = [
    { metric: 'Sales', current: 85, benchmark: 80, target: 90 },
    { metric: 'Customer Satisfaction', current: 92, benchmark: 88, target: 95 },
    { metric: 'Operational Efficiency', current: 78, benchmark: 75, target: 85 },
    { metric: 'Marketing ROI', current: 88, benchmark: 82, target: 90 },
    { metric: 'Product Quality', current: 95, benchmark: 90, target: 98 },
    { metric: 'Delivery Performance', current: 83, benchmark: 80, target: 88 }
  ];

  const aiInsights = [
    {
      id: 1,
      type: 'opportunity',
      priority: 'high',
      title: 'Revenue Growth Opportunity',
      description: 'Electronics category shows 35% higher conversion rates during evening hours. Consider targeted evening promotions.',
      impact: 'High',
      confidence: 92,
      recommendations: [
        'Launch evening flash sales for electronics',
        'Increase inventory for high-converting evening products',
        'Send targeted evening push notifications'
      ],
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      type: 'warning',
      priority: 'medium',
      title: 'Customer Churn Risk',
      description: 'Customer segment with orders >6 months ago shows 45% churn probability. Immediate retention action needed.',
      impact: 'Medium',
      confidence: 87,
      recommendations: [
        'Launch win-back email campaign',
        'Offer personalized discounts',
        'Implement customer feedback survey'
      ],
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 3,
      type: 'optimization',
      priority: 'high',
      title: 'Inventory Optimization',
      description: 'Fashion category has 23% overstock in winter items while summer items are understocked by 18%.',
      impact: 'High',
      confidence: 95,
      recommendations: [
        'Reduce winter inventory by 25%',
        'Increase summer inventory orders',
        'Implement dynamic pricing for overstock items'
      ],
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      type: 'success',
      priority: 'low',
      title: 'Marketing Campaign Success',
      description: 'Social media campaign achieved 156% of target engagement with 23% lower cost per acquisition.',
      impact: 'Medium',
      confidence: 98,
      recommendations: [
        'Scale successful campaign elements',
        'Replicate strategy for other product categories',
        'Increase budget allocation to high-performing channels'
      ],
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const performanceTrends = [
    { month: 'Jan', overall: 75, sales: 78, customer: 82, operational: 70 },
    { month: 'Feb', overall: 78, sales: 80, customer: 85, operational: 72 },
    { month: 'Mar', overall: 82, sales: 85, customer: 88, operational: 75 },
    { month: 'Apr', overall: 85, sales: 88, customer: 90, operational: 78 },
    { month: 'May', overall: 88, sales: 90, customer: 92, operational: 82 },
    { month: 'Jun', overall: 87, sales: 89, customer: 91, operational: 81 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Performance Insights Dashboard</h1>
          <p className="text-gray-600 text-lg">AI-powered insights and performance optimization recommendations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
          <Button>
            <Lightbulb className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Insights Tabs */}
      <Tabs value={selectedInsightType} onValueChange={setSelectedInsightType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance-radar">Performance Radar</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="custom-analysis">Custom Analysis</TabsTrigger>
        </TabsList>

        {/* AI Insights */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiInsights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <Card key={insight.id} className={`${insight.bgColor} border-l-4 ${insight.color.replace('text-', 'border-')}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${insight.bgColor}`}>
                          <IconComponent className={`w-5 h-5 ${insight.color}`} />
                        </div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {insight.confidence}% Confidence
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{insight.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Impact: {insight.impact}</span>
                      <Button size="sm">Take Action</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Performance Radar */}
        <TabsContent value="performance-radar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={performanceMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Current" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Radar name="Target" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{metric.metric}</span>
                        <span className="text-sm text-gray-600">
                          {metric.current}% / {metric.target}%
                        </span>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Benchmark: {metric.benchmark}%</span>
                        <span className={metric.current >= metric.target ? 'text-green-600' : 'text-orange-600'}>
                          {metric.current >= metric.target ? 'Target Met' : 'Below Target'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trend Analysis */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="overall" stroke="#8884d8" name="Overall Performance" strokeWidth={2} />
                  <Line type="monotone" dataKey="sales" stroke="#82ca9d" name="Sales Performance" />
                  <Line type="monotone" dataKey="customer" stroke="#ffc658" name="Customer Performance" />
                  <Line type="monotone" dataKey="operational" stroke="#ff7300" name="Operational Performance" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Analysis */}
        <TabsContent value="custom-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="analysis-type">Analysis Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select analysis type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Analysis</SelectItem>
                        <SelectItem value="customer">Customer Analysis</SelectItem>
                        <SelectItem value="product">Product Analysis</SelectItem>
                        <SelectItem value="marketing">Marketing Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 90 Days</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="metrics">Select Metrics</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose metrics" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="orders">Orders</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                        <SelectItem value="conversion">Conversion Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Analysis
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-query">Custom Analysis Query</Label>
                    <Textarea
                      id="custom-query"
                      placeholder="Describe what you want to analyze... e.g., 'Compare sales performance between different product categories for the last quarter'"
                      rows={6}
                    />
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    AI Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Run an analysis to see results here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
