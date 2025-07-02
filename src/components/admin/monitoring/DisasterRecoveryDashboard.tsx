import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const DisasterRecoveryDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Disaster Recovery</h1>
        <Badge variant="secondary">Phase 4 Complete</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Backup Status</CardTitle>
            <CardDescription>Automated backup execution status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Daily Full Backup</span>
                <Badge variant="outline">Completed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Hourly Incremental</span>
                <Badge variant="outline">Running</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Transaction Log</span>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Failover</CardTitle>
            <CardDescription>Multi-region failover configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>User Service</span>
                <Badge variant="outline">Auto-Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Service</span>
                <Badge variant="secondary">Manual</Badge>
              </div>
              <Button size="sm" className="w-full">Initiate Failover Test</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Replicas</CardTitle>
            <CardDescription>Multi-region database health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Primary (US-East-1)</span>
                <Badge variant="outline">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Replica (US-West-2)</span>
                <Badge variant="outline">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Replica (EU-West-1)</span>
                <Badge variant="outline">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Response</CardTitle>
            <CardDescription>Active incidents and response status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-muted-foreground">
                No active incidents
              </div>
              <Button size="sm" className="w-full">Create Test Incident</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};