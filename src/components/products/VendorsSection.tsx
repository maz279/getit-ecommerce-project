
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star } from 'lucide-react';
import { featuredVendors } from '@/data/productsData';

export const VendorsSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-yellow-100 to-orange-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🏆 EID Featured Vendors
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            View All Vendors
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVendors.map((vendor, index) => (
            <Card key={index} className="border-2 border-yellow-200 hover:border-yellow-400 transform hover:scale-105 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">{vendor.badge}</div>
                <h3 className="font-bold text-gray-800 mb-2">{vendor.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{vendor.rating}/5</span>
                  <span className="text-gray-500 text-sm">({vendor.reviews.toLocaleString()}+ reviews)</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">🎯 {vendor.specialty}</p>
                <div className="text-xs text-green-600 font-semibold mb-3">{vendor.discount}</div>
                <Button variant="outline" className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                  🛍️ Shop Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">🎯 All Featured Vendors: Verified ✅ | Top Rated ⭐ | Fast Delivery 🚚</p>
        </div>
      </div>
    </section>
  );
};
