
import React from 'react';
import { Heart, Users, Award, Globe } from 'lucide-react';

export const ValuesInAction: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
      <Heart className="w-16 h-16 mx-auto mb-6 text-white" />
      <h3 className="text-3xl font-bold mb-4">Values in Action</h3>
      <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
        Our values aren't just words on a page - they guide our daily actions, decisions, and interactions. 
        They are the foundation of our culture and the driving force behind our success.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <Users className="w-8 h-8 mx-auto mb-3" />
          <div className="text-xl font-bold mb-2">Employee Satisfaction</div>
          <div className="text-3xl font-bold text-yellow-300">95%</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <Award className="w-8 h-8 mx-auto mb-3" />
          <div className="text-xl font-bold mb-2">Ethics Rating</div>
          <div className="text-3xl font-bold text-green-300">A+</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <Globe className="w-8 h-8 mx-auto mb-3" />
          <div className="text-xl font-bold mb-2">Community Impact</div>
          <div className="text-3xl font-bold text-blue-300">High</div>
        </div>
      </div>
    </div>
  );
};
