
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { giftGuide } from '@/data/productsData';

export const GiftGuideSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🎁 EID Gift Guide 🎁
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Complete Gift Guide
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {giftGuide.map((guide, index) => (
            <Card key={index} className="border-2 border-pink-200 hover:border-pink-400 transform hover:scale-105 transition-all">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{guide.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{guide.recipient}</h3>
                </div>
                <div className="space-y-2 mb-4">
                  {guide.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Gift className="w-3 h-3 text-pink-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {guide.priceRange}
                  </div>
                  <Button variant="outline" className="w-full border-pink-500 text-pink-600 hover:bg-pink-50">
                    🎁 Shop Gifts
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎁 Custom Gift Services 🎁</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">📦 Gift Wrapping Services</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Premium EID wrapping paper</li>
                  <li>• Personalized gift messages</li>
                  <li>• Themed gift boxes</li>
                  <li>• Ribbon & bow decoration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">💌 Personalized Gifts</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Custom name engraving</li>
                  <li>• Photo printing on items</li>
                  <li>• Personalized clothing</li>
                  <li>• Custom gift baskets</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="flex gap-2 justify-center">
                <Button className="bg-purple-500 hover:bg-purple-600">🎁 Gift Wrapping</Button>
                <Button variant="outline">✍️ Personalization</Button>
                <Button variant="outline">📞 Gift Advice</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
