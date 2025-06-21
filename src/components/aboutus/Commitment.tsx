
import React from 'react';
import { TrendingUp, Heart } from 'lucide-react';

export const Commitment: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Commitment to Bangladesh</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            Economic Impact
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Supporting Local Businesses:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Digital commerce tools for traditional businesses</li>
                <li>• National market access for SMEs</li>
                <li>• Employment in the digital sector</li>
                <li>• "Made in Bangladesh" product promotion</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Digital Inclusion:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Accessible ecommerce for all vendors</li>
                <li>• Training for digital transformation</li>
                <li>• Urban-rural market bridge</li>
                <li>• Financial inclusion through diverse payments</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Heart className="w-8 h-8 text-purple-600 mr-3" />
            Community Engagement
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Social Responsibility:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Supporting local artisans and craftspeople</li>
                <li>• Promoting sustainable products</li>
                <li>• Disaster relief and community development</li>
                <li>• Digital literacy education programs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Cultural Sensitivity:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Respecting local traditions in design</li>
                <li>• Supporting festivals and cultural events</li>
                <li>• Promoting local culture through vendors</li>
                <li>• Maintaining culturally appropriate standards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
