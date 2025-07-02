import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorOrdersManagementProps {
  activeTab: string;
}

export const VendorOrdersManagement: React.FC<VendorOrdersManagementProps> = ({ activeTab }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
          <CardDescription>Manage and track all your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Orders management for {activeTab} will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};