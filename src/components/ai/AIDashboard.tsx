
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  Eye,
  MessageSquare,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { aiOrchestrator } from '@/services/ai/AIOrchestrator';
import { realTimeInsights } from '@/services/ai/RealTimeInsights';
import { personalizationEngine } from '@/services/ai/PersonalizationEngine';

export const AIDashboard: React.FC = () => {
  const [insights, setInsights] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any>({});
  const [performance, setPerformance] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('user_123');

  useEffect(() => {
    loadDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [businessInsights, activeAlerts, patternSummary, performanceMetrics] = await Promise.all([
        realTimeInsights.generateBusinessInsights(),
        realTimeInsights.getActiveAlerts(),
        realTimeInsights.getPatternSummary(),
        aiOrchestrator.getPerformanceMetrics()
      ]);

      setInsights(businessInsights);
      setAlerts(activeAlerts);
      setPatterns(patternSummary);
      setPerformance(performanceMetrics);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalizationTest = async () => {
    try {
      const result = await personalizationEngine.personalizeExperience(selectedUserId, {
        page: 'dashboard',
        language: 'en'
      });
      console.log('Personalization result:', result);
    } catch (error) {
      console.error('Personalization test failed:', error);
    }
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading AI Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            AI Intelligence Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time AI insights, ML predictions, and NLP analytics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Zap className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
          <Button onClick={loadDashboardData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">{alert.message}</span>
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Performance</p>
                <p className={`text-2xl font-bold ${getStatusColor(performance.averageResponseTime || 0, { good: 500, warning: 1000 })}`}>
                  {performance.averageResponseTime || 0}ms
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className={`text-2xl font-bold ${getStatusColor((performance.cacheHitRate || 0) * 100, { good: 80, warning: 60 })}`}>
                  {Math.round((performance.cacheHitRate || 0) * 100)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-blue-600">
                  {performance.activeServices || 0}/3
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Operations</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {performance.totalOperations || 0}
                </p>
              </div>
              <Eye className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Intelligence</TabsTrigger>
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Emerging Trends</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {insights.marketInsights?.trends?.emerging?.map((trend: string, index: number) => (
                        <Badge key={index} variant="secondary">{trend}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Market Position</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {insights.marketInsights?.competition?.position}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Demand Forecast</h4>
                    <p className="text-lg font-semibold text-green-600">
                      {insights.marketInsights?.demand?.forecast}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operational Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Operational Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order Processing</span>
                    <span className="font-medium">{insights.operationalInsights?.efficiency?.orderProcessing}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Website Speed</span>
                    <span className="font-medium">{insights.operationalInsights?.performance?.websiteSpeed}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="font-medium text-green-600">{insights.operationalInsights?.performance?.uptime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Acquisition Cost</span>
                    <span className="font-medium">{insights.operationalInsights?.costs?.acquisition}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(insights.customerInsights?.segmentAnalysis || {}).map(([segment, data]: [string, any]) => (
                    <div key={segment} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium capitalize">{segment}</p>
                        <p className="text-sm text-gray-600">{data.count} customers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">{data.growth}</p>
                        <p className="text-xs text-gray-500">★ {data.satisfaction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Behavior Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Behavior Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(insights.customerInsights?.behaviorPatterns || {}).map(([metric, value]: [string, any]) => (
                    <div key={metric} className="flex justify-between">
                      <span className="text-sm text-gray-600 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Churn Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Churn Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">High Risk</span>
                    <span className="font-bold text-red-600">{insights.customerInsights?.churnPrediction?.highRisk}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-600">Medium Risk</span>
                    <span className="font-bold text-yellow-600">{insights.customerInsights?.churnPrediction?.mediumRisk}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Low Risk</span>
                    <span className="font-bold text-green-600">{insights.customerInsights?.churnPrediction?.lowRisk}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.productInsights?.performance?.topPerformers?.map((product: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{product.growth}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Pricing Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.productInsights?.pricing?.opportunities?.map((opportunity: any, index: number) => (
                    <div key={index} className="p-3 border rounded">
                      <p className="font-medium">{opportunity.product}</p>
                      <p className="text-sm text-blue-600">{opportunity.suggestion}</p>
                      <p className="text-xs text-gray-500">{opportunity.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personalization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Personalization Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Test User ID:</label>
                  <input
                    type="text"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="px-3 py-1 border rounded text-sm"
                    placeholder="Enter user ID"
                  />
                  <Button onClick={handlePersonalizationTest} size="sm">
                    Test Personalization
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">Active Personalizations</h4>
                    <div className="space-y-2">
                      <Badge variant="outline">Dynamic Pricing</Badge>
                      <Badge variant="outline">Content Optimization</Badge>
                      <Badge variant="outline">Product Recommendations</Badge>
                      <Badge variant="outline">UI Customization</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">Performance Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Engagement Lift:</span>
                        <span className="font-medium text-green-600">+23%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion Rate:</span>
                        <span className="font-medium text-green-600">+15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>User Satisfaction:</span>
                        <span className="font-medium text-green-600">4.7/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sales Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Next Month</p>
                    <p className="text-2xl font-bold text-green-600">
                      {insights.predictiveInsights?.sales?.nextMonth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Quarter</p>
                    <p className="text-2xl font-bold text-green-600">
                      {insights.predictiveInsights?.sales?.nextQuarter}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Confidence Level</p>
                    <p className="text-lg font-medium">
                      {insights.predictiveInsights?.sales?.confidence}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Market Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Expansion Opportunity</p>
                    <p className="text-sm font-medium">
                      {insights.predictiveInsights?.market?.expansion}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Optimal Timing</p>
                    <p className="text-sm font-medium">
                      {insights.predictiveInsights?.market?.timing}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ROI Prediction</p>
                    <p className="text-lg font-bold text-green-600">
                      {insights.predictiveInsights?.market?.investment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Real-time Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(patterns).map(([eventType, data]: [string, any]) => (
              <div key={eventType} className="p-4 border rounded">
                <h4 className="font-medium capitalize mb-2">{eventType.replace(/_/g, ' ')}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Events:</span>
                    <span className="font-medium">{data.totalEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recent (24h):</span>
                    <span className="font-medium">{data.recentEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trend:</span>
                    <Badge variant={data.trend === 'increasing' ? 'default' : 'secondary'}>
                      {data.trend}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
