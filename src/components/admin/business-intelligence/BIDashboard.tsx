import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

export const BIDashboard = () => {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([
    {
      id: '1',
      name: 'Daily Active Users',
      value: 15420,
      change: 8.5,
      trend: 'up',
      category: 'user'
    },
    {
      id: '2',
      name: 'Conversion Rate',
      value: 3.2,
      change: 12.1,
      trend: 'up',
      category: 'conversion'
    },
    {
      id: '3',
      name: 'Average Order Value',
      value: 127.45,
      change: -2.3,
      trend: 'down',
      category: 'revenue'
    },
    {
      id: '4',
      name: 'Customer Lifetime Value',
      value: 456.78,
      change: 15.7,
      trend: 'up',
      category: 'retention'
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user': return <Users className="h-4 w-4" />;
      case 'conversion': return <TrendingUp className="h-4 w-4" />;
      case 'revenue': return <DollarSign className="h-4 w-4" />;
      case 'retention': return <Activity className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const formatValue = (value: number, category: string) => {
    switch (category) {
      case 'revenue':
      case 'retention':
        return `$${value.toFixed(2)}`;
      case 'conversion':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Intelligence</h1>
          <p className="text-muted-foreground">Advanced analytics and business insights</p>
        </div>
        <Button>
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getCategoryIcon(metric.category)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(metric.value, metric.category)}</div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(metric.trend)}
                <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="sales">Sales Intelligence</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Critical business metrics overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Revenue Growth Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-success">+18.5%</span>
                      <Badge variant="outline" className="bg-success/10">Excellent</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Acquisition Cost</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">$23.45</span>
                      <Badge variant="outline" className="bg-warning/10">Good</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Churn Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-success">2.1%</span>
                      <Badge variant="outline" className="bg-success/10">Excellent</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Net Promoter Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">72</span>
                      <Badge variant="outline" className="bg-success/10">Excellent</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>Competitive analysis and market trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Market Share</span>
                    <span className="font-semibold">15.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Competitor Analysis Score</span>
                    <span className="font-semibold text-success">8.4/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Brand Sentiment</span>
                    <span className="font-semibold text-success">Positive</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Growth Rate</span>
                    <span className="font-semibold">+12.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>User behavior patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">High Value Customers</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Regular Customers</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Occasional Buyers</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Journey</CardTitle>
                <CardDescription>Conversion funnel analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Awareness</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Interest</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Consideration</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Purchase</span>
                    <span className="text-sm font-medium">3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Analysis</CardTitle>
                <CardDescription>Customer loyalty metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">1-Month Retention</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">3-Month Retention</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">6-Month Retention</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">12-Month Retention</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Intelligence</CardTitle>
              <CardDescription>Advanced sales analytics and forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Revenue Drivers</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Product Sales</span>
                      <span className="font-semibold">$2.1M (73%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Revenue</span>
                      <span className="font-semibold">$450K (16%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscription Fees</span>
                      <span className="font-semibold">$297K (11%)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sales Forecast (Next Quarter)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Conservative</span>
                      <span className="font-semibold">$2.8M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Realistic</span>
                      <span className="font-semibold text-primary">$3.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Optimistic</span>
                      <span className="font-semibold">$3.8M</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>AI-powered business predictions and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Churn Prediction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">234</div>
                    <p className="text-xs text-muted-foreground">Customers at risk (next 30 days)</p>
                    <Button size="sm" variant="outline" className="mt-2">View Details</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Demand Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">+18%</div>
                    <p className="text-xs text-muted-foreground">Expected demand increase</p>
                    <Button size="sm" variant="outline" className="mt-2">Optimize Inventory</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};