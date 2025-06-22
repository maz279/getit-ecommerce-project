
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, RefreshCw, Headphones } from 'lucide-react';

export const TrustSafetySection: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Secure Payments",
      description: "SSL encrypted payments with multiple secure payment options"
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "Data Protection", 
      description: "Your personal information is protected with bank-level security"
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-purple-600" />,
      title: "Money Back Guarantee",
      description: "100% refund if group doesn't meet target or product issues"
    },
    {
      icon: <Headphones className="w-8 h-8 text-orange-600" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service for all your queries"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🛡️ Trust & Safety</h2>
          <p className="text-xl text-gray-600">Your security and satisfaction are our top priorities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-white rounded-lg p-6 shadow-md">
            <div className="text-2xl">🏆</div>
            <div className="text-left">
              <div className="font-bold text-lg">Trusted by 500K+ Users</div>
              <div className="text-gray-600">Join Bangladesh's most trusted group buying platform</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
