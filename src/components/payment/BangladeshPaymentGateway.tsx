import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface PaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

export const BangladeshPaymentGateway = ({ amount, orderId, onSuccess, onError }: PaymentProps) => {
  const [selectedGateway, setSelectedGateway] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'select' | 'verify'>('select');
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bangladesh-payment-gateway', {
        body: {
          endpoint: 'initiate_payment',
          data: {
            gateway: selectedGateway,
            amount,
            mobile_number: mobileNumber,
            order_id: orderId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            transaction_type: 'payment'
          }
        }
      });

      if (error) throw error;
      if (data.success) {
        setStep('verify');
      } else {
        onError(data.error || 'Payment initiation failed');
      }
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bangladesh-payment-gateway', {
        body: {
          endpoint: 'verify_payment',
          data: {
            gateway: selectedGateway,
            otp,
            order_id: orderId
          }
        }
      });

      if (error) throw error;
      if (data.success) {
        onSuccess(data.data);
      } else {
        onError('Payment verification failed');
      }
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verify Payment - {selectedGateway.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Enter the OTP sent to your {selectedGateway} registered mobile number:</p>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <Button onClick={verifyPayment} disabled={loading || otp.length !== 6} className="w-full">
            {loading ? 'Verifying...' : 'Verify Payment'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bangladesh Mobile Banking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(['bkash', 'nagad', 'rocket'] as const).map((gateway) => (
            <Button
              key={gateway}
              variant={selectedGateway === gateway ? 'default' : 'outline'}
              onClick={() => setSelectedGateway(gateway)}
              className="h-12"
            >
              {gateway.toUpperCase()}
            </Button>
          ))}
        </div>
        
        <Input
          placeholder="Mobile Number (01XXXXXXXXX)"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        
        <div className="text-center">
          <p className="text-lg font-semibold">Amount: ৳{amount}</p>
        </div>
        
        <Button 
          onClick={initiatePayment} 
          disabled={loading || !mobileNumber} 
          className="w-full"
        >
          {loading ? 'Processing...' : `Pay with ${selectedGateway.toUpperCase()}`}
        </Button>
      </CardContent>
    </Card>
  );
};