
import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Star, 
  Medal, 
  Crown, 
  Target, 
  TrendingUp, 
  Users,
  Calendar,
  Globe,
  Zap,
  Shield
} from 'lucide-react';

export const Achievements: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('awards');

  const awards = [
    {
      title: "Bangladesh E-commerce Excellence Award",
      year: "2024",
      organization: "DITF Digital Commerce",
      description: "Recognition for outstanding contribution to Bangladesh's digital commerce sector",
      icon: Trophy,
      color: "from-yellow-500 to-amber-500"
    },
    {
      title: "Best Multi-Vendor Platform",
      year: "2023",
      organization: "South Asian Digital Awards",
      description: "Awarded for innovative multi-vendor marketplace solutions",
      icon: Award,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Technology Innovation Leader",
      year: "2023",
      organization: "Bangladesh IT Awards",
      description: "Recognition for pioneering technology implementation in e-commerce",
      icon: Zap,
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Customer Choice Award",
      year: "2023",
      organization: "Consumer Choice Bangladesh",
      description: "Voted by customers as the most trusted e-commerce platform",
      icon: Star,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const milestones = [
    {
      achievement: "Reached 50,000+ Registered Vendors",
      date: "December 2023",
      impact: "Largest vendor network in Bangladesh",
      icon: Users,
      color: "from-blue-500 to-indigo-500"
    },
    {
      achievement: "Processed 1 Million Orders",
      date: "October 2023",
      impact: "Major milestone in order processing",
      icon: Target,
      color: "from-green-500 to-teal-500"
    },
    {
      achievement: "99.9% Uptime Achievement",
      date: "September 2023",
      impact: "Industry-leading reliability standard",
      icon: Shield,
      color: "from-purple-500 to-pink-500"
    },
    {
      achievement: "Coverage in All 64 Districts",
      date: "August 2023",
      impact: "Complete nationwide service coverage",
      icon: Globe,
      color: "from-orange-500 to-red-500"
    }
  ];

  const recognitions = [
    {
      title: "Top 10 Startups Bangladesh",
      source: "Bangladesh Tech Magazine",
      year: "2023",
      description: "Featured among the most promising tech startups"
    },
    {
      title: "Digital Innovation Showcase",
      source: "BASIS National ICT Awards",
      year: "2023",
      description: "Selected for national digital innovation exhibition"
    },
    {
      title: "Sustainability Champion",
      source: "Green Business Awards",
      year: "2024",
      description: "Recognized for environmental responsibility initiatives"
    },
    {
      title: "Employer of Choice",
      source: "Bangladesh HR Excellence",
      year: "2024",
      description: "Outstanding workplace culture and employee satisfaction"
    }
  ];

  const metrics = [
    { label: "Industry Awards", value: "15+", icon: Trophy, color: "text-yellow-600" },
    { label: "Recognition Media", value: "50+", icon: Star, color: "text-blue-600" },
    { label: "Major Milestones", value: "25+", icon: Target, color: "text-green-600" },
    { label: "Growth Records", value: "10+", icon: TrendingUp, color: "text-purple-600" }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Awards & Achievements</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Recognition of our commitment to excellence, innovation, and positive impact on Bangladesh's digital commerce landscape.
        </p>
      </div>

      {/* Achievement Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <metric.icon className={`w-8 h-8 mx-auto mb-3 ${metric.color}`} />
            <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Category Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 rounded-full p-1 flex flex-wrap">
          <button
            onClick={() => setActiveCategory('awards')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 m-1 ${
              activeCategory === 'awards'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Awards
          </button>
          <button
            onClick={() => setActiveCategory('milestones')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 m-1 ${
              activeCategory === 'milestones'
                ? 'bg-white text-green-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Milestones
          </button>
          <button
            onClick={() => setActiveCategory('recognition')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 m-1 ${
              activeCategory === 'recognition'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Recognition
          </button>
        </div>
      </div>

      {/* Awards Section */}
      {activeCategory === 'awards' && (
        <div className="animate-fade-in mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <div 
                key={index}
                className={`group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-${index + 1}`}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${award.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <award.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">{award.title}</h3>
                  <span className={`text-sm font-semibold bg-gradient-to-r ${award.color} bg-clip-text text-transparent`}>
                    {award.year}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{award.description}</p>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-500">{award.organization}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones Section */}
      {activeCategory === 'milestones' && (
        <div className="animate-fade-in mb-12">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-${index + 1}`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${milestone.color} group-hover:scale-110 transition-transform duration-300`}>
                    <milestone.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.achievement}</h3>
                    <p className="text-gray-600 mb-2">{milestone.impact}</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{milestone.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recognition Section */}
      {activeCategory === 'recognition' && (
        <div className="animate-fade-in mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recognitions.map((recognition, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-${index + 1}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-bold text-gray-800 flex-1">{recognition.title}</h4>
                  <span className="text-sm font-semibold text-blue-600">{recognition.year}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{recognition.description}</p>
                
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-500">{recognition.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Showcase */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-8 text-center text-white">
        <Crown className="w-16 h-16 mx-auto mb-6 text-white" />
        <h3 className="text-3xl font-bold mb-4">Excellence Recognition</h3>
        <p className="text-yellow-100 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
          These achievements reflect our team's dedication, our vendors' trust, and our customers' satisfaction. 
          Together, we continue to set new standards in Bangladesh's e-commerce industry.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <Trophy className="w-8 h-8 mx-auto mb-3" />
            <div className="text-xl font-bold mb-2">Industry Leader</div>
            <div className="text-yellow-100">in Innovation</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <Medal className="w-8 h-8 mx-auto mb-3" />
            <div className="text-xl font-bold mb-2">Customer Choice</div>
            <div className="text-yellow-100">Platform</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <Star className="w-8 h-8 mx-auto mb-3" />
            <div className="text-xl font-bold mb-2">Excellence</div>
            <div className="text-yellow-100">in Service</div>
          </div>
        </div>
      </div>
    </div>
  );
};
