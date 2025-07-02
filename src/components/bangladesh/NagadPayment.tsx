import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, Smartphone, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NagadPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export const NagadPayment: React.FC<NagadPaymentProps> = ({
  amount,
  onSuccess,
  onError
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!phoneNumber || !pin) {
      toast({
        title: "Missing Information",
        description: "Please enter your Nagad number and PIN",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate Nagad payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = `NGD${Date.now()}`;
      toast({
        title: "Payment Successful",
        description: `Payment of ৳${amount} completed via Nagad`,
        variant: "default"
      });
      
      onSuccess(transactionId);
    } catch (error) {
      const errorMessage = "Payment failed. Please try again.";
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Smartphone className="h-6 w-6 text-orange-600" />
          <CardTitle className="text-orange-600">Nagad Payment</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Pay ৳{amount.toLocaleString()} securely with Nagad
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nagad-phone">Nagad Number</Label>
          <Input
            id="nagad-phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength={11}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nagad-pin">4-Digit PIN</Label>
          <Input
            id="nagad-pin"
            type="password"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
          />
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-xs text-muted-foreground">
            Your payment is secured by Nagad's encryption
          </span>
        </div>
        
        <Button 
          onClick={handlePayment}
          disabled={isProcessing || !phoneNumber || !pin}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isProcessing ? 'Processing...' : `Pay ৳${amount.toLocaleString()}`}
        </Button>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <span>You will receive an SMS confirmation</span>
        </div>
      </CardContent>
    </Card>
  );
};