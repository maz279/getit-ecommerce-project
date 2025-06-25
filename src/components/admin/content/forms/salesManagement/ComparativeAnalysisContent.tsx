import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ComposedChart, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Calendar, Download, RefreshCw, Plus, Target, ArrowUpRight, ArrowDownRight, Filter, Eye } from 'lucide-react';

// Sample data for comparative analysis
const periodComparison = [
  { month: 'Jan 2024', currentYear: 1250000, previousYear: 980000, industry: 1100000, growth: 27.6 },
  { month: 'Feb 2024', currentYear: 1480000, previousYear: 1150000, industry: 1300000, growth: 28.7 },
  { month: 'Mar 2024', currentYear: 1750000, previousYear: 1320000, industry: 1550000, growth: 32.6 },
  { month: 'Apr 2024', currentYear: 2100000, previousYear: 1580000, industry: 1850000, growth: 32.9 },
  { month: 'May 2024', currentYear: 2350000, previousYear: 1820000, industry: 2100000, growth: 29.1 },
  { month: 'Jun 2024', currentYear: 2650000, previousYear: 2100000, industry: 2350000, growth: 26.2 }
];

const competitorComparison = [
  { metric: 'Market Share', ourPerformance: 28.5, competitor1: 32.1, competitor2: 24.8, competitor3: 18.9, industryAvg: 26.1 },
  { metric: 'Customer Satisfaction', ourPerformance: 4.6, competitor1: 4.4, competitor2: 4.2, competitor3: 4.1, industryAvg: 4.3 },
  { metric: 'Price Competitiveness', ourPerformance: 85, competitor1: 78, competitor2: 92, competitor3: 68, industryAvg: 81 },
  { metric: 'Product Quality', ourPerformance: 4.7, competitor1: 4.5, competitor2: 4.3, competitor3: 4.0, industryAvg: 4.4 },
  { metric: 'Delivery Speed', ourPerformance: 88, competitor1: 85, competitor2: 79, competitor3: 82, industryAvg: 84 },
  { metric: 'Brand Recognition', ourPerformance: 72, competitor1: 89, competitor2: 65, competitor3: 45, industryAvg: 68 }
];

const categoryComparison = [
  { category: 'Electronics', q1Sales: 580000, q2Sales: 720000, q1Growth: 15.2, q2Growth: 24.1, marketShare: 32.5, competitorAvg: 28.3 },
  { category: 'Fashion', q1Sales: 450000, q2Sales: 580000, q1Growth: 18.7, q2Growth: 28.9, marketShare: 26.8, competitorAvg: 31.2 },
  { category: 'Home & Garden', q1Sales: 320000, q2Sales: 420000, q1Growth: 12.1, q2Growth: 31.3, marketShare: 22.1, competitorAvg: 24.8 },
  { category: 'Sports', q1Sales: 280000, q2Sales: 350000, q1Growth: 8.9, q2Growth: 25.0, marketShare: 18.5, competitorAvg: 20.1 },
  { category: 'Beauty', q1Sales: 220000, q2Sales: 310000, q1Growth: 22.3, q2Growth: 40.9, marketShare: 15.2, competitorAvg: 18.7 }
];

const regionalComparison = [
  { region: 'Dhaka Division', currentSales: 3250000, previousSales: 2850000, growth: 14.0, marketShare: 45.2, competitorShare: 38.5 },
  { region: 'Chittagong Division', currentSales: 1850000, previousSales: 1620000, growth: 14.2, marketShare: 28.5, competitorShare: 31.2 },
  { region: 'Sylhet Division', currentSales: 650000, previousSales: 580000, growth: 12.1, marketShare: 18.9, competitorShare: 22.1 },
  { region: 'Rajshahi Division', currentSales: 580000, previousSales: 520000, growth: 11.5, marketShare: 16.2, competitorShare: 19.8 },
  { region: 'Khulna Division', currentSales: 520000, previousSales: 480000, growth: 8.3, marketShare: 14.8, competitorShare: 17.2 }
];

