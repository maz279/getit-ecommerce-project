
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Calendar, Gift, Zap, Shield, Crown } from 'lucide-react';

export const PremiumPerks: React.FC = () => {
  const perks = [
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      title: "Free Express Delivery",
      description: "Free same-day delivery in Dhaka, next-day nationwide",
      badge: "All Tiers",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Early Access Sales",
      description: "Shop exclusive deals 24 hours before everyone else",
      badge: "Platinum+",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <Gift className="w-8 h-8 text-pink-600" />,
      title: "Birthday Surprises",
      description: "Special gifts and exclusive offers on your birthday",
      badge: "All Tiers",
      color: "bg-pink-100 text-pink-800"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Lightning Deals",
      description: "Access to flash sales with up to 70% discounts",
      badge: "Gold+",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Premium Insurance",
      description: "Free insurance coverage for high-value purchases",
      badge: "Diamond",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Crown className="w-8 h-8 text-indigo-600" />,
      title: "VIP Events",
      description: "Exclusive invitations to brand launches and shows",
      badge: "Diamond",
      color: "bg-indigo-100 text-indigo-800"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🎁 Premium Member Perks</h2>
          <p className="text-xl text-gray-600">
            Exclusive benefits that make your shopping experience extraordinary
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Badge className={`${perk.color} mb-4`}>
                    {perk.badge}
                  </Badge>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-full inline-block mb-4 group-hover:bg-gray-100 transition-colors">
                  {perk.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{perk.title}</h3>
                <p className="text-gray-600">{perk.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">🚀 Limited Time Offer</h3>
          <p className="text-xl mb-6 opacity-90">
            Join Premium now and get your first month FREE! Plus, enjoy a welcome bonus of ৳500 cashback.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">1st Month</div>
              <div className="text-sm opacity-75">Completely Free</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">৳500</div>
              <div className="text-sm opacity-75">Welcome Cashback</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">Free</div>
              <div className="text-sm opacity-75">Express Delivery</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-75">Premium Support</div>
            </div>
          </div>
          <div className="text-lg mb-4">⏰ Offer ends in: <span className="font-bold">3 days 14 hours</span></div>
        </div>
      </div>
    </section>
  );
};
