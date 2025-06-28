
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';

interface PayoutRequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const PayoutRequestForm: React.FC<PayoutRequestFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState({
    vendor_id: initialData?.vendor_id || '',
    request_amount: initialData?.request_amount || '',
    currency: initialData?.currency || 'BDT',
    payout_period_start: initialData?.payout_period_start ? new Date(initialData.payout_period_start) : new Date(),
    payout_period_end: initialData?.payout_period_end ? new Date(initialData.payout_period_end) : new Date(),
    payment_method: initialData?.payment_method || 'bank_transfer',
    bank_account_details: initialData?.bank_account_details || {
      account_number: '',
      bank_name: '',
      routing_number: '',
      account_holder_name: ''
    },
    mobile_banking_details: initialData?.mobile_banking_details || {
      provider: '',
      account_number: '',
      account_holder_name: ''
    },
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBankDetails = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bank_account_details: {
        ...(prev.bank_account_details || {}),
        [field]: value
      }
    }));
  };

  const updateMobileBankingDetails = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      mobile_banking_details: {
        ...(prev.mobile_banking_details || {}),
        [field]: value
      }
    }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Save className="h-5 w-5 mr-2" />
          {initialData ? 'Edit Payout Request' : 'Create New Payout Request'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor_id">Vendor ID</Label>
              <Input
                id="vendor_id"
                value={formData.vendor_id}
                onChange={(e) => updateFormData('vendor_id', e.target.value)}
                placeholder="Enter vendor ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request_amount">Request Amount</Label>
              <Input
                id="request_amount"
                type="number"
                step="0.01"
                value={formData.request_amount}
                onChange={(e) => updateFormData('request_amount', parseFloat(e.target.value))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Period Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payout Period Start</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.payout_period_start ? format(formData.payout_period_start, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.payout_period_start}
                    onSelect={(date) => updateFormData('payout_period_start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Payout Period End</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.payout_period_end ? format(formData.payout_period_end, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.payout_period_end}
                    onSelect={(date) => updateFormData('payout_period_end', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select value={formData.payment_method} onValueChange={(value) => updateFormData('payment_method', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bank Account Details */}
          {formData.payment_method === 'bank_transfer' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bank Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_account_details?.bank_name || ''}
                      onChange={(e) => updateBankDetails('bank_name', e.target.value)}
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_number">Account Number</Label>
                    <Input
                      id="account_number"
                      value={formData.bank_account_details?.account_number || ''}
                      onChange={(e) => updateBankDetails('account_number', e.target.value)}
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routing_number">Routing Number</Label>
                    <Input
                      id="routing_number"
                      value={formData.bank_account_details?.routing_number || ''}
                      onChange={(e) => updateBankDetails('routing_number', e.target.value)}
                      placeholder="Enter routing number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_holder_name">Account Holder Name</Label>
                    <Input
                      id="account_holder_name"
                      value={formData.bank_account_details?.account_holder_name || ''}
                      onChange={(e) => updateBankDetails('account_holder_name', e.target.value)}
                      placeholder="Enter account holder name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Banking Details */}
          {formData.payment_method === 'mobile_banking' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile Banking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select 
                      value={formData.mobile_banking_details?.provider || ''} 
                      onValueChange={(value) => updateMobileBankingDetails('provider', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bkash">bKash</SelectItem>
                        <SelectItem value="nagad">Nagad</SelectItem>
                        <SelectItem value="rocket">Rocket</SelectItem>
                        <SelectItem value="upay">Upay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile_account_number">Account Number</Label>
                    <Input
                      id="mobile_account_number"
                      value={formData.mobile_banking_details?.account_number || ''}
                      onChange={(e) => updateMobileBankingDetails('account_number', e.target.value)}
                      placeholder="Enter mobile banking number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile_account_holder_name">Account Holder Name</Label>
                    <Input
                      id="mobile_account_holder_name"
                      value={formData.mobile_banking_details?.account_holder_name || ''}
                      onChange={(e) => updateMobileBankingDetails('account_holder_name', e.target.value)}
                      placeholder="Enter account holder name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Enter any additional notes..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Update Request' : 'Create Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
