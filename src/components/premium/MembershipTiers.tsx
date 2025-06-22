
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Diamond, Check } from 'lucide-react';

export const MembershipTiers: React.FC = () => {
  const tiers = [
    {
      name: "Gold",
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      price: "৳299",
      period: "monthly",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      features: [
        "5% cashback on all purchases",
        "Free delivery on orders over ৳500",
        "Early access to sales (2 hours)",
        "Basic customer support",
        "Monthly exclusive deals"
      ]
    },
    {
      name: "Platinum",
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      price: "৳599",
      period: "monthly",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      popular: true,
      features: [
        "10% cashback on all purchases",
        "Free delivery on all orders",
        "Early access to sales (6 hours)",
        "Priority customer support",
        "Weekly exclusive deals",
        "Access to premium brands",
        "Extended warranty on electronics"
      ]
    },
    {
      name: "Diamond",
      icon: <Diamond className="w-8 h-8 text-blue-400" />,
      price: "৳999",
      period: "monthly",
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
      features: [
        "15% cashback on all purchases",
        "Free express delivery",
        "24 hours early access to sales",
        "Dedicated account manager",
        "Daily exclusive deals",
        "Luxury brand access",
        "Premium insurance coverage",
        "Personal shopping assistant",
        "VIP event invitations"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Premium Tier</h2>
          <p className="text-xl text-gray-600">Unlock different levels of exclusive benefits</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <Card key={index} className={`relative overflow-hidden ${tier.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''}`}>
              {tier.popular && (
                <Badge className="absolute top-4 right-4 bg-purple-500 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardContent className="p-0">
                <div className={`${tier.color} text-white p-6 text-center`}>
                  {tier.icon}
                  <h3 className="text-2xl font-bold mt-2">{tier.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-lg opacity-75">/{tier.period}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    size="lg"
                  >
                    Choose {tier.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
