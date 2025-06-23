
import React from 'react';
import { Store, Award, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VendorManagementContentProps {
  selectedSubmenu: string;
}

export const VendorManagementContent: React.FC<VendorManagementContentProps> = ({ selectedSubmenu }) => {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Store className="h-4 w-4 mr-2" />
                Total Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1,567</div>
              <p className="text-xs text-gray-500">+23 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">234</div>
              <p className="text-xs text-gray-500">4.5+ rating vendors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Commission Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">৳2.4M</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Avg Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">87%</div>
              <Badge className="bg-green-100 text-green-800">Excellent</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Management Section: {selectedSubmenu}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Advanced vendor management features including vendor directory, performance tracking, 
              commission management, and vendor analytics would be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
