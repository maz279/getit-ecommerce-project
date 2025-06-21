
import React from 'react';
import { Target, Globe, CheckCircle } from 'lucide-react';

export const MissionVision: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div className="bg-blue-50 p-8 rounded-lg">
        <Target className="w-12 h-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-4 font-semibold">
          "To establish GetIt as Bangladesh's leading multi-vendor ecommerce platform, empowering local vendors while providing exceptional shopping experiences that build trust, drive growth, and foster a thriving digital commerce ecosystem."
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          At GetIt, we believe that every vendor, from small local businesses to established enterprises, deserves access to the digital marketplace. We are committed to:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span><strong>Democratizing Commerce:</strong> Making online selling accessible to vendors of all sizes</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span><strong>Enhancing Customer Experience:</strong> Providing seamless, secure, and convenient shopping experiences</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span><strong>Supporting Local Economy:</strong> Promoting Bangladeshi vendors and "Made in Bangladesh" products</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span><strong>Building Trust:</strong> Establishing a reliable, transparent, and secure marketplace</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span><strong>Driving Innovation:</strong> Continuously advancing ecommerce technology for the Bangladesh market</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-green-50 p-8 rounded-lg">
        <Globe className="w-12 h-12 text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
        <p className="text-gray-700 leading-relaxed mb-4 font-semibold">
          "To become the undisputed leader in Bangladesh's digital commerce landscape, recognized as the most trusted, innovative, and customer-centric ecommerce platform in the region."
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">We envision a Bangladesh where:</p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span>Every business, regardless of size, can reach customers nationwide through digital channels</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span>Consumers enjoy world-class online shopping experiences with local relevance</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span>Digital commerce drives economic growth and creates opportunities for all</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span>Technology bridges the gap between urban and rural markets</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span>Trust and transparency define every transaction</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
