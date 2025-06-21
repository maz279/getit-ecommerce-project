
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  CreditCard, 
  Truck, 
  MessageCircle, 
  BarChart3, 
  Smartphone, 
  Globe,
  Zap,
  Users,
  Package,
  Shield
} from 'lucide-react';

export const PlatformCapabilities: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('vendor');

  const vendorCapabilities = [
    {
      icon: ShoppingCart,
      title: "Product Management",
      description: "Advanced catalog management with bulk upload, variants, and inventory tracking",
      features: ["Bulk Upload", "Inventory Sync", "Product Variants", "Category Management"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive sales analytics, customer insights, and performance metrics",
      features: ["Sales Reports", "Customer Analytics", "Traffic Insights", "ROI Tracking"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Integrated payment gateway with multiple payment options and instant settlements",
      features: ["Multiple Gateways", "Instant Settlement", "Payment Analytics", "Fraud Protection"],
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Truck,
      title: "Logistics Management",
      description: "Smart shipping solutions with real-time tracking and delivery optimization",
      features: ["Auto Shipping", "Real-time Tracking", "Delivery Optimization", "Return Management"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const customerCapabilities = [
    {
      icon: Search,
      title: "Advanced Search",
      description: "AI-powered search with filters, recommendations, and voice search capabilities",
      features: ["Voice Search", "Smart Filters", "Visual Search", "Auto-complete"],
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Experience",
      description: "Progressive Web App with offline capabilities and native app features",
      features: ["PWA Support", "Offline Mode", "Push Notifications", "Touch Optimized"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: MessageCircle,
      title: "Customer Support",
      description: "24/7 multilingual support with AI chatbot and live chat capabilities",
      features: ["AI Chatbot", "Live Chat", "Multilingual", "24/7 Support"],
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Security Features",
      description: "Advanced security measures including secure checkout and fraud detection",
      features: ["Secure Checkout", "Fraud Detection", "Data Protection", "Privacy Controls"],
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const platformStats = [
    { label: "API Endpoints", value: "200+", icon: Globe },
    { label: "Response Time", value: "<100ms", icon: Zap },
    { label: "Concurrent Users", value: "10K+", icon: Users },
    { label: "Products Supported", value: "Unlimited", icon: Package }
  ];

  const integrations = [
    { name: "Payment Gateways", count: "15+", icon: "💳" },
    { name: "Shipping Partners", count: "25+", icon: "🚚" },
    { name: "Marketing Tools", count: "30+", icon: "📊" },
    { name: "Analytics Platforms", count: "10+", icon: "📈" },
    { name: "Social Media", count: "8+", icon: "📱" },
    { name: "ERP Systems", count: "12+", icon: "⚙️" }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Capabilities</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive features and tools designed to empower vendors and delight customers with exceptional experiences.
        </p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {platformStats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 rounded-full p-1 flex">
          <button
            onClick={() => setActiveCategory('vendor')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeCategory === 'vendor'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ShoppingCart className="w-5 h-5 inline mr-2" />
            For Vendors
          </button>
          <button
            onClick={() => setActiveCategory('customer')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeCategory === 'customer'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            For Customers
          </button>
        </div>
      </div>

      {/* Vendor Capabilities */}
      {activeCategory === 'vendor' && (
        <div className="animate-fade-in mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vendorCapabilities.map((capability, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${capability.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <capability.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{capability.title}</h3>
                <p className="text-gray-600 mb-6">{capability.description}</p>
                
                <div className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.color}`}></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Capabilities */}
      {activeCategory === 'customer' && (
        <div className="animate-fade-in mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {customerCapabilities.map((capability, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${capability.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <capability.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{capability.title}</h3>
                <p className="text-gray-600 mb-6">{capability.description}</p>
                
                <div className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.color}`}></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Third-Party Integrations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 group text-center"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {integration.icon}
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{integration.name}</h4>
              <div className="text-2xl font-bold text-blue-600">{integration.count}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-6 py-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">API-first architecture enables seamless integrations</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <Package className="w-16 h-16 mx-auto mb-6 text-white" />
        <h3 className="text-2xl font-bold mb-4">Ready to Experience Our Platform?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Discover how our comprehensive platform capabilities can transform your business and enhance your customer experience.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
            Start Selling
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105">
            Explore Features
          </button>
        </div>
      </div>
    </div>
  );
};
