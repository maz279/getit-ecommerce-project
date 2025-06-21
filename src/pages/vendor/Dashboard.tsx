
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const VendorDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Vendor Dashboard - Welcome {userProfile?.full_name}
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">Vendor dashboard coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
