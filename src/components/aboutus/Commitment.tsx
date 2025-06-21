
import React, { useState } from 'react';
import { 
  Heart, 
  Leaf, 
  Users, 
  Globe, 
  GraduationCap, 
  HandHeart, 
  Building,
  Award,
  CheckCircle
} from 'lucide-react';

export const Commitment: React.FC = () => {
  const [activeCommitment, setActiveCommitment] = useState(0);

  const commitments = [
    {
      icon: Heart,
      title: "Community Development",
      description: "Supporting local communities through employment, education, and economic growth initiatives",
      details: "We believe in giving back to the communities that make our success possible. Through various programs, we create opportunities for local development and empowerment.",
      color: "from-red-500 to-pink-500",
      initiatives: [
        "Local Employment Programs",
        "Digital Literacy Training",
        "Small Business Support",
        "Community Infrastructure"
      ],
      stats: { value: "5,000+", label: "Jobs Created" }
    },
    {
      icon: Leaf,
      title: "Environmental Sustainability",
      description: "Promoting eco-friendly practices and supporting sustainable businesses across our platform",
      details: "Environmental responsibility is core to our values. We actively promote sustainable practices and support businesses that prioritize environmental conservation.",
      color: "from-green-500 to-emerald-500",
      initiatives: [
        "Carbon Neutral Delivery",
        "Eco-friendly Packaging",
        "Green Vendor Program",
        "Paperless Operations"
      ],
      stats: { value: "40%", label: "Carbon Reduction" }
    },
    {
      icon: Users,
      title: "Social Inclusion",
      description: "Ensuring equal opportunities for all vendors and customers regardless of background or location",
      details: "We are committed to building an inclusive platform that provides equal opportunities for everyone to participate in the digital economy.",
      color: "from-blue-500 to-cyan-500",
      initiatives: [
        "Women Entrepreneur Support",
        "Rural Vendor Program",
        "Accessibility Features",
        "Minority Business Support"
      ],
      stats: { value: "60%", label: "Women Vendors" }
    },
    {
      icon: GraduationCap,
      title: "Education & Training",
      description: "Providing comprehensive training and educational resources for digital commerce skills",
      details: "Knowledge sharing is key to empowerment. We provide extensive training programs to help vendors and customers make the most of digital commerce.",
      color: "from-purple-500 to-violet-500",
      initiatives: [
        "Free Online Courses",
        "Vendor Certification",
        "Digital Marketing Training",
        "Financial Literacy"
      ],
      stats: { value: "10,000+", label: "People Trained" }
    }
  ];

  const socialImpacts = [
    { icon: Building, label: "Local Businesses Supported", value: "50,000+" },
    { icon: Users, label: "Employment Opportunities", value: "5,000+" },
    { icon: Globe, label: "Rural Areas Reached", value: "64 Districts" },
    { icon: GraduationCap, label: "Training Programs", value: "100+" }
  ];

  const sustainabilityGoals = [
    { goal: "Carbon Neutral Operations", progress: 75, year: "2025" },
    { goal: "100% Green Packaging", progress: 60, year: "2026" },
    { goal: "50% Women Vendors", progress: 85, year: "2024" },
    { goal: "Rural Coverage 100%", progress: 40, year: "2027" }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Commitment to Bangladesh</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Beyond business success, we are dedicated to creating positive social, environmental, and economic impact across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {socialImpacts.map((impact, index) => (
          <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <impact.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-2xl font-bold text-gray-800 mb-1">{impact.value}</div>
            <div className="text-sm text-gray-600">{impact.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {commitments.map((commitment, index) => (
            <button
              key={index}
              onClick={() => setActiveCommitment(index)}
              className={`p-6 text-left transition-all duration-300 ${
                activeCommitment === index 
                  ? 'bg-blue-50 border-r-2 border-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${commitment.color} mb-4`}>
                <commitment.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-gray-800 mb-2">{commitment.title}</div>
              <div className="text-sm text-gray-600">{commitment.description}</div>
            </button>
          ))}
        </div>

        <div className="p-8">
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {commitments[activeCommitment].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {commitments[activeCommitment].details}
                </p>
                
                <div className="space-y-3 mb-6">
                  {commitments[activeCommitment].initiatives.map((initiative, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{initiative}</span>
                    </div>
                  ))}
                </div>

                <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${commitments[activeCommitment].color} rounded-lg px-6 py-3 text-white`}>
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">{commitments[activeCommitment].stats.value}</span>
                  <span>{commitments[activeCommitment].stats.label}</span>
                </div>
              </div>

              <div className="relative">
                <div className={`w-full h-64 bg-gradient-to-br ${commitments[activeCommitment].color} rounded-xl flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <commitments[activeCommitment].icon className="w-24 h-24 text-white relative z-10" />
                  
                  <div className="absolute top-6 left-6 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
                  <div className="absolute top-16 right-8 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100"></div>
                  <div className="absolute bottom-8 left-16 w-4 h-4 bg-white/20 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200 mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">2030 Sustainability Goals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sustainabilityGoals.map((goal, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800">{goal.goal}</h4>
                <span className="text-sm text-gray-600">Target: {goal.year}</span>
              </div>
              
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
        <HandHeart className="w-16 h-16 mx-auto mb-6 text-white" />
        <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Together, we can create a more inclusive, sustainable, and prosperous digital economy for Bangladesh. 
          Partner with us to make a positive impact.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
            Partner With Us
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};
