
import React from 'react';
import { Check } from 'lucide-react';

export const PricingTiers: React.FC = () => {
  const tiers = [
    {
      name: 'Starter',
      minOrder: '50+ units',
      discount: '15-25%',
      features: ['Basic bulk pricing', 'Standard shipping', 'Email support'],
      color: 'border-gray-300'
    },
    {
      name: 'Business',
      minOrder: '200+ units',
      discount: '25-35%',
      features: ['Better bulk pricing', 'Priority shipping', 'Phone support', 'Dedicated manager'],
      color: 'border-blue-500',
      popular: true
    },
    {
      name: 'Enterprise',
      minOrder: '1000+ units',
      discount: '35-50%',
      features: ['Best bulk pricing', 'Express shipping', '24/7 support', 'Custom solutions', 'Payment terms'],
      color: 'border-purple-500'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Tiers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-lg p-6 border-2 ${tier.color} relative`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{tier.name}</h3>
              <p className="text-gray-600 mb-4">Minimum order: {tier.minOrder}</p>
              
              <div className="text-3xl font-bold text-blue-600 mb-6">{tier.discount}</div>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                tier.popular 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}>
                Get Quote
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
