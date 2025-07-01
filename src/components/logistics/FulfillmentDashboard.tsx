import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Truck, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FulfillmentStats {
  pending: number;
  allocated: number;
  picking: number;
  picked: number;
  packing: number;
  packed: number;
  shipped: number;
  delivered: number;
}

interface PickList {
  id: string;
  status: string;
  total_items: number;
  picked_items: number;
  created_at: string;
  picker_id?: string;
}

interface OrderFulfillment {
  id: string;
  order_id: string;
  status: string;
  priority_level: string;
  tracking_number?: string;
  created_at: string;
  orders: {
    order_number: string;
    total_amount: number;
    customer_id: string;
  };
}

export default function FulfillmentDashboard() {
  const [stats, setStats] = useState<FulfillmentStats | null>(null);
  const [pickLists, setPickLists] = useState<PickList[]>([]);
  const [fulfillments, setFulfillments] = useState<OrderFulfillment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [fulfillmentCenters, setFulfillmentCenters] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFulfillmentCenters();
  }, []);

  useEffect(() => {
    if (selectedCenter) {
      loadDashboardData();
    }
  }, [selectedCenter]);

  const loadFulfillmentCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('fulfillment_centers')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      setFulfillmentCenters(data || []);
      if (data?.length > 0) {
        setSelectedCenter(data[0].id);
      }
    } catch (error) {
      console.error('Error loading fulfillment centers:', error);
      toast({
        title: "Error",
        description: "Failed to load fulfillment centers",
        variant: "destructive",
      });
    }
  };

  const loadDashboardData = async () => {
    if (!selectedCenter) return;
    
    setLoading(true);
    try {
      // Load fulfillment stats
      const { data: fulfillmentData } = await supabase
        .from('order_fulfillment')
        .select('status')
        .eq('fulfillment_center_id', selectedCenter);

      const statusCounts = fulfillmentData?.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      setStats({
        pending: statusCounts.pending || 0,
        allocated: statusCounts.allocated || 0,
        picking: statusCounts.picking || 0,
        picked: statusCounts.picked || 0,
        packing: statusCounts.packing || 0,
        packed: statusCounts.packed || 0,
        shipped: statusCounts.shipped || 0,
        delivered: statusCounts.delivered || 0
      });

      // Load active pick lists
      const { data: pickListData } = await supabase
        .from('pick_lists')
        .select('*')
        .eq('fulfillment_center_id', selectedCenter)
        .in('status', ['created', 'assigned', 'in_progress'])
        .order('created_at', { ascending: false });

      setPickLists(pickListData || []);

      // Load recent fulfillments
      const { data: fulfillmentData2 } = await supabase
        .from('order_fulfillment')
        .select(`
          *,
          orders (
            order_number,
            total_amount,
            customer_id
          )
        `)
        .eq('fulfillment_center_id', selectedCenter)
        .order('created_at', { ascending: false })
        .limit(20);

      setFulfillments(fulfillmentData2 || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoProcessing = async (action: string) => {
    if (!selectedCenter) return;

    try {
      const { data, error } = await supabase.functions.invoke('order-fulfillment', {
        body: { 
          action, 
          data: { 
            fulfillmentCenterId: selectedCenter,
            packerId: 'auto-system',
            pickerId: 'auto-system'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message,
      });

      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error processing:', error);
      toast({
        title: "Error",
        description: "Failed to process orders",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'allocated': return 'outline';
      case 'picking': case 'packing': return 'default';
      case 'picked': case 'packed': return 'secondary';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="p-6">Loading fulfillment dashboard...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fulfillment Dashboard</h1>
        <div className="flex gap-2">
          <select 
            value={selectedCenter} 
            onChange={(e) => setSelectedCenter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {fulfillmentCenters.map(center => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
          <Button onClick={() => loadDashboardData()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {stats && Object.entries(stats).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auto Processing Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleAutoProcessing('auto_pick_allocation')}
              variant="outline"
            >
              <Package className="h-4 w-4 mr-2" />
              Auto Pick Allocation
            </Button>
            <Button 
              onClick={() => handleAutoProcessing('auto_pack_orders')}
              variant="outline"
            >
              <Package className="h-4 w-4 mr-2" />
              Auto Pack Orders
            </Button>
            <Button 
              onClick={() => handleAutoProcessing('auto_ship_orders')}
              variant="outline"
            >
              <Truck className="h-4 w-4 mr-2" />
              Auto Ship Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fulfillments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fulfillments">Active Fulfillments</TabsTrigger>
          <TabsTrigger value="picklists">Pick Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="fulfillments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Order Fulfillments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fulfillments.map((fulfillment) => (
                    <TableRow key={fulfillment.id}>
                      <TableCell className="font-medium">
                        {fulfillment.orders.order_number}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(fulfillment.status)}>
                          {fulfillment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={fulfillment.priority_level === 'high' ? 'destructive' : 'secondary'}>
                          {fulfillment.priority_level}
                        </Badge>
                      </TableCell>
                      <TableCell>৳{fulfillment.orders.total_amount}</TableCell>
                      <TableCell>
                        {fulfillment.tracking_number || '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(fulfillment.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="picklists">
          <Card>
            <CardHeader>
              <CardTitle>Active Pick Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pick List ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Picker</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickLists.map((pickList) => (
                    <TableRow key={pickList.id}>
                      <TableCell className="font-medium">
                        {pickList.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(pickList.status)}>
                          {pickList.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pickList.picked_items}/{pickList.total_items}
                      </TableCell>
                      <TableCell>
                        {pickList.picker_id ? 'Assigned' : 'Unassigned'}
                      </TableCell>
                      <TableCell>
                        {new Date(pickList.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}