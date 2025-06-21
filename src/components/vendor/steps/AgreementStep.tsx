
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, FileText, Shield, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedCommission, setAcceptedCommission] = useState(false);
  const [acceptedQuality, setAcceptedQuality] = useState(false);

  const allAccepted = acceptedTerms && acceptedPrivacy && acceptedCommission && acceptedQuality;

  const handleNext = () => {
    updateData({
      acceptedTerms,
      acceptedPrivacy,
      acceptedCommission,
      acceptedQuality,
      agreementDate: new Date().toISOString()
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📜 Vendor Agreement</h2>
        <p className="text-gray-600">Please review and accept our terms to become a GetIt vendor</p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please read all agreements carefully. By accepting, you agree to comply with GetIt's vendor policies and guidelines.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="commission">Commission Structure</TabsTrigger>
          <TabsTrigger value="quality">Quality Standards</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Terms of Service
              </CardTitle>
              <CardDescription>
                General terms and conditions for GetIt vendors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
                <h4 className="font-semibold mb-2">1. Vendor Registration & Account</h4>
                <p className="mb-3">By registering as a vendor, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>
                
                <h4 className="font-semibold mb-2">2. Product Listings</h4>
                <p className="mb-3">All products must be accurately described with clear images. Misleading information or counterfeit products are strictly prohibited.</p>
                
                <h4 className="font-semibold mb-2">3. Order Fulfillment</h4>
                <p className="mb-3">You must fulfill orders within the specified timeframe and ensure proper packaging and handling of products.</p>
                
                <h4 className="font-semibold mb-2">4. Returns & Refunds</h4>
                <p className="mb-3">You must accept returns as per GetIt's return policy and process refunds promptly for valid returns.</p>
                
                <h4 className="font-semibold mb-2">5. Account Suspension</h4>
                <p>GetIt reserves the right to suspend or terminate vendor accounts for violations of terms or poor performance metrics.</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                />
                <Label htmlFor="terms" className="text-sm">
                  I have read and agree to the Terms of Service
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Policy
              </CardTitle>
              <CardDescription>
                How we collect, use, and protect your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
                <h4 className="font-semibold mb-2">1. Information Collection</h4>
                <p className="mb-3">We collect business information, contact details, and transaction data necessary for vendor operations and compliance.</p>
                
                <h4 className="font-semibold mb-2">2. Data Usage</h4>
                <p className="mb-3">Your information is used for account management, payment processing, order fulfillment, and platform improvement.</p>
                
                <h4 className="font-semibold mb-2">3. Data Sharing</h4>
                <p className="mb-3">We share necessary information with logistics partners, payment processors, and regulatory authorities as required.</p>
                
                <h4 className="font-semibold mb-2">4. Data Security</h4>
                <p className="mb-3">We implement industry-standard security measures to protect your data from unauthorized access and breaches.</p>
                
                <h4 className="font-semibold mb-2">5. Data Retention</h4>
                <p>We retain your data as long as your account is active or as required by law for tax and regulatory compliance.</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={setAcceptedPrivacy}
                />
                <Label htmlFor="privacy" className="text-sm">
                  I have read and agree to the Privacy Policy
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Commission Structure
              </CardTitle>
              <CardDescription>
                Understanding our fee structure and payment terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
                <h4 className="font-semibold mb-2">Commission Rates</h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium">Individual Seller: 3%</p>
                    <p className="text-xs text-gray-600">For personal sellers</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium">Small Business: 2%</p>
                    <p className="text-xs text-gray-600">Registered businesses</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium">Enterprise: 1.5%</p>
                    <p className="text-xs text-gray-600">Large-scale vendors</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="font-medium">Digital: Custom</p>
                    <p className="text-xs text-gray-600">Negotiable rates</p>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-2">Payment Terms</h4>
                <p className="mb-3">• Weekly payouts every Friday<br/>• Minimum payout: ৳500<br/>• Processing time: 24-48 hours<br/>• No hidden fees or charges</p>
                
                <h4 className="font-semibold mb-2">Fee Calculation</h4>
                <p>Commission is calculated on the product price (excluding delivery charges). VAT and taxes are vendor's responsibility.</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="commission"
                  checked={acceptedCommission}
                  onCheckedChange={setAcceptedCommission}
                />
                <Label htmlFor="commission" className="text-sm">
                  I understand and agree to the commission structure
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Quality Standards
              </CardTitle>
              <CardDescription>
                Maintaining high standards for customer satisfaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
                <h4 className="font-semibold mb-2">Product Quality</h4>
                <p className="mb-3">• All products must be genuine and as described<br/>• No counterfeit, damaged, or expired items<br/>• Accurate product descriptions and images<br/>• Proper packaging and handling</p>
                
                <h4 className="font-semibold mb-2">Service Standards</h4>
                <p className="mb-3">• Order processing within 24 hours<br/>• Timely response to customer inquiries<br/>• Professional communication<br/>• Accurate inventory management</p>
                
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <p className="mb-3">• Order fulfillment rate: >95%<br/>• Customer rating: >4.0 stars<br/>• Return rate: <5%<br/>• Response time: <2 hours</p>
                
                <h4 className="font-semibold mb-2">Compliance</h4>
                <p>Vendors must comply with Bangladesh trade laws, tax regulations, and GetIt's quality guidelines.</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="quality"
                  checked={acceptedQuality}
                  onCheckedChange={setAcceptedQuality}
                />
                <Label htmlFor="quality" className="text-sm">
                  I commit to maintaining GetIt's quality standards
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Agreement Summary */}
      <Card className={`border-2 transition-colors ${allAccepted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            {allAccepted ? <CheckCircle className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5" />}
            Agreement Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className={`p-2 rounded ${acceptedTerms ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              ✓ Terms of Service
            </div>
            <div className={`p-2 rounded ${acceptedPrivacy ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              ✓ Privacy Policy
            </div>
            <div className={`p-2 rounded ${acceptedCommission ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              ✓ Commission Terms
            </div>
            <div className={`p-2 rounded ${acceptedQuality ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              ✓ Quality Standards
            </div>
          </div>
          {allAccepted && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-green-800 font-medium">🎉 All agreements accepted! You're ready to proceed.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!allAccepted} className="min-w-[120px]">
          Accept & Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
