
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Users, Mail, Tag, Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { CustomerSearchData, BulkActionHistory } from './types';
import { bulkActionHistory } from './mockData';

interface BulkActionsTabProps {
  selectedCustomers: string[];
  onBulkAction: (action: string) => void;
  customers: CustomerSearchData[];
}

export const BulkActionsTab: React.FC<BulkActionsTabProps> = ({
  selectedCustomers,
  onBulkAction,
  customers
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [actionMessage, setActionMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleExecuteAction = async () => {
    if (!selectedAction || selectedCustomers.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          onBulkAction(selectedAction);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const bulkActions = [
    { value: 'send_email', label: 'Send Email Campaign', icon: Mail },
    { value: 'update_tier', label: 'Update Customer Tier', icon: Tag },
    { value: 'export_data', label: 'Export Customer Data', icon: Download },
    { value: 'send_sms', label: 'Send SMS Campaign', icon: Mail },
    { value: 'add_tags', label: 'Add Tags', icon: Tag },
    { value: 'remove_tags', label: 'Remove Tags', icon: Tag }
  ];

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Bulk Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{selectedCustomers.length} customers selected</p>
              <p className="text-sm text-gray-600">
                Choose an action to perform on all selected customers
              </p>
            </div>
            {selectedCustomers.length > 0 && (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {selectedCustomers.length}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCustomers.length > 0 && (
        <>
          {/* Action Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an action..." />
                  </SelectTrigger>
                  <SelectContent>
                    {bulkActions.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        <div className="flex items-center space-x-2">
                          <action.icon className="h-4 w-4" />
                          <span>{action.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAction && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message/Instructions (optional)
                  </label>
                  <Textarea
                    placeholder="Enter additional instructions or message content..."
                    value={actionMessage}
                    onChange={(e) => setActionMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {selectedAction && (
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>This action will affect {selectedCustomers.length} customers</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedAction('');
                        setActionMessage('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleExecuteAction}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Execute Action'}
                    </Button>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing...</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Customers Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {customers.slice(0, 10).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-600">{customer.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {customer.tier}
                    </Badge>
                  </div>
                ))}
                {customers.length > 10 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    ... and {customers.length - 10} more customers
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Action History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bulkActionHistory.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    action.status === 'completed' ? 'bg-green-100 text-green-600' :
                    action.status === 'failed' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action.action}</p>
                    <p className="text-xs text-gray-600">
                      {action.customerCount} customers • by {action.performedBy}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={action.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {action.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{action.performedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
