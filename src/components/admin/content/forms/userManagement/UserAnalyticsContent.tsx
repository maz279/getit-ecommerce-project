
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserBehaviorAnalytics } from './analytics/UserBehaviorAnalytics';
import { CustomerSegmentationAnalytics } from './analytics/CustomerSegmentationAnalytics';
import { LifetimeValueAnalytics } from './analytics/LifetimeValueAnalytics';

export const UserAnalyticsContent: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Tabs defaultValue="behavior" className="w-full">
        <div className="bg-white border-b">
          <div className="p-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="behavior">User Behavior</TabsTrigger>
              <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
              <TabsTrigger value="clv">Lifetime Value</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="behavior" className="mt-0">
          <UserBehaviorAnalytics />
        </TabsContent>

        <TabsContent value="segmentation" className="mt-0">
          <CustomerSegmentationAnalytics />
        </TabsContent>

        <TabsContent value="clv" className="mt-0">
          <LifetimeValueAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
