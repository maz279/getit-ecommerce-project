
import React from 'react';
import { ValueStat } from './types';

interface ValueStatsProps {
  valueStats: ValueStat[];
}

export const ValueStats: React.FC<ValueStatsProps> = ({ valueStats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {valueStats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
          <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
