import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { microserviceClient } from '@/services/microserviceClient';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [healthStatus, setHealthStatus] = useState<Record<string, any>>({});
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeVendors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    
    const loadDashboardData = async () => {
      try {
        // Load microservice health status
        const health = await microserviceClient.healthCheck();
        setHealthStatus(health);

        // Load basic metrics from various services
        const [usersData, ordersData, vendorsData] = await Promise.allSettled([
          microserviceClient.userService('users?limit=1'),
          microserviceClient.orderService('orders?limit=1'),
          microserviceClient.vendorService('vendors?status=approved&limit=1')
        ]);

        setMetrics({
          totalUsers: usersData.status === 'fulfilled' ? usersData.value?.pagination?.total || 0 : 0,
          totalOrders: ordersData.status === 'fulfilled' ? ordersData.value?.pagination?.total || 0 : 0,
          totalRevenue: 0, // Calculate from orders
          activeVendors: vendorsData.status === 'fulfilled' ? vendorsData.value?.pagination?.total || 0 : 0
        });

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unhealthy':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">৳{metrics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeVendors.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Microservices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Microservices Health Status</CardTitle>
              <CardDescription>
                Real-time health monitoring of all microservices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(healthStatus).map(([serviceName, status]) => (
                  <Card key={serviceName} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{serviceName}</h4>
                          <p className="text-xs text-gray-600">
                            {status.timestamp ? new Date(status.timestamp).toLocaleTimeString() : 'No timestamp'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(status.status)}
                          <Badge className={getStatusColor(status.status)}>
                            {status.status}
                          </Badge>
                        </div>
                      </div>
                      {status.error && (
                        <p className="text-xs text-red-600 mt-2">{status.error}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>
                Platform performance and business metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">
                  This will include detailed metrics, charts, and insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Monitoring</CardTitle>
              <CardDescription>
                Infrastructure monitoring and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Monitoring dashboard coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">
                  This will include server metrics, logs, and alerts.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}