
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, FileText, CreditCard, Building, Globe } from 'lucide-react';

interface BusinessVerificationStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const issuingAuthorities = [
  'Dhaka South City Corporation',
  'Dhaka North City Corporation',
  'Chittagong City Corporation',
  'Other City Corporations',
  'Upazila/Pourashava'
];

const businessActivities = [
  'Retail Trade',
  'Wholesale',
  'Import/Export',
  'Manufacturing',
  'Services',
  'Other'
];

const banks = [
  'Dutch-Bangla Bank Limited',
  'Sonali Bank',
  'Janata Bank',
  'Agrani Bank',
  'Rupali Bank',
  'BASIC Bank',
  'Bangladesh Bank',
  'Brac Bank',
  'Eastern Bank',
  'City Bank',
  'Prime Bank',
  'Other'
];

const salesVolumes = [
  'Under ৳50,000',
  '৳50,000 - ৳2,00,000',
  '৳2,00,000 - ৳5,00,000',
  '৳5,00,000+'
];

const productCounts = [
  '1-50 products',
  '51-200 products',
  '201-1000 products',
  '1000+ products'
];

const businessModels = [
  'Own Products/Manufacturing',
  'Wholesale/Distributor',
  'Imported Products',
  'Handmade/Crafts',
  'Digital Products/Services'
];

const targetCustomers = [
  'Individual Consumers',
  'Small Businesses',
  'Corporate Clients',
  'International Buyers'
];

