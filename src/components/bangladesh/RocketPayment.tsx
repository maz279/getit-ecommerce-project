import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Smartphone, Shield, Clock } from 'lucide-react';

interface RocketPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  language?: 'en' | 'bn';
}

export const RocketPayment: React.FC<RocketPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onError,
  language = 'en'
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'completed'>('input');
  const { toast } = useToast();

  const texts = {
    en: {
      title: 'Pay with Rocket',
      phoneLabel: 'Rocket Account Number',
      phonePlaceholder: '01XXXXXXXXX',
      pinLabel: 'PIN',
      pinPlaceholder: 'Enter your 4-digit PIN',
      payButton: 'Pay Now',
      processing: 'Processing Payment...',
      instructions: 'Complete payment in Rocket app or dial *322#',
      features: {
        secure: 'Secure Payment',
        instant: 'Instant Transfer',
        support: '24/7 Support'
      },
      limits: `Payment limits: ৳10 - ৳30,000`,
      fee: 'No additional charges'
    },
    bn: {
      title: 'Rocket দিয়ে পেমেন্ট করুন',
      phoneLabel: 'Rocket অ্যাকাউন্ট নম্বর',
      phonePlaceholder: '01XXXXXXXXX',
      pinLabel: 'PIN',
      pinPlaceholder: 'আপনার ৪ সংখ্যার PIN লিখুন',
      payButton: 'এখনই পেমেন্ট করুন',
      processing: 'পেমেন্ট প্রক্রিয়াধীন...',
      instructions: 'Rocket অ্যাপে অথবা *322# ডায়াল করে পেমেন্ট সম্পূর্ণ করুন',
      features: {
        secure: 'নিরাপদ পেমেন্ট',
        instant: 'তাৎক্ষণিক স্থানান্তর',
        support: '২৪/৭ সাপোর্ট'
      },
      limits: `পেমেন্ট সীমা: ৳১০ - ৳৩০,০০০`,
      fee: 'কোন অতিরিক্ত চার্জ নেই'
    }
  };

  const t = texts[language];

  const validatePhone = (phone: string) => {
    const rocketRegex = /^01[3-9]\d{8}$/;
    return rocketRegex.test(phone);
  };

  const handlePayment = async () => {
    if (!validatePhone(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Rocket number (01XXXXXXXXX)",
        variant: "destructive"
      });
      return;
    }

    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 4 digits",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const { data, error } = await supabase.functions.invoke('bangladesh-payment-gateway', {
        body: {
          action: 'initiate_rocket_payment',
          amount,
          orderId,
          customerPhone: phoneNumber,
          pin
        }
      });

      if (error) throw error;

      if (data?.success) {
        // Simulate payment processing
        setTimeout(() => {
          setStep('completed');
          onSuccess(data.data.transactionId);
          toast({
            title: "Payment Successful",
            description: `৳${amount} paid successfully via Rocket`,
            variant: "default"
          });
        }, 3000);
      } else {
        throw new Error(data?.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Rocket payment error:', error);
      onError(error.message);
      setStep('input');
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-lg font-semibold">{t.processing}</h3>
            <p className="text-sm text-gray-600">{t.instructions}</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Amount: ৳{amount}</p>
              <p className="text-xs text-gray-600">Account: {phoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'completed') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
            <p className="text-sm text-gray-600">Your Rocket payment has been processed successfully.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          {t.title}
          <Badge variant="secondary" className="ml-auto">DBBL</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Amount */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">Amount to Pay</p>
            <p className="text-2xl font-bold text-purple-600">৳{amount}</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2">
            <Shield className="w-6 h-6 mx-auto text-purple-600 mb-1" />
            <p className="text-xs font-medium">{t.features.secure}</p>
          </div>
          <div className="text-center p-2">
            <Clock className="w-6 h-6 mx-auto text-purple-600 mb-1" />
            <p className="text-xs font-medium">{t.features.instant}</p>
          </div>
          <div className="text-center p-2">
            <Smartphone className="w-6 h-6 mx-auto text-purple-600 mb-1" />
            <p className="text-xs font-medium">{t.features.support}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="rocket-phone">{t.phoneLabel}</Label>
            <Input
              id="rocket-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t.phonePlaceholder}
              maxLength={11}
              className="text-lg"
            />
          </div>

          <div>
            <Label htmlFor="rocket-pin">{t.pinLabel}</Label>
            <Input
              id="rocket-pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={t.pinPlaceholder}
              maxLength={4}
              className="text-lg text-center tracking-wider"
            />
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <p>• {t.limits}</p>
          <p>• {t.fee}</p>
          <p>• {t.instructions}</p>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={loading || !phoneNumber || pin.length !== 4}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t.processing}
            </>
          ) : (
            t.payButton
          )}
        </Button>

        {/* Help Text */}
        <div className="text-center text-xs text-gray-500">
          <p>Powered by Dutch-Bangla Bank Limited</p>
          <p>Available 24/7 • Secure & Reliable</p>
        </div>
      </CardContent>
    </Card>
  );
};