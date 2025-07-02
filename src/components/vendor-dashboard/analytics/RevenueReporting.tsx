import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Download, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RevenueData {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
  avgOrderValue: number;
  growth: number;
}

const RevenueReporting: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [reportType, setReportType] = useState('monthly');
  const [period, setPeriod] = useState('12months');
  const [loading, setLoading] = useState(true);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('vendor-analytics-engine', {
        body: { type: 'revenue', period, reportType }
      });

      if (error) throw error;

      setRevenueData(data.insights?.monthlyTrend || []);
      setInsights(data.insights || null);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast({
        title: "Error",
        description: "Failed to load revenue data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [reportType, period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const generateReport = async () => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      const endDate = new Date();

      const { data, error } = await supabase.functions.invoke('vendor-financial-management', {
        body: {
          action: 'generate-report',
          reportType: 'revenue',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      });

      if (error) throw error;

      // Create and download CSV
      const csvContent = generateCSV(data.report);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Revenue report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const generateCSV = (reportData: any) => {
    const headers = ['Date', 'Revenue', 'Orders', 'Average Order Value'];
    const rows = reportData.data.map((row: any) => [
      row.analytics_date,
      row.total_revenue,
      row.total_orders,
      row.average_order_value
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Revenue Reporting</h2>
          <p className="text-muted-foreground">Advanced revenue analytics and forecasting</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={generateReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(revenueData.reduce((sum, d) => sum + d.revenue, 0))}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">
                    +{insights?.avgGrowthRate?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Average</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(revenueData.reduce((sum, d) => sum + d.revenue, 0) / Math.max(revenueData.length, 1))}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Per month</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Month</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(Math.max(...revenueData.map(d => d.revenue)))}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Peak performance</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Profit Trend</CardTitle>
          <CardDescription>Track revenue and profit over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(Number(value)), name === 'revenue' ? 'Revenue' : 'Profit']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1"
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stackId="2"
                stroke="hsl(var(--chart-2))" 
                fill="hsl(var(--chart-2))"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
          <CardDescription>Breakdown of revenue by product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights?.revenueByCategory && Object.entries(insights.revenueByCategory).map(([category, revenue]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{category}</span>
                  <div className="text-right">
                    <span className="font-bold">{formatCurrency(revenue as number)}</span>
                    <div className="w-32 bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${((revenue as number) / Math.max(...Object.values(insights.revenueByCategory).map(v => Number(v)))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>Projected revenue for the next 3 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((month) => {
              const avgRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0) / revenueData.length;
              const growth = insights?.avgGrowthRate || 0;
              const forecast = avgRevenue * (1 + (growth / 100) * month);

              return (
                <div key={month} className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Month +{month}</p>
                  <p className="text-xl font-bold">{formatCurrency(forecast)}</p>
                  <p className="text-sm text-green-500">+{(growth * month).toFixed(1)}% projected</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueReporting;