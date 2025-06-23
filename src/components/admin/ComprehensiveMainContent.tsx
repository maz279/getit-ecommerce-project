
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Users, ShoppingCart, Package, TrendingUp, DollarSign, Eye, 
  UserCheck, Shield, Star, Mail, Phone, MessageSquare, Bell,
  BarChart3, PieChart, LineChart, TrendingDown, Calendar,
  Search, Filter, Plus, Edit, Trash2, Download, Upload,
  Settings, Database, Server, Activity, AlertCircle, CheckCircle,
  Megaphone, Tag, Gift, Percent, Target, Zap, Globe, Image,
  FileText, Video, Music, Folder, CreditCard, Wallet, Receipt,
  Banknote, PiggyBank, Calculator, Mail as MailIcon, Send,
  MessageCircle, Headphones, Clock, Archive, Bookmark
} from 'lucide-react';

interface ComprehensiveMainContentProps {
  selectedMenu: string;
  selectedSubmenu: string;
}

export const ComprehensiveMainContent: React.FC<ComprehensiveMainContentProps> = ({
  selectedMenu = 'dashboard',
  selectedSubmenu = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard Content
  const renderDashboardContent = () => {
    switch (selectedSubmenu) {
      case 'overview':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">৳45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,350</div>
                    <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,234</div>
                    <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.24%</div>
                    <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Customer Acquisition</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Customer Retention</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vendor Satisfaction</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">1.2s</div>
                      <div className="text-sm text-muted-foreground">Avg Response Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <CardTitle className="text-sm">Database</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-green-600 border-green-600">Healthy</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <CardTitle className="text-sm">API Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-green-600 border-green-600">Operational</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                    <CardTitle className="text-sm">Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">Warning</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20">
                      <Plus className="h-6 w-6 mx-auto mb-2" />
                      Add Product
                    </Button>
                    <Button variant="outline" className="h-20">
                      <UserCheck className="h-6 w-6 mx-auto mb-2" />
                      Approve Vendor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      case 'analytics':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
              <TabsTrigger value="customer">Customer Insights</TabsTrigger>
              <TabsTrigger value="product">Product Performance</TabsTrigger>
              <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">৳1,23,456</div>
                      <div className="text-sm text-muted-foreground">Today's Sales</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">15.2%</div>
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">₹8,76,543</div>
                      <div className="text-sm text-muted-foreground">Monthly Target</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>New Customers (This Month)</Label>
                        <div className="text-3xl font-bold text-green-600">1,234</div>
                      </div>
                      <div>
                        <Label>Customer Lifetime Value</Label>
                        <div className="text-3xl font-bold text-blue-600">৳2,456</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="product" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">Product Name {item}</div>
                          <div className="text-sm text-muted-foreground">Category: Electronics</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">৳12,345</div>
                          <div className="text-sm text-green-600">+25% sales</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Website Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded">
                      <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">45,678</div>
                      <div className="text-sm text-muted-foreground">Page Views</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">12,345</div>
                      <div className="text-sm text-muted-foreground">Unique Visitors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      default:
        return <div>Dashboard Overview Content</div>;
    }
  };

  // User Management Content
  const renderUserManagementContent = () => {
    switch (selectedSubmenu) {
      case 'customers':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="list">Customer List</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="add">Add Customer</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Directory</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="Search customers..." className="max-w-sm" />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((customer) => (
                      <div key={customer} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Customer {customer}</div>
                            <div className="text-sm text-muted-foreground">customer{customer}@email.com</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Active</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Enter full address" />
                  </div>
                  <Button className="w-full">Add Customer</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">1,234</div>
                      <div className="text-sm text-muted-foreground">New Customers</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <UserCheck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">567</div>
                      <div className="text-sm text-muted-foreground">Active Customers</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <Badge variant="outline" className="text-purple-600 border-purple-600">Premium</Badge>
                      <div className="text-2xl font-bold">123</div>
                      <div className="text-sm text-muted-foreground">Premium Customers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="segmentation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segmentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Button variant="outline">By Location</Button>
                      <Button variant="outline">By Purchase History</Button>
                      <Button variant="outline">By Engagement</Button>
                    </div>
                    <div className="p-4 border rounded text-center text-muted-foreground">
                      Segmentation charts and data will be displayed here.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((ticket) => (
                      <div key={ticket} className="p-4 border rounded flex justify-between items-center">
                        <div>
                          <div className="font-medium">Ticket #{1000 + ticket}</div>
                          <div className="text-sm text-muted-foreground">Issue description goes here...</div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">Open</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      case 'admins':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="list">Admin List</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="add">Add Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Directory</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="Search admins..." className="max-w-sm" />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((admin) => (
                      <div key={admin} className="flex items-center justify-between p-4 border rounded">
                        <div>
                          <div className="font-medium">Admin {admin}</div>
                          <div className="text-sm text-muted-foreground">admin{admin}@getit.com</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Active</Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Roles & Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Super Admin', 'Admin', 'Moderator'].map((role) => (
                      <div key={role} className="p-4 border rounded">
                        <div className="font-semibold">{role}</div>
                        <div className="text-sm text-muted-foreground">Permissions and access levels for {role}.</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {[1, 2, 3, 4, 5].map((log) => (
                      <div key={log} className="text-sm border-b border-muted-foreground/20 pb-1">
                        <div><strong>Admin {log}</strong> logged in</div>
                        <div className="text-xs text-muted-foreground">2024-06-23 10:0{log} AM</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="adminName">Full Name</Label>
                    <Input id="adminName" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="adminEmail">Email</Label>
                    <Input id="adminEmail" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="customer-service">Customer Service</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Add Admin</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      default:
        return <div>User Management Content</div>;
    }
  };

  // Analytics & Reports Content
  const renderAnalyticsContent = () => {
    switch (selectedSubmenu) {
      case 'sales-reports':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Sales Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
              <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
              <TabsTrigger value="export">Export Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">৳5,67,890</div>
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">2,345</div>
                      <div className="text-sm text-muted-foreground">Orders</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">15.8%</div>
                      <div className="text-sm text-muted-foreground">Growth</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold">78%</div>
                      <div className="text-sm text-muted-foreground">Target Achieved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales Report</SelectItem>
                          <SelectItem value="inventory">Inventory Report</SelectItem>
                          <SelectItem value="customer">Customer Report</SelectItem>
                          <SelectItem value="vendor">Vendor Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      case 'business-intelligence':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="kpi">KPI Dashboard</TabsTrigger>
              <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
              <TabsTrigger value="market">Market Analysis</TabsTrigger>
              <TabsTrigger value="competitor">Competitor Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="kpi" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Revenue Growth</span>
                        <span className="font-bold text-green-600">+15.2%</span>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Customer Acquisition</span>
                        <span className="font-bold text-blue-600">+23.4%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Market Share</span>
                        <span className="font-bold text-purple-600">12.8%</span>
                      </div>
                      <Progress value={64} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      default:
        return <div>Analytics & Reports Content</div>;
    }
  };

  // Marketing & Promotions Content
  const renderMarketingContent = () => {
    switch (selectedSubmenu) {
      case 'campaigns':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="active">Active Campaigns</TabsTrigger>
              <TabsTrigger value="create">Create Campaign</TabsTrigger>
              <TabsTrigger value="analytics">Campaign Analytics</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input id="campaignName" placeholder="Enter campaign name" />
                  </div>
                  <div>
                    <Label htmlFor="campaignType">Campaign Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flash-sale">Flash Sale</SelectItem>
                        <SelectItem value="seasonal">Seasonal Promotion</SelectItem>
                        <SelectItem value="category">Category Promotion</SelectItem>
                        <SelectItem value="new-user">New User Offer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input type="datetime-local" />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input type="datetime-local" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Campaign Description</Label>
                    <Textarea id="description" placeholder="Describe your campaign..." />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount Percentage</Label>
                    <Input id="discount" type="number" placeholder="Enter discount %" />
                  </div>
                  <Button className="w-full">
                    <Megaphone className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Marketing Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((campaign) => (
                      <div key={campaign} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">Summer Sale Campaign {campaign}</h3>
                            <p className="text-sm text-muted-foreground">Flash Sale • 25% off</p>
                          </div>
                          <Badge variant="outline" className="text-green-600">Active</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">₹1,23,456</div>
                            <div className="text-sm text-muted-foreground">Revenue</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">2,345</div>
                            <div className="text-sm text-muted-foreground">Conversions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">15.2%</div>
                            <div className="text-sm text-muted-foreground">CTR</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      case 'promotions':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
              <TabsTrigger value="discounts">Discounts</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty Programs</TabsTrigger>
              <TabsTrigger value="referral">Referral System</TabsTrigger>
            </TabsList>

            <TabsContent value="coupons" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Coupon Management</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Coupon
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <Input placeholder="Coupon Code" />
                      <Input placeholder="Discount %" type="number" />
                      <Input placeholder="Min. Order" type="number" />
                      <Button>Add Coupon</Button>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      {['SAVE20', 'NEWUSER15', 'BULK10'].map((coupon) => (
                        <div key={coupon} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-mono font-bold">{coupon}</div>
                            <div className="text-sm text-muted-foreground">Valid until Dec 31, 2024</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Active</Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      default:
        return <div>Marketing & Promotions Content</div>;
    }
  };

  // Content Management Content
  const renderContentManagementContent = () => {
    switch (selectedSubmenu) {
      case 'website-content':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="banners">Banners</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
              <TabsTrigger value="menus">Navigation</TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Website Pages</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Page
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Home', 'About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((page) => (
                      <div key={page} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{page}</div>
                          <div className="text-sm text-muted-foreground">Last updated: 2 days ago</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Published</Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="banners" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Banner Management</CardTitle>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Banner
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((banner) => (
                      <div key={banner} className="border rounded-lg p-4">
                        <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">Banner {banner}</div>
                          <div className="text-sm text-muted-foreground">Size: 1920x600px</div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Delete</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      case 'media-library':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Drop files here or click to upload</p>
                    <p className="text-sm text-muted-foreground">Support for images, videos, and documents</p>
                    <Button className="mt-4">Choose Files</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      default:
        return <div>Content Management Content</div>;
    }
  };

  // Financial Management Content
  const renderFinancialManagementContent = () => {
    switch (selectedSubmenu) {
      case 'revenue-tracking':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
              <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">৳45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">৳12,450.30</div>
                    <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">৳8,760.15</div>
                    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">৳3,240.50</div>
                    <p className="text-xs text-muted-foreground">12 transactions</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        );

      case 'expense-management':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="expenses">Expense Tracker</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="budgets">Budget Planning</TabsTrigger>
              <TabsTrigger value="reports">Expense Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Expense</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expenseAmount">Amount</Label>
                      <Input id="expenseAmount" type="number" placeholder="Enter amount" />
                    </div>
                    <div>
                      <Label htmlFor="expenseCategory">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="office">Office Supplies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expenseDescription">Description</Label>
                    <Input id="expenseDescription" placeholder="Enter expense description" />
                  </div>
                  <div>
                    <Label htmlFor="expenseDate">Date</Label>
                    <Input id="expenseDate" type="date" />
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      default:
        return <div>Financial Management Content</div>;
    }
  };

  // System Administration Content
  const renderSystemAdministrationContent = () => {
    switch (selectedSubmenu) {
      case 'system-settings':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General System Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" defaultValue="GetIt Bangladesh" />
                  </div>
                  <div>
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea id="siteDescription" defaultValue="Leading e-commerce platform in Bangladesh" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance" />
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="registration" defaultChecked />
                    <Label htmlFor="registration">Allow User Registration</Label>
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa" defaultChecked />
                    <Label htmlFor="2fa">Require Two-Factor Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="ssl" defaultChecked />
                    <Label htmlFor="ssl">Force SSL</Label>
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="30" />
                  </div>
                  <div>
                    <Label htmlFor="passwordPolicy">Password Minimum Length</Label>
                    <Input id="passwordPolicy" type="number" defaultValue="8" />
                  </div>
                  <Button>Update Security Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                  </div>
                  <div className="text-center p-4 border rounded mt-4">
                    <div className="text-2xl font-bold text-blue-600">1.2s</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Third-Party Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Payment Gateway', 'Shipping API', 'Analytics Tools', 'CRM'].map((integration) => (
                      <div key={integration} className="flex items-center justify-between p-4 border rounded">
                        <div>{integration}</div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      case 'database-management':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="backup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Backup & Restore</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button>
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restore Backup
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Recent Backups</h3>
                    <div className="space-y-2">
                      {['2024-06-23-backup.sql', '2024-06-22-backup.sql', '2024-06-21-backup.sql'].map((backup) => (
                        <div key={backup} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-mono text-sm">{backup}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      default:
        return <div>System Administration Content</div>;
    }
  };

  // Communication Content
  const renderCommunicationContent = () => {
    switch (selectedSubmenu) {
      case 'notifications':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="send">Send Notification</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="send" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Send Notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-users">All Users</SelectItem>
                        <SelectItem value="customers">Customers Only</SelectItem>
                        <SelectItem value="vendors">Vendors Only</SelectItem>
                        <SelectItem value="specific">Specific Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notificationTitle">Title</Label>
                    <Input id="notificationTitle" placeholder="Enter notification title" />
                  </div>
                  <div>
                    <Label htmlFor="notificationMessage">Message</Label>
                    <Textarea id="notificationMessage" placeholder="Enter notification message" />
                  </div>
                  <div>
                    <Label htmlFor="notificationType">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="update">System Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      case 'email-management':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="templates">Email Templates</TabsTrigger>
              <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
              <TabsTrigger value="settings">SMTP Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emailTo">To</Label>
                    <Input id="emailTo" placeholder="Enter email addresses" />
                  </div>
                  <div>
                    <Label htmlFor="emailSubject">Subject</Label>
                    <Input id="emailSubject" placeholder="Enter email subject" />
                  </div>
                  <div>
                    <Label htmlFor="emailContent">Content</Label>
                    <Textarea id="emailContent" placeholder="Enter email content" rows={8} />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <MailIcon className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Archive className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );

      default:
        return <div>Communication Content</div>;
    }
  };

  // Render existing content for submenus not updated above
  const renderVendorManagementContent = () => {
    return <div>Vendor Management Content</div>;
  };

  const renderProductManagementContent = () => {
    return <div>Product Management Content</div>;
  };

  const renderOrderManagementContent = () => {
    return <div>Order Management Content</div>;
  };

  // Main content renderer
  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return renderDashboardContent();
      case 'user-management':
        return renderUserManagementContent();
      case 'vendor-management':
        return renderVendorManagementContent();
      case 'product-management':
        return renderProductManagementContent();
      case 'order-management':
        return renderOrderManagementContent();
      case 'analytics-reports':
        return renderAnalyticsContent();
      case 'marketing-promotions':
        return renderMarketingContent();
      case 'content-management':
        return renderContentManagementContent();
      case 'financial-management':
        return renderFinancialManagementContent();
      case 'system-administration':
        return renderSystemAdministrationContent();
      case 'communication':
        return renderCommunicationContent();
      default:
        return <div>Select a menu item to view content</div>;
    }
  };

  // Safe string formatting function
  const formatMenuTitle = (str: string) => {
    if (!str || typeof str !== 'string') return 'Dashboard';
    return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {formatMenuTitle(selectedMenu)} - {formatMenuTitle(selectedSubmenu)}
        </h2>
      </div>
      {renderContent()}
    </div>
  );
};
