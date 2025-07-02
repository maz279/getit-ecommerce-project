
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, User, Heart, ShoppingCart, Bell, MessageSquare, Search, Home, Tag, Zap, Gift, TrendingUp, Star, Package, Headphones, MapPin, LogIn, UserPlus, Globe } from 'lucide-react';

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuCategories = [
    { name: 'Electronics', icon: Package, items: ['Smartphones', 'Laptops', 'Headphones', 'Cameras'] },
    { name: 'Fashion', icon: Tag, items: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories'] },
    { name: 'Home & Garden', icon: Home, items: ['Furniture', 'Kitchen', 'Decor', 'Garden'] },
    { name: 'Sports', icon: TrendingUp, items: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports'] },
    { name: 'Beauty', icon: Star, items: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances'] },
  ];

  const quickActions = [
    { name: 'Flash Sale', icon: Zap, color: 'bg-red-500' },
    { name: 'Daily Deals', icon: Gift, color: 'bg-orange-500' },
    { name: 'New Arrivals', icon: Package, color: 'bg-blue-500' },
    { name: 'Top Rated', icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          {/* Menu Content */}
          <div className="fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <span className="text-white font-bold text-lg">GETIT</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Bar for Mobile */}
            <div className="p-4 border-b">
              <div className="bg-gray-100 rounded-full overflow-hidden">
                <div className="flex items-center">
                  <select className="px-3 py-2 border-r border-gray-200 text-sm focus:outline-none bg-transparent">
                    <option>All</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Home</option>
                  </select>
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent"
                  />
                  <button className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-full">
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sign In/Sign Up Section */}
            <div className="p-4 border-b">
              <div className="grid grid-cols-2 gap-3">
                <Link to="/auth/login" className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all">
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
                <Link to="/auth/register" className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-all">
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Up</span>
                </Link>
              </div>
              
              {/* Language Choice */}
              <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
                <Globe className="w-4 h-4 text-gray-600" />
                <select className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Access</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.name === 'Flash Sale' ? '/flash-sale' : 
                        action.name === 'Daily Deals' ? '/daily-deals' :
                        action.name === 'New Arrivals' ? '/new-arrivals' :
                        action.name === 'Top Rated' ? '/best-sellers' : '/'}
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition-all"
                  >
                    <div className={`${action.color} p-2 rounded-full`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
              <div className="space-y-1">
                {menuCategories.map((category, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0">
                    <Link to="/categories" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <div className="pl-11 pb-2">
                      {category.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to="/categories"
                          className="block w-full text-left py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Actions */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">Account</h3>
              <div className="space-y-2">
                <Link to="/wishlist" className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span>Wishlist</span>
                </Link>
                <Link to="/cart" className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span>Cart (3)</span>
                </Link>
                <Link to="/orders" className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span>Orders</span>
                </Link>
                <Link to="/notifications" className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span>Notifications</span>
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
              <div className="space-y-2">
                <Link to="/help" className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <span>Help Center</span>
                </Link>
                <Link to="/contact" className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <Headphones className="w-5 h-5 text-gray-600" />
                  <span>Contact Us</span>
                </Link>
                <Link to="/store-locator" className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span>Store Locator</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
