import React from 'react';
import { CheckCircle, Package, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CODPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export const CODPayment: React.FC<CODPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onCancel
}) => {
  const handleConfirm = () => {
    // For COD, we just need to confirm the order
    const transactionId = `COD_${orderId}_${Date.now()}`;
    onSuccess(transactionId);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-green-600">Cash on Delivery</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">৳{amount.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Amount to Pay on Delivery</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">Cash on Delivery Selected</h4>
              <p className="text-sm text-green-700">
                You will pay ৳{amount.toLocaleString()} in cash when your order is delivered to your doorstep.
              </p>
              <p className="text-sm text-green-700">
                আপনার অর্ডার পৌঁছানোর সময় আপনি ৳{amount.toLocaleString()} নগদ অর্থ প্রদান করবেন।
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Delivery: 1-3 business days</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Please have exact change ready</p>
            <p>• Our delivery agent will verify your order before payment</p>
            <p>• You can inspect the product before paying</p>
            <p>• Valid government ID required for verification</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleConfirm}
          >
            Confirm Cash on Delivery Order
          </Button>
          <Button variant="outline" className="w-full" onClick={onCancel}>
            Choose Different Payment Method
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>No online payment required</p>
          <p>কোন অনলাইন পেমেন্ট প্রয়োজন নেই</p>
        </div>
      </CardContent>
    </Card>
  );
};