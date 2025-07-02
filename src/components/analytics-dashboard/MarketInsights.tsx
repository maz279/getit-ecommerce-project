import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Globe, Target, BarChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MarketInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  data: Record<string, any>;
  trend_direction: 'up' | 'down' | 'stable';
  confidence_score: number;
  created_at: string;
  expires_at: string;
  metadata: Record<string, any>;
}

const MarketInsights: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trends');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      // Mock data until database tables are created
      const mockInsights: MarketInsight[] = [
        {
          id: '1',
          insight_type: 'trends',
          title: 'E-commerce Growth Acceleration',
          description: 'Mobile commerce is showing 25% month-over-month growth',
          data: { growth_rate: 25, mobile_percentage: 68 },
          trend_direction: 'up',
          confidence_score: 0.92,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {}
        },
        {
          id: '2',
          insight_type: 'competition',
          title: 'Competitive Pricing Opportunity',
          description: 'Electronics category shows 15% pricing advantage opportunity',
          data: { price_advantage: 15, category: 'electronics' },
          trend_direction: 'stable',
          confidence_score: 0.78,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {}
        }
      ];
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error fetching market insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-insights-generator', {
        body: { refresh: true }
      });

      if (error) throw error;
      await fetchInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const renderInsightCard = (insight: MarketInsight) => (
    <Card key={insight.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTrendIcon(insight.trend_direction)}
            <CardTitle className="text-lg">{insight.title}</CardTitle>
          </div>
          <Badge variant="outline" className={getTrendColor(insight.trend_direction)}>
            {insight.trend_direction}
          </Badge>
        </div>
        <CardDescription>{insight.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Confidence Score:</span>
            <span className="text-sm">{(insight.confidence_score * 100).toFixed(1)}%</span>
          </div>
          
          {insight.data && Object.keys(insight.data).length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Key Metrics:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(insight.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span>{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            Updated: {new Date(insight.created_at).toLocaleDateString()}
            {insight.expires_at && (
              <span className="ml-2">
                • Expires: {new Date(insight.expires_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'all') return true;
    return insight.insight_type === activeTab;
  });

  if (loading && insights.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Market Insights</h2>
          <p className="text-muted-foreground">Real-time market trends and competitive intelligence</p>
        </div>
        <Button onClick={generateInsights} disabled={loading}>
          {loading ? 'Generating...' : 'Refresh Insights'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="demand">Demand</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredInsights.length > 0 ? (
              filteredInsights.map(renderInsightCard)
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No market insights available for this category.</p>
                    <p className="text-sm mt-2">Generate new insights to see market trends.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Market Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12.3%</div>
              <div className="text-sm text-muted-foreground">Platform market share</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+2.1% vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Competitive Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">#3</div>
              <div className="text-sm text-muted-foreground">In e-commerce ranking</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Moved up 1 position</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Market Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15.7%</div>
              <div className="text-sm text-muted-foreground">YoY growth rate</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Above industry avg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketInsights;