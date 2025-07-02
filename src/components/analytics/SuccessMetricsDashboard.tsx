import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface MetricData {
  name: string;
  value: number;
  target: number;
  unit: 'percentage' | 'count' | 'score';
  trend?: 'up' | 'down' | 'stable';
  description: string;
}

interface PhaseMetrics {
  phase1: {
    vendorDashboardAdoption: number;
    realtimeFeatureUsage: number;
    analyticsDashboardEngagement: number;
  };
  phase2: {
    searchConversionRate: number;
    mobilePerformanceScore: number;
  };
  phase3: {
    pwaInstallRate: number;
    offlineFunctionalityUsage: number;
    mobileConversionRate: number;
  };
}

const SuccessMetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PhaseMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('metrics-tracking/calculate-metrics');
      
      if (error) throw error;
      
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhase1Metrics = (): MetricData[] => [
    {
      name: 'Vendor Dashboard Adoption',
      value: metrics?.phase1.vendorDashboardAdoption || 0,
      target: 80,
      unit: 'percentage',
      description: 'Percentage of vendors actively using the dashboard'
    },
    {
      name: 'Real-time Feature Usage',
      value: metrics?.phase1.realtimeFeatureUsage || 0,
      target: 60,
      unit: 'percentage',
      description: 'Users engaging with real-time features'
    },
    {
      name: 'Analytics Dashboard Engagement',
      value: metrics?.phase1.analyticsDashboardEngagement || 0,
      target: 70,
      unit: 'percentage',
      description: 'Active users on analytics dashboard'
    }
  ];

  const getPhase2Metrics = (): MetricData[] => [
    {
      name: 'Search Conversion Rate Improvement',
      value: metrics?.phase2.searchConversionRate || 0,
      target: 25,
      unit: 'percentage',
      description: 'Improvement in search-to-purchase conversion'
    },
    {
      name: 'Mobile Performance Score',
      value: metrics?.phase2.mobilePerformanceScore || 0,
      target: 90,
      unit: 'score',
      description: 'Average mobile performance score'
    }
  ];

  const getPhase3Metrics = (): MetricData[] => [
    {
      name: 'PWA Install Rate',
      value: metrics?.phase3.pwaInstallRate || 0,
      target: 40,
      unit: 'percentage',
      description: 'Users who installed the PWA'
    },
    {
      name: 'Offline Functionality Usage',
      value: metrics?.phase3.offlineFunctionalityUsage || 0,
      target: 30,
      unit: 'percentage',
      description: 'Users engaging with offline features'
    },
    {
      name: 'Mobile Conversion Rate',
      value: metrics?.phase3.mobileConversionRate || 0,
      target: 15,
      unit: 'percentage',
      description: 'Mobile checkout conversion rate'
    }
  ];

  const getStatusBadge = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return <Badge className="bg-green-500">Target Achieved</Badge>;
    if (percentage >= 80) return <Badge className="bg-yellow-500">Near Target</Badge>;
    return <Badge variant="destructive">Below Target</Badge>;
  };

  const MetricCard: React.FC<{ metric: MetricData }> = ({ metric }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
        {getStatusBadge(metric.value, metric.target)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {metric.value.toFixed(1)}{metric.unit === 'percentage' ? '%' : ''}
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Target: {metric.target}{metric.unit === 'percentage' ? '%' : ''}
        </p>
        <Progress 
          value={(metric.value / metric.target) * 100} 
          className="h-2 mb-2"
        />
        <p className="text-xs text-muted-foreground">
          {metric.description}
        </p>
        <div className="flex items-center mt-2">
          {metric.value >= metric.target ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <Target className="h-4 w-4 text-orange-500 mr-1" />
          )}
          <span className="text-xs">
            {metric.value >= metric.target ? 'Target achieved' : 'Working towards target'}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading success metrics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Award className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Success Metrics Dashboard</h2>
      </div>

      <Tabs defaultValue="phase1" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phase1">Phase 1 Metrics</TabsTrigger>
          <TabsTrigger value="phase2">Phase 2 Metrics</TabsTrigger>
          <TabsTrigger value="phase3">Phase 3 Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="phase1" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getPhase1Metrics().map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Phase 1 Overview</CardTitle>
              <CardDescription>
                Core platform adoption and real-time feature engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Phase 1 focuses on vendor dashboard adoption, real-time feature usage, and analytics engagement.
                These metrics indicate how well vendors and users are adopting the core platform features.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase2" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {getPhase2Metrics().map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Phase 2 Overview</CardTitle>
              <CardDescription>
                Advanced search capabilities and mobile performance optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Phase 2 metrics track the effectiveness of enhanced search features and mobile performance.
                Success here indicates improved user experience and conversion rates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase3" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {getPhase3Metrics().map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Phase 3 Overview</CardTitle>
              <CardDescription>
                Progressive Web App adoption and mobile-first experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Phase 3 metrics measure PWA adoption, offline functionality usage, and mobile conversion optimization.
                These indicate the success of the mobile-first transformation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuccessMetricsDashboard;