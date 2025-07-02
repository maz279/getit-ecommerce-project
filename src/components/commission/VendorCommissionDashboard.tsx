import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommissionSummary {
  totalEarned: number;
  totalPending: number;
  totalPaid: number;
  thisMonthEarnings: number;
  avgCommissionRate: number;
  totalOrders: number;
}

interface CommissionRecord {
  id: string;
  order_id: string;
  gross_amount: number;
  commission_amount: number;
  net_commission: number;
  status: string;
  transaction_date: string;
  category?: string;
}

export const VendorCommissionDashboard: React.FC = () => {
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    try {
      setLoading(true);
      
      // Fetch commission summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('commission_analytics')
        .select('*')
        .eq('vendor_id', 'current-vendor-id') // Replace with actual vendor ID
        .order('analytics_date', { ascending: false })
        .limit(1);

      if (summaryError) throw summaryError;

      // Fetch recent commissions
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('vendor_commissions')
        .select('*')
        .eq('vendor_id', 'current-vendor-id') // Replace with actual vendor ID
        .order('transaction_date', { ascending: false })
        .limit(50);

      if (commissionsError) throw commissionsError;

      // Process summary data
      if (summaryData && summaryData.length > 0) {
        const latestSummary = summaryData[0];
        setSummary({
          totalEarned: latestSummary.total_commission_earned || 0,
          totalPending: 5000, // Mock data - calculate from pending payouts
          totalPaid: latestSummary.total_commission_earned - 5000 || 0,
          thisMonthEarnings: latestSummary.total_commission_earned || 0,
          avgCommissionRate: latestSummary.commission_rate_percentage || 0,
          totalOrders: latestSummary.total_orders || 0
        });
      }

      setCommissions(commissionsData || []);
    } catch (error) {
      console.error('Error fetching commission data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch commission data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commission Dashboard</h1>
          <p className="text-muted-foreground">Track your earnings and commission payments</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold">৳{summary.totalEarned.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payout</p>
                  <p className="text-2xl font-bold text-yellow-600">৳{summary.totalPending.toLocaleString()}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-green-600">৳{summary.thisMonthEarnings.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Commission</p>
                  <p className="text-2xl font-bold">{summary.avgCommissionRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Progress</CardTitle>
                <CardDescription>Progress towards next payout threshold</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: ৳{summary?.totalPending.toLocaleString()}</span>
                    <span>Target: ৳10,000</span>
                  </div>
                  <Progress value={(summary?.totalPending || 0) / 100} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  ৳{(10000 - (summary?.totalPending || 0)).toLocaleString()} more needed for next payout
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{summary?.totalOrders || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{summary?.avgCommissionRate.toFixed(1) || 0}%</p>
                    <p className="text-sm text-muted-foreground">Avg Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest commission-earning transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(commission.status)}`} />
                      <div>
                        <p className="font-medium">Order #{commission.order_id?.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(commission.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{commission.commission_amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(commission.status)}
                        <Badge variant="outline" className="text-xs">
                          {commission.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Track your commission payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Payouts Yet</h3>
                <p className="text-muted-foreground">Your payouts will appear here once processed</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Analytics</CardTitle>
              <CardDescription>Detailed performance insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">Detailed analytics and insights will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};