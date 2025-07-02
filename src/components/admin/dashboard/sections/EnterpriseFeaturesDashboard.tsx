import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import {
  Target, TrendingUp, Clock, DollarSign, Zap, Shield,
  Brain, BarChart3, Globe, AlertTriangle, CheckCircle,
  Rocket, Users, Timer, Award
} from 'lucide-react';

interface EnterpriseFeature {
  id: string;
  feature_name: string;
  feature_type: string;
  implementation_status: string;
  priority_level: string;
  amazon_equivalent?: string;
  shopee_equivalent?: string;
  description?: string;
  business_impact_score?: number;
  technical_complexity_score?: number;
  estimated_effort_days?: number;
  roi_estimate?: number;
}

interface ProgressData {
  overall_completion: number;
  by_type: Record<string, number>;
  velocity_metrics: {
    features_completed_last_30_days: number;
    average_implementation_time: number;
    estimated_completion_date: string;
  };
  roi_analysis: {
    total_estimated_roi: number;
    average_roi_per_feature: number;
  };
}

export const EnterpriseFeaturesDashboard: React.FC = () => {
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoScalingEnabled, setAutoScalingEnabled] = useState(false);

  useEffect(() => {
    fetchEnterpriseData();
    const interval = setInterval(fetchEnterpriseData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchEnterpriseData = async () => {
    try {
      const [roadmapRes, gapRes, progressRes, recommendationsRes] = await Promise.all([
        fetch('/functions/v1/enterprise-orchestrator/features/roadmap'),
        fetch('/functions/v1/enterprise-orchestrator/features/amazon-gap-analysis'),
        fetch('/functions/v1/enterprise-orchestrator/analytics/implementation-progress'),
        fetch('/functions/v1/enterprise-orchestrator/recommendations/next-features')
      ]);

      const [roadmap, gap, progress, recs] = await Promise.all([
        roadmapRes.json(),
        gapRes.json(),
        progressRes.json(),
        recommendationsRes.json()
      ]);

      setRoadmapData(roadmap.roadmap);
      setGapAnalysis(gap.gap_analysis);
      setProgressData(progress.implementation_progress);
      setRecommendations(recs.recommendations);
    } catch (error) {
      console.error('Failed to fetch enterprise data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoScale = async () => {
    try {
      await fetch('/functions/v1/enterprise-orchestrator/automation/scale-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: {}, auto_scale: true })
      });
      setAutoScalingEnabled(true);
    } catch (error) {
      console.error('Auto-scaling failed:', error);
    }
  };

  const deployFeature = async (featureId: string) => {
    try {
      await fetch('/functions/v1/enterprise-orchestrator/automation/deploy-feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature_id: featureId })
      });
      fetchEnterpriseData(); // Refresh data
    } catch (error) {
      console.error('Feature deployment failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'testing': return 'bg-yellow-500';
      case 'planned': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const typeIcons = {
    'ai-ml': <Brain className="h-5 w-5" />,
    'analytics': <BarChart3 className="h-5 w-5" />,
    'security': <Shield className="h-5 w-5" />,
    'performance': <Zap className="h-5 w-5" />,
    'business': <Target className="h-5 w-5" />
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Enterprise Features Dashboard</h2>
          <p className="text-muted-foreground">Amazon/Shopee-level feature implementation progress</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAutoScale}
            variant={autoScalingEnabled ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Rocket className="h-4 w-4" />
            {autoScalingEnabled ? "Auto-scaling Active" : "Enable Auto-scaling"}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData?.overall_completion.toFixed(1)}%
            </div>
            <Progress value={progressData?.overall_completion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amazon Coverage</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gapAnalysis?.amazon_equivalents.coverage_percentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {gapAnalysis?.amazon_equivalents.implemented}/{gapAnalysis?.amazon_equivalents.total_features} features
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${progressData?.roi_analysis.total_estimated_roi.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg ${progressData?.roi_analysis.average_roi_per_feature.toLocaleString()}/feature
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion ETA</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData?.velocity_metrics.estimated_completion_date 
                ? new Date(progressData.velocity_metrics.estimated_completion_date).toLocaleDateString()
                : 'TBD'}
            </div>
            <p className="text-xs text-muted-foreground">
              {progressData?.velocity_metrics.features_completed_last_30_days} features/month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roadmap" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="progress">Progress Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Critical Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Features
                </CardTitle>
                <CardDescription>
                  {roadmapData?.critical_features.length} mission-critical features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {roadmapData?.critical_features.slice(0, 5).map((feature: EnterpriseFeature) => (
                  <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {typeIcons[feature.feature_type as keyof typeof typeIcons]}
                      <div>
                        <p className="font-medium">{feature.feature_name}</p>
                        <p className="text-sm text-muted-foreground">{feature.amazon_equivalent}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(feature.priority_level)}>
                        {feature.priority_level}
                      </Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(feature.implementation_status)}`} />
                      {feature.implementation_status === 'planned' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deployFeature(feature.id)}
                        >
                          Deploy
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progress by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Progress by Feature Type</CardTitle>
                <CardDescription>Implementation status across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(progressData?.by_type || {}).map(([type, progress]) => ({
                    type: type.replace('-', ' ').toUpperCase(),
                    progress: Number(progress)
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="progress" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
              <CardDescription>Feature rollout schedule and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['critical', 'high', 'medium'].map(priority => {
                  const features = roadmapData?.[`${priority === 'critical' ? 'critical_features' : priority + '_priority'}`] || [];
                  return (
                    <div key={priority} className="space-y-2">
                      <h4 className="font-semibold capitalize flex items-center gap-2">
                        {priority === 'critical' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {priority === 'high' && <Award className="h-4 w-4 text-orange-500" />}
                        {priority === 'medium' && <Timer className="h-4 w-4 text-blue-500" />}
                        {priority} Priority ({features.length} features)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {features.slice(0, 6).map((feature: EnterpriseFeature) => (
                          <div key={feature.id} className="p-2 border rounded text-sm">
                            <div className="font-medium">{feature.feature_name}</div>
                            <div className="text-muted-foreground text-xs">
                              {feature.estimated_effort_days} days • Score: {feature.business_impact_score}/10
                            </div>
                            <Badge variant="outline" className="mt-1">
                              {feature.implementation_status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gap-analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Amazon vs Shopee Coverage */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Coverage Comparison</CardTitle>
                <CardDescription>Feature parity with major e-commerce platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Amazon Coverage</span>
                      <span>{gapAnalysis?.amazon_equivalents.coverage_percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={gapAnalysis?.amazon_equivalents.coverage_percentage} />
                    <p className="text-sm text-muted-foreground mt-1">
                      {gapAnalysis?.amazon_equivalents.implemented} of {gapAnalysis?.amazon_equivalents.total_features} features implemented
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Shopee Coverage</span>
                      <span>{gapAnalysis?.shopee_equivalents.coverage_percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={gapAnalysis?.shopee_equivalents.coverage_percentage} />
                    <p className="text-sm text-muted-foreground mt-1">
                      {gapAnalysis?.shopee_equivalents.implemented} of {gapAnalysis?.shopee_equivalents.total_features} features implemented
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Gaps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Missing Features
                </CardTitle>
                <CardDescription>High-impact features that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gapAnalysis?.critical_gaps.slice(0, 5).map((feature: EnterpriseFeature) => (
                    <div key={feature.id} className="p-3 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{feature.feature_name}</p>
                          <p className="text-sm text-muted-foreground">{feature.amazon_equivalent}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Impact: {feature.business_impact_score}/10</div>
                          <div className="text-xs text-muted-foreground">{feature.estimated_effort_days} days</div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => deployFeature(feature.id)}
                      >
                        Start Implementation
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Next Implementations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Implementation Order</CardTitle>
              <CardDescription>Optimized sequence based on impact, complexity, and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gapAnalysis?.recommended_next_implementations.map((feature: EnterpriseFeature, index: number) => (
                  <div key={feature.id} className="p-4 border rounded-lg relative">
                    <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">{feature.feature_name}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      <div className="flex justify-between text-xs">
                        <span>Impact: {feature.business_impact_score}/10</span>
                        <span>Complexity: {feature.technical_complexity_score}/10</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{feature.estimated_effort_days} days</span>
                        <Badge variant="outline">{feature.feature_type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next Sprint */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-500" />
                  Next Sprint (Top 3)
                </CardTitle>
                <CardDescription>Highest priority features for immediate implementation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations?.next_sprint.map((feature: EnterpriseFeature, index: number) => (
                  <div key={feature.id} className="p-3 border rounded-lg bg-blue-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{feature.feature_name}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <Badge className="bg-blue-500">#{index + 1}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impact: {feature.business_impact_score}/10</span>
                      <span>Effort: {feature.estimated_effort_days} days</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => deployFeature(feature.id)}
                    >
                      Add to Sprint
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Wins */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Quick Wins
                </CardTitle>
                <CardDescription>High-impact, low-complexity features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations?.quick_wins.slice(0, 3).map((feature: EnterpriseFeature) => (
                  <div key={feature.id} className="p-3 border rounded-lg bg-green-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{feature.feature_name}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <Badge className="bg-green-500">Quick Win</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impact: {feature.business_impact_score}/10</span>
                      <span>Effort: {feature.estimated_effort_days} days</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => deployFeature(feature.id)}
                    >
                      Quick Deploy
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resource Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Requirements Analysis</CardTitle>
              <CardDescription>Estimated resources needed for next quarter implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {recommendations?.resource_requirements.total_estimated_days}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Days</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {recommendations?.resource_requirements.required_teams}
                  </div>
                  <div className="text-sm text-muted-foreground">Teams Needed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${recommendations?.resource_requirements.budget_estimate.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Est. Budget</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {recommendations?.resource_requirements.skill_requirements.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Skills Required</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Velocity Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Development Velocity</CardTitle>
                <CardDescription>Feature completion trends and projections</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { month: 'Jan', completed: 2, planned: 5 },
                    { month: 'Feb', completed: 4, planned: 6 },
                    { month: 'Mar', completed: 3, planned: 7 },
                    { month: 'Apr', completed: 6, planned: 8 },
                    { month: 'May', completed: 5, planned: 9 },
                    { month: 'Jun', completed: 8, planned: 10 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" />
                    <Area type="monotone" dataKey="planned" stackId="2" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Return on investment by feature category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(progressData?.by_type || {}).map(([type, progress]) => ({
                        name: type.replace('-', ' ').toUpperCase(),
                        value: Number(progress),
                        fill: `hsl(${Math.random() * 360}, 70%, 50%)`
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise KPIs</CardTitle>
              <CardDescription>Key performance indicators tracking our progress toward Amazon/Shopee level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Team Productivity</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {progressData?.velocity_metrics.average_implementation_time.toFixed(1)} days
                  </div>
                  <p className="text-sm text-muted-foreground">Avg. feature implementation time</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Monthly Velocity</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {progressData?.velocity_metrics.features_completed_last_30_days}
                  </div>
                  <p className="text-sm text-muted-foreground">Features completed last 30 days</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Business Value</span>
                  </div>
                  <div className="text-2xl font-bold">
                    ${progressData?.roi_analysis.average_roi_per_feature.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg. ROI per feature</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseFeaturesDashboard;