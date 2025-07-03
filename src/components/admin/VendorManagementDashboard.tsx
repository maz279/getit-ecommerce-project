import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Building, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  Download,
  Upload,
  TrendingUp,
  DollarSign,
  Package,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Vendor {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  status: string;
  registration_step: string;
  created_at: string;
  verified_at?: string;
  bangladesh_specific_data?: {
    division: string;
    district: string;
    upazila: string;
    preferred_language: string;
  };
}

interface VendorStats {
  total_vendors: number;
  active_vendors: number;
  pending_verification: number;
  suspended_vendors: number;
  total_revenue: number;
  avg_performance_score: number;
}

export const VendorManagementDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchVendors();
    fetchStats();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('vendors')
        .select(`
          *,
          vendor_stores (store_name, is_active),
          vendor_performance_analytics (performance_score)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      if (searchTerm) {
        query = query.or(`business_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVendors((data as any[])?.map(vendor => ({
        id: vendor.id,
        business_name: vendor.business_name,
        email: vendor.email || '',
        phone: vendor.phone || '',
        status: vendor.status,
        registration_step: vendor.registration_step || '',
        created_at: vendor.created_at,
        verified_at: vendor.verified_at,
        bangladesh_specific_data: vendor.bangladesh_specific_data
      })) || []);

    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get vendor counts by status
      const { data: vendorCounts } = await supabase
        .from('vendors')
        .select('status');

      const stats = {
        total_vendors: vendorCounts?.length || 0,
        active_vendors: vendorCounts?.filter((v: any) => v.status === 'active').length || 0,
        pending_verification: vendorCounts?.filter((v: any) => v.status === 'pending_verification').length || 0,
        suspended_vendors: vendorCounts?.filter(v => v.status === 'suspended').length || 0,
        total_revenue: 0, // This would come from order data
        avg_performance_score: 0 // This would come from analytics
      };

      setStats(stats);

    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleVendorAction = async (vendorId: string, action: 'approve' | 'suspend' | 'activate') => {
    try {
      let newStatus: string;
      switch (action) {
        case 'approve':
          newStatus = 'active';
          break;
        case 'suspend':
          newStatus = 'suspended';
          break;
        case 'activate':
          newStatus = 'active';
          break;
        default:
          return;
      }

      if (action === 'approve') {
        // Use the vendor service for approval
        const response = await supabase.functions.invoke('vendor-management-enhanced', {
          method: 'POST',
          body: { action: 'approve', vendor_id: vendorId }
        });

        if (response.error) throw response.error;
      } else {
        // Direct status update for other actions
        const { error } = await supabase
          .from('vendors')
          .update({ status: newStatus as any })
          .eq('id', vendorId);

        if (error) throw error;
      }

      toast.success(`Vendor ${action}d successfully`);
      await fetchVendors();
      await fetchStats();

    } catch (error: any) {
      console.error(`Error ${action}ing vendor:`, error);
      toast.error(`Failed to ${action} vendor`);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'pending_verification': 'secondary',
      'suspended': 'destructive',
      'rejected': 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending_verification':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'suspended':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    description?: string;
  }> = ({ title, value, icon, trend, description }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-muted-foreground">
            Manage vendor registrations, verifications, and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Vendors"
            value={stats.total_vendors}
            icon={<Users className="h-4 w-4" />}
            description="All registered vendors"
          />
          <StatCard
            title="Active Vendors"
            value={stats.active_vendors}
            icon={<Building className="h-4 w-4" />}
            description="Currently selling"
          />
          <StatCard
            title="Pending Verification"
            value={stats.pending_verification}
            icon={<FileCheck className="h-4 w-4" />}
            description="Awaiting KYC approval"
          />
          <StatCard
            title="Suspended"
            value={stats.suspended_vendors}
            icon={<AlertTriangle className="h-4 w-4" />}
            description="Temporarily disabled"
          />
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
              All Vendors
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setStatusFilter('pending_verification')}>
              Pending Verification
            </TabsTrigger>
            <TabsTrigger value="active" onClick={() => setStatusFilter('active')}>
              Active
            </TabsTrigger>
            <TabsTrigger value="suspended" onClick={() => setStatusFilter('suspended')}>
              Suspended
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value={statusFilter || 'all'} className="space-y-4">
          {/* Vendors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor List</CardTitle>
              <CardDescription>
                {vendors.length} vendors found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{vendor.business_name}</h4>
                          {getStatusBadge(vendor.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{vendor.email}</span>
                          <span>{vendor.phone}</span>
                          <span>{vendor.bangladesh_specific_data?.district}, {vendor.bangladesh_specific_data?.division}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Registered: {new Date(vendor.created_at).toLocaleDateString()}
                          {vendor.verified_at && (
                            <span className="ml-2">
                              • Verified: {new Date(vendor.verified_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(vendor.status)}
                      
                      {vendor.status === 'pending_verification' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVendorAction(vendor.id, 'approve')}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}

                      {vendor.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVendorAction(vendor.id, 'suspend')}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {vendor.status === 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVendorAction(vendor.id, 'activate')}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}

                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {vendors.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    No vendors found matching your criteria
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