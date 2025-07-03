import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ApiClient } from '@/services/api/ApiClient';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile' | 'bank' | 'card';
  icon: React.ReactNode;
  fees: string;
  processingTime: string;
  isAvailable: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bkash',
    name: 'bKash',
    type: 'mobile',
    icon: <Smartphone className="h-6 w-6 text-pink-500" />,
    fees: '1.5%',
    processingTime: 'Instant',
    isAvailable: true
  },
  {
    id: 'nagad',
    name: 'Nagad',
    type: 'mobile',
    icon: <Smartphone className="h-6 w-6 text-orange-500" />,
    fees: '1.2%',
    processingTime: 'Instant',
    isAvailable: true
  },
  {
    id: 'rocket',
    name: 'Rocket',
    type: 'mobile',
    icon: <Smartphone className="h-6 w-6 text-purple-500" />,
    fees: '1.8%',
    processingTime: 'Instant',
    isAvailable: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: <CreditCard className="h-6 w-6 text-blue-500" />,
    fees: '2.5%',
    processingTime: '2-3 minutes',
    isAvailable: true
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    type: 'bank',
    icon: <Building2 className="h-6 w-6 text-green-500" />,
    fees: '0.5%',
    processingTime: '1-2 hours',
    isAvailable: true
  }
];

interface EnhancedPaymentGatewayProps {
  amount: number;
  orderId: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export const EnhancedPaymentGateway: React.FC<EnhancedPaymentGatewayProps> = ({
  amount,
  orderId,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'process' | 'verify'>('select');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');
  const { toast } = useToast();
  
  const apiClient = ApiClient.getInstance();

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPaymentStep('process');
  };

  const handleMobilePayment = async () => {
    if (!selectedMethod || !mobileNumber) return;
    
    setLoading(true);
    try {
      const paymentData = {
        method: selectedMethod.id,
        amount,
        orderId,
        mobileNumber,
        pin
      };

      let response;
      switch (selectedMethod.id) {
        case 'bkash':
          response = await apiClient.getBkashPaymentUrl(amount, orderId);
          break;
        case 'nagad':
        case 'rocket':
          response = await apiClient.processPayment(paymentData);
          break;
        default:
          throw new Error('Unsupported payment method');
      }

      if ((response as any).success) {
        setPaymentStep('verify');
        toast({
          title: "Payment Initiated",
          description: "Please complete the payment on your mobile device.",
        });
      } else {
        throw new Error((response as any).message || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onPaymentError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setLoading(true);
    try {
      const paymentData = {
        method: 'card',
        amount,
        orderId
      };

      const response = await apiClient.processPayment(paymentData);
      
      if ((response as any).success) {
        onPaymentSuccess(response);
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
      } else {
        throw new Error((response as any).message || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod.type) {
      case 'mobile':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                placeholder="01XXXXXXXXX"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength={11}
              />
            </div>
            <div>
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={5}
              />
            </div>
            <Button 
              onClick={handleMobilePayment} 
              className="w-full" 
              disabled={loading || !mobileNumber || !pin}
            >
              {loading ? 'Processing...' : `Pay ৳${amount.toLocaleString()}`}
            </Button>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You will be redirected to a secure payment page to complete your transaction.
            </p>
            <Button 
              onClick={handleCardPayment} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ৳${amount.toLocaleString()}`}
            </Button>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Bank Transfer Instructions</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Account Name:</strong> GetIt Limited</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Bank:</strong> Dutch Bangla Bank</p>
                <p><strong>Branch:</strong> Gulshan</p>
                <p><strong>Amount:</strong> ৳{amount.toLocaleString()}</p>
                <p><strong>Reference:</strong> {orderId}</p>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              I have completed the transfer
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (paymentStep === 'verify') {
    return (
      <Card>
        <CardHeader className="text-center">
          <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>Payment Verification</CardTitle>
          <CardDescription>
            Please complete the payment on your mobile device
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                Check your mobile for a payment request from {selectedMethod?.name}
              </p>
              <p className="text-sm font-medium">
                Amount: ৳{amount.toLocaleString()}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setPaymentStep('select')}
            >
              Back to Payment Methods
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Secure Payment
          </CardTitle>
          <CardDescription>
            Choose your preferred payment method. All transactions are secured with 256-bit encryption.
          </CardDescription>
        </CardHeader>
      </Card>

      {paymentStep === 'select' ? (
        <div className="space-y-4">
          {/* Payment Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Amount</span>
                <span className="text-2xl font-bold">৳{amount.toLocaleString()}</span>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                Order ID: {orderId}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Tabs defaultValue="mobile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mobile">Mobile Banking</TabsTrigger>
              <TabsTrigger value="card">Cards</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="space-y-3">
              {paymentMethods
                .filter(method => method.type === 'mobile')
                .map(method => (
                  <Card 
                    key={method.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handlePaymentMethodSelect(method)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {method.icon}
                          <div>
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Fee: {method.fees} • {method.processingTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isAvailable ? (
                            <Badge variant="secondary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Unavailable
                            </Badge>
                          )}
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="card" className="space-y-3">
              {paymentMethods
                .filter(method => method.type === 'card')
                .map(method => (
                  <Card 
                    key={method.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handlePaymentMethodSelect(method)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {method.icon}
                          <div>
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Fee: {method.fees} • {method.processingTime}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="bank" className="space-y-3">
              {paymentMethods
                .filter(method => method.type === 'bank')
                .map(method => (
                  <Card 
                    key={method.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handlePaymentMethodSelect(method)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {method.icon}
                          <div>
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Fee: {method.fees} • {method.processingTime}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {selectedMethod?.icon}
              <span className="ml-2">Pay with {selectedMethod?.name}</span>
            </CardTitle>
            <CardDescription>
              Complete your payment of ৳{amount.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderPaymentForm()}
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={() => setPaymentStep('select')}
                className="w-full"
              >
                Back to Payment Methods
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-muted">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-700">Secure Payment</p>
              <p className="text-muted-foreground">
                Your payment information is encrypted and secure. We never store your payment details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};