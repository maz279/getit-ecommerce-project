
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Crown, Star, TrendingUp, DollarSign, Users, Gift, Phone, Mail, MapPin, Calendar, Filter, Search, Plus, Edit, Eye, Download, Settings } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock Data for VIP Customers
const vipCustomersData = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    email: 'sarah.j@email.com', 
    phone: '+1-555-0123',
    tier: 'Platinum', 
    lifetimeValue: 15000, 
    totalOrders: 45, 
    joinDate: '2022-01-15',
    lastOrder: '2024-06-20',
    personalShopper: 'Emma Wilson',
    preferredCategories: ['Electronics', 'Fashion'],
    status: 'Active'
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    email: 'm.chen@email.com', 
    phone: '+1-555-0124',
    tier: 'Diamond', 
    lifetimeValue: 25000, 
    totalOrders: 68, 
    joinDate: '2021-08-10',
    lastOrder: '2024-06-22',
    personalShopper: 'James Smith',
    preferredCategories: ['Home & Garden', 'Books'],
    status: 'Active'
  },
  { 
    id: 3, 
    name: 'Emily Rodriguez', 
    email: 'e.rodriguez@email.com', 
    phone: '+1-555-0125',
    tier: 'Gold', 
    lifetimeValue: 8500, 
    totalOrders: 32, 
    joinDate: '2022-03-22',
    lastOrder: '2024-06-18',
    personalShopper: 'Lisa Anderson',
    preferredCategories: ['Beauty', 'Health'],
    status: 'Active'
  },
];

// Analytics Data
const spendingTrendData = [
  { month: 'Jan', amount: 12000 },
  { month: 'Feb', amount: 15000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Apr', amount: 22000 },
  { month: 'May', amount: 19000 },
  { month: 'Jun', amount: 25000 },
];

const tierDistributionData = [
  { name: 'Diamond', value: 15, color: '#8B5CF6' },
  { name: 'Platinum', value: 25, color: '#06B6D4' },
  { name: 'Gold', value: 40, color: '#F59E0B' },
  { name: 'Silver', value: 20, color: '#6B7280' },
];

export const VIPCustomersContent: React.FC = () => {
  const [customers, setCustomers] = useState(vipCustomersData);
  const [selectedTier, setSelectedTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    tier: 'gold',
    personalShopper: 'unassigned'
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCustomer = () => {
    const customerToAdd = {
      ...newCustomer,
      id: customers.length + 1,
      lifetimeValue: 0,
      totalOrders: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastOrder: '',
      preferredCategories: [],
      status: 'Active' as const
    };
    setCustomers([...customers, customerToAdd]);
    setNewCustomer({ name: '', email: '', phone: '', tier: 'gold', personalShopper: 'unassigned' });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'all' || customer.tier.toLowerCase() === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'diamond': return 'bg-purple-100 text-purple-800';
      case 'platinum': return 'bg-cyan-100 text-cyan-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">VIP Customers Management</h1>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search customers..."
            className="md:w-80"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Select value={selectedTier} onValueChange={setSelectedTier}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="diamond">Diamond</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* VIP Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Crown className="h-6 w-6 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
            <div className="text-sm text-gray-500">Total VIP Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <DollarSign className="h-6 w-6 text-green-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              ${customers.reduce((acc, customer) => acc + customer.lifetimeValue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Lifetime Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <TrendingUp className="h-6 w-6 text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-green-500">+12%</div>
            <div className="text-sm text-gray-500">Growth This Month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Star className="h-6 w-6 text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-500">Satisfaction Rate</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tiers">Tier Management</TabsTrigger>
          <TabsTrigger value="perks">Perks & Benefits</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
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
                                <span className="text-sm font-medium text-gray-700">
                                  {customer.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getTierBadgeColor(customer.tier)}>
                            {customer.tier}
                          </Badge>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.lastOrder || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
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

          {/* Add New VIP Customer Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New VIP Customer</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    value={newCustomer.name} 
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    value={newCustomer.email} 
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    type="tel" 
                    id="phone" 
                    value={newCustomer.phone} 
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tier">VIP Tier</Label>
                  <Select value={newCustomer.tier} onValueChange={(value) => setNewCustomer({...newCustomer, tier: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="diamond">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="personalShopper">Personal Shopper</Label>
                  <Select value={newCustomer.personalShopper} onValueChange={(value) => setNewCustomer({...newCustomer, personalShopper: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign shopper" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="emma-wilson">Emma Wilson</SelectItem>
                      <SelectItem value="james-smith">James Smith</SelectItem>
                      <SelectItem value="lisa-anderson">Lisa Anderson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddCustomer} className="w-fit">
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
                <CardTitle>VIP Spending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ amount: {} }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={spendingTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ diamond: {}, platinum: {}, gold: {}, silver: {} }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={tierDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {tierDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <CardTitle>VIP Tier Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tier management system for VIP customers coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perks">
          <Card>
            <CardHeader>
              <CardTitle>VIP Perks & Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <p>VIP perks and benefits management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>VIP Communication Center</CardTitle>
            </CardHeader>
            <CardContent>
              <p>VIP customer communication tools coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered VIP Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p>AI-generated insights for VIP customer management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
