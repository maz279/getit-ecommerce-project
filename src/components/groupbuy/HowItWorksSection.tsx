
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "1",
      title: "Find or Create a Group",
      description: "Browse existing groups or start your own for any product you want",
      icon: "🔍",
      color: "bg-blue-500"
    },
    {
      step: "2", 
      title: "Invite More People",
      description: "Share with friends and family to reach the minimum group size",
      icon: "📢",
      color: "bg-green-500"
    },
    {
      step: "3",
      title: "Unlock Bigger Discounts",
      description: "The more people join, the bigger the discount becomes",
      icon: "🔓",
      color: "bg-purple-500"
    },
    {
      step: "4",
      title: "Complete Purchase",
      description: "Once target is met, everyone gets the discounted price",
      icon: "✅",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🤝 How Group Buy Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            It's simple! The more people who join your group, the more everyone saves.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow relative">
              <CardContent className="p-8">
                <div className={`${step.color} text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4`}>
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300"></div>
              )}
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
            Start Your First Group Buy
          </Button>
        </div>
      </div>
    </section>
  );
};
