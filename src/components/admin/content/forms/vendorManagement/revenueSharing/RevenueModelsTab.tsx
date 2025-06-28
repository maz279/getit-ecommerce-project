
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Settings, TrendingUp, Percent } from 'lucide-react';
import { RevenueSharingService } from '@/services/database/revenue/RevenueSharingService';
import { useToast } from '@/components/ui/use-toast';

interface RevenueModel {
  id: string;
  model_name: string;
  model_type: string;
  description?: string;
  base_rate: number;
  tier_structure: any[];
  minimum_threshold: number;
  maximum_threshold?: number;
  category_rates: any;
  is_active: boolean;
  effective_from: string;
  effective_to?: string;
  created_at: string;
}

export const RevenueModelsTab: React.FC = () => {
  const [models, setModels] = useState<RevenueModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<RevenueModel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    model_name: '',
    model_type: 'percentage',
    description: '',
    base_rate: 0,
    minimum_threshold: 0,
    maximum_threshold: '',
    tier_structure: '[]',
    category_rates: '{}',
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    loadRevenueModels();
  }, []);

  const loadRevenueModels = async () => {
    try {
      setLoading(true);
      const data = await RevenueSharingService.getRevenueModels();
      setModels(data);
    } catch (error) {
      console.error('Failed to load revenue models:', error);
      toast({
        title: 'Error',
        description: 'Failed to load revenue models',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const modelData = {
        ...formData,
        base_rate: Number(formData.base_rate),
        minimum_threshold: Number(formData.minimum_threshold),
        maximum_threshold: formData.maximum_threshold ? Number(formData.maximum_threshold) : null,
        tier_structure: JSON.parse(formData.tier_structure || '[]'),
        category_rates: JSON.parse(formData.category_rates || '{}'),
        created_by: '00000000-0000-0000-0000-000000000000' // Replace with actual user ID
      };

      if (selectedModel) {
        await RevenueSharingService.updateRevenueModel(selectedModel.id, modelData);
        toast({
          title: 'Success',
          description: 'Revenue model updated successfully'
        });
      } else {
        await RevenueSharingService.createRevenueModel(modelData);
        toast({
          title: 'Success',
          description: 'Revenue model created successfully'
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadRevenueModels();
    } catch (error) {
      console.error('Failed to save revenue model:', error);
      toast({
        title: 'Error',
        description: 'Failed to save revenue model',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (model: RevenueModel) => {
    setSelectedModel(model);
    setFormData({
      model_name: model.model_name,
      model_type: model.model_type,
      description: model.description || '',
      base_rate: model.base_rate,
      minimum_threshold: model.minimum_threshold,
      maximum_threshold: model.maximum_threshold?.toString() || '',
      tier_structure: JSON.stringify(model.tier_structure, null, 2),
      category_rates: JSON.stringify(model.category_rates, null, 2),
      effective_from: model.effective_from,
      effective_to: model.effective_to || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this revenue model?')) return;
    
    try {
      await RevenueSharingService.deleteRevenueModel(id);
      toast({
        title: 'Success',
        description: 'Revenue model deleted successfully'
      });
      loadRevenueModels();
    } catch (error) {
      console.error('Failed to delete revenue model:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete revenue model',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setSelectedModel(null);
    setFormData({
      model_name: '',
      model_type: 'percentage',
      description: '',
      base_rate: 0,
      minimum_threshold: 0,
      maximum_threshold: '',
      tier_structure: '[]',
      category_rates: '{}',
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: ''
    });
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
          <h3 className="text-lg font-semibold">Revenue Models Management</h3>
          <p className="text-gray-600">Configure and manage revenue calculation models</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedModel ? 'Edit Revenue Model' : 'Create Revenue Model'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model_name">Model Name *</Label>
                  <Input
                    id="model_name"
                    value={formData.model_name}
                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                    required
                    placeholder="e.g., Tiered Commission Model"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model_type">Model Type *</Label>
                  <Select value={formData.model_type} onValueChange={(value) => setFormData({ ...formData, model_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="tiered">Tiered</SelectItem>
                      <SelectItem value="flat_fee">Flat Fee</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the revenue model..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_rate">Base Rate (%) *</Label>
                  <Input
                    id="base_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.base_rate}
                    onChange={(e) => setFormData({ ...formData, base_rate: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_threshold">Min Threshold (৳) *</Label>
                  <Input
                    id="minimum_threshold"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minimum_threshold}
                    onChange={(e) => setFormData({ ...formData, minimum_threshold: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximum_threshold">Max Threshold (৳)</Label>
                  <Input
                    id="maximum_threshold"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maximum_threshold}
                    onChange={(e) => setFormData({ ...formData, maximum_threshold: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effective_from">Effective From *</Label>
                  <Input
                    id="effective_from"
                    type="date"
                    value={formData.effective_from}
                    onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effective_to">Effective To</Label>
                  <Input
                    id="effective_to"
                    type="date"
                    value={formData.effective_to}
                    onChange={(e) => setFormData({ ...formData, effective_to: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <Tabs defaultValue="tier_structure" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tier_structure">Tier Structure</TabsTrigger>
                  <TabsTrigger value="category_rates">Category Rates</TabsTrigger>
                </TabsList>
                <TabsContent value="tier_structure" className="space-y-2">
                  <Label htmlFor="tier_structure">Tier Structure (JSON)</Label>
                  <Textarea
                    id="tier_structure"
                    value={formData.tier_structure}
                    onChange={(e) => setFormData({ ...formData, tier_structure: e.target.value })}
                    placeholder='[{"min": 0, "max": 50000, "rate": 5.0}, {"min": 50000, "max": 200000, "rate": 4.0}]'
                    rows={4}
                    className="font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="category_rates" className="space-y-2">
                  <Label htmlFor="category_rates">Category Rates (JSON)</Label>
                  <Textarea
                    id="category_rates"
                    value={formData.category_rates}
                    onChange={(e) => setFormData({ ...formData, category_rates: e.target.value })}
                    placeholder='{"electronics": 3.5, "fashion": 6.0, "home": 4.5}'
                    rows={4}
                    className="font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedModel ? 'Update' : 'Create'} Model
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{model.model_name}</CardTitle>
                <div className="flex space-x-1">
                  <Badge variant={model.is_active ? 'default' : 'secondary'}>
                    {model.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">{model.model_type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base Rate:</span>
                <span className="font-semibold text-blue-600">{model.base_rate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Min Threshold:</span>
                <span className="font-medium">৳{model.minimum_threshold.toLocaleString()}</span>
              </div>
              {model.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{model.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Effective: {new Date(model.effective_from).toLocaleDateString()}
                </span>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(model)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(model.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {models.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Revenue Models Found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first revenue model.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Model
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
