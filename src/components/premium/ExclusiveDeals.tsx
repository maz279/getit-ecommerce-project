
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Crown } from 'lucide-react';

export const ExclusiveDeals: React.FC = () => {
  const exclusiveDeals = [
    {
      id: 1,
      image: "📱",
      title: "iPhone 15 Pro - Premium Only",
      originalPrice: 150000,
      premiumPrice: 120000,
      discount: 20,
      timeLeft: "6h 24m",
      tier: "Platinum+",
      rating: 4.9,
      reviews: 2847
    },
    {
      id: 2,
      image: "💻",
      title: "MacBook Pro M3 - Diamond Exclusive",
      originalPrice: 220000,
      premiumPrice: 185000,
      discount: 16,
      timeLeft: "12h 15m",
      tier: "Diamond",
      rating: 4.8,
      reviews: 1203
    },
    {
      id: 3,
      image: "⌚",
      title: "Luxury Watch Collection",
      originalPrice: 80000,
      premiumPrice: 60000,
      discount: 25,
      timeLeft: "3h 45m",
      tier: "Gold+",
      rating: 4.7,
      reviews: 856
    },
    {
      id: 4,
      image: "🎧",
      title: "Bose QuietComfort Ultra",
      originalPrice: 45000,
      premiumPrice: 36000,
      discount: 20,
      timeLeft: "8h 30m",
      tier: "Platinum+",
      rating: 4.9,
      reviews: 3241
    }
  ];

  const getTierColor = (tier: string) => {
    if (tier.includes('Diamond')) return 'bg-blue-100 text-blue-800';
    if (tier.includes('Platinum')) return 'bg-purple-100 text-purple-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-500" />
              Premium Exclusive Deals
            </h2>
            <p className="text-gray-600">Special offers available only to premium members</p>
          </div>
          <Button variant="outline">View All Exclusive Deals</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exclusiveDeals.map((deal) => (
            <Card key={deal.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-yellow-100">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      {deal.image}
                    </div>
                  </div>
                  
                  <Badge className={`absolute top-3 left-3 ${getTierColor(deal.tier)}`}>
                    {deal.tier}
                  </Badge>
                  
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {deal.timeLeft}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{deal.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(deal.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({deal.reviews.toLocaleString()})</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      ৳{deal.premiumPrice.toLocaleString()}
                    </span>
                    <span className="text-gray-500 line-through text-sm">
                      ৳{deal.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-red-100 text-red-800">
                      -{deal.discount}% OFF
                    </Badge>
                    <span className="text-xs text-gray-500">Premium Only</span>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    Claim Deal
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
