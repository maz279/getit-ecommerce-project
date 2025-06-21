
import React, { useState, useEffect } from 'react';
import { X, Gift, Clock, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';

export const OfferPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600">
        {/* Hidden title and description for accessibility */}
        <DialogTitle className="sr-only">Great GetIt Sale Offer</DialogTitle>
        <DialogDescription className="sr-only">
          Special sale offer with up to 70% off on electronics, fashion and more. Limited time offer with free shipping and extra discount code.
        </DialogDescription>
        
        <div className="relative text-white text-center p-6">
          {/* Decorative elements */}
          <div className="absolute top-2 left-4">
            <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute top-4 right-6">
            <Gift className="w-5 h-5 text-yellow-200 animate-bounce" />
          </div>
          
          {/* Main content */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2 text-shadow">
              🎉 GREAT GETIT SALE! 🎉
            </h2>
            <p className="text-lg font-semibold mb-1">
              UP TO 70% OFF
            </p>
            <p className="text-sm opacity-90">
              On Electronics, Fashion & More!
            </p>
          </div>

          {/* Timer */}
          <div className="bg-white/20 rounded-lg p-3 mb-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
            <div className="flex justify-center gap-2 text-sm">
              <div className="bg-white/30 rounded px-2 py-1">
                <div className="font-bold">23</div>
                <div>HRS</div>
              </div>
              <div className="bg-white/30 rounded px-2 py-1">
                <div className="font-bold">45</div>
                <div>MIN</div>
              </div>
              <div className="bg-white/30 rounded px-2 py-1">
                <div className="font-bold">12</div>
                <div>SEC</div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-yellow-400 text-black font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
          >
            SHOP NOW & SAVE BIG!
          </button>

          {/* Additional offer details */}
          <div className="mt-4 text-xs opacity-80">
            <p>✨ Free shipping on orders over ৳500</p>
            <p>🎁 Extra 10% off with GETIT10 code</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
