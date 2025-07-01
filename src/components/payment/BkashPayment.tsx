import React from 'react';
import { Smartphone, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BkashPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export const BkashPayment: React.FC<BkashPaymentProps> = ({
  amount,
  onSuccess,
  onCancel
}) => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [step, setStep] = React.useState<'input' | 'verification' | 'pin'>('input');

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    
    // Simulate bKash API call
    setTimeout(() => {
      setStep('verification');
      setIsProcessing(false);
    }, 2000);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment completion
    setTimeout(() => {
      onSuccess(`BKash_${Date.now()}`);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-pink-600">bKash Payment</CardTitle>
        </div>
        <Badge variant="secondary" className="mx-auto">
          <Shield className="w-3 h-3 mr-1" />
          Secure & Instant
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">৳{amount.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Amount to Pay</p>
        </div>

        {step === 'input' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">bKash Account Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-center"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your 11-digit bKash mobile number
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full bg-pink-600 hover:bg-pink-700"
                onClick={handleInitiatePayment}
                disabled={phoneNumber.length !== 11 || isProcessing}
              >
                {isProcessing ? 'Connecting...' : 'Pay with bKash'}
              </Button>
              <Button variant="outline" className="w-full" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 'verification' && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold">Verification Required</h3>
              <p className="text-sm text-muted-foreground">
                Please check your phone for bKash verification message
              </p>
              <p className="text-sm font-medium text-pink-600 mt-2">
                {phoneNumber}
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-pink-600 hover:bg-pink-700"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : 'Confirm Payment'}
              </Button>
              <Button variant="outline" className="w-full" onClick={onCancel}>
                Cancel Payment
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          <p>• 2.5% transaction fee applies</p>
          <p>• Payment is processed instantly</p>
          <p>• Secure encryption protected</p>
        </div>
      </CardContent>
    </Card>
  );
};