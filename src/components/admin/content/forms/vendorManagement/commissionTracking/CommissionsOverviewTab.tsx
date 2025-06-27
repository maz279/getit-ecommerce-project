
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommissionTrackingService, VendorCommission } from '@/services/database/CommissionTrackingService';
import { Search, Filter, Eye, Edit, Download, CheckCircle, XCircle } from 'lucide-react';

export const CommissionsOverviewTab: React.FC = () => {
  const [commissions, setCommissions] = useState<VendorCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadCommissions();
  }, [statusFilter, typeFilter]);

  const loadCommissions = async () => {
    try {
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (typeFilter !== 'all') filters.commission_type = typeFilter;
      
      const data = await CommissionTrackingService.getCommissions(filters);
      setCommissions(data);
    } catch (error) {
      console.error('Error loading commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      calculated: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      paid: 'bg-emerald-100 text-emerald-800',
      disputed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      unpaid: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getCommissionTypeIcon = (type: string) => {
    switch (type) {
      case 'product_sale': return '🛒';
      case 'service_fee': return '⚙️';
      case 'advertising': return '📢';
      case 'subscription': return '📅';
      case 'penalty': return '⚠️';
      case 'bonus': return '🎁';
      default: return '💰';
    }
  };

  const filteredCommissions = commissions.filter(commission =>
    commission.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.vendor_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search by transaction ID or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="calculated">Calculated</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="product_sale">Product Sale</SelectItem>
                <SelectItem value="service_fee">Service Fee</SelectItem>
                <SelectItem value="advertising">Advertising</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="penalty">Penalty</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Commissions ({filteredCommissions.length})</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vendor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Commission</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{commission.transaction_id}</div>
                      <div className="text-sm text-gray-500">
                        Rate: {commission.commission_rate}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{commission.vendor_id}</div>
                      <div className="text-sm text-gray-500">{commission.category}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="mr-2">{getCommissionTypeIcon(commission.commission_type)}</span>
                        <span className="capitalize">{commission.commission_type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        ৳{commission.gross_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{commission.currency}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-green-600">
                        ৳{commission.commission_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Net: ৳{commission.net_commission.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(commission.status)}
                    </td>
                    <td className="py-3 px-4">
                      {getPaymentStatusBadge(commission.payment_status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">
                        {new Date(commission.transaction_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(commission.transaction_date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {commission.status === 'calculated' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCommissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No commissions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
