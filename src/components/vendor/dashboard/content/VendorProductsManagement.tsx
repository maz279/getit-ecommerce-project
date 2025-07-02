import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorProductsManagementProps {
  activeTab: string;
}

export const VendorProductsManagement: React.FC<VendorProductsManagementProps> = ({ activeTab }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Products Management</CardTitle>
          <CardDescription>Manage your products, inventory, and categories</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Products management for {activeTab} will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};