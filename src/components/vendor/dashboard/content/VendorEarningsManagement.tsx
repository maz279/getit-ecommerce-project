import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorEarningsManagementProps {
  activeTab: string;
}

export const VendorEarningsManagement: React.FC<VendorEarningsManagementProps> = ({ activeTab }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Earnings & Commission</CardTitle>
          <CardDescription>Track your earnings, commissions, and payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Earnings management for {activeTab} will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};