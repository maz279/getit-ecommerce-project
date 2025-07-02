import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FraudAlert {
  id: string;
  user_id: string;
  order_id: string;
  alert_type: string;
  risk_score: number;
  risk_factors: any;
  status: string;
  investigation_notes: string;
  resolved_at: string;
  resolved_by: string;
  created_at: string;
}

export const FraudDetection: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFraudAlerts();
  }, []);

  const loadFraudAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('fraud_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Failed to load fraud alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 80) return 'text-red-600';
    if (score > 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskIcon = (score: number) => {
    if (score > 80) return <XCircle className="h-4 w-4 text-red-500" />;
    if (score > 50) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading fraud detection...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          AI Fraud Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>No fraud alerts detected recently.</AlertDescription>
          </Alert>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRiskIcon(alert.risk_score)}
                  <span className={`font-medium ${getRiskColor(alert.risk_score)}`}>
                    Risk Score: {alert.risk_score}%
                  </span>
                </div>
                <Badge variant={alert.status === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.alert_type}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {alert.risk_factors && typeof alert.risk_factors === 'object' && Object.keys(alert.risk_factors).map((key, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {key}: {String(alert.risk_factors[key])}
                  </Badge>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {new Date(alert.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
        
        <Button onClick={loadFraudAlerts} variant="outline" className="w-full">
          Refresh Alerts
        </Button>
      </CardContent>
    </Card>
  );
};