import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NagadPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export const NagadPayment: React.FC<NagadPaymentProps> = ({
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
        title: "অবৈধ ফোন নম্বর",
        description: "দয়া করে একটি বৈধ বাংলাদেশী ফোন নম্বর দিন",
        variant: "destructive"
      });
      return;
    }
    setStep('pin');
  };

  const handlePayment = async () => {
    if (!pin || pin.length < 4) {
      toast({
        title: "অবৈধ পিন",
        description: "দয়া করে আপনার নগদ পিন দিন",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const { data, error } = await supabase.functions.invoke('bd-payment-gateway', {
        body: {
          action: 'process_payment',
          gateway: 'nagad',
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
          title: "পেমেন্ট সফল! 🎉",
          description: `লেনদেন আইডি: ${data.transactionId}`,
        });
        onSuccess(data.transactionId);
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Nagad payment error:', error);
      toast({
        title: "পেমেন্ট ব্যর্থ",
        description: error.message || 'আপনার পেমেন্টে সমস্যা হয়েছে',
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
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          Nagad Payment / নগদ পেমেন্ট
        </CardTitle>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">নিরাপদ</Badge>
          <Badge variant="secondary">তৎক্ষণাত</Badge>
          <Badge variant="secondary">২৪/৭</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">৳{amount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">প্রদেয় টাকা / Amount to Pay</div>
        </div>

        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">নগদ অ্যাকাউন্ট নম্বর / Nagad Account Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={11}
              />
              <div className="text-xs text-gray-500 mt-1">
                আপনার ১১ সংখ্যার নগদ অ্যাকাউন্ট নম্বর দিন
              </div>
            </div>
            
            <Button 
              onClick={handlePhoneSubmit} 
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              এগিয়ে যান / Continue
            </Button>
          </div>
        )}

        {step === 'pin' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">
                অ্যাকাউন্ট: {phoneNumber}
              </div>
              <Button 
                variant="link" 
                onClick={() => setStep('phone')}
                className="text-xs p-0 h-auto"
              >
                নম্বর পরিবর্তন করুন
              </Button>
            </div>
            
            <div>
              <Label htmlFor="pin">নগদ পিন / Nagad PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="আপনার পিন দিন"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
              />
              <div className="text-xs text-gray-500 mt-1">
                আপনার ৪ সংখ্যার নগদ পিন দিন
              </div>
            </div>
            
            <Button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              {loading ? 'প্রক্রিয়াকরণ...' : 'এখনই পেমেন্ট করুন / Pay Now'}
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-lg font-medium">পেমেন্ট প্রক্রিয়াকরণ... / Processing Payment...</div>
            <div className="text-sm text-gray-600">আপনার পেমেন্ট নিশ্চিত করার জন্য অপেক্ষা করুন</div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>🔒 আপনার পেমেন্ট নগদের এনক্রিপশন দিয়ে সুরক্ষিত</p>
          <p>সহায়তার জন্য: কল করুন ১৬১৬৭ বা *১৬৭#</p>
        </div>
      </CardContent>
    </Card>
  );
};