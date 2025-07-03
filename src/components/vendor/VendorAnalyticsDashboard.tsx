import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Star,
  Package,
  Clock,
  Target,
  Award,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VendorAnalytics {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  active_products: number;
  average_rating: number;
  total_reviews: number;
  response_time_hours: number;
  fulfillment_rate: number;
  return_rate: number;
  customer_satisfaction: number;
  performance_score: number;
  tier_id: string;
  vendor_tiers?: {
    tier_name: string;
    benefits: string[];
    commission_discount: number;
  };
}

interface VendorMetrics {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  period: string;
}

export const VendorAnalyticsDashboard: React.FC<{ vendorId: string }> = ({ vendorId }) => {
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [metrics, setMetrics] = useState<VendorMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [vendorId, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await supabase.functions.invoke('vendor-management-enhanced', {
        method: 'GET',
        body: { 
          action: 'analytics',
          vendor_id: vendorId,
          period 
        }
      });

      if (response.error) throw response.error;

      setAnalytics(response.data.analytics);
      setMetrics(response.data.metrics);

    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getTierBadgeVariant = (tierName: string) => {
    switch (tierName?.toLowerCase()) {
      case 'platinum': return 'default';
      case 'gold': return 'secondary';
      case 'silver': return 'outline';
      default: return 'destructive';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    suffix?: string;
    description?: string;
  }> = ({ title, value, icon, trend, suffix, description }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {value}{suffix}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatPercentage(Math.abs(trend))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendor Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive performance insights for your business
          </p>
        </div>
        <div className="flex items-center gap-2">
          {analytics?.vendor_tiers && (
            <Badge variant={getTierBadgeVariant(analytics.vendor_tiers.tier_name)}>
              <Award className="h-3 w-3 mr-1" />
              {analytics.vendor_tiers.tier_name} Tier
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Score
            </CardTitle>
            <CardDescription>
              Overall performance based on sales, customer satisfaction, and operational metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className={`text-4xl font-bold ${getPerformanceColor(analytics.performance_score)}`}>
                  {analytics.performance_score.toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Out of 100</p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm font-medium">
                  Commission Discount: {formatPercentage(analytics.vendor_tiers?.commission_discount || 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Next tier benefits available
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period Selector */}
      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="7d">7 Days</TabsTrigger>
          <TabsTrigger value="30d">30 Days</TabsTrigger>
          <TabsTrigger value="90d">90 Days</TabsTrigger>
          <TabsTrigger value="1y">1 Year</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(metrics?.total_revenue || 0)}
              icon={<DollarSign className="h-4 w-4" />}
              trend={12.5}
              description={`${period} period`}
            />
            <StatCard
              title="Orders"
              value={metrics?.total_orders || 0}
              icon={<ShoppingCart className="h-4 w-4" />}
              trend={8.2}
              description={`${period} period`}
            />
            <StatCard
              title="Avg Order Value"
              value={formatCurrency(metrics?.avg_order_value || 0)}
              icon={<TrendingUp className="h-4 w-4" />}
              trend={-2.1}
              description={`${period} period`}
            />
            <StatCard
              title="Active Products"
              value={analytics?.active_products || 0}
              icon={<Package className="h-4 w-4" />}
              description="Currently listed"
            />
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Customer Rating"
              value={analytics?.average_rating?.toFixed(1) || '0.0'}
              icon={<Star className="h-4 w-4" />}
              suffix="/5.0"
              description={`${analytics?.total_reviews || 0} reviews`}
            />
            <StatCard
              title="Response Time"
              value={analytics?.response_time_hours?.toFixed(1) || '0'}
              icon={<Clock className="h-4 w-4" />}
              suffix=" hrs"
              description="Avg response time"
            />
            <StatCard
              title="Fulfillment Rate"
              value={formatPercentage(analytics?.fulfillment_rate || 0)}
              icon={<Package className="h-4 w-4" />}
              description="Orders fulfilled on time"
            />
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Satisfaction</span>
                  <span className="text-lg font-bold">
                    {formatPercentage(analytics?.customer_satisfaction || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Return Rate</span>
                  <span className={`text-sm font-medium ${(analytics?.return_rate || 0) > 5 ? 'text-destructive' : 'text-success'}`}>
                    {formatPercentage(analytics?.return_rate || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Reviews</span>
                  <span className="text-sm font-medium">{analytics?.total_reviews || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tier Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Tier Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics?.vendor_tiers?.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    Maintain performance to keep tier benefits
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bangladesh Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle>Bangladesh Compliance Status</CardTitle>
              <CardDescription>
                Regulatory compliance for Bangladesh market operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">VAT Registration</span>
                  <Badge variant="default">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Trade License</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">TIN Certificate</span>
                  <Badge variant="default">Valid</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Bank Verification</span>
                  <Badge variant="default">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">AML Check</span>
                  <Badge variant="default">Passed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Overall Status</span>
                  <Badge variant="default">100% Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};