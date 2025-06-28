
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

export const RevenueDisputesTab: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const disputes = [
    {
      id: 'D001',
      vendor: 'TechWorld Electronics',
      type: 'Commission Rate',
      amount: '৳2,450',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-15',
      description: 'Disagreement on commission calculation for bulk orders'
    },
    {
      id: 'D002',
      vendor: 'Fashion Hub BD',
      type: 'Payment Delay',
      amount: '৳1,800',
      status: 'investigating',
      priority: 'medium',
      createdAt: '2024-01-12',
      description: 'Delayed payment for December sales'
    },
    {
      id: 'D003',
      vendor: 'Home Essentials',
      type: 'Fee Deduction',
      amount: '৳950',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-10',
      description: 'Unexpected processing fee deduction'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'investigating': return <MessageSquare className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Revenue Disputes</h3>
          <p className="text-gray-600">Manage and resolve revenue-related disputes</p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Resolution
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2</div>
            <p className="text-xs text-muted-foreground">Days average</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Disputes</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Search disputes..." className="max-w-sm" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {disputes.map((dispute) => (
          <Card key={dispute.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(dispute.status)}
                  <div>
                    <CardTitle className="text-sm">Dispute #{dispute.id}</CardTitle>
                    <p className="text-xs text-gray-500">{dispute.vendor}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(dispute.priority)}>
                    {dispute.priority}
                  </Badge>
                  <Badge className={getStatusColor(dispute.status)}>
                    {dispute.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-gray-600">{dispute.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm text-gray-600 font-bold">{dispute.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-gray-600">{dispute.createdAt}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-gray-600">{dispute.description}</p>
              </div>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {dispute.status === 'pending' && (
                  <>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                    <Button size="sm">
                      Resolve
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Resolution Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dispute ID</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select dispute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D001">D001 - Commission Rate</SelectItem>
                  <SelectItem value="D002">D002 - Payment Delay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resolution Action</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve Claim</SelectItem>
                  <SelectItem value="partial">Partial Approval</SelectItem>
                  <SelectItem value="reject">Reject Claim</SelectItem>
                  <SelectItem value="investigate">Further Investigation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Resolution Notes</Label>
            <Textarea
              placeholder="Enter resolution details and reasoning..."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline">Save Draft</Button>
            <Button>Submit Resolution</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
