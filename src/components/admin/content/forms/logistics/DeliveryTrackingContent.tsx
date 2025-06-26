
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Filter, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Navigation,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  Download,
  RefreshCw,
  Eye,
  Edit,
  MoreHorizontal,
  Route,
  Timer,
  Star,
  MessageSquare
} from 'lucide-react';

interface DeliveryItem {
  id: string;
  trackingNumber: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  status: 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed' | 'failed';
  courierPartner: string;
  courierDriver: string;
  driverPhone: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  priority: 'normal' | 'express' | 'same_day';
  packageValue: number;
  deliveryInstructions?: string;
  currentLocation: string;
  lastUpdated: string;
  timeline: DeliveryTimelineItem[];
}

interface DeliveryTimelineItem {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

const mockDeliveryData: DeliveryItem[] = [
  {
    id: '1',
    trackingNumber: 'TRK001234567',
    orderId: 'ORD-2024-001',
    customerName: 'Ahmed Rahman',
    customerPhone: '+880-1712-345678',
    deliveryAddress: 'House 123, Road 15, Dhanmondi, Dhaka-1205',
    status: 'out_for_delivery',
    courierPartner: 'Pathao Courier',
    courierDriver: 'Karim Uddin',
    driverPhone: '+880-1798-876543',
    estimatedDelivery: '2024-01-15 18:00',
    priority: 'express',
    packageValue: 2500,
    deliveryInstructions: 'Call before delivery. Ring bell twice.',
    currentLocation: 'Dhanmondi Hub',
    lastUpdated: '2024-01-15 15:30',
    timeline: [
      { timestamp: '2024-01-15 09:00', status: 'Picked Up', location: 'Warehouse Dhaka', description: 'Package picked up from vendor' },
      { timestamp: '2024-01-15 12:00', status: 'In Transit', location: 'Sorting Center', description: 'Package sorted for delivery' },
      { timestamp: '2024-01-15 15:00', status: 'Out for Delivery', location: 'Dhanmondi Hub', description: 'Out for delivery with Karim Uddin' }
    ]
  },
  {
    id: '2',
    trackingNumber: 'TRK001234568',
    orderId: 'ORD-2024-002',
    customerName: 'Fatima Khatun',
    customerPhone: '+880-1823-456789',
    deliveryAddress: 'Flat 4B, Building 12, Gulshan-2, Dhaka-1212',
    status: 'delivered',
    courierPartner: 'RedX Delivery',
    courierDriver: 'Milon Hasan',
    driverPhone: '+880-1987-654321',
    estimatedDelivery: '2024-01-15 16:00',
    actualDelivery: '2024-01-15 15:45',
    priority: 'same_day',
    packageValue: 4200,
    currentLocation: 'Delivered',
    lastUpdated: '2024-01-15 15:45',
    timeline: [
      { timestamp: '2024-01-15 10:00', status: 'Picked Up', location: 'Warehouse Dhaka', description: 'Package picked up from vendor' },
      { timestamp: '2024-01-15 13:00', status: 'In Transit', location: 'Gulshan Hub', description: 'Package reached Gulshan hub' },
      { timestamp: '2024-01-15 14:30', status: 'Out for Delivery', location: 'Gulshan Hub', description: 'Out for delivery with Milon Hasan' },
      { timestamp: '2024-01-15 15:45', status: 'Delivered', location: 'Customer Address', description: 'Package delivered successfully' }
    ]
  },
  {
    id: '3',
    trackingNumber: 'TRK001234569',
    orderId: 'ORD-2024-003',
    customerName: 'Mohammad Ali',
    customerPhone: '+880-1645-789123',
    deliveryAddress: 'Shop 45, New Market, Dhaka-1205',
    status: 'delayed',
    courierPartner: 'Steadfast Courier',
    courierDriver: 'Rashid Ahmed',
    driverPhone: '+880-1876-543210',
    estimatedDelivery: '2024-01-15 14:00',
    priority: 'normal',
    packageValue: 1800,
    deliveryInstructions: 'Deliver to shop counter',
    currentLocation: 'New Market Area',
    lastUpdated: '2024-01-15 16:00',
    timeline: [
      { timestamp: '2024-01-15 08:00', status: 'Picked Up', location: 'Warehouse Dhaka', description: 'Package picked up from vendor' },
      { timestamp: '2024-01-15 11:00', status: 'In Transit', location: 'Central Hub', description: 'Package in transit' },
      { timestamp: '2024-01-15 16:00', status: 'Delayed', location: 'New Market Area', description: 'Delivery delayed due to traffic congestion' }
    ]
  }
];

export const DeliveryTrackingContent: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(mockDeliveryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'delayed': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4" />;
      case 'in_transit': return <Route className="h-4 w-4" />;
      case 'picked_up': return <Package className="h-4 w-4" />;
      case 'delayed': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'same_day': return 'bg-red-100 text-red-800';
      case 'express': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStats = () => {
    const total = deliveries.length;
    const delivered = deliveries.filter(d => d.status === 'delivered').length;
    const outForDelivery = deliveries.filter(d => d.status === 'out_for_delivery').length;
    const delayed = deliveries.filter(d => d.status === 'delayed').length;
    const inTransit = deliveries.filter(d => d.status === 'in_transit').length;

    return { total, delivered, outForDelivery, delayed, inTransit };
  };

  const stats = getDeliveryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <MapPin className="mr-3 h-8 w-8 text-blue-600" />
              Delivery Tracking Management
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              📍 Order Management → Shipping & Logistics → Delivery Tracking
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Live Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="tracking">Active Deliveries</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Deliveries</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600">↗ 12% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Delivered Today</p>
                    <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600">94.2% success rate</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Out for Delivery</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.outForDelivery}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-blue-600">ETA: 2-4 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">In Transit</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.inTransit}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Route className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-yellow-600">Moving to hubs</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Delayed/Issues</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.delayed}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-orange-600">Needs attention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Delivery Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveries.slice(0, 5).map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getStatusIcon(delivery.status)}
                      </div>
                      <div>
                        <p className="font-semibold">{delivery.trackingNumber}</p>
                        <p className="text-sm text-gray-600">{delivery.customerName} • {delivery.currentLocation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{delivery.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by tracking number, order ID, or customer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="delayed">Delayed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delivery List */}
          <div className="grid gap-6">
            {filteredDeliveries.map((delivery) => (
              <Card key={delivery.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(delivery.status)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg">{delivery.trackingNumber}</h3>
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(delivery.priority)}>
                            {delivery.priority.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Order: {delivery.orderId}</p>
                        <p className="text-sm text-gray-600">Value: ৳{delivery.packageValue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedDelivery(delivery)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-semibold">{delivery.customerName}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {delivery.customerPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Courier</p>
                      <p className="font-semibold">{delivery.courierPartner}</p>
                      <p className="text-sm text-gray-600">{delivery.courierDriver}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{delivery.currentLocation}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Timer className="h-3 w-3 mr-1" />
                        ETA: {delivery.estimatedDelivery}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Delivery Address</p>
                    <p className="text-sm bg-gray-50 p-2 rounded flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {delivery.deliveryAddress}
                    </p>
                  </div>

                  {delivery.deliveryInstructions && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Delivery Instructions</p>
                      <p className="text-sm bg-yellow-50 p-2 rounded flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-yellow-600" />
                        {delivery.deliveryInstructions}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-3">Delivery Timeline</p>
                    <div className="space-y-2">
                      {delivery.timeline.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`h-3 w-3 rounded-full ${index === delivery.timeline.length - 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{item.status}</p>
                              <p className="text-xs text-gray-500">{item.timestamp}</p>
                            </div>
                            <p className="text-xs text-gray-600">{item.location} • {item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2" />
                Live Delivery Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">Interactive Delivery Map</p>
                  <p className="text-sm text-gray-500 mb-4">Real-time tracking of all active deliveries</p>
                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Delivered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Out for Delivery</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">In Transit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Delayed</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Delivery Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Delivery Performance Chart</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Delivery Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Delivery Trends Chart</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Delivery Time</span>
                    <Badge className="bg-blue-100 text-blue-800">2.3 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>On-Time Delivery Rate</span>
                    <Badge className="bg-green-100 text-green-800">94.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.7/5.0</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Failed Delivery Rate</span>
                    <Badge className="bg-red-100 text-red-800">1.8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Couriers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>RedX Delivery</span>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pathao Courier</span>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Steadfast Courier</span>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
