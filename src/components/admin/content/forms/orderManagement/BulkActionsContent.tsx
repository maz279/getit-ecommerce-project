
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Truck, 
  Check, 
  X, 
  AlertCircle, 
  Download, 
  Upload, 
  FileText, 
  Mail, 
  MessageSquare, 
  Calendar,
  Users,
  ShoppingBag,
  RefreshCw,
  Filter,
  Search,
  Edit,
  Trash2,
  Send,
  Clock,
  MapPin,
  Phone,
  User,
  Eye,
  Archive,
  Tag,
  Star,
  Settings
} from 'lucide-react';

export const BulkActionsContent: React.FC = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);

  // Mock orders data for bulk operations
  const ordersData = [
    {
      id: 'ORD-2024-001',
      customer: 'Sarah Ahmed',
      email: 'sarah@email.com',
      phone: '+8801712345678',
      status: 'pending',
      paymentStatus: 'paid',
      total: 2850,
      items: 3,
      orderDate: '2024-01-15T10:30:00Z',
      shippingAddress: 'Dhaka, Bangladesh',
      vendor: 'Tech Store BD',
      priority: 'high',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Mohammad Rahman',
      email: 'rahman@email.com',
      phone: '+8801823456789',
      status: 'processing',
      paymentStatus: 'paid',
      total: 1650,
      items: 2,
      orderDate: '2024-01-15T09:15:00Z',
      shippingAddress: 'Chittagong, Bangladesh',
      vendor: 'Fashion Hub',
      priority: 'medium',
      trackingNumber: 'TRK123456790'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Fatima Khan',
      email: 'fatima@email.com',
      phone: '+8801934567890',
      status: 'shipped',
      paymentStatus: 'paid',
      total: 3200,
      items: 5,
      orderDate: '2024-01-14T14:20:00Z',
      shippingAddress: 'Sylhet, Bangladesh',
      vendor: 'Home Essentials',
      priority: 'low',
      trackingNumber: 'TRK123456791'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Ahmed Hassan',
      email: 'ahmed@email.com',
      phone: '+8801645678901',
      status: 'delivered',
      paymentStatus: 'paid',
      total: 850,
      items: 1,
      orderDate: '2024-01-13T16:45:00Z',
      shippingAddress: 'Rajshahi, Bangladesh',
      vendor: 'Books & More',
      priority: 'medium',
      trackingNumber: 'TRK123456792'
    },
    {
      id: 'ORD-2024-005',
      customer: 'Nusrat Jahan',
      email: 'nusrat@email.com',
      phone: '+8801756789012',
      status: 'cancelled',
      paymentStatus: 'refunded',
      total: 1200,
      items: 2,
      orderDate: '2024-01-12T11:30:00Z',
      shippingAddress: 'Khulna, Bangladesh',
      vendor: 'Electronics Pro',
      priority: 'high',
      trackingNumber: ''
    }
  ];

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    
    setActionInProgress(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Performing ${bulkAction} on orders:`, selectedOrders);
      setActionInProgress(false);
      setSelectedOrders([]);
      setBulkAction('');
    }, 2000);
  };

  const bulkActionOptions = [
    { value: 'update-status', label: 'Update Status', icon: Edit },
    { value: 'send-notification', label: 'Send Notification', icon: Mail },
    { value: 'export-data', label: 'Export Data', icon: Download },
    { value: 'assign-courier', label: 'Assign Courier', icon: Truck },
    { value: 'update-priority', label: 'Update Priority', icon: Star },
    { value: 'add-tags', label: 'Add Tags', icon: Tag },
    { value: 'archive', label: 'Archive Orders', icon: Archive },
    { value: 'cancel', label: 'Cancel Orders', icon: X }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Actions</h1>
          <p className="text-gray-600 mt-1">Perform actions on multiple orders simultaneously</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Orders
          </Button>
        </div>
      </div>

      {/* Bulk Action Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{ordersData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selected Orders</p>
                <p className="text-2xl font-bold text-gray-900">{selectedOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Affected Customers</p>
                <p className="text-2xl font-bold text-gray-900">{selectedOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Select Orders</TabsTrigger>
          <TabsTrigger value="actions">Bulk Actions</TabsTrigger>
          <TabsTrigger value="templates">Action Templates</TabsTrigger>
          <TabsTrigger value="history">Action History</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders by ID, customer name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select Orders for Bulk Actions</CardTitle>
                {selectedOrders.length > 0 && (
                  <Badge variant="secondary">{selectedOrders.length} orders selected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedOrders.length === filteredOrders.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Order Details</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => handleSelectOrder(order.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-blue-600">{order.id}</div>
                            <div className="text-sm text-gray-500">{order.items} items</div>
                            <div className="text-xs text-gray-400">{order.vendor}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-gray-500">{order.email}</div>
                            <div className="text-xs text-gray-400">{order.shippingAddress}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">৳{order.total.toLocaleString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.priority === 'high' ? 'destructive' : order.priority === 'medium' ? 'default' : 'secondary'}>
                            {order.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Execute Bulk Actions</CardTitle>
              <p className="text-sm text-gray-600">
                {selectedOrders.length} orders selected for bulk action
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Please select orders from the "Select Orders" tab first</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Action Selection */}
                  <div>
                    <Label htmlFor="bulk-action">Select Action</Label>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a bulk action..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bulkActionOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <IconComponent className="h-4 w-4 mr-2" />
                                {option.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action-specific forms */}
                  {bulkAction === 'update-status' && (
                    <div className="space-y-4">
                      <Label>Update Status To:</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <div>
                        <Label htmlFor="status-note">Status Update Note (Optional)</Label>
                        <Textarea id="status-note" placeholder="Add a note about this status update..." />
                      </div>
                    </div>
                  )}

                  {bulkAction === 'send-notification' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Notification Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select notification type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email Notification</SelectItem>
                            <SelectItem value="sms">SMS Notification</SelectItem>
                            <SelectItem value="both">Email + SMS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notification-subject">Subject</Label>
                        <Input id="notification-subject" placeholder="Notification subject..." />
                      </div>
                      <div>
                        <Label htmlFor="notification-message">Message</Label>
                        <Textarea id="notification-message" placeholder="Your notification message..." rows={4} />
                      </div>
                    </div>
                  )}

                  {bulkAction === 'assign-courier' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Select Courier Partner</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose courier partner..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="redx">RedX</SelectItem>
                            <SelectItem value="steadfast">Steadfast</SelectItem>
                            <SelectItem value="pathao">Pathao</SelectItem>
                            <SelectItem value="ecourier">eCourier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pickup-date">Pickup Date</Label>
                        <Input id="pickup-date" type="date" />
                      </div>
                    </div>
                  )}

                  {bulkAction === 'add-tags' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input id="tags" placeholder="urgent, vip-customer, fragile..." />
                      </div>
                    </div>
                  )}

                  {/* Action Summary */}
                  {bulkAction && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Action Summary</h4>
                        <p className="text-blue-800 text-sm">
                          This action will be applied to <strong>{selectedOrders.length}</strong> selected orders.
                        </p>
                        <div className="mt-2 text-xs text-blue-600">
                          Order IDs: {selectedOrders.join(', ')}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Execute Button */}
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={handleBulkAction}
                      disabled={!bulkAction || actionInProgress}
                      className="flex-1"
                    >
                      {actionInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Execute Bulk Action
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedOrders([])}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Action Templates</CardTitle>
              <p className="text-sm text-gray-600">Pre-configured bulk actions for common scenarios</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Rush Order Processing',
                    description: 'Update status to processing + assign priority courier',
                    actions: 2,
                    lastUsed: '2 days ago'
                  },
                  {
                    name: 'Delivery Notification',
                    description: 'Send delivery confirmation email + SMS',
                    actions: 1,
                    lastUsed: '1 week ago'
                  },
                  {
                    name: 'Holiday Orders',
                    description: 'Add holiday tag + update delivery timeline',
                    actions: 2,
                    lastUsed: '3 days ago'
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge variant="secondary">{template.actions} actions</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Last used: {template.lastUsed}</span>
                        <Button size="sm" variant="outline">Use Template</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Action History</CardTitle>
              <p className="text-sm text-gray-600">Recent bulk actions performed on orders</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    action: 'Status Update',
                    ordersCount: 15,
                    performedBy: 'Admin User',
                    timestamp: '2024-01-15T14:30:00Z',
                    status: 'completed',
                    details: 'Updated 15 orders from pending to processing'
                  },
                  {
                    id: 2,
                    action: 'Courier Assignment',
                    ordersCount: 8,
                    performedBy: 'Admin User',
                    timestamp: '2024-01-15T12:15:00Z',
                    status: 'completed',
                    details: 'Assigned RedX courier to 8 orders'
                  },
                  {
                    id: 3,
                    action: 'Notification Sent',
                    ordersCount: 22,
                    performedBy: 'System',
                    timestamp: '2024-01-15T10:00:00Z',
                    status: 'completed',
                    details: 'Sent delivery confirmation emails to 22 customers'
                  }
                ].map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Settings className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{action.action}</h4>
                        <p className="text-sm text-gray-600">{action.details}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>{action.ordersCount} orders</span>
                          <span>by {action.performedBy}</span>
                          <span>{new Date(action.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        {action.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
