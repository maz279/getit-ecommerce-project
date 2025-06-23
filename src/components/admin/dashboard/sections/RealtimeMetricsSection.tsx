
import React from 'react';
import { Activity, Users, ShoppingCart, TrendingUp, Zap, Eye, Clock, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const RealtimeMetricsSection: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold flex items-center">
        <Activity className="h-6 w-6 mr-2 text-blue-600" />
        Real-time Metrics
      </h2>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">Live Data</span>
      </div>
    </div>

    {/* Key Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center text-green-700">
            <Users className="h-4 w-4 mr-2" />
            Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">1,234</div>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-gray-500">+12% from last hour</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center text-blue-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders/Hour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">89</div>
          <div className="flex items-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-gray-500">+5% increase</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center text-purple-700">
            <Zap className="h-4 w-4 mr-2" />
            Server Load
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">65%</div>
          <Progress value={65} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center text-orange-700">
            <Eye className="h-4 w-4 mr-2" />
            Page Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">45.2K</div>
          <span className="text-xs text-gray-500">Today</span>
        </CardContent>
      </Card>
    </div>

    {/* Live Activity Feed */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {[
            { action: 'New Order', user: 'Customer #1234', time: '2 seconds ago', type: 'order' },
            { action: 'User Registration', user: 'john@example.com', time: '15 seconds ago', type: 'user' },
            { action: 'Payment Received', user: 'Order #5678', time: '32 seconds ago', type: 'payment' },
            { action: 'Product Review', user: 'Customer #9876', time: '1 minute ago', type: 'review' },
            { action: 'Vendor Login', user: 'TechStore BD', time: '2 minutes ago', type: 'vendor' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Badge variant={
                  activity.type === 'order' ? 'default' : 
                  activity.type === 'payment' ? 'secondary' : 'outline'
                }>
                  {activity.type}
                </Badge>
                <div>
                  <span className="text-sm font-medium">{activity.action}</span>
                  <div className="text-xs text-gray-500">{activity.user}</div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Geographic Distribution */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Geographic Distribution (Live)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { city: 'Dhaka', users: 456, percentage: 45 },
            { city: 'Chittagong', users: 234, percentage: 23 },
            { city: 'Sylhet', users: 123, percentage: 12 },
            { city: 'Rajshahi', users: 89, percentage: 9 }
          ].map((location, index) => (
            <div key={index} className="text-center p-3 border rounded-lg">
              <div className="font-bold text-lg">{location.users}</div>
              <div className="text-sm text-gray-600">{location.city}</div>
              <Progress value={location.percentage} className="mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
