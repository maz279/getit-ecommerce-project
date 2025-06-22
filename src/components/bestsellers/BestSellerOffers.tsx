
import React from 'react';
import { Clock, Zap, Gift, Truck } from 'lucide-react';

export const BestSellerOffers: React.FC = () => {
  return (
    <section className="py-8 bg-gradient-to-r from-red-500 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-sm">Flash Sale</h3>
            <p className="text-xs opacity-90">Up to 70% OFF</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-sm">Free Shipping</h3>
            <p className="text-xs opacity-90">Orders over ৳1000</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-sm">Gift Vouchers</h3>
            <p className="text-xs opacity-90">Extra 5% OFF</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-sm">Lightning Deals</h3>
            <p className="text-xs opacity-90">Limited Time</p>
          </div>
        </div>
      </div>
    </section>
  );
};
