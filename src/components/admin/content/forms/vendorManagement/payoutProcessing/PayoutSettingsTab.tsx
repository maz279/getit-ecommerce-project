
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

export const PayoutSettingsTab: React.FC = () => {
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    defaultMinimumPayout: '1000',
    defaultProcessingTime: '2',
    autoApprovalEnabled: false,
    autoApprovalThreshold: '50000',
    requireDocumentVerification: true,
    enableScheduledPayouts: true,
    defaultCurrency: 'BDT'
  });

  // Mock fee configuration data
  const feeConfigs = [
    {
      id: '1',
      paymentMethod: 'bank_transfer',
      feeType: 'fixed',
      feeAmount: 25,
      minimumFee: 10,
      maximumFee: 100,
      isActive: true
    },
    {
      id: '2',
      paymentMethod: 'mobile_banking',
      feeType: 'percentage',
      feeAmount: 1.5,
      minimumFee: 5,
      maximumFee: 50,
      isActive: true
    },
    {
      id: '3',
      paymentMethod: 'digital_wallet',
      feeType: 'percentage',
      feeAmount: 2.0,
      minimumFee: 10,
      maximumFee: 75,
      isActive: true
    }
  ];

  const handleGlobalSettingChange = (key: string, value: any) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    console.log('Saving global settings:', globalSettings);
    // In real app, this would call the API
  };

  const getFeeDisplay = (config: any) => {
    if (config.feeType === 'fixed') {
      return `৳${config.feeAmount}`;
    } else {
      return `${config.feeAmount}%`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Global Payout Settings</CardTitle>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="defaultMinimumPayout">Default Minimum Payout Amount</Label>
                <Input
                  id="defaultMinimumPayout"
                  type="number"
                  value={globalSettings.defaultMinimumPayout}
                  onChange={(e) => handleGlobalSettingChange('defaultMinimumPayout', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="defaultProcessingTime">Default Processing Time (Days)</Label>
                <Input
                  id="defaultProcessingTime"
                  type="number"
                  value={globalSettings.defaultProcessingTime}
                  onChange={(e) => handleGlobalSettingChange('defaultProcessingTime', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="autoApprovalThreshold">Auto Approval Threshold</Label>
                <Input
                  id="autoApprovalThreshold"
                  type="number"
                  value={globalSettings.autoApprovalThreshold}
                  onChange={(e) => handleGlobalSettingChange('autoApprovalThreshold', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select value={globalSettings.defaultCurrency} onValueChange={(value) => handleGlobalSettingChange('defaultCurrency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BDT">BDT - Bangladeshi Taka</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoApprovalEnabled">Enable Auto Approval</Label>
                <Switch
                  id="autoApprovalEnabled"
                  checked={globalSettings.autoApprovalEnabled}
                  onCheckedChange={(checked) => handleGlobalSettingChange('autoApprovalEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="requireDocumentVerification">Require Document Verification</Label>
                <Switch
                  id="requireDocumentVerification"
                  checked={globalSettings.requireDocumentVerification}
                  onCheckedChange={(checked) => handleGlobalSettingChange('requireDocumentVerification', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enableScheduledPayouts">Enable Scheduled Payouts</Label>
                <Switch
                  id="enableScheduledPayouts"
                  checked={globalSettings.enableScheduledPayouts}
                  onCheckedChange={(checked) => handleGlobalSettingChange('enableScheduledPayouts', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Fee Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payout Fee Configuration</CardTitle>
            <Dialog open={showFeeForm} onOpenChange={setShowFeeForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fee Configuration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Fee Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select>
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

                  <div>
                    <Label htmlFor="feeType">Fee Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="feeAmount">Fee Amount</Label>
                    <Input id="feeAmount" type="number" placeholder="0.00" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minimumFee">Minimum Fee</Label>
                      <Input id="minimumFee" type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <Label htmlFor="maximumFee">Maximum Fee</Label>
                      <Input id="maximumFee" type="number" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setShowFeeForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={() => setShowFeeForm(false)}>
                      Add Configuration
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Fee Amount</TableHead>
                  <TableHead>Min/Max Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div className="capitalize">
                        {config.paymentMethod.replace('_', ' ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {config.feeType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{getFeeDisplay(config)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        ৳{config.minimumFee} - ৳{config.maximumFee}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={config.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {config.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
