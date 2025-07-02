import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BusinessIntelligence from './EnterpriseAnalyticsDashboard';
import KPIMetrics from './KPIMetrics';
import SalesForecasting from './SalesForecasting';
import MarketInsights from './MarketInsights';
import PerformanceMonitoring from './PerformanceMonitoring';
import { CustomReportBuilder } from './core/CustomReportBuilder';
import { AutomatedReports } from './reports/AutomatedReports';
import { ReportExporter } from './reports/ReportExporter';
import { BarChart3, TrendingUp, Globe, Activity, FileText, Clock, Download } from 'lucide-react';

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive business intelligence and analytics platform</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bi">BI Insights</TabsTrigger>
          <TabsTrigger value="kpi">KPI Metrics</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('bi')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">47</div>
                    <div className="text-sm text-muted-foreground">BI Insights</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('forecasting')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">₹2.4M</div>
                    <div className="text-sm text-muted-foreground">Forecasted Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('market')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">15.7%</div>
                    <div className="text-sm text-muted-foreground">Market Growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('performance')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">98.5%</div>
                    <div className="text-sm text-muted-foreground">System Health</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Jump to key analytics sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setActiveTab('kpi')}
                    className="p-3 text-left border rounded hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">KPI Dashboard</div>
                    <div className="text-sm text-muted-foreground">Key metrics overview</div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="p-3 text-left border rounded hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">Custom Reports</div>
                    <div className="text-sm text-muted-foreground">Build custom reports</div>
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest analytics activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Sales forecast generated</div>
                      <div className="text-xs text-muted-foreground">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Monthly report exported</div>
                      <div className="text-xs text-muted-foreground">15 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Automated report scheduled</div>
                      <div className="text-xs text-muted-foreground">1 hour ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bi"><BusinessIntelligence /></TabsContent>
        <TabsContent value="kpi"><KPIMetrics /></TabsContent>
        <TabsContent value="forecasting"><SalesForecasting /></TabsContent>
        <TabsContent value="market"><MarketInsights /></TabsContent>
        <TabsContent value="performance"><PerformanceMonitoring /></TabsContent>
        <TabsContent value="reports"><CustomReportBuilder /></TabsContent>
        <TabsContent value="automation">
          <Tabs defaultValue="scheduled" className="w-full">
            <TabsList>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              <TabsTrigger value="export">Export Center</TabsTrigger>
            </TabsList>
            <TabsContent value="scheduled"><AutomatedReports /></TabsContent>
            <TabsContent value="export"><ReportExporter /></TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;