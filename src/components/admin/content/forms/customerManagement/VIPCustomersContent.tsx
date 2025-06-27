
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Crown, Users, TrendingUp, DollarSign, Gift, Star, Award, 
  Calendar, Phone, Mail, MapPin, CreditCard, ShoppingBag,
  Filter, Search, Plus, Edit, Trash2, Eye, Download, 
  Target, Zap, Heart, MessageSquare, BarChart3, PieChart,
  UserCheck, Globe, Clock, Settings
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as PieChartComponent, Pie, Cell, Area, AreaChart } from 'recharts';

// Mock Data for VIP Customers
const vipCustomersData = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    email: 'sarah@email.com', 
    phone: '+1-234-567-8901',
    tier: 'Platinum', 
    lifetimeValue: 125000, 
    totalOrders: 287, 
    avgOrderValue: 435,
    joinDate: '2020-03-15',
    lastActivity: '2024-01-20',
    preferredCategories: ['Fashion', 'Electronics', 'Home'],
    personalShopper: 'Emily Chen',
    status: 'Active'
  },
  { 
    id: 2, 
    name: 'Michael Rodriguez', 
    email: 'michael@email.com', 
    phone: '+1-234-567-8902',
    tier: 'Diamond', 
    lifetimeValue: 250000, 
    totalOrders: 456, 
    avgOrderValue: 548,
    joinDate: '2019-07-22',
    lastActivity: '2024-01-19',
    preferredCategories: ['Electronics', 'Sports', 'Books'],
    personalShopper: 'David Kim',
    status: 'Active'
  },
  { 
    id: 3, 
    name: 'Emma Thompson', 
    email: 'emma@email.com', 
    phone: '+1-234-567-8903',
    tier: 'Gold', 
    lifetimeValue: 85000, 
    totalOrders: 198, 
    avgOrderValue: 429,
    joinDate: '2021-01-10',
    lastActivity: '2024-01-18',
    preferredCategories: ['Beauty', 'Fashion', 'Health'],
    personalShopper: 'Lisa Park',
    status: 'Active'
  }
];

// Analytics Data
const vipTierDistribution = [
  { name: 'Diamond', value: 45, color: '#8B5CF6' },
  { name: 'Platinum', value: 120, color: '#06B6D4' },
  { name: 'Gold', value: 285, color: '#F59E0B' },
  { name: 'Silver', value: 450, color: '#6B7280' }
];

const vipRevenueData = [
  { month: 'Jan', revenue: 2400000, orders: 3500, customers: 850 },
  { month: 'Feb', revenue: 2800000, orders: 4200, customers: 920 },
  { month: 'Mar', revenue: 3200000, orders: 4800, customers: 980 },
  { month: 'Apr', revenue: 2900000, orders: 4400, customers: 1050 },
  { month: 'May', revenue: 3500000, orders: 5200, customers: 1120 },
  { month: 'Jun', revenue: 3800000, orders: 5600, customers: 1200 }
];

const vipBenefitsData = [
  { benefit: 'Free Shipping', usage: 95, satisfaction: 4.8 },
  { benefit: 'Early Access', usage: 78, satisfaction: 4.6 },
  { benefit: 'Personal Shopper', usage: 45, satisfaction: 4.9 },
  { benefit: 'Exclusive Deals', usage: 88, satisfaction: 4.7 },
  { benefit: 'Priority Support', usage: 67, satisfaction: 4.8 },
  { benefit: 'Birthday Rewards', usage: 92, satisfaction: 4.5 }
];

const CHART_COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#F97316'];

