
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ShoppingBag, TrendingDown, Clock } from 'lucide-react';

export const GroupBuyStatsSection: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-teal-600" />,
      number: "500K+",
      label: "Group Members",
      subtitle: "Active participants"
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-blue-600" />,
      number: "1,200+",
      label: "Successful Groups",
      subtitle: "Completed this month"
    },
    {
      icon: <TrendingDown className="w-8 h-8 text-green-600" />,
      number: "65%",
      label: "Average Savings",
      subtitle: "Compared to retail"
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      number: "48hrs",
      label: "Average Group Time",
      subtitle: "To reach target"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-gray-800 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.subtitle}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
