// Placeholder components
import React from 'react';

export const RocketPayment: React.FC<any> = ({ onSuccess }) => (
  <div className="text-center p-4">
    <p>Rocket payment coming soon</p>
    <button onClick={() => onSuccess(`ROCKET_${Date.now()}`)} className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">Simulate</button>
  </div>
);

export const BankTransferPayment: React.FC<any> = ({ onSuccess }) => (
  <div className="text-center p-4">
    <p>Bank transfer coming soon</p>
    <button onClick={() => onSuccess(`BANK_${Date.now()}`)} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Simulate</button>
  </div>
);