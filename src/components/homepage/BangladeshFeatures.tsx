
import React from 'react';
import { MapPin, Clock, Phone, CreditCard, Truck, HeadphonesIcon } from 'lucide-react';

export const BangladeshFeatures: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-green-600 to-red-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Made for Bangladesh 🇧🇩
          </h2>
          <p className="text-white opacity-90 text-lg">
            Serving all 64 districts with love and care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Delivery Coverage */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Nationwide Delivery</h3>
              <div className="space-y-2 text-white opacity-90">
                <div className="flex items-center justify-between">
                  <span>Dhaka & Chittagong:</span>
                  <span className="font-semibold">Same Day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Division Cities:</span>
                  <span className="font-semibold">Next Day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Other Areas:</span>
                  <span className="font-semibold">2-3 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Local Payment Methods</h3>
              <div className="space-y-2 text-white opacity-90">
                <div>✅ Cash on Delivery</div>
                <div>✅ bKash, Nagad, Rocket</div>
                <div>✅ All Major Credit Cards</div>
                <div>✅ Bank Transfer</div>
                <div className="mt-3 text-green-300 font-semibold">
                  500+ orders get FREE shipping!
                </div>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-center">
              <HeadphonesIcon className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Local Support Team</h3>
              <div className="space-y-3 text-white opacity-90">
                <div className="flex items-center gap-2 justify-center">
                  <Phone className="w-4 h-4" />
                  <span>+880-1234-567890</span>
                </div>
                <div>📱 WhatsApp Support</div>
                <div>💬 Live Chat 24/7</div>
                <div>🕒 Call Center: 9AM-11PM</div>
                <div className="text-yellow-300 font-semibold">
                  English & Bengali Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Bangladesh Offers */}
        <div className="mt-12 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">🎉 Bangladesh Special Offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="text-center">
                <div className="text-3xl mb-2">🎁</div>
                <div className="font-semibold">Independence Day Sale</div>
                <div className="text-sm opacity-90">50% off on selected items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌙</div>
                <div className="font-semibold">Ramadan Special</div>
                <div className="text-sm opacity-90">Free Iftar delivery available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎒</div>
                <div className="font-semibold">Back to School</div>
                <div className="text-sm opacity-90">Education essentials at low prices</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
