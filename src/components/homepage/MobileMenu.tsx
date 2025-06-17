
import React, { useState } from 'react';
import { Menu, X, ChevronRight, User, Heart, ShoppingCart, Bell, MessageSquare, Search, Home, Tag, Zap, Gift, TrendingUp, Star, Package, Headphones, MapPin } from 'lucide-react';

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
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          {/* Menu Content */}
          <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl overflow-y-auto">
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
              
              {/* User Section */}
              <div className="mt-4 flex items-center gap-3 text-white">
                <User className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Sign In</div>
                  <div className="text-sm opacity-80">Join for exclusive deals</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Access</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition-all"
                  >
                    <div className={`${action.color} p-2 rounded-full`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
              <div className="space-y-1">
                {menuCategories.map((category, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0">
                    <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="pl-11 pb-2">
                      {category.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          className="block w-full text-left py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {item}
                        </button>
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
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span>Wishlist</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span>Cart (3)</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span>Orders</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span>Notifications</span>
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <span>Help Center</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <Headphones className="w-5 h-5 text-gray-600" />
                  <span>Contact Us</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span>Store Locator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
