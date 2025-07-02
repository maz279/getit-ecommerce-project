import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Brain, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BIInsight {
  id: string;
  insight_category: string;
  insight_title: string;
  insight_description: string;
  insight_type: 'trend' | 'anomaly' | 'opportunity' | 'risk' | 'recommendation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  data_points: Record<string, any>;
  confidence_score: number;
  impact_score: number;
  action_items: string[];
  created_at: string;
}

const BusinessIntelligence: React.FC = () => {
  const [insights, setInsights] = useState<BIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('bi_insights')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error fetching BI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <Target className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const renderInsightCard = (insight: BIInsight) => (
    <Card key={insight.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getInsightIcon(insight.insight_type)}
            <CardTitle className="text-lg">{insight.insight_title}</CardTitle>
          </div>
          <Badge variant={getPriorityColor(insight.priority)}>
            {insight.priority}
          </Badge>
        </div>
        <CardDescription>{insight.insight_description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="text-sm">
              <span className="font-medium">Confidence:</span>
              <span className="ml-2">{(insight.confidence_score * 100).toFixed(1)}%</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Impact:</span>
              <span className="ml-2">{(insight.impact_score * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          {insight.action_items.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recommended Actions:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {insight.action_items.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'overview') return true;
    return insight.insight_type === activeTab;
  });

  if (loading) {
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
          <h2 className="text-2xl font-bold">Business Intelligence</h2>
          <p className="text-muted-foreground">AI-powered insights and recommendations</p>
        </div>
        <Button onClick={fetchInsights} disabled={loading}>
          Refresh Insights
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trend">Trends</TabsTrigger>
          <TabsTrigger value="anomaly">Anomalies</TabsTrigger>
          <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
          <TabsTrigger value="risk">Risks</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredInsights.length > 0 ? (
              filteredInsights.map(renderInsightCard)
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No insights available for this category.</p>
                    <p className="text-sm mt-2">Check back later for AI-generated insights.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligence;