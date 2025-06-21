
import React from 'react';

export const Leadership: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Leadership Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center bg-gray-50 p-6 rounded-lg">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="font-semibold text-gray-800 mb-1">Ahmed Rahman</h3>
          <p className="text-gray-600 text-sm mb-2">CEO & Co-Founder</p>
          <p className="text-xs text-gray-500">15+ years in e-commerce and technology</p>
        </div>
        
        <div className="text-center bg-gray-50 p-6 rounded-lg">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="font-semibold text-gray-800 mb-1">Fatima Khan</h3>
          <p className="text-gray-600 text-sm mb-2">CTO & Co-Founder</p>
          <p className="text-xs text-gray-500">Expert in scalable technology solutions</p>
        </div>
        
        <div className="text-center bg-gray-50 p-6 rounded-lg">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="font-semibold text-gray-800 mb-1">Karim Hassan</h3>
          <p className="text-gray-600 text-sm mb-2">COO</p>
          <p className="text-xs text-gray-500">Operations and logistics specialist</p>
        </div>
      </div>
    </div>
  );
};
