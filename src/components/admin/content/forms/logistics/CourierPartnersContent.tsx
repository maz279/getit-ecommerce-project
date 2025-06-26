
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star, 
  MapPin, 
  Clock, 
  Package, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

interface CourierPartner {
  id: string;
  name: string;
  logo: string;
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  totalDeliveries: number;
  onTimeRate: number;
  avgDeliveryTime: string;
  coverage: string[];
  serviceTypes: string[];
  commission: number;
  contactEmail: string;
  contactPhone: string;
  joinedDate: string;
  lastActive: string;
}

const mockCourierPartners: CourierPartner[] = [
  {
    id: '1',
    name: 'Pathao Courier',
    logo: '🏍️',
    status: 'active',
    rating: 4.5,
    totalDeliveries: 15420,
    onTimeRate: 92.5,
    avgDeliveryTime: '2.5 hours',
    coverage: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'],
    serviceTypes: ['Same Day', 'Express', 'Standard'],
    commission: 8.5,
    contactEmail: 'partner@pathao.com',
    contactPhone: '+880-1700-000000',
    joinedDate: '2023-01-15',
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Steadfast Courier',
    logo: '📦',
    status: 'active',
    rating: 4.3,
    totalDeliveries: 12800,
    onTimeRate: 89.2,
    avgDeliveryTime: '3.2 hours',
    coverage: ['Dhaka', 'Chittagong', 'Khulna'],
    serviceTypes: ['Express', 'Standard', 'Economy'],
    commission: 7.8,
    contactEmail: 'info@steadfast.com.bd',
    contactPhone: '+880-1800-000000',
    joinedDate: '2023-03-20',
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'RedX Delivery',
    logo: '🚚',
    status: 'active',
    rating: 4.7,
    totalDeliveries: 18950,
    onTimeRate: 94.8,
    avgDeliveryTime: '2.1 hours',
    coverage: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'],
    serviceTypes: ['Same Day', 'Express', 'Standard', 'Overnight'],
    commission: 9.2,
    contactEmail: 'support@redx.com.bd',
    contactPhone: '+880-1900-000000',
    joinedDate: '2022-11-10',
    lastActive: '30 minutes ago'
  },
  {
    id: '4',
    name: 'Sundarban Courier',
    logo: '🌿',
    status: 'inactive',
    rating: 3.8,
    totalDeliveries: 5420,
    onTimeRate: 76.3,
    avgDeliveryTime: '4.5 hours',
    coverage: ['Khulna', 'Barisal'],
    serviceTypes: ['Standard', 'Economy'],
    commission: 6.5,
    contactEmail: 'info@sundarban.com',
    contactPhone: '+880-1600-000000',
    joinedDate: '2023-06-15',
    lastActive: '2 days ago'
  }
];

export const CourierPartnersContent: React.FC = () => {
  const [partners, setPartners] = useState<CourierPartner[]>(mockCourierPartners);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddPartner, setShowAddPartner] = useState(false);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4" />;
      case 'inactive': return <Clock className="h-4 w-4" />;
      case 'suspended': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Truck className="mr-3 h-8 w-8 text-blue-600" />
              Courier Partners Management
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              📍 Order Management → Shipping & Logistics → Courier Partners
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Partners
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddPartner(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="partners">All Partners</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Partners</p>
                    <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600">↗ 12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Partners</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {partners.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600">↗ 8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Deliveries</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {partners.reduce((sum, p) => sum + p.totalDeliveries, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600">↗ 23% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg On-Time Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(partners.reduce((sum, p) => sum + p.onTimeRate, 0) / partners.length).toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600">↗ 5% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Partners */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partners
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 3)
                  .map((partner) => (
                    <div key={partner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{partner.logo}</div>
                        <div>
                          <h3 className="font-semibold">{partner.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{partner.rating}</span>
                            <span>•</span>
                            <span>{partner.totalDeliveries.toLocaleString()} deliveries</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{partner.onTimeRate}%</p>
                        <p className="text-sm text-gray-500">On-time rate</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search partners by name or email..."
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Partners List */}
          <div className="grid gap-6">
            {filteredPartners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{partner.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">{partner.name}</h3>
                          <Badge className={getStatusColor(partner.status)}>
                            {getStatusIcon(partner.status)}
                            <span className="ml-1 capitalize">{partner.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Rating</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{partner.rating}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Deliveries</p>
                            <p className="font-semibold">{partner.totalDeliveries.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">On-Time Rate</p>
                            <p className="font-semibold text-green-600">{partner.onTimeRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Avg Delivery Time</p>
                            <p className="font-semibold">{partner.avgDeliveryTime}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Coverage Areas</p>
                            <div className="flex flex-wrap gap-2">
                              {partner.coverage.map((area) => (
                                <Badge key={area} variant="outline" className="text-xs">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Service Types</p>
                            <div className="flex flex-wrap gap-2">
                              {partner.serviceTypes.map((service) => (
                                <Badge key={service} variant="outline" className="text-xs">
                                  <Package className="h-3 w-3 mr-1" />
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Commission: {partner.commission}%</span>
                          <span>Joined: {new Date(partner.joinedDate).toLocaleDateString()}</span>
                          <span>Last Active: {partner.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance metrics charts would go here */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Delivery Performance Chart</p>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Rating Trends Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Courier Partnership Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Commission Rate (%)
                  </label>
                  <Input type="number" defaultValue="8.0" className="max-w-xs" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating Threshold
                  </label>
                  <Input type="number" defaultValue="3.5" className="max-w-xs" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-suspend partners below rating
                  </label>
                  <Input type="number" defaultValue="2.5" className="max-w-xs" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
