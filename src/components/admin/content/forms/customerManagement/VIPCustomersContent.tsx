
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown } from 'lucide-react';

export const VIPCustomersContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">VIP Customers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2" />
            VIP Customer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">VIP customer management and exclusive benefits coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
