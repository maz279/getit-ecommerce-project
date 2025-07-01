import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FraudAlert {
  id: string;
  type: string;
  riskScore: number;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  orderId?: string;
  userId?: string;
  description: string;
  createdAt: string;
  riskFactors: string[];
}

interface SecurityMetric {
  name: string;
  value: number;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

const FraudDetectionDashboard: React.FC = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const securityMetrics: SecurityMetric[] = [
    { name: 'Risk Score', value: 2.3, change: -0.5, status: 'good' },
    { name: 'Blocked Transactions', value: 15, change: -20, status: 'good' },
    { name: 'False Positives', value: 3, change: 10, status: 'warning' },
    { name: 'Active Investigations', value: 7, change: 0, status: 'warning' }
  ];

  const mockAlerts: FraudAlert[] = [
    {
      id: '1',
      type: 'unusual_spending',
      riskScore: 8.5,
      status: 'pending',
      orderId: 'ORD-20241201-001234',
      userId: 'user-123',
      description: 'Unusually large order value (300% above user average)',
      createdAt: '2024-12-01T10:30:00Z',
      riskFactors: ['High order value', 'New payment method', 'Different location']
    },
    {
      id: '2',
      type: 'velocity_check',
      riskScore: 7.2,
      status: 'investigating',
      userId: 'user-456',
      description: 'Multiple orders in short time frame',
      createdAt: '2024-12-01T09:15:00Z',
      riskFactors: ['5 orders in 10 minutes', 'Same IP address', 'Different cards']
    },
    {
      id: '3',
      type: 'location_anomaly',
      riskScore: 6.8,
      status: 'resolved',
      orderId: 'ORD-20241201-001189',
      userId: 'user-789',
      description: 'Order from unusual geographic location',
      createdAt: '2024-12-01T08:45:00Z',
      riskFactors: ['Location 500km from usual', 'New device fingerprint']
    }
  ];

  useEffect(() => {
    fetchFraudAlerts();
  }, []);

  const fetchFraudAlerts = async () => {
    try {
      setRefreshing(true);
      
      // In a real app, this would fetch from the fraud_alerts table
      const { data, error } = await supabase
        .from('fraud_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching fraud alerts:', error);
        // Use mock data for demo
        setAlerts(mockAlerts);
      } else {
        // Transform data to match our interface
        const transformedAlerts = data?.map(alert => ({
          id: alert.id,
          type: alert.alert_type,
          riskScore: alert.risk_score,
          status: alert.status as 'pending' | 'investigating' | 'resolved' | 'false_positive',
          orderId: alert.order_id,
          userId: alert.user_id,
          description: `Risk score: ${alert.risk_score}`,
          createdAt: alert.created_at,
          riskFactors: Object.keys(alert.risk_factors || {})
        })) || [];
        
        setAlerts(transformedAlerts.length > 0 ? transformedAlerts : mockAlerts);
      }
    } catch (error) {
      console.error('Error:', error);
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAlertAction = async (alertId: string, action: 'investigate' | 'resolve' | 'false_positive') => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: action === 'investigate' ? 'investigating' : action === 'resolve' ? 'resolved' : 'resolved' }
          : alert
      ));

      toast({
        title: "Alert Updated",
        description: `Alert has been marked as ${action.replace('_', ' ')}.`
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" />
            Fraud Detection Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor and manage security threats in real-time</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchFraudAlerts}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className={`text-2xl font-bold ${getMetricColor(metric.status)}`}>
                    {metric.name === 'Risk Score' ? metric.value.toFixed(1) : metric.value}
                  </p>
                  <p className={`text-xs ${metric.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}% from yesterday
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  metric.status === 'good' ? 'bg-green-100' : 
                  metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {metric.status === 'good' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : metric.status === 'warning' ? (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Detection Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* High Priority Alert */}
          {alerts.some(alert => alert.riskScore >= 8 && alert.status === 'pending') && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>High Risk Alert:</strong> {alerts.filter(alert => alert.riskScore >= 8 && alert.status === 'pending').length} transactions require immediate attention.
              </AlertDescription>
            </Alert>
          )}

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Fraud Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${getRiskColor(alert.riskScore)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm font-medium">Risk Score: {alert.riskScore}/10</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold mb-2">{alert.description}</h4>
                        
                        {alert.orderId && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Order: {alert.orderId} | User: {alert.userId}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {alert.riskFactors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {alert.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAlertAction(alert.id, 'investigate')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Investigate
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAlertAction(alert.id, 'false_positive')}
                            >
                              Mark Safe
                            </Button>
                          </>
                        )}
                        
                        {alert.status === 'investigating' && (
                          <Button 
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, 'resolve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Velocity Check</h4>
                    <p className="text-sm text-muted-foreground">Monitor multiple transactions in short timeframe</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">Risk Weight: 3.0</Badge>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Unusual Spending Pattern</h4>
                    <p className="text-sm text-muted-foreground">Detect orders significantly above user average</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">Risk Weight: 2.5</Badge>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Geographic Anomaly</h4>
                    <p className="text-sm text-muted-foreground">Flag orders from unusual locations</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">Risk Weight: 2.0</Badge>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/10 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Fraud trends chart would go here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detection Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>True Positives</span>
                  <span className="font-semibold">87%</span>
                </div>
                <Progress value={87} className="w-full" />
                
                <div className="flex justify-between">
                  <span>False Positives</span>
                  <span className="font-semibold">13%</span>
                </div>
                <Progress value={13} className="w-full" />
                
                <div className="flex justify-between">
                  <span>Detection Rate</span>
                  <span className="font-semibold">94%</span>
                </div>
                <Progress value={94} className="w-full" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Weekly Security Summary</h4>
                      <p className="text-sm text-muted-foreground">Comprehensive fraud detection report</p>
                    </div>
                    <Button size="sm">
                      Download PDF
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Monthly Compliance Report</h4>
                      <p className="text-sm text-muted-foreground">Regulatory compliance summary</p>
                    </div>
                    <Button size="sm">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectionDashboard;