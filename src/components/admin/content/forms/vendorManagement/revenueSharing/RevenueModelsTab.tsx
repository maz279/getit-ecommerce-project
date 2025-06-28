
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import { RevenueSharingService } from '@/services/database/revenue/RevenueSharingService';
import { RevenueModel } from '@/types/revenue';

export const RevenueModelsTab: React.FC = () => {
  const [models, setModels] = useState<RevenueModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState<RevenueModel | null>(null);

  const [formData, setFormData] = useState({
    model_name: '',
    model_type: 'percentage' as const,
    description: '',
    base_rate: 0,
    minimum_threshold: 0,
    maximum_threshold: 0
  });

  useEffect(() => {
    loadRevenueModels();
  }, []);

  const loadRevenueModels = async () => {
    try {
      setLoading(true);
      const data = await RevenueSharingService.getRevenueModels();
      // Type cast with proper JSON parsing
      const typedModels: RevenueModel[] = data.map(model => ({
        ...model,
        tier_structure: Array.isArray(model.tier_structure) 
          ? model.tier_structure 
          : typeof model.tier_structure === 'string' 
            ? JSON.parse(model.tier_structure) 
            : [],
        category_rates: typeof model.category_rates === 'object' && model.category_rates !== null
          ? model.category_rates as Record<string, any>
          : {}
      }));
      setModels(typedModels);
    } catch (error) {
      console.error('Error loading revenue models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingModel) {
        await RevenueSharingService.updateRevenueModel(editingModel.id, {
          ...formData,
          tier_structure: [],
          category_rates: {}
        });
      } else {
        await RevenueSharingService.createRevenueModel({
          ...formData,
          tier_structure: [],
          category_rates: {},
          created_by: 'current-user-id' // TODO: Get from auth context
        });
      }
      
      setShowForm(false);
      setEditingModel(null);
      setFormData({
        model_name: '',
        model_type: 'percentage',
        description: '',
        base_rate: 0,
        minimum_threshold: 0,
        maximum_threshold: 0
      });
      loadRevenueModels();
    } catch (error) {
      console.error('Error saving revenue model:', error);
    }
  };

  const handleEdit = (model: RevenueModel) => {
    setEditingModel(model);
    setFormData({
      model_name: model.model_name,
      model_type: model.model_type,
      description: model.description || '',
      base_rate: model.base_rate,
      minimum_threshold: model.minimum_threshold || 0,
      maximum_threshold: model.maximum_threshold || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this revenue model?')) {
      try {
        await RevenueSharingService.deleteRevenueModel(id);
        loadRevenueModels();
      } catch (error) {
        console.error('Error deleting revenue model:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading revenue models...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Revenue Models</h3>
          <p className="text-gray-600">Configure and manage revenue sharing models</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Model
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingModel ? 'Edit Revenue Model' : 'Create New Revenue Model'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Model Name</Label>
                  <Input
                    value={formData.model_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, model_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model Type</Label>
                  <Select
                    value={formData.model_type}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, model_type: value }))}
                  >
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
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Base Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.base_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_rate: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Threshold</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.minimum_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_threshold: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Threshold</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.maximum_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, maximum_threshold: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingModel(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingModel ? 'Update' : 'Create'} Model
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  {model.model_name}
                </CardTitle>
                <Badge variant={model.is_active ? 'default' : 'secondary'}>
                  {model.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{model.model_type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Rate:</span>
                  <span className="font-medium">{model.base_rate}%</span>
                </div>
                {model.description && (
                  <p className="text-sm text-gray-600 mt-2">{model.description}</p>
                )}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(model)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(model.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
