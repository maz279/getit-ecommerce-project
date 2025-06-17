
import React, { useState } from 'react';
import { Search, Mic, Camera, QrCode, ShoppingCart, Heart, Bell, MessageSquare, User, Globe, LogIn, UserPlus } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 w-full py-2 px-2 sm:px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Menu and Logo */}
          <div className="flex items-center gap-1 sm:gap-2">
            <MobileMenu />
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-xl">G</span>
              </div>
              <span className="text-white font-bold text-sm sm:text-xl ml-1 sm:ml-2 hidden xs:block">GETIT</span>
            </div>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden sm:flex flex-1 max-w-2xl">
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
                  <button className="p-1 hover:bg-gray-100 rounded hidden md:block">
                    <Mic className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded hidden md:block">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded hidden lg:block">
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
          <button className="sm:hidden p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all">
            <Search className="w-4 h-4" />
          </button>

          {/* Right Icons - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all">
              <Heart className="w-4 h-4" />
            </button>
            <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all">
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
            </button>
            <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all hidden sm:block">
              <Bell className="w-4 h-4" />
            </button>
            <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all hidden md:block">
              <MessageSquare className="w-4 h-4" />
            </button>
            
            {/* Sign In/Sign Up Section - Side by side */}
            <div className="hidden lg:flex items-center gap-2 text-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-lg px-2 py-1 transition-all">
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Sign In</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-lg px-2 py-1 transition-all">
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm">Sign Up</span>
                </div>
              </div>
              
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

        {/* Navigation - Hidden on small screens */}
        <nav className="max-w-7xl mx-auto items-center justify-between mt-2 hidden md:flex">
          <div className="flex items-center gap-3 lg:gap-6 text-white text-sm">
            <div className="bg-yellow-400 text-black font-semibold px-3 py-1 lg:px-4 lg:py-1 rounded-full hover:bg-yellow-300 transition-all cursor-pointer">
              Categories
            </div>
            <span className="hover:text-yellow-300 cursor-pointer transition-all">Flash Sale</span>
            <span className="hover:text-yellow-300 cursor-pointer transition-all hidden lg:block">AI Recommendations</span>
            <span className="hover:text-yellow-300 cursor-pointer transition-all">Deals</span>
            <span className="hover:text-yellow-300 cursor-pointer transition-all hidden lg:block">New Arrivals</span>
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
