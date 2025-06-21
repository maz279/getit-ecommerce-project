
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, Trophy, Zap, Shield } from 'lucide-react';

export const MarketPosition: React.FC = () => {
  const marketShareData = [
    { name: 'GetIt', value: 25, color: '#3B82F6' },
    { name: 'Competitor A', value: 20, color: '#EF4444' },
    { name: 'Competitor B', value: 18, color: '#F59E0B' },
    { name: 'Competitor C', value: 15, color: '#10B981' },
    { name: 'Others', value: 22, color: '#6B7280' }
  ];

  const growthData = [
    { year: '2021', users: 10000, vendors: 500 },
    { year: '2022', users: 25000, vendors: 1200 },
    { year: '2023', users: 50000, vendors: 2800 },
    { year: '2024', users: 120000, vendors: 5000 }
  ];

  const advantages = [
    {
      icon: Zap,
      title: "Technology Excellence",
      description: "99.9% uptime with sub-2-second load times",
      metrics: "500+ TPS capacity",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Target,
      title: "Local Market Expertise",
      description: "Built specifically for Bangladesh market",
      metrics: "64 districts covered",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: Trophy,
      title: "Vendor-Centric Approach",
      description: "Commission-based model aligned with success",
      metrics: "95% vendor satisfaction",
      color: "from-green-400 to-teal-500"
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "PCI DSS compliant with fraud detection",
      metrics: "99.9% secure transactions",
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Market Leadership & Growth</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Leading Bangladesh's e-commerce transformation with innovative technology and customer-centric approach.
        </p>
      </div>

      {/* Market Share Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Market Share Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketShareData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {marketShareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Growth Trajectory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#3B82F6" name="Users" />
              <Bar dataKey="vendors" fill="#10B981" name="Vendors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competitive Advantages */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Competitive Edge</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${advantage.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${advantage.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <advantage.icon className="w-8 h-8 text-white" />
                </div>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3">{advantage.title}</h4>
                <p className="text-gray-600 mb-4">{advantage.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Key Metric:</span>
                  <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${advantage.color}`}>
                    {advantage.metrics}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Market Recognition</h3>
          <p className="text-gray-600">Industry achievements and milestones</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Fastest Growing", subtitle: "E-commerce Platform 2023", icon: "🚀" },
            { title: "Best User Experience", subtitle: "Digital Awards 2023", icon: "🏆" },
            { title: "Innovation Leader", subtitle: "Tech Excellence Awards", icon: "💡" },
            { title: "Customer Choice", subtitle: "Bangladesh E-commerce", icon: "⭐" }
          ].map((achievement, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h4 className="font-bold text-gray-800 mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-600">{achievement.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
