
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Calendar, 
  Gift, 
  Percent, 
  Users, 
  Award,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  CreditCard
} from 'lucide-react';

export const QuickAccessIcons: React.FC = () => {
  const quickAccessItems = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Flash Sales',
      color: 'text-red-500 hover:text-red-600',
      link: '/flash-sale'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Daily Deals',
      color: 'text-green-500 hover:text-green-600',
      link: '/daily-deals'
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Gift Cards',
      color: 'text-purple-500 hover:text-purple-600',
      link: '/gift-cards'
    },
    {
      icon: <Percent className="w-8 h-8" />,
      title: 'Mega Sale',
      color: 'text-blue-500 hover:text-blue-600',
      link: '/mega-sale'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Group Buy',
      color: 'text-teal-500 hover:text-teal-600',
      link: '/group-buy'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Premium',
      color: 'text-yellow-500 hover:text-yellow-600',
      link: '/premium'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Best Sellers',
      color: 'text-emerald-500 hover:text-emerald-600',
      link: '/best-sellers'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Wishlist',
      color: 'text-pink-500 hover:text-pink-600',
      link: '/wishlist'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'New Arrivals',
      color: 'text-violet-500 hover:text-violet-600',
      link: '/new-arrivals'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Free Delivery',
      color: 'text-orange-500 hover:text-orange-600',
      link: '/free-delivery'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Easy Payment',
      color: 'text-slate-500 hover:text-slate-600',
      link: '/payment-methods'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Bulk Orders',
      color: 'text-indigo-500 hover:text-indigo-600',
      link: '/bulk-orders'
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-6">
          {quickAccessItems.map((item, index) => (
            <Link 
              key={index}
              to={item.link}
              className="flex flex-col items-center group"
            >
              <div className={`${item.color} transition-all duration-300 transform group-hover:scale-110 mb-3`}>
                {item.icon}
              </div>
              <h3 className="text-xs font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
