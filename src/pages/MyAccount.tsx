
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, ShoppingBag, Heart, MapPin, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MyAccount: React.FC = () => {
  const { userProfile, signOut } = useAuth();

  const menuItems = [
    { icon: User, title: 'Profile Information', description: 'Manage your personal details', path: '/account/profile' },
    { icon: ShoppingBag, title: 'My Orders', description: 'Track and manage your orders', path: '/account/orders' },
    { icon: Heart, title: 'Wishlist', description: 'Your saved products', path: '/wishlist' },
    { icon: MapPin, title: 'Address Book', description: 'Manage delivery addresses', path: '/account/addresses' },
    { icon: CreditCard, title: 'Payment Methods', description: 'Manage payment options', path: '/account/payments' },
    { icon: Settings, title: 'Account Settings', description: 'Privacy and security settings', path: '/account/settings' },
    { icon: HelpCircle, title: 'Help & Support', description: 'Get help and contact support', path: '/help' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{userProfile?.full_name || 'Guest User'}</h2>
                <p className="text-gray-600">{userProfile?.email}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                  {userProfile?.is_verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">12</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">5</div>
                    <div className="text-sm text-gray-600">Wishlist</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/track-order"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Track Order
                </Link>
                <Link
                  to="/products"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Shop Now
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
