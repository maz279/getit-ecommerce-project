
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, TrendingUp, Users, DollarSign } from 'lucide-react';

export const RevenueModelsTab: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);

  const revenueModels = [
    {
      id: '1',
      name: 'Electronics Premium',
      type: 'tiered_commission',
      category: 'Electronics',
      baseRate: 8.5,
      maxRate: 15.0,
      vendorCount: 156,
      monthlyRevenue: 2400000,
      status: 'active',
      created: '2024-01-15'
    },
    {
      id: '2',
      name: 'Fashion Standard',
      type: 'flat_commission',
      category: 'Fashion',
      baseRate: 12.0,
      maxRate: 12.0,
      vendorCount: 243,
      monthlyRevenue: 1800000,
      status: 'active',
      created: '2024-02-10'
    },
    {
      id: '3',
      name: 'Home & Garden',
      type: 'performance_based',
      category: 'Home & Garden',
      baseRate: 10.0,
      maxRate: 20.0,
      vendorCount: 89,
      monthlyRevenue: 950000,
      status: 'active',
      created: '2024-01-20'
    }
  ];

  const getModelTypeBadge = (type: string) => {
    const colors = {
      tiered_commission: 'bg-blue-100 text-blue-800',
      flat_commission: 'bg-green-100 text-green-800',
      performance_based: 'bg-purple-100 text-purple-800',
      hybrid: 'bg-orange-100 text-orange-800'
    };
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const RevenueModelForm = () => (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="modelName">Model Name</Label>
          <Input
            id="modelName"
            placeholder="e.g., Electronics Premium"
            defaultValue={editingModel?.name || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelType">Revenue Model Type</Label>
          <Select defaultValue={editingModel?.type || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat_commission">Flat Commission</SelectItem>
              <SelectItem value="tiered_commission">Tiered Commission</SelectItem>
              <SelectItem value="performance_based">Performance Based</SelectItem>
              <SelectItem value="hybrid">Hybrid Model</SelectItem>
              <SelectItem value="subscription">Subscription + Commission</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select defaultValue={editingModel?.category || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="home_garden">Home & Garden</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="sports">Sports & Outdoor</SelectItem>
              <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="baseRate">Base Rate (%)</Label>
          <Input
            id="baseRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="8.5"
            defaultValue={editingModel?.baseRate || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxRate">Maximum Rate (%)</Label>
          <Input
            id="maxRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="15.0"
            defaultValue={editingModel?.maxRate || ''}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Model Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the revenue sharing model..."
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Performance Thresholds</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tier1">Tier 1 (Sales Volume)</Label>
            <Input
              id="tier1"
              placeholder="0-100,000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier2">Tier 2 (Sales Volume)</Label>
            <Input
              id="tier2"
              placeholder="100,001-500,000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier3">Tier 3 (Sales Volume)</Label>
            <Input
              id="tier3"
              placeholder="500,001+"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="autoEnroll" />
        <Label htmlFor="autoEnroll">Auto-enroll eligible vendors</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
        <Button type="submit">
          {editingModel ? 'Update Model' : 'Create Model'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Sharing Models</CardTitle>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Revenue Model
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingModel ? 'Edit Revenue Model' : 'Create New Revenue Model'}
                  </DialogTitle>
                </DialogHeader>
                <RevenueModelForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rate Range</TableHead>
                <TableHead>Vendors</TableHead>
                <TableHead>Monthly Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm text-gray-500">
                      Created: {model.created}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getModelTypeBadge(model.type)}
                  </TableCell>
                  <TableCell>{model.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>{model.baseRate}%</span>
                      {model.maxRate !== model.baseRate && (
                        <>
                          <span>-</span>
                          <span>{model.maxRate}%</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{model.vendorCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>৳{(model.monthlyRevenue / 1000000).toFixed(1)}M</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={model.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {model.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingModel(model);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
