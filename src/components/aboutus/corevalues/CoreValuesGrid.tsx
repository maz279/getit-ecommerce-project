
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { CoreValue } from './types';

interface CoreValuesGridProps {
  coreValues: CoreValue[];
  hoveredValue: number | null;
  setHoveredValue: (index: number | null) => void;
}

export const CoreValuesGrid: React.FC<CoreValuesGridProps> = ({ 
  coreValues, 
  hoveredValue, 
  setHoveredValue 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {coreValues.map((value, index) => (
        <div 
          key={index}
          className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden"
          onMouseEnter={() => setHoveredValue(index)}
          onMouseLeave={() => setHoveredValue(null)}
        >
          {/* Background Pattern */}
          <div className="absolute top-4 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            {value.bgPattern}
          </div>
          
          {/* Gradient Background on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          <div className="relative z-10">
            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${value.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <value.icon className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900">{value.title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{value.description}</p>
            
            <div className="space-y-3">
              {value.principles.map((principle, principleIndex) => (
                <div key={principleIndex} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{principle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hover Effect Border */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
      ))}
    </div>
  );
};
