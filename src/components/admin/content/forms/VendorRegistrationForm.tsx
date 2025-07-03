import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Building, FileText, CreditCard, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VendorFormData {
  // Basic Information
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  alternative_phone: string;
  
  // Business Details
  business_type: string;
  registration_number: string;
  tin_number: string;
  trade_license_number: string;
  establishment_year: number;
  business_description: string;
  
  // Address Information
  business_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  
  // Banking Details
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  branch_name: string;
  routing_number: string;
  
  // Verification Documents
  nid_number: string;
  passport_number: string;
  
  // Settings
  commission_rate: number;
  is_verified: boolean;
  status: string;
}

export const VendorRegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VendorFormData>({
    business_name: '',
    contact_person: '',
    email: '',
    phone: '',
    alternative_phone: '',
    business_type: '',
    registration_number: '',
    tin_number: '',
    trade_license_number: '',
    establishment_year: new Date().getFullYear(),
    business_description: '',
    business_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh',
    bank_name: '',
    account_number: '',
    account_holder_name: '',
    branch_name: '',
    routing_number: '',
    nid_number: '',
    passport_number: '',
    commission_rate: 10,
    is_verified: false,
    status: 'pending'
  });

  const steps = [
    { id: 'basic', title: 'Basic Information', icon: UserPlus },
    { id: 'business', title: 'Business Details', icon: Building },
    { id: 'documents', title: 'Documents', icon: FileText },
    { id: 'banking', title: 'Banking Details', icon: CreditCard },
    { id: 'review', title: 'Review & Submit', icon: Check }
  ];

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Private Limited Company',
    'Public Limited Company',
    'Cooperative Society',
    'NGO/Non-Profit'
  ];

  const handleInputChange = (field: keyof VendorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Information
        return !!(formData.business_name && formData.contact_person && formData.email && formData.phone);
      case 1: // Business Details
        return !!(formData.business_type && formData.registration_number && formData.establishment_year);
      case 2: // Documents
        return !!(formData.nid_number || formData.passport_number);
      case 3: // Banking Details
        return !!(formData.bank_name && formData.account_number && formData.account_holder_name);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const vendorData = {
        business_name: formData.business_name,
        status: formData.status as 'pending' | 'approved' | 'suspended' | 'rejected',
        commission_rate: formData.commission_rate,
        trade_license: formData.trade_license_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();

      if (error) throw error;

      // Create initial commission rate
      if (data) {
        await supabase
          .from('vendor_commission_rates')
          .insert([{
            vendor_id: data.id,
            base_rate: formData.commission_rate,
            rate_type: 'percentage',
            created_by: 'admin',
            effective_from: new Date().toISOString(),
            is_active: true
          }]);
      }

      toast({
        title: "Success",
        description: "Vendor registration submitted successfully. Verification process will begin shortly.",
      });

      // Reset form
      setFormData({
        business_name: '',
        contact_person: '',
        email: '',
        phone: '',
        alternative_phone: '',
        business_type: '',
        registration_number: '',
        tin_number: '',
        trade_license_number: '',
        establishment_year: new Date().getFullYear(),
        business_description: '',
        business_address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Bangladesh',
        bank_name: '',
        account_number: '',
        account_holder_name: '',
        branch_name: '',
        routing_number: '',
        nid_number: '',
        passport_number: '',
        commission_rate: 10,
        is_verified: false,
        status: 'pending'
      });
      setCurrentStep(0);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register vendor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Registration</CardTitle>
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-1 ${index <= currentStep ? 'text-primary' : ''}`}
              >
                <step.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={steps[currentStep].id} className="w-full">
            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                    placeholder="Enter business name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person *</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => handleInputChange('contact_person', e.target.value)}
                    placeholder="Full name of contact person"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="business@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alternative_phone">Alternative Phone</Label>
                  <Input
                    id="alternative_phone"
                    value={formData.alternative_phone}
                    onChange={(e) => handleInputChange('alternative_phone', e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_address">Business Address</Label>
                <Textarea
                  id="business_address"
                  value={formData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  placeholder="Complete business address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Division</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State or Division"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="1234"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Business Details */}
            <TabsContent value="business" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Type *</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => handleInputChange('business_type', value)}
                  >
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
                  <Label htmlFor="establishment_year">Establishment Year</Label>
                  <Input
                    id="establishment_year"
                    type="number"
                    value={formData.establishment_year}
                    onChange={(e) => handleInputChange('establishment_year', parseInt(e.target.value) || new Date().getFullYear())}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registration_number">Registration Number *</Label>
                  <Input
                    id="registration_number"
                    value={formData.registration_number}
                    onChange={(e) => handleInputChange('registration_number', e.target.value)}
                    placeholder="Company registration number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tin_number">TIN Number</Label>
                  <Input
                    id="tin_number"
                    value={formData.tin_number}
                    onChange={(e) => handleInputChange('tin_number', e.target.value)}
                    placeholder="Tax Identification Number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trade_license">Trade License Number</Label>
                  <Input
                    id="trade_license"
                    value={formData.trade_license_number}
                    onChange={(e) => handleInputChange('trade_license_number', e.target.value)}
                    placeholder="Trade license number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commission_rate">Commission Rate (%)</Label>
                  <Input
                    id="commission_rate"
                    type="number"
                    value={formData.commission_rate}
                    onChange={(e) => handleInputChange('commission_rate', parseFloat(e.target.value) || 10)}
                    min="0"
                    max="50"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_description">Business Description</Label>
                <Textarea
                  id="business_description"
                  value={formData.business_description}
                  onChange={(e) => handleInputChange('business_description', e.target.value)}
                  placeholder="Describe your business, products, and services"
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nid_number">National ID Number</Label>
                  <Input
                    id="nid_number"
                    value={formData.nid_number}
                    onChange={(e) => handleInputChange('nid_number', e.target.value)}
                    placeholder="13 or 17 digit NID number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passport_number">Passport Number (Alternative)</Label>
                  <Input
                    id="passport_number"
                    value={formData.passport_number}
                    onChange={(e) => handleInputChange('passport_number', e.target.value)}
                    placeholder="Passport number if no NID"
                  />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Required documents (to be uploaded after registration):</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>National ID Card or Passport copy</li>
                  <li>Trade License copy</li>
                  <li>TIN Certificate</li>
                  <li>Bank Statement or Cheque copy</li>
                  <li>Business registration certificate</li>
                </ul>
              </div>
            </TabsContent>

            {/* Banking Details */}
            <TabsContent value="banking" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name *</Label>
                  <Input
                    id="bank_name"
                    value={formData.bank_name}
                    onChange={(e) => handleInputChange('bank_name', e.target.value)}
                    placeholder="e.g., Dutch Bangla Bank"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branch_name">Branch Name</Label>
                  <Input
                    id="branch_name"
                    value={formData.branch_name}
                    onChange={(e) => handleInputChange('branch_name', e.target.value)}
                    placeholder="Branch name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="account_number">Account Number *</Label>
                  <Input
                    id="account_number"
                    value={formData.account_number}
                    onChange={(e) => handleInputChange('account_number', e.target.value)}
                    placeholder="Bank account number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="account_holder_name">Account Holder Name *</Label>
                  <Input
                    id="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                    placeholder="As per bank records"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="routing_number">Routing Number</Label>
                  <Input
                    id="routing_number"
                    value={formData.routing_number}
                    onChange={(e) => handleInputChange('routing_number', e.target.value)}
                    placeholder="Bank routing number"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Review & Submit */}
            <TabsContent value="review" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Business Name:</strong> {formData.business_name}
                  </div>
                  <div>
                    <strong>Contact Person:</strong> {formData.contact_person}
                  </div>
                  <div>
                    <strong>Email:</strong> {formData.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {formData.phone}
                  </div>
                  <div>
                    <strong>Business Type:</strong> {formData.business_type}
                  </div>
                  <div>
                    <strong>Commission Rate:</strong> {formData.commission_rate}%
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={formData.is_verified}
                    onCheckedChange={(checked) => handleInputChange('is_verified', checked)}
                  />
                  <Label htmlFor="verified">Mark as pre-verified (Admin only)</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Registration'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};