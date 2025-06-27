
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VendorPerformanceMetricsHeader } from './vendorPerformanceMetrics/VendorPerformanceMetricsHeader';
import { VendorPerformanceStatsCards } from './vendorPerformanceMetrics/VendorPerformanceStatsCards';
import { PerformanceOverviewTab } from './vendorPerformanceMetrics/PerformanceOverviewTab';
import { PerformanceBenchmarksTab } from './vendorPerformanceMetrics/PerformanceBenchmarksTab';
import { VendorScorecardTab } from './vendorPerformanceMetrics/VendorScorecardTab';
import { PerformanceAnalyticsTab } from './vendorPerformanceMetrics/PerformanceAnalyticsTab';
import { 
  mockPerformanceStats, 
  mockVendorMetrics, 
  mockBenchmarks, 
  mockScorecard 
} from './vendorPerformanceMetrics/mockData';

export const VendorPerformanceMetricsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <VendorPerformanceMetricsHeader />
      <VendorPerformanceStatsCards stats={mockPerformanceStats} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="scorecard">Vendor Scorecard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PerformanceOverviewTab metrics={mockVendorMetrics} />
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <PerformanceBenchmarksTab benchmarks={mockBenchmarks} />
        </TabsContent>

        <TabsContent value="scorecard" className="space-y-6">
          <VendorScorecardTab scorecard={mockScorecard} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PerformanceAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
