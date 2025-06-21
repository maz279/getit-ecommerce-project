
import React, { useState } from 'react';
import { 
  Rocket, 
  Globe, 
  Zap, 
  Brain, 
  Smartphone, 
  ShoppingBag, 
  CreditCard, 
  Truck,
  Target,
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';

export const FutureVision: React.FC = () => {
  const [activeTimeline, setActiveTimeline] = useState(0);

  const timelinePhases = [
    {
      period: "Next 12 Months",
      year: "2024-2025",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      initiatives: [
        {
          title: "Advanced Analytics Dashboard",
          description: "AI-powered seller analytics with predictive insights",
          icon: Brain
        },
        {
          title: "Live Commerce Features",
          description: "Real-time streaming and social commerce integration",
          icon: Smartphone
        },
        {
          title: "Same-Day Delivery Expansion",
          description: "Nationwide same-day delivery in all major cities",
          icon: Truck
        },
        {
          title: "Voice Commerce",
          description: "Bengali voice shopping and AI assistant integration",
          icon: Zap
        }
      ]
    },
    {
      period: "Next 2-3 Years",
      year: "2025-2027",
      icon: Rocket,
      color: "from-purple-500 to-violet-500",
      initiatives: [
        {
          title: "Regional Expansion",
          description: "Expansion to Nepal, Sri Lanka, and Myanmar markets",
          icon: Globe
        },
        {
          title: "GetIt Pay Launch",
          description: "Integrated digital wallet and fintech services",
          icon: CreditCard
        },
        {
          title: "B2B Marketplace",
          description: "Dedicated platform for business-to-business commerce",
          icon: ShoppingBag
        },
        {
          title: "AR Shopping Experience",
          description: "Augmented reality for virtual product trials",
          icon: Brain
        }
      ]
    },
    {
      period: "Long-term Vision",
      year: "2027-2030",
      icon: Star,
      color: "from-green-500 to-emerald-500",
      initiatives: [
        {
          title: "Market Dominance",
          description: "Leading e-commerce platform across South Asia",
          icon: Target
        },
        {
          title: "Ecosystem Integration",
          description: "Complete digital commerce and fintech ecosystem",
          icon: Globe
        },
        {
          title: "AI-First Platform",
          description: "Fully AI-powered personalization and automation",
          icon: Brain
        },
        {
          title: "Sustainable Commerce",
          description: "Carbon-neutral operations and circular economy",
          icon: Star
        }
      ]
    }
  ];

  const innovationAreas = [
    {
      icon: Brain,
      title: "Artificial Intelligence",
      description: "Advanced AI for personalization, automation, and insights",
      features: ["Predictive Analytics", "Smart Recommendations", "Automated Support", "Fraud Detection"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Innovation",
      description: "Cutting-edge mobile experiences and emerging technologies",
      features: ["AR/VR Shopping", "Voice Commerce", "5G Optimization", "IoT Integration"],
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Globe,
      title: "Global Expansion",
      description: "Strategic expansion across South Asian markets",
      features: ["Multi-currency", "Local Partnerships", "Cultural Adaptation", "Regulatory Compliance"],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Performance Excellence",
      description: "Industry-leading performance and reliability standards",
      features: ["Sub-second Load", "99.99% Uptime", "Auto-scaling", "Edge Computing"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  const milestones = [
    { year: "2024", milestone: "1M+ Active Users", achieved: true },
    { year: "2025", milestone: "Regional Expansion", achieved: false },
    { year: "2026", milestone: "GetIt Pay Launch", achieved: false },
    { year: "2027", milestone: "Market Leadership", achieved: false },
    { year: "2030", milestone: "Digital Ecosystem", achieved: false }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Future Vision & Growth Strategy</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our ambitious roadmap to transform e-commerce across South Asia through innovation, expansion, and technological excellence.
        </p>
      </div>

      {/* Timeline Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 rounded-full p-1 flex flex-wrap">
          {timelinePhases.map((phase, index) => (
            <button
              key={index}
              onClick={() => setActiveTimeline(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 m-1 ${
                activeTimeline === index
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <phase.icon className="w-4 h-4 inline mr-2" />
              {phase.period}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="mb-16">
        {timelinePhases.map((phase, phaseIndex) => (
          <div
            key={phaseIndex}
            className={`${activeTimeline === phaseIndex ? 'block animate-fade-in' : 'hidden'}`}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{phase.period}</h3>
              <p className="text-xl text-gray-600">{phase.year}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {phase.initiatives.map((initiative, index) => (
                <div 
                  key={index}
                  className={`group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-${index + 1}`}
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${phase.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <initiative.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-800 mb-3">{initiative.title}</h4>
                  <p className="text-gray-600">{initiative.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Innovation Areas */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Innovation Focus Areas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {innovationAreas.map((area, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${area.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <area.icon className="w-8 h-8 text-white" />
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-3">{area.title}</h4>
              <p className="text-gray-600 mb-6">{area.description}</p>
              
              <div className="space-y-2">
                {area.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${area.color}`}></div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Key Milestones</h3>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex items-center">
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${
                  milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                } border-4 border-white shadow-md`}></div>
                
                <div className="flex-1 flex items-center justify-between">
                  <div className={`text-right pr-8 ${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
                    <div className="font-bold text-gray-800">{milestone.year}</div>
                    <div className="text-gray-600">{milestone.milestone}</div>
                  </div>
                  
                  <div className={`pl-8 ${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      milestone.achieved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {milestone.achieved ? 'Achieved' : 'Planned'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
        <Rocket className="w-16 h-16 mx-auto mb-6 text-white" />
        <h3 className="text-3xl font-bold mb-4">Building the Future of Commerce</h3>
        <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
          By 2030, GetIt will be the most trusted and innovative digital commerce ecosystem in South Asia, 
          empowering millions of businesses and customers while driving economic growth and digital transformation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <TrendingUp className="w-8 h-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2">10M+</div>
            <div className="text-blue-100">Active Users</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <Globe className="w-8 h-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2">5+</div>
            <div className="text-blue-100">Countries</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <Star className="w-8 h-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2">#1</div>
            <div className="text-blue-100">Platform</div>
          </div>
        </div>
      </div>
    </div>
  );
};
