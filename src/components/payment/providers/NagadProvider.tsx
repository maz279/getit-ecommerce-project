// Placeholder for Nagad payment component
import React from 'react';

interface NagadPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export const NagadPayment: React.FC<NagadPaymentProps> = ({ amount, onSuccess, onCancel }) => {
  return (
    <div className="text-center p-4">
      <p>Nagad payment integration coming soon</p>
      <button onClick={() => onSuccess(`NAGAD_${Date.now()}`)} className="mt-2 px-4 py-2 bg-orange-600 text-white rounded">
        Simulate Nagad Payment
      </button>
    </div>
  );
};