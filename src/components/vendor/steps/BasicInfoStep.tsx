
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Store, MapPin, ArrowLeft, ArrowRight, FileText, HelpCircle } from 'lucide-react';

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
  'Others'
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
  'Others'
];

const divisions = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
];

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData, onNext, onPrev }) => {
  const handleChange = (field: string, value: string | boolean) => {
    updateData({ [field]: value });
  };

  const isValid = data.fullName && data.email && data.phone && data.nidNumber && 
                 data.businessName && data.businessType && data.businessCategory;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📋 Step 2 of 9: Basic Information</h2>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '22%' }}></div>
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            👤 Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center bg-gray-100 px-3 rounded-md">
                  <span className="text-2xl mr-2">🇧🇩</span>
                  <span>+880</span>
                </div>
                <Input
                  id="phone"
                  placeholder="1XXXXXXXXX"
                  value={data.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="flex-1"
                  required
                />
                <Button variant="outline" size="sm">Verify via OTP</Button>
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
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            🏢 Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Business Type *</Label>
              <Select value={data.businessType} onValueChange={(value) => handleChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Business Category (Primary) *</Label>
              <Select value={data.businessCategory} onValueChange={(value) => handleChange('businessCategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary category" />
                </SelectTrigger>
                <SelectContent>
                  {businessCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Years in Business</Label>
            <RadioGroup 
              value={data.yearsInBusiness} 
              onValueChange={(value) => handleChange('yearsInBusiness', value)}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">New Business</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-2" id="1-2" />
                <Label htmlFor="1-2">1-2 years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-5" id="3-5" />
                <Label htmlFor="3-5">3-5 years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5+" id="5+" />
                <Label htmlFor="5+">5+ years</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description</Label>
            <Textarea
              id="businessDescription"
              placeholder="Tell us about your business, products, and target customers. This helps us provide better support. (Max 500 characters)"
              value={data.businessDescription}
              onChange={(e) => handleChange('businessDescription', e.target.value)}
              maxLength={500}
              rows={4}
            />
            <p className="text-xs text-gray-500">{data.businessDescription?.length || 0}/500 characters</p>
          </div>
        </CardContent>
      </Card>

      {/* Business Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            📍 Business Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Division</Label>
              <Select value={data.division} onValueChange={(value) => handleChange('division', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>{division}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>District</Label>
              <Select value={data.district} onValueChange={(value) => handleChange('district', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhaka">Dhaka</SelectItem>
                  <SelectItem value="chittagong">Chittagong</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upazila</Label>
              <Select value={data.upazila} onValueChange={(value) => handleChange('upazila', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select upazila" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
                  <SelectItem value="gulshan">Gulshan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Area</Label>
              <Select value={data.area} onValueChange={(value) => handleChange('area', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhanmondi-15">Dhanmondi 15</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              placeholder="House 12, Road 8, Dhanmondi R/A"
              value={data.streetAddress}
              onChange={(e) => handleChange('streetAddress', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="1205"
                value={data.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
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
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Label>Language Preference</Label>
            <RadioGroup 
              value={data.languagePreference} 
              onValueChange={(value) => handleChange('languagePreference', value)}
              className="flex gap-6"
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
        </CardContent>
      </Card>

      {/* Validation Messages */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-3">⚠️ Real-time Validation Messages:</h4>
          <div className="space-y-2 text-sm">
            <p className="text-green-600">✅ Valid Bangladesh mobile number</p>
            <p className="text-red-600">❌ NID format should be XXX XXX XXX XXX</p>
            <p className="text-yellow-600">⏳ Checking business name availability...</p>
            <p className="text-blue-600">💡 Tip: Use your legal business name for faster approval</p>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            📞 Need Help?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <p>• 📱 WhatsApp: +880-1600-GetIt</p>
              <p>• 📧 Email: vendor-support@getit.com.bd</p>
            </div>
            <div>
              <p>• 💬 Live Chat: Available 8 AM - 10 PM</p>
              <p>• 📹 Video Guide: "How to fill basic information"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          ← Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="min-w-[120px]">
          Save & Continue →
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
