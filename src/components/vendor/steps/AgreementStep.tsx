
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, FileText, Shield, DollarSign, Truck, Users, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AgreementStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const AgreementStep: React.FC<AgreementStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}) => {
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    vendorAgreement: false,
    privacyPolicy: false,
    commissionStructure: false,
    returnPolicy: false,
    qualityStandards: false,
  });

  const handleAgreementChange = (key: string, value: boolean) => {
    setAgreements(prev => ({ ...prev, [key]: value }));
  };

  const allAgreed = Object.values(agreements).every(Boolean);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📋 Terms & Agreements</h2>
        <p className="text-gray-600">Please review and accept our terms to proceed</p>
      </div>

      {/* Key Terms Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-3">🔑 Key Terms Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-blue-700 mb-2">💰 Commission & Payments</h5>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Commission: {data.vendorType === 'individual' ? '3%' : 
                     data.vendorType === 'small-business' ? '2%' : '1.5%'}</li>
                <li>• Weekly payouts every Friday</li>
                <li>• Minimum payout: ৳500</li>
                <li>• Payment through bank/mobile banking</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-700 mb-2">📦 Order Management</h5>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Order confirmation within 24 hours</li>
                <li>• Shipment within 2 business days</li>
                <li>• 7-day return policy support</li>
                <li>• Customer service responsibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">📝 Required Agreements</h3>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms"
                checked={agreements.termsOfService}
                onCheckedChange={(checked) => handleAgreementChange('termsOfService', checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor="terms" className="font-medium cursor-pointer">
                  GetIt Terms of Service
                </label>
                <p className="text-sm text-gray-600">
                  I agree to GetIt's terms of service covering platform usage, account management, and general policies.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Read Terms of Service →
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="vendor"
                checked={agreements.vendorAgreement}
                onCheckedChange={(checked) => handleAgreementChange('vendorAgreement', checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor="vendor" className="font-medium cursor-pointer">
                  Vendor Partnership Agreement
                </label>
                <p className="text-sm text-gray-600">
                  I agree to the vendor-specific terms including product listing, order fulfillment, and quality standards.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Read Vendor Agreement →
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="privacy"
                checked={agreements.privacyPolicy}
                onCheckedChange={(checked) => handleAgreementChange('privacyPolicy', checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor="privacy" className="font-medium cursor-pointer">
                  Privacy Policy
                </label>
                <p className="text-sm text-gray-600">
                  I understand how GetIt collects, uses, and protects my personal and business information.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Read Privacy Policy →
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="commission"
                checked={agreements.commissionStructure}
                onCheckedChange={(checked) => handleAgreementChange('commissionStructure', checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor="commission" className="font-medium cursor-pointer">
                  Commission Structure & Pricing
                </label>
                <p className="text-sm text-gray-600">
                  I accept the commission rates, payment terms, and pricing policies outlined for my vendor category.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  View Commission Details →
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="returns"
                checked={agreements.returnPolicy}
                onCheckedChange={(checked) => handleAgreementChange('returnPolicy', checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor="returns" className="font-medium cursor-pointer">
                  Return & Refund Policy
                </label>
                <p className="text-sm text-gray-600">
                  I agree to support customer returns and refunds according to GetIt's policies and my product categories.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Read Return Policy →
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="quality"
                checked={agreements.qualityStandards}
                onCheckedChange={(checked) => handleAgreementChange('qualityStandards', checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor="quality" className="font-medium cursor-pointer">
                  Quality Standards & Guidelines
                </label>
                <p className="text-sm text-gray-600">
                  I commit to maintaining product quality, accurate descriptions, and timely order fulfillment standards.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  View Quality Guidelines →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> By proceeding, you confirm that you have read, understood, and agree to all the terms above. 
          These agreements govern your relationship with GetIt and our customers. You can review these documents anytime 
          in your vendor dashboard after approval.
        </AlertDescription>
      </Alert>

      {/* Contact Information */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-green-800 mb-3">📞 Questions About Terms?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-700 font-medium">Legal & Compliance</p>
              <p className="text-sm text-green-600">📧 legal@getit.com.bd</p>
              <p className="text-sm text-green-600">📱 +880-1600-Legal</p>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Vendor Support</p>
              <p className="text-sm text-green-600">📧 vendor-support@getit.com.bd</p>
              <p className="text-sm text-green-600">💬 Live Chat: 8 AM - 10 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={!allAgreed} className="min-w-[120px]">
          Accept & Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
