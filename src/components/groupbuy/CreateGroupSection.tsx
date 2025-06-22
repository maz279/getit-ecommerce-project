
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Target, Gift } from 'lucide-react';

export const CreateGroupSection: React.FC = () => {
  const steps = [
    {
      icon: <Plus className="w-6 h-6" />,
      title: "Choose Product",
      description: "Select any product you want to buy with friends"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Set Group Size", 
      description: "Decide how many people needed for the best discount"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Share & Invite",
      description: "Invite friends or let others discover your group"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Enjoy Savings",
      description: "Everyone gets the discounted price when target is met"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">🚀 Start Your Own Group</h2>
            <p className="text-xl mb-8 text-cyan-100">
              Can't find what you're looking for? Create your own group and invite others to join!
            </p>
            
            <div className="space-y-6 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                    <p className="text-cyan-100">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3">
              <Plus className="w-5 h-5 mr-2" />
              Create New Group
            </Button>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="font-bold text-2xl mb-6 text-center">Group Creator Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Get extra 5% discount as group organizer</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Priority customer support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Flexible group management tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Earn referral bonuses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
