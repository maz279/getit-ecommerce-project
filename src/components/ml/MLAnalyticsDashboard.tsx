
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Users, 
  DollarSign,
  ShoppingCart,
  Eye,
  Lightbulb,
  Zap
} from 'lucide-react';
import { analyticsEngine, MLInsight, CustomerInsight } from '@/services/ml/AnalyticsEngine';

export const MLAnalyticsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<MLInsight[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      const [businessInsights, segments] = await Promise.all([
        analyticsEngine.generateBusinessInsights(),
        analyticsEngine.analyzeCustomerSegments()
      ]);
      
      setInsights(businessInsights);
      setCustomerSegments(segments);
      
    } catch (error) {
      console.error('Error loading ML analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'anomaly': return <Zap className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'opportunity': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'anomaly': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
          <h1 className="text-2xl font-bold">ML Analytics Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="bg-gray-100 rounded h-32 animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ML Analytics Dashboard</h1>
            <p className="text-gray-600">AI-powered business insights and predictions</p>
          </div>
        </div>
        
        <Button onClick={loadAnalytics}>
          <Brain className="w-4 h-4 mr-2" />
          Refresh Insights
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ML Accuracy</p>
                <p className="text-xl font-bold text-blue-600">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversion Boost</p>
                <p className="text-xl font-bold text-green-600">+23%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Segments</p>
                <p className="text-xl font-bold text-purple-600">{customerSegments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue Impact</p>
                <p className="text-xl font-bold text-orange-600">+18.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ML Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{insight.title}</h3>
                    <p className="text-xs mt-1 opacity-90">{insight.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(insight.confidence * 100)}%
                  </Badge>
                </div>
                
                {insight.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-2">AI Recommendations:</p>
                    <ul className="text-xs space-y-1">
                      {insight.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            ML Customer Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customerSegments.map((segment) => (
              <div key={segment.segmentId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{segment.segmentName}</h3>
                  <Badge variant="outline">
                    {segment.size.toLocaleString()} users
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Lifetime Value:</span>
                    <span className="font-semibold ml-2">
                      ৳{segment.predictedLifetimeValue.toLocaleString()}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Churn Risk:</span>
                    <span className={`font-semibold ml-2 ${
                      segment.churnRisk > 0.5 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {Math.round(segment.churnRisk * 100)}%
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Top Preferences:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {segment.preferences.slice(0, 3).map((pref, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
                    </div>
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
