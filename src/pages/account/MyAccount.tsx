
import React from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { useSEO } from '@/hooks/useSEO';

const MyAccount: React.FC = () => {
  useSEO({
    title: 'My Account - GetIt Bangladesh | User Profile',
    description: 'Manage your GetIt Bangladesh account, view profile information, and update your preferences.',
    keywords: 'my account, user profile, account settings, bangladesh account'
  });

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-4">👤 My Account 👤</h1>
            <p className="text-lg text-gray-600">Manage your profile and account settings</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">📋 Account Dashboard 📋</h2>
            <p className="mb-6">View and manage your account information, orders, and preferences.</p>
            <div className="text-6xl mb-4">⚙️</div>
            <p className="text-lg">Complete account management coming soon!</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyAccount;
