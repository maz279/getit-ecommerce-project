import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Target, TrendingUp, BarChart3, PieChart, Filter, Search, Plus, Edit, Trash2, Eye, Download, Settings, Zap } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as PieChartComponent, Pie, Cell } from 'recharts';

// Mock Data for Customer Segments
const customerSegmentsData = [
  { id: 1, name: 'High-Value Customers', description: 'Customers with high purchase amounts and frequent activity.', criteria: 'Total spend > $1000 and order frequency > 5', members: 1500 },
  { id: 2, name: 'New Customers', description: 'Customers who have made their first purchase in the last 30 days.', criteria: 'First purchase date within the last 30 days', members: 800 },
  { id: 3, name: 'Inactive Customers', description: 'Customers who have not made a purchase in the last 90 days.', criteria: 'Last purchase date > 90 days', members: 2200 },
  { id: 4, name: 'VIP Customers', description: 'Top 10% of customers based on lifetime value.', criteria: 'Top 10% by lifetime value', members: 500 },
];

// Mock Data for Analytics
const engagementData = [
  { month: 'Jan', visits: 1200, signups: 300 },
  { month: 'Feb', visits: 1500, signups: 350 },
  { month: 'Mar', visits: 1800, signups: 400 },
  { month: 'Apr', visits: 2000, signups: 450 },
  { month: 'May', visits: 2200, signups: 500 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const pieChartData = [
  { name: 'Segment A', value: 400 },
  { name: 'Segment B', value: 300 },
  { name: 'Segment C', value: 300 },
  { name: 'Segment D', value: 200 },
];

// CustomerSegmentsContent Component
export const CustomerSegmentsContent: React.FC = () => {
  const [segments, setSegments] = useState(customerSegmentsData);
  const [newSegment, setNewSegment] = useState({ name: '', description: '', criteria: '' });
  const [editingSegmentId, setEditingSegmentId] = useState<number | null>(null);
  const [editedSegment, setEditedSegment] = useState({ id: 0, name: '', description: '', criteria: '', members: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewSegment({ ...newSegment, [e.target.name]: e.target.value });
  };

  const handleAddSegment = () => {
    const newId = segments.length > 0 ? Math.max(...segments.map(s => s.id)) + 1 : 1;
    const segmentToAdd = { ...newSegment, id: newId, members: 0 };
    setSegments([...segments, segmentToAdd]);
    setNewSegment({ name: '', description: '', criteria: '' });
  };

  const handleEditSegment = (segmentId: number) => {
    const segmentToEdit = segments.find(segment => segment.id === segmentId);
    if (segmentToEdit) {
      setEditingSegmentId(segmentId);
      setEditedSegment({ ...segmentToEdit });
    }
  };

  const handleSaveSegment = () => {
    const updatedSegments = segments.map(segment =>
      segment.id === editedSegment.id ? { ...editedSegment } : segment
    );
    setSegments(updatedSegments);
    setEditingSegmentId(null);
  };

  const handleDeleteSegment = (segmentId: number) => {
    const updatedSegments = segments.filter(segment => segment.id !== segmentId);
    setSegments(updatedSegments);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredSegments = segments.filter(segment =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.criteria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Customer Segments</h1>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search segments..."
            className="md:w-80"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Segments Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Users className="h-6 w-6 text-gray-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{segments.length}</div>
                <div className="text-sm text-gray-500">Total Segments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Target className="h-6 w-6 text-gray-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{segments.reduce((acc, segment) => acc + segment.members, 0)}</div>
                <div className="text-sm text-gray-500">Customers Segmented</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <TrendingUp className="h-6 w-6 text-gray-500 mb-2" />
                <div className="text-2xl font-bold text-green-500">+15%</div>
                <div className="text-sm text-gray-500">Segment Growth</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <BarChart3 className="h-6 w-6 text-gray-500 mb-2" />
                <div className="text-2xl font-bold text-blue-500">82%</div>
                <div className="text-sm text-gray-500">Segmentation Rate</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ visits: {}, signups: {} }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="visits" stroke="#8884d8" name="Visits" />
                    <Line type="monotone" dataKey="signups" stroke="#82ca9d" name="Signups" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criteria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSegments.map((segment) => (
                      <tr key={segment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{segment.name}</td>
                        <td className="px-6 py-4">{segment.description}</td>
                        <td className="px-6 py-4">{segment.criteria}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{segment.members}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {editingSegmentId === segment.id ? (
                            <div className="space-x-2">
                              <Button variant="secondary" size="sm" onClick={handleSaveSegment}>Save</Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingSegmentId(null)}>Cancel</Button>
                            </div>
                          ) : (
                            <div className="space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditSegment(segment.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteSegment(segment.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          )}
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
              <CardTitle>Add New Segment</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" value={newSegment.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={newSegment.description} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="criteria">Criteria</Label>
                <Input type="text" id="criteria" name="criteria" value={newSegment.criteria} onChange={handleInputChange} />
              </div>
              <Button onClick={handleAddSegment}>
                <Plus className="h-4 w-4 mr-2" />
                Add Segment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ segmentA: {}, segmentB: {}, segmentC: {}, segmentD: {} }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChartComponent>
                    <Pie
                      dataKey="value"
                      isAnimationActive={false}
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {
                        pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                      }
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChartComponent>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Customer Behavior Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detailed customer behavior insights coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Targeted Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Campaign management tools for each segment coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI-Driven Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p>AI-generated insights and recommendations coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
