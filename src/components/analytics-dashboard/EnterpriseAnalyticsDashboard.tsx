import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Brain, Target, Users, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  aiForecasts: any[];
  marketIntelligence: any[];
  customerInsights: any[];
  executiveKPIs: any[];
  reportTemplates: any[];
}

export default function EnterpriseAnalyticsDashboard() {
  const [data, setData] = useState<DashboardData>({
    aiForecasts: [],
    marketIntelligence: [],
    customerInsights: [],
    executiveKPIs: [],
    reportTemplates: []
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateAIForecasts = async () => {
    setLoading(true);
    try {
      const { data: result } = await supabase.functions.invoke('ai-predictive-analytics', {
        body: { action: 'generate_sales_forecast', data: { months: 6 } }
      });
      setData(prev => ({ ...prev, aiForecasts: result.forecasts }));
      toast({ title: "AI Forecasts Generated", description: "Sales forecasting completed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate forecasts", variant: "destructive" });
    }
    setLoading(false);
  };

  const generateMarketIntelligence = async () => {
    setLoading(true);
    try {
      const { data: result } = await supabase.functions.invoke('market-intelligence-engine', {
        body: { action: 'detect_market_trends', data: {} }
      });
      setData(prev => ({ ...prev, marketIntelligence: result.trends }));
      toast({ title: "Market Intelligence Updated", description: "Latest trends analyzed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to analyze market trends", variant: "destructive" });
    }
    setLoading(false);
  };

  const generateCustomerInsights = async () => {
    setLoading(true);
    try {
      const { data: result } = await supabase.functions.invoke('customer-intelligence-engine', {
        body: { action: 'generate_recommendations', data: { customer_id: 'sample' } }
      });
      setData(prev => ({ ...prev, customerInsights: result.recommendations }));
      toast({ title: "Customer Insights Generated", description: "AI recommendations ready" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate insights", variant: "destructive" });
    }
    setLoading(false);
  };

  const generateExecutiveKPIs = async () => {
    setLoading(true);
    try {
      const { data: result } = await supabase.functions.invoke('executive-business-intelligence', {
        body: { action: 'generate_executive_kpis', data: {} }
      });
      setData(prev => ({ ...prev, executiveKPIs: result.kpis }));
      toast({ title: "Executive KPIs Updated", description: "Dashboard metrics refreshed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update KPIs", variant: "destructive" });
    }
    setLoading(false);
  };

  const createReportTemplate = async () => {
    setLoading(true);
    try {
      const { data: result } = await supabase.functions.invoke('automated-reporting-system', {
        body: { 
          action: 'create_report_template', 
          data: { 
            template_name: 'Executive Summary',
            report_type: 'executive',
            created_by: 'system'
          }
        }
      });
      setData(prev => ({ ...prev, reportTemplates: [...prev.reportTemplates, result.template] }));
      toast({ title: "Report Template Created", description: "Automated reporting configured" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create template", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enterprise Analytics Dashboard</h1>
          <p className="text-muted-foreground">Amazon/Shopee-level advanced analytics and intelligence</p>
        </div>
        <Badge variant="outline" className="text-primary">AI-Powered</Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-analytics"><Brain className="w-4 h-4 mr-2" />AI Analytics</TabsTrigger>
          <TabsTrigger value="market"><TrendingUp className="w-4 h-4 mr-2" />Market Intel</TabsTrigger>
          <TabsTrigger value="customer"><Users className="w-4 h-4 mr-2" />Customer AI</TabsTrigger>
          <TabsTrigger value="executive"><Target className="w-4 h-4 mr-2" />Executive BI</TabsTrigger>
          <TabsTrigger value="reports"><FileText className="w-4 h-4 mr-2" />Auto Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Predictive Analytics
                </CardTitle>
                <CardDescription>ML-powered forecasting & optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateAIForecasts} disabled={loading} className="w-full">
                  Generate AI Forecasts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Market Intelligence
                </CardTitle>
                <CardDescription>Real-time competitive & trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateMarketIntelligence} disabled={loading} className="w-full">
                  Analyze Market Trends
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Customer Intelligence
                </CardTitle>
                <CardDescription>Advanced customer insights & personalization</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateCustomerInsights} disabled={loading} className="w-full">
                  Generate Insights
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Executive BI
                </CardTitle>
                <CardDescription>C-level dashboards & strategic planning</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateExecutiveKPIs} disabled={loading} className="w-full">
                  Update Executive KPIs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Automated Reports
                </CardTitle>
                <CardDescription>Custom report builder & scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={createReportTemplate} disabled={loading} className="w-full">
                  Create Report Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Analytics engine status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>AI Models</span>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Pipeline</span>
                    <Badge variant="outline" className="text-green-600">Running</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Real-time Analytics</span>
                    <Badge variant="outline" className="text-green-600">Live</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-analytics">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Predictive Analytics</CardTitle>
              <CardDescription>Advanced ML forecasting and optimization algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.aiForecasts.slice(0, 4).map((forecast, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Sales Forecast</h3>
                    <p className="text-sm text-muted-foreground">Predicted Sales: ${forecast.predicted_sales?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Units: {forecast.predicted_units}</p>
                    <p className="text-sm text-muted-foreground">Confidence: {Math.round((forecast.confidence_interval?.upper || 0.8) * 100)}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Market Intelligence</CardTitle>
              <CardDescription>Competitive analysis and market trend detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.marketIntelligence.slice(0, 3).map((trend, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{trend.trend_name}</h3>
                      <Badge variant={trend.trend_direction === 'up' ? 'default' : 'secondary'}>
                        {trend.trend_direction}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Strength: {Math.round((trend.trend_strength || 0.5) * 100)}% | 
                      Confidence: {Math.round((trend.confidence_score || 0.7) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Customer Intelligence</CardTitle>
              <CardDescription>AI-powered customer insights and personalization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.customerInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{insight.recommendation_type?.replace('_', ' ')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Score: {Math.round((insight.recommendation_score || 0.8) * 100)}% | 
                      Conversion Probability: {Math.round((insight.conversion_probability || 0.3) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executive">
          <Card>
            <CardHeader>
              <CardTitle>Executive Business Intelligence</CardTitle>
              <CardDescription>C-level dashboards and strategic insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.executiveKPIs.slice(0, 8).map((kpi, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-sm">{kpi.metric_name}</h3>
                    <p className="text-2xl font-bold text-primary">{kpi.current_value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.metadata?.unit}</p>
                    <Badge variant={kpi.performance_status === 'excellent' ? 'default' : 'secondary'} className="mt-2">
                      {kpi.performance_status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Automated Reporting System</CardTitle>
              <CardDescription>Custom report builder with scheduling and multi-format export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.reportTemplates.map((template, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{template.template_name}</h3>
                    <p className="text-sm text-muted-foreground">Type: {template.report_type}</p>
                    <Badge variant="outline" className="mt-2">Template</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}