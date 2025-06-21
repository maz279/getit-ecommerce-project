
import React, { useState } from 'react';
import { 
  Heart, 
  Shield, 
  Lightbulb, 
  Users, 
  Target, 
  Zap, 
  Globe, 
  Award,
  CheckCircle,
  Star,
  TrendingUp,
  Handshake
} from 'lucide-react';

export const CoreValues: React.FC = () => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const coreValues = [
    {
      icon: Heart,
      title: "Customer Centricity",
      description: "Every decision we make is guided by what's best for our customers and vendors",
      principles: [
        "Listen to customer feedback actively",
        "Prioritize user experience in all features",
        "Provide exceptional support 24/7",
        "Build trust through transparency"
      ],
      color: "from-red-500 to-pink-500",
      bgPattern: "❤️"
    },
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "Building lasting relationships through honesty, reliability, and ethical practices",
      principles: [
        "Maintain highest security standards",
        "Be transparent in all communications",
        "Honor commitments and promises",
        "Protect user data and privacy"
      ],
      color: "from-blue-500 to-cyan-500",
      bgPattern: "🛡️"
    },
    {
      icon: Lightbulb,
      title: "Innovation Excellence",
      description: "Continuously pushing boundaries to deliver cutting-edge solutions and experiences",
      principles: [
        "Embrace emerging technologies",
        "Foster creative problem-solving",
        "Invest in research and development",
        "Learn from failures and iterate"
      ],
      color: "from-yellow-500 to-orange-500",
      bgPattern: "💡"
    },
    {
      icon: Users,
      title: "Collaborative Growth",
      description: "Growing together with our vendors, customers, and communities for mutual success",
      principles: [
        "Support vendor success actively",
        "Share knowledge and best practices",
        "Build strong partnerships",
        "Contribute to community development"
      ],
      color: "from-green-500 to-emerald-500",
      bgPattern: "🤝"
    },
    {
      icon: Target,
      title: "Excellence in Execution",
      description: "Delivering superior quality and performance in everything we do",
      principles: [
        "Set and exceed high standards",
        "Focus on continuous improvement",
        "Measure and optimize performance",
        "Deliver on time, every time"
      ],
      color: "from-purple-500 to-violet-500",
      bgPattern: "🎯"
    },
    {
      icon: Globe,
      title: "Social Responsibility",
      description: "Making a positive impact on society, environment, and local communities",
      principles: [
        "Promote sustainable practices",
        "Support local businesses and artisans",
        "Contribute to economic development",
        "Practice environmental stewardship"
      ],
      color: "from-indigo-500 to-blue-500",
      bgPattern: "🌍"
    }
  ];

  const valueStats = [
    { icon: Star, label: "Customer Satisfaction", value: "99.9%", color: "text-yellow-600" },
    { icon: Shield, label: "Trust Score", value: "4.9/5", color: "text-blue-600" },
    { icon: TrendingUp, label: "Growth Rate", value: "300%", color: "text-green-600" },
    { icon: Award, label: "Industry Awards", value: "15+", color: "text-purple-600" }
  ];

  const culturalPrinciples = [
    {
      title: "Respect & Inclusion",
      description: "We value diversity and treat everyone with respect and dignity",
      icon: Handshake
    },
    {
      title: "Continuous Learning",
      description: "We embrace learning, growth, and adaptation in everything we do",
      icon: Lightbulb
    },
    {
      title: "Accountability",
      description: "We take ownership of our actions and deliver on our commitments",
      icon: Target
    },
    {
      title: "Teamwork",
      description: "We collaborate effectively and support each other's success",
      icon: Users
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The fundamental principles that guide our decisions, shape our culture, and define who we are as an organization.
        </p>
      </div>

      {/* Value Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {valueStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {coreValues.map((value, index) => (
          <div 
            key={index}
            className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredValue(index)}
            onMouseLeave={() => setHoveredValue(null)}
          >
            {/* Background Pattern */}
            <div className="absolute top-4 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              {value.bgPattern}
            </div>
            
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${value.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <value.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900">{value.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{value.description}</p>
              
              <div className="space-y-3">
                {value.principles.map((principle, principleIndex) => (
                  <div key={principleIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{principle}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
          </div>
        ))}
      </div>

      {/* Cultural Principles */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Cultural Principles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {culturalPrinciples.map((principle, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <principle.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">{principle.title}</h4>
                  <p className="text-gray-600 text-sm">{principle.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values in Action */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
        <Heart className="w-16 h-16 mx-auto mb-6 text-white" />
        <h3 className="text-3xl font-bold mb-4">Values in Action</h3>
        <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
          Our values aren't just words on a page - they guide our daily actions, decisions, and interactions. 
          They are the foundation of our culture and the driving force behind our success.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <Users className="w-8 h-8 mx-auto mb-3" />
            <div className="text-xl font-bold mb-2">Employee Satisfaction</div>
            <div className="text-3xl font-bold text-yellow-300">95%</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <Award className="w-8 h-8 mx-auto mb-3" />
            <div className="text-xl font-bold mb-2">Ethics Rating</div>
            <div className="text-3xl font-bold text-green-300">A+</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <Globe className="w-8 h-8 mx-auto mb-3" />
            <div className="text-xl font-bold mb-2">Community Impact</div>
            <div className="text-3xl font-bold text-blue-300">High</div>
          </div>
        </div>
      </div>
    </div>
  );
};
