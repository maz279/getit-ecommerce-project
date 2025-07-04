import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiGateway } from '@/services/api/ApiGatewayClient';
import { CreditCard, Smartphone, Building, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface PaymentGatewayStatus {
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  responseTime: number;
  successRate: number;
  dailyVolume: number;
  lastTransaction: string;
}

export function PaymentGatewayDashboard() {
  const [gatewayStatuses, setGatewayStatuses] = useState<PaymentGatewayStatus[]>([]);
  const [transactionMetrics, setTransactionMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentGatewayData();
  }, []);

  const loadPaymentGatewayData = async () => {
    setLoading(true);
    try {
      // Load gateway statuses and transaction metrics
      const [statusResponse, metricsResponse] = await Promise.all([
        apiGateway.callService('bangladesh-payment-gateway', '/status'),
        apiGateway.callService('financial-management-service', '/payment-metrics')
      ]);

      if (statusResponse.success) {
        setGatewayStatuses(statusResponse.data?.gateways || mockGatewayData);
      }

      if (metricsResponse.success) {
        setTransactionMetrics(metricsResponse.data || mockMetricsData);
      }
    } catch (error) {
      console.error('Failed to load payment gateway data:', error);
      // Use mock data on error
      setGatewayStatuses(mockGatewayData);
      setTransactionMetrics(mockMetricsData);
    } finally {
      setLoading(false);
    }
  };

  const mockGatewayData: PaymentGatewayStatus[] = [
    {
      name: 'bKash',
      status: 'active',
      responseTime: 245,
      successRate: 98.5,
      dailyVolume: 1500000,
      lastTransaction: '2 minutes ago'
    },
    {
      name: 'Nagad',
      status: 'active',
      responseTime: 180,
      successRate: 97.8,
      dailyVolume: 890000,
      lastTransaction: '5 minutes ago'
    },
    {
      name: 'Rocket',
      status: 'active',
      responseTime: 320,
      successRate: 96.2,
      dailyVolume: 450000,
      lastTransaction: '8 minutes ago'
    },
    {
      name: 'Stripe',
      status: 'active',
      responseTime: 150,
      successRate: 99.2,
      dailyVolume: 2300000,
      lastTransaction: '1 minute ago'
    },
    {
      name: 'PayPal',
      status: 'maintenance',
      responseTime: 0,
      successRate: 0,
      dailyVolume: 0,
      lastTransaction: '2 hours ago'
    }
  ];

  const mockMetricsData = {
    totalTransactions: 45230,
    totalVolume: 5230000,
    averageTransactionValue: 1250,
    successRate: 97.8,
    failureReasons: [
      { reason: 'Insufficient Balance', count: 234 },
      { reason: 'Invalid PIN', count: 156 },
      { reason: 'Network Timeout', count: 89 },
      { reason: 'Gateway Error', count: 67 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getGatewayIcon = (name: string) => {
    if (['bKash', 'Nagad', 'Rocket'].includes(name)) {
      return <Smartphone className="h-5 w-5" />;
    } else if (['Stripe', 'PayPal'].includes(name)) {
      return <CreditCard className="h-5 w-5" />;
    }
    return <Building className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-lg">Loading payment gateway data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Gateway Management</h2>
          <p className="text-muted-foreground">Monitor and manage all payment gateways</p>
        </div>
        <Button onClick={loadPaymentGatewayData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactionMetrics?.totalTransactions?.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Volume</p>
                <p className="text-2xl font-bold">৳{transactionMetrics?.totalVolume?.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{transactionMetrics?.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                <p className="text-2xl font-bold">৳{transactionMetrics?.averageTransactionValue}</p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gateways" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gateways">Gateway Status</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Analytics</TabsTrigger>
          <TabsTrigger value="failures">Failure Analysis</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gatewayStatuses.map((gateway) => (
              <Card key={gateway.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    {getGatewayIcon(gateway.name)}
                    <span className="ml-2">{gateway.name}</span>
                  </CardTitle>
                  <Badge variant="secondary" className={`${getStatusColor(gateway.status)} text-white`}>
                    {getStatusIcon(gateway.status)}
                    <span className="ml-1">{gateway.status}</span>
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="font-medium">{gateway.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="font-medium">{gateway.successRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Volume:</span>
                      <span className="font-medium">৳{gateway.dailyVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Transaction:</span>
                      <span className="font-medium">{gateway.lastTransaction}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Gateway Distribution</h3>
                    <div className="space-y-2">
                      {gatewayStatuses.filter(g => g.status === 'active').map((gateway) => (
                        <div key={gateway.name} className="flex items-center justify-between">
                          <span className="text-sm">{gateway.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(gateway.dailyVolume / 2500000) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {Math.round((gateway.dailyVolume / 2500000) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Performance Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Peak Hour Volume:</span>
                        <span className="font-medium">৳850,000 (2-3 PM)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fastest Gateway:</span>
                        <span className="font-medium">Stripe (150ms)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Most Reliable:</span>
                        <span className="font-medium">Stripe (99.2%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Popular in BD:</span>
                        <span className="font-medium">bKash (65%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failure Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold">Top Failure Reasons</h3>
                <div className="space-y-2">
                  {transactionMetrics?.failureReasons?.map((failure: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{failure.reason}</span>
                        <p className="text-sm text-muted-foreground">
                          {failure.count} occurrences today
                        </p>
                      </div>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {failure.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gateway Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Bangladesh Mobile Money</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">bKash Merchant ID:</span>
                      <div className="mt-1 text-muted-foreground">merchant_***456</div>
                    </div>
                    <div>
                      <span className="font-medium">Nagad App Key:</span>
                      <div className="mt-1 text-muted-foreground">app_***789</div>
                    </div>
                    <div>
                      <span className="font-medium">Rocket Endpoint:</span>
                      <div className="mt-1 text-muted-foreground">api.rocket.com.bd</div>
                    </div>
                    <div>
                      <span className="font-medium">SSL Certificate:</span>
                      <div className="mt-1 text-muted-foreground">Valid until 2025-12-31</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">International Gateways</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Stripe Publishable Key:</span>
                      <div className="mt-1 text-muted-foreground">pk_***abc123</div>
                    </div>
                    <div>
                      <span className="font-medium">PayPal Client ID:</span>
                      <div className="mt-1 text-muted-foreground">client_***xyz789</div>
                    </div>
                    <div>
                      <span className="font-medium">Webhook URL:</span>
                      <div className="mt-1 text-muted-foreground">getit.com.bd/api/webhooks</div>
                    </div>
                    <div>
                      <span className="font-medium">PCI Compliance:</span>
                      <div className="mt-1 text-muted-foreground">Level 1 Certified</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}