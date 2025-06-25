
import React, { useState } from 'react';
import { Activity, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityLogsMetrics } from './activityLogs/ActivityLogsMetrics';
import { ActivityLogsFilters } from './activityLogs/ActivityLogsFilters';
import { ActivityLogsTable } from './activityLogs/ActivityLogsTable';
import { ActivityLogsAnalytics } from './activityLogs/ActivityLogsAnalytics';
import { ActivityLogsSettings } from './activityLogs/ActivityLogsSettings';

export const ActivityLogsForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7days');
  const [selectedLogType, setSelectedLogType] = useState('all');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            Activity Logs
          </h1>
          <p className="text-gray-600 mt-1">Monitor and analyze user activities across the platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      <ActivityLogsMetrics />

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="settings">Log Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <ActivityLogsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLogType={selectedLogType}
            onLogTypeChange={setSelectedLogType}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
          />
          <ActivityLogsTable />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ActivityLogsAnalytics />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Monitor suspicious activities and security threats.</p>
                <Button>Configure Security Alerts</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Complete audit trail for compliance and investigation purposes.</p>
                <Button>Generate Audit Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ActivityLogsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
