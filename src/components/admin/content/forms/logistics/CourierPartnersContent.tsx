
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  Package, 
  Globe, 
  MapPin, 
  Star, 
  Plus, 
  Building, 
  Phone, 
  Mail,
  Clock,
  Shield,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface CourierPartner {
  id: string;
  name: string;
  type: 'domestic' | 'international';
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  coverage: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  services: string[];
  performance: {
    onTimeDelivery: number;
    customerSatisfaction: number;
    totalDeliveries: number;
  };
}

const mockCouriers: CourierPartner[] = [
  {
    id: '1',
    name: 'Pathao Courier',
    type: 'domestic',
    status: 'active',
    rating: 4.5,
    coverage: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'],
    contact: {
      phone: '+880-1711-123456',
      email: 'partner@pathao.com',
      address: 'Gulshan, Dhaka'
    },
    services: ['Same Day', 'Next Day', 'Cash on Delivery'],
    performance: {
      onTimeDelivery: 92,
      customerSatisfaction: 4.3,
      totalDeliveries: 15420
    }
  },
  {
    id: '2',
    name: 'DHL Express Bangladesh',
    type: 'international',
    status: 'active',
    rating: 4.8,
    coverage: ['Worldwide', 'Express Import', 'Export Services'],
    contact: {
      phone: '+880-2-8833066',
      email: 'bd.customer@dhl.com',
      address: 'Banani, Dhaka'
    },
    services: ['International Express', 'Document Delivery', 'Customs Clearance'],
    performance: {
      onTimeDelivery: 96,
      customerSatisfaction: 4.7,
      totalDeliveries: 8950
    }
  }
];

export const CourierPartnersContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'domestic',
    phone: '',
    email: '',
    address: '',
    services: '',
    coverage: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New courier partner:', formData);
    setShowAddForm(false);
    setFormData({
      name: '',
      type: 'domestic',
      phone: '',
      email: '',
      address: '',
      services: '',
      coverage: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courier Partners</h1>
          <p className="text-gray-600 mt-1">
            Manage domestic and international courier partners for Bangladesh market
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs opacity-80">18 Domestic, 6 International</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">20</div>
            <p className="text-xs text-muted-foreground">83% availability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4.3</div>
            <p className="text-xs text-muted-foreground">Based on 2.5K reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">45.2K</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="domestic">Domestic Partners</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Coverage Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Dhaka Division</span>
                    <Badge variant="secondary">18 Partners</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chittagong Division</span>
                    <Badge variant="secondary">12 Partners</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sylhet Division</span>
                    <Badge variant="secondary">8 Partners</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>International</span>
                    <Badge className="bg-green-100 text-green-800">6 Partners</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>On-Time Delivery</span>
                    <span className="font-semibold text-green-600">89.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <span className="font-semibold text-blue-600">4.3/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <span className="font-semibold text-purple-600">2.4 hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Issue Resolution</span>
                    <span className="font-semibold text-orange-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="domestic" className="space-y-4">
          <div className="space-y-4">
            {mockCouriers
              .filter(courier => courier.type === 'domestic')
              .map((courier) => (
                <Card key={courier.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{courier.name}</h3>
                          <p className="text-sm text-gray-600">{courier.contact.address}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{courier.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{courier.performance.totalDeliveries.toLocaleString()} deliveries</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={
                            courier.status === 'active' ? 'bg-green-100 text-green-800' :
                            courier.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {courier.status}
                        </Badge>
                        <div className="mt-2 space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Coverage Areas</p>
                          <p className="text-sm text-gray-600">{courier.coverage.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Services</p>
                          <p className="text-sm text-gray-600">{courier.services.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Contact</p>
                          <p className="text-sm text-gray-600">{courier.contact.phone}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="international" className="space-y-4">
          <div className="space-y-4">
            {mockCouriers
              .filter(courier => courier.type === 'international')
              .map((courier) => (
                <Card key={courier.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Globe className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{courier.name}</h3>
                          <p className="text-sm text-gray-600">{courier.contact.address}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{courier.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Verified International</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800">
                          International
                        </Badge>
                        <div className="mt-2 space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Specialization</p>
                          <p className="text-sm text-gray-600">{courier.coverage.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Services</p>
                          <p className="text-sm text-gray-600">{courier.services.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Performance</p>
                          <p className="text-sm text-gray-600">{courier.performance.onTimeDelivery}% On-time</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCouriers.map((courier, index) => (
                    <div key={courier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{courier.name}</p>
                          <p className="text-sm text-gray-600">{courier.performance.onTimeDelivery}% On-time</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{courier.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Delivery Delay - Chittagong</p>
                      <p className="text-sm text-gray-600">Weather conditions affecting deliveries</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">New Partner Onboarded</p>
                      <p className="text-sm text-gray-600">RedX Express joined the network</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Partner Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Courier Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Partner Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="domestic">Domestic</option>
                      <option value="international">International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+880-1711-123456"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="partner@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Complete address with area and city"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="services">Services Offered</Label>
                  <Textarea
                    id="services"
                    value={formData.services}
                    onChange={(e) => handleInputChange('services', e.target.value)}
                    placeholder="Same Day Delivery, Cash on Delivery, Express Service, etc."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="coverage">Coverage Areas</Label>
                  <Textarea
                    id="coverage"
                    value={formData.coverage}
                    onChange={(e) => handleInputChange('coverage', e.target.value)}
                    placeholder="Dhaka, Chittagong, Sylhet, etc."
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Partner
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
