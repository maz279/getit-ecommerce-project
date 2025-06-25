
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const QuickStatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '৳24.5M',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
      textColor: 'text-blue-600',
      valueColor: 'text-blue-900'
    },
    {
      title: 'Total Orders',
      value: '18,976',
      change: '+8%',
      trend: 'up',
      icon: ShoppingCart,
      gradient: 'from-green-50 to-green-100',
      border: 'border-green-200',
      textColor: 'text-green-600',
      valueColor: 'text-green-900'
    },
    {
      title: 'Active Users',
      value: '42,345',
      change: '+15%',
      trend: 'up',
      icon: Users,
      gradient: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
      textColor: 'text-purple-600',
      valueColor: 'text-purple-900'
    },
    {
      title: 'Total Products',
      value: '156,789',
      change: '+5%',
      trend: 'up',
      icon: Package,
      gradient: 'from-orange-50 to-orange-100',
      border: 'border-orange-200',
      textColor: 'text-orange-600',
      valueColor: 'text-orange-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
        
        return (
          <Card key={index} className={`bg-gradient-to-r ${stat.gradient} ${stat.border}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${stat.textColor} text-sm font-medium`}>{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                  <p className={`text-sm ${stat.textColor} flex items-center`}>
                    <TrendIcon className="w-4 h-4 mr-1" />
                    {stat.change} from last month
                  </p>
                </div>
                <IconComponent className={`w-12 h-12 ${stat.textColor.replace('text-', 'text-').replace('-600', '-500')}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
