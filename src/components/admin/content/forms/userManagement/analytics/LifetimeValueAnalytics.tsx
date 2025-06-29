
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export const LifetimeValueAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12months');
  const [selectedSegment, setSelectedSegment] = useState('all');

  // Mock data for CLV analytics
  const clvOverview = {
    averageCLV: 2840,
    totalCustomers: 15420,
    predictedRevenue: 43800000,
    retentionRate: 68.5
  };

  const topCustomers = [
    { id: 1, name: 'Ahmed Rahman', email: 'ahmed.r@email.com', clv: 15420, orders: 28, lastOrder: '2 days ago' },
    { id: 2, name: 'Fatima Khan', email: 'fatima.k@email.com', clv: 12380, orders: 24, lastOrder: '1 week ago' },
    { id: 3, name: 'Mohammad Ali', email: 'mohammad.a@email.com', clv: 10950, orders: 19, lastOrder: '3 days ago' },
    { id: 4, name: 'Rashida Begum', email: 'rashida.b@email.com', clv: 9870, orders: 22, lastOrder: '5 days ago' },
    { id: 5, name: 'Hassan Ahmed', email: 'hassan.a@email.com', clv: 8640, orders: 16, lastOrder: '1 day ago' }
  ];

  const clvSegments = [
    { segment: 'Premium (৳10k+)', count: 1240, percentage: 8.0, avgCLV: 18500, color: 'bg-green-500' },
    { segment: 'High Value (৳5k-10k)', count: 2890, percentage: 18.7, avgCLV: 7200, color: 'bg-blue-500' },
    { segment: 'Medium Value (৳2k-5k)', count: 5420, percentage: 35.1, avgCLV: 3400, color: 'bg-yellow-500' },
    { segment: 'Low Value (<৳2k)', count: 5870, percentage: 38.2, avgCLV: 1200, color: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Lifetime Value Analytics</h1>
          <p className="text-gray-600 mt-1">Analyze and predict customer lifetime value patterns</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Update
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CLV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{clvOverview.averageCLV.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clvOverview.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{(clvOverview.predictedRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Next 12 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clvOverview.retentionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.1%</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">CLV Overview</TabsTrigger>
          <TabsTrigger value="segments">Value Segments</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Value Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>CLV</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Last Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">৳{customer.clv.toLocaleString()}</div>
                        </TableCell>
                        <TableCell>{customer.orders}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {customer.lastOrder}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* CLV Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>CLV Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clvSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                        <div>
                          <div className="font-medium">{segment.segment}</div>
                          <div className="text-sm text-muted-foreground">
                            {segment.count.toLocaleString()} customers
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">৳{segment.avgCLV.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{segment.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Value Segments Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {clvSegments.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
                      <Badge variant="secondary">{segment.percentage}%</Badge>
                    </div>
                    <h3 className="font-medium mb-2">{segment.segment}</h3>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {segment.count.toLocaleString()} customers
                      </div>
                      <div className="text-lg font-bold">
                        ৳{segment.avgCLV.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Average CLV</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CLV Predictions & Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Advanced CLV prediction models and forecasting analytics would be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CLV Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Historical CLV trends and pattern analysis would be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
