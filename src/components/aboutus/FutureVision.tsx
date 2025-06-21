
import React from 'react';
import { Rocket, Brain } from 'lucide-react';

export const FutureVision: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Future Vision & Growth Strategy</h2>
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Rocket className="w-8 h-8 text-blue-600 mr-3" />
          Expansion Plans
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Market Expansion</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Expansion to neighboring South Asian markets</li>
              <li>• B2B marketplace capabilities</li>
              <li>• GetIt Pay - integrated digital wallet</li>
              <li>• GetIt Logistics - proprietary delivery network</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Technology Advancement</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Augmented reality (AR) for virtual trials</li>
              <li>• Advanced AI for personalized experiences</li>
              <li>• Voice commerce in Bengali</li>
              <li>• Emerging technology integration</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Service Enhancement</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Subscription-based services</li>
              <li>• Grocery and fresh food delivery</li>
              <li>• GetIt Plus premium membership</li>
              <li>• Social commerce features</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Brain className="w-8 h-8 text-purple-600 mr-3" />
          Innovation Roadmap
        </h3>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 text-blue-600">Next 12 Months</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Advanced seller analytics dashboard</li>
                <li>• AI-powered customer service chatbot</li>
              </ul>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Live streaming commerce features</li>
                <li>• Same-day delivery expansion</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 text-green-600">Next 2-3 Years</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Private label products program</li>
                <li>• GetIt Business for B2B commerce</li>
              </ul>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cross-border trade facilitation</li>
                <li>• Predictive inventory management</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 text-purple-600">Long-term Vision (5+ Years)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dominant ecommerce platform in Bangladesh</li>
                <li>• Leading South Asian marketplace</li>
              </ul>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Comprehensive fintech solutions</li>
                <li>• Integrated digital commerce ecosystem</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
