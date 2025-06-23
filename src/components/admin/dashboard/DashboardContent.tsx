
import React, { useState } from 'react';
import { 
  Package,
  Shield,
  FileText,
  AlertTriangle,
  XCircle,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnalyticsTab, PerformanceTab, InsightsTab, ReportsTab } from './overview';
import { RevenueAnalytics, UserActivity } from './sections';

interface DashboardContentProps {
  selectedSubmenu: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ selectedSubmenu }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Welcome to your comprehensive admin dashboard
        </div>
      </div>
      
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <PerformanceTab />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <InsightsTab />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderRealtimeMetrics = () => (
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
        {/* Add more real-time metric cards */}
      </div>
    </div>
  );

  const renderRevenueAnalytics = () => (
    <RevenueAnalytics 
      selectedTimeRange={selectedTimeRange}
      setSelectedTimeRange={setSelectedTimeRange}
    />
  );

  const renderUserActivity = () => <UserActivity />;

  const renderVendorPerformance = () => (
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
        {/* Add more vendor performance content */}
      </div>
    </div>
  );

  const renderOrderInsights = () => (
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
        {/* Add more order insights content */}
      </div>
    </div>
  );

  const renderInventoryAlerts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <Package className="h-6 w-6 mr-2" />
        Inventory Alerts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">23</div>
            <p className="text-sm text-red-600">Products</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">67</div>
            <p className="text-sm text-yellow-600">Products</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Needs Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">12</div>
            <p className="text-sm text-blue-600">Products</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Alert Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
              <Input id="low-stock-threshold" type="number" defaultValue="10" />
            </div>
            <div>
              <Label htmlFor="alert-frequency">Alert Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Update Alert Settings</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlatformPerformance = () => (
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
        {/* Add more platform performance content */}
      </div>
    </div>
  );

  const renderSystemHealth = () => (
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
        {/* Add more system health content */}
      </div>
    </div>
  );

  const renderSecurityMonitoring = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <Shield className="h-6 w-6 mr-2" />
        Security Monitoring
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Failed Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">15</div>
            <span className="text-xs text-gray-500">Last 24h</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Blocked IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <span className="text-xs text-gray-500">Active blocks</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Suspicious Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <span className="text-xs text-gray-500">Under review</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input id="max-login-attempts" type="number" defaultValue="5" />
            </div>
            <div>
              <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
              <Input id="lockout-duration" type="number" defaultValue="30" />
            </div>
          </div>
          <Button>Update Security Settings</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemLogs = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <FileText className="h-6 w-6 mr-2" />
        System Logs
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { level: 'INFO', message: 'User authentication successful', time: '2 min ago', user: 'admin@getit.com' },
              { level: 'WARN', message: 'High memory usage detected', time: '5 min ago', user: 'system' },
              { level: 'ERROR', message: 'Database connection timeout', time: '10 min ago', user: 'system' },
              { level: 'INFO', message: 'Backup process completed', time: '15 min ago', user: 'system' },
              { level: 'WARN', message: 'Multiple login attempts detected', time: '20 min ago', user: '192.168.1.100' }
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARN' ? 'secondary' : 'default'}>
                    {log.level}
                  </Badge>
                  <span className="text-sm">{log.message}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {log.user} • {log.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="log-level">Log Level</Label>
              <Select defaultValue="INFO">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBUG">Debug</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARN">Warning</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="retention-days">Retention Period (days)</Label>
              <Input id="retention-days" type="number" defaultValue="30" />
            </div>
          </div>
          <Button>Save Log Settings</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuickActions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
          <Package className="h-8 w-8 mb-2" />
          <span className="text-sm">Add Product</span>
        </Button>
        {/* Add more quick action buttons */}
      </div>
    </div>
  );

  const renderExecutiveSummary = () => (
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
              {/* Add more KPIs */}
            </div>
          </CardContent>
        </Card>
        {/* Add more executive summary cards */}
      </div>
    </div>
  );

  const getTabContent = () => {
    switch (selectedSubmenu) {
      case 'overview':
        return renderOverview();
      case 'real-time-metrics':
        return renderRealtimeMetrics();
      case 'revenue-analytics':
        return renderRevenueAnalytics();
      case 'user-activity':
        return renderUserActivity();
      case 'vendor-performance':
        return renderVendorPerformance();
      case 'order-insights':
        return renderOrderInsights();
      case 'inventory-alerts':
        return renderInventoryAlerts();
      case 'platform-performance':
        return renderPlatformPerformance();
      case 'system-health':
        return renderSystemHealth();
      case 'security-monitoring':
        return renderSecurityMonitoring();
      case 'system-logs':
        return renderSystemLogs();
      case 'quick-actions':
        return renderQuickActions();
      case 'executive-summary':
        return renderExecutiveSummary();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="p-6">
      {getTabContent()}
    </div>
  );
};
