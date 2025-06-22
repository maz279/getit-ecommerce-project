
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const PaymentMethodsSection: React.FC = () => {
  const paymentMethods = [
    { name: "bKash", icon: "📱", color: "bg-pink-500" },
    { name: "Nagad", icon: "💳", color: "bg-orange-500" },
    { name: "Rocket", icon: "🚀", color: "bg-purple-500" },
    { name: "Cash on Delivery", icon: "💵", color: "bg-green-500" },
    { name: "Visa", icon: "💎", color: "bg-blue-500" },
    { name: "MasterCard", icon: "💳", color: "bg-red-500" },
    { name: "PayPal", icon: "🌐", color: "bg-indigo-500" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">💳 Supported Payment Methods</h2>
          <p className="text-xl text-gray-600">Choose your preferred payment option for secure transactions</p>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {paymentMethods.map((method, index) => (
                <div 
                  key={index} 
                  className={`${method.color} text-white rounded-lg p-4 text-center hover:scale-105 transition-transform cursor-pointer`}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="text-xs font-semibold">{method.name}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-lg">
                <span className="text-green-600">🔒</span>
                <span className="text-sm font-medium">All payments are secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
