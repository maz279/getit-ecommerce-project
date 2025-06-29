
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, Package } from 'lucide-react';

export const ShippedOrdersContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipped Orders</h1>
          <p className="text-gray-600 mt-1">Orders currently in transit to customers</p>
        </div>
        <Button>
          <MapPin className="h-4 w-4 mr-2" />
          Track All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs opacity-80">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out for Delivery</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Final mile delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">Expected delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳2,34,670</div>
            <p className="text-xs text-muted-foreground">Shipped orders</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Shipped Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '#ORD-2024-009', customer: 'Shahid Alam', amount: '৳1,850', status: 'In Transit', tracking: 'TRK123456789', eta: '2 days' },
              { id: '#ORD-2024-010', customer: 'Rashida Begum', amount: '৳3,200', status: 'Out for Delivery', tracking: 'TRK123456790', eta: 'Today' },
              { id: '#ORD-2024-011', customer: 'Mizanur Rahman', amount: '৳750', status: 'In Transit', tracking: 'TRK123456791', eta: '1 day' },
              { id: '#ORD-2024-012', customer: 'Nasreen Akter', amount: '৳2,100', status: 'In Transit', tracking: 'TRK123456792', eta: '3 days' }
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">Tracking: {order.tracking}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold">{order.amount}</p>
                    <p className="text-xs text-gray-500">ETA: {order.eta}</p>
                  </div>
                  <Badge className={
                    order.status === 'Out for Delivery' ? 'bg-orange-100 text-orange-800' :
                    'bg-purple-100 text-purple-800'
                  }>
                    {order.status}
                  </Badge>
                  <Button size="sm" variant="outline">Track</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
