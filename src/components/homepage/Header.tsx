
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Mic, Camera, QrCode, ShoppingCart, Heart, Bell, MessageSquare, User, Globe, LogIn, UserPlus, Phone, MapPin, ChevronDown, Menu } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [language, setLanguage] = useState('EN');
  const { user, userProfile, signOut } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'বাং' : 'EN');
  };

  const trendingSearches = ['Mobile', 'Fashion', 'Electronics', 'Groceries'];
  const categories = [
    { name: 'Electronics & Gadgets', icon: '📱', path: '/categories/electronics' },
    { name: 'Fashion & Clothing', icon: '👕', path: '/categories/fashion' },
    { name: 'Home & Living', icon: '🏠', path: '/categories/home' },
    { name: 'Health & Beauty', icon: '💄', path: '/categories/beauty' },
    { name: 'Food & Groceries', icon: '🛒', path: '/categories/groceries' },
    { name: 'Books & Stationery', icon: '📚', path: '/categories/books' },
    { name: 'Sports & Outdoor', icon: '⚽', path: '/categories/sports' },
    { name: 'Handicrafts & Traditional', icon: '🎨', path: '/categories/handicrafts' },
    { name: 'Automotive', icon: '🚗', path: '/categories/automotive' },
  ];

  return (
    <>
      {/* Top Bar */}
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

      {/* Main Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 w-full py-4 px-2 sm:px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Menu and Logo */}
          <div className="flex items-center gap-1 sm:gap-2">
            <MobileMenu />
            <Link to="/" className="flex flex-col items-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-xl">G</span>
              </div>
              <div className="hidden sm:block text-center">
                <span className="text-white font-bold text-sm sm:text-xl">GETIT</span>
                <p className="text-xs text-yellow-200">Bangladesh's Trusted Marketplace</p>
                <p className="text-xs text-yellow-100">Shop Smart, Ship Fast, Pay Easy</p>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-3xl flex-col">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
              <div className="flex items-center">
                <select className="px-3 py-3 border-r border-gray-200 text-sm focus:outline-none">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Beauty</option>
                  <option>Groceries</option>
                </select>
                <input
                  type="search"
                  placeholder="Search products, brands, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm focus:outline-none"
                />
                <div className="flex items-center gap-2 px-3">
                  <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Voice Search">
                    <Mic className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Image Search">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full" title="QR Search">
                    <QrCode className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-lg hover:from-orange-500 hover:to-yellow-500 transition-all">
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
            {/* Trending Searches */}
            <div className="mt-2 flex items-center gap-2 text-xs text-white">
              <span>Trending:</span>
              {trendingSearches.map((search, index) => (
                <button 
                  key={search}
                  onClick={() => setSearchQuery(search)}
                  className="bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30 transition-all"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Search Button */}
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/wishlist" className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all group">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Wishlist
              </span>
            </Link>
            
            <Link to="/cart" className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all group">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartState.itemCount}
                </span>
              )}
              <div className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ৳{cartState.total} - {cartState.itemCount} items
              </div>
            </Link>
            
            <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all group">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden mt-3 px-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
              <div className="flex items-center">
                <select className="px-3 py-2 border-r border-gray-200 text-sm focus:outline-none">
                  <option>All</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                </select>
                <input
                  type="search"
                  placeholder="Search products, brands, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
                <button className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-lg">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="max-w-7xl mx-auto mt-4 hidden lg:block">
          <div className="flex items-center justify-between">
            {/* Main Categories */}
            <div className="flex items-center gap-6 text-white text-sm">
              {categories.slice(0, 6).map((category) => (
                <Link 
                  key={category.name}
                  to={category.path}
                  className="flex items-center gap-2 hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  <span>{category.icon}</span>
                  <span className="hidden xl:block">{category.name}</span>
                </Link>
              ))}
              
              {/* More Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                  <span>➕</span>
                  <span>More</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-white text-black rounded-lg shadow-lg p-4 min-w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="grid grid-cols-1 gap-2">
                    {categories.slice(6).map((category) => (
                      <Link 
                        key={category.name}
                        to={category.path}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Sections */}
            <div className="flex items-center gap-6 text-white text-sm">
              <Link to="/flash-sale" className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full hover:bg-red-600 transition-colors">
                <span>⚡</span>
                <span>Flash Sales</span>
              </Link>
              <Link to="/new-arrivals" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                <span>🆕</span>
                <span>New Arrivals</span>
              </Link>
              <Link to="/best-sellers" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                <span>🔥</span>
                <span>Best Sellers</span>
              </Link>
              <Link to="/local-vendors" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                <span>🇧🇩</span>
                <span>Local Vendors</span>
              </Link>
              <Link to="/international" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                <span>🌍</span>
                <span>International</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};
