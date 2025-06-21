import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Building, CreditCard, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BusinessVerificationStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const issuingAuthorities = [
  'Dhaka North City Corporation',
  'Dhaka South City Corporation',
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
  'Sonali Bank',
  'Janata Bank',
  'Agrani Bank',
  'Rupali Bank',
  'BASIC Bank',
  'Bangladesh Bank',
  'Dutch-Bangla Bank Limited',
  'Brac Bank',
  'Eastern Bank',
  'City Bank',
  'Prime Bank',
  'Other'
];

const monthlySalesRanges = [
  'Under ৳50,000',
  '৳50,000 - ৳2,00,000',
  '৳2,00,000 - ৳5,00,000',
  '৳5,00,000+'
];

const productCountRanges = [
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

const targetCustomerTypes = [
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
  const handleChange = (field: string, value: string | boolean) => {
    updateData({ [field]: value });
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    const currentArray = data[field] || [];
    const updatedArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item: string) => item !== value);
    updateData({ [field]: updatedArray });
  };

  const requiredForBusiness = data.hasTradeLicense ? 
    (data.tradeLicenseNumber && data.issuingAuthority && data.licenseIssueDate && data.licenseExpiryDate) : true;
  
  const isValid = data.tinNumber && data.bankName && data.accountNumber && 
                  data.accountHolderName && data.branchName && requiredForBusiness;

  return (
    <div className="space-y-8">
      {/* Trade License Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Building className="w-5 h-5" />
          📄 Trade License Information
        </h3>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Do you have a Trade License?</Label>
            <RadioGroup 
              value={data.hasTradeLicense ? 'yes' : data.hasTradeLicense === false ? 'no' : ''} 
              onValueChange={(value) => handleChange('hasTradeLicense', value === 'yes')}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="license-yes" />
                <Label htmlFor="license-yes">Yes, I have a valid trade license</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="license-no" />
                <Label htmlFor="license-no">No, I'm an individual seller</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="applied" id="license-applied" />
                <Label htmlFor="license-applied">Applied but not received yet</Label>
              </div>
            </RadioGroup>
          </div>

          {data.hasTradeLicense && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="tradeLicenseNumber">Trade License Number *</Label>
                <Input
                  id="tradeLicenseNumber"
                  placeholder="TRAD/DSCC/123456/2024"
                  value={data.tradeLicenseNumber}
                  onChange={(e) => handleChange('tradeLicenseNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuingAuthority">Issuing Authority *</Label>
                <Select value={data.issuingAuthority} onValueChange={(value) => handleChange('issuingAuthority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issuing authority" />
                  </SelectTrigger>
                  <SelectContent>
                    {issuingAuthorities.map((authority) => (
                      <SelectItem key={authority} value={authority}>
                        {authority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseIssueDate">Issue Date *</Label>
                <Input
                  id="licenseIssueDate"
                  type="date"
                  value={data.licenseIssueDate}
                  onChange={(e) => handleChange('licenseIssueDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseExpiryDate">Expiry Date *</Label>
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  value={data.licenseExpiryDate}
                  onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-base font-medium">Business Activities Listed</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {businessActivities.map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity}
                        checked={data.businessActivities?.includes(activity)}
                        onCheckedChange={(checked) => handleArrayChange('businessActivities', activity, checked as boolean)}
                      />
                      <Label htmlFor={activity} className="text-sm">{activity}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TIN Certificate */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          🆔 TIN Certificate (Tax Identification Number)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tinNumber">TIN Number *</Label>
            <Input
              id="tinNumber"
              placeholder="123 456 789 012"
              value={data.tinNumber}
              onChange={(e) => handleChange('tinNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>TIN Certificate Type *</Label>
            <RadioGroup 
              value={data.tinType} 
              onValueChange={(value) => handleChange('tinType', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="tin-individual" />
                <Label htmlFor="tin-individual">Individual TIN</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="tin-company" />
                <Label htmlFor="tin-company">Company TIN</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="issuingCircle">Issuing Circle</Label>
            <Input
              id="issuingCircle"
              placeholder="Income Tax Circle - 1, Dhaka"
              value={data.issuingCircle}
              onChange={(e) => handleChange('issuingCircle', e.target.value)}
            />
          </div>
        </div>

        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ℹ️ TIN is required for tax compliance and payouts
          </AlertDescription>
        </Alert>
      </div>

      {/* Bank Account Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          🏦 Bank Account Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Select value={data.bankName} onValueChange={(value) => handleChange('bankName', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              placeholder="1234567890123"
              value={data.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder Name *</Label>
            <Input
              id="accountHolderName"
              placeholder="Rahman Electronics & Mobile Shop"
              value={data.accountHolderName}
              onChange={(e) => handleChange('accountHolderName', e.target.value)}
            />
            <p className="text-xs text-yellow-600">⚠️ Must match business name exactly</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchName">Branch Name & Code *</Label>
            <Input
              id="branchName"
              placeholder="Dhanmondi Branch - 1234"
              value={data.branchName}
              onChange={(e) => handleChange('branchName', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Account Type *</Label>
            <RadioGroup 
              value={data.accountType} 
              onValueChange={(value) => handleChange('accountType', value)}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="account-current" />
                <Label htmlFor="account-current">Current Account</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="savings" id="account-savings" />
                <Label htmlFor="account-savings">Savings Account</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Business Operations */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📊 Business Operations</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium">Monthly Sales Volume (Expected)</Label>
              <RadioGroup 
                value={data.monthlySalesVolume} 
                onValueChange={(value) => handleChange('monthlySalesVolume', value)}
                className="mt-2"
              >
                {monthlySalesRanges.map((range) => (
                  <div key={range} className="flex items-center space-x-2">
                    <RadioGroupItem value={range} id={`sales-${range}`} />
                    <Label htmlFor={`sales-${range}`}>{range}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Product Count (Expected)</Label>
              <RadioGroup 
                value={data.expectedProductCount} 
                onValueChange={(value) => handleChange('expectedProductCount', value)}
                className="mt-2"
              >
                {productCountRanges.map((range) => (
                  <div key={range} className="flex items-center space-x-2">
                    <RadioGroupItem value={range} id={`products-${range}`} />
                    <Label htmlFor={`products-${range}`}>{range}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Business Model</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {businessModels.map((model) => (
                <div key={model} className="flex items-center space-x-2">
                  <Checkbox
                    id={model}
                    checked={data.businessModel?.includes(model)}
                    onCheckedChange={(checked) => handleArrayChange('businessModel', model, checked as boolean)}
                  />
                  <Label htmlFor={model} className="text-sm">{model}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Target Customers</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {targetCustomerTypes.map((customer) => (
                <div key={customer} className="flex items-center space-x-2">
                  <Checkbox
                    id={customer}
                    checked={data.targetCustomers?.includes(customer)}
                    onCheckedChange={(checked) => handleArrayChange('targetCustomers', customer, checked as boolean)}
                  />
                  <Label htmlFor={customer} className="text-sm">{customer}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Existing Online Presence */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📱 Existing Online Presence</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="facebookPage">Facebook Page (Optional)</Label>
            <Input
              id="facebookPage"
              placeholder="https://facebook.com/yourpage"
              value={data.facebookPage}
              onChange={(e) => handleChange('facebookPage', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
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

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="min-w-[120px]">
          Save & Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
