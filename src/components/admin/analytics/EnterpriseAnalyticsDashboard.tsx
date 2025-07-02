import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Target,
  Eye,
  Clock,
  Filter,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const EnterpriseAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState({
    realTime: {
      activeUsers: 2847,
      ordersPerMinute: 23,
      revenuePerMinute: 45600,
      conversionRate: 3.42
    },
    performance: {
      pageViews: '1.2M',
      uniqueVisitors: '456K',
      bounceRate: 24.7,
      avgSessionDuration: '4m 23s'
    },
    business: {
      totalRevenue: '৳45.7M',
      totalOrders: 127845,
      avgOrderValue: '৳890',
      customerLTV: '৳2,340'
    }
  });

  const [alerts, setAlerts] = useState([
    { type: 'warning', message: 'Conversion rate dropped 5% in last hour', time: '2 mins ago' },
    { type: 'info', message: 'Traffic spike detected from mobile users', time: '15 mins ago' },
    { type: 'success', message: 'Monthly revenue target achieved', time: '1 hour ago' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Enterprise Analytics</h2>
        <div className="flex gap-2 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Real-time Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      alert.type === 'warning' ? 'destructive' :
                      alert.type === 'success' ? 'default' : 'secondary'
                    }>
                      {alert.type}
                    </Badge>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Real-time Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.realTime.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Currently online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders/Minute</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.realTime.ordersPerMinute}</div>
              <p className="text-xs text-muted-foreground">
                Live order rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue/Minute</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">৳{metrics.realTime.revenuePerMinute.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Live revenue rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.realTime.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Real-time conversion
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Site Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Page Views</span>
                    <span className="text-lg font-bold">{metrics.performance.pageViews}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Unique Visitors</span>
                    <span className="text-lg font-bold">{metrics.performance.uniqueVisitors}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bounce Rate</span>
                    <span className="text-lg font-bold text-orange-600">{metrics.performance.bounceRate}%</span>
                  </div>
                  <Progress value={metrics.performance.bounceRate} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg Session Duration</span>
                    <span className="text-lg font-bold text-green-600">{metrics.performance.avgSessionDuration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Business Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-lg font-bold text-green-600">{metrics.business.totalRevenue}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Orders</span>
                    <span className="text-lg font-bold">{metrics.business.totalOrders.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg Order Value</span>
                    <span className="text-lg font-bold text-blue-600">{metrics.business.avgOrderValue}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer LTV</span>
                    <span className="text-lg font-bold text-purple-600">{metrics.business.customerLTV}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">+23.5%</div>
                  <div className="text-sm text-muted-foreground">Revenue Growth</div>
                  <div className="text-xs text-muted-foreground">vs last period</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">+18.2%</div>
                  <div className="text-sm text-muted-foreground">User Growth</div>
                  <div className="text-xs text-muted-foreground">vs last period</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">+12.7%</div>
                  <div className="text-sm text-muted-foreground">Order Growth</div>
                  <div className="text-xs text-muted-foreground">vs last period</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Age Groups</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">18-24</span>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">25-34</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">35-44</span>
                        <span className="text-sm font-medium">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">45+</span>
                        <span className="text-sm font-medium">7%</span>
                      </div>
                      <Progress value={7} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dhaka</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Chittagong</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sylhet</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rajshahi</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Others</span>
                    <span className="text-sm font-medium">26%</span>
                  </div>
                  <Progress value={26} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Behavior Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold">2.4</div>
                  <div className="text-sm text-muted-foreground">Pages per Session</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold">4m 23s</div>
                  <div className="text-sm text-muted-foreground">Avg Session Duration</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold">67%</div>
                  <div className="text-sm text-muted-foreground">Return Visitors</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold">24.7%</div>
                  <div className="text-sm text-muted-foreground">Bounce Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Website Visits</span>
                    <span className="font-bold">100,000</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Product Views</span>
                    <span className="font-bold">45,000 (45%)</span>
                  </div>
                  <Progress value={45} className="h-3" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Add to Cart</span>
                    <span className="font-bold">12,000 (12%)</span>
                  </div>
                  <Progress value={12} className="h-3" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Checkout</span>
                    <span className="font-bold">6,000 (6%)</span>
                  </div>
                  <Progress value={6} className="h-3" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Purchase</span>
                    <span className="font-bold">3,800 (3.8%)</span>
                  </div>
                  <Progress value={3.8} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Product Sales</span>
                    <span className="text-lg font-bold">৳38.2M (84%)</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Shipping Fees</span>
                    <span className="text-lg font-bold">৳4.6M (10%)</span>
                  </div>
                  <Progress value={10} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Commission</span>
                    <span className="text-lg font-bold">৲2.9M (6%)</span>
                  </div>
                  <Progress value={6} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">bKash</span>
                    <span className="text-lg font-bold">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Nagad</span>
                    <span className="text-lg font-bold">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cash on Delivery</span>
                    <span className="text-lg font-bold">18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Others</span>
                    <span className="text-lg font-bold">9%</span>
                  </div>
                  <Progress value={9} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};