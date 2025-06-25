
import React from 'react';
import { Button } from '@/components/ui/button';
import { QuickStatsCards } from './overview/QuickStatsCards';
import { OverviewCharts } from './overview/OverviewCharts';
import { QuickActionsForm } from './overview/QuickActionsForm';
import { RecentActivityPanel } from './overview/RecentActivityPanel';

export const OverviewDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome to your comprehensive admin dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>Quick Actions</Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <QuickStatsCards />

      {/* Charts Section */}
      <OverviewCharts />

      {/* Quick Actions and Forms */}
      <QuickActionsForm />

      {/* Recent Activity Section */}
      <RecentActivityPanel />
    </div>
  );
};
