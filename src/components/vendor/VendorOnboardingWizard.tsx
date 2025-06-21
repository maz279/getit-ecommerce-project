
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowLeft, ArrowRight, Store, User, FileText, CreditCard, Truck, CheckCircle, Clock } from 'lucide-react';
import { WelcomeBenefitsStep } from './steps/WelcomeBenefitsStep';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BusinessVerificationStep } from './steps/BusinessVerificationStep';
import { KYCDocumentsStep } from './steps/KYCDocumentsStep';
import { StoreSetupStep } from './steps/StoreSetupStep';
import { PaymentSetupStep } from './steps/PaymentSetupStep';
import { ShippingConfigStep } from './steps/ShippingConfigStep';
import { AgreementStep } from './steps/AgreementStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';

interface VendorData {
  // Basic Info
  fullName: string;
  email: string;
  phone: string;
  nidNumber: string;
  businessName: string;
  businessType: string;
  businessCategory: string;
  yearsInBusiness: string;
  businessDescription: string;
  
  // Address
  division: string;
  district: string;
  upazila: string;
  area: string;
  streetAddress: string;
  postalCode: string;
  sameAsPickup: boolean;
  multipleLocations: boolean;
  
  // Business Verification
  hasTradeLicense: boolean;
  tradeLicenseNumber: string;
  issuingAuthority: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  businessActivities: string[];
  tinNumber: string;
  tinType: string;
  issuingCircle: string;
  
  // Bank Details
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchName: string;
  accountType: string;
  
  // Business Operations
  monthlySalesVolume: string;
  expectedProductCount: string;
  businessModel: string[];
  targetCustomers: string[];
  facebookPage: string;
  website: string;
  otherPlatforms: string;
  
  // Documents
  nidFront: File | null;
  nidBack: File | null;
  tradeLicense: File | null;
  tinCertificate: File | null;
  bankStatement: File | null;
  addressProof: File | null;
  
  // Store Setup
  storeName: string;
  storeDescription: string;
  storeCategory: string;
  storeLogo: File | null;
  storeBanner: File | null;
  
  // Vendor Type
  vendorType: 'individual' | 'small-business' | 'enterprise' | 'digital';
  languagePreference: string;
}

const steps = [
  { id: 1, title: 'Welcome & Benefits', description: 'Platform overview', icon: Store },
  { id: 2, title: 'Basic Information', description: 'Personal & business details', icon: User },
  { id: 3, title: 'Business Verification', description: 'Trade license & registration', icon: FileText },
  { id: 4, title: 'KYC Documents', description: 'Document upload', icon: FileText },
  { id: 5, title: 'Store Setup', description: 'Configure your store', icon: Store },
  { id: 6, title: 'Payment Setup', description: 'Banking & payments', icon: CreditCard },
  { id: 7, title: 'Shipping Config', description: 'Delivery settings', icon: Truck },
  { id: 8, title: 'Agreement', description: 'Terms & conditions', icon: CheckCircle },
  { id: 9, title: 'Review & Submit', description: 'Final review', icon: Check },
];

export const VendorOnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [vendorData, setVendorData] = useState<VendorData>({
    fullName: '',
    email: '',
    phone: '',
    nidNumber: '',
    businessName: '',
    businessType: '',
    businessCategory: '',
    yearsInBusiness: '',
    businessDescription: '',
    division: '',
    district: '',
    upazila: '',
    area: '',
    streetAddress: '',
    postalCode: '',
    sameAsPickup: false,
    multipleLocations: false,
    hasTradeLicense: false,
    tradeLicenseNumber: '',
    issuingAuthority: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    businessActivities: [],
    tinNumber: '',
    tinType: 'individual',
    issuingCircle: '',
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    branchName: '',
    accountType: 'current',
    monthlySalesVolume: '',
    expectedProductCount: '',
    businessModel: [],
    targetCustomers: [],
    facebookPage: '',
    website: '',
    otherPlatforms: '',
    nidFront: null,
    nidBack: null,
    tradeLicense: null,
    tinCertificate: null,
    bankStatement: null,
    addressProof: null,
    storeName: '',
    storeDescription: '',
    storeCategory: '',
    storeLogo: null,
    storeBanner: null,
    vendorType: 'individual',
    languagePreference: 'english',
  });

  const updateVendorData = (data: Partial<VendorData>) => {
    setVendorData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const handleSubmit = () => {
    console.log('Submitting vendor application:', vendorData);
    // Handle final submission
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeBenefitsStep data={vendorData} updateData={updateVendorData} onNext={nextStep} />;
      case 2:
        return <BasicInfoStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <BusinessVerificationStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <KYCDocumentsStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <StoreSetupStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 6:
        return <PaymentSetupStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 7:
        return <ShippingConfigStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 8:
        return <AgreementStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 9:
        return <ReviewSubmitStep data={vendorData} onSubmit={handleSubmit} onPrev={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">GetIt Vendor Onboarding</h1>
        <p className="text-gray-600 mb-4">Join Bangladesh's fastest growing marketplace</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Estimated Time: 15-20 minutes</span>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Side Navigation */}
        <div className="w-80 bg-white rounded-lg shadow-lg p-6 h-fit">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">Step {currentStep} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <nav className="space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isClickable = step.id <= currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => isClickable && goToStep(step.id)}
                  disabled={!isClickable}
                  className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                      : isCompleted
                      ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                      : isClickable
                      ? 'hover:bg-gray-50 text-gray-600'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs opacity-75">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>📱 WhatsApp: +880-1600-GetIt</p>
              <p>📧 vendor-support@getit.com.bd</p>
              <p>💬 Live Chat: 8 AM - 10 PM</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <steps[currentStep - 1].icon className="w-6 h-6" />
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
