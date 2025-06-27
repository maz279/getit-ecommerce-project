
import React, { useState, useEffect } from 'react';
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

interface VendorPerformanceMetricsContentProps {
  selectedSubmenu?: string;
}

export const VendorPerformanceMetricsContent: React.FC<VendorPerformanceMetricsContentProps> = ({ selectedSubmenu }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Set the active tab based on the selected submenu
  useEffect(() => {
    console.log('🎯 VendorPerformanceMetricsContent - selectedSubmenu:', selectedSubmenu);
    
    if (selectedSubmenu) {
      // Map submenu values to tab values
      const submenuToTabMap: { [key: string]: string } = {
        'vendor-scorecard': 'scorecard',
        'scorecard': 'scorecard',
        'vendor-rating': 'scorecard',
        'vendor-evaluation': 'scorecard',
        'performance-scorecard': 'scorecard',
        'vendor-assessment': 'scorecard',
        'quality-scorecard': 'scorecard',
        'supplier-scorecard': 'scorecard',
        'vendor-grading': 'scorecard',
        'performance-metrics': 'overview',
        'vendor-performance-metrics': 'overview',
        'performance-dashboard': 'overview',
        'performance-analysis': 'analytics',
        'vendor-kpi': 'benchmarks',
        'vendor-scorecards': 'scorecard',
        'performance-benchmarks': 'benchmarks',
        'performance-trends': 'analytics',
        'performance-reporting': 'analytics',
        'vendor-ratings': 'scorecard',
        'vendor-reviews': 'scorecard',
        'performance-monitoring': 'overview',
        'performance-improvement': 'benchmarks',
        'performance-alerts': 'analytics'
      };

      const targetTab = submenuToTabMap[selectedSubmenu] || 'overview';
      console.log('🎯 Setting active tab to:', targetTab);
      setActiveTab(targetTab);
    }
  }, [selectedSubmenu]);

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
