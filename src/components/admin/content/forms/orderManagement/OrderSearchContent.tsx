
import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, User, Package, MapPin, CreditCard, Clock, AlertCircle, Eye, Edit, Trash2, MoreHorizontal, RefreshCw, ScanLine, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';

export const OrderSearchContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [amountRange, setAmountRange] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock advanced search results
  const mockSearchResults = [
    {
      id: 'ORD-2024-001',
      customer: 'Sarah Ahmed',
      email: 'sarah@email.com',
      phone: '+8801712345678',
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'Mobile Banking',
      total: 2850,
      items: 3,
      orderDate: '2024-01-15T10:30:00Z',
      shippingAddress: 'House 45, Road 12, Dhanmondi, Dhaka-1205',
      trackingNumber: 'TRK123456789',
      vendor: 'Tech Store BD',
      priority: 'high',
      customerType: 'Premium',
      deliveryType: 'Express'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Mohammad Rahman',
      email: 'rahman@email.com',
      phone: '+8801823456789',
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      total: 1650,
      items: 2,
      orderDate: '2024-01-15T09:15:00Z',
      shippingAddress: 'Flat 3B, Green Villa, Chittagong-4000',
      trackingNumber: 'TRK123456790',
      vendor: 'Fashion Hub',
      priority: 'medium',
      customerType: 'Regular',
      deliveryType: 'Standard'
    }
  ];

  const handleAdvancedSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Order Search</h1>
          <p className="text-gray-600 mt-1">Search and filter orders with advanced criteria</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Search
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Search Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-sm opacity-90">Total Orders</p>
              </div>
              <Search className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-sm opacity-90">This Month</p>
              </div>
              <Calendar className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">96.5%</div>
                <p className="text-sm opacity-90">Success Rate</p>
              </div>
              <Zap className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">২.৩</div>
                <p className="text-sm opacity-90">Avg Response Time</p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ScanLine className="h-5 w-5 mr-2" />
            Advanced Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Search Input */}
            <div className="lg:col-span-2">
              <Label htmlFor="search-query" className="text-sm font-medium mb-2 block">
                Search Query
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search-query"
                  placeholder="Order ID, Customer Name, Email, Phone, Product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Search Type</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="order-id">Order ID</SelectItem>
                  <SelectItem value="customer">Customer Info</SelectItem>
                  <SelectItem value="product">Product Name</SelectItem>
                  <SelectItem value="tracking">Tracking Number</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Order Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Amount Range</Label>
              <Select value={amountRange} onValueChange={setAmountRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="under-500">Under ৳500</SelectItem>
                  <SelectItem value="500-1000">৳500 - ৳1,000</SelectItem>
                  <SelectItem value="1000-2500">৳1,000 - ৳2,500</SelectItem>
                  <SelectItem value="2500-5000">৳2,500 - ৳5,000</SelectItem>
                  <SelectItem value="over-5000">Over ৳5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-2 flex items-end">
              <Button 
                onClick={handleAdvancedSearch} 
                className="w-full"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Orders
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Search Results ({searchResults.length} orders found)</CardTitle>
              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedOrders.length} selected</span>
                  <Button variant="outline" size="sm">Bulk Actions</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Order Details</TableHead>
                    <TableHead>Customer Info</TableHead>
                    <TableHead>Status & Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Shipping</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((order) => (
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
                          <div className="text-xs text-gray-400">
                            {order.vendor}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {order.customer}
                          </div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                          <div className="text-xs text-gray-400">{order.phone}</div>
                          <Badge variant="outline" className="text-xs">
                            {order.customerType}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            <CreditCard className="h-3 w-3 inline mr-1" />
                            {order.paymentMethod}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">৳{order.total.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{order.priority} priority</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {order.deliveryType}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.trackingNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Track Package
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Search Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Quick Search Examples:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Search by Order ID: "ORD-2024-001"</li>
                <li>• Search by Customer: "John Doe" or "john@email.com"</li>
                <li>• Search by Phone: "+8801712345678"</li>
                <li>• Search by Product: "iPhone 15"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Advanced Features:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Use date ranges for time-specific searches</li>
                <li>• Filter by order status and payment method</li>
                <li>• Search by amount ranges</li>
                <li>• Export search results to CSV/Excel</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
