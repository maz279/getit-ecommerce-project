
import React, { useState } from 'react';
import { Shield, Lock, Eye, FileCheck, Zap, CheckCircle, Users } from 'lucide-react';

export const Security: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const securityFeatures = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "256-bit SSL encryption protects all data transmissions",
      details: "Military-grade encryption ensuring complete data protection during transmission and storage.",
      color: "from-blue-500 to-cyan-500",
      metrics: ["256-bit SSL", "AES Encryption", "TLS 1.3"]
    },
    {
      icon: Lock,
      title: "PCI DSS Compliance",
      description: "Certified payment security meeting international standards",
      details: "Full compliance with Payment Card Industry Data Security Standards for secure transactions.",
      color: "from-green-500 to-emerald-500",
      metrics: ["PCI Level 1", "SOC 2", "ISO 27001"]
    },
    {
      icon: Eye,
      title: "24/7 Monitoring",
      description: "Continuous security monitoring and threat detection",
      details: "Advanced AI-powered monitoring systems that detect and prevent security threats in real-time.",
      color: "from-purple-500 to-violet-500",
      metrics: ["Real-time Alerts", "AI Detection", "Global SOC"]
    },
    {
      icon: FileCheck,
      title: "Data Protection",
      description: "GDPR compliant data handling and privacy protection",
      details: "Comprehensive data protection measures ensuring user privacy and regulatory compliance.",
      color: "from-orange-500 to-red-500",
      metrics: ["GDPR Ready", "Data Masking", "Right to Delete"]
    }
  ];

  const securityStats = [
    { label: "Uptime", value: "99.9%", icon: CheckCircle, color: "text-green-600" },
    { label: "Security Incidents", value: "0", icon: Shield, color: "text-blue-600" },
    { label: "Response Time", value: "<5min", icon: Zap, color: "text-yellow-600" },
    { label: "Protected Users", value: "50K+", icon: Users, color: "text-purple-600" }
  ];

  const complianceStandards = [
    { name: "PCI DSS Level 1", description: "Payment Card Industry Compliance", icon: "💳" },
    { name: "ISO 27001", description: "Information Security Management", icon: "🔐" },
    { name: "SOC 2 Type II", description: "Service Organization Control", icon: "📋" },
    { name: "GDPR", description: "Data Protection Regulation", icon: "🛡️" },
    { name: "Bangladesh ICT Act", description: "Local Regulatory Compliance", icon: "🇧🇩" },
    { name: "PCIDSS", description: "Card Data Security Standard", icon: "💎" }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Enterprise-Grade Security</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trust is our foundation. We implement the highest security standards to protect your data and transactions.
        </p>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {securityStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
            <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Security Features */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
        <div className="flex flex-wrap">
          {securityFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`flex-1 min-w-0 p-6 text-left transition-all duration-300 ${
                activeFeature === index 
                  ? 'bg-blue-50 border-b-2 border-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{feature.title}</div>
                  <div className="text-sm text-gray-600">{feature.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-8">
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {securityFeatures[activeFeature].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {securityFeatures[activeFeature].details}
                </p>
                
                <div className="space-y-3">
                  {securityFeatures[activeFeature].metrics.map((metric, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-medium">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className={`w-full h-64 bg-gradient-to-br ${securityFeatures[activeFeature].color} rounded-xl flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <securityFeatures[activeFeature].icon className="w-24 h-24 text-white relative z-10" />
                  
                  {/* Animated particles */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-12 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-100"></div>
                  <div className="absolute bottom-8 left-12 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Compliance & Certifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complianceStandards.map((standard, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 group"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {standard.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{standard.name}</h4>
                <p className="text-sm text-gray-600">{standard.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-6 py-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">All certifications current and regularly audited</span>
          </div>
        </div>
      </div>

      {/* Security Promise */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
        <h3 className="text-2xl font-bold mb-4">Our Security Promise</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          We are committed to maintaining the highest standards of security and privacy protection. 
          Your data and transactions are secured with enterprise-grade security measures.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="font-semibold">24/7 Monitoring</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="font-semibold">Zero Tolerance Policy</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="font-semibold">Continuous Updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};
