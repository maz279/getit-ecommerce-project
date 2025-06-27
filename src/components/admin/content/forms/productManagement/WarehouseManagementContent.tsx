
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
  Warehouse, 
  Package, 
  TruckIcon, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  BarChart3,
  MapPin,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Zap
} from 'lucide-react';

export const WarehouseManagementContent: React.FC = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Mock data for warehouse analytics
  const warehouseStats = [
    { id: 'wh-dhaka-1', name: 'Dhaka Main', capacity: 10000, used: 7500, efficiency: 85, staff: 45, orders: 1234 },
    { id: 'wh-chittagong-1', name: 'Chittagong Hub', capacity: 8000, used: 6200, efficiency: 92, staff: 38, orders: 987 },
    { id: 'wh-sylhet-1', name: 'Sylhet Center', capacity: 5000, used: 3800, efficiency: 78, staff: 28, orders: 654 },
    { id: 'wh-khulna-1', name: 'Khulna Depot', capacity: 6000, used: 4100, efficiency: 81, staff: 32, orders: 743 }
  ];

  const performanceData = [
    { name: 'Mon', pickRate: 85, packRate: 92, shipRate: 88 },
    { name: 'Tue', pickRate: 88, packRate: 94, shipRate: 91 },
    { name: 'Wed', pickRate: 82, packRate: 89, shipRate: 86 },
    { name: 'Thu', pickRate: 90, packRate: 96, shipRate: 93 },
    { name: 'Fri', pickRate: 87, packRate: 91, shipRate: 89 },
    { name: 'Sat', pickRate: 85, packRate: 88, shipRate: 87 },
    { name: 'Sun', pickRate: 83, packRate: 90, shipRate: 85 }
  ];

  const capacityData = warehouseStats.map(wh => ({
    name: wh.name.split(' ')[0],
    used: wh.used,
    available: wh.capacity - wh.used,
    utilization: Math.round((wh.used / wh.capacity) * 100)
  }));

  const zoneEfficiencyData = [
    { zone: 'Receiving', efficiency: 92, volume: 1250 },
    { zone: 'Storage', efficiency: 88, volume: 8500 },
    { zone: 'Picking', efficiency: 85, volume: 2100 },
    { zone: 'Packing', efficiency: 91, volume: 1980 },
    { zone: 'Shipping', efficiency: 87, volume: 1850 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive warehouse operations and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouseStats.map(wh => (
                <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Warehouse className="h-4 w-4 mr-2" />
              Total Warehouses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">4</div>
            <p className="text-xs text-gray-500">Across Bangladesh</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Total Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">29,000</div>
            <p className="text-xs text-gray-500">Units storage capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Avg Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">84%</div>
            <p className="text-xs text-gray-500">Operational efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">143</div>
            <p className="text-xs text-gray-500">Active employees</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Warehouse Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Warehouse Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouseStats.map((warehouse) => (
                    <div key={warehouse.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{warehouse.name}</span>
                        <Badge className={warehouse.efficiency > 85 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                          {warehouse.efficiency}% Efficient
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Capacity Utilization</span>
                          <span>{Math.round((warehouse.used / warehouse.capacity) * 100)}%</span>
                        </div>
                        <Progress value={(warehouse.used / warehouse.capacity) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{warehouse.used.toLocaleString()} used</span>
                          <span>{warehouse.capacity.toLocaleString()} total</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="pickRate" stroke="#8884d8" strokeWidth={2} name="Pick Rate" />
                    <Line type="monotone" dataKey="packRate" stroke="#82ca9d" strokeWidth={2} name="Pack Rate" />
                    <Line type="monotone" dataKey="shipRate" stroke="#ffc658" strokeWidth={2} name="Ship Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zone Efficiency */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Zone Efficiency Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Receive Inventory
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Schedule Shipment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cycle Count
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Safety Inspection
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Zone Configuration
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Operations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Operations</CardTitle>
              <div className="flex space-x-2">
                <Input placeholder="Search operations..." className="max-w-sm" />
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operation ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>OP-2024-001</TableCell>
                    <TableCell>Receiving</TableCell>
                    <TableCell>Dhaka Main</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">Completed</Badge></TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>2 hours ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>OP-2024-002</TableCell>
                    <TableCell>Picking</TableCell>
                    <TableCell>Chittagong Hub</TableCell>
                    <TableCell><Badge className="bg-blue-100 text-blue-800">In Progress</Badge></TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>30 mins ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>OP-2024-003</TableCell>
                    <TableCell>Packing</TableCell>
                    <TableCell>Sylhet Center</TableCell>
                    <TableCell><Badge className="bg-orange-100 text-orange-800">Pending</Badge></TableCell>
                    <TableCell>Mike Johnson</TableCell>
                    <TableCell>1 hour ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacity Tab */}
        <TabsContent value="capacity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Capacity Utilization Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Capacity Utilization by Warehouse</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={capacityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="used" stackId="a" fill="#8884d8" name="Used" />
                    <Bar dataKey="available" stackId="a" fill="#82ca9d" name="Available" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Capacity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Capacity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={capacityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, utilization }) => `${name}: ${utilization}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="used"
                    >
                      {capacityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pick Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">99.2%</div>
                <p className="text-xs text-gray-500">+0.3% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Order Fulfillment Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">2.3h</div>
                <p className="text-xs text-gray-500">-15 mins from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cost per Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">৳45</div>
                <p className="text-xs text-gray-500">-৳3 from last week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <p className="text-sm text-gray-600">Manage warehouse staff and schedules</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Staff management functionality coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Settings</CardTitle>
              <p className="text-sm text-gray-600">Configure warehouse parameters and rules</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Settings configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
