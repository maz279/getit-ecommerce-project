
import React, { useState } from 'react';
import { Target, Eye, Heart, Zap, Globe, Users, TrendingUp, Shield } from 'lucide-react';

export const MissionVision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const missions = [
    {
      icon: Heart,
      title: "Empowering Local Businesses",
      description: "Providing digital tools and platforms for traditional businesses to thrive in the digital age.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Digital Inclusion",
      description: "Making e-commerce accessible to everyone, regardless of technical expertise or location.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Creating a trusted marketplace that connects vendors and customers nationwide.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Economic Growth",
      description: "Contributing to Bangladesh's digital economy and creating employment opportunities.",
      color: "from-purple-500 to-violet-500"
    }
  ];

  const visions = [
    {
      icon: Target,
      title: "Market Leadership",
      description: "Becoming Bangladesh's #1 multi-vendor e-commerce platform by 2027.",
      metric: "#1 Platform",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Regional Expansion",
      description: "Expanding to become South Asia's leading digital marketplace.",
      metric: "5+ Countries",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Zap,
      title: "Innovation Hub",
      description: "Setting new standards for e-commerce technology and user experience.",
      metric: "50+ Features",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Maintaining the highest standards of security and customer trust.",
      metric: "99.9% Secure",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Purpose & Direction</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Driven by purpose, guided by vision - building the future of e-commerce in Bangladesh.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 rounded-full p-1 flex">
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'mission'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Target className="w-5 h-5 inline mr-2" />
            Our Mission
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'vision'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Eye className="w-5 h-5 inline mr-2" />
            Our Vision
          </button>
        </div>
      </div>

      {/* Mission Content */}
      {activeTab === 'mission' && (
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To democratize e-commerce in Bangladesh by providing an inclusive, secure, and innovative 
              platform that empowers local businesses to reach customers nationwide while delivering 
              exceptional shopping experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {missions.map((mission, index) => (
              <div 
                key={index} 
                className={`group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-${index + 1}`}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${mission.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <mission.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">{mission.title}</h4>
                <p className="text-gray-600 leading-relaxed">{mission.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vision Content */}
      {activeTab === 'vision' && (
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To be the most trusted and innovative e-commerce ecosystem in South Asia, 
              connecting millions of vendors and customers while driving digital transformation 
              and economic growth across the region.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visions.map((vision, index) => (
              <div 
                key={index} 
                className={`group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-${index + 1} overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${vision.color} opacity-10 rounded-full transform translate-x-16 -translate-y-16`}></div>
                
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${vision.color} mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <vision.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-gray-800 mb-3">{vision.title}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">{vision.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Target:</span>
                    <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${vision.color}`}>
                      {vision.metric}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 text-center border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Journey</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Be part of Bangladesh's digital transformation. Together, we're building more than just a platform - we're creating the future of commerce.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            Become a Vendor
          </button>
          <button className="bg-white text-gray-800 border border-gray-300 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
