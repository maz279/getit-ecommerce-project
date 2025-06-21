
import React from 'react';
import { TrendingUp, Users, Package, MapPin, Award, Clock } from 'lucide-react';

export const CompanyStats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Registered Vendors",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      growth: "+125%"
    },
    {
      icon: Package,
      value: "5M+",
      label: "Products Listed",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      growth: "+200%"
    },
    {
      icon: TrendingUp,
      value: "100K+",
      label: "Daily Orders",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      growth: "+180%"
    },
    {
      icon: MapPin,
      value: "64",
      label: "Districts Covered",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      growth: "100%"
    },
    {
      icon: Award,
      value: "99.9%",
      label: "Customer Satisfaction",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      growth: "+5%"
    },
    {
      icon: Clock,
      value: "2.1s",
      label: "Average Load Time",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      growth: "-40%"
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Impact in Numbers</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how GetIt is transforming Bangladesh's e-commerce landscape with real-time performance metrics.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} p-8 rounded-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-gray-100 group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Growth</div>
                <div className="text-sm font-semibold text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.growth}
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className={`text-4xl font-bold ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
            </div>
            
            <p className="text-gray-700 font-medium">{stat.label}</p>
            
            {/* Progress bar animation */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left`}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional visual elements */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-6 py-3 border border-blue-200">
          <Award className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Real-time data updated every hour</span>
        </div>
      </div>
    </div>
  );
};
