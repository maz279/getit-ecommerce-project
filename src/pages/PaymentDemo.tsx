import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { CreditCard, Shield, Zap } from 'lucide-react';

export default function PaymentDemo() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Payment Integration</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Secure payment processing with Stripe. Configure your Stripe secret key to enable live payments.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="text-center">
            <CreditCard className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Secure Payments</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              PCI-compliant payment processing with industry-standard security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Fraud Protection</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Advanced fraud detection and prevention powered by Stripe.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Zap className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Instant Processing</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Fast payment processing with real-time confirmation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Demo */}
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Payment Demo</CardTitle>
            <p className="text-muted-foreground">
              Test the payment integration (requires Stripe configuration)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <PaymentButton
                amount={9.99}
                currency="USD"
                description="Sample Product"
                className="w-full"
              />
              <PaymentButton
                amount={29.99}
                currency="USD"
                description="Premium Service"
                className="w-full"
              />
            </div>
            <PaymentButton
              amount={99.99}
              currency="USD"
              description="Professional Package"
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* Configuration Notice */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configuration Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            To enable live payments, you need to:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Create a Stripe account at <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">stripe.com</a></li>
            <li>Get your Stripe Secret Key from the dashboard</li>
            <li>Configure the secret key in your edge function</li>
            <li>Set up your payment amounts and success/cancel URLs</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}