
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

export const RecentActivityPanel: React.FC = () => {
  const recentOrders = [
    { id: '#12345', customer: 'John Doe', product: 'iPhone 14', amount: '৳85,000', status: 'Delivered', time: '2 min ago' },
    { id: '#12346', customer: 'Jane Smith', product: 'Samsung TV', amount: '৳45,000', status: 'Processing', time: '5 min ago' },
    { id: '#12347', customer: 'Bob Johnson', product: 'Nike Shoes', amount: '৳8,500', status: 'Shipped', time: '10 min ago' },
    { id: '#12348', customer: 'Alice Brown', product: 'MacBook Pro', amount: '৳125,000', status: 'Pending', time: '15 min ago' },
  ];

  const topVendors = [
    { name: 'TechHub BD', sales: '৳2.5M', orders: 1250, rating: 4.8, growth: '+12%' },
    { name: 'Fashion Point', sales: '৳1.8M', orders: 890, rating: 4.6, growth: '+8%' },
    { name: 'Home Essentials', sales: '৳1.2M', orders: 650, rating: 4.7, growth: '+15%' },
    { name: 'Sports World', sales: '৳980K', orders: 520, rating: 4.5, growth: '+5%' },
  ];

  const performanceMetrics = [
    { title: 'Conversion Rate', value: 68, color: 'bg-blue-500' },
    { title: 'Customer Satisfaction', value: 92, color: 'bg-green-500' },
    { title: 'Return Rate', value: 8, color: 'bg-red-500' }
  ];

  return (
    <>
      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Badge variant="secondary">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant={
                        order.status === 'Delivered' ? 'default' :
                        order.status === 'Processing' ? 'secondary' :
                        order.status === 'Shipped' ? 'outline' : 'destructive'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer} • {order.product}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Orders</Button>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVendors.map((vendor, index) => (
                <div key={vendor.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{vendor.rating}</span>
                        <span>•</span>
                        <span>{vendor.orders} orders</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{vendor.sales}</p>
                    <p className="text-sm text-green-600">{vendor.growth}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Vendors</Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Progress value={metric.value} className="h-2" />
                </div>
                <span className="text-sm font-medium">{metric.value}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {metric.title === 'Return Rate' ? '-1%' : '+2%'} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
