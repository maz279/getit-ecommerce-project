
import React from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const RealtimeMetricsSection: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Real-time Metrics</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">1,234</div>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const VendorPerformanceSection: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Vendor Performance</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Top Performing Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">156</div>
          <span className="text-xs text-gray-500">Active vendors</span>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const OrderInsightsSection: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Order Insights</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Orders Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">324</div>
          <span className="text-xs text-gray-500">+12% from yesterday</span>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const PlatformPerformanceSection: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Platform Performance</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Server Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">245ms</div>
          <span className="text-xs text-gray-500">Average</span>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const SystemHealthSection: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">System Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">99.9%</div>
          <Progress value={99.9} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export const QuickActionsSection: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
        <Package className="h-8 w-8 mb-2" />
        <span className="text-sm">Add Product</span>
      </Button>
    </div>
  </div>
);

export const ExecutiveSummarySection: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Revenue</span>
              <span className="font-bold text-green-600">৳1,245,890</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
