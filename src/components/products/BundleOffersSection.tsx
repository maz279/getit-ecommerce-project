
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { bundleOffers } from '@/data/productsData';

export const BundleOffersSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🎁 EID COMBO DEALS 🎁
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            View All Bundles
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {bundleOffers.map((bundle, index) => (
            <Card key={index} className="transform hover:scale-105 transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    👨‍👩‍👧‍👦 {bundle.title}
                  </h3>
                  <p className="text-gray-600 font-semibold">{bundle.description}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {bundle.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>• {item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">💰 Individual Price:</span>
                    <span className="font-bold">${bundle.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600 font-bold">🎊 Bundle Price:</span>
                    <span className="text-xl font-bold text-green-600">${bundle.bundlePrice.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ({bundle.savings}% SAVINGS!)
                    </span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-green-600 font-semibold text-sm">
                    🎁 {bundle.freeBonus}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold">
                    🛒 Get Package
                  </Button>
                  <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-50">
                    📱 Customize
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
