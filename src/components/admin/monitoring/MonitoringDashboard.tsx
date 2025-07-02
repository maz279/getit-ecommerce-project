import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const MonitoringDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Enterprise Monitoring</h1>
        <Badge variant="secondary">Phase 3 Complete</Badge>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="sla">SLA Monitoring</TabsTrigger>
          <TabsTrigger value="traces">Distributed Tracing</TabsTrigger>
          <TabsTrigger value="logs">Centralized Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">99.9%</div>
                <p className="text-xs text-muted-foreground">Uptime last 24h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247ms</div>
                <p className="text-xs text-muted-foreground">P95 response time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">0.02%</div>
                <p className="text-xs text-muted-foreground">Errors last hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12/12</div>
                <p className="text-xs text-muted-foreground">All services healthy</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Real-time system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">High Response Time - Product Service</h4>
                    <p className="text-sm text-muted-foreground">Response time exceeded 1000ms threshold</p>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Database Connection Pool</h4>
                    <p className="text-sm text-muted-foreground">Connection pool utilization at 85%</p>
                  </div>
                  <Badge variant="secondary">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SLA Compliance</CardTitle>
              <CardDescription>Service Level Agreement monitoring and violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['User Service', 'Product Service', 'Order Service', 'Payment Service'].map((service) => (
                  <div key={service} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{service}</h4>
                      <p className="text-sm text-muted-foreground">Target: 99.9% availability</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">99.95%</div>
                      <Badge variant="outline">Compliant</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};