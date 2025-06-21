
import React from 'react';
import { SocialImpact } from './types';

interface SocialImpactStatsProps {
  socialImpacts: SocialImpact[];
}

export const SocialImpactStats: React.FC<SocialImpactStatsProps> = ({ socialImpacts }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {socialImpacts.map((impact, index) => (
        <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <impact.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
          <div className="text-2xl font-bold text-gray-800 mb-1">{impact.value}</div>
          <div className="text-sm text-gray-600">{impact.label}</div>
        </div>
      ))}
    </div>
  );
};
