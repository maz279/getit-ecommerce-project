
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TopBarProps {
  language: string;
  toggleLanguage: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ language, toggleLanguage }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const content = {
    EN: {
      hotline: "Hotline: 16263 (24/7 Customer Support)",
      location: "Dhaka, Bangladesh",
      becomeVendor: "Become a Vendor",
      trackOrder: "Track Order",
      helpCenter: "Help Center",
      myAccount: "My Account",
      logout: "Logout",
      login: "Login",
      register: "Register"
    },
    BD: {
      hotline: "হটলাইন: ১৬২৬৩ (২৪/৭ গ্রাহক সেবা)",
      location: "ঢাকা, বাংলাদেশ",
      becomeVendor: "বিক্রেতা হন",
      trackOrder: "অর্ডার ট্র্যাক করুন",
      helpCenter: "সহায়তা কেন্দ্র",
      myAccount: "আমার অ্যাকাউন্ট",
      logout: "লগআউট",
      login: "লগইন",
      register: "নিবন্ধন"
    }
  };

  const currentContent = content[language as keyof typeof content];

  return (
    <div className="bg-gray-800 text-white py-2 px-4 text-xs hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>{currentContent.hotline}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>{currentContent.location}</span>
          </div>
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'EN' ? 'English | বাংলা' : 'ইংরেজি | বাংলা'}</span>
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 text-xs">
          <Link to="/vendor/register" className="hover:text-yellow-300 transition-colors">
            {currentContent.becomeVendor}
          </Link>
          <span>|</span>
          <Link to="/track-order" className="hover:text-yellow-300 transition-colors">
            {currentContent.trackOrder}
          </Link>
          <span>|</span>
          <Link to="/help" className="hover:text-yellow-300 transition-colors">
            {currentContent.helpCenter}
          </Link>
          <span>|</span>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/account" className="hover:text-yellow-300 transition-colors">
                {currentContent.myAccount}
              </Link>
              <button 
                onClick={handleSignOut}
                className="hover:text-yellow-300 transition-colors"
              >
                {currentContent.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth/login" className="hover:text-yellow-300 transition-colors">
                {currentContent.login}
              </Link>
              <span>/</span>
              <Link to="/auth/register" className="hover:text-yellow-300 transition-colors">
                {currentContent.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
