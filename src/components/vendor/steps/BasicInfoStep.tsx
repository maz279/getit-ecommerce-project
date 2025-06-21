
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Mail, Phone, MapPin, Building, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

interface BasicInfoStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const businessTypes = [
  'Sole Proprietorship',
  'Partnership', 
  'Private Limited Company',
  'Public Limited Company',
  'Cooperative Society',
  'NGO/Non-Profit'
];

const businessCategories = [
  'Electronics & Gadgets',
  'Fashion & Clothing',
  'Home & Living',
  'Health & Beauty',
  'Food & Groceries',
  'Books & Stationery',
  'Sports & Outdoor',
  'Handicrafts',
  'Automotive',
  'Baby & Kids',
  'Jewelry & Accessories',
  'Agriculture Products'
];

const divisions = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
];

const yearsOptions = [
  { value: 'new', label: 'New Business' },
  { value: '1-2', label: '1-2 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' }
];

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData, onNext, onPrev }) => {
  const handleChange = (field: string, value: string | boolean) => {
    updateData({ [field]: value });
  };

  const isValid = data.fullName && data.email && data.phone && data.nidNumber && 
                  data.businessName && data.businessType && data.businessCategory && 
                  data.yearsInBusiness && data.businessDescription && data.division && 
                  data.district && data.streetAddress && data.postalCode;

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          👤 Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (as per NID) *</Label>
            <Input
              id="fullName"
              placeholder="Md. Abdul Rahman"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="abdul.rahman@email.com"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number *</Label>
            <div className="flex gap-2">
              <div className="w-20">
                <Input value="+880" disabled />
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="1XXXXXXXXX"
                  value={data.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <Button variant="outline" size="sm">🇧🇩 Verify via OTP</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nidNumber">National ID Number *</Label>
            <Input
              id="nidNumber"
              placeholder="123 456 789 012"
              value={data.nidNumber}
              onChange={(e) => handleChange('nidNumber', e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">ℹ️ Required for KYC verification</p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Building className="w-5 h-5" />
          🏢 Business Information
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="Rahman Electronics & Mobile Shop"
                value={data.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={data.businessType} onValueChange={(value) => handleChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCategory">Business Category (Primary) *</Label>
              <Select value={data.businessCategory} onValueChange={(value) => handleChange('businessCategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {businessCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Years in Business *</Label>
              <RadioGroup 
                value={data.yearsInBusiness} 
                onValueChange={(value) => handleChange('yearsInBusiness', value)}
                className="flex flex-wrap gap-4"
              >
                {yearsOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description *</Label>
            <Textarea
              id="businessDescription"
              placeholder="Tell us about your business, products, and target customers. This helps us provide better support. (Max 500 characters)"
              value={data.businessDescription}
              onChange={(e) => handleChange('businessDescription', e.target.value)}
              rows={4}
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500">{data.businessDescription.length}/500 characters</p>
          </div>
        </div>
      </div>

      {/* Business Address */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          📍 Business Address
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="division">Division *</Label>
              <Select value={data.division} onValueChange={(value) => handleChange('division', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Input
                id="district"
                placeholder="Enter district"
                value={data.district}
                onChange={(e) => handleChange('district', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upazila">Upazila</Label>
              <Input
                id="upazila"
                placeholder="Enter upazila"
                value={data.upazila}
                onChange={(e) => handleChange('upazila', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                placeholder="Enter area"
                value={data.area}
                onChange={(e) => handleChange('area', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="streetAddress">Street Address *</Label>
              <Input
                id="streetAddress"
                placeholder="House 12, Road 8, Dhanmondi R/A"
                value={data.streetAddress}
                onChange={(e) => handleChange('streetAddress', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                placeholder="1205"
                value={data.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsPickup"
                checked={data.sameAsPickup}
                onCheckedChange={(checked) => handleChange('sameAsPickup', checked)}
              />
              <Label htmlFor="sameAsPickup">Same as pickup address</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="multipleLocations"
                checked={data.multipleLocations}
                onCheckedChange={(checked) => handleChange('multipleLocations', checked)}
              />
              <Label htmlFor="multipleLocations">I have multiple pickup locations</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div>
        <Label>Language Preference</Label>
        <RadioGroup 
          value={data.languagePreference} 
          onValueChange={(value) => handleChange('languagePreference', value)}
          className="flex gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="english" id="english" />
            <Label htmlFor="english">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bangla" id="bangla" />
            <Label htmlFor="bangla">বাংলা</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Both</Label>
          </div>
        </RadioGroup>
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
