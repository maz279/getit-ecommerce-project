
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export const DashboardAnalytics: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600 mt-1">Key performance metrics and insights for your dashboard</p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+180 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Page Load Time</span>
                <span className="text-sm text-green-600">1.2s (Good)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Engagement</span>
                <span className="text-sm text-blue-600">85% (High)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dashboard Views</span>
                <span className="text-sm text-purple-600">4,326 (Today)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Sessions</span>
                <span className="text-sm text-orange-600">1,234 (Live)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">📈 Sales are up 25% this week</p>
                <p className="text-xs text-blue-600">Driven by mobile commerce growth</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">🎯 Conversion rate improved</p>
                <p className="text-xs text-green-600">New checkout flow is performing well</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">👥 User engagement is high</p>
                <p className="text-xs text-purple-600">Average session duration: 8.5 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            This section shows analytics specific to dashboard usage and performance metrics.
            It's different from the main Analytics & Reports section which focuses on business intelligence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600">Daily Dashboard Views</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">Dashboard Utilization</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">456</div>
              <div className="text-sm text-gray-600">Active Admin Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
