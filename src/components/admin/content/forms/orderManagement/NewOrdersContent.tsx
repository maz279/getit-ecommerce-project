
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, User, Package } from 'lucide-react';

export const NewOrdersContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Orders</h1>
          <p className="text-gray-600 mt-1">Manage and process newly received orders</p>
        </div>
        <Button>
          <Package className="h-4 w-4 mr-2" />
          Process All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs opacity-80">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳45,230</div>
            <p className="text-xs text-muted-foreground">Today's new orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">First-time buyers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent New Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '#ORD-2024-001', customer: 'Sarah Ahmed', amount: '৳2,850', time: '2 minutes ago', priority: 'high' },
              { id: '#ORD-2024-002', customer: 'Mohammad Rahman', amount: '৳1,650', time: '5 minutes ago', priority: 'medium' },
              { id: '#ORD-2024-003', customer: 'Fatima Khan', amount: '৳3,200', time: '8 minutes ago', priority: 'low' },
              { id: '#ORD-2024-004', customer: 'Ahmed Hassan', amount: '৳850', time: '12 minutes ago', priority: 'high' }
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
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                  <Badge className={
                    order.priority === 'high' ? 'bg-red-100 text-red-800' :
                    order.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {order.priority}
                  </Badge>
                  <Button size="sm">Process</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
