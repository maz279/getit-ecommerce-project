import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, UserCheck, UserX, AlertTriangle, Eye, Shield } from 'lucide-react';
import { useWebSocket } from '@/components/realtime/WebSocketProvider';
import { supabase } from '@/integrations/supabase/client';

interface Vendor {
  id: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verification_status: 'pending' | 'verified' | 'failed';
  created_at: string;
  business_type: string;
  trade_license_number?: string;
  tin_number?: string;
  nid_number?: string;
  total_products: number;
  total_sales: number;
  rating: number;
}

interface VendorAnalytics {
  totalVendors: number;
  pendingApproval: number;
  activeVendors: number;
  suspendedVendors: number;
  recentApplications: number;
  averageRating: number;
}

export const VendorManagementDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const { subscribe, sendMessage, isConnected } = useWebSocket();

  useEffect(() => {
    fetchVendors();
    fetchAnalytics();
  }, []);

  // Subscribe to real-time vendor updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('vendor_update', (message) => {
      const { action, vendor } = message.payload;
      
      setVendors(prev => {
        switch (action) {
          case 'application_submitted':
          case 'updated':
            const exists = prev.find(v => v.id === vendor.id);
            if (exists) {
              return prev.map(v => v.id === vendor.id ? vendor : v);
            }
            return [vendor, ...prev];
          case 'status_changed':
            return prev.map(v => 
              v.id === vendor.id ? { ...v, status: vendor.status } : v
            );
          default:
            return prev;
        }
      });

      fetchAnalytics();
    });

    return unsubscribe;
  }, [subscribe, isConnected]);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          *,
          products(count),
          orders(total_amount.sum())
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedVendors = data?.map(vendor => ({
        ...vendor,
        total_products: vendor.products?.[0]?.count || 0,
        total_sales: vendor.orders?.[0]?.sum || 0,
        rating: Math.random() * 2 + 3 // Mock rating for now
      })) || [];

      setVendors(formattedVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data: vendorsData } = await supabase
        .from('vendors')
        .select('status, verification_status, created_at');

      if (!vendorsData) return;

      const totalVendors = vendorsData.length;
      const pendingApproval = vendorsData.filter(v => v.status === 'pending').length;
      const activeVendors = vendorsData.filter(v => v.status === 'approved').length;
      const suspendedVendors = vendorsData.filter(v => v.status === 'suspended').length;

      // Recent applications (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentApplications = vendorsData.filter(
        v => new Date(v.created_at) > weekAgo
      ).length;

      const averageRating = 4.2; // Mock average rating

      setAnalytics({
        totalVendors,
        pendingApproval,
        activeVendors,
        suspendedVendors,
        recentApplications,
        averageRating
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleVendorAction = async (vendorId: string, action: 'approve' | 'reject' | 'suspend' | 'reactivate') => {
    try {
      let newStatus = '';
      switch (action) {
        case 'approve':
          newStatus = 'approved';
          break;
        case 'reject':
          newStatus = 'rejected';
          break;
        case 'suspend':
          newStatus = 'suspended';
          break;
        case 'reactivate':
          newStatus = 'approved';
          break;
      }

      await supabase
        .from('vendors')
        .update({ status: newStatus })
        .eq('id', vendorId);

      // Send real-time update
      sendMessage({
        type: 'vendor_status_update',
        payload: { vendorId, status: newStatus, action },
        timestamp: Date.now(),
        source: 'admin_dashboard'
      });

      fetchVendors();
      fetchAnalytics();
    } catch (error) {
      console.error(`Error ${action}ing vendor:`, error);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      suspended: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getVerificationBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      verified: 'default',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'} className="ml-2">
        {status === 'verified' ? '✓ Verified' : status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.recentApplications} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{analytics.pendingApproval}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <UserCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{analytics.activeVendors}</div>
              <p className="text-xs text-muted-foreground">
                {((analytics.activeVendors / analytics.totalVendors) * 100).toFixed(1)}% approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Platform quality</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
          <CardDescription>
            Manage vendor applications and accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{vendor.business_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {vendor.contact_person} • {vendor.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(vendor.status)}
                      {getVerificationBadge(vendor.verification_status)}
                      <span className="text-sm text-muted-foreground">
                        {vendor.total_products} products • Rating: {vendor.rating.toFixed(1)}
                      </span>
                    </div>
                    {vendor.business_type && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {vendor.business_type}
                        {vendor.trade_license_number && ` • TL: ${vendor.trade_license_number}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {vendor.status === 'pending' && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleVendorAction(vendor.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleVendorAction(vendor.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {vendor.status === 'approved' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleVendorAction(vendor.id, 'suspend')}
                    >
                      Suspend
                    </Button>
                  )}
                  
                  {vendor.status === 'suspended' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleVendorAction(vendor.id, 'reactivate')}
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredVendors.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No vendors found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Vendor Details - {selectedVendor.business_name}</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedVendor(null)}
                className="absolute top-4 right-4"
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Contact Person</h4>
                    <p className="text-sm text-muted-foreground">{selectedVendor.contact_person}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-muted-foreground">{selectedVendor.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-sm text-muted-foreground">{selectedVendor.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Business Type</h4>
                    <p className="text-sm text-muted-foreground">{selectedVendor.business_type}</p>
                  </div>
                </div>
                
                {(selectedVendor.trade_license_number || selectedVendor.tin_number || selectedVendor.nid_number) && (
                  <div>
                    <h4 className="font-medium">Documentation</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {selectedVendor.trade_license_number && (
                        <p>Trade License: {selectedVendor.trade_license_number}</p>
                      )}
                      {selectedVendor.tin_number && (
                        <p>TIN: {selectedVendor.tin_number}</p>
                      )}
                      {selectedVendor.nid_number && (
                        <p>NID: {selectedVendor.nid_number}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Total Products</h4>
                    <p className="text-sm text-muted-foreground">{selectedVendor.total_products}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Total Sales</h4>
                    <p className="text-sm text-muted-foreground">৳{selectedVendor.total_sales.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Rating</h4>
                    <p className="text-sm text-muted-foreground">{selectedVendor.rating.toFixed(1)}/5.0</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Joined</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedVendor.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};