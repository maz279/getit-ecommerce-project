
import React, { useState } from 'react';
import { Zap, Shield, Users, Globe, Smartphone, Clock, Award, TrendingUp, Heart, Target } from 'lucide-react';

export const UniqueValue: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const valuePropositions = [
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Sub-2-second load times optimized for Bangladesh's internet infrastructure",
      metrics: ["2s Load Time", "99.9% Uptime", "500+ TPS"],
      color: "from-yellow-400 to-orange-500",
      bgPattern: "⚡"
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "PCI DSS compliant platform with advanced fraud detection and encryption",
      metrics: ["256-bit SSL", "24/7 Monitoring", "Zero Breaches"],
      color: "from-green-400 to-emerald-500",
      bgPattern: "🛡️"
    },
    {
      icon: Users,
      title: "Vendor Success Focus",
      description: "Commission-based model aligned with vendor success and comprehensive support",
      metrics: ["95% Satisfaction", "24/7 Support", "Free Training"],
      color: "from-blue-400 to-cyan-500",
      bgPattern: "👥"
    },
    {
      icon: Globe,
      title: "Local Market Expertise",
      description: "Built specifically for Bangladesh with deep cultural and market understanding",
      metrics: ["64 Districts", "Local Languages", "Cultural Events"],
      color: "from-purple-400 to-violet-500",
      bgPattern: "🌐"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices with PWA capabilities and app-like experience",
      metrics: ["PWA Enabled", "Offline Mode", "App-Like UX"],
      color: "from-pink-400 to-rose-500",
      bgPattern: "📱"
    },
    {
      icon: Clock,
      title: "Smart Logistics",
      description: "Intelligent delivery network with same-day delivery in major cities",
      metrics: ["Same Day", "Real Tracking", "Smart Routes"],
      color: "from-indigo-400 to-blue-500",
      bgPattern: "🚚"
    }
  ];

  const competitiveAdvantages = [
    { label: "Technology Stack", value: "Modern & Scalable", icon: Award },
    { label: "Local Understanding", value: "100% Bangladesh Focused", icon: Heart },
    { label: "Vendor Support", value: "Comprehensive Ecosystem", icon: Users },
    { label: "Market Coverage", value: "Nationwide Reach", icon: Globe },
    { label: "Growth Rate", value: "300% YoY", icon: TrendingUp },
    { label: "Customer Satisfaction", value: "4.8/5 Rating", icon: Target }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">What Makes GetIt Different</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our unique combination of technology excellence, local expertise, and vendor-centric approach sets us apart in the market.
        </p>
      </div>

      {/* Value Propositions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {valuePropositions.map((item, index) => (
          <div 
            key={index}
            className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Pattern */}
            <div className="absolute top-4 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              {item.bgPattern}
            </div>
            
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
              
              <div className="space-y-2">
                {item.metrics.map((metric, metricIndex) => (
                  <div 
                    key={metricIndex} 
                    className={`inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mr-2 group-hover:bg-gradient-to-r group-hover:${item.color} group-hover:text-white transition-all duration-300`}
                  >
                    {metric}
                  </div>
                ))}
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
          </div>
        ))}
      </div>

      {/* Competitive Advantages */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Competitive Edge</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitiveAdvantages.map((advantage, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <advantage.icon className="w-8 h-8 text-blue-600" />
                <div className="text-right">
                  <div className="text-sm text-gray-500">{advantage.label}</div>
                  <div className="font-bold text-gray-800">{advantage.value}</div>
                </div>
              </div>
              
              {/* Progress bar animation */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"
                  style={{ 
                    animation: hoveredCard === index ? `scale-x-100 1s ease-out forwards` : 'none',
                    transform: 'scaleX(1)'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-8 py-4 border border-blue-200">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-blue-600" />
            <span className="text-blue-800 font-semibold">Market Leader</span>
          </div>
          <div className="w-px h-6 bg-blue-300"></div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-semibold">Fastest Growing</span>
          </div>
          <div className="w-px h-6 bg-blue-300"></div>
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-600" />
            <span className="text-red-800 font-semibold">Most Trusted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
