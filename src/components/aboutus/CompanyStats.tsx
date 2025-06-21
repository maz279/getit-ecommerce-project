
import React from 'react';

export const CompanyStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div className="text-center bg-blue-50 p-6 rounded-lg">
        <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
        <p className="text-gray-600">Registered Vendors</p>
      </div>
      <div className="text-center bg-green-50 p-6 rounded-lg">
        <div className="text-3xl font-bold text-green-600 mb-2">5M+</div>
        <p className="text-gray-600">Products Listed</p>
      </div>
      <div className="text-center bg-purple-50 p-6 rounded-lg">
        <div className="text-3xl font-bold text-purple-600 mb-2">100K+</div>
        <p className="text-gray-600">Daily Orders</p>
      </div>
      <div className="text-center bg-orange-50 p-6 rounded-lg">
        <div className="text-3xl font-bold text-orange-600 mb-2">64</div>
        <p className="text-gray-600">Districts Covered</p>
      </div>
    </div>
  );
};
