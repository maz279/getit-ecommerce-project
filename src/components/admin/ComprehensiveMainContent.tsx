import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EnhancedDashboardVisuals } from './EnhancedDashboardVisuals';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Search,
  MessageSquare,
  Shield,
  Activity,
  Server,
  Database,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  MapPin,
  Star,
  Award,
  Globe,
  Target,
  Zap,
  UserCheck,
  CreditCard,
  Truck,
  Percent,
  Image,
  Tag,
  Mail,
  Phone,
  Home,
  Building,
  Briefcase
} from 'lucide-react';

interface ComprehensiveMainContentProps {
  activeTab: string;
}

export const ComprehensiveMainContent: React.FC<ComprehensiveMainContentProps> = ({ activeTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Enhanced Dashboard Content with Multiple Tabs
  const renderDashboard = () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="metrics">Real-time Metrics</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="health">System Health</TabsTrigger>
        <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <EnhancedDashboardVisuals />
      </TabsContent>
      
      <TabsContent value="metrics" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Live Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">2,345</div>
              <p className="text-sm text-gray-600">Active users now</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Orders Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">892</div>
              <p className="text-sm text-gray-600">+15% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Revenue Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">৳ 45,670</div>
              <p className="text-sm text-gray-600">Target: ৳ 50,000</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="performance" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>API Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Response Time</span>
                  <span className="font-bold text-green-600">125ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate</span>
                  <span className="font-bold text-green-600">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Requests/min</span>
                  <span className="font-bold">1,234</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Database Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Query Time</span>
                  <span className="font-bold text-green-600">45ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Connections</span>
                  <span className="font-bold">234/500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Storage Used</span>
                  <span className="font-bold">67%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="health" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Server Status', 'Database', 'API Gateway', 'CDN'].map((service, index) => (
            <Card key={index} className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{service}</p>
                    <p className="font-bold text-green-600">Healthy</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="quick-actions" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Backup Database</Button>
              <Button className="w-full" variant="outline">Clear Cache</Button>
              <Button className="w-full" variant="outline">Generate Report</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Send Notification</Button>
              <Button className="w-full" variant="outline">Export Users</Button>
              <Button className="w-full" variant="outline">Bulk Update</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Platform Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Maintenance Mode</Button>
              <Button className="w-full" variant="outline">Update Settings</Button>
              <Button className="w-full" variant="outline">Check Updates</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );

  // Enhanced User Management with Comprehensive Tabs
  const renderUserManagement = () => (
    <Tabs defaultValue="customers" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="admins">Admins</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
      </TabsList>
      
      <TabsContent value="customers" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Customer Management</h3>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold">45,678</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Today</p>
                  <p className="text-2xl font-bold text-green-600">2,345</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-purple-600">1,234</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Premium Users</p>
                  <p className="text-2xl font-bold text-yellow-600">5,678</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="userType">User Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full">Create Customer Account</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="admins" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Admin Management</h3>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adminName">Full Name</Label>
                <Input id="adminName" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="adminEmail">Email</Label>
                <Input id="adminEmail" type="email" placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="adminRole">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
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
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full">Create Admin Account</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600">User Growth Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600">Demographics Pie Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="verification" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Verification Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium">User {item}</h4>
                      <p className="text-sm text-gray-600">Pending verification</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="outline">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="support" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((ticket) => (
                <div key={ticket} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Ticket #{ticket}001</h4>
                    <p className="text-sm text-gray-600">Login issue - High Priority</p>
                  </div>
                  <Badge variant="destructive">High</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  // Enhanced Vendor Management
  const renderVendorManagement = () => (
    <Tabs defaultValue="directory" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="directory">Directory</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="kyc">KYC</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="payouts">Payouts</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
      </TabsList>
      
      <TabsContent value="directory" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Vendor Directory</h3>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register New Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Enter business name" />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" placeholder="Enter contact person" />
              </div>
              <div>
                <Label htmlFor="vendorEmail">Email</Label>
                <Input id="vendorEmail" type="email" placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="vendorPhone">Phone</Label>
                <Input id="vendorPhone" placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="businessCategory">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input id="businessAddress" placeholder="Enter business address" />
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full">Register Vendor</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="applications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((app) => (
                <div key={app} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Application #{app}001</h4>
                    <p className="text-sm text-gray-600">Electronics Vendor - Submitted 2 days ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Review</Button>
                    <Button size="sm" variant="outline">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="kyc" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>KYC Verification Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((kyc) => (
                <div key={kyc} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Vendor KYC #{kyc}</h4>
                    <p className="text-sm text-gray-600">Documents submitted - Pending review</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="performance" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((vendor) => (
                  <div key={vendor} className="flex items-center justify-between">
                    <span>Vendor {vendor}</span>
                    <Badge>⭐ 4.{9-vendor}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Leaders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((vendor) => (
                  <div key={vendor} className="flex items-center justify-between">
                    <span>Vendor {vendor}</span>
                    <span className="font-bold">৳ {50-vendor*5}K</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Leaders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((vendor) => (
                  <div key={vendor} className="flex items-center justify-between">
                    <span>Vendor {vendor}</span>
                    <span className="font-bold">{500-vendor*50} items</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="payouts" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Process Vendor Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payoutVendor">Select Vendor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor1">ABC Electronics</SelectItem>
                    <SelectItem value="vendor2">Fashion House</SelectItem>
                    <SelectItem value="vendor3">Home Decor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payoutAmount">Amount (BDT)</Label>
                <Input id="payoutAmount" placeholder="Enter amount" />
              </div>
              <div>
                <Label htmlFor="payoutMethod">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payoutDate">Payout Date</Label>
                <Input id="payoutDate" type="date" />
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full">Process Payout</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="support" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((ticket) => (
                <div key={ticket} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Support Ticket #{ticket}001</h4>
                    <p className="text-sm text-gray-600">Payment processing issue - ABC Electronics</p>
                  </div>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  // Enhanced Product Management
  const renderProductManagement = () => (
    <Tabs defaultValue="catalog" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="catalog">Catalog</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="moderation">Moderation</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="catalog" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Product Catalog</h3>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" placeholder="Enter product name" />
              </div>
              <div>
                <Label htmlFor="productSKU">SKU</Label>
                <Input id="productSKU" placeholder="Enter SKU" />
              </div>
              <div>
                <Label htmlFor="productCategory">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="productPrice">Price (BDT)</Label>
                <Input id="productPrice" placeholder="Enter price" />
              </div>
              <div>
                <Label htmlFor="productStock">Stock Quantity</Label>
                <Input id="productStock" placeholder="Enter stock quantity" />
              </div>
              <div>
                <Label htmlFor="productVendor">Vendor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor1">ABC Electronics</SelectItem>
                    <SelectItem value="vendor2">Fashion House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="productDescription">Description</Label>
              <textarea 
                id="productDescription" 
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter product description"
              />
            </div>
            <div className="mt-6">
              <Button className="w-full">Add Product</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="categories" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input id="categoryName" placeholder="Enter category name" />
              </div>
              <div>
                <Label htmlFor="parentCategory">Parent Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="categoryDescription">Description</Label>
              <textarea 
                id="categoryDescription" 
                className="w-full p-2 border rounded-md"
                rows={2}
                placeholder="Enter category description"
              />
            </div>
            <div className="mt-6">
              <Button className="w-full">Create Category</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="moderation" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Moderation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((product) => (
                <div key={product} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Product #{product}001</h4>
                    <p className="text-sm text-gray-600">Pending approval - Electronics category</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="outline">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="inventory" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <span>Product {item}</span>
                    <Badge variant="destructive">{10-item*2} left</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <span>Product {item+10}</span>
                    <Badge variant="secondary">0 stock</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Restock Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <span>Product {item+20}</span>
                    <Button size="sm">Process</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600">Product Performance Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-600">Category Distribution Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );

  // Enhanced Order Management  
  const renderOrderManagement = () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="processing">Processing</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'New Orders', count: '156', color: 'blue', icon: '🆕' },
            { label: 'Processing', count: '234', color: 'yellow', icon: '🔄' },
            { label: 'Shipped', count: '445', color: 'purple', icon: '📦' },
            { label: 'Delivered', count: '7,891', color: 'green', icon: '✅' },
            { label: 'Failed', count: '34', color: 'red', icon: '❌' },
            { label: 'Returned', count: '89', color: 'orange', icon: '↩️' }
          ].map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100`}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className={`text-2xl font-bold text-${stat.color}-800`}>{stat.count}</div>
                  <div className={`text-xs text-${stat.color}-600`}>{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="processing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders in Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Order #{order}001</h4>
                    <p className="text-sm text-gray-600">Customer: John Doe - ৳ 2,340</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Update Status</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="payments" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentOrderId">Order ID</Label>
                <Input id="paymentOrderId" placeholder="Enter order ID" />
              </div>
              <div>
                <Label htmlFor="paymentAmount">Amount (BDT)</Label>
                <Input id="paymentAmount" placeholder="Enter amount" />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="card">Credit Card</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentStatus">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full">Process Payment</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="shipping" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shippingOrderId">Order ID</Label>
                <Input id="shippingOrderId" placeholder="Enter order ID" />
              </div>
              <div>
                <Label htmlFor="shippingCarrier">Shipping Carrier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pathao">Pathao</SelectItem>
                    <SelectItem value="steadfast">Steadfast</SelectItem>
                    <SelectItem value="paperfly">Paperfly</SelectItem>
                    <SelectItem value="redx">RedX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input id="trackingNumber" placeholder="Enter tracking number" />
              </div>
              <div>
                <Label htmlFor="shippingStatus">Shipping Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full">Update Shipping Status</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600">Order Trends Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <DollarSign className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600">Revenue Analytics Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );

  // Sample data for different sections
  const sampleNotifications = [
    { id: 1, type: 'warning', title: 'Low Stock Alert', message: '15 products below minimum stock level', time: '5 min ago', priority: 'high' },
    { id: 2, type: 'success', title: 'Payment Received', message: 'BDT 25,000 payment processed successfully', time: '10 min ago', priority: 'medium' },
    { id: 3, type: 'error', title: 'Server Error', message: 'API endpoint experiencing high latency', time: '15 min ago', priority: 'high' },
    { id: 4, type: 'info', title: 'New Vendor Registration', message: 'ABC Electronics submitted application', time: '1 hour ago', priority: 'low' }
  ];

  const sampleVendors = [
    { id: 'V001', name: 'ABC Electronics', status: 'active', products: 234, revenue: 'BDT 1,45,000', rating: 4.8, kyc: 'verified' },
    { id: 'V002', name: 'Fashion House', status: 'pending', products: 56, revenue: 'BDT 25,000', rating: 4.2, kyc: 'pending' },
    { id: 'V003', name: 'Home Decor Ltd', status: 'active', products: 189, revenue: 'BDT 89,000', rating: 4.6, kyc: 'verified' },
    { id: 'V004', name: 'Tech Solutions', status: 'suspended', products: 78, revenue: 'BDT 15,000', rating: 3.9, kyc: 'rejected' }
  ];

  const sampleOrders = [
    { id: 'ORD001', customer: 'John Rahman', amount: 'BDT 2,340', status: 'processing', date: '2025-01-20', payment: 'paid' },
    { id: 'ORD002', customer: 'Sarah Ahmed', amount: 'BDT 1,890', status: 'shipped', date: '2025-01-20', payment: 'paid' },
    { id: 'ORD003', customer: 'Karim Hassan', amount: 'BDT 3,450', status: 'failed', date: '2025-01-19', payment: 'failed' },
    { id: 'ORD004', customer: 'Fatima Khan', amount: 'BDT 890', status: 'delivered', date: '2025-01-19', payment: 'paid' }
  ];

  const sampleSecurityLogs = [
    { id: 1, event: 'Failed Login Attempt', user: 'admin@getit.com', ip: '192.168.1.100', time: '2025-01-20 14:30', severity: 'medium' },
    { id: 2, event: 'Password Changed', user: 'vendor@abc.com', ip: '192.168.1.101', time: '2025-01-20 13:15', severity: 'low' },
    { id: 3, event: 'Suspicious Activity', user: 'unknown', ip: '192.168.1.999', time: '2025-01-20 12:45', severity: 'high' }
  ];

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notification Center</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">5</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warning Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Info Alerts</p>
                <p className="text-2xl font-bold text-blue-600">28</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">156</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sampleNotifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    notification.type === 'success' ? 'bg-green-100 text-green-600' :
                    notification.type === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={notification.priority === 'high' ? 'destructive' : notification.priority === 'medium' ? 'default' : 'secondary'}>
                    {notification.priority}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityAudit = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security & Audit</h2>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Run Security Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-green-600">95%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold">1,245</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Logins</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleSecurityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.event}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>
                    <Badge variant={log.severity === 'high' ? 'destructive' : log.severity === 'medium' ? 'default' : 'secondary'}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemMonitoring = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Monitoring</h2>
        <Button variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Server Status</p>
                <p className="text-lg font-bold text-green-600">Online</p>
              </div>
              <Server className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Database</p>
                <p className="text-lg font-bold text-green-600">Healthy</p>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Response</p>
                <p className="text-lg font-bold text-green-600">125ms</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-lg font-bold text-green-600">99.9%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList>
          <TabsTrigger value="pages">CMS Pages</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Home Page', 'About Us', 'Terms & Conditions', 'Privacy Policy', 'Help Center', 'FAQ'].map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{page}</h4>
                      <p className="text-sm text-gray-600">Last updated: 2 days ago</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Banner Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage homepage banners, promotional banners, and category banners.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderAPIManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API & Integrations</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate API Key
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active APIs</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Daily Requests</p>
                <p className="text-2xl font-bold">1.2M</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">99.8%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Main content router with all existing sections
  const renderContent = () => {
    if (activeTab.startsWith('dashboard')) return renderDashboard();
    if (activeTab.startsWith('user-management')) return renderUserManagement();
    if (activeTab.startsWith('vendor-management')) return renderVendorManagement();
    if (activeTab.startsWith('product-management')) return renderProductManagement();
    if (activeTab.startsWith('order-management')) return renderOrderManagement();
    if (activeTab.startsWith('notifications')) return renderNotifications();
    if (activeTab.startsWith('security-audit')) return renderSecurityAudit();
    if (activeTab.startsWith('system-monitoring')) return renderSystemMonitoring();
    if (activeTab.startsWith('content-management')) return renderContentManagement();
    if (activeTab.startsWith('api-integrations')) return renderAPIManagement();
    
    // Default content for other sections
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          {activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h2>
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Content Coming Soon</h3>
            <p className="text-gray-500">This section is being developed and will be available soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};
