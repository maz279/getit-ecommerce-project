
import React from 'react';
import { TrendingUp, Code, MapPin, Handshake } from 'lucide-react';

export const MarketPosition: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Market Position & Competitive Advantage</h2>
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
          Leading Market Share
        </h3>
        <p className="text-gray-700 leading-relaxed mb-6">
          GetIt has established itself as Bangladesh's fastest-growing multi-vendor ecommerce platform, with ambitious goals to capture significant market share through:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Growth Targets</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 1,000+ active vendors within first operational year</li>
              <li>• 50,000+ registered users through superior UX</li>
              <li>• Nationwide reach including tier-2 and tier-3 cities</li>
              <li>• 5% market share in Bangladesh's ecommerce sector</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Performance Metrics</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 99.9% uptime and scalability</li>
              <li>• Sub-2-second page load times</li>
              <li>• 500+ transactions per second capacity</li>
              <li>• Cloud-native global deployment</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Competitive Differentiators</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <Code className="w-8 h-8 text-blue-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Technology Excellence</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Modern microservices architecture</li>
              <li>• Optimized for Bangladesh's infrastructure</li>
              <li>• High-performance transaction handling</li>
              <li>• Scalable cloud-native deployment</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <MapPin className="w-8 h-8 text-green-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Local Market Expertise</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Deep consumer behavior understanding</li>
              <li>• Cultural and seasonal integration</li>
              <li>• Traditional measurement support</li>
              <li>• Bangladesh-specific compliance</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <Handshake className="w-8 h-8 text-purple-600 mb-4" />
            <h4 className="font-semibold text-gray-800 mb-3">Vendor-Centric Approach</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Success-aligned commission model</li>
              <li>• Comprehensive support ecosystem</li>
              <li>• Transparent dispute resolution</li>
              <li>• Performance-based incentives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
