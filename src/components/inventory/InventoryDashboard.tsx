import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Package, TrendingUp, TrendingDown, RefreshCw, Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  product_id: string;
  vendor_id: string;
  sku: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  minimum_stock_level: number;
  maximum_stock_level: number;
  reorder_point: number;
  cost_per_unit: number;
  products: {
    name: string;
    price: number;
  };
  vendors: {
    business_name: string;
  };
  fulfillment_centers: {
    name: string;
  };
}

interface StockAlert {
  id: string;
  alert_type: string;
  severity: string;
  message: string;
  current_value: number;
  threshold_value?: number;
  created_at: string;
  inventory: {
    sku: string;
    products: {
      name: string;
    };
  };
}

interface DemandForecast {
  id: string;
  predicted_demand: number;
  confidence_score: number;
  forecast_period: string;
  forecast_date: string;
  products: {
    name: string;
  };
}

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockUpdateQuantity, setStockUpdateQuantity] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    loadInventoryData();
    loadStockAlerts();
    loadDemandForecasts();
  }, []);

  const loadInventoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (name, price),
          vendors (business_name),
          fulfillment_centers (name)
        `)
        .order('current_stock', { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    }
  };

  const loadStockAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          inventory (
            sku,
            products (name)
          )
        `)
        .is('resolved_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const loadDemandForecasts = async () => {
    try {
      const { data, error } = await supabase
        .from('demand_forecasts')
        .select(`
          *,
          products (name)
        `)
        .eq('forecast_period', 'month')
        .gte('forecast_date', new Date().toISOString().split('T')[0])
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      setForecasts(data || []);
    } catch (error) {
      console.error('Error loading forecasts:', error);
    }
  };

  const updateStock = async (inventoryId: string, quantity: number, movementType: 'inbound' | 'outbound') => {
    try {
      const { data, error } = await supabase.functions.invoke('inventory-management', {
        body: {
          action: 'update_stock',
          data: {
            inventoryId,
            quantity,
            movementType,
            reason: `Manual ${movementType} adjustment`,
            performedBy: 'admin-user'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message,
      });

      loadInventoryData(); // Refresh data
      setSelectedItem(null);
      setStockUpdateQuantity(0);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const generateForecast = async (productId: string, vendorId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('inventory-management', {
        body: {
          action: 'generate_forecast',
          data: {
            productId,
            vendorId,
            period: 'month'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message,
      });

      loadDemandForecasts(); // Refresh forecasts
    } catch (error) {
      console.error('Error generating forecast:', error);
      toast({
        title: "Error",
        description: "Failed to generate forecast",
        variant: "destructive",
      });
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('inventory-management', {
        body: {
          action: 'acknowledge_alert',
          data: {
            alertId,
            acknowledgedBy: 'admin-user'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Alert acknowledged",
      });

      loadStockAlerts(); // Refresh alerts
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        variant: "destructive",
      });
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.products.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock === 0) return { status: 'Out of Stock', variant: 'destructive' as const };
    if (item.current_stock <= item.minimum_stock_level) return { status: 'Low Stock', variant: 'destructive' as const };
    if (item.current_stock >= item.maximum_stock_level) return { status: 'Overstock', variant: 'secondary' as const };
    return { status: 'In Stock', variant: 'default' as const };
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="p-6">Loading inventory dashboard...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {alerts.filter(a => a.alert_type === 'low_stock').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventory.filter(i => i.current_stock === 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{inventory.reduce((sum, item) => sum + (item.current_stock * item.cost_per_unit), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="forecasts">Demand Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Inventory Items</CardTitle>
                <Input
                  placeholder="Search by SKU or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.products.name}</TableCell>
                        <TableCell>{item.current_stock}</TableCell>
                        <TableCell>{item.available_stock}</TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>৳{item.cost_per_unit}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedItem(item)}
                            >
                              Update Stock
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateForecast(item.product_id, item.vendor_id)}
                            >
                              Forecast
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Type</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="capitalize">{alert.alert_type.replace('_', ' ')}</TableCell>
                      <TableCell>{alert.inventory.products.name}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{alert.current_value}</TableCell>
                      <TableCell>
                        {new Date(alert.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts">
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecasts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Predicted Demand</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Forecast Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecasts.map((forecast) => (
                    <TableRow key={forecast.id}>
                      <TableCell>{forecast.products.name}</TableCell>
                      <TableCell>{forecast.predicted_demand} units</TableCell>
                      <TableCell className="capitalize">{forecast.forecast_period}</TableCell>
                      <TableCell>{Math.round(forecast.confidence_score * 100)}%</TableCell>
                      <TableCell>
                        {new Date(forecast.forecast_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Update Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Update Stock - {selectedItem.products.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Stock: {selectedItem.current_stock}</p>
                <p className="text-sm text-muted-foreground">SKU: {selectedItem.sku}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={stockUpdateQuantity}
                  onChange={(e) => setStockUpdateQuantity(Number(e.target.value))}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => updateStock(selectedItem.id, stockUpdateQuantity, 'inbound')}
                  disabled={stockUpdateQuantity <= 0}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
                <Button
                  onClick={() => updateStock(selectedItem.id, stockUpdateQuantity, 'outbound')}
                  disabled={stockUpdateQuantity <= 0}
                  variant="outline"
                  className="flex-1"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Remove Stock
                </Button>
              </div>

              <Button
                onClick={() => {
                  setSelectedItem(null);
                  setStockUpdateQuantity(0);
                }}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}