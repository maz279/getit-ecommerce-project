
import React from 'react';
import { ShoppingCart, Package, Truck, RefreshCw, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AllOrdersContent } from './forms/orderManagement/AllOrdersContent';

interface OrderManagementContentProps {
  selectedSubmenu: string;
}

export const OrderManagementContent: React.FC<OrderManagementContentProps> = ({ selectedSubmenu }) => {
  const renderOrderProcessing = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Order Processing Center</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Input placeholder="Search orders..." className="w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs opacity-80">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs opacity-80">Being prepared for shipment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs opacity-80">On the way to customers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs opacity-80">Successfully completed today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '#ORD-001', customer: 'John Doe', amount: '৳1,250', status: 'New', priority: 'high' },
              { id: '#ORD-002', customer: 'Jane Smith', amount: '৳850', status: 'Processing', priority: 'medium' },
              { id: '#ORD-003', customer: 'Mike Johnson', amount: '৳2,100', status: 'Shipped', priority: 'low' },
              { id: '#ORD-004', customer: 'Sarah Wilson', amount: '৳675', status: 'New', priority: 'high' }
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold">{order.amount}</p>
                    <Badge 
                      className={
                        order.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrderTracking = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Order Tracking Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Live Tracking Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Package className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Interactive Tracking Map</p>
                <p className="text-sm text-gray-400">Real-time delivery locations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>On-time Delivery Rate</span>
                <Badge className="bg-green-100 text-green-800">94.5%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Delivery Time</span>
                <Badge className="bg-blue-100 text-blue-800">2.3 days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Customer Satisfaction</span>
                <Badge className="bg-purple-100 text-purple-800">4.7/5.0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getContent = () => {
    switch (selectedSubmenu) {
      case 'all-orders':
        return <AllOrdersContent />;
      case 'order-overview':
      case 'order-processing':
      case 'orders':
        return renderOrderProcessing();
      case 'order-tracking':
      case 'live-tracking':
        return renderOrderTracking();
      case 'new-orders':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">New Orders Management</h1>
            <p className="text-gray-600">Manage and process new incoming orders...</p>
          </div>
        );
      case 'returns-refunds':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Returns & Refunds</h1>
            <p className="text-gray-600">Handle customer returns and refund requests...</p>
          </div>
        );
      default:
        return renderOrderProcessing();
    }
  };

  return (
    <div className="p-6">
      {getContent()}
    </div>
  );
};
