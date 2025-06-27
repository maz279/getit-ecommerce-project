
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Mail, Download, FileText } from 'lucide-react';

interface BulkActionsTabProps {
  selectedVendors: string[];
}

export const BulkActionsTab: React.FC<BulkActionsTabProps> = ({ selectedVendors }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Bulk Actions ({selectedVendors.length} vendors selected)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status Management</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Change Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Reason/Notes</label>
                <Textarea
                  placeholder="Enter reason for status change..."
                  rows={3}
                />
              </div>
              
              <Button className="w-full">
                Update Status
              </Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Communication</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Template</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Message</SelectItem>
                    <SelectItem value="verification">Verification Reminder</SelectItem>
                    <SelectItem value="promotion">Promotion Opportunity</SelectItem>
                    <SelectItem value="policy">Policy Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Export & Reports</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF Report
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Generate Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
