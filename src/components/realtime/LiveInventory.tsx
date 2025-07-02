import React, { useState, useEffect, useRef } from 'react';
import { Package, AlertTriangle, CheckCircle, Clock, TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface InventoryItem {
  id: string;
  product_id: string;
  current_stock: number;
  minimum_stock_level: number;
  updated_at: string;
  products: {
    name: string;
    vendor_id: string;
    price: number;
  };
}

interface StockAlert {
  id: string;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  product_id: string;
  current_stock: number;
  minimum_stock_level: number;
  products: {
    name: string;
    vendor_id: string;
  };
}

export default function LiveInventory({ vendorId }: { vendorId?: string }) {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    fetchInventory();
    fetchStockAlerts();
    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [vendorId]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('live-inventory-sync', {
        body: { 
          action: 'getLiveInventory', 
          data: { vendorId, limit: 100 } 
        }
      });

      if (error) throw error;
      setInventory(data.inventory || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('live-inventory-sync', {
        body: { 
          action: 'getStockAlerts', 
          data: { vendorId } 
        }
      });

      if (error) throw error;
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channelName = vendorId ? `inventory:vendor:${vendorId}` : 'inventory_updates';
    
    channelRef.current = supabase
      .channel(channelName)
      .on('broadcast', { event: 'stock_updated' }, (payload) => {
        const update = payload.payload;
        
        // Update inventory list
        setInventory(prev => 
          prev.map(item => 
            item.product_id === update.productId 
              ? { ...item, current_stock: update.newStock, updated_at: update.updatedAt }
              : item
          )
        );
        
        // Refresh alerts if stock is low
        if (update.newStock <= 10) {
          fetchStockAlerts();
        }
      })
      .subscribe();
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      setUpdatingStock(productId);
      
      const { error } = await supabase.functions.invoke('live-inventory-sync', {
        body: { 
          action: 'updateStock', 
          data: { productId, newStock, vendorId: user?.id } 
        }
      });

      if (error) throw error;
      
      // Stock will be updated via real-time subscription
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setUpdatingStock(null);
    }
  };

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) return { status: 'out-of-stock', color: 'destructive', icon: AlertTriangle };
    if (current <= minimum * 0.5) return { status: 'critical', color: 'destructive', icon: AlertTriangle };
    if (current <= minimum) return { status: 'low', color: 'warning', icon: TrendingDown };
    return { status: 'good', color: 'success', icon: CheckCircle };
  };

  const filteredInventory = inventory.filter(item =>
    item.products.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inventoryStats = {
    total: inventory.length,
    lowStock: inventory.filter(item => item.current_stock <= item.minimum_stock_level).length,
    outOfStock: inventory.filter(item => item.current_stock === 0).length,
    healthy: inventory.filter(item => item.current_stock > item.minimum_stock_level).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Live Inventory
          </h2>
          <p className="text-muted-foreground">Real-time stock monitoring and management</p>
        </div>
        <Button onClick={fetchInventory} variant="outline" size="sm" className="hover-scale">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{inventoryStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Stock</p>
                <p className="text-2xl font-bold text-green-600">{inventoryStats.healthy}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{inventoryStats.lowStock}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {alerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredInventory.map((item) => {
                      const stockStatus = getStockStatus(item.current_stock, item.minimum_stock_level);
                      const StatusIcon = stockStatus.icon;
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover-scale">
                          <div className="flex items-center gap-3 flex-1">
                            <StatusIcon className={`w-5 h-5 ${
                              stockStatus.color === 'destructive' ? 'text-red-500' :
                              stockStatus.color === 'warning' ? 'text-orange-500' : 'text-green-500'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.products.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  Stock: {item.current_stock}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  Min: {item.minimum_stock_level}
                                </span>
                                <Badge variant={stockStatus.color as any}>
                                  {stockStatus.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">${item.products.price}</span>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStock(item.product_id, Math.max(0, item.current_stock - 1))}
                                disabled={updatingStock === item.product_id || item.current_stock === 0}
                              >
                                -
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {updatingStock === item.product_id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                                ) : (
                                  item.current_stock
                                )}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStock(item.product_id, item.current_stock + 1)}
                                disabled={updatingStock === item.product_id}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No stock alerts at the moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.alertLevel === 'critical' ? 'text-red-500' : 'text-orange-500'
                        }`} />
                        <div>
                          <h4 className="font-medium">{alert.products.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Current stock: {alert.current_stock} / Min: {alert.minimum_stock_level}
                          </p>
                        </div>
                      </div>
                      <Badge variant={alert.alertLevel === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.alertLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}