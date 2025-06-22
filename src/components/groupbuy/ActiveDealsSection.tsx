
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Star, TrendingUp } from 'lucide-react';

export const ActiveDealsSection: React.FC = () => {
  const activeDeals = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      image: "📱",
      originalPrice: "৳1,50,000",
      groupPrice: "৳1,05,000",
      savings: "৳45,000",
      currentMembers: 45,
      targetMembers: 50,
      timeLeft: "2 days 5hrs",
      category: "Electronics",
      rating: 4.9,
      progress: 90
    },
    {
      id: 2,
      title: "Nike Air Max Sneakers",
      image: "👟",
      originalPrice: "৳12,000",
      groupPrice: "৳8,400",
      savings: "৳3,600",
      currentMembers: 28,
      targetMembers: 30,
      timeLeft: "1 day 12hrs",
      category: "Fashion",
      rating: 4.8,
      progress: 93
    },
    {
      id: 3,
      title: "Samsung 55\" Smart TV",
      image: "📺",
      originalPrice: "৳85,000",
      groupPrice: "৳59,500",
      savings: "৳25,500",
      currentMembers: 18,
      targetMembers: 25,
      timeLeft: "3 days 8hrs",
      category: "Electronics",
      rating: 4.7,
      progress: 72
    },
    {
      id: 4,
      title: "Kitchen Appliance Set",
      image: "🍳",
      originalPrice: "৳25,000",
      groupPrice: "৳17,500",
      savings: "৳7,500",
      currentMembers: 22,
      targetMembers: 30,
      timeLeft: "4 days 15hrs",
      category: "Home",
      rating: 4.6,
      progress: 73
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">🔥 Active Group Deals</h2>
            <p className="text-xl text-gray-600">Join these groups before they close!</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Active Groups
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeDeals.map((deal) => (
            <Card key={deal.id} className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-red-100 text-red-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {deal.timeLeft}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {deal.category}
                  </Badge>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{deal.image}</div>
                  <h3 className="font-bold text-lg mb-2">{deal.title}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{deal.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                    <span className="text-lg font-bold text-green-600">{deal.groupPrice}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-red-600">Save {deal.savings}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{deal.currentMembers}/{deal.targetMembers} joined</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${deal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  <Users className="w-4 h-4 mr-2" />
                  Join Group
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">View All Active Groups</Button>
        </div>
      </div>
    </section>
  );
};
