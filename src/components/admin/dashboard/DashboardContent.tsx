import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle,
  Shield,
  FileText,
  Activity,
  Server,
  Eye,
  Zap,
  Package,
  Store,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EnhancedDashboardVisuals } from '../EnhancedDashboardVisuals';

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
        <div className="space-y-6">
          {/* Enhanced Visual Dashboard */}
          <EnhancedDashboardVisuals />
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">Add User</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Package className="h-6 w-6 mb-2" />
                  <span className="text-sm">Add Product</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Store className="h-6 w-6 mb-2" />
                  <span className="text-sm">Add Vendor</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">Generate Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="mt-6">
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} />
                  <div className="flex justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} />
                  <div className="flex justify-between">
                    <span className="text-sm">Disk Usage</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <Progress value={32} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Response</span>
                    <Badge variant="secondary">120ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Query</span>
                    <Badge variant="secondary">45ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Page Load</span>
                    <Badge variant="secondary">1.2s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Server className="h-4 w-4 mr-2" />
                  Server Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Web Server</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Redis Cache</span>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-yellow-600">Warning</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Configuration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Settings</CardTitle>
              <CardDescription>Configure system performance parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
                  <Input id="cache-duration" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="max-connections">Max Connections</Label>
                  <Input id="max-connections" type="number" defaultValue="1000" />
                </div>
                <div>
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input id="timeout" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="compression">Enable Compression</Label>
                  <Select defaultValue="gzip">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="gzip">GZIP</SelectItem>
                      <SelectItem value="brotli">Brotli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Update Performance Settings</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="insights" className="mt-6">
        <div className="space-y-6">
          {/* Business Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Growth Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Revenue Growth</span>
                      <span className="text-lg font-bold text-green-600">+24%</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Compared to last quarter</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">User Acquisition</span>
                      <span className="text-lg font-bold text-blue-600">+18%</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">New users this month</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-800">Conversion Rate</span>
                      <span className="text-lg font-bold text-purple-600">3.4%</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">Above industry average</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Key Observations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Peak Traffic Hours</p>
                      <p className="text-xs text-gray-600">High load between 2-4 PM daily</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Mobile Usage</p>
                      <p className="text-xs text-gray-600">65% of traffic from mobile devices</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Top Category</p>
                      <p className="text-xs text-gray-600">Electronics leading in sales</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Insights Configuration</CardTitle>
              <CardDescription>Customize business intelligence settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="analysis-period">Analysis Period</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="insight-type">Focus Area</Label>
                  <Select defaultValue="revenue">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="users">User Behavior</SelectItem>
                      <SelectItem value="products">Product Performance</SelectItem>
                      <SelectItem value="vendors">Vendor Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Generate Custom Insights</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="reports" className="mt-6">
        <div className="space-y-6">
          {/* Report Generation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Sales Report
                </CardTitle>
                <CardDescription>Generate comprehensive sales analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-green-600">৳2,45,890</div>
                  <p className="text-sm text-gray-600">Total sales this month</p>
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Activity Report
                </CardTitle>
                <CardDescription>User engagement and behavior analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-blue-600">12,456</div>
                  <p className="text-sm text-gray-600">Active users this month</p>
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Inventory Report
                </CardTitle>
                <CardDescription>Stock levels and inventory analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <p className="text-sm text-gray-600">Total products in stock</p>
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Report Builder */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create personalized reports with specific parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select defaultValue="sales">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="users">User Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="performance">Performance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-from">From Date</Label>
                  <Input id="date-from" type="date" />
                </div>
                <div>
                  <Label htmlFor="date-to">To Date</Label>
                  <Input id="date-to" type="date" />
                </div>
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequency">Schedule Frequency</Label>
                  <Select defaultValue="once">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One Time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">Email Recipients</Label>
                  <Input id="email" type="email" placeholder="admin@getit.com" />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderRevenueAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <DollarSign className="h-6 w-6 mr-2" />
          Revenue Analytics
        </h2>
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">1 Day</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Revenue</CardTitle>
            <CardDescription>Current period earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">৳1,245,890</div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500 text-sm">+12.5% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commission Earned</CardTitle>
            <CardDescription>Platform commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">৳186,884</div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500 text-sm">+8.2% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avg. Order Value</CardTitle>
            <CardDescription>Per order revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">৳2,450</div>
            <div className="flex items-center mt-2">
              <ArrowDown className="h-4 w-4 text-red-500" />
              <span className="text-red-500 text-sm">-2.1% vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Configuration</CardTitle>
          <CardDescription>Adjust commission rates and fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="commission-rate">Default Commission Rate (%)</Label>
              <Input id="commission-rate" type="number" defaultValue="15" />
            </div>
            <div>
              <Label htmlFor="platform-fee">Platform Fee (৳)</Label>
              <Input id="platform-fee" type="number" defaultValue="50" />
            </div>
          </div>
          <Button>Update Revenue Settings</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserActivity = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <Users className="h-6 w-6 mr-2" />
        User Activity Monitor
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Online Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,234</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-gray-500">Live count</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">New Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">89</div>
            <span className="text-xs text-gray-500">Today</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">2,456</div>
            <span className="text-xs text-gray-500">Current</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23.4%</div>
            <div className="flex items-center mt-1">
              <ArrowDown className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">-2.1%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Engagement Settings</CardTitle>
          <CardDescription>Configure user tracking and engagement features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" />
            </div>
            <div>
              <Label htmlFor="tracking-level">Tracking Level</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
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
          <CardDescription>Set up automatic inventory alerts</CardDescription>
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
          <CardDescription>Configure security monitoring settings</CardDescription>
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
          <CardDescription>Monitor system activities and errors</CardDescription>
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
          <CardDescription>Configure system logging settings</CardDescription>
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
