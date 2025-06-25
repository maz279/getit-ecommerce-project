
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from './revenueDashboard/DashboardHeader';
import { RevenueFilters } from './revenueDashboard/RevenueFilters';
import { MetricsCards } from './revenueDashboard/MetricsCards';
import { OverviewTab } from './revenueDashboard/OverviewTab';
import { CategoriesTab } from './revenueDashboard/CategoriesTab';
import { RegionalTab } from './revenueDashboard/RegionalTab';
import { PaymentMethodsTab } from './revenueDashboard/PaymentMethodsTab';
import { TargetsTab } from './revenueDashboard/TargetsTab';

export const RevenueDashboardContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <RevenueFilters
        selectedPeriod={selectedPeriod}
        selectedRegion={selectedRegion}
        selectedCategory={selectedCategory}
        onPeriodChange={setSelectedPeriod}
        onRegionChange={setSelectedRegion}
        onCategoryChange={setSelectedCategory}
      />

      <MetricsCards />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="regions">Regional</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="targets">Targets & Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <RegionalTab />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentMethodsTab />
        </TabsContent>

        <TabsContent value="targets" className="space-y-6">
          <TargetsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
