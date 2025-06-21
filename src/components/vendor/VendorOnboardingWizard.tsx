
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { BasicInfoStep } from './BasicInfoStep';
import { BusinessDetailsStep } from './BusinessDetailsStep';
import { DocumentsStep } from './DocumentsStep';
import { ReviewStep } from './ReviewStep';

interface VendorData {
  // Basic Info
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  
  // Business Details
  address: string;
  businessType: string;
  description: string;
  establishedYear: string;
  employeeCount: string;
  
  // Documents
  tradeLicense: File | null;
  nidCopy: File | null;
  bankStatement: File | null;
  
  // Additional
  expectedMonthlyRevenue: string;
  productCategories: string[];
}

const steps = [
  { id: 1, title: 'Basic Information', description: 'Tell us about yourself' },
  { id: 2, title: 'Business Details', description: 'Your business information' },
  { id: 3, title: 'Documents', description: 'Upload required documents' },
  { id: 4, title: 'Review', description: 'Review and submit' },
];

export const VendorOnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [vendorData, setVendorData] = useState<VendorData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    description: '',
    establishedYear: '',
    employeeCount: '',
    tradeLicense: null,
    nidCopy: null,
    bankStatement: null,
    expectedMonthlyRevenue: '',
    productCategories: [],
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

  const handleSubmit = () => {
    console.log('Submitting vendor application:', vendorData);
    // Handle final submission
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={vendorData} updateData={updateVendorData} onNext={nextStep} />;
      case 2:
        return <BusinessDetailsStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <DocumentsStep data={vendorData} updateData={updateVendorData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <ReviewStep data={vendorData} onSubmit={handleSubmit} onPrev={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Vendor Registration</h2>
          <span className="text-sm text-gray-600">Step {currentStep} of {steps.length}</span>
        </div>
        
        <Progress value={progress} className="mb-6" />
        
        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep > step.id
                  ? 'bg-green-500 text-white'
                  : currentStep === step.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};
