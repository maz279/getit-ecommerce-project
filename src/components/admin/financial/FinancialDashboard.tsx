import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Banknote } from 'lucide-react';

interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  period: string;
  status: 'up' | 'down' | 'stable';
}

export const FinancialDashboard = () => {
  const [metrics, setMetrics] = useState<FinancialMetric[]>([
    {
      id: '1',
      name: 'Total Revenue',
      value: 2847392,
      change: 12.5,
      period: '24h',
      status: 'up'
    },
    {
      id: '2',
      name: 'Commission Revenue',
      value: 456789,
      change: 8.2,
      period: '24h',
      status: 'up'
    },
    {
      id: '3',
      name: 'Payment Processing',
      value: 189234,
      change: -2.1,
      period: '24h',
      status: 'down'
    },
    {
      id: '4',
      name: 'Vendor Payouts',
      value: 1856432,
      change: 15.8,
      period: '24h',
      status: 'up'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground">Monitor revenue, commissions, and financial operations</p>
        </div>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metric.value)}</div>
              <div className="flex items-center space-x-1">
                {getStatusIcon(metric.status)}
                <span className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last {metric.period}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue sources and distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Product Sales</span>
                    <span className="font-semibold">{formatCurrency(2100000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service Fees</span>
                    <span className="font-semibold">{formatCurrency(450000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Subscription Revenue</span>
                    <span className="font-semibold">{formatCurrency(297392)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Revenue by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Dhaka Division</span>
                    <span className="font-semibold">{formatCurrency(1200000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chittagong Division</span>
                    <span className="font-semibold">{formatCurrency(800000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Other Regions</span>
                    <span className="font-semibold">{formatCurrency(847392)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Management</CardTitle>
              <CardDescription>Track vendor commissions and platform fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{formatCurrency(456789)}</p>
                  <p className="text-sm text-muted-foreground">Total Commissions (24h)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">12.5%</p>
                  <p className="text-sm text-muted-foreground">Average Commission Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">2,340</p>
                  <p className="text-sm text-muted-foreground">Active Vendors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Payouts</CardTitle>
              <CardDescription>Manage vendor payment processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Pending Payouts</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Scheduled Today</span>
                      <Badge variant="outline">156 payments</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span className="font-semibold">{formatCurrency(789000)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Methods</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Bank Transfer</span>
                      <span>68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile Money</span>
                      <span>32%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>Monitor payment gateway performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">bKash</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">98.5%</div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Nagad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">97.2%</div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Credit Cards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">99.1%</div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
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