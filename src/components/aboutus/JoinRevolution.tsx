
import React from 'react';
import { ShoppingBag, Users, Handshake } from 'lucide-react';

export const JoinRevolution: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Join the GetIt Revolution</h2>
      <p className="text-gray-700 text-center mb-8 text-lg">
        GetIt represents more than just an ecommerce platform - we are catalysts for Bangladesh's digital transformation.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg text-center">
          <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-800 mb-3">For Vendors</h3>
          <p className="text-sm text-gray-600">Ready to transform your business? Join thousands of successful vendors who have chosen GetIt as their digital commerce partner.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg text-center">
          <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-800 mb-3">For Customers</h3>
          <p className="text-sm text-gray-600">Experience the future of shopping in Bangladesh. Discover products from verified vendors while supporting local businesses.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg text-center">
          <Handshake className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-800 mb-3">For Partners</h3>
          <p className="text-sm text-gray-600">Be part of Bangladesh's ecommerce revolution. GetIt offers opportunities for strategic partnerships and investment.</p>
        </div>
      </div>
    </div>
  );
};
