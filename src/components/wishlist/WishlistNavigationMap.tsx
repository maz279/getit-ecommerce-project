
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, Share2, ShoppingCart, Filter, Trash2 } from 'lucide-react';

export const WishlistNavigationMap: React.FC = () => {
  const navigationItems = [
    {
      title: '❤️ All Wishlist Items',
      description: 'View all saved items',
      link: '#all-items',
      icon: '❤️',
      color: 'from-pink-500 to-red-500'
    },
    {
      title: '📱 Electronics',
      description: 'Saved electronics',
      link: '#electronics-wishlist',
      icon: '📱',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: '👕 Fashion',
      description: 'Saved fashion items',
      link: '#fashion-wishlist',
      icon: '👕',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: '🏠 Home & Garden',
      description: 'Saved home items',
      link: '#home-wishlist',
      icon: '🏠',
      color: 'from-green-500 to-green-600'
    },
    {
      title: '💄 Beauty',
      description: 'Saved beauty products',
      link: '#beauty-wishlist',
      icon: '💄',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: '🎁 Gifts',
      description: 'Gift ideas saved',
      link: '#gifts-wishlist',
      icon: '🎁',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const wishlistActions = [
    {
      title: 'Price Alerts',
      icon: <Star className="w-5 h-5" />,
      link: '#price-alerts',
      description: 'Set price notifications'
    },
    {
      title: 'Share Wishlist',
      icon: <Share2 className="w-5 h-5" />,
      link: '#share-wishlist',
      description: 'Share with friends'
    },
    {
      title: 'Move to Cart',
      icon: <ShoppingCart className="w-5 h-5" />,
      link: '#move-to-cart',
      description: 'Add to cart'
    },
    {
      title: 'Manage Lists',
      icon: <Filter className="w-5 h-5" />,
      link: '#manage-lists',
      description: 'Organize wishlists'
    }
  ];

  const handleNavigation = (link: string) => {
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Categories Navigation */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center mb-6">💖 Wishlist Categories 💖</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.link)}
                className={`bg-gradient-to-r ${item.color} rounded-lg p-4 text-white text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs opacity-90">{item.description}</p>
                <ArrowRight className="w-4 h-4 mx-auto mt-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Wishlist Actions */}
        <div>
          <h3 className="text-lg font-bold text-center mb-4">⚡ Wishlist Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wishlistActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.link)}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
              >
                <div className="text-blue-600 mb-2 flex justify-center">{action.icon}</div>
                <h4 className="font-semibold text-sm mb-1 text-gray-800">{action.title}</h4>
                <p className="text-xs text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Wishlist Specific Navigation */}
        <div className="mt-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">💖 Wishlist Management 💖</h3>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => handleNavigation('#all-items')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              ❤️ All Items
            </button>
            <button
              onClick={() => handleNavigation('#price-alerts')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              🔔 Price Alerts
            </button>
            <button
              onClick={() => handleNavigation('#share-wishlist')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              📤 Share Lists
            </button>
            <button
              onClick={() => handleNavigation('#recently-viewed')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              👁️ Recently Viewed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
