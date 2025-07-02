import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, TrendingUp, Clock, AlertCircle, CheckCircle, 
  RefreshCw, Download, Calendar, Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const EnhancedCommissionTracking: React.FC = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Setup real-time subscription for commission updates
    const channel = supabase
      .channel('commission-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vendor_commissions',
        },
        (payload) => {
          console.log('Commission update:', payload);
          setRealtimeEvents(prev => [
            { ...payload, timestamp: new Date() },
            ...prev.slice(0, 19)
          ]);
          
          // Update commissions list if needed
          if (payload.eventType === 'INSERT') {
            setCommissions(prev => [payload.new, ...prev]);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Load initial commission data
    loadCommissions();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCommissions = async () => {
    const { data, error } = await supabase
      .from('vendor_commissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setCommissions(data);
    }
  };

  const mockAnalytics = {
    monthlyEarnings: [
      { month: 'Jan', earned: 25000, pending: 5000 },
      { month: 'Feb', earned: 28000, pending: 4500 },
      { month: 'Mar', earned: 31500, pending: 6000 },
      { month: 'Apr', earned: 29000, pending: 3500 },
      { month: 'May', earned: 35000, pending: 7000 },
      { month: 'Jun', earned: 38500, pending: 5500 },
    ],
    commissionBreakdown: [
      { type: 'Sales Commission', amount: 145000, percentage: 60 },
      { type: 'Referral Bonus', amount: 45000, percentage: 25 },
      { type: 'Performance Bonus', amount: 35000, percentage: 15 },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission Tracking</h1>
          <p className="text-gray-600">
            Real-time commission monitoring and analytics
            <Badge variant={isConnected ? "default" : "secondary"} className="ml-2">
              {isConnected ? 'Live Updates' : 'Offline'}
            </Badge>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadCommissions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,25,500</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,200</div>
            <p className="text-xs text-muted-foreground">Expected: March 15</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹38,500</div>
            <p className="text-xs text-muted-foreground">From 156 orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="realtime">Live Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings Trend</CardTitle>
                <CardDescription>Earned vs pending commissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockAnalytics.monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="earned" fill="#10B981" name="Earned" />
                    <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
                <CardDescription>Commission by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAnalytics.commissionBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                    >
                      {mockAnalytics.commissionBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B'][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Commission Updates</CardTitle>
              <CardDescription>Real-time commission events and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {realtimeEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        event.eventType === 'INSERT' ? 'bg-green-500' :
                        event.eventType === 'UPDATE' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`} />
                      <div>
                        <p className="font-medium">
                          {event.eventType === 'INSERT' ? 'New Commission' :
                           event.eventType === 'UPDATE' ? 'Commission Updated' :
                           'Commission Event'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {event.timestamp?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      ₹{event.new?.commission_amount || 'N/A'}
                    </Badge>
                  </div>
                ))}
                {realtimeEvents.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Listening for live commission updates...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};