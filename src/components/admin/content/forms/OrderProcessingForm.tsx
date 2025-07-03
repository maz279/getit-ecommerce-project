import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Package, Truck, Check, X, Eye, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total_amount: number;
  created_at: string;
  shipping_address: any;
  order_items: any[];
}

interface OrderUpdate {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  tracking_number?: string;
  notes?: string;
  estimated_delivery?: string;
}

export const OrderProcessingForm: React.FC = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateData, setUpdateData] = useState<OrderUpdate>({
    status: 'pending',
    tracking_number: '',
    notes: '',
    estimated_delivery: ''
  });

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'processing', label: 'Processing', color: 'purple' },
    { value: 'shipped', label: 'Shipped', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'refunded', label: 'Refunded', color: 'gray' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            products (name, sku)
          ),
          profiles!customer_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig?.color || 'gray';
  };

  const handleStatusUpdate = async (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned', additionalData?: Partial<OrderUpdate>) => {
    setLoading(true);
    try {
      const updatePayload = {
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...additionalData
      };

      const { error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);

      if (error) throw error;

      // Log the status change in audit_logs
      await supabase
        .from('audit_logs')
        .insert([{
          resource_type: 'order',
          action: 'status_update',
          changes: { 
            order_id: orderId, 
            old_status: 'previous', 
            new_status: newStatus 
          },
          metadata: { 
            notes: additionalData?.notes || `Status updated to ${newStatus}` 
          }
        }]);

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });

      fetchOrders();
      setSelectedOrder(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (orderIds: string[], action: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned') => {
    setLoading(true);
    try {
      for (const orderId of orderIds) {
        await supabase
          .from('orders')
          .update({ 
            status: action, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', orderId);
      }

      toast({
        title: "Success",
        description: `Bulk action completed for ${orderIds.length} orders`,
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to perform bulk action",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      tracking_number: '',
      notes: '',
      estimated_delivery: ''
    });
  };

  const submitOrderUpdate = () => {
    if (selectedOrder) {
      handleStatusUpdate(selectedOrder.id, updateData.status, {
        tracking_number: updateData.tracking_number,
        notes: updateData.notes,
        estimated_delivery: updateData.estimated_delivery
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Processing Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search by order number or customer email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{order.customer_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-${getStatusColor(order.status)}-600 border-${getStatusColor(order.status)}-200`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>৳{order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.order_items?.length || 0} items</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openOrderDetails(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Customer Information */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Customer Information</h4>
                                    <p><strong>Customer ID:</strong> {selectedOrder.customer_id}</p>
                                    <p><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                    <p><strong>Total Amount:</strong> ৳{selectedOrder.total_amount.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                                    <div className="text-sm text-gray-600">
                                      {selectedOrder.shipping_address && (
                                        <div>
                                          <p>{selectedOrder.shipping_address.street}</p>
                                          <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}</p>
                                          <p>{selectedOrder.shipping_address.postal_code}</p>
                                          <p>{selectedOrder.shipping_address.country}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h4 className="font-semibold mb-2">Order Items</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.order_items?.map((item: any) => (
                                        <TableRow key={item.id}>
                                          <TableCell>{item.products?.name}</TableCell>
                                          <TableCell>{item.products?.sku}</TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell>৳{item.unit_price.toFixed(2)}</TableCell>
                                          <TableCell>৳{item.total_price.toFixed(2)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Update Order Status */}
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-4">Update Order Status</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select
                                        value={updateData.status}
                                        onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value as any }))}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {orderStatuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                              {status.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="tracking">Tracking Number</Label>
                                      <Input
                                        id="tracking"
                                        value={updateData.tracking_number}
                                        onChange={(e) => setUpdateData(prev => ({ ...prev, tracking_number: e.target.value }))}
                                        placeholder="Enter tracking number"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="delivery_date">Estimated Delivery</Label>
                                      <Input
                                        id="delivery_date"
                                        type="date"
                                        value={updateData.estimated_delivery}
                                        onChange={(e) => setUpdateData(prev => ({ ...prev, estimated_delivery: e.target.value }))}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="notes">Notes</Label>
                                      <Textarea
                                        id="notes"
                                        value={updateData.notes}
                                        onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Add notes about this update..."
                                        rows={3}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex gap-2 mt-4">
                                    <Button onClick={submitOrderUpdate} disabled={loading}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Update Order
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedOrder(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'processing')}
                          disabled={order.status !== 'pending'}
                        >
                          <Check className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'shipped')}
                          disabled={order.status !== 'processing'}
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => fetchOrders()}
              disabled={loading}
            >
              Refresh Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};