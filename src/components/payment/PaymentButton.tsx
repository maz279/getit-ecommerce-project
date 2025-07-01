import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  currency = 'USD',
  description = 'Payment',
  onSuccess,
  onCancel,
  disabled,
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a payment",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Placeholder for Stripe integration
      // This will be implemented once we have the Stripe secret key
      toast({
        title: "Payment Integration Pending",
        description: "Stripe payment integration will be set up once you provide your Stripe secret key.",
      });
      
      // Simulate payment processing
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Payment Demo",
          description: "This is a demo. Real payment processing requires Stripe configuration.",
        });
        onSuccess?.();
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      onCancel?.();
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <CreditCard className="h-4 w-4 mr-2" />
      )}
      {loading ? 'Processing...' : `Pay ${currency} ${amount.toFixed(2)}`}
    </Button>
  );
};