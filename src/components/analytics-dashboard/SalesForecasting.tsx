import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SalesForecast {
  id: string;
  forecast_type: string;
  forecast_period_start: string;
  forecast_period_end: string;
  predicted_sales: number;
  predicted_units: number;
  confidence_interval: Record<string, number>;
  model_accuracy: number;
  algorithm_used: string;
  created_at: string;
}

const SalesForecasting: React.FC = () => {
  const [forecasts, setForecasts] = useState<SalesForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear_regression');

  useEffect(() => {
    fetchForecasts();
  }, [selectedPeriod]);

  const fetchForecasts = async () => {
    try {
      // Mock data until database tables are created
      const mockForecasts: SalesForecast[] = [];
      const today = new Date();
      
      for (let i = 1; i <= 6; i++) {
        const futureDate = new Date(today);
        futureDate.setMonth(futureDate.getMonth() + i);
        
        mockForecasts.push({
          id: `${i}`,
          forecast_type: selectedPeriod,
          forecast_period_start: futureDate.toISOString().split('T')[0],
          forecast_period_end: new Date(futureDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          predicted_sales: Math.round(50000 + Math.random() * 100000),
          predicted_units: Math.round(100 + Math.random() * 500),
          confidence_interval: { lower: 45000 + Math.random() * 20000, upper: 120000 + Math.random() * 30000 },
          model_accuracy: 85 + Math.random() * 10,
          algorithm_used: selectedAlgorithm,
          created_at: new Date().toISOString()
        });
      }
      
      setForecasts(mockForecasts);
    } catch (error) {
      console.error('Error fetching forecasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewForecast = async () => {
    setLoading(true);
    try {
      // Call the forecasting edge function
      const { data, error } = await supabase.functions.invoke('sales-forecasting', {
        body: {
          period: selectedPeriod,
          algorithm: selectedAlgorithm
        }
      });

      if (error) throw error;
      await fetchForecasts();
    } catch (error) {
      console.error('Error generating forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderForecastCard = (forecast: SalesForecast) => (
    <Card key={forecast.id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {formatDate(forecast.forecast_period_start)} - {formatDate(forecast.forecast_period_end)}
        </CardTitle>
        <CardDescription>
          {forecast.algorithm_used} | Accuracy: {forecast.model_accuracy?.toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Predicted Sales</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(forecast.predicted_sales)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Predicted Units</p>
            <p className="text-2xl font-bold">
              {forecast.predicted_units?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lower Bound</p>
            <p className="text-lg font-semibold text-muted-foreground">
              {forecast.confidence_interval?.lower ? 
                formatCurrency(forecast.confidence_interval.lower) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Upper Bound</p>
            <p className="text-lg font-semibold text-muted-foreground">
              {forecast.confidence_interval?.upper ? 
                formatCurrency(forecast.confidence_interval.upper) : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && forecasts.length === 0) {
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
          <h2 className="text-2xl font-bold">Sales Forecasting</h2>
          <p className="text-muted-foreground">AI-powered sales predictions and trends</p>
        </div>
        <Button onClick={generateNewForecast} disabled={loading}>
          {loading ? 'Generating...' : 'Generate New Forecast'}
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear_regression">Linear Regression</SelectItem>
            <SelectItem value="arima">ARIMA</SelectItem>
            <SelectItem value="neural_network">Neural Network</SelectItem>
            <SelectItem value="seasonal_decomposition">Seasonal Decomposition</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="forecasts" className="w-full">
        <TabsList>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="mt-6">
          <div className="space-y-4">
            {forecasts.length > 0 ? (
              forecasts.map(renderForecastCard)
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No forecasts available for the selected period.</p>
                    <p className="text-sm mt-2">Generate a new forecast to get started.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trends Analysis</CardTitle>
              <CardDescription>Historical trends and pattern analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Trends visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
              <CardDescription>Accuracy metrics and model comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Model performance metrics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesForecasting;