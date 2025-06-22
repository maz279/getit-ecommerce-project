
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Calendar, 
  Gift, 
  Percent, 
  Users, 
  Award,
  ArrowRight,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  CreditCard
} from 'lucide-react';

export const QuickAccessIcons: React.FC = () => {
  const quickAccessItems = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Flash Sales',
      subtitle: 'Up to 80% OFF',
      gradient: 'from-red-500 to-orange-500',
      link: '/flash-sale'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: 'Daily Deals',
      subtitle: 'New Every Day',
      gradient: 'from-green-500 to-teal-500',
      link: '/daily-deals'
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: 'Gift Cards',
      subtitle: 'Perfect Gifts',
      gradient: 'from-purple-500 to-pink-500',
      link: '/gift-cards'
    },
    {
      icon: <Percent className="w-5 h-5" />,
      title: 'Mega Sale',
      subtitle: 'Biggest Discounts',
      gradient: 'from-blue-500 to-indigo-500',
      link: '/mega-sale'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Group Buy',
      subtitle: 'Buy Together Save',
      gradient: 'from-teal-500 to-cyan-500',
      link: '/group-buy'
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Premium',
      subtitle: 'Exclusive Deals',
      gradient: 'from-yellow-500 to-orange-500',
      link: '/premium'
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      title: 'Best Sellers',
      subtitle: 'Top Rated',
      gradient: 'from-emerald-500 to-green-500',
      link: '/best-sellers'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Wishlist',
      subtitle: 'Save Favorites',
      gradient: 'from-rose-500 to-pink-500',
      link: '/wishlist'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'New Arrivals',
      subtitle: 'Latest Products',
      gradient: 'from-violet-500 to-purple-500',
      link: '/new-arrivals'
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: 'Free Delivery',
      subtitle: 'No Shipping Cost',
      gradient: 'from-amber-500 to-yellow-500',
      link: '/free-delivery'
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Easy Payment',
      subtitle: 'Multiple Options',
      gradient: 'from-slate-500 to-gray-500',
      link: '/payment-methods'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Bulk Orders',
      subtitle: 'Wholesale Prices',
      gradient: 'from-indigo-500 to-blue-500',
      link: '/bulk-orders'
    }
  ];

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
          {quickAccessItems.map((item, index) => (
            <Link 
              key={index}
              to={item.link}
              className={`bg-gradient-to-br ${item.gradient} rounded-lg p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xs mb-1">{item.title}</h3>
                <p className="text-xs opacity-90 mb-2">{item.subtitle}</p>
                <ArrowRight className="w-3 h-3 mx-auto opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
