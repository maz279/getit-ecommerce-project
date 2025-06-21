
import React from 'react';
import { CulturalPrinciple } from './types';

interface CulturalPrinciplesProps {
  culturalPrinciples: CulturalPrinciple[];
}

export const CulturalPrinciples: React.FC<CulturalPrinciplesProps> = ({ culturalPrinciples }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 mb-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Cultural Principles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {culturalPrinciples.map((principle, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <principle.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">{principle.title}</h4>
                <p className="text-gray-600 text-sm">{principle.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