export const VIPCustomersContent: React.FC = () => {
  const [customers, setCustomers] = useState(vipCustomersData);
  const [newCustomer, setNewCustomer] = useState({
    name: '', email: '', phone: '', tier: '', personalShopper: ''
  });
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = () => {
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const customerToAdd = {
      ...newCustomer,
      id: newId,
      lifetimeValue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      preferredCategories: [],
      status: 'Active'
    };
    setCustomers([...customers, customerToAdd]);
    setNewCustomer({ name: '', email: '', phone: '', tier: '', personalShopper: '' });
  };

  const handleDeleteCustomer = (customerId: number) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === '' || customer.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond': return 'bg-purple-100 text-purple-800';
      case 'Platinum': return 'bg-cyan-100 text-cyan-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Crown className="h-8 w-8 mr-3 text-yellow-500" />
          VIP Customers
        </h1>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search VIP customers..."
            className="md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tiers</SelectItem>
              <SelectItem value="Diamond">Diamond</SelectItem>
              <SelectItem value="Platinum">Platinum</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* VIP Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Crown className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">900</div>
            <div className="text-sm text-gray-500">Total VIP Customers</div>
            <div className="text-xs text-green-600 mt-1">+12% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <DollarSign className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">$38M</div>
            <div className="text-sm text-gray-500">VIP Revenue (YTD)</div>
            <div className="text-xs text-green-600 mt-1">+18% vs last year</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Star className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">4.9</div>
            <div className="text-sm text-gray-500">VIP Satisfaction Score</div>
            <div className="text-xs text-green-600 mt-1">+0.2 vs last quarter</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Target className="h-8 w-8 text-purple-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">$2,840</div>
            <div className="text-sm text-gray-500">Avg Order Value</div>
            <div className="text-xs text-green-600 mt-1">+25% vs regular customers</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VIP Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ revenue: {}, orders: {} }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={vipRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>VIP Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ diamond: {}, platinum: {}, gold: {}, silver: {} }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChartComponent>
                      <Pie
                        dataKey="value"
                        data={vipTierDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {vipTierDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChartComponent>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent VIP Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { customer: 'Sarah Johnson', action: 'Made a $2,500 purchase', time: '2 hours ago', tier: 'Platinum' },
                  { customer: 'Michael Rodriguez', action: 'Upgraded to Diamond tier', time: '4 hours ago', tier: 'Diamond' },
                  { customer: 'Emma Thompson', action: 'Used personal shopper service', time: '6 hours ago', tier: 'Gold' },
                  { customer: 'David Chen', action: 'Redeemed birthday reward', time: '8 hours ago', tier: 'Platinum' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">{activity.customer}</div>
                        <div className="text-sm text-gray-500">{activity.action}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getTierColor(activity.tier)}>{activity.tier}</Badge>
                      <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP Customer Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lifetime Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal Shopper</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getTierColor(customer.tier)}>{customer.tier}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${customer.lifetimeValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.totalOrders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.personalShopper}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.lastActivity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New VIP Customer</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input type="text" id="name" name="name" value={newCustomer.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input type="email" id="email" name="email" value={newCustomer.email} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input type="text" id="phone" name="phone" value={newCustomer.phone} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="tier">VIP Tier</Label>
                  <Select value={newCustomer.tier} onValueChange={(value) => setNewCustomer({...newCustomer, tier: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="personalShopper">Personal Shopper</Label>
                  <Input type="text" id="personalShopper" name="personalShopper" value={newCustomer.personalShopper} onChange={handleInputChange} />
                </div>
              </div>
              <Button onClick={handleAddCustomer} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add VIP Customer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VIP Order Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ orders: {} }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vipRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="orders" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ customers: {} }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={vipRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="customers" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>VIP Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { metric: 'Retention Rate', value: '96.5%', change: '+2.1%', icon: Heart },
                  { metric: 'Referral Rate', value: '45.3%', change: '+8.2%', icon: Users },
                  { metric: 'Satisfaction Score', value: '4.9/5', change: '+0.2', icon: Star },
                  { metric: 'Avg Session Time', value: '18m 45s', change: '+3m 12s', icon: Clock },
                  { metric: 'Conversion Rate', value: '78.9%', change: '+12.4%', icon: Target },
                  { metric: 'Support Tickets', value: '2.1/month', change: '-0.8', icon: MessageSquare }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <span className="text-xs text-green-600">{item.change}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    <div className="text-sm text-gray-500">{item.metric}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP Benefits Usage & Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vipBenefitsData.map((benefit, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{benefit.benefit}</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          Usage: <span className="font-medium">{benefit.usage}%</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Rating: <span className="font-medium">{benefit.satisfaction}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Usage Rate</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${benefit.usage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Satisfaction</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(benefit.satisfaction / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>VIP Tier Benefits Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Silver', 'Gold', 'Platinum', 'Diamond'].map((tier) => (
                  <div key={tier} className="p-4 border rounded-lg">
                    <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium mb-3 ${getTierColor(tier)}`}>
                      <Crown className="h-4 w-4 mr-1" />
                      {tier}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Free Shipping</span>
                        <span className="text-green-600">✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Early Access</span>
                        <span className={tier === 'Silver' ? 'text-red-500' : 'text-green-600'}>
                          {tier === 'Silver' ? '✗' : '✓'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Personal Shopper</span>
                        <span className={['Gold', 'Platinum', 'Diamond'].includes(tier) ? 'text-green-600' : 'text-red-500'}>
                          {['Gold', 'Platinum', 'Diamond'].includes(tier) ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Concierge Service</span>
                        <span className={tier === 'Diamond' ? 'text-green-600' : 'text-red-500'}>
                          {tier === 'Diamond' ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>VIP Marketing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">VIP-targeted marketing campaigns and personalized promotions coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered VIP Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">AI-driven insights for VIP customer behavior and personalization coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>VIP Program Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">VIP program configuration and tier management settings coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
