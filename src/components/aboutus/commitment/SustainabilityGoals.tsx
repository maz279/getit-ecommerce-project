
import React from 'react';
import { SustainabilityGoal } from './types';

interface SustainabilityGoalsProps {
  sustainabilityGoals: SustainabilityGoal[];
}

export const SustainabilityGoals: React.FC<SustainabilityGoalsProps> = ({ sustainabilityGoals }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200 mb-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">2030 Sustainability Goals</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sustainabilityGoals.map((goal, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">{goal.goal}</h4>
              <span className="text-sm text-gray-600">Target: {goal.year}</span>
            </div>
            
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
