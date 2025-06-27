
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Heart,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Target,
  Award,
  Gift,
  Zap
} from 'lucide-react';

export const AllCustomersContent: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('registration_date');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock comprehensive customer data
  const customerStats = {
    total: 245678,
    active: 186543,
    new: 12834,
    churned: 8901,
    vip: 5432,
    growth: 12.5,
    retention: 87.3,
    avgLifetime: 18.7,
    avgOrderValue: 1250
  };

  const customersData = [
    {
      id: 'CUS-001',
      name: 'Ahmed Rahman',
      email: 'ahmed.rahman@email.com',
      phone: '+880 1712345678',
      status: 'active',
      segment: 'vip',
      registrationDate: '2023-01-15',
      lastActivity: '2024-01-20',
      totalOrders: 47,
      totalSpent: 89750,
      avgOrderValue: 1910,
      lifetimeValue: 125000,
      location: 'Dhaka, Bangladesh',
      preferredCategories: ['Electronics', 'Fashion'],
      loyaltyPoints: 8975,
      riskScore: 'low',
      engagement: 92,
      satisfaction: 4.8,
      avatar: null
    },
    {
      id: 'CUS-002',
      name: 'Fatima Khan',
      email: 'fatima.khan@email.com',
      phone: '+880 1987654321',
      status: 'active',
      segment: 'regular',
      registrationDate: '2023-03-22',
      lastActivity: '2024-01-19',
      totalOrders: 23,
      totalSpent: 34500,
      avgOrderValue: 1500,
      lifetimeValue: 45000,
      location: 'Chittagong, Bangladesh',
      preferredCategories: ['Home & Garden', 'Health'],
      loyaltyPoints: 3450,
      riskScore: 'low',
      engagement: 78,
      satisfaction: 4.5,
      avatar: null
    },
    {
      id: 'CUS-003',
      name: 'Mohammad Islam',
      email: 'mohammad.islam@email.com',
      phone: '+880 1555666777',
      status: 'inactive',
      segment: 'at-risk',
      registrationDate: '2022-08-10',
      lastActivity: '2023-12-15',
      totalOrders: 8,
      totalSpent: 12300,
      avgOrderValue: 1538,
      lifetimeValue: 18000,
      location: 'Sylhet, Bangladesh',
      preferredCategories: ['Books', 'Electronics'],
      loyaltyPoints: 1230,
      riskScore: 'high',
      engagement: 34,
      satisfaction: 3.8,
      avatar: null
    }
  ];

  const segmentData = [
    { name: 'VIP', value: 5432, color: '#8B5CF6', growth: 8.2 },
    { name: 'Regular', value: 89543, color: '#06D6A0', growth: 15.3 },
    { name: 'New', value: 78654, color: '#FFD23F', growth: 22.1 },
    { name: 'At Risk', value: 23456, color: '#EF476F', growth: -5.4 },
    { name: 'Churned', value: 12345, color: '#9CA3AF', growth: -12.8 }
  ];

  const retentionData = [
    { month: 'Jan', newCustomers: 2450, retained: 2100, churn: 350 },
    { month: 'Feb', newCustomers: 2680, retained: 2280, churn: 400 },
    { month: 'Mar', newCustomers: 2890, retained: 2450, churn: 440 },
    { month: 'Apr', newCustomers: 3120, retained: 2680, churn: 440 },
    { month: 'May', newCustomers: 3350, retained: 2890, churn: 460 },
    { month: 'Jun', newCustomers: 3580, retained: 3120, churn: 460 }
  ];

  const geographicData = [
    { region: 'Dhaka', customers: 89543, percentage: 36.5 },
    { region: 'Chittagong', customers: 56789, percentage: 23.1 },
    { region: 'Sylhet', customers: 34567, percentage: 14.1 },
    { region: 'Khulna', customers: 28901, percentage: 11.8 },
    { region: 'Rajshahi', customers: 23456, percentage: 9.5 },
    { region: 'Others', customers: 12422, percentage: 5.0 }
  ];

  const COLORS = ['#8B5CF6', '#06D6A0', '#FFD23F', '#EF476F', '#3B82F6', '#F59E0B'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'regular': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Customers</h1>
          <p className="text-gray-600 mt-1">Comprehensive customer management and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Customers
              </span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{customerStats.total.toLocaleString()}</div>
            <p className="text-xs text-green-600">+{customerStats.growth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Active Customers
              </span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{customerStats.active.toLocaleString()}</div>
            <p className="text-xs text-gray-500">{((customerStats.active / customerStats.total) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Avg Lifetime Value
              </span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">৳{customerStats.avgLifetime}k</div>
            <p className="text-xs text-gray-500">Per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Retention Rate
              </span>
              <Award className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{customerStats.retention}%</div>
            <p className="text-xs text-gray-500">12-month retention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Customers']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Retention Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Customers']} />
                    <Area type="monotone" dataKey="newCustomers" stackId="1" stroke="#8884d8" fill="#8884d8" name="New" />
                    <Area type="monotone" dataKey="retained" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Retained" />
                    <Area type="monotone" dataKey="churn" stackId="1" stroke="#ffc658" fill="#ffc658" name="Churned" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Segment Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Segment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {segmentData.map((segment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{segment.name}</span>
                      <Badge className={segment.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {segment.growth > 0 ? '+' : ''}{segment.growth}%
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: segment.color }}>
                      {segment.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {((segment.value / customerStats.total) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Segments</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registration_date">Registration Date</SelectItem>
                      <SelectItem value="last_activity">Last Activity</SelectItem>
                      <SelectItem value="total_spent">Total Spent</SelectItem>
                      <SelectItem value="total_orders">Total Orders</SelectItem>
                      <SelectItem value="lifetime_value">Lifetime Value</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>LTV</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customersData.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {customer.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail size={14} className="mr-2 text-gray-400" />
                              {customer.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-900">
                              <Phone size={14} className="mr-2 text-gray-400" />
                              {customer.phone}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin size={14} className="mr-2 text-gray-400" />
                              {customer.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSegmentColor(customer.segment)}>
                            {customer.segment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{customer.totalOrders}</div>
                            <div className="text-xs text-gray-500">orders</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-right">
                            <div className="font-medium">৳{customer.totalSpent.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">avg: ৳{customer.avgOrderValue}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-right">
                            <div className="font-medium text-purple-600">৳{customer.lifetimeValue.toLocaleString()}</div>
                            <div className="flex items-center text-xs">
                              <Star size={12} className="mr-1 text-yellow-500" />
                              <span className={getRiskColor(customer.riskScore)}>{customer.riskScore} risk</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{customer.lastActivity}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" title="View Details">
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="outline" title="Edit Customer">
                              <Edit size={14} />
                            </Button>
                            <Button size="sm" variant="outline" title="Send Message">
                              <MessageSquare size={14} />
                            </Button>
                            <Button size="sm" variant="outline" title="More Actions">
                              <MoreHorizontal size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {segmentData.map((segment, index) => (
                  <div key={index} className="p-6 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{segment.name}</h3>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customers:</span>
                        <span className="font-medium">{segment.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth:</span>
                        <span className={`font-medium ${segment.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {segment.growth > 0 ? '+' : ''}{segment.growth}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Share:</span>
                        <span className="font-medium">{((segment.value / customerStats.total) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Advanced analytics and insights coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {geographicData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{region.region}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{region.customers.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{region.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Customers']} />
                      <Bar dataKey="customers" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Customer engagement metrics and tools coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
