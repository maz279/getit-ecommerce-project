
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Package, Heart, LogOut, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

interface UserProfileDropdownProps {
  language: string;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();

  const content = {
    EN: {
      myAccount: "My Account",
      myOrders: "My Orders", 
      wishlist: "Wishlist",
      settings: "Settings",
      logout: "Logout",
      profile: "Profile"
    },
    BD: {
      myAccount: "আমার অ্যাকাউন্ট",
      myOrders: "আমার অর্ডার",
      wishlist: "পছন্দের তালিকা", 
      settings: "সেটিংস",
      logout: "লগআউট",
      profile: "প্রোফাইল"
    }
  };

  const currentContent = content[language as keyof typeof content];

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={userProfile?.avatar_url || undefined} />
          <AvatarFallback className="bg-white/20 text-white text-sm">
            {userProfile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="w-4 h-4 text-white" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-3 border-b">
              <p className="font-medium text-gray-900">{userProfile?.full_name || 'User'}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            
            <div className="py-2">
              <Link
                to="/account"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                {currentContent.myAccount}
              </Link>
              
              <Link
                to="/orders"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <Package className="w-4 h-4" />
                {currentContent.myOrders}
              </Link>
              
              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="w-4 h-4" />
                {currentContent.wishlist}
              </Link>
              
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                {currentContent.settings}
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                {currentContent.logout}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
