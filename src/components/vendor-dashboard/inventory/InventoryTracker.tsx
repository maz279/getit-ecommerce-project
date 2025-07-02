import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Package, Plus, Minus, Search, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  product_id: string;
  sku: string;
  current_stock: number;
  reserved_stock: number;
  minimum_stock_level: number;
  maximum_stock_level: number;
  reorder_point: number;
  unit_cost: number;
  selling_price: number;
  last_restocked_at: string;
  products: {
    name: string;
    description: string;
    image_url: string;
  };
}

const InventoryTracker: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    quantity: '',
    type: 'in' as 'in' | 'out',
    reason: ''
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('vendor-product-management', {
        body: { action: 'inventory' }
      });

      if (error) throw error;
      setInventory(data?.inventory || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStockMovements = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('vendor-product-management', {
        body: { action: 'stock-movements' }
      });

      if (error) throw error;
      setMovements(data?.movements || []);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchStockMovements();
  }, []);

  const handleStockAdjustment = async () => {
    if (!selectedItem || !adjustmentData.quantity || !adjustmentData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('vendor-product-management', {
        body: {
          action: 'update-stock',
          productId: selectedItem.product_id,
          quantity: parseInt(adjustmentData.quantity),
          movementType: adjustmentData.type,
          reason: adjustmentData.reason
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock updated successfully",
      });

      // Reset form and refresh data
      setAdjustmentData({ quantity: '', type: 'in', reason: '' });
      setSelectedItem(null);
      fetchInventory();
      fetchStockMovements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock === 0) return { status: 'out-of-stock', color: 'destructive', label: 'Out of Stock' };
    if (item.current_stock <= item.reorder_point) return { status: 'low-stock', color: 'destructive', label: 'Low Stock' };
    if (item.current_stock <= item.minimum_stock_level) return { status: 'warning', color: 'secondary', label: 'Warning' };
    return { status: 'in-stock', color: 'default', label: 'In Stock' };
  };

  const filteredInventory = inventory.filter(item =>
    item.products.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.current_stock <= item.reorder_point);
  const outOfStockItems = inventory.filter(item => item.current_stock === 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Tracker</h2>
          <p className="text-muted-foreground">Real-time stock management and monitoring</p>
        </div>
        <Button onClick={fetchInventory} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Inventory Alerts</p>
                <p className="text-sm text-red-600">
                  {outOfStockItems.length} out of stock, {lowStockItems.length} low stock items need attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-orange-500">{lowStockItems.length}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-500">{outOfStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ৳{inventory.reduce((sum, item) => sum + (item.current_stock * item.unit_cost), 0).toFixed(0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Monitor and manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item);
              
              return (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.products.image_url || '/placeholder-product.jpg'}
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">{item.products.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <Badge variant={stockStatus.color as any}>{stockStatus.label}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium">{item.current_stock}</p>
                      <p className="text-xs text-muted-foreground">Current</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.reserved_stock}</p>
                      <p className="text-xs text-muted-foreground">Reserved</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.reorder_point}</p>
                      <p className="text-xs text-muted-foreground">Reorder</p>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        Adjust Stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adjust Stock - {item.products.name}</DialogTitle>
                        <DialogDescription>
                          Update inventory levels and track stock movements
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="current-stock">Current Stock</Label>
                            <Input value={item.current_stock} disabled />
                          </div>
                          <div>
                            <Label htmlFor="reorder-point">Reorder Point</Label>
                            <Input value={item.reorder_point} disabled />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="adjustment-type">Adjustment Type</Label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={adjustmentData.type}
                              onChange={(e) => setAdjustmentData(prev => ({ ...prev, type: e.target.value as 'in' | 'out' }))}
                            >
                              <option value="in">Stock In (+)</option>
                              <option value="out">Stock Out (-)</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              type="number"
                              placeholder="Enter quantity"
                              value={adjustmentData.quantity}
                              onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="reason">Reason</Label>
                          <Input
                            placeholder="Reason for adjustment"
                            value={adjustmentData.reason}
                            onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                          />
                        </div>

                        <Button onClick={handleStockAdjustment} className="w-full">
                          Update Stock
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              );
            })}
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inventory items found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Stock Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
          <CardDescription>Track all inventory changes and adjustments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movements.slice(0, 10).map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {movement.movement_type === 'in' ? (
                    <Plus className="h-4 w-4 text-green-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{movement.products?.name}</p>
                    <p className="text-sm text-muted-foreground">{movement.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {movement.movement_type === 'in' ? '+' : '-'}{movement.quantity}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(movement.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTracker;