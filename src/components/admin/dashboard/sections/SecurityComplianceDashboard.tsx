import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle, Eye, Brain, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const SecurityComplianceDashboard = () => {
  const [securityMetrics, setSecurityMetrics] = useState({
    zeroTrustSessions: 0,
    fraudEvents: 0,
    complianceScore: 0,
    activeThreats: 0
  });

  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Fetch zero trust sessions
      const { data: sessions } = await supabase
        .from('zero_trust_sessions')
        .select('trust_score, verification_level')
        .eq('status', 'active');

      // Fetch fraud events
      const { data: fraudEvents } = await supabase
        .from('fraud_detection_events')
        .select('fraud_score, risk_level, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch compliance monitoring
      const { data: compliance } = await supabase
        .from('compliance_monitoring')
        .select('compliance_status, framework_id');

      setSecurityMetrics({
        zeroTrustSessions: sessions?.length || 0,
        fraudEvents: fraudEvents?.filter(e => e.risk_level === 'high').length || 0,
        complianceScore: compliance?.filter(c => c.compliance_status === 'compliant').length / Math.max(compliance?.length || 1, 1) * 100,
        activeThreats: fraudEvents?.filter(e => e.fraud_score >= 70).length || 0
      });

      setRecentEvents(fraudEvents || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching security data:', error);
      setLoading(false);
    }
  };

  const runFraudDetection = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-fraud-detection', {
        body: {
          action: 'detect_fraud',
          transaction_data: {
            amount: 10000,
            payment_method: 'bkash',
            location: { country: 'Bangladesh', city: 'Dhaka' }
          }
        }
      });

      if (error) throw error;
      console.log('Fraud detection result:', data);
      fetchSecurityData(); // Refresh data
    } catch (error) {
      console.error('Fraud detection error:', error);
    }
  };

  const checkCompliance = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('compliance-engine', {
        body: {
          action: 'bangladesh_compliance_check',
          btrc_requirements: true,
          data_localization: true,
          financial_regulations: true,
          tax_compliance: false
        }
      });

      if (error) throw error;
      console.log('Compliance check result:', data);
      fetchSecurityData(); // Refresh data
    } catch (error) {
      console.error('Compliance check error:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading security data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zero Trust Sessions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.zeroTrustSessions}</div>
            <p className="text-xs text-muted-foreground">Active verified sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{securityMetrics.fraudEvents}</div>
            <p className="text-xs text-muted-foreground">High risk events today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(securityMetrics.complianceScore)}%</div>
            <p className="text-xs text-muted-foreground">Frameworks compliant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <Eye className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{securityMetrics.activeThreats}</div>
            <p className="text-xs text-muted-foreground">Requires investigation</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Controls */}
      <Tabs defaultValue="zero-trust" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zero-trust">Zero Trust</TabsTrigger>
          <TabsTrigger value="fraud-detection">Fraud Detection</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="zero-trust" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Zero Trust Security
              </CardTitle>
              <CardDescription>
                Continuous identity verification and trust scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Trust Score Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>High Trust (80+)</span>
                        <Badge variant="default">45%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Medium Trust (60-79)</span>
                        <Badge variant="secondary">35%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Low Trust (&lt;60)</span>
                        <Badge variant="destructive">20%</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Verification Methods</h4>
                    <div className="space-y-2">
                      <div>✓ Device fingerprinting</div>
                      <div>✓ Behavioral analysis</div>
                      <div>✓ Location verification</div>
                      <div>✓ Time pattern analysis</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud-detection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                ML-Powered Fraud Detection
              </CardTitle>
              <CardDescription>
                Advanced fraud detection with Bangladesh-specific patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={runFraudDetection} className="w-full">
                  Run Fraud Detection Test
                </Button>
                
                <div>
                  <h4 className="font-medium mb-2">Recent Fraud Events</h4>
                  <div className="space-y-2">
                    {recentEvents.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>Score: {event.fraud_score}</span>
                        <Badge variant={
                          event.risk_level === 'high' ? 'destructive' :
                          event.risk_level === 'medium' ? 'default' : 'secondary'
                        }>
                          {event.risk_level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Regulatory Compliance
              </CardTitle>
              <CardDescription>
                Bangladesh-specific compliance monitoring and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={checkCompliance} className="w-full">
                  Run Compliance Check
                </Button>
                
                <div>
                  <h4 className="font-medium mb-2">Compliance Frameworks</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>BTRC Telecom Regulations</span>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Bangladesh Bank Financial</span>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Sovereignty</span>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Compliance (NBR)</span>
                      <Badge variant="destructive">Non-Compliant</Badge>
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
};