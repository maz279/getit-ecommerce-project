
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const RealtimeMetricsSection: React.FC = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 2345,
    salesPerMinute: 15,
    conversionRate: 3.2,
    serverLoad: 65
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        salesPerMinute: Math.max(0, prev.salesPerMinute + Math.floor(Math.random() * 6 - 3)),
        conversionRate: Math.max(0, prev.conversionRate + (Math.random() * 0.4 - 0.2)),
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + Math.floor(Math.random() * 10 - 5)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const realtimeData = [
    { time: '00:00', users: 1200, sales: 850, orders: 45 },
    { time: '00:05', users: 1350, sales: 920, orders: 52 },
    { time: '00:10', users: 1480, sales: 1100, orders: 48 },
    { time: '00:15', users: 1650, sales: 1250, orders: 61 },
    { time: '00:20', users: 1820, sales: 1400, orders: 55 },
    { time: '00:25', users: 2100, sales: 1650, orders: 68 },
    { time: '00:30', users: 2345, sales: 1850, orders: 72 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-time Metrics</h1>
          <p className="text-gray-600 mt-1">Live platform performance dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="default" className="bg-green-500">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
            Live
          </Badge>
          <Button>Export Data</Button>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Active Users
                </p>
                <p className="text-3xl font-bold text-blue-900">{metrics.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-blue-600">Currently online</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Sales/Minute
                </p>
                <p className="text-3xl font-bold text-green-900">{metrics.salesPerMinute}</p>
                <p className="text-sm text-green-600">Live transactions</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Conversion Rate
                </p>
                <p className="text-3xl font-bold text-purple-900">{metrics.conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-purple-600">Real-time rate</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Server Load
                </p>
                <p className="text-3xl font-bold text-orange-900">{metrics.serverLoad}%</p>
                <Progress value={metrics.serverLoad} className="mt-2" />
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Live Activity Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="users" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6} 
                name="Active Users"
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stackId="2"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6} 
                name="Sales (৳)"
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stackId="3"
                stroke="#ffc658" 
                fill="#ffc658" 
                fillOpacity={0.6} 
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Live Events Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Events Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[
                { type: 'sale', message: 'New order #12345 - Samsung Galaxy S23', amount: '৳85,000', time: 'Just now' },
                { type: 'user', message: 'New user registration: john.doe@email.com', time: '2 min ago' },
                { type: 'sale', message: 'Order completed #12344 - iPhone 14 Pro', amount: '৳125,000', time: '3 min ago' },
                { type: 'alert', message: 'Low stock alert: MacBook Air M2', time: '5 min ago' },
                { type: 'sale', message: 'New order #12343 - Nike Air Max', amount: '৳12,500', time: '7 min ago' }
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'sale' ? 'bg-green-500' : 
                      event.type === 'user' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium">{event.message}</p>
                      {event.amount && <p className="text-xs text-green-600 font-bold">{event.amount}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">High Traffic Alert</p>
                    <p className="text-xs text-yellow-600 mt-1">Traffic increased by 45% in the last hour</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-l-4 border-green-400 bg-green-50">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-800">Sales Milestone</p>
                    <p className="text-xs text-green-600 mt-1">Reached ৳1M in sales today</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-l-4 border-red-400 bg-red-50">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-800">System Alert</p>
                    <p className="text-xs text-red-600 mt-1">Database response time above threshold</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
