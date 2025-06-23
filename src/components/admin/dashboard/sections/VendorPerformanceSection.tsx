
import React from 'react';
import { Store, TrendingUp, Star, Award, DollarSign, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/cards';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export const VendorPerformanceSection: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold flex items-center">
        <Store className="h-6 w-6 mr-2 text-purple-600" />
        Vendor Performance Analytics
      </h2>
      <Button variant="outline" size="sm">
        Export Report
      </Button>
    </div>

    {/* Performance Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Total Active Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">156</div>
          <span className="text-xs text-gray-500">+8 this month</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">4.7</div>
          <div className="flex items-center mt-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-500 ml-1">out of 5.0</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">৳2.4M</div>
          <span className="text-xs text-gray-500">This month</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Products Listed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">12.5K</div>
          <span className="text-xs text-gray-500">Active listings</span>
        </CardContent>
      </Card>
    </div>

    {/* Top Performing Vendors */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Top Performing Vendors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { name: 'TechZone BD', revenue: '৳245K', orders: 1234, rating: 4.9, growth: '+15%' },
            { name: 'Fashion Hub', revenue: '৳198K', orders: 987, rating: 4.8, growth: '+12%' },
            { name: 'Home Essentials', revenue: '৳167K', orders: 756, rating: 4.7, growth: '+8%' },
            { name: 'Sports World', revenue: '৳134K', orders: 645, rating: 4.6, growth: '+5%' },
            { name: 'Beauty Palace', revenue: '৳123K', orders: 567, rating: 4.8, growth: '+18%' }
          ].map((vendor, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">{vendor.name}</div>
                  <div className="text-sm text-gray-500">{vendor.orders} orders</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">{vendor.revenue}</div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs ml-1">{vendor.rating}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {vendor.growth}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Vendor Categories Performance */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Performance by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { category: 'Electronics', vendors: 45, revenue: '৳890K', growth: 85 },
            { category: 'Fashion', vendors: 38, revenue: '৳650K', growth: 72 },
            { category: 'Home & Garden', vendors: 25, revenue: '৳420K', growth: 58 },
            { category: 'Sports', vendors: 18, revenue: '৳280K', growth: 43 },
            { category: 'Beauty', vendors: 15, revenue: '৳190K', growth: 35 },
            { category: 'Books', vendors: 12, revenue: '৳95K', growth: 28 }
          ].map((category, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{category.category}</h4>
                <Badge variant="outline">{category.vendors} vendors</Badge>
              </div>
              <div className="text-lg font-bold text-green-600 mb-2">{category.revenue}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Performance</span>
                <span className="text-sm font-medium">{category.growth}%</span>
              </div>
              <Progress value={category.growth} className="mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Vendor Health Score */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Vendor Health Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <div className="text-sm text-gray-600">On-time Delivery</div>
            <Progress value={92} className="mt-2" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">4.7</div>
            <div className="text-sm text-gray-600">Avg Customer Satisfaction</div>
            <Progress value={94} className="mt-2" />
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">87%</div>
            <div className="text-sm text-gray-600">Order Fulfillment</div>
            <Progress value={87} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
