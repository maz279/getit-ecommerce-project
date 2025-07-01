import React, { createContext, useContext, ReactNode } from 'react';
import { PaymentMethod, PaymentTransaction } from '@/types';

interface PaymentContextType {
  availablePaymentMethods: PaymentMethod[];
  processPayment: (method: PaymentMethod['type'], amount: number, data: any) => Promise<PaymentTransaction>;
  verifyPayment: (transactionId: string) => Promise<boolean>;
  refundPayment: (transactionId: string, amount?: number) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const availablePaymentMethods: PaymentMethod[] = [
    {
      id: 'bkash',
      type: 'bkash',
      name: 'bKash',
      namebn: 'বিকাশ',
      icon: '/assets/payments/bkash.png',
      isActive: true,
      processingFee: 2.5,
      currency: 'BDT'
    },
    {
      id: 'nagad',
      type: 'nagad',
      name: 'Nagad',
      namebn: 'নগদ',
      icon: '/assets/payments/nagad.png',
      isActive: true,
      processingFee: 2.0,
      currency: 'BDT'
    },
    {
      id: 'rocket',
      type: 'rocket',
      name: 'Rocket',
      namebn: 'রকেট',
      icon: '/assets/payments/rocket.png',
      isActive: true,
      processingFee: 2.3,
      currency: 'BDT'
    },
    {
      id: 'cod',
      type: 'cod',
      name: 'Cash on Delivery',
      namebn: 'ক্যাশ অন ডেলিভারি',
      icon: '/assets/payments/cod.png',
      isActive: true,
      processingFee: 0,
      currency: 'BDT'
    }
  ];

  const processPayment = async (
    method: PaymentMethod['type'],
    amount: number,
    data: any
  ): Promise<PaymentTransaction> => {
    // This would integrate with actual payment gateways
    console.log('Processing payment:', { method, amount, data });
    
    // Mock implementation
    return {
      id: `txn_${Date.now()}`,
      orderId: data.orderId,
      amount,
      currency: 'BDT',
      method,
      status: 'processing',
      transactionId: `${method}_${Date.now()}`,
      reference: data.reference || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const verifyPayment = async (transactionId: string): Promise<boolean> => {
    // This would verify with actual payment gateway
    console.log('Verifying payment:', transactionId);
    return true;
  };

  const refundPayment = async (transactionId: string, amount?: number): Promise<boolean> => {
    // This would process refund with actual payment gateway
    console.log('Processing refund:', { transactionId, amount });
    return true;
  };

  return (
    <PaymentContext.Provider value={{
      availablePaymentMethods,
      processPayment,
      verifyPayment,
      refundPayment
    }}>
      {children}
    </PaymentContext.Provider>
  );
};