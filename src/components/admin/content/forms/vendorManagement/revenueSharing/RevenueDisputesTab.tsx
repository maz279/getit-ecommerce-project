
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { RevenueSharingService } from '@/services/database/revenue/RevenueSharingService';
import { RevenueDispute } from '@/types/revenue';

export const RevenueDisputesTab: React.FC = () => {
  const [disputes, setDisputes] = useState<RevenueDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const data = await RevenueSharingService.getRevenueDisputes();
      // Type cast with proper JSON parsing
      const typedDisputes: RevenueDispute[] = data.map(dispute => ({
        ...dispute,
        evidence_documents: Array.isArray(dispute.evidence_documents) 
          ? dispute.evidence_documents 
          : typeof dispute.evidence_documents === 'string' 
            ? JSON.parse(dispute.evidence_documents) 
            : []
      }));
      setDisputes(typedDisputes);
    } catch (error) {
      console.error('Error loading disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'escalated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    const statusMatch = statusFilter === 'all' || dispute.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || dispute.priority_level === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const disputeStats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
    critical: disputes.filter(d => d.priority_level === 'critical').length
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading disputes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Revenue Disputes</h3>
          <p className="text-gray-600">Manage and resolve revenue-related disputes</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <div className="text-2xl font-bold text-gray-900">{disputeStats.total}</div>
            <div className="text-sm text-gray-500">Total Disputes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <div className="text-2xl font-bold text-orange-600">{disputeStats.open}</div>
            <div className="text-sm text-gray-500">Open Disputes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <div className="text-2xl font-bold text-green-600">{disputeStats.resolved}</div>
            <div className="text-sm text-gray-500">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <div className="text-2xl font-bold text-red-600">{disputeStats.critical}</div>
            <div className="text-sm text-gray-500">Critical Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
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
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Priority:</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Search disputes..." className="max-w-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.map((dispute) => (
          <Card key={dispute.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{dispute.dispute_number}</h4>
                    <Badge className={getStatusColor(dispute.status)}>
                      {getStatusIcon(dispute.status)}
                      <span className="ml-1 capitalize">{dispute.status.replace('_', ' ')}</span>
                    </Badge>
                    <Badge className={getPriorityColor(dispute.priority_level)}>
                      {dispute.priority_level.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{dispute.dispute_reason}</p>
                  {dispute.dispute_description && (
                    <p className="text-sm text-gray-500 mb-3">{dispute.dispute_description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Dispute Amount:</span>
                      <p className="font-medium">৳{dispute.dispute_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Claimed Amount:</span>
                      <p className="font-medium">৳{dispute.claimed_amount?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-medium capitalize">{dispute.dispute_type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="font-medium">{new Date(dispute.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {dispute.status === 'open' && (
                    <Button size="sm">
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDisputes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
            <p className="text-gray-500 text-center">
              {statusFilter !== 'all' || priorityFilter !== 'all'
                ? "No disputes match your current filters."
                : "There are no revenue disputes at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
