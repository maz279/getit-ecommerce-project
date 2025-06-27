
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { mockDisputes } from './mockData';

export const RatingDisputesTab: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dispute Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Disputes</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-red-600">+5 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
                <p className="text-2xl font-bold">2.4d</p>
                <p className="text-xs text-green-600">-0.5d vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-green-600">+2% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Disputes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Active Disputes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDisputes.map((dispute) => (
              <div key={dispute.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">Dispute #{dispute.id}</span>
                      <Badge className={getPriorityColor(dispute.priority)}>
                        {dispute.priority} priority
                      </Badge>
                      <Badge className={getStatusColor(dispute.status)}>
                        {dispute.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Review ID:</strong> {dispute.reviewId}</p>
                      <p><strong>Vendor:</strong> {dispute.vendorName}</p>
                      <p><strong>Customer:</strong> {dispute.customerName}</p>
                      <p><strong>Reason:</strong> {dispute.disputeReason}</p>
                      <p><strong>Submitted:</strong> {dispute.submittedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded mb-3">
                  <h4 className="font-medium mb-2">Dispute Details</h4>
                  <p className="text-sm text-gray-700">
                    {dispute.disputeReason === 'Fake Review Claim' 
                      ? 'Vendor claims this review is fake and not from a legitimate customer. Request for investigation and possible removal.'
                      : 'Customer review contains inappropriate language and violates community guidelines.'
                    }
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>
                      {dispute.status === 'resolved' 
                        ? 'Resolved 2 days ago' 
                        : 'Open for 3 days'
                      }
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {dispute.status === 'under-review' && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button variant="outline" size="sm">
                          Escalate
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dispute Resolution Process */}
      <Card>
        <CardHeader>
          <CardTitle>Dispute Resolution Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Report Received</h4>
              <p className="text-sm text-gray-600">Dispute submitted by vendor or customer</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Investigation</h4>
              <p className="text-sm text-gray-600">Review evidence and gather information</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Decision</h4>
              <p className="text-sm text-gray-600">Make ruling based on evidence</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h4 className="font-medium mb-2">Resolution</h4>
              <p className="text-sm text-gray-600">Implement decision and notify parties</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
