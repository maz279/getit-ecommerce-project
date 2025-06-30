
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Package, MapPin, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const CourierPartnersContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const courierPartners = [
    {
      name: 'Pathao',
      status: 'Active',
      coverage: '64 Districts',
      avgDeliveryTime: '24-48 hours',
      successRate: '94%',
      totalDeliveries: 12500,
      color: 'bg-red-500'
    },
    {
      name: 'Paperfly',
      status: 'Active',
      coverage: '64 Districts',
      avgDeliveryTime: '48-72 hours',
      successRate: '92%',
      totalDeliveries: 8750,
      color: 'bg-blue-500'
    },
    {
      name: 'Sundarban',
      status: 'Active',
      coverage: '50 Districts',
      avgDeliveryTime: '24-48 hours',
      successRate: '89%',
      totalDeliveries: 6200,
      color: 'bg-green-500'
    },
    {
      name: 'RedX',
      status: 'Active',
      coverage: '64 Districts',
      avgDeliveryTime: '24-48 hours',
      successRate: '91%',
      totalDeliveries: 9800,
      color: 'bg-red-600'
    },
    {
      name: 'eCourier',
      status: 'Active',
      coverage: '64 Districts',
      avgDeliveryTime: '48-72 hours',
      successRate: '88%',
      totalDeliveries: 5400,
      color: 'bg-purple-500'
    }
  ];

  const statsCards = [
    {
      title: 'Total Partners',
      value: '5',
      change: '+0%',
      icon: Truck,
      color: 'text-blue-600'
    },
    {
      title: 'Active Deliveries',
      value: '1,247',
      change: '+12%',
      icon: Package,
      color: 'text-green-600'
    },
    {
      title: 'Coverage Areas',
      value: '64',
      change: '+0%',
      icon: MapPin,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Success Rate',
      value: '91%',
      change: '+2%',
      icon: CheckCircle,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courier Partners</h1>
          <p className="text-gray-600 mt-2">Manage delivery partners and logistics operations</p>
        </div>
        <Button>
          <Package className="w-4 h-4 mr-2" />
          Add New Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Courier Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courierPartners.map((partner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${partner.color}`}></div>
                      <div>
                        <h3 className="font-semibold">{partner.name}</h3>
                        <p className="text-sm text-gray-600">{partner.coverage} coverage</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Delivery Time</p>
                        <p className="font-medium">{partner.avgDeliveryTime}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <p className="font-medium">{partner.successRate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Deliveries</p>
                        <p className="font-medium">{partner.totalDeliveries.toLocaleString()}</p>
                      </div>
                      <Badge variant={partner.status === 'Active' ? 'default' : 'secondary'}>
                        {partner.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Detailed performance analytics for each courier partner.</p>
              <div className="space-y-4">
                {courierPartners.map((partner, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{partner.name}</h4>
                      <Badge variant="outline">{partner.successRate} Success Rate</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Coverage: </span>
                        <span className="font-medium">{partner.coverage}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Time: </span>
                        <span className="font-medium">{partner.avgDeliveryTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Orders: </span>
                        <span className="font-medium">{partner.totalDeliveries.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage API integrations and webhook configurations for courier partners.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive analytics and reporting for courier partner performance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
