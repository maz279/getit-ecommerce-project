
import React from 'react';
import { CheckCircle, Award } from 'lucide-react';
import { CommitmentItem } from './types';

interface CommitmentAreasProps {
  commitments: CommitmentItem[];
  activeCommitment: number;
  setActiveCommitment: (index: number) => void;
}

export const CommitmentAreas: React.FC<CommitmentAreasProps> = ({
  commitments,
  activeCommitment,
  setActiveCommitment
}) => {
  const ActiveIcon = commitments[activeCommitment].icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {commitments.map((commitment, index) => (
          <button
            key={index}
            onClick={() => setActiveCommitment(index)}
            className={`p-6 text-left transition-all duration-300 ${
              activeCommitment === index 
                ? 'bg-blue-50 border-r-2 border-blue-600' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${commitment.color} mb-4`}>
              <commitment.icon className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-gray-800 mb-2">{commitment.title}</div>
            <div className="text-sm text-gray-600">{commitment.description}</div>
          </button>
        ))}
      </div>

      <div className="p-8">
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {commitments[activeCommitment].title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {commitments[activeCommitment].details}
              </p>
              
              <div className="space-y-3 mb-6">
                {commitments[activeCommitment].initiatives.map((initiative, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{initiative}</span>
                  </div>
                ))}
              </div>

              <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${commitments[activeCommitment].color} rounded-lg px-6 py-3 text-white`}>
                <Award className="w-5 h-5" />
                <span className="font-semibold">{commitments[activeCommitment].stats.value}</span>
                <span>{commitments[activeCommitment].stats.label}</span>
              </div>
            </div>

            <div className="relative">
              <div className={`w-full h-64 bg-gradient-to-br ${commitments[activeCommitment].color} rounded-xl flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <ActiveIcon className="w-24 h-24 text-white relative z-10" />
                
                <div className="absolute top-6 left-6 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
                <div className="absolute top-16 right-8 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100"></div>
                <div className="absolute bottom-8 left-16 w-4 h-4 bg-white/20 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
