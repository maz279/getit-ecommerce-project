import React, { createContext, useContext, useState } from 'react';
import { PaymentMethod, PaymentTransaction } from '@/types';
import { usePayment } from '@/providers/PaymentProvider';

interface PaymentContextType {
  selectedMethod: PaymentMethod | null;
  setSelectedMethod: (method: PaymentMethod | null) => void;
  isProcessing: boolean;
  transaction: PaymentTransaction | null;
  processPayment: (amount: number, data: any) => Promise<PaymentTransaction | null>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within PaymentMethods');
  }
  return context;
};

interface PaymentMethodsProps {
  children: React.ReactNode;
  onPaymentComplete?: (transaction: PaymentTransaction) => void;
  onPaymentError?: (error: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  children,
  onPaymentComplete,
  onPaymentError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const { processPayment: processPaymentAPI } = usePayment();

  const processPayment = async (amount: number, data: any): Promise<PaymentTransaction | null> => {
    if (!selectedMethod) {
      onPaymentError?.('No payment method selected');
      return null;
    }

    setIsProcessing(true);
    try {
      const result = await processPaymentAPI(selectedMethod.type, amount, data);
      setTransaction(result);
      onPaymentComplete?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onPaymentError?.(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        selectedMethod,
        setSelectedMethod,
        isProcessing,
        transaction,
        processPayment
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};