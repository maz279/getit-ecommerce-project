
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Shield, Zap } from 'lucide-react';

export const GiftCardTypes: React.FC = () => {
  const cardTypes = [
    {
      id: 1,
      name: 'Digital Gift Cards',
      description: 'Instant delivery via email or SMS',
      image: '💳',
      price: 'From ৳100',
      discount: 'Up to 20% off',
      features: ['Instant delivery', 'No expiry date', 'Mobile friendly', 'Customizable design'],
      popular: true,
      vendors: 200
    },
    {
      id: 2,
      name: 'Physical Gift Cards',
      description: 'Premium cards with beautiful packaging',
      image: '🎁',
      price: 'From ৳500',
      discount: 'Up to 15% off',
      features: ['Premium packaging', 'Gift box included', '1 year validity', 'Perfect for occasions'],
      popular: false,
      vendors: 150
    },
    {
      id: 3,
      name: 'Multi-Brand Cards',
      description: 'Use across multiple partner stores',
      image: '🏪',
      price: 'From ৳1000',
      discount: 'Up to 25% off',
      features: ['500+ partner stores', 'No restrictions', 'Flexible usage', 'Best value'],
      popular: true,
      vendors: 500
    },
    {
      id: 4,
      name: 'Experience Cards',
      description: 'Dining, entertainment & travel experiences',
      image: '🎊',
      price: 'From ৳2000',
      discount: 'Up to 30% off',
      features: ['Restaurant vouchers', 'Movie tickets', 'Spa treatments', 'Travel bookings'],
      popular: false,
      vendors: 75
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Perfect Gift Card</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From instant digital cards to premium physical gifts, find the perfect option for any occasion
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardTypes.map((card) => (
            <Card key={card.id} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${card.popular ? 'ring-2 ring-purple-500' : ''}`}>
              {card.popular && (
                <Badge className="absolute top-4 right-4 bg-purple-500 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{card.image}</div>
                  <h3 className="text-xl font-bold mb-2">{card.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{card.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-purple-600">{card.price}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {card.discount}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{card.vendors}+ vendors available</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {card.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Browse {card.name}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Can't decide? Let our Gift Card Finder help you</p>
          <Button variant="outline" className="px-8 py-3">
            🎯 Use Gift Card Finder
          </Button>
        </div>
      </div>
    </section>
  );
};
