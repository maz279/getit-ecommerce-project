
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const GroupBuyBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: "💰",
      title: "Massive Savings",
      description: "Save up to 70% compared to regular retail prices",
      color: "text-green-600"
    },
    {
      icon: "🤝",
      title: "Community Power",
      description: "Join with others to unlock group discounts",
      color: "text-blue-600"
    },
    {
      icon: "🛡️",
      title: "Buyer Protection",
      description: "100% secure payments and money-back guarantee",
      color: "text-purple-600"
    },
    {
      icon: "⚡",
      title: "Fast Processing",
      description: "Quick group completion and immediate shipping",
      color: "text-orange-600"
    },
    {
      icon: "🎯",
      title: "Quality Guaranteed",
      description: "All products verified and authentic brands only",
      color: "text-red-600"
    },
    {
      icon: "📦",
      title: "Free Shipping",
      description: "Complimentary delivery on all group purchase orders",
      color: "text-teal-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">✨ Why Choose Group Buy?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the power of collective purchasing with unmatched benefits
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className={`font-bold text-xl mb-3 ${benefit.color}`}>{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
