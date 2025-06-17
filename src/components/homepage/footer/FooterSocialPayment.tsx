
import React from 'react';

export const FooterSocialPayment: React.FC = () => {
  return (
    <div className="border-t border-gray-700 mt-8 pt-8">
      <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
        
        {/* Social Media */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold">Follow Us:</span>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="text-sm font-bold">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                <span className="text-sm font-bold">IG</span>
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <span className="text-sm font-bold">T</span>
              </a>
              <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors">
                <span className="text-sm font-bold">Li</span>
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <span className="text-sm font-bold">YT</span>
              </a>
              <a href="#" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <span className="text-sm font-bold">WA</span>
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold">We Accept:</span>
            <div className="flex space-x-2">
              <div className="w-10 h-7 bg-blue-600 rounded text-xs flex items-center justify-center font-bold">VISA</div>
              <div className="w-10 h-7 bg-red-600 rounded text-xs flex items-center justify-center font-bold">MC</div>
              <div className="w-10 h-7 bg-blue-500 rounded text-xs flex items-center justify-center font-bold">AMEX</div>
              <div className="w-10 h-7 bg-indigo-600 rounded text-xs flex items-center justify-center font-bold">PP</div>
              <div className="w-10 h-7 bg-green-600 rounded text-xs flex items-center justify-center font-bold">GPay</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
