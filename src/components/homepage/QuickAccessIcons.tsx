
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Calendar, 
  Gift, 
  Percent, 
  Users, 
  Award,
  ArrowRight
} from 'lucide-react';

export const QuickAccessIcons: React.FC = () => {
  const quickAccessItems = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Flash Sales',
      subtitle: 'Up to 80% OFF',
      gradient: 'from-red-500 to-orange-500',
      link: '/flash-sale'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Daily Deals',
      subtitle: 'New Every Day',
      gradient: 'from-green-500 to-teal-500',
      link: '/daily-deals'
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Gift Cards',
      subtitle: 'Perfect Gifts',
      gradient: 'from-purple-500 to-pink-500',
      link: '/products'
    },
    {
      icon: <Percent className="w-8 h-8" />,
      title: 'Mega Sale',
      subtitle: 'Biggest Discounts',
      gradient: 'from-blue-500 to-indigo-500',
      link: '/products'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Group Buy',
      subtitle: 'Buy Together Save',
      gradient: 'from-teal-500 to-cyan-500',
      link: '/products'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Premium',
      subtitle: 'Exclusive Deals',
      gradient: 'from-yellow-500 to-orange-500',
      link: '/products'
    }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickAccessItems.map((item, index) => (
            <Link 
              key={index}
              to={item.link}
              className={`bg-gradient-to-br ${item.gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs opacity-90 mb-3">{item.subtitle}</p>
                <ArrowRight className="w-4 h-4 mx-auto opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
