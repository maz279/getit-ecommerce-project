
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, DollarSign, Target, Search, Plus, Edit, Download } from 'lucide-react';

const segmentData = [
  { id: 1, name: 'VIP Customers', size: 2150, revenue: 1250000, avgOrder: 580, retention: 95, color: '#8B5CF6' },
  { id: 2, name: 'Regular Shoppers', size: 18500, revenue: 2800000, avgOrder: 151, retention: 78, color: '#3B82F6' },
  { id: 3, name: 'Occasional Buyers', size: 45200, revenue: 1950000, avgOrder: 43, retention: 45, color: '#10B981' },
  { id: 4, name: 'New Customers', size: 12800, revenue: 480000, avgOrder: 38, retention: 25, color: '#F59E0B' },
  { id: 5, name: 'At-Risk Customers', size: 8900, revenue: 320000, avgOrder: 36, retention: 15, color: '#EF4444' },
];

const behaviorMatrix = [
  { frequency: 'High', recency: 'Recent', monetary: 'High', segment: 'Champions', count: 2150, color: '#8B5CF6' },
  { frequency: 'High', recency: 'Recent', monetary: 'Low', segment: 'Loyal Customers', count: 5600, color: '#3B82F6' },
  { frequency: 'Low', recency: 'Recent', monetary: 'High', segment: 'Big Spenders', count: 1200, color: '#10B981' },
  { frequency: 'High', recency: 'Old', monetary: 'High', segment: 'At Risk', count: 890, color: '#F59E0B' },
  { frequency: 'Low', recency: 'Old', monetary: 'Low', segment: 'Lost', count: 3400, color: '#EF4444' },
];

export const CustomerSegmentationAnalytics: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Segmentation</h1>
          <p className="text-gray-600 mt-1">Advanced customer segmentation and behavioral analysis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Segments
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Segment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active segments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segmented Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87,550</div>
            <p className="text-xs text-muted-foreground">98.5% coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segment Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6.8M</div>
            <p className="text-xs text-muted-foreground">+24.5% this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Segment Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Engagement rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="segments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="segments">Segment Overview</TabsTrigger>
          <TabsTrigger value="rfm">RFM Analysis</TabsTrigger>
          <TabsTrigger value="behavior">Behavior Matrix</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Customer Segments</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Search segments..." className="w-64" />
                  <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Segments</SelectItem>
                      <SelectItem value="high-value">High Value</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="new">New Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Segment</th>
                      <th className="text-left p-3">Size</th>
                      <th className="text-left p-3">Revenue</th>
                      <th className="text-left p-3">Avg. Order</th>
                      <th className="text-left p-3">Retention</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentData.map((segment) => (
                      <tr key={segment.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                            <span className="font-medium">{segment.name}</span>
                          </div>
                        </td>
                        <td className="p-3">{segment.size.toLocaleString()}</td>
                        <td className="p-3">${(segment.revenue / 1000000).toFixed(1)}M</td>
                        <td className="p-3">${segment.avgOrder}</td>
                        <td className="p-3">
                          <Badge variant={segment.retention > 80 ? "default" : segment.retention > 60 ? "secondary" : "destructive"}>
                            {segment.retention}%
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segment Size Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="size"
                    >
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={segmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rfm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFM Analysis Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {behaviorMatrix.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{item.segment}</h3>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Frequency: {item.frequency}</div>
                      <div>Recency: {item.recency}</div>
                      <div>Monetary: {item.monetary}</div>
                      <div className="font-medium text-gray-900">{item.count.toLocaleString()} customers</div>
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
              <CardTitle>Customer Behavior Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frequency" name="Purchase Frequency" />
                  <YAxis dataKey="value" name="Customer Value" />
                  <Tooltip />
                  <Scatter
                    data={[
                      { frequency: 10, value: 1000, segment: 'VIP' },
                      { frequency: 5, value: 500, segment: 'Regular' },
                      { frequency: 2, value: 200, segment: 'Occasional' },
                      { frequency: 1, value: 50, segment: 'New' },
                    ]}
                    fill="#3B82F6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segment Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Campaign performance metrics by customer segment would be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Segment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Segment Name</label>
                <Input placeholder="Enter segment name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea placeholder="Describe this segment..." />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCreateModal(false)} variant="outline">Cancel</Button>
                <Button onClick={() => setShowCreateModal(false)}>Create Segment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
