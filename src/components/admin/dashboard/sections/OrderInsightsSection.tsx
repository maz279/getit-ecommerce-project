
import React from 'react';
import { ShoppingCart, TrendingUp, Clock, MapPin, CreditCard, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export const OrderInsightsSection: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold flex items-center">
        <ShoppingCart className="h-6 w-6 mr-2 text-purple-600" />
        Order Insights & Analytics
      </h2>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">Today</Button>
        <Button variant="outline" size="sm">This Week</Button>
        <Button variant="outline" size="sm">This Month</Button>
      </div>
    </div>

    {/* Order Statistics */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-700">Orders Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">324</div>
          <div className="flex items-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-gray-500">+12% from yesterday</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-700">Revenue Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">৳45,890</div>
          <span className="text-xs text-gray-500">Average: ৳142 per order</span>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-700">Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">67</div>
          <span className="text-xs text-gray-500">Awaiting processing</span>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-orange-700">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">94.5%</div>
          <Progress value={94.5} className="mt-2" />
        </CardContent>
      </Card>
    </div>

    {/* Order Status Distribution */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Order Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'Confirmed', count: 89, color: 'bg-blue-500', percentage: 35 },
            { status: 'Processing', count: 67, color: 'bg-yellow-500', percentage: 27 },
            { status: 'Shipped', count: 45, color: 'bg-purple-500', percentage: 18 },
            { status: 'Delivered', count: 32, color: 'bg-green-500', percentage: 13 },
            { status: 'Cancelled', count: 18, color: 'bg-red-500', percentage: 7 }
          ].map((item, index) => (
            <div key={index} className="text-center p-4 border rounded-lg">
              <div className={`w-12 h-12 ${item.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                {item.count}
              </div>
              <div className="font-semibold text-sm">{item.status}</div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
              <Progress value={item.percentage} className="mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Regional Order Distribution */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Orders by Region
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { region: 'Dhaka Division', orders: 145, revenue: '৳18,450', growth: '+15%' },
              { region: 'Chittagong Division', orders: 89, revenue: '৳12,300', growth: '+8%' },
              { region: 'Sylhet Division', orders: 67, revenue: '৳8,900', growth: '+12%' },
              { region: 'Rajshahi Division', orders: 45, revenue: '৳5,600', growth: '+5%' }
            ].map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">{region.region}</div>
                  <div className="text-sm text-gray-500">{region.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{region.revenue}</div>
                  <Badge variant="secondary" className="text-xs">
                    {region.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[
              { region: 'Khulna Division', orders: 34, revenue: '৳4,200', growth: '+3%' },
              { region: 'Barisal Division', orders: 28, revenue: '৳3,400', growth: '+7%' },
              { region: 'Rangpur Division', orders: 23, revenue: '৳2,800', growth: '+2%' },
              { region: 'Mymensingh Division', orders: 19, revenue: '৳2,100', growth: '+4%' }
            ].map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">{region.region}</div>
                  <div className="text-sm text-gray-500">{region.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{region.revenue}</div>
                  <Badge variant="secondary" className="text-xs">
                    {region.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Payment & Delivery Insights */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { method: 'Cash on Delivery', percentage: 45, count: 146 },
              { method: 'bKash', percentage: 25, count: 81 },
              { method: 'Nagad', percentage: 15, count: 49 },
              { method: 'Rocket', percentage: 10, count: 32 },
              { method: 'Bank Card', percentage: 5, count: 16 }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{payment.method}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{payment.count}</span>
                  <div className="w-20">
                    <Progress value={payment.percentage} />
                  </div>
                  <span className="text-xs text-gray-500">{payment.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Delivery Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">2.3</div>
                <div className="text-xs text-gray-600">Avg Delivery Days</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">94%</div>
                <div className="text-xs text-gray-600">On-time Delivery</div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { service: 'Same Day Delivery', orders: 45, percentage: 35 },
                { service: 'Next Day Delivery', orders: 67, percentage: 52 },
                { service: 'Standard Delivery', orders: 89, percentage: 69 }
              ].map((delivery, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{delivery.service}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{delivery.orders}</span>
                    <div className="w-16">
                      <Progress value={delivery.percentage} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
