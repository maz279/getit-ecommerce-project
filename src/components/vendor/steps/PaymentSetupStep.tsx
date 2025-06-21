
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Building, CheckCircle } from 'lucide-react';

interface PaymentSetupStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PaymentSetupStep: React.FC<PaymentSetupStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">💳 Payment Setup Complete!</h2>
        <p className="text-gray-600">Your bank account information has been verified</p>
      </div>

      {/* Payment Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Payment Information Verified
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-600 font-medium">Bank Account</p>
              <p className="text-green-800">{data.bankName}</p>
              <p className="text-green-700">Account: {data.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Account Holder</p>
              <p className="text-green-800">{data.accountHolderName}</p>
              <p className="text-green-700">{data.branchName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📱 Available Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Smartphone className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <h4 className="font-semibold mb-2">Mobile Banking</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>bKash: ✅ Available</p>
                <p>Nagad: ✅ Available</p>
                <p>Rocket: ✅ Available</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Building className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <h4 className="font-semibold mb-2">Bank Transfer</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Direct Deposit: ✅ Available</p>
                <p>Processing: 24-48 hours</p>
                <p>Fee: No charges</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <h4 className="font-semibold mb-2">Card Payments</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Visa/Mastercard: ✅ Accepted</p>
                <p>Customer payments</p>
                <p>Instant processing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payout Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Payout Schedule & Commission</CardTitle>
          <CardDescription>
            How and when you'll receive payments from sales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🗓️ Payout Frequency</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Weekly payouts every Friday</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant payout option available</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Minimum payout: ৳500</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📊 Commission Structure</h4>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-lg font-bold text-blue-800">
                  {data.vendorType === 'individual' ? '3%' : 
                   data.vendorType === 'small-business' ? '2%' : 
                   data.vendorType === 'enterprise' ? '1.5%' : 'Custom'} Commission
                </p>
                <p className="text-sm text-blue-600">
                  Based on your vendor type: {data.vendorType}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-semibold text-yellow-800 mb-2">💡 Payment Tips</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Ensure your bank account details are correct for smooth payouts</li>
              <li>• Mobile banking payouts are faster than bank transfers</li>
              <li>• Keep your TIN certificate updated for tax compliance</li>
              <li>• Track your earnings in real-time through the vendor dashboard</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-3">🔒 Payment Security Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                SSL encryption for all transactions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                PCI DSS compliant payment processing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Real-time fraud detection
              </li>
            </ul>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Secure API integrations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Transaction monitoring 24/7
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Dispute resolution support
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} className="min-w-[120px]">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
