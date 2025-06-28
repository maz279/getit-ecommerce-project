
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Percent, TrendingUp, Plus, Edit, Save } from 'lucide-react';
import { RevenueSharingService } from '@/services/database/revenue/RevenueSharingService';
import { useToast } from '@/components/ui/use-toast';

interface CommissionStructure {
  id: string;
  model_name: string;
  model_type: string;
  base_rate: number;
  tier_structure: any[];
  category_rates: any;
  is_active: boolean;
}

export const CommissionStructureTab: React.FC = () => {
  const [structures, setStructures] = useState<CommissionStructure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState('tiered');
  const [loading, setLoading] = useState(true);
  const [tierConfig, setTierConfig] = useState([
    { min: 0, max: 50000, rate: 5.0 },
    { min: 50000, max: 200000, rate: 4.0 },
    { min: 200000, max: null, rate: 3.0 }
  ]);
  const [categoryConfig, setCategoryConfig] = useState({
    electronics: 3.5,
    fashion: 6.0,
    home: 4.5,
    books: 8.0
  });
  const [performanceConfig, setPerformanceConfig] = useState({
    high: 3.0,
    medium: 4.0,
    low: 5.0,
    poor: 6.0
  });

  const { toast } = useToast();

  useEffect(() => {
    loadStructures();
  }, []);

  const loadStructures = async () => {
    try {
      setLoading(true);
      const data = await RevenueSharingService.getRevenueModels();
      setStructures(data);
    } catch (error) {
      console.error('Failed to load commission structures:', error);
      toast({
        title: 'Error',
        description: 'Failed to load commission structures',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStructure = async (type: string) => {
    try {
      let structureData: any = {
        model_name: `${type.charAt(0).toUpperCase() + type.slice(1)} Commission Structure`,
        model_type: type,
        base_rate: 5.0,
        tier_structure: [],
        category_rates: {},
        created_by: '00000000-0000-0000-0000-000000000000'
      };

      switch (type) {
        case 'tiered':
          structureData.tier_structure = tierConfig;
          break;
        case 'category':
          structureData.category_rates = categoryConfig;
          break;
        case 'performance':
          structureData.category_rates = performanceConfig;
          break;
      }

      await RevenueSharingService.createRevenueModel(structureData);
      
      toast({
        title: 'Success',
        description: 'Commission structure saved successfully'
      });

      loadStructures();
    } catch (error) {
      console.error('Failed to save commission structure:', error);
      toast({
        title: 'Error',
        description: 'Failed to save commission structure',
        variant: 'destructive'
      });
    }
  };

  const updateTierConfig = (index: number, field: string, value: any) => {
    const newConfig = [...tierConfig];
    newConfig[index] = { ...newConfig[index], [field]: value };
    setTierConfig(newConfig);
  };

  const updateCategoryConfig = (category: string, rate: number) => {
    setCategoryConfig({ ...categoryConfig, [category]: rate });
  };

  const updatePerformanceConfig = (level: string, rate: number) => {
    setPerformanceConfig({ ...performanceConfig, [level]: rate });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Commission Structure Management</h3>
          <p className="text-gray-600">Configure and manage commission rates and structures</p>
        </div>
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Volume-Based Tiers
                </CardTitle>
                <Button onClick={() => handleSaveStructure('tiered')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Structure
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tierConfig.map((tier, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Tier {index + 1} Min (৳)</Label>
                    <Input
                      type="number"
                      value={tier.min}
                      onChange={(e) => updateTierConfig(index, 'min', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max (৳)</Label>
                    <Input
                      type="number"
                      value={tier.max || ''}
                      onChange={(e) => updateTierConfig(index, 'max', e.target.value ? Number(e.target.value) : null)}
                      placeholder="No limit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Commission Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={tier.rate}
                      onChange={(e) => updateTierConfig(index, 'rate', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Badge variant="outline" className="h-fit">
                      {tier.rate}% rate
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Category-Based Rates
                </CardTitle>
                <Button onClick={() => handleSaveStructure('category')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Structure
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(categoryConfig).map(([category, rate]) => (
                  <div key={category} className="space-y-2">
                    <Label className="capitalize">{category}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={rate}
                        onChange={(e) => updateCategoryConfig(category, Number(e.target.value))}
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Percent className="h-5 w-5 mr-2" />
                  Performance-Based Structure
                </CardTitle>
                <Button onClick={() => handleSaveStructure('performance')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Structure
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rating ≥ 4.5 (High Performance)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={performanceConfig.high}
                      onChange={(e) => updatePerformanceConfig('high', Number(e.target.value))}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rating 4.0 - 4.4 (Medium Performance)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={performanceConfig.medium}
                      onChange={(e) => updatePerformanceConfig('medium', Number(e.target.value))}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rating 3.5 - 3.9 (Low Performance)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={performanceConfig.low}
                      onChange={(e) => updatePerformanceConfig('low', Number(e.target.value))}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rating &lt; 3.5 (Poor Performance)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={performanceConfig.poor}
                      onChange={(e) => updatePerformanceConfig('poor', Number(e.target.value))}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Active Structures Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Commission Structures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {structures
              .filter(s => s.is_active)
              .map((structure) => (
                <Card key={structure.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{structure.model_name}</CardTitle>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Type: {structure.model_type}</p>
                    <p className="text-lg font-semibold text-blue-600">{structure.base_rate}%</p>
                  </CardContent>
                </Card>
              ))}
          </div>
          
          {structures.filter(s => s.is_active).length === 0 && (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Structures</h3>
              <p className="text-gray-500">Create and save commission structures to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
