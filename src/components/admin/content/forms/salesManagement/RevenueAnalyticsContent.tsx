
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueAnalyticsHeader } from './revenueAnalytics/RevenueAnalyticsHeader';
import { RevenueMetricsCards } from './revenueAnalytics/RevenueMetricsCards';
import { RevenueOverviewTab } from './revenueAnalytics/RevenueOverviewTab';
import { mockRevenueAnalyticsData } from './revenueAnalytics/mockData';

export const RevenueAnalyticsContent: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');
  const [selectedRegion, setSelectedRegion] = useState('all');

  return (
    <div className="space-y-6">
      <RevenueAnalyticsHeader />
      
      <RevenueMetricsCards data={mockRevenueAnalyticsData.metrics} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="channels">🎯 Channels</TabsTrigger>
          <TabsTrigger value="categories">📦 Categories</TabsTrigger>
          <TabsTrigger value="regions">🗺️ Regions</TabsTrigger>
          <TabsTrigger value="forecasting">🔮 Forecasting</TabsTrigger>
          <TabsTrigger value="insights">💡 Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <RevenueOverviewTab 
            trendData={mockRevenueAnalyticsData.trendData}
            channelData={mockRevenueAnalyticsData.channelData}
          />
        </TabsContent>

        <TabsContent value="channels" className="mt-6">
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Channel Analytics</h3>
            <p className="text-gray-600">Detailed channel performance analysis</p>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Category Performance</h3>
            <p className="text-gray-600">Revenue breakdown by product categories</p>
          </div>
        </TabsContent>

        <TabsContent value="regions" className="mt-6">
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Regional Analysis</h3>
            <p className="text-gray-600">Geographic revenue distribution</p>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="mt-6">
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Revenue Forecasting</h3>
            <p className="text-gray-600">AI-powered revenue predictions</p>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Business Insights</h3>
            <p className="text-gray-600">Actionable revenue insights and recommendations</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
