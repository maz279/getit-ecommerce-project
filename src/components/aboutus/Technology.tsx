
import React, { useState } from 'react';
import { Server, Smartphone, Shield, Zap, Database, Cloud, Code, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Technology: React.FC = () => {
  const [activeTab, setActiveTab] = useState('frontend');

  const techStacks = {
    frontend: {
      title: "Frontend Technologies",
      icon: Monitor,
      color: "from-blue-500 to-cyan-500",
      technologies: [
        { name: "React.js", description: "Modern UI framework", icon: "⚛️" },
        { name: "TypeScript", description: "Type-safe development", icon: "📘" },
        { name: "Tailwind CSS", description: "Utility-first styling", icon: "🎨" },
        { name: "PWA", description: "App-like experience", icon: "📱" }
      ]
    },
    backend: {
      title: "Backend Services",
      icon: Server,
      color: "from-green-500 to-emerald-500",
      technologies: [
        { name: "Node.js", description: "Server-side runtime", icon: "🟢" },
        { name: "Go", description: "High-performance services", icon: "🔷" },
        { name: "Microservices", description: "Scalable architecture", icon: "🔧" },
        { name: "REST APIs", description: "Communication layer", icon: "🔗" }
      ]
    },
    database: {
      title: "Data Management",
      icon: Database,
      color: "from-purple-500 to-violet-500",
      technologies: [
        { name: "PostgreSQL", description: "Transactional integrity", icon: "🐘" },
        { name: "MongoDB", description: "Flexible content", icon: "🍃" },
        { name: "Redis", description: "High-speed caching", icon: "🔴" },
        { name: "Elasticsearch", description: "Powerful search", icon: "🔍" }
      ]
    },
    infrastructure: {
      title: "Infrastructure & DevOps",
      icon: Cloud,
      color: "from-orange-500 to-red-500",
      technologies: [
        { name: "Docker", description: "Containerization", icon: "🐳" },
        { name: "Kubernetes", description: "Orchestration", icon: "☸️" },
        { name: "CI/CD", description: "Continuous delivery", icon: "🔄" },
        { name: "Multi-region", description: "Global deployment", icon: "🌍" }
      ]
    }
  };

  const performanceMetrics = [
    { label: "Uptime", value: "99.9%", icon: Shield },
    { label: "Load Time", value: "<2s", icon: Zap },
    { label: "TPS Capacity", value: "500+", icon: Server },
    { label: "Mobile Optimized", value: "100%", icon: Smartphone }
  ];

  const microservices = [
    "User Service", "Vendor Service", "Product Service", "Order Service",
    "Payment Service", "Shipping Service", "Notification Service", "Search Service",
    "Analytics Service", "Review Service", "Support Service", "Inventory Service"
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Advanced Technology Platform</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Built on cutting-edge technology stack for optimal performance, scalability, and user experience.
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <metric.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Technology Stack Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {Object.entries(techStacks).map(([key, stack]) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key)}
              variant={activeTab === key ? "default" : "ghost"}
              className={`flex-1 min-w-0 py-4 px-6 rounded-none border-0 ${
                activeTab === key ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : ''
              }`}
            >
              <stack.icon className="w-5 h-5 mr-2" />
              <span className="truncate">{stack.title}</span>
            </Button>
          ))}
        </div>

        <div className="p-8">
          {Object.entries(techStacks).map(([key, stack]) => (
            <div
              key={key}
              className={`${activeTab === key ? 'block animate-fade-in' : 'hidden'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stack.technologies.map((tech, index) => (
                  <div 
                    key={index} 
                    className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {tech.icon}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{tech.name}</h4>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Microservices Architecture */}
      <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Microservices Architecture</h3>
          <p className="text-gray-600">12 specialized services working in harmony</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {microservices.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100"
            >
              <Code className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium text-gray-800">{service}</div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-6 py-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Scalable • Resilient • High Performance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
