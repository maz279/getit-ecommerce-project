
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, TrendingUp, TrendingDown, Minus, Edit, Trash2, Search } from 'lucide-react';
import { useDashboardKPIMetrics, useCreateKPIMetric, useUpdateKPIMetric, useDeleteKPIMetric, useDashboardSearch } from '@/hooks/useDashboardData';
import { DashboardKPIMetric } from '@/services/database/DashboardService';
import { toast } from 'sonner';

export const KPIMetricsSection: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<DashboardKPIMetric | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterTimePeriod, setFilterTimePeriod] = useState<string>('');

  const [newMetric, setNewMetric] = useState<Partial<DashboardKPIMetric>>({
    metric_name: '',
    metric_category: 'revenue',
    metric_value: 0,
    metric_unit: '',
    time_period: 'daily',
    trend_direction: 'stable'
  });

  const filters = {
    ...(filterCategory && { category: filterCategory }),
    ...(filterTimePeriod && { time_period: filterTimePeriod })
  };

  const { data: metrics = [], isLoading, refetch } = useDashboardKPIMetrics(filters);
  const { searchResults } = useDashboardSearch(searchQuery, { type: 'kpi_metrics' });
  const createMetricMutation = useCreateKPIMetric();
  const updateMetricMutation = useUpdateKPIMetric();
  const deleteMetricMutation = useDeleteKPIMetric();

  const displayMetrics = searchQuery ? searchResults : metrics;

  const handleCreateMetric = async () => {
    try {
      await createMetricMutation.mutateAsync(newMetric as DashboardKPIMetric);
      toast.success('KPI metric created successfully');
      setIsCreateDialogOpen(false);
      setNewMetric({
        metric_name: '',
        metric_category: 'revenue',
        metric_value: 0,
        metric_unit: '',
        time_period: 'daily',
        trend_direction: 'stable'
      });
    } catch (error) {
      toast.error('Failed to create KPI metric');
    }
  };

  const handleUpdateMetric = async () => {
    if (!editingMetric?.id) return;
    
    try {
      await updateMetricMutation.mutateAsync({
        id: editingMetric.id,
        updates: editingMetric
      });
      toast.success('KPI metric updated successfully');
      setEditingMetric(null);
    } catch (error) {
      toast.error('Failed to update KPI metric');
    }
  };

  const handleDeleteMetric = async (id: string) => {
    if (!confirm('Are you sure you want to delete this KPI metric?')) return;
    
    try {
      await deleteMetricMutation.mutateAsync(id);
      toast.success('KPI metric deleted successfully');
    } catch (error) {
      toast.error('Failed to delete KPI metric');
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      revenue: 'bg-green-100 text-green-800',
      users: 'bg-blue-100 text-blue-800',
      orders: 'bg-purple-100 text-purple-800',
      performance: 'bg-yellow-100 text-yellow-800',
      security: 'bg-red-100 text-red-800',
      inventory: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">KPI Metrics Management</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">KPI Metrics Management</h2>
          <p className="text-gray-600">Monitor and manage key performance indicators</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add KPI Metric
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New KPI Metric</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="metric-name">Metric Name</Label>
                <Input
                  id="metric-name"
                  value={newMetric.metric_name}
                  onChange={(e) => setNewMetric({ ...newMetric, metric_name: e.target.value })}
                  placeholder="e.g., Total Revenue"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newMetric.metric_category}
                  onValueChange={(value) => setNewMetric({ ...newMetric, metric_category: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metric-value">Value</Label>
                  <Input
                    id="metric-value"
                    type="number"
                    value={newMetric.metric_value}
                    onChange={(e) => setNewMetric({ ...newMetric, metric_value: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="metric-unit">Unit</Label>
                  <Input
                    id="metric-unit"
                    value={newMetric.metric_unit}
                    onChange={(e) => setNewMetric({ ...newMetric, metric_unit: e.target.value })}
                    placeholder="e.g., BDT, count"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time-period">Time Period</Label>
                  <Select
                    value={newMetric.time_period}
                    onValueChange={(value) => setNewMetric({ ...newMetric, time_period: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="trend">Trend</Label>
                  <Select
                    value={newMetric.trend_direction}
                    onValueChange={(value) => setNewMetric({ ...newMetric, trend_direction: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="up">Up</SelectItem>
                      <SelectItem value="down">Down</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMetric} disabled={createMetricMutation.isPending}>
                  {createMetricMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Metrics</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or description..."
              />
            </div>
            <div>
              <Label htmlFor="filter-category">Filter by Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-period">Filter by Period</Label>
              <Select value={filterTimePeriod} onValueChange={setFilterTimePeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="All Periods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Periods</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMetrics.map((metric: any) => (
          <Card key={metric.id} className="relative group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(metric.metric_category)}>
                  {metric.metric_category}
                </Badge>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingMetric(metric)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteMetric(metric.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{metric.metric_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold">
                  {metric.metric_value.toLocaleString()}
                  {metric.metric_unit && (
                    <span className="text-sm font-normal ml-1">{metric.metric_unit}</span>
                  )}
                </div>
                {getTrendIcon(metric.trend_direction)}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="capitalize">{metric.time_period}</span>
                {metric.percentage_change && (
                  <span className={`font-medium ${
                    metric.percentage_change > 0 ? 'text-green-600' : 
                    metric.percentage_change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.percentage_change > 0 ? '+' : ''}
                    {metric.percentage_change}%
                  </span>
                )}
              </div>
              {metric.recorded_date && (
                <div className="text-xs text-gray-500 mt-2">
                  Updated: {new Date(metric.recorded_date).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingMetric} onOpenChange={() => setEditingMetric(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit KPI Metric</DialogTitle>
          </DialogHeader>
          {editingMetric && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-metric-name">Metric Name</Label>
                <Input
                  id="edit-metric-name"
                  value={editingMetric.metric_name}
                  onChange={(e) => setEditingMetric({ ...editingMetric, metric_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingMetric.metric_category}
                  onValueChange={(value) => setEditingMetric({ ...editingMetric, metric_category: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-metric-value">Value</Label>
                  <Input
                    id="edit-metric-value"
                    type="number"
                    value={editingMetric.metric_value}
                    onChange={(e) => setEditingMetric({ ...editingMetric, metric_value: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-metric-unit">Unit</Label>
                  <Input
                    id="edit-metric-unit"
                    value={editingMetric.metric_unit || ''}
                    onChange={(e) => setEditingMetric({ ...editingMetric, metric_unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingMetric(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateMetric} disabled={updateMetricMutation.isPending}>
                  {updateMetricMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
