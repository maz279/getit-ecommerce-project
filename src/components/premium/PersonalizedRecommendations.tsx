
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Heart, Zap } from 'lucide-react';

export const PersonalizedRecommendations: React.FC = () => {
  const recommendations = [
    {
      category: "For You",
      icon: <Heart className="w-5 h-5" />,
      color: "bg-pink-100 text-pink-800",
      products: [
        { name: "Wireless Earbuds Pro", price: 8500, match: "98%" },
        { name: "Smart Fitness Watch", price: 12000, match: "95%" },
        { name: "Premium Coffee Maker", price: 15000, match: "92%" }
      ]
    },
    {
      category: "Trending Now",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-green-100 text-green-800",
      products: [
        { name: "Gaming Mechanical Keyboard", price: 7500, match: "89%" },
        { name: "4K Webcam", price: 9500, match: "87%" },
        { name: "Portable SSD 1TB", price: 11000, match: "85%" }
      ]
    },
    {
      category: "AI Suggested",
      icon: <Brain className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-800",
      products: [
        { name: "Ergonomic Office Chair", price: 25000, match: "96%" },
        { name: "Smart Home Hub", price: 8000, match: "94%" },
        { name: "Wireless Charging Pad", price: 3500, match: "91%" }
      ]
    },
    {
      category: "Flash Picks",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-800",
      products: [
        { name: "Bluetooth Speaker", price: 4500, match: "88%" },
        { name: "Phone Camera Lens Kit", price: 2800, match: "86%" },
        { name: "Desk Organizer Set", price: 1500, match: "84%" }
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            AI-Powered Recommendations
          </h2>
          <p className="text-xl text-gray-600">
            Personalized suggestions based on your shopping behavior and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={category.color}>
                    {category.icon}
                    {category.category}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {category.products.map((product, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                        <Badge variant="outline" className="text-xs ml-2">
                          {product.match}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-green-600">৳{product.price.toLocaleString()}</span>
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-6">
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="w-full mt-4 text-sm">
                  View All in {category.category}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎯 Smart Shopping Assistant</h3>
          <p className="text-lg mb-6 opacity-90">
            Our AI learns from your behavior to suggest products you'll love. 
            Premium members get priority access to our most advanced recommendation engine.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">🧠</div>
              <div className="font-bold">Machine Learning</div>
              <div className="text-sm opacity-75">Advanced AI algorithms</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-bold">Behavioral Analysis</div>
              <div className="text-sm opacity-75">Pattern recognition</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold">Precision Targeting</div>
              <div className="text-sm opacity-75">98% accuracy rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
