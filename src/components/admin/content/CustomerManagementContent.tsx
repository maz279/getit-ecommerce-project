
import React from 'react';
import { Users, UserCheck, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CustomerManagementContentProps {
  selectedSubmenu: string;
}

export const CustomerManagementContent: React.FC<CustomerManagementContentProps> = ({ selectedSubmenu }) => {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">25,678</div>
              <p className="text-xs text-gray-500">+456 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Active Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18,934</div>
              <p className="text-xs text-gray-500">73.7% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">34</div>
              <Badge className="bg-orange-100 text-orange-800">Active</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">4.7/5.0</div>
              <p className="text-xs text-gray-500">Based on reviews</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Management for: {selectedSubmenu}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Comprehensive customer management features including customer database, analytics, 
              support tickets, and customer behavior analysis would be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
