import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const VendorPerformanceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
          <CardDescription>Track your store's performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Performance metrics and KPIs will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};