
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Eye,
  MessageCircle
} from 'lucide-react';
import { useAdvancedAI } from '@/hooks/useAdvancedAI';

interface AdvancedAIDashboardProps {
  userId?: string;
  className?: string;
}

export const AdvancedAIDashboard: React.FC<AdvancedAIDashboardProps> = ({ 
  userId = 'demo-user',
  className = ''
}) => {
  const {
    insights,
    recommendations,
    personalization,
    realTimeData,
    isProcessing,
    error,
    getPersonalizedInsights,
    getRealTimeInsights,
    getPerformanceMetrics
  } = useAdvancedAI(userId);

  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      await getPersonalizedInsights();
      await getRealTimeInsights();
      
      const metrics = getPerformanceMetrics();
      setPerformanceMetrics(metrics);
    };

    loadData();
  }, [getPersonalizedInsights, getRealTimeInsights, getPerformanceMetrics]);

  const insightCards = [
    {
      title: 'AI Performance',
      value: performanceMetrics?.averageResponseTime || '450ms',
      change: '+15%',
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: insights?.customerInsights?.segmentAnalysis?.regularCustomers?.count || '8,500',
      change: '+8%',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '+0.8%',
      icon: <Target className="w-6 h-6 text-green-600" />,
      trend: 'up'
    },
    {
      title: 'Revenue Impact',
      value: 'BDT 15M',
      change: '+23%',
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      trend: 'up'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            Advanced AI Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time AI insights, personalization, and performance analytics
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          AI System Active
        </Badge>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insightCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <p className={`text-sm mt-1 ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change} vs last month
                  </p>
                </div>
                {card.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Business Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insights?.customerInsights ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Premium Customers</p>
                        <p className="text-xl font-bold text-blue-600">
                          {insights.customerInsights.segmentAnalysis?.premiumCustomers?.count || 0}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Satisfaction Score</p>
                        <p className="text-xl font-bold text-green-600">
                          {insights.customerInsights.satisfaction?.overallScore || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Peak Shopping Hours</h4>
                      <div className="flex gap-2">
                        {insights.customerInsights.behaviorPatterns?.peakShoppingHours?.map((hour: string, i: number) => (
                          <Badge key={i} variant="outline">{hour}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isProcessing ? 'Loading insights...' : 'No customer insights available'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Product Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insights?.productInsights ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Top Performers</h4>
                      {insights.productInsights.performance?.topSellers?.slice(0, 3).map((product: any, i: number) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <span className="text-sm">{product.product}</span>
                          <Badge className="bg-green-100 text-green-800">
                            {product.sales} sales
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Avg Rating</p>
                        <p className="text-xl font-bold text-purple-600">
                          {insights.productInsights.quality?.averageRating || 'N/A'}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600">Return Rate</p>
                        <p className="text-xl font-bold text-orange-600">
                          {((insights.productInsights.quality?.returnRate || 0) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isProcessing ? 'Loading product insights...' : 'No product insights available'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market Trends & Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights?.marketInsights ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Emerging Trends</h4>
                    {insights.marketInsights.trends?.emerging?.map((trend: string, i: number) => (
                      <Badge key={i} className="mb-2 mr-2 bg-green-100 text-green-800">
                        {trend}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-red-600">Declining Trends</h4>
                    {insights.marketInsights.trends?.declining?.map((trend: string, i: number) => (
                      <Badge key={i} className="mb-2 mr-2 bg-red-100 text-red-800">
                        {trend}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Seasonal Trends</h4>
                    {insights.marketInsights.trends?.seasonal?.map((trend: string, i: number) => (
                      <Badge key={i} className="mb-2 mr-2 bg-blue-100 text-blue-800">
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isProcessing ? 'Analyzing market trends...' : 'No market insights available'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalization Tab */}
        <TabsContent value="personalization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                User Personalization Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {personalization ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Preferences</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Favorite Categories</p>
                        <div className="flex gap-2 mt-1">
                          {personalization.preferences?.categories?.slice(0, 3).map((cat: string, i: number) => (
                            <Badge key={i} variant="outline">{cat}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price Range</p>
                        <p className="font-semibold">
                          ৳{personalization.preferences?.priceRange?.min?.toLocaleString()} - 
                          ৳{personalization.preferences?.priceRange?.max?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">AI Insights</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Churn Risk</span>
                        <Badge className={
                          personalization.aiInsights?.churnRisk > 0.7 ? 'bg-red-100 text-red-800' :
                          personalization.aiInsights?.churnRisk > 0.3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {((personalization.aiInsights?.churnRisk || 0) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Lifetime Value</span>
                        <span className="font-semibold">
                          ৳{personalization.aiInsights?.lifetimeValue?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Best Action</p>
                        <Badge className="bg-purple-100 text-purple-800 mt-1">
                          {personalization.aiInsights?.nextBestAction || 'Explore preferences'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Building personalization profile...</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Interact with products to see AI-powered insights
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Data Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {realTimeData?.alerts?.length > 0 ? (
                  <div className="space-y-3">
                    {realTimeData.alerts.slice(0, 5).map((alert: any, i: number) => (
                      <div key={i} className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                        alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{alert.type}</span>
                          <Badge className={
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-500">No active alerts</p>
                    <p className="text-sm text-gray-400">System running smoothly</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Pattern Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                {realTimeData?.patterns ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {realTimeData.patterns.totalEventsProcessed || 0}
                      </p>
                      <p className="text-sm text-gray-600">Events Processed</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Processing Stats</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Success Rate</p>
                          <p className="font-semibold text-green-600">
                            {((realTimeData.patterns.processingStats?.successRate || 0) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Processing</p>
                          <p className="font-semibold text-blue-600">
                            {realTimeData.patterns.processingStats?.averageProcessingTime || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Analyzing patterns...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.slice(0, 6).map((rec: any, i: number) => (
                    <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          {(rec.confidence * 100).toFixed(0)}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{rec.reason}</p>
                      {rec.price && (
                        <p className="font-bold text-green-600">৳{rec.price.toLocaleString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Building recommendations...</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Browse products to get personalized suggestions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceMetrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Response Time</p>
                        <p className="text-xl font-bold text-blue-600">
                          {performanceMetrics.averageResponseTime}ms
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Cache Hit Rate</p>
                        <p className="text-xl font-bold text-green-600">
                          {(performanceMetrics.cacheHitRate * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Active Services</p>
                        <p className="text-xl font-bold text-purple-600">
                          {performanceMetrics.activeServices}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Operations</p>
                        <p className="text-xl font-bold text-orange-600">
                          {performanceMetrics.totalOperations}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading performance metrics...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>ML Models</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NLP Services</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Real-time Processing</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Personalization Engine</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => {
            getPersonalizedInsights();
            getRealTimeInsights();
          }}
          disabled={isProcessing}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isProcessing ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 mr-2" />
              Refresh AI Data
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
