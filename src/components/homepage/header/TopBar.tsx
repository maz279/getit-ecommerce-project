
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

  return (
    <div className="bg-gray-800 text-white py-2 px-4 text-xs hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>Hotline: 16263 (24/7 Customer Support)</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>Dhaka, Bangladesh</span>
          </div>
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
          >
            <Globe className="w-3 h-3" />
            <span>{language} | {language === 'EN' ? 'বাং' : 'EN'}</span>
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 text-xs">
          <Link to="/vendor/register" className="hover:text-yellow-300 transition-colors">
            Become a Vendor
          </Link>
          <span>|</span>
          <Link to="/track-order" className="hover:text-yellow-300 transition-colors">
            Track Order
          </Link>
          <span>|</span>
          <Link to="/help" className="hover:text-yellow-300 transition-colors">
            Help Center
          </Link>
          <span>|</span>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/account" className="hover:text-yellow-300 transition-colors">
                My Account
              </Link>
              <button 
                onClick={handleSignOut}
                className="hover:text-yellow-300 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth/login" className="hover:text-yellow-300 transition-colors">
                Login
              </Link>
              <span>/</span>
              <Link to="/auth/register" className="hover:text-yellow-300 transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
