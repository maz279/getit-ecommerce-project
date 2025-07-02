import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Brain, Target, AlertTriangle, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsLineChart, AnalyticsAreaChart, MetricCard } from "../shared/ChartComponents";
import { FilterControls, type FilterState } from "../shared/FilterControls";

interface SalesForecast {
  id: string;
  forecast_date: string;
  forecast_period: string;
  predicted_sales: number;
  predicted_units: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  seasonality_factors: {
    seasonal_index: number;
    trend_component: number;
    cyclical_component: number;
  };
  model_accuracy: number;
  algorithm_used: string;
}

interface ForecastMetrics {
  totalPredictedRevenue: number;
  averageConfidence: number;
  growthRate: number;
  seasonalTrend: string;
  modelAccuracy: number;
  forecastPeriods: number;
}

export const SalesForecasting: React.FC = () => {
  const [forecasts, setForecasts] = useState<SalesForecast[]>([]);
  const [metrics, setMetrics] = useState<ForecastMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {},
    sortBy: 'forecast_date',
    sortOrder: 'asc'
  });
  const [forecastPeriod, setForecastPeriod] = useState('monthly');
  const [forecastHorizon, setForecastHorizon] = useState(12);
  const { toast } = useToast();

  const generateForecasts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-predictive-analytics', {
        body: { 
          action: 'generate_sales_forecast', 
          data: { 
            forecast_period: forecastPeriod,
            months: forecastHorizon,
            vendor_id: 'sample-vendor',
            product_id: 'sample-product'
          }
        }
      });

      if (error) throw error;

      const forecastData = data?.forecasts || [];
      setForecasts(forecastData);
      
      // Calculate metrics
      if (forecastData.length > 0) {
        const totalRevenue = forecastData.reduce((sum: number, f: any) => sum + f.predicted_sales, 0);
        const avgConfidence = forecastData.reduce((sum: number, f: any) => 
          sum + ((f.confidence_interval?.upper || 0) + (f.confidence_interval?.lower || 0)) / 2, 0
        ) / forecastData.length;
        const avgAccuracy = forecastData.reduce((sum: number, f: any) => sum + (f.model_accuracy || 0), 0) / forecastData.length;
        
        const firstForecast = forecastData[0]?.predicted_sales || 0;
        const lastForecast = forecastData[forecastData.length - 1]?.predicted_sales || 0;
        const growthRate = firstForecast > 0 ? ((lastForecast - firstForecast) / firstForecast) * 100 : 0;

        setMetrics({
          totalPredictedRevenue: totalRevenue,
          averageConfidence: avgConfidence * 100,
          growthRate: growthRate,
          seasonalTrend: growthRate > 5 ? 'Increasing' : growthRate < -5 ? 'Decreasing' : 'Stable',
          modelAccuracy: avgAccuracy,
          forecastPeriods: forecastData.length
        });
      }

      toast({
        title: "Forecasts Generated",
        description: `Generated ${forecastData.length} AI-powered sales forecasts`,
      });
    } catch (error) {
      console.error('Error generating forecasts:', error);
      toast({
        title: "Error",
        description: "Failed to generate sales forecasts",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const chartData = forecasts.map(forecast => ({
    date: forecast.forecast_date,
    predicted_sales: forecast.predicted_sales,
    predicted_units: forecast.predicted_units,
    confidence_lower: forecast.confidence_interval?.lower * forecast.predicted_sales || 0,
    confidence_upper: forecast.confidence_interval?.upper * forecast.predicted_sales || 0
  }));

  const seasonalityData = forecasts.map(forecast => ({
    date: forecast.forecast_date,
    seasonal_index: forecast.seasonality_factors?.seasonal_index || 1,
    trend_component: forecast.seasonality_factors?.trend_component || 1,
    cyclical_component: forecast.seasonality_factors?.cyclical_component || 1
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Sales Forecasting
          </h2>
          <p className="text-muted-foreground">Machine learning-powered sales predictions with seasonality analysis</p>
        </div>
        <Badge variant="outline" className="text-primary">
          ML-Powered
        </Badge>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Forecast Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Forecast Period</label>
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Forecast Horizon (Periods)</label>
              <Select value={forecastHorizon.toString()} onValueChange={(value) => setForecastHorizon(Number(value))}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="6">6 Periods</SelectItem>
                  <SelectItem value="12">12 Periods</SelectItem>
                  <SelectItem value="18">18 Periods</SelectItem>
                  <SelectItem value="24">24 Periods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={generateForecasts} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate AI Forecasts'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Predicted Revenue"
            value={`$${metrics.totalPredictedRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4" />}
            changeType="positive"
          />
          <MetricCard
            title="Average Confidence"
            value={`${metrics.averageConfidence.toFixed(1)}%`}
            icon={<Target className="h-4 w-4" />}
            changeType={metrics.averageConfidence > 80 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Growth Rate"
            value={`${metrics.growthRate.toFixed(1)}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            changeType={metrics.growthRate > 0 ? "positive" : "negative"}
          />
          <MetricCard
            title="Seasonal Trend"
            value={metrics.seasonalTrend}
            icon={<Calendar className="h-4 w-4" />}
            changeType="neutral"
          />
          <MetricCard
            title="Model Accuracy"
            value={`${metrics.modelAccuracy.toFixed(1)}%`}
            icon={<Brain className="h-4 w-4" />}
            changeType={metrics.modelAccuracy > 85 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Forecast Periods"
            value={metrics.forecastPeriods}
            icon={<Calendar className="h-4 w-4" />}
            changeType="neutral"
          />
        </div>
      )}

      {/* Charts and Analysis */}
      <Tabs defaultValue="forecasts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecasts">Sales Forecasts</TabsTrigger>
          <TabsTrigger value="confidence">Confidence Intervals</TabsTrigger>
          <TabsTrigger value="seasonality">Seasonality Analysis</TabsTrigger>
          <TabsTrigger value="accuracy">Model Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsLineChart
              data={chartData}
              title="Predicted Sales Revenue"
              description="AI-generated sales forecasts over time"
              xDataKey="date"
              yDataKey="predicted_sales"
              height={350}
            />
            <AnalyticsAreaChart
              data={chartData}
              title="Predicted Units Sold"
              description="Forecasted unit sales volume"
              xDataKey="date"
              yDataKey="predicted_units"
              height={350}
            />
          </div>
        </TabsContent>

        <TabsContent value="confidence">
          <AnalyticsAreaChart
            data={chartData}
            title="Forecast Confidence Intervals"
            description="Upper and lower bounds of prediction confidence"
            xDataKey="date"
            yDataKey="confidence_upper"
            height={400}
          />
        </TabsContent>

        <TabsContent value="seasonality">
          <AnalyticsLineChart
            data={seasonalityData}
            title="Seasonality Factors"
            description="Seasonal patterns and trend components"
            xDataKey="date"
            yDataKey="seasonal_index"
            height={400}
          />
        </TabsContent>

        <TabsContent value="accuracy">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Metrics</CardTitle>
              <CardDescription>AI algorithm accuracy and reliability indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecasts.slice(0, 5).map((forecast, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{forecast.forecast_date}</p>
                      <p className="text-sm text-muted-foreground">Algorithm: {forecast.algorithm_used}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{forecast.model_accuracy.toFixed(1)}% Accuracy</p>
                      <Badge variant={forecast.model_accuracy > 85 ? "default" : "secondary"}>
                        {forecast.model_accuracy > 90 ? "Excellent" : 
                         forecast.model_accuracy > 80 ? "Good" : "Fair"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};