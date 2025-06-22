
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Eye } from 'lucide-react';

export const PopularGroupsSection: React.FC = () => {
  const popularGroups = [
    {
      id: 1,
      title: "Gaming Laptop Bundle",
      image: "💻",
      members: 156,
      target: 200,
      discount: "40%",
      category: "Electronics",
      trending: true
    },
    {
      id: 2,
      title: "Organic Baby Food Set",
      image: "🍼",
      members: 89,
      target: 100,
      discount: "35%",
      category: "Baby & Kids",
      trending: false
    },
    {
      id: 3,
      title: "Fitness Equipment Pack",
      image: "🏋️",
      members: 234,
      target: 250,
      discount: "50%",
      category: "Sports",
      trending: true
    },
    {
      id: 4,
      title: "Premium Skincare Set",
      image: "✨",
      members: 67,
      target: 80,
      discount: "45%",
      category: "Beauty",
      trending: false
    },
    {
      id: 5,
      title: "Smart Home Bundle",
      image: "🏠",
      members: 123,
      target: 150,
      discount: "38%",
      category: "Home",
      trending: true
    },
    {
      id: 6,
      title: "Professional Camera Kit",
      image: "📸",
      members: 45,
      target: 60,
      discount: "42%",
      category: "Electronics",
      trending: false
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🌟 Most Popular Groups</h2>
          <p className="text-xl text-gray-600">Join the most successful group buying campaigns</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-purple-100 text-purple-800">
                    {group.discount} OFF
                  </Badge>
                  {group.trending && (
                    <Badge className="bg-red-500 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{group.image}</div>
                  <h3 className="font-bold text-lg mb-2">{group.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {group.category}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Members</span>
                    <span className="font-semibold">{group.members}/{group.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(group.members / group.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Users className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
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
