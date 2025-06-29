import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Truck, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  TrendingUp, 
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

export const CourierPartnersContent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Enhanced domestic partners data
  const domesticPartners = [
    {
      id: 1,
      name: 'Sundarban Courier',
      logo: '🚚',
      status: 'Active',
      rating: 4.8,
      coverage: '64 Districts',
      deliveryTime: '1-2 Days',
      successRate: '98.5%',
      phone: '+880-2-9876543',
      email: 'contact@sundarban.com',
      commission: '2.5%',
      totalOrders: 45670,
      monthlyOrders: 3450
    },
    {
      id: 2,
      name: 'SA Paribahan',
      logo: '📦',
      status: 'Active',
      rating: 4.6,
      coverage: '60 Districts',
      deliveryTime: '1-3 Days',
      successRate: '97.2%',
      phone: '+880-2-8765432',
      email: 'info@saparibahan.com',
      commission: '2.8%',
      totalOrders: 38900,
      monthlyOrders: 2890
    },
    {
      id: 3,
      name: 'Pathao Courier',
      logo: '🏍️',
      status: 'Active',
      rating: 4.7,
      coverage: '8 Major Cities',
      deliveryTime: 'Same Day',
      successRate: '96.8%',
      phone: '+880-9606-111-333',
      email: 'courier@pathao.com',
      commission: '3.2%',
      totalOrders: 52340,
      monthlyOrders: 4120
    },
    {
      id: 4,
      name: 'RedX',
      logo: '🔴',
      status: 'Active',
      rating: 4.5,
      coverage: '64 Districts',
      deliveryTime: '1-2 Days',
      successRate: '95.9%',
      phone: '+880-9666-773388',
      email: 'support@redx.com.bd',
      commission: '2.9%',
      totalOrders: 29800,
      monthlyOrders: 2350
    },
    {
      id: 5,
      name: 'eCourier',
      logo: '📱',
      status: 'Active',
      rating: 4.4,
      coverage: '64 Districts',
      deliveryTime: '1-3 Days',
      successRate: '94.7%',
      phone: '+880-9666-904050',
      email: 'hello@ecourier.com.bd',
      commission: '3.0%',
      totalOrders: 31200,
      monthlyOrders: 2680
    },
    {
      id: 6,
      name: 'Steadfast Courier',
      logo: '⚡',
      status: 'Active',
      rating: 4.3,
      coverage: '64 Districts',
      deliveryTime: '1-2 Days',
      successRate: '93.8%',
      phone: '+880-2-48958395',
      email: 'info@steadfast.com.bd',
      commission: '2.7%',
      totalOrders: 18900,
      monthlyOrders: 1560
    },
    {
      id: 7,
      name: 'Paper Fly',
      logo: '✈️',
      status: 'Active',
      rating: 4.2,
      coverage: '50 Districts',
      deliveryTime: '2-3 Days',
      successRate: '92.5%',
      phone: '+880-9666-772200',
      email: 'support@paperfly.com.bd',
      commission: '3.1%',
      totalOrders: 15600,
      monthlyOrders: 1290
    },
    {
      id: 8,
      name: 'Continental Courier',
      logo: '🌍',
      status: 'Pending',
      rating: 4.1,
      coverage: '45 Districts',
      deliveryTime: '2-4 Days',
      successRate: '91.2%',
      phone: '+880-2-9112233',
      email: 'info@continental.com.bd',
      commission: '2.6%',
      totalOrders: 8900,
      monthlyOrders: 890
    }
  ];

  // Enhanced international partners data
  const internationalPartners = [
    {
      id: 1,
      name: 'DHL Express',
      logo: '🟡',
      status: 'Active',
      rating: 4.9,
      coverage: '220+ Countries',
      deliveryTime: '2-5 Days',
      successRate: '99.2%',
      phone: '+880-2-8836601',
      email: 'bangladesh@dhl.com',
      commission: '8.5%',
      totalOrders: 12450,
      monthlyOrders: 1120,
      countries: ['USA', 'UK', 'Germany', 'China', 'UAE']
    },
    {
      id: 2,
      name: 'FedEx',
      logo: '🟣',
      status: 'Active',
      rating: 4.8,
      coverage: '220+ Countries',
      deliveryTime: '3-7 Days',
      successRate: '98.7%',
      phone: '+880-2-8836688',
      email: 'bangladesh@fedex.com',
      commission: '8.2%',
      totalOrders: 9870,
      monthlyOrders: 890,
      countries: ['USA', 'Canada', 'Australia', 'Japan', 'Singapore']
    },
    {
      id: 3,
      name: 'UPS',
      logo: '🤎',
      status: 'Active',
      rating: 4.7,
      coverage: '200+ Countries',
      deliveryTime: '3-6 Days',
      successRate: '98.3%',
      phone: '+880-2-8836700',
      email: 'bangladesh@ups.com',
      commission: '8.0%',
      totalOrders: 7650,
      monthlyOrders: 650,
      countries: ['USA', 'Europe', 'Mexico', 'Brazil', 'India']
    },
    {
      id: 4,
      name: 'Aramex',
      logo: '🔵',
      status: 'Active',
      rating: 4.6,
      coverage: '240+ Countries',
      deliveryTime: '4-8 Days',
      successRate: '97.9%',
      phone: '+880-2-8836750',
      email: 'bangladesh@aramex.com',
      commission: '7.5%',
      totalOrders: 5430,
      monthlyOrders: 480,
      countries: ['UAE', 'Saudi Arabia', 'Egypt', 'Jordan', 'Lebanon']
    },
    {
      id: 5,
      name: 'TNT Express',
      logo: '🟠',
      status: 'Active',
      rating: 4.5,
      coverage: '200+ Countries',
      deliveryTime: '3-7 Days',
      successRate: '97.5%',
      phone: '+880-2-8836800',
      email: 'bangladesh@tnt.com',
      commission: '7.8%',
      totalOrders: 4320,
      monthlyOrders: 390,
      countries: ['Netherlands', 'Germany', 'France', 'Italy', 'Spain']
    },
    {
      id: 6,
      name: 'China Post (EMS)',
      logo: '🇨🇳',
      status: 'Active',
      rating: 4.3,
      coverage: '190+ Countries',
      deliveryTime: '7-15 Days',
      successRate: '96.8%',
      phone: '+880-2-8836850',
      email: 'bangladesh@chinapost.com',
      commission: '6.5%',
      totalOrders: 8900,
      monthlyOrders: 1200,
      countries: ['China', 'Hong Kong', 'Taiwan', 'Macau', 'Mongolia']
    },
    {
      id: 7,
      name: 'Singapore Post',
      logo: '🇸🇬',
      status: 'Active',
      rating: 4.4,
      coverage: '180+ Countries',
      deliveryTime: '5-10 Days',
      successRate: '97.1%',
      phone: '+880-2-8836900',
      email: 'bangladesh@singpost.com',
      commission: '7.0%',
      totalOrders: 3210,
      monthlyOrders: 280,
      countries: ['Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Philippines']
    },
    {
      id: 8,
      name: 'India Post',
      logo: '🇮🇳',
      status: 'Active',
      rating: 4.2,
      coverage: '150+ Countries',
      deliveryTime: '10-20 Days',
      successRate: '95.5%',
      phone: '+880-2-8836950',
      email: 'bangladesh@indiapost.com',
      commission: '5.8%',
      totalOrders: 6540,
      monthlyOrders: 890,
      countries: ['India', 'Nepal', 'Bhutan', 'Sri Lanka', 'Maldives']
    },
    {
      id: 9,
      name: 'Royal Mail (UK)',
      logo: '🇬🇧',
      status: 'Pending',
      rating: 4.1,
      coverage: '185+ Countries',
      deliveryTime: '7-14 Days',
      successRate: '94.9%',
      phone: '+880-2-8837000',
      email: 'bangladesh@royalmail.com',
      commission: '7.2%',
      totalOrders: 2180,
      monthlyOrders: 190,
      countries: ['UK', 'Ireland', 'Scotland', 'Wales', 'Northern Ireland']
    },
    {
      id: 10,
      name: 'USPS',
      logo: '🇺🇸',
      status: 'Inactive',
      rating: 4.0,
      coverage: '190+ Countries',
      deliveryTime: '10-21 Days',
      successRate: '93.2%',
      phone: '+880-2-8837100',
      email: 'bangladesh@usps.com',
      commission: '6.8%',
      totalOrders: 1890,
      monthlyOrders: 120,
      countries: ['USA', 'Puerto Rico', 'Guam', 'US Virgin Islands', 'American Samoa']
    }
  ];

  const overviewStats = [
    { title: 'Total Partners', value: '18', change: '+2', icon: Truck, color: 'bg-blue-500' },
    { title: 'Active Partnerships', value: '15', change: '+1', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Countries Covered', value: '240+', change: '+15', icon: Globe, color: 'bg-purple-500' },
    { title: 'Monthly Deliveries', value: '18.2K', change: '+12%', icon: Package, color: 'bg-orange-500' }
  ];

  const renderPartnerCard = (partner: any, isDomestic: boolean = true) => (
    <Card key={partner.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{partner.logo}</div>
            <div>
              <h3 className="font-semibold text-lg">{partner.name}</h3>
              <Badge variant={partner.status === 'Active' ? 'default' : partner.status === 'Pending' ? 'secondary' : 'destructive'}>
                {partner.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{partner.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Coverage</p>
            <p className="font-medium">{partner.coverage}</p>
          </div>
          <div>
            <p className="text-gray-600">Delivery Time</p>
            <p className="font-medium">{partner.deliveryTime}</p>
          </div>
          <div>
            <p className="text-gray-600">Success Rate</p>
            <p className="font-medium text-green-600">{partner.successRate}</p>
          </div>
          <div>
            <p className="text-gray-600">Commission</p>
            <p className="font-medium">{partner.commission}</p>
          </div>
        </div>
        
        {!isDomestic && partner.countries && (
          <div>
            <p className="text-gray-600 text-sm mb-1">Major Countries</p>
            <div className="flex flex-wrap gap-1">
              {partner.countries.slice(0, 3).map((country: string) => (
                <Badge key={country} variant="outline" className="text-xs">{country}</Badge>
              ))}
              {partner.countries.length > 3 && (
                <Badge variant="outline" className="text-xs">+{partner.countries.length - 3}</Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-600">
            Monthly: <span className="font-medium">{partner.monthlyOrders.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Phone className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courier Partners</h1>
          <p className="text-gray-600 mt-1">Manage domestic and international delivery partnerships</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="domestic">Domestic Partners</TabsTrigger>
          <TabsTrigger value="international">International Partners</TabsTrigger>
          <TabsTrigger value="add-partner">Add Partner</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {overviewStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...domesticPartners, ...internationalPartners]
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
                    .map((partner, index) => (
                      <div key={partner.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{partner.logo}</span>
                          <div>
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-sm text-gray-600">{partner.successRate} success rate</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{partner.rating}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Deliveries</span>
                    <span className="font-bold">18,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <span className="font-bold text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Delivery Time</span>
                    <span className="font-bold">2.3 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Commission</span>
                    <span className="font-bold">৳1,24,580</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="domestic" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Domestic Partners</h2>
            <div className="flex gap-2">
              <Input placeholder="Search partners..." className="w-64" />
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domesticPartners.map(partner => renderPartnerCard(partner, true))}
          </div>
        </TabsContent>

        <TabsContent value="international" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">International Partners</h2>
            <div className="flex gap-2">
              <Input placeholder="Search partners..." className="w-64" />
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalPartners.map(partner => renderPartnerCard(partner, false))}
          </div>
        </TabsContent>

        <TabsContent value="add-partner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Courier Partner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partnerName">Partner Name</Label>
                  <Input id="partnerName" placeholder="Enter partner name" />
                </div>
                <div>
                  <Label htmlFor="partnerType">Partner Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestic">Domestic</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" placeholder="+880-" />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" placeholder="contact@partner.com" />
                </div>
                <div>
                  <Label htmlFor="coverage">Coverage Area</Label>
                  <Input id="coverage" placeholder="e.g., 64 Districts" />
                </div>
                <div>
                  <Label htmlFor="commission">Commission Rate (%)</Label>
                  <Input id="commission" type="number" placeholder="2.5" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button>Add Partner</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
