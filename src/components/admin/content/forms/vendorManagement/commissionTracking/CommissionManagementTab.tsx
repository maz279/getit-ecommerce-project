
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Download, 
  Upload,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { 
  EnhancedCommissionTrackingService, 
  EnhancedVendorCommission, 
  CommissionFilters,
  PaginationParams,
  CommissionInsert
} from '@/services/database/EnhancedCommissionTrackingService';

export const CommissionManagementTab: React.FC = () => {
  // State management
  const [commissions, setCommissions] = useState<EnhancedVendorCommission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [filters, setFilters] = useState<CommissionFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    per_page: 50,
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentCommission, setCurrentCommission] = useState<EnhancedVendorCommission | null>(null);

  // Form states
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<CommissionInsert>>({});

  // Load commissions data
  const loadCommissions = async () => {
    setLoading(true);
    try {
      const response = await EnhancedCommissionTrackingService.getCommissions(filters, pagination);
      setCommissions(response.data);
      setTotalPages(response.total_pages);
      setTotalRecords(response.total);
    } catch (error) {
      console.error('Error loading commissions:', error);
      toast.error('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadCommissions();
  }, [filters, pagination]);

  // Event handlers
  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
    setPagination({ ...pagination, page: 1 });
  };

  const handleFilterChange = (key: keyof CommissionFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleCreate = async () => {
    try {
      if (!formData.vendor_id || !formData.commission_amount || !formData.commission_rate) {
        toast.error('Please fill in all required fields');
        return;
      }

      await EnhancedCommissionTrackingService.createCommission(formData as CommissionInsert);
      toast.success('Commission created successfully');
      setShowCreateModal(false);
      setFormData({});
      loadCommissions();
    } catch (error) {
      console.error('Error creating commission:', error);
      toast.error('Failed to create commission');
    }
  };

  const handleEdit = async () => {
    try {
      if (!currentCommission?.id) return;

      await EnhancedCommissionTrackingService.updateCommission(currentCommission.id, formData);
      toast.success('Commission updated successfully');
      setShowEditModal(false);
      setCurrentCommission(null);
      setFormData({});
      loadCommissions();
    } catch (error) {
      console.error('Error updating commission:', error);
      toast.error('Failed to update commission');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this commission?')) return;

    try {
      await EnhancedCommissionTrackingService.deleteCommission(id);
      toast.success('Commission deleted successfully');
      loadCommissions();
    } catch (error) {
      console.error('Error deleting commission:', error);
      toast.error('Failed to delete commission');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCommissions.length === 0) {
      toast.error('Please select commissions to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedCommissions.length} commissions?`)) return;

    try {
      await EnhancedCommissionTrackingService.bulkDeleteCommissions(selectedCommissions);
      toast.success(`${selectedCommissions.length} commissions deleted successfully`);
      setSelectedCommissions([]);
      loadCommissions();
    } catch (error) {
      console.error('Error bulk deleting commissions:', error);
      toast.error('Failed to delete commissions');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCommissions(commissions.map(c => c.id));
    } else {
      setSelectedCommissions([]);
    }
  };

  const handleSelectCommission = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCommissions([...selectedCommissions, id]);
    } else {
      setSelectedCommissions(selectedCommissions.filter(cId => cId !== id));
    }
  };

  const openEditModal = (commission: EnhancedVendorCommission) => {
    setCurrentCommission(commission);
    setFormData(commission);
    setShowEditModal(true);
  };

  const openViewModal = (commission: EnhancedVendorCommission) => {
    setCurrentCommission(commission);
    setShowViewModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      paid: 'bg-blue-100 text-blue-800',
      disputed: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusIcons = {
      paid: <CheckCircle className="h-4 w-4 text-green-600" />,
      unpaid: <Clock className="h-4 w-4 text-yellow-600" />,
      failed: <XCircle className="h-4 w-4 text-red-600" />,
    };
    return (
      <div className="flex items-center space-x-1">
        {statusIcons[paymentStatus as keyof typeof statusIcons]}
        <span className="capitalize">{paymentStatus}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Commission Management</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={loadCommissions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Commission
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.payment_status || ''} onValueChange={(value) => handleFilterChange('payment_status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Payment Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedCommissions.length > 0 && (
            <div className="flex items-center space-x-2 mb-4 p-2 bg-blue-50 rounded-md">
              <span className="text-sm text-blue-700">
                {selectedCommissions.length} item(s) selected
              </span>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Commissions Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCommissions.length === commissions.length && commissions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : commissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4 text-gray-500">
                      No commissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCommissions.includes(commission.id)}
                          onCheckedChange={(checked) => handleSelectCommission(commission.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{commission.transaction_id}</TableCell>
                      <TableCell>{commission.vendor_id}</TableCell>
                      <TableCell>৳{commission.gross_amount.toLocaleString()}</TableCell>
                      <TableCell>৳{commission.commission_amount.toLocaleString()}</TableCell>
                      <TableCell>{commission.commission_rate}%</TableCell>
                      <TableCell>{getStatusBadge(commission.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(commission.payment_status)}</TableCell>
                      <TableCell>{new Date(commission.transaction_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => openViewModal(commission)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(commission)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(commission.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.per_page) + 1} to {Math.min(pagination.page * pagination.per_page, totalRecords)} of {totalRecords} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <span className="text-sm">Page {pagination.page} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === totalPages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Commission Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Commission</DialogTitle>
            <DialogDescription>Add a new commission entry to the system</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transaction_id">Transaction ID</Label>
              <Input
                id="transaction_id"
                value={formData.transaction_id || ''}
                onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="vendor_id">Vendor ID</Label>
              <Input
                id="vendor_id"
                value={formData.vendor_id || ''}
                onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="gross_amount">Gross Amount</Label>
              <Input
                id="gross_amount"
                type="number"
                value={formData.gross_amount || ''}
                onChange={(e) => setFormData({ ...formData, gross_amount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="commission_rate">Commission Rate (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                step="0.01"
                value={formData.commission_rate || ''}
                onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="commission_amount">Commission Amount</Label>
              <Input
                id="commission_amount"
                type="number"
                value={formData.commission_amount || ''}
                onChange={(e) => setFormData({ ...formData, commission_amount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="commission_type">Commission Type</Label>
              <Select
                value={formData.commission_type || ''}
                onValueChange={(value) => setFormData({ ...formData, commission_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Commission</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Commission Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Commission</DialogTitle>
            <DialogDescription>Update commission details</DialogDescription>
          </DialogHeader>
          {/* Similar form fields as create modal */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Commission</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Commission Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commission Details</DialogTitle>
            <DialogDescription>View commission information</DialogDescription>
          </DialogHeader>
          {currentCommission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Transaction ID</Label>
                  <div className="font-medium">{currentCommission.transaction_id}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(currentCommission.status)}</div>
                </div>
                <div>
                  <Label>Gross Amount</Label>
                  <div className="font-medium">৳{currentCommission.gross_amount.toLocaleString()}</div>
                </div>
                <div>
                  <Label>Commission Amount</Label>
                  <div className="font-medium">৳{currentCommission.commission_amount.toLocaleString()}</div>
                </div>
                <div>
                  <Label>Commission Rate</Label>
                  <div className="font-medium">{currentCommission.commission_rate}%</div>
                </div>
                <div>
                  <Label>Payment Status</Label>
                  <div>{getPaymentStatusBadge(currentCommission.payment_status)}</div>
                </div>
              </div>
              {currentCommission.notes && (
                <div>
                  <Label>Notes</Label>
                  <div className="text-sm text-gray-600">{currentCommission.notes}</div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
