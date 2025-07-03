import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Brain,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VendorMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate: number;
  customerRetention: number;
  monthlyGrowth: number;
  profitMargin: number;
}

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  predicted?: boolean;
}

interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  stock: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
}

interface CustomerInsight {
  segment: string;
  count: number;
  revenue: number;
  avgOrderValue: number;
  growthRate: number;
}

interface ForecastData {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
}

export const EnhancedAnalyticsDashboard: React.FC<{ vendorId?: string }> = ({ vendorId }) => {
  const [metrics, setMetrics] = useState<VendorMetrics | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [customerInsights, setCustomerInsights] = useState<CustomerInsight[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, selectedCategory, vendorId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Enhanced vendor metrics with growth trends
      const mockMetrics: VendorMetrics = {
        totalRevenue: 156780 + Math.floor(Math.random() * 20000),
        totalOrders: 1248 + Math.floor(Math.random() * 200),
        totalProducts: 45 + Math.floor(Math.random() * 10),
        averageOrderValue: 1256 + Math.floor(Math.random() * 300),
        conversionRate: 3.2 + Math.random() * 2,
        customerRetention: 68 + Math.random() * 15,
        monthlyGrowth: 12.5 + Math.random() * 8,
        profitMargin: 23.8 + Math.random() * 6
      };
      
      // Enhanced sales data with predictions
      const mockSalesData: SalesData[] = [
        { period: '2024-01', revenue: 45000, orders: 350, customers: 280 },
        { period: '2024-02', revenue: 52000, orders: 420, customers: 340 },
        { period: '2024-03', revenue: 48000, orders: 380, customers: 310 },
        { period: '2024-04', revenue: 59000, orders: 450, customers: 380 },
        { period: '2024-05', revenue: 63000, orders: 480, customers: 420 },
        { period: '2024-06', revenue: 67000, orders: 520, customers: 450 },
        { period: '2024-07', revenue: 72000, orders: 560, customers: 480, predicted: true },
        { period: '2024-08', revenue: 75000, orders: 580, customers: 500, predicted: true }
      ];
      
      // Enhanced product performance with trends
      const mockProducts: ProductPerformance[] = [
        { id: '1', name: 'Premium Smartphone', revenue: 89000, orders: 89, stock: 15, rating: 4.8, trend: 'up' },
        { id: '2', name: 'Wireless Headphones', revenue: 45000, orders: 180, stock: 32, rating: 4.5, trend: 'up' },
        { id: '3', name: 'Smart Watch', revenue: 34000, orders: 85, stock: 8, rating: 4.6, trend: 'stable' },
        { id: '4', name: 'Laptop Backpack', revenue: 12000, orders: 120, stock: 45, rating: 4.3, trend: 'down' },
        { id: '5', name: 'Power Bank', revenue: 8000, orders: 160, stock: 67, rating: 4.2, trend: 'stable' }
      ];
      
      // Enhanced customer insights with growth rates
      const mockInsights: CustomerInsight[] = [
        { segment: 'Premium Customers', count: 156, revenue: 78000, avgOrderValue: 2500, growthRate: 15.2 },
        { segment: 'Regular Customers', count: 342, revenue: 56000, avgOrderValue: 1200, growthRate: 8.7 },
        { segment: 'Occasional Buyers', count: 498, revenue: 23000, avgOrderValue: 680, growthRate: -2.1 },
        { segment: 'New Customers', count: 89, revenue: 12000, avgOrderValue: 890, growthRate: 25.6 }
      ];

      // AI-powered forecasting data
      const mockForecastData: ForecastData[] = [
        { metric: 'Revenue', current: 67000, predicted: 75000, confidence: 87, timeframe: 'Next Month' },
        { metric: 'Orders', current: 520, predicted: 580, confidence: 82, timeframe: 'Next Month' },
        { metric: 'New Customers', current: 89, predicted: 105, confidence: 78, timeframe: 'Next Month' },
        { metric: 'Customer Retention', current: 68, predicted: 72, confidence: 85, timeframe: 'Next Quarter' }
      ];
      
      setMetrics(mockMetrics);
      setSalesData(mockSalesData);
      setProductPerformance(mockProducts);
      setCustomerInsights(mockInsights);
      setForecastData(mockForecastData);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 10) return 'text-green-600';
    if (rate > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Vendor Analytics</h1>
          <p className="text-muted-foreground">Advanced insights with predictive forecasting</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={loadAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{metrics?.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{metrics?.monthlyGrowth.toFixed(1)}% from last month
            </div>
            <Progress value={(metrics?.monthlyGrowth || 0) * 4} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics?.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Avg: ৳{metrics?.averageOrderValue}</p>
            <Progress value={(metrics?.totalOrders || 0) / 20} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics?.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Industry avg: 2.8%</p>
            <Progress value={metrics?.conversionRate || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics?.customerRetention.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Target: 75%</p>
            <Progress value={metrics?.customerRetention || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="forecasting">AI Forecasting</TabsTrigger>
          <TabsTrigger value="competitive">Market Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend with Predictions</CardTitle>
                <CardDescription>Historical data and AI-powered forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{data.period}</span>
                        {data.predicted && <Badge variant="outline" className="text-xs">Predicted</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">৳{data.revenue.toLocaleString()}</span>
                        <Progress 
                          value={(data.revenue / 80000) * 100} 
                          className={`w-20 ${data.predicted ? 'opacity-60' : ''}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Indicators</CardTitle>
                <CardDescription>Key business metrics overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{metrics?.profitMargin.toFixed(1)}%</span>
                      <Progress value={metrics?.profitMargin || 0} className="w-20" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Growth</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-600">+{metrics?.monthlyGrowth.toFixed(1)}%</span>
                      <Progress value={(metrics?.monthlyGrowth || 0) * 4} className="w-20" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Order Value</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">৳{metrics?.averageOrderValue}</span>
                      <Progress value={(metrics?.averageOrderValue || 0) / 30} className="w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Analysis</CardTitle>
              <CardDescription>Detailed insights on product trends and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.orders} orders • Rating: {product.rating}/5 • Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">৳{product.revenue.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {getTrendIcon(product.trend)}
                          <span className={product.trend === 'up' ? 'text-green-600' : 
                                         product.trend === 'down' ? 'text-red-600' : 'text-blue-600'}>
                            {product.trend}
                          </span>
                        </div>
                      </div>
                      <Progress value={(product.revenue / 100000) * 100} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments Analysis</CardTitle>
              <CardDescription>Deep insights into customer behavior and value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerInsights.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{insight.segment}</h3>
                      <p className="text-sm text-muted-foreground">{insight.count} customers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{insight.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Avg: ৳{insight.avgOrderValue}</p>
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <TrendingUp className={`w-3 h-3 ${getGrowthColor(insight.growthRate)}`} />
                        <span className={getGrowthColor(insight.growthRate)}>
                          {insight.growthRate > 0 ? '+' : ''}{insight.growthRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  AI-Powered Forecasting
                </CardTitle>
                <CardDescription>Machine learning predictions for business metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forecastData.map((forecast, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{forecast.metric}</h3>
                        <Badge variant="outline">{forecast.timeframe}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span className="font-medium">{forecast.current.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Predicted:</span>
                          <span className="font-medium text-blue-600">{forecast.predicted.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Confidence:</span>
                          <span className="font-medium">{forecast.confidence}%</span>
                        </div>
                        <Progress value={forecast.confidence} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Inventory Optimization</h4>
                    <p className="text-sm text-blue-700">Consider restocking Smart Watch (only 8 units left) based on predicted demand increase of 15%</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Marketing Opportunity</h4>
                    <p className="text-sm text-green-700">Premium customer segment shows 15.2% growth - ideal for targeted premium product campaigns</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Pricing Strategy</h4>
                    <p className="text-sm text-purple-700">Your conversion rate is above industry average - consider testing premium pricing on top products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitive">
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence</CardTitle>
              <CardDescription>Competitive analysis and market positioning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-medium">Market Position</h3>
                  <p className="text-2xl font-bold text-green-600">#3</p>
                  <p className="text-sm text-muted-foreground">In electronics category</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-medium">Price Competitiveness</h3>
                  <p className="text-2xl font-bold text-blue-600">85%</p>
                  <p className="text-sm text-muted-foreground">Vs market average</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-medium">Customer Satisfaction</h3>
                  <p className="text-2xl font-bold text-purple-600">4.6/5</p>
                  <p className="text-sm text-muted-foreground">Above category avg (4.2)</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Market Insights</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Electronics category growing at 18% annually in Bangladesh</li>
                  <li>• Mobile accessories subcategory shows highest potential</li>
                  <li>• Customer preference shifting towards premium quality</li>
                  <li>• Festive season approaching - plan inventory accordingly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};