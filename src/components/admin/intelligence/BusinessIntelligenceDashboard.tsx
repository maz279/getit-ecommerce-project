import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Target,
  Zap,
  PieChart,
  BarChart3,
  LineChart
} from 'lucide-react';

export const BusinessIntelligenceDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [insights, setInsights] = useState([
    {
      title: 'Customer Behavior Shift Detected',
      type: 'trend',
      impact: 'high',
      description: 'Mobile shopping increased 34% this month, consider mobile-first promotions',
      confidence: 92,
      action: 'Optimize mobile experience'
    },
    {
      title: 'Seasonal Demand Prediction',
      type: 'forecast',
      impact: 'medium',
      description: 'Winter clothing demand will spike 67% in next 2 weeks',
      confidence: 88,
      action: 'Increase inventory'
    },
    {
      title: 'Vendor Performance Alert',
      type: 'alert',
      impact: 'high',
      description: 'Top vendor delivery delays affecting customer satisfaction',
      confidence: 96,
      action: 'Vendor discussion needed'
    }
  ]);

  const [kpis, setKpis] = useState({
    revenue: { value: '৳12.4M', change: 23.5, trend: 'up' },
    orders: { value: '15,234', change: 18.2, trend: 'up' },
    customers: { value: '45,891', change: 12.7, trend: 'up' },
    conversion: { value: '3.8%', change: -2.1, trend: 'down' },
    avgOrderValue: { value: '৳814', change: 8.9, trend: 'up' },
    customerLifetime: { value: '৳2,450', change: 15.3, trend: 'up' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Business Intelligence</h2>
        <div className="flex gap-2 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* AI-Generated Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge variant={
                      insight.impact === 'high' ? 'destructive' :
                      insight.impact === 'medium' ? 'default' : 'secondary'
                    }>
                      {insight.impact} impact
                    </Badge>
                    <Badge variant="outline">{insight.confidence}% confidence</Badge>
                  </div>
                  <Button size="sm">Take Action</Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{insight.action}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.revenue.value}</div>
            <p className={`text-xs ${kpis.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              +{kpis.revenue.change}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.orders.value}</div>
            <p className={`text-xs ${kpis.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              +{kpis.orders.change}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.customers.value}</div>
            <p className={`text-xs ${kpis.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              +{kpis.customers.change}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.conversion.value}</div>
            <p className={`text-xs ${kpis.conversion.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {kpis.conversion.change}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.avgOrderValue.value}</div>
            <p className={`text-xs ${kpis.avgOrderValue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              +{kpis.avgOrderValue.change}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.customerLifetime.value}</div>
            <p className={`text-xs ${kpis.customerLifetime.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              +{kpis.customerLifetime.change}% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="predictions">Predictive Models</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          <TabsTrigger value="competitive">Market Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Revenue</span>
                    <span className="text-lg font-bold text-green-600">৳412K</span>
                  </div>
                  <Progress value={78} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Weekly Target</span>
                    <span className="text-lg font-bold text-blue-600">৳2.8M</span>
                  </div>
                  <Progress value={92} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Target</span>
                    <span className="text-lg font-bold text-orange-600">৳12M</span>
                  </div>
                  <Progress value={68} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-xl font-bold text-green-600">98.5%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-xl font-bold text-blue-600">1.2s</div>
                      <div className="text-xs text-muted-foreground">Page Load</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-xl font-bold text-orange-600">4.8</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-xl font-bold text-purple-600">67%</div>
                      <div className="text-xs text-muted-foreground">Retention</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Predictions & Forecasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sales Forecast (Next 30 Days)</h4>
                  <div className="text-2xl font-bold text-green-600 mb-2">৳15.7M</div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on historical data, seasonal patterns, and market trends
                  </p>
                  <Badge variant="outline">89% Confidence</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Customer Acquisition</h4>
                  <div className="text-2xl font-bold text-blue-600 mb-2">2,340 new customers</div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Predicted new customer registrations this month
                  </p>
                  <Badge variant="outline">92% Confidence</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Inventory Optimization</h4>
                  <div className="text-2xl font-bold text-orange-600 mb-2">৳890K savings</div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Potential cost savings through optimized inventory management
                  </p>
                  <Badge variant="outline">85% Confidence</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segmentation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">High-Value Customers</h4>
                  <div className="text-xl font-bold text-green-600">12,450 (27%)</div>
                  <p className="text-sm text-muted-foreground">Average order: ৳2,340</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Regular Customers</h4>
                  <div className="text-xl font-bold text-blue-600">23,780 (52%)</div>
                  <p className="text-sm text-muted-foreground">Average order: ৳890</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">New Customers</h4>
                  <div className="text-xl font-bold text-orange-600">7,890 (17%)</div>
                  <p className="text-sm text-muted-foreground">Average order: ৳650</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">At-Risk Customers</h4>
                  <div className="text-xl font-bold text-red-600">1,870 (4%)</div>
                  <p className="text-sm text-muted-foreground">Requires intervention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Market Position</h4>
                  <div className="text-xl font-bold text-green-600">#3 in Bangladesh</div>
                  <p className="text-sm text-muted-foreground">E-commerce marketplace ranking</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Price Competitiveness</h4>
                  <div className="text-xl font-bold text-blue-600">94% competitive</div>
                  <p className="text-sm text-muted-foreground">Products priced competitively</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Market Share Growth</h4>
                  <div className="text-xl font-bold text-orange-600">+2.3%</div>
                  <p className="text-sm text-muted-foreground">Quarter over quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};