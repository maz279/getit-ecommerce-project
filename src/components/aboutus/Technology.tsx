
import React from 'react';
import { Server, Smartphone, Cloud } from 'lucide-react';

export const Technology: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Technology & Infrastructure</h2>
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Server className="w-8 h-8 text-blue-600 mr-3" />
          Cutting-Edge Architecture
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <Smartphone className="w-8 h-8 text-green-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Frontend Technologies</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• React.js-based responsive web app</li>
              <li>• Progressive Web App (PWA) capabilities</li>
              <li>• Native iOS and Android applications</li>
              <li>• Tailwind CSS for modern design</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <Server className="w-8 h-8 text-blue-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Backend Services</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Node.js and Go-based microservices</li>
              <li>• PostgreSQL for data integrity</li>
              <li>• MongoDB for content management</li>
              <li>• Elasticsearch for search capabilities</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <Cloud className="w-8 h-8 text-purple-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Infrastructure & DevOps</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Docker containerization</li>
              <li>• Kubernetes orchestration</li>
              <li>• CI/CD pipelines</li>
              <li>• Multi-region cloud deployment</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">12 Core Microservices</h3>
        <p className="text-gray-700 leading-relaxed mb-6">
          GetIt operates on a state-of-the-art microservices architecture comprising 12 core services, each optimized for specific business functions:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "User Service", desc: "Advanced authentication with local mobile number validation" },
            { name: "Vendor Service", desc: "KYC verification with Bangladesh-specific documents" },
            { name: "Product Service", desc: "Smart catalog management with Bengali search" },
            { name: "Order Service", desc: "Multi-vendor order coordination and tracking" },
            { name: "Payment Service", desc: "Comprehensive payment processing and fraud detection" },
            { name: "Shipping Service", desc: "Intelligent logistics management and coordination" },
            { name: "Notification Service", desc: "Multi-channel communication platform" },
            { name: "Search Service", desc: "AI-powered search with cultural optimization" },
            { name: "Analytics Service", desc: "Business intelligence and performance tracking" },
            { name: "Review Service", desc: "Community-driven ratings and feedback system" },
            { name: "Support Service", desc: "Integrated customer service platform" },
            { name: "Inventory Service", desc: "Real-time stock management across vendors" }
          ].map((service, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">{index + 1}. {service.name}</h4>
              <p className="text-xs text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
