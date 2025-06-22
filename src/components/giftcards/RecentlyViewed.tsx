
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star } from 'lucide-react';

export const RecentlyViewed: React.FC = () => {
  const recentCards = [
    { name: 'Daraz Gift Card', logo: '🛒', amount: '৳1,000', discount: '15% off', rating: 4.8, category: 'E-commerce' },
    { name: 'Foodpanda Voucher', logo: '🍔', amount: '৳500', discount: '20% off', rating: 4.6, category: 'Food' },
    { name: 'Star Cineplex', logo: '🎬', amount: '৳800', discount: '25% off', rating: 4.7, category: 'Entertainment' },
    { name: 'Aarong Gift Card', logo: '👗', amount: '৳2,000', discount: '10% off', rating: 4.5, category: 'Fashion' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" />
            <h2 className="text-3xl font-bold">Recently Viewed</h2>
          </div>
          <Button variant="outline">View All History</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{card.logo}</div>
                  <h3 className="font-bold mb-1">{card.name}</h3>
                  <Badge variant="secondary" className="text-xs">{card.category}</Badge>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-xl font-bold text-purple-600">{card.amount}</div>
                  <Badge className="bg-green-100 text-green-800 text-xs">{card.discount}</Badge>
                </div>
                
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{card.rating}</span>
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-sm">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
