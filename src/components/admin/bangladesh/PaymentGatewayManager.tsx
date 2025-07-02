import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  status: 'active' | 'inactive' | 'maintenance';
  type: 'mobile_banking' | 'card' | 'bank_transfer';
  transactionVolume: number;
  successRate: number;
  averageProcessingTime: number;
  dailyLimit: number;
  fees: {
    percentage: number;
    fixed: number;
  };
}

const bangladeshPaymentGateways: PaymentGateway[] = [
  {
    id: 'bkash',
    name: 'bKash',
    logo: '💳',
    status: 'active',
    type: 'mobile_banking',
    transactionVolume: 1250000,
    successRate: 98.5,
    averageProcessingTime: 2.3,
    dailyLimit: 2000000,
    fees: { percentage: 1.85, fixed: 0 }
  },
  {
    id: 'nagad',
    name: 'Nagad',
    logo: '📱',
    status: 'active',
    type: 'mobile_banking',
    transactionVolume: 980000,
    successRate: 97.8,
    averageProcessingTime: 2.8,
    dailyLimit: 1500000,
    fees: { percentage: 1.75, fixed: 0 }
  },
  {
    id: 'rocket',
    name: 'Rocket',
    logo: '🚀',
    status: 'active',
    type: 'mobile_banking',
    transactionVolume: 750000,
    successRate: 96.2,
    averageProcessingTime: 3.2,
    dailyLimit: 1000000,
    fees: { percentage: 1.99, fixed: 0 }
  },
  {
    id: 'sslcommerz',
    name: 'SSLCommerz',
    logo: '🔒',
    status: 'active',
    type: 'card',
    transactionVolume: 450000,
    successRate: 94.5,
    averageProcessingTime: 4.1,
    dailyLimit: 5000000,
    fees: { percentage: 2.25, fixed: 5 }
  },
  {
    id: 'aamarpay',
    name: 'aamarPay',
    logo: '💰',
    status: 'maintenance',
    type: 'card',
    transactionVolume: 320000,
    successRate: 93.8,
    averageProcessingTime: 4.5,
    dailyLimit: 3000000,
    fees: { percentage: 2.15, fixed: 0 }
  }
];

export const PaymentGatewayManager: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>(bangladeshPaymentGateways);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const refreshGatewayStatus = async () => {
    setRefreshing(true);
    // Simulate API call to refresh gateway status
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const totalVolume = gateways.reduce((sum, gateway) => sum + gateway.transactionVolume, 0);
  const averageSuccessRate = gateways.reduce((sum, gateway) => sum + gateway.successRate, 0) / gateways.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Gateway Management</h2>
          <p className="text-gray-600">Monitor and manage Bangladesh payment gateways</p>
        </div>
        <Button 
          onClick={refreshGatewayStatus}
          disabled={refreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">
                  ৳{(totalVolume / 1000000).toFixed(1)}M
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageSuccessRate.toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Gateways</p>
                <p className="text-2xl font-bold text-gray-900">
                  {gateways.filter(g => g.status === 'active').length}
                </p>
              </div>
              <Smartphone className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(gateways.reduce((sum, g) => sum + g.averageProcessingTime, 0) / gateways.length).toFixed(1)}s
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Details */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gateways.map((gateway) => (
              <Card key={gateway.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedGateway(gateway)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{gateway.logo}</span>
                      <div>
                        <CardTitle className="text-lg">{gateway.name}</CardTitle>
                        <CardDescription className="capitalize">
                          {gateway.type.replace('_', ' ')}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(gateway.status)} text-white`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(gateway.status)}
                        <span className="capitalize">{gateway.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Success Rate */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Success Rate</span>
                        <span>{gateway.successRate}%</span>
                      </div>
                      <Progress value={gateway.successRate} className="h-2" />
                    </div>

                    {/* Transaction Volume */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Daily Volume</span>
                        <span>৳{(gateway.transactionVolume / 1000).toFixed(0)}K</span>
                      </div>
                      <Progress 
                        value={(gateway.transactionVolume / gateway.dailyLimit) * 100} 
                        className="h-2" 
                      />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Processing Time</p>
                        <p className="font-semibold">{gateway.averageProcessingTime}s</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fees</p>
                        <p className="font-semibold">
                          {gateway.fees.percentage}%{gateway.fees.fixed > 0 && ` + ৳${gateway.fees.fixed}`}
                        </p>
                      </div>
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
              <CardDescription>Real-time payment gateway performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-gray-500">
                  Detailed transaction analytics and reporting dashboard coming soon.
                </p>
                <p className="text-sm text-gray-400 text-center">
                  Will include hourly/daily transaction volumes, success rates, failure analysis, and fraud detection metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gateway Configuration</CardTitle>
              <CardDescription>Manage payment gateway settings and API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-gray-500">
                  Payment gateway configuration interface coming soon.
                </p>
                <p className="text-sm text-gray-400 text-center">
                  Will include API key management, webhook configuration, security settings, and testing tools.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>Monitor payment gateway health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-gray-500">
                  Real-time monitoring dashboard coming soon.
                </p>
                <p className="text-sm text-gray-400 text-center">
                  Will include uptime monitoring, response time tracking, error rate alerts, and automated failover management.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};