const performanceMetrics = [
  { metric: 'Revenue Growth', value: 28.5, benchmark: 22.1, status: 'outperforming', trend: 'up' },
  { metric: 'Customer Acquisition', value: 15.2, benchmark: 18.7, status: 'underperforming', trend: 'down' },
  { metric: 'Average Order Value', value: 156, benchmark: 142, status: 'outperforming', trend: 'up' },
  { metric: 'Conversion Rate', value: 4.3, benchmark: 3.8, status: 'outperforming', trend: 'up' },
  { metric: 'Customer Retention', value: 78.5, benchmark: 82.1, status: 'underperforming', trend: 'down' },
  { metric: 'Return Rate', value: 2.1, benchmark: 2.8, status: 'outperforming', trend: 'down' }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const ComparativeAnalysisContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');
  const [comparisonType, setComparisonType] = useState('period');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analysisData, setAnalysisData] = useState({
    comparisonName: '',
    primaryPeriod: '',
    secondaryPeriod: '',
    metrics: [] as string[],
    includeCompetitors: false,
    includeIndustryBenchmark: true,
    segmentBy: 'category',
    analysisType: 'growth'
  });

  const addMetric = (metric: string) => {
    if (!analysisData.metrics.includes(metric)) {
      setAnalysisData(prev => ({
        ...prev,
        metrics: [...prev.metrics, metric]
      }));
    }
  };

  const removeMetric = (metric: string) => {
    setAnalysisData(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m !== metric)
    }));
  };

  const generateComparison = () => {
    console.log('Generating comparative analysis with data:', analysisData);
    // Here you would typically call an API to generate the comparison
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Comparative Analysis
          </h1>
          <p className="text-gray-600 mt-1">Compare performance across periods, competitors, and benchmarks</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Comparison
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtd">Month to Date</SelectItem>
                  <SelectItem value="qtd">Quarter to Date</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Comparison Type</Label>
              <Select value={comparisonType} onValueChange={setComparisonType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="period">Period vs Period</SelectItem>
                  <SelectItem value="competitor">vs Competitors</SelectItem>
                  <SelectItem value="benchmark">vs Benchmark</SelectItem>
                  <SelectItem value="segment">Segment Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="growth">Growth Rate</SelectItem>
                  <SelectItem value="market-share">Market Share</SelectItem>
                  <SelectItem value="customer-metrics">Customer Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="ml-auto">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="periods">Period Comparison</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Performance</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="builder">Analysis Builder</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Performance Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className={`border-l-4 ${metric.status === 'outperforming' ? 'border-green-500' : 'border-red-500'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {metric.metric}
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className={`w-4 h-4 ${metric.status === 'outperforming' ? 'text-green-600' : 'text-red-600'}`} />
                    ) : (
                      <ArrowDownRight className={`w-4 h-4 ${metric.status === 'outperforming' ? 'text-green-600' : 'text-red-600'}`} />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{metric.value}{metric.metric.includes('Rate') || metric.metric.includes('Growth') ? '%' : ''}</div>
                      <div className="text-sm text-gray-600">vs {metric.benchmark}{metric.metric.includes('Rate') || metric.metric.includes('Growth') ? '%' : ''} benchmark</div>
                    </div>
                    <Badge className={metric.status === 'outperforming' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {metric.status === 'outperforming' ? 'Outperforming' : 'Underperforming'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparative Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Comparison Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    currentYear: { label: "2024", color: "#3b82f6" },
                    previousYear: { label: "2023", color: "#10b981" },
                    industry: { label: "Industry Avg", color: "#f59e0b" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={periodComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="currentYear" stroke="#3b82f6" strokeWidth={3} />
                      <Line type="monotone" dataKey="previousYear" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="industry" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Rate Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    growth: { label: "Growth %", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={periodComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="growth" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Period Comparison Tab */}
        <TabsContent value="periods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Period-over-Period Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  currentYear: { label: "Current Period", color: "#3b82f6" },
                  previousYear: { label: "Previous Period", color: "#10b981" }
                }}
                className="h-96"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={periodComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="currentYear" fill="#3b82f6" name="Current Year" />
                    <Bar yAxisId="left" dataKey="previousYear" fill="#10b981" name="Previous Year" />
                    <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#ef4444" strokeWidth={3} name="Growth %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {periodComparison.map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{period.month}</p>
                        <p className="text-sm text-gray-600">৳{(period.currentYear / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${period.growth > 25 ? 'text-green-600' : 'text-orange-600'}`}>
                          +{period.growth}%
                        </div>
                        <p className="text-xs text-gray-500">vs previous year</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">Strong Growth</h4>
                    <p className="text-sm text-green-700">Average growth of 29.5% YoY across all months</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Above Industry Average</h4>
                    <p className="text-sm text-blue-700">Consistently outperforming industry benchmarks</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800">Growth Stabilizing</h4>
                    <p className="text-sm text-orange-700">Growth rate moderating from peak levels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competitor Analysis Tab */}
        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Benchmark Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  ourPerformance: { label: "Our Performance", color: "#3b82f6" },
                  competitor1: { label: "Competitor A", color: "#10b981" },
                  competitor2: { label: "Competitor B", color: "#f59e0b" },
                  industryAvg: { label: "Industry Average", color: "#ef4444" }
                }}
                className="h-96"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={competitorComparison}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar name="Our Performance" dataKey="ourPerformance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Competitor A" dataKey="competitor1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                    <Radar name="Industry Average" dataKey="industryAvg" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Competitive Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorComparison.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{item.metric}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={item.ourPerformance > item.industryAvg ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                          {item.ourPerformance > item.industryAvg ? 'Above Average' : 'Below Average'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Our Performance</span>
                        <div className="font-bold text-blue-600">{item.ourPerformance}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Competitor A</span>
                        <div className="font-bold">{item.competitor1}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Competitor B</span>
                        <div className="font-bold">{item.competitor2}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Competitor C</span>
                        <div className="font-bold">{item.competitor3}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Industry Avg</span>
                        <div className="font-bold text-red-600">{item.industryAvg}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Performance Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  q1Sales: { label: "Q1 Sales", color: "#3b82f6" },
                  q2Sales: { label: "Q2 Sales", color: "#10b981" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="q1Sales" fill="#3b82f6" />
                    <Bar dataKey="q2Sales" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Analysis Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryComparison.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{category.category}</h4>
                      <p className="text-sm text-gray-600">Market Share: {category.marketShare}%</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Q1 Growth</div>
                        <div className="font-bold text-blue-600">{category.q1Growth}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Q2 Growth</div>
                        <div className="font-bold text-green-600">{category.q2Growth}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">vs Competitors</div>
                        <div className={`font-bold ${category.marketShare > category.competitorAvg ? 'text-green-600' : 'text-red-600'}`}>
                          {category.marketShare > category.competitorAvg ? '+' : ''}{(category.marketShare - category.competitorAvg).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Analysis Tab */}
        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalComparison.map((region, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{region.region}</h4>
                      <Badge className={region.growth > 12 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {region.growth > 12 ? 'Strong Growth' : 'Moderate Growth'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Current Sales</span>
                        <div className="font-bold">৳{(region.currentSales / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Growth Rate</span>
                        <div className="font-bold text-green-600">{region.growth}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Our Market Share</span>
                        <div className="font-bold text-blue-600">{region.marketShare}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Competitor Share</span>
                        <div className="font-bold text-red-600">{region.competitorShare}%</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Market Position</span>
                        <span>Our Share vs Competition</span>
                      </div>
                      <Progress value={(region.marketShare / (region.marketShare + region.competitorShare)) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Builder Tab */}
        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Comparative Analysis Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comparisonName">Comparison Name</Label>
                    <Input
                      id="comparisonName"
                      value={analysisData.comparisonName}
                      onChange={(e) => setAnalysisData(prev => ({ ...prev, comparisonName: e.target.value }))}
                      placeholder="Enter comparison name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryPeriod">Primary Period</Label>
                    <Select value={analysisData.primaryPeriod} onValueChange={(value) => setAnalysisData(prev => ({ ...prev, primaryPeriod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="current-quarter">Current Quarter</SelectItem>
                        <SelectItem value="current-year">Current Year</SelectItem>
                        <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                        <SelectItem value="custom">Custom Period</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryPeriod">Secondary Period</Label>
                    <Select value={analysisData.secondaryPeriod} onValueChange={(value) => setAnalysisData(prev => ({ ...prev, secondaryPeriod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select secondary period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="previous-month">Previous Month</SelectItem>
                        <SelectItem value="previous-quarter">Previous Quarter</SelectItem>
                        <SelectItem value="previous-year">Previous Year</SelectItem>
                        <SelectItem value="same-period-last-year">Same Period Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segmentBy">Segment Analysis By</Label>
                    <Select value={analysisData.segmentBy} onValueChange={(value) => setAnalysisData(prev => ({ ...prev, segmentBy: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select segmentation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Product Category</SelectItem>
                        <SelectItem value="region">Geographic Region</SelectItem>
                        <SelectItem value="customer-segment">Customer Segment</SelectItem>
                        <SelectItem value="vendor">Vendor Performance</SelectItem>
                        <SelectItem value="channel">Sales Channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Selected Metrics</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                      {analysisData.metrics.map((metric, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeMetric(metric)}>
                          {metric} ×
                        </Badge>
                      ))}
                      {analysisData.metrics.length === 0 && (
                        <span className="text-gray-400 text-sm">No metrics selected</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Available Metrics</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Revenue', 'Orders', 'Customers', 'AOV', 'Conversion Rate', 'Return Rate', 'Market Share', 'Growth Rate'].map((metric) => (
                        <Button
                          key={metric}
                          variant="outline"
                          size="sm"
                          onClick={() => addMetric(metric)}
                          disabled={analysisData.metrics.includes(metric)}
                        >
                          {metric}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeCompetitors"
                        checked={analysisData.includeCompetitors}
                        onChange={(e) => setAnalysisData(prev => ({ ...prev, includeCompetitors: e.target.checked }))}
                      />
                      <Label htmlFor="includeCompetitors">Include Competitor Benchmarks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeIndustryBenchmark"
                        checked={analysisData.includeIndustryBenchmark}
                        onChange={(e) => setAnalysisData(prev => ({ ...prev, includeIndustryBenchmark: e.target.checked }))}
                      />
                      <Label htmlFor="includeIndustryBenchmark">Include Industry Benchmarks</Label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={generateComparison} className="flex-1">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Analysis
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
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
