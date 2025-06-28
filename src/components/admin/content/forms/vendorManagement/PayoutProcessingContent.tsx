
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PayoutRequestsTab } from './payoutProcessing/PayoutRequestsTab';
import { PayoutSchedulesTab } from './payoutProcessing/PayoutSchedulesTab';
import { PayoutHistoryTab } from './payoutProcessing/PayoutHistoryTab';
import { PayoutSettingsTab } from './payoutProcessing/PayoutSettingsTab';
import { PayoutAnalyticsTab } from './payoutProcessing/PayoutAnalyticsTab';
import { PayoutProcessingHeader } from './payoutProcessing/PayoutProcessingHeader';

export const PayoutProcessingContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="space-y-6">
      <PayoutProcessingHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="requests">Payout Requests</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <PayoutRequestsTab />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <PayoutSchedulesTab />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PayoutHistoryTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <PayoutAnalyticsTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <PayoutSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
