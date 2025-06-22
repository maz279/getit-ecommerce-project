
import React from 'react';
import { Clock, Zap, Gift, Truck } from 'lucide-react';

export const BestSellerOffers: React.FC = () => {
  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="bg-gray-100 rounded-full p-2 w-12 h-12 mx-auto mb-1 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-bold text-sm text-gray-800">Flash Sale</h3>
            <p className="text-xs text-gray-600">Up to 70% OFF</p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-100 rounded-full p-2 w-12 h-12 mx-auto mb-1 flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-bold text-sm text-gray-800">Free Shipping</h3>
            <p className="text-xs text-gray-600">Orders over ৳1000</p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-100 rounded-full p-2 w-12 h-12 mx-auto mb-1 flex items-center justify-center">
              <Gift className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-bold text-sm text-gray-800">Gift Vouchers</h3>
            <p className="text-xs text-gray-600">Extra 5% OFF</p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-100 rounded-full p-2 w-12 h-12 mx-auto mb-1 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-bold text-sm text-gray-800">Lightning Deals</h3>
            <p className="text-xs text-gray-600">Limited Time</p>
          </div>
        </div>
      </div>
    </section>
  );
};
