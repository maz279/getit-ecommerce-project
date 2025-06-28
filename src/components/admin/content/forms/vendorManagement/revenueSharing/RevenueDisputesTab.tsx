
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Clock, CheckCircle, XCircle, Plus, Eye, MessageSquare } from 'lucide-react';
import { RevenueSharingService } from '@/services/database/revenue/RevenueSharingService';
import { useToast } from '@/components/ui/use-toast';

interface RevenueDispute {
  id: string;
  dispute_number: string;
  vendor_id: string;
  commission_id?: string;
  dispute_type: string;
  dispute_amount: number;
  claimed_amount?: number;
  dispute_reason: string;
  dispute_description?: string;
  evidence_documents: any[];
  status: string;
  priority_level: string;
  assigned_to?: string;
  resolution_notes?: string;
  resolution_amount?: number;
  resolved_by?: string;
  resolved_at?: string;
  expected_resolution_date?: string;
  escalation_level: number;
  created_at: string;
}

export const RevenueDisputesTab: React.FC = () => {
  const [disputes, setDisputes] = useState<RevenueDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<RevenueDispute | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [formData, setFormData] = useState({
    vendor_id: '',
    dispute_type: 'calculation_error',
    dispute_amount: 0,
    claimed_amount: '',
    dispute_reason: '',
    dispute_description: '',
    priority_level: 'medium',
    expected_resolution_date: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    loadDisputes();
  }, [statusFilter, priorityFilter]);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const data = await RevenueSharingService.getRevenueDisputes({}, { limit: 100 });
      let filteredData = data;

      if (statusFilter !== 'all') {
        filteredData = filteredData.filter(d => d.status === statusFilter);
      }
      if (priorityFilter !== 'all') {
        filteredData = filteredData.filter(d => d.priority_level === priorityFilter);
      }

      setDisputes(filteredData);
    } catch (error) {
      console.error('Failed to load disputes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load revenue disputes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const disputeData = {
        ...formData,
        dispute_number: `DSP-${Date.now()}`,
        dispute_amount: Number(formData.dispute_amount),
        claimed_amount: formData.claimed_amount ? Number(formData.claimed_amount) : null,
        evidence_documents: []
      };

      await RevenueSharingService.createRevenueDispute(disputeData);
      
      toast({
        title: 'Success',
        description: 'Revenue dispute created successfully'
      });

      setIsDialogOpen(false);
      resetForm();
      loadDisputes();
    } catch (error) {
      console.error('Failed to create dispute:', error);
      toast({
        title: 'Error',
        description: 'Failed to create revenue dispute',
        variant: 'destructive'
      });
    }
  };

  const handleStatusUpdate = async (disputeId: string, newStatus: string, resolutionNotes?: string, resolutionAmount?: number) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = '00000000-0000-0000-0000-000000000000'; // Replace with actual user ID
        if (resolutionNotes) updateData.resolution_notes = resolutionNotes;
        if (resolutionAmount) updateData.resolution_amount = resolutionAmount;
      }

      await RevenueSharingService.updateRevenueDispute(disputeId, updateData);
      
      toast({
        title: 'Success',
        description: 'Dispute status updated successfully'
      });

      loadDisputes();
    } catch (error) {
      console.error('Failed to update dispute status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update dispute status',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      vendor_id: '',
      dispute_type: 'calculation_error',
      dispute_amount: 0,
      claimed_amount: '',
      dispute_reason: '',
      dispute_description: '',
      priority_level: 'medium',
      expected_resolution_date: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertTriangle;
      case 'under_review': return Clock;
      case 'resolved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'escalated': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open': return 'bg-yellow-50 text-yellow-700';
      case 'under_review': return 'bg-blue-50 text-blue-700';
      case 'resolved': return 'bg-green-50 text-green-700';
      case 'rejected': return 'bg-red-50 text-red-700';
      case 'escalated': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low': return 'bg-green-50 text-green-700';
      case 'medium': return 'bg-yellow-50 text-yellow-700';
      case 'high': return 'bg-orange-50 text-orange-700';
      case 'critical': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getDisputeTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'calculation_error': 'Calculation Error',
      'payment_delay': 'Payment Delay',
      'rate_disagreement': 'Rate Disagreement',
      'other': 'Other'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Revenue Disputes</h3>
          <p className="text-gray-600">Manage and resolve revenue-related disputes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Dispute
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Revenue Dispute</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor_id">Vendor ID *</Label>
                    <Input
                      id="vendor_id"
                      value={formData.vendor_id}
                      onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                      required
                      placeholder="Enter vendor UUID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dispute_type">Dispute Type *</Label>
                    <Select value={formData.dispute_type} onValueChange={(value) => setFormData({ ...formData, dispute_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calculation_error">Calculation Error</SelectItem>
                        <SelectItem value="payment_delay">Payment Delay</SelectItem>
                        <SelectItem value="rate_disagreement">Rate Disagreement</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dispute_amount">Dispute Amount (৳) *</Label>
                    <Input
                      id="dispute_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.dispute_amount}
                      onChange={(e) => setFormData({ ...formData, dispute_amount: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="claimed_amount">Claimed Amount (৳)</Label>
                    <Input
                      id="claimed_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.claimed_amount}
                      onChange={(e) => setFormData({ ...formData, claimed_amount: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority_level">Priority Level *</Label>
                    <Select value={formData.priority_level} onValueChange={(value) => setFormData({ ...formData, priority_level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected_resolution_date">Expected Resolution</Label>
                    <Input
                      id="expected_resolution_date"
                      type="date"
                      value={formData.expected_resolution_date}
                      onChange={(e) => setFormData({ ...formData, expected_resolution_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispute_reason">Dispute Reason *</Label>
                  <Input
                    id="dispute_reason"
                    value={formData.dispute_reason}
                    onChange={(e) => setFormData({ ...formData, dispute_reason: e.target.value })}
                    required
                    placeholder="Brief reason for the dispute"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispute_description">Detailed Description</Label>
                  <Textarea
                    id="dispute_description"
                    value={formData.dispute_description}
                    onChange={(e) => setFormData({ ...formData, dispute_description: e.target.value })}
                    placeholder="Provide detailed information about the dispute..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Dispute</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {disputes.filter(d => d.status === 'open').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {disputes.filter(d => d.status === 'under_review').length}
            </div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {disputes.filter(d => d.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{disputes.reduce((sum, d) => sum + d.dispute_amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">In disputes</p>
          </CardContent>
        </Card>
      </div>

      {/* Disputes List */}
      <Card>
        <CardHeader>
          <CardTitle>Disputes Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {disputes.map((dispute) => {
              const StatusIcon = getStatusIcon(dispute.status);
              
              return (
                <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <StatusIcon className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{dispute.dispute_number}</span>
                      <Badge className={getStatusColor(dispute.status)}>
                        {dispute.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(dispute.priority_level)}>
                        {dispute.priority_level}
                      </Badge>
                      <Badge variant="outline">
                        {getDisputeTypeLabel(dispute.dispute_type)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <div className="font-semibold">৳{dispute.dispute_amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Claimed:</span>
                        <div className="font-semibold">
                          {dispute.claimed_amount ? `৳${dispute.claimed_amount.toLocaleString()}` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <div className="font-medium">{new Date(dispute.created_at).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Vendor:</span>
                        <div className="font-medium text-blue-600">{dispute.vendor_id.slice(0, 8)}...</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{dispute.dispute_reason}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {dispute.status === 'open' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(dispute.id, 'under_review')}
                      >
                        Review
                      </Button>
                    )}
                    {dispute.status === 'under_review' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(dispute.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {disputes.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Disputes Found</h3>
              <p className="text-gray-500 mb-4">No revenue disputes match your current filters.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Dispute
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dispute Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Dispute Details - {selectedDispute?.dispute_number}
            </DialogTitle>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedDispute.status)}>
                    {selectedDispute.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge className={getPriorityColor(selectedDispute.priority_level)}>
                    {selectedDispute.priority_level}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dispute Amount</Label>
                  <p className="font-semibold">৳{selectedDispute.dispute_amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Claimed Amount</Label>
                  <p className="font-semibold">
                    {selectedDispute.claimed_amount ? `৳${selectedDispute.claimed_amount.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <Label>Dispute Reason</Label>
                <p>{selectedDispute.dispute_reason}</p>
              </div>
              {selectedDispute.dispute_description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{selectedDispute.dispute_description}</p>
                </div>
              )}
              {selectedDispute.resolution_notes && (
                <div>
                  <Label>Resolution Notes</Label>
                  <p className="text-sm text-gray-600">{selectedDispute.resolution_notes}</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
