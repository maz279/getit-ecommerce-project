
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';

const VendorDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Vendor Dashboard - Welcome {userProfile?.full_name}
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">Vendor dashboard coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorDashboard;
