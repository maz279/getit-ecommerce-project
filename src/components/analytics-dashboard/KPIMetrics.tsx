import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, DollarSign, Users, ShoppingCart, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface KPIMetric {
  id: string;
  metric_name: string;
  metric_category: string;
  metric_value: number;
  metric_unit: string;
  comparison_value: number;
  percentage_change: number;
  trend_direction: string;
  time_period: string;
  recorded_date: string;
  metadata: Record<string, any>;
}

const KPIMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('sales');

  useEffect(() => {
    fetchKPIMetrics();
    const interval = setInterval(fetchKPIMetrics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchKPIMetrics = async () => {
    try {
      // Mock data until database tables are created
      const mockMetrics: KPIMetric[] = [
        {
          id: '1',
          metric_name: 'Monthly Revenue',
          metric_category: 'sales',
          metric_value: 2400000,
          metric_unit: 'BDT',
          comparison_value: 2100000,
          percentage_change: 14.3,
          trend_direction: 'up',
          time_period: 'monthly',
          recorded_date: new Date().toISOString(),
          metadata: {}
        },
        {
          id: '2',
          metric_name: 'Active Customers',
          metric_category: 'customers',
          metric_value: 12500,
          metric_unit: 'count',
          comparison_value: 11800,
          percentage_change: 5.9,
          trend_direction: 'up',
          time_period: 'monthly',
          recorded_date: new Date().toISOString(),
          metadata: {}
        }
      ];
      
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching KPI metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sales':
      case 'revenue': return <DollarSign className="h-5 w-5" />;
      case 'customers':
      case 'users': return <Users className="h-5 w-5" />;
      case 'orders': return <ShoppingCart className="h-5 w-5" />;
      case 'products':
      case 'inventory': return <Package className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (direction: string, change: number) => {
    if (direction === 'up' || change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (direction === 'down' || change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = (direction: string, change: number) => {
    if (direction === 'up' || change > 0) return 'text-green-600';
    if (direction === 'down' || change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatMetricValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'BDT' || unit === 'currency') {
      return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT'
      }).format(value);
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const renderMetricCard = (metric: KPIMetric) => (
    <Card key={metric.id} className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getMetricIcon(metric.metric_category)}
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.metric_name}
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {metric.time_period}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {formatMetricValue(metric.metric_value, metric.metric_unit)}
          </div>
          
          {metric.percentage_change !== 0 && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend_direction, metric.percentage_change)}`}>
              {getTrendIcon(metric.trend_direction, metric.percentage_change)}
              <span>
                {metric.percentage_change > 0 ? '+' : ''}{metric.percentage_change.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs previous</span>
            </div>
          )}
          
          {metric.comparison_value && (
            <div className="text-xs text-muted-foreground">
              Previous: {formatMetricValue(metric.comparison_value, metric.metric_unit)}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            Updated: {new Date(metric.recorded_date).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getMetricsByCategory = (category: string) => {
    if (category === 'overview') {
      // Return key metrics from each category
      const categories = ['sales', 'customers', 'orders', 'products'];
      return categories.map(cat => 
        metrics.find(m => m.metric_category.toLowerCase() === cat)
      ).filter(Boolean) as KPIMetric[];
    }
    return metrics.filter(metric => 
      metric.metric_category.toLowerCase() === category.toLowerCase()
    );
  };

  const generateMockMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-kpi-metrics', {
        body: { refresh: true }
      });

      if (error) throw error;
      await fetchKPIMetrics();
    } catch (error) {
      console.error('Error generating metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && metrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredMetrics = getMetricsByCategory(activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">KPI Metrics</h2>
          <p className="text-muted-foreground">Key performance indicators and business metrics</p>
        </div>
        <Button onClick={generateMockMetrics} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Metrics'}
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMetrics.length > 0 ? (
              filteredMetrics.map(renderMetricCard)
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No KPI metrics available for this category.</p>
                      <p className="text-sm mt-2">Metrics will appear as data is collected.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats Summary */}
      {activeCategory === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                <div>
                  <div className="text-2xl font-bold">₹2.4M</div>
                  <div className="text-sm opacity-90">Total Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <div>
                  <div className="text-2xl font-bold">12.5K</div>
                  <div className="text-sm opacity-90">Active Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                <div>
                  <div className="text-2xl font-bold">8.9K</div>
                  <div className="text-sm opacity-90">Total Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                <div>
                  <div className="text-2xl font-bold">45.2K</div>
                  <div className="text-sm opacity-90">Products Listed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KPIMetrics;