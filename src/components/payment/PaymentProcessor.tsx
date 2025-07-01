import React from 'react';
import { BkashPayment } from './providers/BkashProvider';
import { NagadPayment } from './providers/NagadProvider';
import { RocketPayment } from './providers/RocketProvider';
import { CODPayment } from './providers/CODProvider';
import { BankTransferPayment } from './providers/BankTransferProvider';
import { usePaymentContext } from './PaymentMethods';
import { PaymentMethod } from '@/types';

interface PaymentProcessorProps {
  amount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = (props) => {
  const { selectedMethod } = usePaymentContext();

  if (!selectedMethod) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please select a payment method to continue</p>
      </div>
    );
  }

  const renderPaymentComponent = () => {
    switch (selectedMethod.type) {
      case 'bkash':
        return <BkashPayment {...props} />;
      case 'nagad':
        return <NagadPayment {...props} />;
      case 'rocket':
        return <RocketPayment {...props} />;
      case 'cod':
        return <CODPayment {...props} />;
      case 'bank_transfer':
        return <BankTransferPayment {...props} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-red-600">Payment method not supported yet</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
        <img 
          src={selectedMethod.icon} 
          alt={selectedMethod.name} 
          className="w-6 h-6" 
        />
        <span className="font-medium">
          {selectedMethod.name} ({selectedMethod.namebn})
        </span>
      </div>
      {renderPaymentComponent()}
    </div>
  );
};