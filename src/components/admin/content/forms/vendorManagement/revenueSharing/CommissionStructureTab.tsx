
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Percent, TrendingUp, Plus } from 'lucide-react';

export const CommissionStructureTab: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState('tiered');

  const commissionStructures = [
    {
      id: 'flat',
      name: 'Flat Rate',
      description: 'Fixed percentage across all transactions',
      rate: '5.0%',
      status: 'active'
    },
    {
      id: 'tiered',
      name: 'Tiered Structure',
      description: 'Variable rates based on volume tiers',
      rate: '3.0% - 7.0%',
      status: 'active'
    },
    {
      id: 'category',
      name: 'Category-Based',
      description: 'Different rates for different product categories',
      rate: '2.5% - 8.0%',
      status: 'draft'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Commission Structure Management</h3>
          <p className="text-gray-600">Configure and manage commission rates and structures</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Structure
        </Button>
      </div>

      <Tabs value={selectedStructure} onValueChange={setSelectedStructure} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tiered">Tiered Structure</TabsTrigger>
          <TabsTrigger value="category">Category-Based</TabsTrigger>
          <TabsTrigger value="performance">Performance-Based</TabsTrigger>
        </TabsList>

        <TabsContent value="tiered" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Volume-Based Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tier 1 (৳0 - ৳50K)</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="5.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tier 2 (৳50K - ৳200K)</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="4.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tier 3 (৳200K+)</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="3.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Category-Based Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Electronics</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="3.5" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fashion</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="6.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Home & Garden</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="4.5" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Books & Media</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="8.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                Performance-Based Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rating >= 4.5</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="3.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rating 4.0 - 4.4</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="4.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rating 3.5 - 3.9</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="5.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rating < 3.5</Label>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="6.0" />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {commissionStructures.map((structure) => (
          <Card key={structure.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{structure.name}</CardTitle>
                <Badge variant={structure.status === 'active' ? 'default' : 'secondary'}>
                  {structure.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{structure.description}</p>
              <p className="text-lg font-semibold text-blue-600">{structure.rate}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
