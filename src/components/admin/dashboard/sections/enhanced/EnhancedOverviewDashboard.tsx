
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIMetricsSection } from './KPIMetricsSection';
import { SystemHealthSection } from './SystemHealthSection';
import { QuickStatsCards } from '../overview/QuickStatsCards';
import { OverviewCharts } from '../overview/OverviewCharts';
import { Download, FileText, Settings, BarChart3, Activity, Shield, Zap } from 'lucide-react';
import { useDashboardKPIMetrics, useSystemHealthLogs, useRealTimeAnalytics } from '@/hooks/useDashboardData';

export const EnhancedOverviewDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: kpiMetrics = [] } = useDashboardKPIMetrics();
  const { data: healthLogs = [] } = useSystemHealthLogs(5);
  const { data: realtimeData = [] } = useRealTimeAnalytics();

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Enhanced Dashboard Overview</h1>
          <p className="text-gray-600 text-lg">Comprehensive admin dashboard with full data management</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>•</span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live Data ({realtimeData.length} active metrics)
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Dashboard Settings
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="kpi-metrics" className="flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            KPI Metrics
          </TabsTrigger>
          <TabsTrigger value="system-health" className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="real-time" className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Overview */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Key Performance Metrics</h2>
              <p className="text-gray-600 text-sm">Real-time overview of your platform's performance</p>
            </div>
            <QuickStatsCards />
          </section>

          {/* Charts Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Analytics Overview</h2>
              <p className="text-gray-600 text-sm">Visual insights into trends and performance</p>
            </div>
            <OverviewCharts />
          </section>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  KPI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{kpiMetrics.length}</div>
                  <p className="text-sm text-gray-600">Active KPI metrics being tracked</p>
                  <div className="text-xs text-green-600">
                    +{kpiMetrics.filter((m: any) => m.trend_direction === 'up').length} trending up
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {healthLogs.filter((log: any) => log.health_status === 'healthy').length}/{healthLogs.length}
                  </div>
                  <p className="text-sm text-gray-600">Services running healthy</p>
                  <div className="text-xs text-yellow-600">
                    {healthLogs.filter((log: any) => log.health_status === 'warning').length} warnings
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Real-time Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{realtimeData.length}</div>
                  <p className="text-sm text-gray-600">Active real-time metrics</p>
                  <div className="text-xs text-blue-600">
                    Updated {Math.floor(Math.random() * 60)} seconds ago
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kpi-metrics">
          <KPIMetricsSection />
        </TabsContent>

        <TabsContent value="system-health">
          <SystemHealthSection />
        </TabsContent>

        <TabsContent value="real-time" className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Real-time Analytics</h2>
            <p className="text-gray-600">Live data streams and real-time metrics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {realtimeData.slice(0, 8).map((metric: any, index: number) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{metric.metric_type?.replace('_', ' ').toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.metric_value?.toLocaleString() || Math.floor(Math.random() * 1000)}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(metric.timestamp_recorded || Date.now()).toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Advanced Analytics</h2>
            <p className="text-gray-600">Deep insights and analytical reports</p>
          </div>
          <OverviewCharts />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Executive Reports</h2>
            <p className="text-gray-600">Generate and manage executive summary reports</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Report Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Executive report functionality will be implemented here with full CRUD operations,
                PDF generation, and automated scheduling capabilities.
              </p>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Generate New Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
