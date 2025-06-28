
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PayoutScheduleFormProps {
  onClose: () => void;
}

export const PayoutScheduleForm: React.FC<PayoutScheduleFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    vendorId: '',
    scheduleType: '',
    payoutDay: '',
    minimumPayoutAmount: '',
    autoPayoutEnabled: false,
    preferredPaymentMethod: '',
    bankAccountInfo: {
      bankName: '',
      accountNumber: '',
      accountTitle: ''
    },
    mobileBankingInfo: {
      provider: '',
      accountNumber: '',
      accountName: ''
    }
  });

  const [vendors] = useState([
    { id: 'vendor_001', name: 'TechStore Bangladesh' },
    { id: 'vendor_002', name: 'Fashion World' },
    { id: 'vendor_003', name: 'Home & Garden' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payout schedule data:', formData);
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedData = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="vendorId">Vendor *</Label>
            <Select value={formData.vendorId} onValueChange={(value) => updateFormData('vendorId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scheduleType">Schedule Type *</Label>
            <Select value={formData.scheduleType} onValueChange={(value) => updateFormData('scheduleType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="payoutDay">Payout Day *</Label>
            <Input
              id="payoutDay"
              type="number"
              placeholder={formData.scheduleType === 'monthly' ? 'Day of month (1-31)' : 'Day of week (1-7)'}
              value={formData.payoutDay}
              onChange={(e) => updateFormData('payoutDay', e.target.value)}
              min="1"
              max={formData.scheduleType === 'monthly' ? '31' : '7'}
              required
            />
          </div>

          <div>
            <Label htmlFor="minimumPayoutAmount">Minimum Payout Amount *</Label>
            <Input
              id="minimumPayoutAmount"
              type="number"
              placeholder="0.00"
              value={formData.minimumPayoutAmount}
              onChange={(e) => updateFormData('minimumPayoutAmount', e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoPayoutEnabled"
              checked={formData.autoPayoutEnabled}
              onCheckedChange={(checked) => updateFormData('autoPayoutEnabled', checked)}
            />
            <Label htmlFor="autoPayoutEnabled">Enable Auto Payout</Label>
          </div>

          <div>
            <Label htmlFor="preferredPaymentMethod">Preferred Payment Method *</Label>
            <Select value={formData.preferredPaymentMethod} onValueChange={(value) => updateFormData('preferredPaymentMethod', value)}>
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
        </div>

        <div className="space-y-4">
          {formData.preferredPaymentMethod === 'bank_transfer' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bank Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    placeholder="e.g., Dutch-Bangla Bank"
                    value={formData.bankAccountInfo.bankName}
                    onChange={(e) => updateNestedData('bankAccountInfo', 'bankName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Account number"
                    value={formData.bankAccountInfo.accountNumber}
                    onChange={(e) => updateNestedData('bankAccountInfo', 'accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountTitle">Account Title *</Label>
                  <Input
                    id="accountTitle"
                    placeholder="Account holder name"
                    value={formData.bankAccountInfo.accountTitle}
                    onChange={(e) => updateNestedData('bankAccountInfo', 'accountTitle', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {formData.preferredPaymentMethod === 'mobile_banking' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile Banking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="provider">Provider *</Label>
                  <Select 
                    value={formData.mobileBankingInfo.provider}
                    onValueChange={(value) => updateNestedData('mobileBankingInfo', 'provider', value)}
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
                <div>
                  <Label htmlFor="mobileAccountNumber">Account Number *</Label>
                  <Input
                    id="mobileAccountNumber"
                    placeholder="Mobile number"
                    value={formData.mobileBankingInfo.accountNumber}
                    onChange={(e) => updateNestedData('mobileBankingInfo', 'accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mobileAccountName">Account Name *</Label>
                  <Input
                    id="mobileAccountName"
                    placeholder="Account holder name"
                    value={formData.mobileBankingInfo.accountName}
                    onChange={(e) => updateNestedData('mobileBankingInfo', 'accountName', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Schedule
        </Button>
      </div>
    </form>
  );
};
