import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const BDIntegrationsManager = () => {
  const [activeGateways, setActiveGateways] = useState([
    { name: 'bKash', status: 'active', transactions: 1250 },
    { name: 'Nagad', status: 'active', transactions: 890 },
    { name: 'Rocket', status: 'inactive', transactions: 0 }
  ]);

  const [courierPartners, setCourierPartners] = useState([
    { name: 'Pathao', status: 'active', deliveries: 450 },
    { name: 'Paperfly', status: 'active', deliveries: 320 },
    { name: 'RedX', status: 'active', deliveries: 280 },
    { name: 'eCourier', status: 'pending', deliveries: 0 },
    { name: 'Sundarban', status: 'active', deliveries: 150 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bangladesh Integrations</h2>
        <Button>Configure New Integration</Button>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment Gateways</TabsTrigger>
          <TabsTrigger value="courier">Courier Partners</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {activeGateways.map((gateway) => (
              <Card key={gateway.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{gateway.name}</CardTitle>
                  <Badge variant={gateway.status === 'active' ? 'default' : 'secondary'}>
                    {gateway.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{gateway.transactions}</div>
                  <p className="text-xs text-muted-foreground">transactions today</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courier" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {courierPartners.map((courier) => (
              <Card key={courier.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{courier.name}</CardTitle>
                  <Badge variant={courier.status === 'active' ? 'default' : 'secondary'}>
                    {courier.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courier.deliveries}</div>
                  <p className="text-xs text-muted-foreground">deliveries this week</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>NID Verifications</span>
                  <Badge>2,450 verified</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Trade License Verifications</span>
                  <Badge>1,820 verified</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>TIN Verifications</span>
                  <Badge>1,650 verified</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bank Account Verifications</span>
                  <Badge>2,100 verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendation Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Models</span>
                  <Badge>4 models</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Recommendations Generated</span>
                  <Badge>125,000 today</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Click-through Rate</span>
                  <Badge>12.5%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Conversion Rate</span>
                  <Badge>3.2%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};