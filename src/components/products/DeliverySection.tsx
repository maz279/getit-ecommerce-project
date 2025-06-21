
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';

export const DeliverySection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              🎯 EID DELIVERY GUARANTEE
            </h2>
            <div className="text-2xl font-bold text-green-600 mt-4">
              📅 ORDER TODAY, GET BEFORE EID! 📅
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Track My Order
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-green-200 hover:border-green-400 transform hover:scale-105 transition-all">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-bold text-gray-800 mb-2">Same Day Delivery</h3>
              <p className="text-sm text-gray-600 mb-2">(Metro Areas)</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>⏰ Order before 3 PM → Deliver by 8 PM</div>
                <div>🏍️ Express Partnership</div>
                <div>📍 Covers: Major City Areas</div>
                <div>💰 FREE on orders above $150</div>
                <div>📱 Real-time tracking with live location</div>
                <div>🎁 Free gift wrapping for same-day orders</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 transition-all">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🚛</div>
              <h3 className="font-bold text-gray-800 mb-2">Express Delivery</h3>
              <p className="text-sm text-gray-600 mb-2">(Major Cities)</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>📦 Next day delivery</div>
                <div>🚚 Courier network</div>
                <div>💰 Cost: $8 (FREE on orders above $200)</div>
                <div>📅 Order by 12 PM for next-day delivery</div>
                <div>🔒 Insured delivery for valuable items</div>
                <div>📞 SMS/Call updates at every step</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-400 transform hover:scale-105 transition-all">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="font-bold text-gray-800 mb-2">Pickup Points</h3>
              <p className="text-sm text-gray-600 mb-2">(Nationwide)</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>📍 50+ Pickup locations</div>
                <div>🏪 Shopping malls, markets, community centers</div>
                <div>💰 FREE pickup service, no delivery charges</div>
                <div>🕐 Extended hours: 8 AM - 10 PM during EID week</div>
                <div>🔐 Secure locker system for safe collection</div>
                <div>📱 SMS notification when ready for pickup</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 hover:border-red-400 transform hover:scale-105 transition-all">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-800 mb-2">Emergency Delivery</h3>
              <p className="text-sm text-gray-600 mb-2">(2-hour guarantee)</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>🆘 Last-minute EID shopping solution</div>
                <div>🚁 Drone delivery in select areas</div>
                <div>🏍️ 2-hour guaranteed delivery</div>
                <div>💰 Premium service: $30 flat rate</div>
                <div>📞 24/7 emergency hotline</div>
                <div>🎁 Available for gifts, fashion, electronics</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
