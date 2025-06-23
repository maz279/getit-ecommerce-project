
import React, { useState } from 'react';
import { 
  Package,
  Shield,
  FileText,
  AlertTriangle,
  XCircle,
  Eye,
  Progress,
  Badge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalyticsTab, PerformanceTab, InsightsTab, ReportsTab } from './overview';
import { RevenueAnalytics, UserActivity } from './sections';

interface DashboardContentProps {
  selectedSubmenu: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ selectedSubmenu }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const renderOverview = () => (
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
  );

  const renderRevenueAnalytics = () => (
    <RevenueAnalytics 
      selectedTimeRange={selectedTimeRange}
      setSelectedTimeRange={setSelectedTimeRange}
    />
  );

  const renderUserActivity = () => <UserActivity />;

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

  const getTabContent = () => {
    switch (selectedSubmenu) {
      case 'overview':
        return renderOverview();
      case 'revenue-analytics':
        return renderRevenueAnalytics();
      case 'user-activity':
        return renderUserActivity();
      case 'inventory-alerts':
        return renderInventoryAlerts();
      case 'security-monitoring':
        return renderSecurityMonitoring();
      case 'system-logs':
        return renderSystemLogs();
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
