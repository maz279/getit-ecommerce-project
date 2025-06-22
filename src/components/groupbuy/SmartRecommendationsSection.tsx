
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, TrendingUp, Zap } from 'lucide-react';

export const SmartRecommendationsSection: React.FC = () => {
  const aiFeatures = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI-Powered Matching",
      description: "Our smart algorithm matches you with groups based on your shopping history and preferences"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Find Similar Shoppers",
      description: "Connect with buyers who have similar taste and shopping patterns for better group success"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Trending Predictions",
      description: "Get recommendations for groups likely to succeed based on market trends and demand"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Real-time Notifications",
      description: "Instant updates via SMS, email, and app notifications when groups reach milestones"
    }
  ];

  const recommendedGroups = [
    {
      title: "Wireless Earbuds",
      category: "Electronics",
      members: 23,
      target: 25,
      discount: "45%",
      match: "98%"
    },
    {
      title: "Organic Tea Collection",
      category: "Food & Beverages",
      members: 15,
      target: 20,
      discount: "30%",
      match: "87%"
    },
    {
      title: "Skincare Bundle",
      category: "Beauty",
      members: 12,
      target: 15,
      discount: "40%",
      match: "92%"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🤖 Smart Group Matching</h2>
          <p className="text-xl text-gray-600">AI-powered recommendations for better group buying experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {aiFeatures.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-8">🎯 Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedGroups.map((group, index) => (
              <Card key={index} className="border-2 border-purple-100">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-green-100 text-green-800">{group.match} Match</Badge>
                    <Badge className="bg-purple-100 text-purple-800">{group.discount} OFF</Badge>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-2">{group.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{group.category}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{group.members}/{group.target} joined</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(group.members / group.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Join Recommended Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
