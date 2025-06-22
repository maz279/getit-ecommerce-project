
import React from 'react';
import { Star, Award } from 'lucide-react';

export const VendorSpotlight: React.FC = () => {
  const vendors = [
    {
      name: 'TechHub BD',
      rating: 4.9,
      products: 1250,
      sales: '50K+',
      badge: 'Premium Seller',
      logo: '/placeholder.svg'
    },
    {
      name: 'Fashion World',
      rating: 4.8,
      products: 2100,
      sales: '75K+',
      badge: 'Top Rated',
      logo: '/placeholder.svg'
    },
    {
      name: 'Home Essentials',
      rating: 4.7,
      products: 890,
      sales: '30K+',
      badge: 'Trending',
      logo: '/placeholder.svg'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Top Performing Vendors</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map((vendor, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{vendor.name}</h3>
              
              <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                {vendor.badge}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{vendor.rating} Rating</span>
                </div>
                <p>{vendor.products.toLocaleString()} Products</p>
                <p>{vendor.sales} Total Sales</p>
              </div>
              
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Visit Store
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
