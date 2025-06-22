
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const GiftCardOccasions: React.FC = () => {
  const occasions = [
    {
      category: 'Religious & Cultural Celebrations',
      icon: '🕌',
      color: 'bg-green-50 border-green-200',
      events: [
        { name: 'Eid ul-Fitr & Eid ul-Adha', items: 'Traditional clothing, food items, gifts for family' },
        { name: 'Durga Puja', items: 'Festive wear, home décor, traditional items' },
        { name: 'Pohela Boishakh', items: 'Bengali New Year celebration essentials' },
        { name: 'Victory Day & Independence Day', items: 'Patriotic merchandise, books' }
      ]
    },
    {
      category: 'Personal Milestones',
      icon: '🎉',
      color: 'bg-blue-50 border-blue-200',
      events: [
        { name: 'Birthdays', items: 'Electronics, fashion, personal care items' },
        { name: 'Weddings', items: 'Home essentials, appliances, traditional wear' },
        { name: 'Graduations', items: 'Books, laptops, professional attire' },
        { name: 'New Job', items: 'Professional clothing, gadgets, office supplies' }
      ]
    },
    {
      category: 'Seasonal Occasions',
      icon: '🌸',
      color: 'bg-purple-50 border-purple-200',
      events: [
        { name: 'Winter Shopping', items: 'Warm clothing, heaters, seasonal foods' },
        { name: 'Monsoon Preparation', items: 'Umbrellas, rainwear, home protection' },
        { name: 'Back to School', items: 'Educational materials, uniforms, stationery' },
        { name: 'Festival Seasons', items: 'Decorative items, special foods, gifts' }
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🎯 Perfect Gift Card Occasions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From religious celebrations to personal milestones, find the perfect gifting moment
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {occasions.map((occasion, index) => (
            <Card key={index} className={`${occasion.color} hover:shadow-lg transition-all duration-300`}>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{occasion.icon}</div>
                <CardTitle className="text-xl">{occasion.category}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {occasion.events.map((event, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-2">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.items}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🎊 Special Occasion Recommendations</h3>
            <p className="text-orange-100 mb-6 max-w-3xl mx-auto">
              Not sure what amount to choose? Our gift card finder can help you select the perfect denomination 
              based on the occasion and relationship with the recipient.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
                <h4 className="font-bold mb-1">Family Members</h4>
                <p className="text-sm text-orange-100">৳2,500 - ৳10,000</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl mb-2">👥</div>
                <h4 className="font-bold mb-1">Friends & Colleagues</h4>
                <p className="text-sm text-orange-100">৳500 - ৳2,500</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl mb-2">💼</div>
                <h4 className="font-bold mb-1">Business Partners</h4>
                <p className="text-sm text-orange-100">৳1,000 - ৳5,000</p>
              </div>
            </div>
            
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
              Use Gift Card Finder
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
