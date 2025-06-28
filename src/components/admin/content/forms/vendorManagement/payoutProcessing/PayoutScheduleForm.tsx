
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Calendar } from 'lucide-react';

interface PayoutScheduleFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const PayoutScheduleForm: React.FC<PayoutScheduleFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState({
    vendor_id: initialData?.vendor_id || '',
    schedule_type: initialData?.schedule_type || 'monthly',
    payout_day: initialData?.payout_day || 1,
    minimum_payout_amount: initialData?.minimum_payout_amount || 100,
    auto_payout_enabled: initialData?.auto_payout_enabled || false,
    preferred_payment_method: initialData?.preferred_payment_method || 'bank_transfer',
    bank_account_info: initialData?.bank_account_info || {
      account_number: '',
      bank_name: '',
      routing_number: '',
      account_holder_name: ''
    },
    mobile_banking_info: initialData?.mobile_banking_info || {
      provider: '',
      account_number: '',
      account_holder_name: ''
    },
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true
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

  const updateBankInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bank_account_info: {
        ...(prev.bank_account_info || {}),
        [field]: value
      }
    }));
  };

  const updateMobileBankingInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      mobile_banking_info: {
        ...(prev.mobile_banking_info || {}),
        [field]: value
      }
    }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          {initialData ? 'Edit Payout Schedule' : 'Create New Payout Schedule'}
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
              <Label htmlFor="schedule_type">Schedule Type</Label>
              <Select value={formData.schedule_type} onValueChange={(value) => updateFormData('schedule_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi_weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payout_day">
                {formData.schedule_type === 'weekly' ? 'Day of Week (1-7)' : 'Day of Month (1-31)'}
              </Label>
              <Input
                id="payout_day"
                type="number"
                min={formData.schedule_type === 'weekly' ? 1 : 1}
                max={formData.schedule_type === 'weekly' ? 7 : 31}
                value={formData.payout_day}
                onChange={(e) => updateFormData('payout_day', parseInt(e.target.value))}
                placeholder="Enter day"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimum_payout_amount">Minimum Payout Amount</Label>
              <Input
                id="minimum_payout_amount"
                type="number"
                step="0.01"
                value={formData.minimum_payout_amount}
                onChange={(e) => updateFormData('minimum_payout_amount', parseFloat(e.target.value))}
                placeholder="100.00"
              />
            </div>
          </div>

          {/* Auto Payout Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="auto_payout_enabled"
              checked={formData.auto_payout_enabled}
              onCheckedChange={(checked) => updateFormData('auto_payout_enabled', checked)}
            />
            <Label htmlFor="auto_payout_enabled">Enable Auto Payout</Label>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="preferred_payment_method">Preferred Payment Method</Label>
            <Select value={formData.preferred_payment_method} onValueChange={(value) => updateFormData('preferred_payment_method', value)}>
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

          {/* Bank Account Information */}
          {formData.preferred_payment_method === 'bank_transfer' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bank Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_account_info?.bank_name || ''}
                      onChange={(e) => updateBankInfo('bank_name', e.target.value)}
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_number">Account Number</Label>
                    <Input
                      id="account_number"
                      value={formData.bank_account_info?.account_number || ''}
                      onChange={(e) => updateBankInfo('account_number', e.target.value)}
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routing_number">Routing Number</Label>
                    <Input
                      id="routing_number"
                      value={formData.bank_account_info?.routing_number || ''}
                      onChange={(e) => updateBankInfo('routing_number', e.target.value)}
                      placeholder="Enter routing number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_holder_name">Account Holder Name</Label>
                    <Input
                      id="account_holder_name"
                      value={formData.bank_account_info?.account_holder_name || ''}
                      onChange={(e) => updateBankInfo('account_holder_name', e.target.value)}
                      placeholder="Enter account holder name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Banking Information */}
          {formData.preferred_payment_method === 'mobile_banking' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile Banking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select 
                      value={formData.mobile_banking_info?.provider || ''} 
                      onValueChange={(value) => updateMobileBankingInfo('provider', value)}
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
                      value={formData.mobile_banking_info?.account_number || ''}
                      onChange={(e) => updateMobileBankingInfo('account_number', e.target.value)}
                      placeholder="Enter mobile banking number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile_account_holder_name">Account Holder Name</Label>
                    <Input
                      id="mobile_account_holder_name"
                      value={formData.mobile_banking_info?.account_holder_name || ''}
                      onChange={(e) => updateMobileBankingInfo('account_holder_name', e.target.value)}
                      placeholder="Enter account holder name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => updateFormData('is_active', checked)}
            />
            <Label htmlFor="is_active">Schedule Active</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
