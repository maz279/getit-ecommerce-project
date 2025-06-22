
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star, Award, Eye, Package, Filter, Search } from 'lucide-react';

export const BestSellersNavigationMap: React.FC = () => {
  const navigationItems = [
    {
      title: '🔥 Top 100 Products',
      description: 'Most sold items',
      link: '#top-products',
      icon: '🔥',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: '📱 Electronics Best Sellers',
      description: 'Top tech products',
      link: '/categories?category=electronics&sort=best-selling',
      icon: '📱',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: '👕 Fashion Favorites',
      description: 'Trending styles',
      link: '/categories?category=fashion&sort=best-selling',
      icon: '👕',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: '🏠 Home Essentials',
      description: 'Popular home items',
      link: '/categories?category=home-garden&sort=best-selling',
      icon: '🏠',
      color: 'from-green-500 to-green-600'
    },
    {
      title: '💄 Beauty Must-Haves',
      description: 'Top beauty products',
      link: '/categories?category=health-beauty&sort=best-selling',
      icon: '💄',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: '🎮 Gaming Gear',
      description: 'Popular gaming items',
      link: '/categories?category=sports-outdoor&sort=best-selling',
      icon: '🎮',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const quickFilters = [
    {
      title: 'This Week',
      icon: <TrendingUp className="w-5 h-5" />,
      link: '#weekly-bestsellers',
      description: 'Weekly top sellers'
    },
    {
      title: 'This Month',
      icon: <Star className="w-5 h-5" />,
      link: '#monthly-bestsellers',
      description: 'Monthly favorites'
    },
    {
      title: 'All Time',
      icon: <Award className="w-5 h-5" />,
      link: '#all-time-bestsellers',
      description: 'Greatest hits'
    },
    {
      title: 'Most Viewed',
      icon: <Eye className="w-5 h-5" />,
      link: '#most-viewed',
      description: 'Popular products'
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
          <h3 className="text-xl font-bold text-center mb-6">🏆 Best Selling Categories 🏆</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {navigationItems.map((item, index) => {
              if (item.link.startsWith('#')) {
                return (
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
                );
              }
              
              return (
                <Link
                  key={index}
                  to={item.link}
                  className={`bg-gradient-to-r ${item.color} rounded-lg p-4 text-white text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs opacity-90">{item.description}</p>
                  <ArrowRight className="w-4 h-4 mx-auto mt-2" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <h3 className="text-lg font-bold text-center mb-4">⚡ Quick Filters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickFilters.map((filter, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(filter.link)}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
              >
                <div className="text-blue-600 mb-2 flex justify-center">{filter.icon}</div>
                <h4 className="font-semibold text-sm mb-1 text-gray-800">{filter.title}</h4>
                <p className="text-xs text-gray-600">{filter.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Best Sellers Specific Navigation */}
        <div className="mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">🏆 Best Sellers Hub 🏆</h3>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => handleNavigation('#top-products')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              🔥 Top Products
            </button>
            <button
              onClick={() => handleNavigation('#weekly-bestsellers')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              📈 Weekly Charts
            </button>
            <button
              onClick={() => handleNavigation('#vendor-rankings')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              🏪 Top Vendors
            </button>
            <button
              onClick={() => handleNavigation('#trending-analytics')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
