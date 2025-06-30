
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const CourierPartnersContent: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courier Partners</h1>
          <p className="text-gray-600 mt-2">Manage courier partnerships and delivery services</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pathao">Pathao</TabsTrigger>
          <TabsTrigger value="paperfly">Paperfly</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Partners</CardTitle>
                <CardDescription>Currently integrated courier services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-sm text-gray-600">+2 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Deliveries</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <p className="text-sm text-gray-600">+15% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
                <CardDescription>Overall delivery success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-sm text-gray-600">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pathao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pathao Integration</CardTitle>
              <CardDescription>Manage Pathao courier service integration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Pathao courier management interface...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paperfly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paperfly Integration</CardTitle>
              <CardDescription>Manage Paperfly courier service integration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Paperfly courier management interface...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Courier performance metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Performance analytics dashboard...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
