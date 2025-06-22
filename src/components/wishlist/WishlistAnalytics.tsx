
import React from 'react';
import { TrendingUp, TrendingDown, Clock, DollarSign, Package, Heart } from 'lucide-react';

export const WishlistAnalytics: React.FC = () => {
  const analytics = [
    {
      title: 'Total Savings',
      value: '৳15,500',
      change: '+৳2,300',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Items Added',
      value: '23',
      change: '+5 this week',
      trend: 'up',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Price Drops',
      value: '8',
      change: '2 new alerts',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'In Stock',
      value: '19/23',
      change: '4 out of stock',
      trend: 'neutral',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {analytics.map((item, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            {item.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : item.trend === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <Clock className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.value}</h3>
          <p className="text-sm text-gray-600 mb-1">{item.title}</p>
          <p className="text-xs text-gray-500">{item.change}</p>
        </div>
      ))}
    </div>
  );
};