export const BusinessVerificationStep: React.FC<BusinessVerificationStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}) => {
  const handleChange = (field: string, value: string | boolean | string[]) => {
    updateData({ [field]: value });
  };

  const handleBusinessActivityChange = (activity: string, checked: boolean) => {
    const activities = data.businessActivities || [];
    if (checked) {
      handleChange('businessActivities', [...activities, activity]);
    } else {
      handleChange('businessActivities', activities.filter((a: string) => a !== activity));
    }
  };

  const handleBusinessModelChange = (model: string, checked: boolean) => {
    const models = data.businessModel || [];
    if (checked) {
      handleChange('businessModel', [...models, model]);
    } else {
      handleChange('businessModel', models.filter((m: string) => m !== model));
    }
  };

  const handleTargetCustomerChange = (customer: string, checked: boolean) => {
    const customers = data.targetCustomers || [];
    if (checked) {
      handleChange('targetCustomers', [...customers, customer]);
    } else {
      handleChange('targetCustomers', customers.filter((c: string) => c !== customer));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🏛️ Step 3 of 9: Business Verification</h2>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '33%' }}></div>
        </div>
      </div>

      {/* Trade License Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            📄 Trade License Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Do you have a Trade License?</Label>
            <RadioGroup 
              value={data.hasTradeLicense ? 'yes' : 'no'} 
              onValueChange={(value) => handleChange('hasTradeLicense', value === 'yes')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes, I have a valid trade license</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No, I'm an individual seller</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="applied" id="applied" />
                <Label htmlFor="applied">Applied but not received yet</Label>
              </div>
            </RadioGroup>
          </div>

          {data.hasTradeLicense && (
            <>
              <div className="space-y-2">
                <Label htmlFor="tradeLicenseNumber">Trade License Number</Label>
                <Input
                  id="tradeLicenseNumber"
                  placeholder="TRAD/DSCC/123456/2024"
                  value={data.tradeLicenseNumber}
                  onChange={(e) => handleChange('tradeLicenseNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Issuing Authority</Label>
                <Select value={data.issuingAuthority} onValueChange={(value) => handleChange('issuingAuthority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issuing authority" />
                  </SelectTrigger>
                  <SelectContent>
                    {issuingAuthorities.map((authority) => (
                      <SelectItem key={authority} value={authority}>{authority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseIssueDate">Issue Date 📅</Label>
                  <Input
                    id="licenseIssueDate"
                    type="date"
                    value={data.licenseIssueDate}
                    onChange={(e) => handleChange('licenseIssueDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiryDate">Expiry Date 📅</Label>
                  <Input
                    id="licenseExpiryDate"
                    type="date"
                    value={data.licenseExpiryDate}
                    onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Business Activities Listed</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {businessActivities.map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={activity}
                        checked={data.businessActivities?.includes(activity)}
                        onCheckedChange={(checked) => handleBusinessActivityChange(activity, checked as boolean)}
                      />
                      <Label htmlFor={activity} className="text-sm">{activity}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* TIN Certificate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            🆔 TIN Certificate (Tax Identification Number)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tinNumber">TIN Number</Label>
            <Input
              id="tinNumber"
              placeholder="123 456 789 012"
              value={data.tinNumber}
              onChange={(e) => handleChange('tinNumber', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>TIN Certificate Type</Label>
            <RadioGroup 
              value={data.tinType} 
              onValueChange={(value) => handleChange('tinType', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual-tin" />
                <Label htmlFor="individual-tin">Individual TIN</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company-tin" />
                <Label htmlFor="company-tin">Company TIN</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuingCircle">Issuing Circle</Label>
            <Input
              id="issuingCircle"
              placeholder="Income Tax Circle - 1, Dhaka"
              value={data.issuingCircle}
              onChange={(e) => handleChange('issuingCircle', e.target.value)}
            />
          </div>

          <p className="text-sm text-gray-500">ℹ️ TIN is required for tax compliance and payouts</p>
        </CardContent>
      </Card>

      {/* Bank Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            🏦 Bank Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Select value={data.bankName} onValueChange={(value) => handleChange('bankName', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="1234567890123"
              value={data.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder Name</Label>
            <Input
              id="accountHolderName"
              placeholder="Rahman Electronics & Mobile Shop"
              value={data.accountHolderName}
              onChange={(e) => handleChange('accountHolderName', e.target.value)}
            />
            <p className="text-sm text-red-600">⚠️ Must match business name exactly</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchName">Branch Name & Code</Label>
            <Input
              id="branchName"
              placeholder="Dhanmondi Branch - 1234"
              value={data.branchName}
              onChange={(e) => handleChange('branchName', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Account Type</Label>
            <RadioGroup 
              value={data.accountType} 
              onValueChange={(value) => handleChange('accountType', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current">Current Account</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="savings" id="savings" />
                <Label htmlFor="savings">Savings Account</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Business Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            📊 Business Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Monthly Sales Volume (Expected)</Label>
            <RadioGroup 
              value={data.monthlySalesVolume} 
              onValueChange={(value) => handleChange('monthlySalesVolume', value)}
              className="space-y-2"
            >
              {salesVolumes.map((volume) => (
                <div key={volume} className="flex items-center space-x-2">
                  <RadioGroupItem value={volume} id={volume} />
                  <Label htmlFor={volume}>{volume}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Product Count (Expected)</Label>
            <RadioGroup 
              value={data.expectedProductCount} 
              onValueChange={(value) => handleChange('expectedProductCount', value)}
              className="space-y-2"
            >
              {productCounts.map((count) => (
                <div key={count} className="flex items-center space-x-2">
                  <RadioGroupItem value={count} id={count} />
                  <Label htmlFor={count}>{count}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Business Model</Label>
            <div className="space-y-2">
              {businessModels.map((model) => (
                <div key={model} className="flex items-center space-x-2">
                  <Checkbox 
                    id={model}
                    checked={data.businessModel?.includes(model)}
                    onCheckedChange={(checked) => handleBusinessModelChange(model, checked as boolean)}
                  />
                  <Label htmlFor={model}>{model}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Target Customers</Label>
            <div className="space-y-2">
              {targetCustomers.map((customer) => (
                <div key={customer} className="flex items-center space-x-2">
                  <Checkbox 
                    id={customer}
                    checked={data.targetCustomers?.includes(customer)}
                    onCheckedChange={(checked) => handleTargetCustomerChange(customer, checked as boolean)}
                  />
                  <Label htmlFor={customer}>{customer}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">📱 Existing Online Presence</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="facebookPage">Facebook Page (Optional)</Label>
                <Input
                  id="facebookPage"
                  placeholder="Optional - link"
                  value={data.facebookPage}
                  onChange={(e) => handleChange('facebookPage', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  placeholder="Optional - your website"
                  value={data.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherPlatforms">Other Platforms</Label>
                <Input
                  id="otherPlatforms"
                  placeholder="Daraz, Bikroy, etc."
                  value={data.otherPlatforms}
                  onChange={(e) => handleChange('otherPlatforms', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          ← Back
        </Button>
        <Button onClick={onNext} className="min-w-[120px]">
          Save & Continue →
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
