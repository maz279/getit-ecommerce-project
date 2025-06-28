
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';

interface PayoutRequestFormProps {
  onClose: () => void;
}

export const PayoutRequestForm: React.FC<PayoutRequestFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    vendorId: '',
    requestAmount: '',
    currency: 'BDT',
    paymentMethod: '',
    periodStart: null as Date | null,
    periodEnd: null as Date | null,
    bankAccountDetails: {
      bankName: '',
      accountNumber: '',
      accountTitle: '',
      branchCode: '',
      routingNumber: ''
    },
    mobileBankingDetails: {
      provider: '',
      accountNumber: '',
      accountName: ''
    },
    notes: ''
  });

  const [vendors] = useState([
    { id: 'vendor_001', name: 'TechStore Bangladesh', businessName: 'TechStore Ltd.' },
    { id: 'vendor_002', name: 'Fashion World', businessName: 'Fashion World Inc.' },
    { id: 'vendor_003', name: 'Home & Garden', businessName: 'Home Garden Co.' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - in real app, this would call the API
    console.log('Payout request data:', formData);
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
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-gray-500">{vendor.businessName}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="requestAmount">Request Amount *</Label>
              <Input
                id="requestAmount"
                type="number"
                placeholder="0.00"
                value={formData.requestAmount}
                onChange={(e) => updateFormData('requestAmount', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => updateFormData('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">BDT</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => updateFormData('paymentMethod', value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Payout Period Start *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.periodStart ? format(formData.periodStart, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.periodStart}
                    onSelect={(date) => updateFormData('periodStart', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Payout Period End *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.periodEnd ? format(formData.periodEnd, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.periodEnd}
                    onSelect={(date) => updateFormData('periodEnd', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {formData.paymentMethod === 'bank_transfer' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bank Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    placeholder="e.g., Dutch-Bangla Bank"
                    value={formData.bankAccountDetails.bankName}
                    onChange={(e) => updateNestedData('bankAccountDetails', 'bankName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Account number"
                    value={formData.bankAccountDetails.accountNumber}
                    onChange={(e) => updateNestedData('bankAccountDetails', 'accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountTitle">Account Title *</Label>
                  <Input
                    id="accountTitle"
                    placeholder="Account holder name"
                    value={formData.bankAccountDetails.accountTitle}
                    onChange={(e) => updateNestedData('bankAccountDetails', 'accountTitle', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branchCode">Branch Code</Label>
                    <Input
                      id="branchCode"
                      placeholder="Branch code"
                      value={formData.bankAccountDetails.branchCode}
                      onChange={(e) => updateNestedData('bankAccountDetails', 'branchCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      placeholder="Routing number"
                      value={formData.bankAccountDetails.routingNumber}
                      onChange={(e) => updateNestedData('bankAccountDetails', 'routingNumber', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {formData.paymentMethod === 'mobile_banking' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile Banking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="provider">Provider *</Label>
                  <Select 
                    value={formData.mobileBankingDetails.provider}
                    onValueChange={(value) => updateNestedData('mobileBankingDetails', 'provider', value)}
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
                    value={formData.mobileBankingDetails.accountNumber}
                    onChange={(e) => updateNestedData('mobileBankingDetails', 'accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mobileAccountName">Account Name *</Label>
                  <Input
                    id="mobileAccountName"
                    placeholder="Account holder name"
                    value={formData.mobileBankingDetails.accountName}
                    onChange={(e) => updateNestedData('mobileBankingDetails', 'accountName', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or comments..."
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Payout Request
        </Button>
      </div>
    </form>
  );
};
