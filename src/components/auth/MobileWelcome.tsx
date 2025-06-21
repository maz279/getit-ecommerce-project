
import React from 'react';
import { ShoppingCart } from 'lucide-react';

export const MobileWelcome: React.FC = () => {
  return (
    <div className="lg:hidden mb-6">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        🛍️ Welcome Back!
      </h1>
      <p className="text-sm text-gray-600">
        Sign in to your GetIt account
      </p>
    </div>
  );
};
