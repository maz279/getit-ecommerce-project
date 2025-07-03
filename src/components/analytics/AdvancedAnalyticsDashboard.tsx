import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Globe,
  Smartphone,
  Monitor,
  Brain,
  Target,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Eye,
  MousePointer,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  bounceRate: number;
  averageSessionDuration: number;
  mobileTraffic: number;
  pageViews: number;
  uniqueVisitors: number;
}

interface GeographicData {
  region: string;
  users: number;
  revenue: number;
  percentage: number;
  growthRate: number;
}

interface DeviceData {
  device: string;
  users: number;
  percentage: number;
  conversionRate: number;
  bounceRate: number;
}

interface FunnelData {
  stage: string;
  users: number;
  dropoffRate: number;
  conversionFromPrevious: number;
}

interface PredictiveInsight {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  impactFactors: string[];
}

interface BehaviorData {
  action: string;
  count: number;
  percentage: number;
  avgTimeSpent: number;
}

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [behaviorData, setBehaviorData] = useState<BehaviorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, selectedMetric]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Enhanced platform metrics
      const mockMetrics: PlatformMetrics = {
        totalUsers: 45620 + Math.floor(Math.random() * 5000),
        activeUsers: 12450 + Math.floor(Math.random() * 2000),
        totalOrders: 8930 + Math.floor(Math.random() * 1000),
        totalRevenue: 2340000 + Math.floor(Math.random() * 500000),
        conversionRate: 3.8 + Math.random() * 1.5,
        bounceRate: 42.5 + Math.random() * 10,
        averageSessionDuration: 8.2 + Math.random() * 3,
        mobileTraffic: 68.5 + Math.random() * 8,
        pageViews: 156780 + Math.floor(Math.random() * 30000),
        uniqueVisitors: 34890 + Math.floor(Math.random() * 5000)
      };
      
      // Enhanced geographic data with growth rates
      const mockGeographic: GeographicData[] = [
        { region: 'Dhaka', users: 15620, revenue: 890000, percentage: 34.2, growthRate: 15.8 },
        { region: 'Chittagong', users: 9840, revenue: 450000, percentage: 21.6, growthRate: 12.3 },
        { region: 'Sylhet', users: 6750, revenue: 320000, percentage: 14.8, growthRate: 18.9 },
        { region: 'Rajshahi', users: 5890, revenue: 280000, percentage: 12.9, growthRate: 8.7 },
        { region: 'Khulna', users: 4520, revenue: 210000, percentage: 9.9, growthRate: 11.2 },
        { region: 'Others', users: 3000, revenue: 190000, percentage: 6.6, growthRate: 22.4 }
      ];
      
      // Enhanced device data with detailed metrics
      const mockDevice: DeviceData[] = [
        { device: 'Mobile', users: 31280, percentage: 68.5, conversionRate: 3.2, bounceRate: 45.2 },
        { device: 'Desktop', users: 11050, percentage: 24.2, conversionRate: 4.8, bounceRate: 35.6 },
        { device: 'Tablet', users: 3290, percentage: 7.3, conversionRate: 2.9, bounceRate: 52.1 }
      ];
      
      // Enhanced funnel data with conversion rates
      const mockFunnel: FunnelData[] = [
        { stage: 'Website Visits', users: 45620, dropoffRate: 0, conversionFromPrevious: 100 },
        { stage: 'Product Views', users: 32150, dropoffRate: 29.5, conversionFromPrevious: 70.5 },
        { stage: 'Add to Cart', users: 18420, dropoffRate: 42.7, conversionFromPrevious: 57.3 },
        { stage: 'Checkout Started', users: 12680, dropoffRate: 31.2, conversionFromPrevious: 68.8 },
        { stage: 'Payment', users: 9840, dropoffRate: 22.4, conversionFromPrevious: 77.6 },
        { stage: 'Order Completed', users: 8930, dropoffRate: 9.2, conversionFromPrevious: 90.8 }
      ];
      
      // Enhanced predictive insights with impact factors
      const mockInsights: PredictiveInsight[] = [
        { 
          metric: 'Monthly Revenue', 
          currentValue: 2340000, 
          predictedValue: 2580000, 
          confidence: 87, 
          trend: 'up',
          impactFactors: ['Seasonal trends', 'Marketing campaigns', 'Product launches']
        },
        { 
          metric: 'New Users', 
          currentValue: 12450, 
          predictedValue: 13200, 
          confidence: 82, 
          trend: 'up',
          impactFactors: ['SEO improvements', 'Social media growth', 'Referral programs']
        },
        { 
          metric: 'Conversion Rate', 
          currentValue: 3.8, 
          predictedValue: 4.1, 
          confidence: 78, 
          trend: 'up',
          impactFactors: ['UX improvements', 'Payment options', 'Trust indicators']
        },
        { 
          metric: 'Customer Retention', 
          currentValue: 68.5, 
          predictedValue: 71.2, 
          confidence: 85, 
          trend: 'up',
          impactFactors: ['Loyalty programs', 'Customer service', 'Product quality']
        }
      ];

      // User behavior analysis
      const mockBehaviorData: BehaviorData[] = [
        { action: 'Product Search', count: 45620, percentage: 28.5, avgTimeSpent: 45 },
        { action: 'Category Browse', count: 38920, percentage: 24.3, avgTimeSpent: 120 },
        { action: 'Product View', count: 32150, percentage: 20.1, avgTimeSpent: 90 },
        { action: 'Cart Actions', count: 18420, percentage: 11.5, avgTimeSpent: 180 },
        { action: 'Compare Products', count: 12680, percentage: 7.9, avgTimeSpent: 210 },
        { action: 'Wishlist Actions', count: 8930, percentage: 5.6, avgTimeSpent: 60 },
        { action: 'Reviews/Ratings', count: 3420, percentage: 2.1, avgTimeSpent: 240 }
      ];
      
      setMetrics(mockMetrics);
      setGeographicData(mockGeographic);
      setDeviceData(mockDevice);
      setFunnelData(mockFunnel);
      setPredictiveInsights(mockInsights);
      setBehaviorData(mockBehaviorData);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-5 h-5 text-orange-500" />;
      case 'desktop': return <Monitor className="w-5 h-5 text-blue-500" />;
      case 'tablet': return <Monitor className="w-5 h-5 text-purple-500" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive platform insights with predictive AI analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={loadAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{metrics?.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% from last month
            </div>
            <Progress value={75} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics?.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">of {metrics?.totalUsers.toLocaleString()} total</p>
            <Progress value={(metrics?.activeUsers || 0) / (metrics?.totalUsers || 1) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics?.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Industry avg: 2.8%</p>
            <Progress value={metrics?.conversionRate || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Traffic</CardTitle>
            <Smartphone className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics?.mobileTraffic.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Bounce rate: {deviceData.find(d => d.device === 'Mobile')?.bounceRate.toFixed(1)}%</p>
            <Progress value={metrics?.mobileTraffic || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{metrics?.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{metrics?.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Unique sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{metrics?.averageSessionDuration.toFixed(1)}m</div>
            <p className="text-xs text-muted-foreground">Duration per visit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{metrics?.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Single page visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="predictive">Predictive AI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key metrics and growth indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Revenue Growth</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User Acquisition</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600">+8.9%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conversion Optimization</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-purple-600">+15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>How users find your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Organic Search</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Direct</span>
                    <div className="flex items-center gap-2">
                      <Progress value={28} className="w-20" />
                      <span className="text-sm">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social Media</span>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-20" />
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Referral</span>
                    <div className="flex items-center gap-2">
                      <Progress value={12} className="w-20" />
                      <span className="text-sm">12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User and revenue distribution by region with growth rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{region.region}</h3>
                        <p className="text-sm text-muted-foreground">{region.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{region.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={region.percentage} className="w-20" />
                        <span className="text-xs text-muted-foreground">{region.percentage}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <TrendingUp className={`w-3 h-3 ${region.growthRate > 0 ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={region.growthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                          +{region.growthRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Device Analytics</CardTitle>
              <CardDescription>Detailed user behavior across different devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceData.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device.device)}
                      <div>
                        <h3 className="font-medium">{device.device}</h3>
                        <p className="text-sm text-muted-foreground">{device.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{device.percentage}%</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-1">
                        <span>Conv: {device.conversionRate}%</span>
                        <span>Bounce: {device.bounceRate}%</span>
                      </div>
                      <Progress value={device.percentage} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>User Behavior Analysis</CardTitle>
              <CardDescription>Understanding how users interact with your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {behaviorData.map((behavior, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{behavior.action}</h3>
                        <p className="text-sm text-muted-foreground">
                          {behavior.count.toLocaleString()} actions • Avg: {behavior.avgTimeSpent}s
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{behavior.percentage}%</p>
                      <Progress value={behavior.percentage} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
              <CardDescription>User journey and conversion optimization insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{stage.stage}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stage.users.toLocaleString()} users • {stage.conversionFromPrevious.toFixed(1)}% from previous
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {stage.dropoffRate > 0 && (
                        <p className="text-sm text-red-600">-{stage.dropoffRate}% dropoff</p>
                      )}
                      <Progress value={Math.max(0, 100 - stage.dropoffRate)} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Predictive Analytics & AI Insights
                </CardTitle>
                <CardDescription>Machine learning predictions and business intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{insight.metric}</h3>
                          {getTrendIcon(insight.trend)}
                        </div>
                        <Badge variant="outline">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Current</p>
                          <p className="text-lg font-semibold">{insight.currentValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Predicted</p>
                          <p className="text-lg font-semibold text-blue-600">{insight.predictedValue.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Progress value={insight.confidence} className="h-2" />
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Key Impact Factors:</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.impactFactors.map((factor, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
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
                  <Zap className="w-5 h-5 text-yellow-500" />
                  AI-Powered Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Mobile Optimization Priority</h4>
                    <p className="text-sm text-blue-700">
                      68.5% mobile traffic with 45.2% bounce rate suggests mobile UX improvements could increase conversions by 15-20%
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-1">Geographic Expansion</h4>
                    <p className="text-sm text-green-700">
                      Sylhet shows highest growth rate (18.9%) - consider targeted marketing campaigns for this region
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-1">Conversion Funnel Optimization</h4>
                    <p className="text-sm text-purple-700">
                      42.7% dropoff at "Add to Cart" stage - implement cart abandonment recovery and simplified checkout process
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-1">Seasonal Strategy</h4>
                    <p className="text-sm text-orange-700">
                      AI models predict 25% revenue increase during upcoming festival season - prepare inventory and marketing campaigns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};