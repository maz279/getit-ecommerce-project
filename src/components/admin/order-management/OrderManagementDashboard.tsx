import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ShoppingCart, Clock, CheckCircle, AlertCircle, Eye, Package } from 'lucide-react';
import { useWebSocket } from '@/components/realtime/WebSocketProvider';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total_amount: number;
  created_at: string;
  items: OrderItem[];
  shipping_address: any;
  payment_status?: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  vendor_id: string;
  vendor_name: string;
}

interface OrderAnalytics {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentOrders: number;
}

export const OrderManagementDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { subscribe, sendMessage, isConnected } = useWebSocket();

  // Fetch orders and analytics
  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, []);

  // Subscribe to real-time order updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('order_update', (message) => {
      const { action, order } = message.payload;
      
      setOrders(prev => {
        switch (action) {
          case 'created':
          case 'updated':
            const exists = prev.find(o => o.id === order.id);
            if (exists) {
              return prev.map(o => o.id === order.id ? order : o);
            }
            return [order, ...prev];
          case 'status_changed':
            return prev.map(o => 
              o.id === order.id ? { ...o, status: order.status } : o
            );
          default:
            return prev;
        }
      });

      fetchAnalytics();
    });

    return unsubscribe;
  }, [subscribe, isConnected]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(name),
            vendors(business_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data?.map(order => ({
        ...order,
        customer_name: order.customer_id || 'Guest Customer',
        items: order.order_items?.map((item: any) => ({
          ...item,
          product_name: item.products?.name || 'Unknown Product',
          vendor_name: item.vendors?.business_name || 'Unknown Vendor'
        })) || []
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('status, total_amount, created_at');

      if (!ordersData) return;

      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
      const processingOrders = ordersData.filter(o => ['processing', 'shipped'].includes(o.status)).length;
      const completedOrders = ordersData.filter(o => o.status === 'delivered').length;
      
      const totalRevenue = ordersData
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0);
      
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Recent orders (last 24 hours)
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      const recentOrders = ordersData.filter(
        o => new Date(o.created_at) > dayAgo
      ).length;

      setAnalytics({
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue,
        averageOrderValue,
        recentOrders
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus as any })
        .eq('id', orderId);

      // Send real-time update
      sendMessage({
        type: 'order_status_update',
        payload: { orderId, status: newStatus },
        timestamp: Date.now(),
        source: 'admin_dashboard'
      });

      fetchOrders();
      fetchAnalytics();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive'
    } as const;

    const colors = {
      pending: 'text-warning',
      confirmed: 'text-primary',
      processing: 'text-primary',
      shipped: 'text-primary',
      delivered: 'text-success',
      cancelled: 'text-destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Package className="h-4 w-4 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.recentOrders} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{analytics.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{analytics.processingOrders}</div>
              <p className="text-xs text-muted-foreground">In fulfillment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">৳{analytics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Avg: ৳{analytics.averageOrderValue.toFixed(0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders or customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="returned">Returned</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Manage and track all orders in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  
                  <div>
                    <h3 className="font-medium">{order.order_number}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_name} • {order.items.length} items
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(order.status)}
                      <span className="text-sm font-medium">
                        ৳{order.total_amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {order.status === 'pending' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'processing')}
                    >
                      Process
                    </Button>
                  )}
                  
                  {order.status === 'processing' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'shipped')}
                    >
                      Ship
                    </Button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'delivered')}
                    >
                      Deliver
                    </Button>
                  )}
                  
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No orders found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal would go here */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Order Details - {selectedOrder.order_number}</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4"
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Customer Information</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_name}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product_name} x{item.quantity}</span>
                        <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>৳{selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};