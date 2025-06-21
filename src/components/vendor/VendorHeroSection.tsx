
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Users, TrendingUp, Award } from 'lucide-react';

export const VendorHeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Store className="w-8 h-8" />
            <h1 className="text-2xl font-bold">
              Become a GetIt Partner
            </h1>
          </div>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join Bangladesh's fastest-growing marketplace and reach millions of customers
          </p>

          {/* Compact Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-1" />
              <div className="text-lg font-bold">10M+</div>
              <p className="text-xs text-white/90">Customers</p>
            </div>
            
            <div className="text-center">
              <Store className="w-6 h-6 mx-auto mb-1" />
              <div className="text-lg font-bold">50K+</div>
              <p className="text-xs text-white/90">Vendors</p>
            </div>
            
            <div className="text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-1" />
              <div className="text-lg font-bold">৳500Cr+</div>
              <p className="text-xs text-white/90">Sales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
