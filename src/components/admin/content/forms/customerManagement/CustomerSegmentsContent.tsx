
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Users, TrendingUp, Target, BarChart3, PieChart, Settings, Plus, Eye, Edit, Trash2, Mail, MessageSquare, Zap, DollarSign, Clock, Filter, Download, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter } from 'recharts';
import { customerSegmentationEngine } from '@/services/ml/segmentation/CustomerSegmentationEngine';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface SegmentCampaign {
  id: string;
  name: string;
  segmentIds: string[];
  type: 'email' | 'sms' | 'push' | 'discount';
  status: 'draft' | 'active' | 'paused' | 'completed';
  reach: number;
  engagement: number;
  conversion: number;
  createdAt: Date;
}

export const CustomerSegmentsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [segments, setSegments] = useState<any[]>([]);
  const [segmentAnalytics, setSegmentAnalytics] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<SegmentCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [newSegmentDialog, setNewSegmentDialog] = useState(false);
  const [campaignDialog, setCampaignDialog] = useState(false);

  // Mock data for demonstration
  const segmentPerformanceData = [
    { month: 'Jan', highValue: 4200, loyal: 3800, priceConscious: 2100, newCustomers: 1200 },
    { month: 'Feb', highValue: 4800, loyal: 4200, priceConscious: 2300, newCustomers: 1800 },
    { month: 'Mar', highValue: 5200, loyal: 4600, priceConscious: 2800, newCustomers: 2200 },
    { month: 'Apr', highValue: 4900, loyal: 4100, priceConscious: 2600, newCustomers: 1900 },
    { month: 'May', highValue: 5800, loyal: 4800, priceConscious: 3100, newCustomers: 2600 },
    { month: 'Jun', highValue: 6200, loyal: 5200, priceConscious: 3400, newCustomers: 2900 },
  ];

  const segmentValueData = [
    { name: 'High-Value Customers', value: 35, revenue: 2500000, count: 12500 },
    { name: 'Loyal Customers', value: 28, revenue: 1800000, count: 24000 },
    { name: 'Price-Conscious', value: 22, revenue: 950000, count: 18500 },
    { name: 'New Customers', value: 15, revenue: 480000, count: 8200 },
  ];

  const customerLifecycleData = [
    { stage: 'Awareness', count: 15000, conversion: 0.12 },
    { stage: 'Interest', count: 8500, conversion: 0.28 },
    { stage: 'Consideration', count: 4200, conversion: 0.45 },
    { stage: 'Purchase', count: 2800, conversion: 0.65 },
    { stage: 'Retention', count: 2100, conversion: 0.78 },
    { stage: 'Advocacy', count: 1200, conversion: 0.85 }
  ];

  const behaviorSegmentData = [
    { behavior: 'Frequent Buyers', percentage: 25, avgOrder: 850, frequency: 8.2 },
    { behavior: 'Seasonal Shoppers', percentage: 18, avgOrder: 420, frequency: 2.1 },
    { behavior: 'Deal Hunters', percentage: 22, avgOrder: 280, frequency: 4.5 },
    { behavior: 'Impulse Buyers', percentage: 15, avgOrder: 180, frequency: 6.8 },
    { behavior: 'Research Oriented', percentage: 12, avgOrder: 1200, frequency: 1.8 },
    { behavior: 'Brand Loyalists', percentage: 8, avgOrder: 950, frequency: 5.2 }
  ];

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initialize segmentation engine
        await customerSegmentationEngine.initialize();
        
        // Get segment analytics
        const analytics = await customerSegmentationEngine.getSegmentAnalytics();
        setSegmentAnalytics(analytics);

        // Mock segments data
        const mockSegments = [
          {
            id: 'high-value',
            name: 'High-Value Customers',
            description: 'Customers with high lifetime value and frequent purchases',
            size: 12500,
            criteria: ['AOV > $500', 'Purchase frequency > 5/month', 'Customer for > 1 year'],
            growth: 15.8,
            revenue: 2500000,
            conversionRate: 0.18,
            churnRate: 0.05,
            status: 'active'
          },
          {
            id: 'loyal-customers',
            name: 'Loyal Customers',
            description: 'Repeat customers with consistent purchase behavior',
            size: 24000,
            criteria: ['Purchase frequency > 3/month', 'Return rate < 5%', 'Positive reviews'],
            growth: 8.2,
            revenue: 1800000,
            conversionRate: 0.14,
            churnRate: 0.08,
            status: 'active'
          },
          {
            id: 'price-conscious',
            name: 'Price-Conscious Shoppers',
            description: 'Budget-focused customers who respond to discounts',
            size: 18500,
            criteria: ['Uses coupons regularly', 'Shops during sales', 'Compares prices'],
            growth: -2.5,
            revenue: 950000,
            conversionRate: 0.09,
            churnRate: 0.15,
            status: 'active'
          },
          {
            id: 'new-customers',
            name: 'New Customers',
            description: 'Recently acquired customers in their first 90 days',
            size: 8200,
            criteria: ['Account age < 90 days', 'First purchase made', 'Email verified'],
            growth: 25.3,
            revenue: 480000,
            conversionRate: 0.12,
            churnRate: 0.25,
            status: 'active'
          }
        ];

        setSegments(mockSegments);

        // Mock campaigns
        const mockCampaigns: SegmentCampaign[] = [
          {
            id: '1',
            name: 'Premium Product Launch',
            segmentIds: ['high-value'],
            type: 'email',
            status: 'active',
            reach: 12500,
            engagement: 0.24,
            conversion: 0.08,
            createdAt: new Date('2024-01-15')
          },
          {
            id: '2',
            name: 'Flash Sale Alert',
            segmentIds: ['price-conscious'],
            type: 'sms',
            status: 'completed',
            reach: 18500,
            engagement: 0.31,
            conversion: 0.15,
            createdAt: new Date('2024-01-10')
          }
        ];

        setCampaigns(mockCampaigns);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing customer segments:', error);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleCreateSegment = () => {
    // Implementation for creating new segment
    setNewSegmentDialog(false);
  };

  const handleCreateCampaign = () => {
    // Implementation for creating new campaign
    setCampaignDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Segments</h1>
          <p className="text-gray-600 mt-2">Advanced customer segmentation and targeting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={newSegmentDialog} onOpenChange={setNewSegmentDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Segment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Customer Segment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="segment-name">Segment Name</Label>
                    <Input id="segment-name" placeholder="Enter segment name" />
                  </div>
                  <div>
                    <Label htmlFor="segment-type">Segment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="demographic">Demographic</SelectItem>
                        <SelectItem value="geographic">Geographic</SelectItem>
                        <SelectItem value="psychographic">Psychographic</SelectItem>
                        <SelectItem value="value-based">Value-Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe this segment" />
                </div>
                <div>
                  <Label>Criteria</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select criteria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order-value">Average Order Value</SelectItem>
                          <SelectItem value="frequency">Purchase Frequency</SelectItem>
                          <SelectItem value="recency">Last Purchase</SelectItem>
                          <SelectItem value="lifetime-value">Lifetime Value</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gt">Greater than</SelectItem>
                          <SelectItem value="lt">Less than</SelectItem>
                          <SelectItem value="eq">Equal to</SelectItem>
                          <SelectItem value="between">Between</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Value" className="w-32" />
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewSegmentDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSegment}>Create Segment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Segments</p>
                    <p className="text-2xl font-bold">{segments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                    <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Conversion</p>
                    <p className="text-2xl font-bold">12.8%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                    <p className="text-2xl font-bold">$5.7M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segment Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Segment Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={segmentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="highValue" stroke="#8884d8" name="High-Value" />
                  <Line type="monotone" dataKey="loyal" stroke="#82ca9d" name="Loyal" />
                  <Line type="monotone" dataKey="priceConscious" stroke="#ffc658" name="Price-Conscious" />
                  <Line type="monotone" dataKey="newCustomers" stroke="#ff7300" name="New Customers" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Segment Value Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={segmentValueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {segmentValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifecycle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={customerLifecycleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Segments</h2>
            <div className="flex gap-2">
              <Input placeholder="Search segments..." className="w-64" />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {segments.map((segment) => (
              <Card key={segment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{segment.name}</h3>
                        <Badge variant={segment.status === 'active' ? 'default' : 'secondary'}>
                          {segment.status}
                        </Badge>
                        <Badge variant="outline">
                          {segment.size.toLocaleString()} customers
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-1">{segment.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {segment.criteria.map((criterion: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {criterion}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Growth Rate</p>
                          <p className={`font-semibold ${segment.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {segment.growth > 0 ? '+' : ''}{segment.growth}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Revenue</p>
                          <p className="font-semibold">${(segment.revenue / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Conversion</p>
                          <p className="font-semibold">{(segment.conversionRate * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Churn Rate</p>
                          <p className="font-semibold">{(segment.churnRate * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Target className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segment Revenue Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={segmentValueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition vs Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={segments.map(s => ({ 
                    name: s.name, 
                    acquisition: (1 - s.churnRate) * 100, 
                    retention: s.conversionRate * 100,
                    size: s.size / 1000
                  }))}>
                    <CartesianGrid />
                    <XAxis dataKey="acquisition" name="Acquisition Rate" />
                    <YAxis dataKey="retention" name="Retention Rate" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="size" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Segment Profitability Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {segments.map((segment) => (
                  <div key={segment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{segment.name}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <span className="text-sm text-gray-500">CLV: </span>
                          <span className="font-medium">${(segment.revenue / segment.size).toFixed(0)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">CAC: </span>
                          <span className="font-medium">${Math.round(50 + Math.random() * 100)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">ROI: </span>
                          <span className="font-medium text-green-600">
                            {((segment.revenue / segment.size) / (50 + Math.random() * 100) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${(segment.revenue / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-gray-500">{segment.size.toLocaleString()} customers</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Behavior Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {behaviorSegmentData.map((behavior, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{behavior.behavior}</h4>
                        <div className="flex items-center gap-6 mt-2">
                          <div>
                            <span className="text-sm text-gray-500">Percentage: </span>
                            <span className="font-medium">{behavior.percentage}%</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Avg Order: </span>
                            <span className="font-medium">${behavior.avgOrder}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Frequency: </span>
                            <span className="font-medium">{behavior.frequency}/month</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-32">
                        <Progress value={behavior.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Behavioral Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={behaviorSegmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="behavior" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="percentage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Targeted Campaigns</h2>
            <Dialog open={campaignDialog} onOpenChange={setCampaignDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Targeted Campaign</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input id="campaign-name" placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <Label htmlFor="campaign-type">Campaign Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email Campaign</SelectItem>
                          <SelectItem value="sms">SMS Campaign</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                          <SelectItem value="discount">Discount Offer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Target Segments</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {segments.map((segment) => (
                        <div key={segment.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={segment.id}
                            checked={selectedSegments.includes(segment.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSegments([...selectedSegments, segment.id]);
                              } else {
                                setSelectedSegments(selectedSegments.filter(id => id !== segment.id));
                              }
                            }}
                          />
                          <Label htmlFor={segment.id} className="text-sm">
                            {segment.name} ({segment.size.toLocaleString()})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Campaign Message</Label>
                    <Textarea id="message" placeholder="Enter your campaign message" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCampaignDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCampaign}>Create Campaign</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline">
                          {campaign.type}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Reach</p>
                          <p className="font-semibold">{campaign.reach.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Engagement</p>
                          <p className="font-semibold">{(campaign.engagement * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Conversion</p>
                          <p className="font-semibold">{(campaign.conversion * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {campaign.status === 'active' && (
                        <Button variant="outline" size="sm">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">High-Value Customer Opportunity</h4>
                  <p className="text-blue-800 mt-1">
                    Your price-conscious segment shows 23% higher engagement with premium products during sale periods. 
                    Consider targeted premium campaigns with limited-time discounts.
                  </p>
                  <Button size="sm" className="mt-2">Apply Recommendation</Button>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900">Retention Risk Alert</h4>
                  <p className="text-green-800 mt-1">
                    18% of loyal customers haven't made a purchase in 45+ days. Deploy win-back campaigns 
                    with personalized offers to reduce churn risk.
                  </p>
                  <Button size="sm" className="mt-2">Create Win-Back Campaign</Button>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900">Cross-Sell Opportunity</h4>
                  <p className="text-purple-800 mt-1">
                    New customers in electronics category show 67% interest in accessories within 30 days. 
                    Optimize cross-sell campaigns for maximum impact.
                  </p>
                  <Button size="sm" className="mt-2">Optimize Cross-Sell</Button>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900">Seasonal Trend Prediction</h4>
                  <p className="text-yellow-800 mt-1">
                    Fashion segment expected to increase 34% in next 6 weeks based on historical patterns. 
                    Prepare inventory and marketing campaigns accordingly.
                  </p>
                  <Button size="sm" className="mt-2">View Forecast</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment Performance Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segments.map((segment) => (
                    <div key={segment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{segment.name}</h4>
                        <p className="text-sm text-gray-600">Next 30 days prediction</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          +{(5 + Math.random() * 15).toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500">Expected growth</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
