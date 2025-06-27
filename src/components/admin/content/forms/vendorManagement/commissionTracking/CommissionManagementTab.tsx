
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedCommissionTrackingService, EnhancedVendorCommission } from '@/services/database/EnhancedCommissionTrackingService';
import { CommissionCacheService } from '@/services/cache/CommissionCacheService';
import { CommissionElasticsearchService } from '@/services/search/CommissionElasticsearchService';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, 
  Calculator, DollarSign, Calendar, User, TrendingUp, AlertCircle,
  CheckCircle, XCircle, Clock, FileText, Settings, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface CommissionFilters {
  vendor_id?: string;
  status?: string;
  payment_status?: string;
  commission_type?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
}

export const CommissionManagementTab: React.FC = () => {
  const [commissions, setCommissions] = useState<EnhancedVendorCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommission, setSelectedCommission] = useState<EnhancedVendorCommission | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCalculateDialog, setShowCalculateDialog] = useState(false);
  const [filters, setFilters] = useState<CommissionFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadCommissions();
  }, [filters, currentPage, searchTerm]);

  const loadCommissions = async () => {
    try {
      setLoading(true);
      
      // Try cache first
      const cacheKey = { ...filters, page: currentPage, search: searchTerm };
      let cachedCommissions = await CommissionCacheService.getCachedCommissionList(cacheKey);
      
      if (cachedCommissions) {
        setCommissions(cachedCommissions);
        setLoading(false);
        return;
      }

      // Use Elasticsearch for search, otherwise use database
      if (searchTerm.trim()) {
        const searchResult = await CommissionElasticsearchService.searchCommissions(
          searchTerm,
          {
            vendor_ids: filters.vendor_id ? [filters.vendor_id] : undefined,
            statuses: filters.status ? [filters.status] : undefined,
            payment_statuses: filters.payment_status ? [filters.payment_status] : undefined,
            commission_types: filters.commission_type ? [filters.commission_type] : undefined,
            date_range: filters.date_from || filters.date_to ? {
              from: filters.date_from,
              to: filters.date_to
            } : undefined,
            amount_range: filters.amount_min || filters.amount_max ? {
              min: filters.amount_min,
              max: filters.amount_max
            } : undefined
          },
          {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            include_aggregations: true
          }
        );
        
        setCommissions(searchResult.results as any);
        setTotalItems(searchResult.total);
      } else {
        const data = await EnhancedCommissionTrackingService.getCommissions({
          ...filters,
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage
        });
        
        setCommissions(data);
        setTotalItems(data.length); // In real app, get total count from API
      }

      // Cache the results
      await CommissionCacheService.cacheCommissionList(cacheKey, commissions);
    } catch (error) {
      console.error('Error loading commissions:', error);
      toast.error('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommission = async (formData: Partial<EnhancedVendorCommission>) => {
    try {
      const newCommission = await EnhancedCommissionTrackingService.createCommission({
        ...formData,
        created_by: 'current-user-id', // In real app, get from auth context
        status: 'pending',
        payment_status: 'unpaid',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Update Elasticsearch index
      await CommissionElasticsearchService.indexCommission({
        ...newCommission,
        search_content: '',
        tags: []
      } as any);

      // Invalidate cache
      await CommissionCacheService.invalidateCommissionCache(newCommission.id);
      
      setCommissions(prev => [newCommission, ...prev]);
      setShowCreateDialog(false);
      toast.success('Commission created successfully');
    } catch (error) {
      console.error('Error creating commission:', error);
      toast.error('Failed to create commission');
    }
  };

  const handleUpdateCommission = async (id: string, updates: Partial<EnhancedVendorCommission>) => {
    try {
      const updatedCommission = await EnhancedCommissionTrackingService.updateCommission(id, {
        ...updates,
        updated_at: new Date().toISOString()
      });

      // Update Elasticsearch index
      await CommissionElasticsearchService.updateCommissionIndex(id, updatedCommission as any);

      // Invalidate cache
      await CommissionCacheService.invalidateCommissionCache(id);
      
      setCommissions(prev => prev.map(c => c.id === id ? updatedCommission : c));
      setShowEditDialog(false);
      setSelectedCommission(null);
      toast.success('Commission updated successfully');
    } catch (error) {
      console.error('Error updating commission:', error);
      toast.error('Failed to update commission');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedCommissions.length === 0) return;

    try {
      switch (bulkAction) {
        case 'approve':
          await EnhancedCommissionTrackingService.bulkApproveCommissions(
            selectedCommissions,
            'current-user-id'
          );
          toast.success(`${selectedCommissions.length} commissions approved`);
          break;
        case 'reject':
          await EnhancedCommissionTrackingService.bulkUpdateCommissions(
            selectedCommissions.map(id => ({
              id,
              data: { status: 'rejected', updated_at: new Date().toISOString() }
            }))
          );
          toast.success(`${selectedCommissions.length} commissions rejected`);
          break;
        case 'export':
          // Export functionality would be implemented here
          toast.success('Export started');
          break;
      }

      // Invalidate cache and reload
      await CommissionCacheService.flush('commissions:*');
      loadCommissions();
      setSelectedCommissions([]);
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Bulk action failed');
    }
  };

  const calculateCommission = async (vendorId: string, grossAmount: number, category?: string) => {
    try {
      const calculation = await EnhancedCommissionTrackingService.calculateCommission(
        vendorId,
        grossAmount,
        category
      );
      
      return calculation;
    } catch (error) {
      console.error('Commission calculation error:', error);
      toast.error('Failed to calculate commission');
      return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      paid: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800'
    };
    
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      paid: DollarSign,
      rejected: XCircle,
      disputed: AlertCircle
    };
    
    const Icon = icons[status as keyof typeof icons] || Clock;
    
    return (
      <Badge className={`${colors[status as keyof typeof colors]} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commission Management</h2>
          <p className="text-gray-600">Manage vendor commissions, rates, and payments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Commission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Commission</DialogTitle>
              </DialogHeader>
              <CreateCommissionForm onSubmit={handleCreateCommission} onCalculate={calculateCommission} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search commissions by transaction ID, vendor, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <CommissionFilters filters={filters} onFiltersChange={setFilters} />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCommissions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedCommissions.length} commission(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve Selected</SelectItem>
                    <SelectItem value="reject">Reject Selected</SelectItem>
                    <SelectItem value="export">Export Selected</SelectItem>
                    <SelectItem value="delete">Delete Selected</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                >
                  Execute
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commissions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCommissions.length === commissions.length && commissions.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCommissions(commissions.map(c => c.id));
                        } else {
                          setSelectedCommissions([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Transaction</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vendor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Commission</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCommissions.includes(commission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCommissions(prev => [...prev, commission.id]);
                          } else {
                            setSelectedCommissions(prev => prev.filter(id => id !== commission.id));
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{commission.transaction_id}</div>
                        <div className="text-sm text-gray-500">{commission.commission_type}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{commission.vendor_id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">৳{commission.gross_amount.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-green-600">৳{commission.commission_amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Rate: {commission.commission_rate}%</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(commission.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {new Date(commission.transaction_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCommission(commission);
                            // Show commission detail dialog
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCommission(commission);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} commissions
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-3 py-1 text-sm bg-gray-100 rounded">
            {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Commission</DialogTitle>
          </DialogHeader>
          {selectedCommission && (
            <EditCommissionForm
              commission={selectedCommission}
              onSubmit={(updates) => handleUpdateCommission(selectedCommission.id, updates)}
              onCalculate={calculateCommission}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Commission Filters Component
const CommissionFilters: React.FC<{
  filters: CommissionFilters;
  onFiltersChange: (filters: CommissionFilters) => void;
}> = ({ filters, onFiltersChange }) => {
  return (
    <div className="flex gap-2">
      <Select
        value={filters.status || ''}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value || undefined })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="disputed">Disputed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.payment_status || ''}
        onValueChange={(value) => onFiltersChange({ ...filters, payment_status: value || undefined })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Payment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Payments</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="partial">Partial</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

// Create Commission Form Component
const CreateCommissionForm: React.FC<{
  onSubmit: (data: Partial<EnhancedVendorCommission>) => void;
  onCalculate: (vendorId: string, grossAmount: number, category?: string) => Promise<any>;
}> = ({ onSubmit, onCalculate }) => {
  const [formData, setFormData] = useState<Partial<EnhancedVendorCommission>>({
    commission_type: 'sales',
    currency: 'BDT',
    exchange_rate: 1.0000
  });
  const [calculatedCommission, setCalculatedCommission] = useState<any>(null);

  const handleCalculate = async () => {
    if (formData.vendor_id && formData.gross_amount) {
      const result = await onCalculate(
        formData.vendor_id,
        formData.gross_amount,
        formData.category
      );
      setCalculatedCommission(result);
      if (result) {
        setFormData(prev => ({
          ...prev,
          commission_amount: result.commission_amount,
          commission_rate: result.commission_rate,
          platform_fee: result.platform_fee,
          net_commission: result.net_commission
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="calculation">Calculation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor_id">Vendor ID *</Label>
              <Input
                id="vendor_id"
                value={formData.vendor_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor_id: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="transaction_id">Transaction ID *</Label>
              <Input
                id="transaction_id"
                value={formData.transaction_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, transaction_id: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="commission_type">Commission Type</Label>
              <Select
                value={formData.commission_type || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, commission_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Commission</SelectItem>
                  <SelectItem value="referral">Referral Commission</SelectItem>
                  <SelectItem value="performance">Performance Bonus</SelectItem>
                  <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gross_amount">Gross Amount *</Label>
              <Input
                id="gross_amount"
                type="number"
                step="0.01"
                value={formData.gross_amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, gross_amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calculation" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Commission Calculation</h3>
            <Button type="button" onClick={handleCalculate} disabled={!formData.vendor_id || !formData.gross_amount}>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          </div>
          
          {calculatedCommission && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Calculation Results</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Commission Rate:</span>
                  <span className="ml-2 font-medium">{calculatedCommission.commission_rate}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Commission Amount:</span>
                  <span className="ml-2 font-medium">৳{calculatedCommission.commission_amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="ml-2 font-medium">৳{calculatedCommission.platform_fee.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Net Commission:</span>
                  <span className="ml-2 font-medium text-green-600">৳{calculatedCommission.net_commission.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="commission_rate">Commission Rate (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                step="0.01"
                value={formData.commission_rate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="commission_amount">Commission Amount</Label>
              <Input
                id="commission_amount"
                type="number"
                step="0.01"
                value={formData.commission_amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, commission_amount: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                  <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Create Commission</Button>
      </div>
    </form>
  );
};

// Edit Commission Form Component
const EditCommissionForm: React.FC<{
  commission: EnhancedVendorCommission;
  onSubmit: (updates: Partial<EnhancedVendorCommission>) => void;
  onCalculate: (vendorId: string, grossAmount: number, category?: string) => Promise<any>;
}> = ({ commission, onSubmit, onCalculate }) => {
  const [formData, setFormData] = useState<Partial<EnhancedVendorCommission>>(commission);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Similar structure to CreateCommissionForm but with existing data */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Transaction ID</Label>
          <Input value={formData.transaction_id} disabled />
        </div>
        <div>
          <Label>Vendor ID</Label>
          <Input value={formData.vendor_id} disabled />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payment_status">Payment Status</Label>
          <Select
            value={formData.payment_status || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Update Commission</Button>
      </div>
    </form>
  );
};
