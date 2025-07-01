import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  Star,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SalesMetric {
  period: string;
  revenue: number;
  orders: number;
  units: number;
  avgOrderValue: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  units: number;
  views: number;
  conversionRate: number;
  rating: number;
  reviews: number;
}

const SellerAnalyticsDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [loading, setLoading] = useState(false);

  const salesMetrics: SalesMetric[] = [
    { period: 'Today', revenue: 12500, orders: 45, units: 89, avgOrderValue: 278 },
    { period: 'Yesterday', revenue: 11200, orders: 38, units: 76, avgOrderValue: 295 },
    { period: 'This Week', revenue: 87400, orders: 312, units: 645, avgOrderValue: 280 },
    { period: 'Last Week', revenue: 79200, orders: 289, units: 598, avgOrderValue: 274 },
    { period: 'This Month', revenue: 342000, orders: 1234, units: 2567, avgOrderValue: 277 },
    { period: 'Last Month', revenue: 318000, orders: 1156, units: 2398, avgOrderValue: 275 }
  ];

  const topProducts: ProductPerformance[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      revenue: 45000,
      units: 180,
      views: 2340,
      conversionRate: 7.7,
      rating: 4.5,
      reviews: 89
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      revenue: 38500,
      units: 55,
      views: 1890,
      conversionRate: 2.9,
      rating: 4.3,
      reviews: 67
    },
    {
      id: '3',
      name: 'Eco-Friendly Water Bottle',
      revenue: 12400,
      units: 248,
      views: 1560,
      conversionRate: 15.9,
      rating: 4.7,
      reviews: 156
    },
    {
      id: '4',
      name: 'Organic Cotton T-Shirt',
      revenue: 18900,
      units: 315,
      views: 2100,
      conversionRate: 15.0,
      rating: 4.4,
      reviews: 203
    }
  ];

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being generated and will be downloaded shortly."
    });
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ElementType;
    format?: 'currency' | 'number' | 'percentage';
  }> = ({ title, value, change, icon: Icon, format = 'number' }) => {
    const formatValue = (val: string | number) => {
      if (format === 'currency') return `৳${Number(val).toLocaleString()}`;
      if (format === 'percentage') return `${val}%`;
      return Number(val).toLocaleString();
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{formatValue(value)}</p>
              <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}% from last period
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seller Analytics</h1>
          <p className="text-muted-foreground">Track your store performance and insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={87400}
          change={10.2}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Orders"
          value={312}
          change={7.8}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Units Sold"
          value={645}
          change={12.5}
          icon={Package}
        />
        <MetricCard
          title="Avg Order Value"
          value={280}
          change={2.1}
          icon={TrendingUp}
          format="currency"
        />
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Sales chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Inventory Turnover</span>
                  <Badge variant="secondary">Good</Badge>
                </div>
                <Progress value={78} className="w-full" />
                
                <div className="flex items-center justify-between">
                  <span>Customer Satisfaction</span>
                  <Badge variant="secondary">Excellent</Badge>
                </div>
                <Progress value={92} className="w-full" />
                
                <div className="flex items-center justify-between">
                  <span>Order Fulfillment</span>
                  <Badge variant="secondary">Good</Badge>
                </div>
                <Progress value={85} className="w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Low Stock Alert</p>
                    <p className="text-xs text-muted-foreground">5 products running low</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sales Spike</p>
                    <p className="text-xs text-muted-foreground">30% increase today</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Star className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Reviews</p>
                    <p className="text-xs text-muted-foreground">12 new 5-star reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.units} units • {product.views} views
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">৳{product.revenue.toLocaleString()}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{product.conversionRate}% CR</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/10 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Customer demographics chart</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average CLV</span>
                    <span className="font-semibold">৳2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repeat Purchase Rate</span>
                    <span className="font-semibold">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Retention</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Order Frequency</span>
                    <span className="font-semibold">2.3 orders/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Page Views"
              value={15430}
              change={8.2}
              icon={Activity}
            />
            <MetricCard
              title="Conversion Rate"
              value={3.2}
              change={0.5}
              icon={TrendingUp}
              format="percentage"
            />
            <MetricCard
              title="Bounce Rate"
              value={45.2}
              change={-2.1}
              icon={Users}
              format="percentage"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Performance trends chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Revenue Opportunity</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Consider increasing your inventory for "Wireless Bluetooth Headphones" - 
                  demand is 40% higher than current stock levels.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Marketing Success</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your recent promotion campaign increased sales by 25%. 
                  Similar campaigns could boost revenue in the "Fashion" category.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900">Customer Retention</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Customers who purchase water bottles have a 60% higher repeat purchase rate. 
                  Consider cross-promoting with fitness accessories.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerAnalyticsDashboard;