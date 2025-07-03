/**
 * Fraud Detection Dashboard
 * Real-time fraud monitoring and management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  Eye,
  Ban,
  CheckCircle,
  Activity,
  Bell
} from 'lucide-react';
import { apiGatewayClient } from '@/services/apiGateway/ApiGatewayClient';

interface FraudAlert {
  id: string;
  type: 'high_risk' | 'suspicious' | 'blocked';
  userId?: string;
  description: string;
  riskScore: number;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  indicators: string[];
}

interface FraudMetrics {
  totalAlerts: number;
  activeAlerts: number;
  blockedTransactions: number;
  falsePositiveRate: number;
  detectionAccuracy: number;
  avgResponseTime: number;
}

export const FraudDetectionDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [metrics, setMetrics] = useState<FraudMetrics>({
    totalAlerts: 0,
    activeAlerts: 0,
    blockedTransactions: 0,
    falsePositiveRate: 0,
    detectionAccuracy: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFraudData();
    const interval = setInterval(fetchFraudData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFraudData = async () => {
    try {
      setLoading(true);
      
      // Fetch fraud alerts
      const alertsResponse = await apiGatewayClient.getFraudAlerts();
      
      // Mock data for demonstration
      const mockAlerts: FraudAlert[] = [
        {
          id: '1',
          type: 'high_risk',
          userId: 'user_123',
          description: 'Multiple failed payment attempts from different locations',
          riskScore: 95,
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          status: 'active',
          indicators: ['Location mismatch', 'Multiple payment failures', 'Device fingerprint anomaly']
        },
        {
          id: '2',
          type: 'suspicious',
          userId: 'user_456',
          description: 'Unusual purchasing pattern detected',
          riskScore: 75,
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          status: 'investigating',
          indicators: ['High-value transactions', 'New payment method', 'Speed of transactions']
        },
        {
          id: '3',
          type: 'blocked',
          description: 'Transaction blocked due to blacklisted payment method',
          riskScore: 100,
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          status: 'resolved',
          indicators: ['Blacklisted card', 'Known fraud pattern']
        }
      ];

      setAlerts(mockAlerts);

      // Calculate metrics
      const totalAlerts = mockAlerts.length;
      const activeAlerts = mockAlerts.filter(a => a.status === 'active').length;
      
      setMetrics({
        totalAlerts,
        activeAlerts,
        blockedTransactions: 47,
        falsePositiveRate: 2.1,
        detectionAccuracy: 96.8,
        avgResponseTime: 85
      });

    } catch (error) {
      console.error('Failed to fetch fraud data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertTypeColor = (type: FraudAlert['type']) => {
    switch (type) {
      case 'high_risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: FraudAlert['status']) => {
    switch (status) {
      case 'active': 
        return <Badge className="bg-red-100 text-red-800">Active</Badge>;
      case 'investigating': 
        return <Badge className="bg-yellow-100 text-yellow-800">Investigating</Badge>;
      case 'resolved': 
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'false_positive': 
        return <Badge className="bg-blue-100 text-blue-800">False Positive</Badge>;
      default: 
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fraud Detection Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Real-time fraud monitoring and risk management
          </p>
        </div>
        <Button onClick={fetchFraudData} disabled={loading}>
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Active Alerts Banner */}
      {metrics.activeAlerts > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">
            {metrics.activeAlerts} Active Fraud Alert{metrics.activeAlerts > 1 ? 's' : ''}
          </AlertTitle>
          <AlertDescription className="text-red-700">
            Immediate attention required for high-risk transactions
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAlerts}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Transactions</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.blockedTransactions}</div>
            <p className="text-xs text-muted-foreground">Prevented fraud</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">False Positive Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.falsePositiveRate}%</div>
            <p className="text-xs text-muted-foreground">Accuracy measure</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.detectionAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Model performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">Average detection</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Management */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active Alerts ({alerts.filter(a => a.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="investigating">
            Investigating ({alerts.filter(a => a.status === 'investigating').length})
          </TabsTrigger>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <AlertsList alerts={alerts.filter(a => a.status === 'active')} />
        </TabsContent>

        <TabsContent value="investigating" className="space-y-4">
          <AlertsList alerts={alerts.filter(a => a.status === 'investigating')} />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <AlertsList alerts={alerts} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Analytics</CardTitle>
              <CardDescription>Trends and patterns in fraud detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Analytics charts and ML model performance metrics will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AlertsListProps {
  alerts: FraudAlert[];
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getAlertTypeColor(alert.type)}>
                    {alert.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    Risk Score: <span className="font-bold text-red-600">{alert.riskScore}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
                
                <h3 className="font-medium mb-2">{alert.description}</h3>
                
                {alert.userId && (
                  <p className="text-sm text-gray-600 mb-2">
                    User ID: <span className="font-mono">{alert.userId}</span>
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {alert.indicators.map((indicator, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(alert.status)}
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Investigate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {alerts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
            <p className="text-gray-500">All systems are secure and operating normally.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper functions
function getAlertTypeColor(type: FraudAlert['type']) {
  switch (type) {
    case 'high_risk': return 'bg-red-100 text-red-800 border-red-200';
    case 'suspicious': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'blocked': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusBadge(status: FraudAlert['status']) {
  switch (status) {
    case 'active': 
      return <Badge className="bg-red-100 text-red-800">Active</Badge>;
    case 'investigating': 
      return <Badge className="bg-yellow-100 text-yellow-800">Investigating</Badge>;
    case 'resolved': 
      return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
    case 'false_positive': 
      return <Badge className="bg-blue-100 text-blue-800">False Positive</Badge>;
    default: 
      return <Badge variant="secondary">Unknown</Badge>;
  }
}