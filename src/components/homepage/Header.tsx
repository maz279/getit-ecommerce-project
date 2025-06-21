
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Mic, Camera, QrCode, ShoppingCart, Heart, Bell, MessageSquare, User, Globe, LogIn, UserPlus } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 w-full py-2 px-2 sm:px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Menu and Logo */}
          <div className="flex items-center gap-1 sm:gap-2">
            <MobileMenu />
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-xl">G</span>
              </div>
              <span className="text-white font-bold text-sm sm:text-xl ml-1 sm:ml-2 hidden xs:block">GETIT</span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="bg-white rounded-full shadow-lg overflow-hidden w-full">
              <div className="flex items-center">
                <select className="px-2 py-2 md:px-4 md:py-3 border-r border-gray-200 text-xs md:text-sm focus:outline-none">
                  <option>All</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                </select>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm focus:outline-none"
                />
                <div className="flex items-center gap-1 md:gap-2 px-1 md:px-3">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Mic className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <QrCode className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="bg-gradient-to-r from-orange-400 to-yellow-400 p-1.5 md:p-2 rounded-r-full hover:from-orange-500 hover:to-yellow-500 transition-all">
                    <Search className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search Button */}
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Right Icons - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all">
              <Heart className="w-4 h-4" />
            </button>
            <Link to="/cart" className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all">
              <ShoppingCart className="w-4 h-4" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {cartState.itemCount}
                </span>
              )}
            </Link>
            <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all hidden sm:block">
              <Bell className="w-4 h-4" />
            </button>
            <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all hidden md:block">
              <MessageSquare className="w-4 h-4" />
            </button>
            
            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-2 text-white">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm">Hello, {userProfile?.full_name}</span>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-1 cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-lg px-2 py-1 transition-all"
                  >
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/auth/login" className="flex items-center gap-1 cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-lg px-2 py-1 transition-all">
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Sign In</span>
                  </Link>
                  <Link to="/auth/register" className="flex items-center gap-1 cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-lg px-2 py-1 transition-all">
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm">Sign Up</span>
                  </Link>
                </div>
              )}
              
              {/* Language Choice */}
              <div className="flex items-center gap-2 text-xs ml-2">
                <Globe className="w-3 h-3" />
                <select className="bg-transparent border border-white border-opacity-30 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-white">
                  <option value="en" className="text-black">English</option>
                  <option value="bn" className="text-black">বাংলা</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {showMobileSearch && (
          <div className="md:hidden mt-3 px-2">
            <div className="bg-white rounded-full shadow-lg overflow-hidden w-full">
              <div className="flex items-center">
                <select className="px-3 py-2 border-r border-gray-200 text-sm focus:outline-none">
                  <option>All</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                </select>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
                <div className="flex items-center gap-1 px-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded-full">
                    <Mic className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full">
                    <QrCode className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-full hover:from-orange-500 hover:to-yellow-500 transition-all ml-1">
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation - Hidden on small screens */}
        <nav className="max-w-7xl mx-auto items-center justify-between mt-2 hidden md:flex">
          <div className="flex items-center gap-3 lg:gap-6 text-white text-sm">
            <Link to="/categories" className="bg-yellow-400 text-black font-semibold px-3 py-1 lg:px-4 lg:py-1 rounded-full hover:bg-yellow-300 transition-all cursor-pointer">
              Categories
            </Link>
            <Link to="/flash-sale" className="hover:text-yellow-300 cursor-pointer transition-all">Flash Sale</Link>
            <Link to="/ai-recommendations" className="hover:text-yellow-300 cursor-pointer transition-all hidden lg:block">AI Recommendations</Link>
            <Link to="/deals" className="hover:text-yellow-300 cursor-pointer transition-all">Deals</Link>
            <Link to="/new-arrivals" className="hover:text-yellow-300 cursor-pointer transition-all hidden lg:block">New Arrivals</Link>
          </div>
          <div className="flex items-center gap-2 text-white text-xs">
            <span className="w-4 h-4 bg-white rounded"></span>
            <span>EN</span>
            <span>|</span>
            <span className="w-4 h-4 bg-white rounded"></span>
            <span>BDT</span>
          </div>
        </nav>
      </header>
    </>
  );
};
