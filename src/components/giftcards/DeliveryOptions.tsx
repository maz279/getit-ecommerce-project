
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Mail, Smartphone, Gift, Truck } from 'lucide-react';

export const DeliveryOptions: React.FC = () => {
  const deliveryMethods = [
    {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      name: 'Email Delivery',
      time: 'Instant',
      description: 'Perfect for last-minute gifts',
      features: ['Immediate delivery', 'Mobile optimized', 'Print ready'],
      price: 'Free',
      popular: true
    },
    {
      icon: <Smartphone className="w-8 h-8 text-green-600" />,
      name: 'SMS Delivery',
      time: '1-2 minutes',
      description: 'Direct to mobile phone',
      features: ['SMS with link', 'No email required', 'Simple redemption'],
      price: 'Free',
      popular: false
    },
    {
      icon: <Gift className="w-8 h-8 text-purple-600" />,
      name: 'Physical Card',
      time: '1-3 days',
      description: 'Premium packaging included',
      features: ['Gift box', 'Greeting card', 'Premium materials'],
      price: '৳50',
      popular: false
    },
    {
      icon: <Truck className="w-8 h-8 text-orange-600" />,
      name: 'Express Delivery',
      time: 'Same day',
      description: 'Physical cards delivered fast',
      features: ['Same day delivery', 'Dhaka & Chittagong', 'Tracking included'],
      price: '৳150',
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🚚 Choose Your Delivery Method</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From instant digital delivery to premium physical packaging - we've got you covered
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryMethods.map((method, index) => (
            <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${method.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {method.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {method.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2">{method.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">{method.time}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                
                <div className="space-y-2 mb-6">
                  {method.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">{method.price}</div>
                  <button className="w-full bg-purple-600 text-white hover:bg-purple-700 py-2 px-4 rounded-lg transition-colors">
                    Select Method
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">📍 Delivery Coverage</h3>
            <p className="text-gray-600 mb-4">Digital delivery: Worldwide • Physical delivery: All major cities in Bangladesh</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map((city) => (
                <Badge key={city} variant="secondary" className="bg-blue-100 text-blue-800">
                  {city}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
