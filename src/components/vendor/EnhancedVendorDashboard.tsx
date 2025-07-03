import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VendorAnalytics {
  sales: {
    total_revenue: number;
    total_commission: number;
    order_count: number;
    avg_order_value: number;
  };
  products: {
    top_products: Array<{
      id: string;
      name: string;
      views: number;
      sales_count: number;
    }>;
    total_products: number;
  };
  period: string;
}

interface VendorProfile {
  id: string;
  business_name: string;
  status: string;
  verification_status: string;
  vendor_stores: Array<{
    store_name: string;
    is_active: boolean;
  }>;
  vendor_kyc_documents: Array<{
    document_type: string;
    verification_status: string;
  }>;
}

export const EnhancedVendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchVendorData();
    }
  }, [user]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);

      // Fetch vendor profile
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const profileResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vendor-management-service/profile`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch analytics if vendor exists
        if (profileData.id) {
          const analyticsResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vendor-management-service/analytics?vendor_id=${profileData.id}`,
            {
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (analyticsResponse.ok) {
            const analyticsData = await analyticsResponse.json();
            setAnalytics(analyticsData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationProgress = () => {
    if (!profile) return 0;
    const totalSteps = 4; // Basic info, store setup, KYC, bank details
    let completedSteps = 0;

    if (profile.business_name) completedSteps++;
    if (profile.vendor_stores.length > 0) completedSteps++;
    if (profile.vendor_kyc_documents.length > 0) completedSteps++;
    if (profile.status === 'approved') completedSteps++;

    return (completedSteps / totalSteps) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.business_name || 'Vendor'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant="outline" 
            className={`${getStatusColor(profile?.status || 'pending')} text-white`}
          >
            {profile?.status || 'Pending'}
          </Badge>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Verification Progress</div>
            <div className="flex items-center gap-2">
              <Progress value={getVerificationProgress()} className="w-24" />
              <span className="text-sm">{Math.round(getVerificationProgress())}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{analytics?.sales.total_revenue.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.sales.order_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Orders this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.products.total_products || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{Math.round(analytics?.sales.avg_order_value || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Your best-selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.products.top_products.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.views} views
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {product.sales_count} sold
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Complete your verification to start selling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Business Information</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {profile?.vendor_stores.length ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <span>Store Setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {profile?.vendor_kyc_documents.length ? (
                      profile?.verification_status === 'verified' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span>KYC Documents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {profile?.status === 'approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <span>Final Approval</span>
                  </div>
                </div>
                {getVerificationProgress() < 100 && (
                  <Button className="w-full mt-4" variant="outline">
                    Complete Verification
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Product management coming soon</h3>
                <p className="text-muted-foreground mb-4">
                  Full product management interface will be available here
                </p>
                <Button>Add New Product</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Order management coming soon</h3>
                <p className="text-muted-foreground mb-4">
                  Full order management interface will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>Detailed business insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced analytics coming soon</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive analytics dashboard will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification Documents</CardTitle>
              <CardDescription>Upload and manage verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile?.vendor_kyc_documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium capitalize">
                        {doc.document_type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Status: {doc.verification_status}
                      </div>
                    </div>
                    <Badge 
                      variant={doc.verification_status === 'verified' ? 'default' : 'secondary'}
                    >
                      {doc.verification_status}
                    </Badge>
                  </div>
                ))}
                {!profile?.vendor_kyc_documents.length && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No documents uploaded</h3>
                    <p className="text-muted-foreground mb-4">
                      Please upload your verification documents to complete the process
                    </p>
                    <Button>Upload Documents</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};