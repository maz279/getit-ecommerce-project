import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BkashPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export const BkashPayment: React.FC<BkashPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onError
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'pin' | 'processing'>('phone');
  const { toast } = useToast();

  const handlePhoneSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Bangladeshi phone number",
        variant: "destructive"
      });
      return;
    }
    setStep('pin');
  };

  const handlePayment = async () => {
    if (!pin || pin.length < 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your bKash PIN",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      // Call Bangladesh payment gateway
      const { data, error } = await supabase.functions.invoke('bd-payment-gateway', {
        body: {
          action: 'process_payment',
          gateway: 'bkash',
          amount,
          currency: 'BDT',
          customerPhone: phoneNumber,
          customerPin: pin,
          orderId,
          paymentType: 'checkout'
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Payment Successful! 🎉",
          description: `Transaction ID: ${data.transactionId}`,
        });
        onSuccess(data.transactionId);
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error) {
      console.error('bKash payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || 'Something went wrong with your payment',
        variant: "destructive"
      });
      onError(error.message);
      setStep('phone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">bK</span>
          </div>
          bKash Payment
        </CardTitle>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">Secure</Badge>
          <Badge variant="secondary">Instant</Badge>
          <Badge variant="secondary">24/7</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">৳{amount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Amount to Pay</div>
        </div>

        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">bKash Account Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={11}
              />
              <div className="text-xs text-gray-500 mt-1">
                Enter your 11-digit bKash account number
              </div>
            </div>
            
            <Button 
              onClick={handlePhoneSubmit} 
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 'pin' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">
                Account: {phoneNumber}
              </div>
              <Button 
                variant="link" 
                onClick={() => setStep('phone')}
                className="text-xs p-0 h-auto"
              >
                Change number
              </Button>
            </div>
            
            <div>
              <Label htmlFor="pin">bKash PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={5}
              />
              <div className="text-xs text-gray-500 mt-1">
                Enter your 4-5 digit bKash PIN
              </div>
            </div>
            
            <Button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <div className="text-lg font-medium">Processing Payment...</div>
            <div className="text-sm text-gray-600">Please wait while we confirm your payment</div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>🔒 Your payment is secured with bKash's encryption</p>
          <p>For support: Call 16247 or *247#</p>
        </div>
      </CardContent>
    </Card>
  );
};