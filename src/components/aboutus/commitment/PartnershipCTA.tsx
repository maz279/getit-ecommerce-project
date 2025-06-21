
import React from 'react';
import { HandHeart } from 'lucide-react';

export const PartnershipCTA: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
      <HandHeart className="w-16 h-16 mx-auto mb-6 text-white" />
      <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
      <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
        Together, we can create a more inclusive, sustainable, and prosperous digital economy for Bangladesh. 
        Partner with us to make a positive impact.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
          Partner With Us
        </button>
        <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105">
          Learn More
        </button>
      </div>
    </div>
  );
};
