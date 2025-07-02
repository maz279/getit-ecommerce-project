import React, { useState, useEffect } from 'react';
import { Package, Truck, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface Warehouse {
  id: string;
  name: string;
  code: string;
  status: string;
  capacity_cubic_meters: number;
  utilization_percentage?: number;
  warehouse_zones: Array<{
    zone_name: string;
    zone_type: string;
    capacity: number;
    current_utilization: number;
  }>;
}

export const WarehouseManagement: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWarehouseStatus();
  }, []);

  const loadWarehouseStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('warehouse-management', {
        body: { action: 'warehouse_status' }
      });

      if (error) throw error;
      setWarehouses(data.warehouses || []);
    } catch (error) {
      console.error('Failed to load warehouse status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return <div className="text-center">Loading warehouse data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Warehouse Management</h2>
        <Badge variant="outline" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          {warehouses.length} Active Warehouses
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => {
          const utilization = warehouse.utilization_percentage || 0;
          
          return (
            <Card key={warehouse.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{warehouse.name}</span>
                  <Badge variant={warehouse.status === 'active' ? 'default' : 'secondary'}>
                    {warehouse.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Capacity Utilization</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={utilization} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{warehouse.warehouse_zones?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Zones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {warehouse.capacity_cubic_meters ? `${warehouse.capacity_cubic_meters}m³` : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Capacity</div>
                  </div>
                </div>

                {utilization >= 90 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">Near capacity limit</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};