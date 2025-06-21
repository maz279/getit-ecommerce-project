
import React from 'react';

export const CompanyOverview: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Company Overview</h2>
      <div className="bg-gray-50 p-8 rounded-lg space-y-4">
        <p className="text-gray-700 leading-relaxed">
          GetIt is Bangladesh's premier multi-vendor ecommerce platform, revolutionizing the way millions of Bangladeshis shop, sell, and connect online. Much like how Amazon transformed commerce in North America and Shopee reshaped Southeast Asian ecommerce, GetIt is establishing itself as the definitive digital marketplace for Bangladesh, serving as the bridge between local vendors and customers nationwide.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Founded with the vision of democratizing commerce in Bangladesh, GetIt operates as a comprehensive digital ecosystem where thousands of vendors can showcase their products to millions of customers across the country. Our platform combines cutting-edge technology with deep local market understanding to deliver an unparalleled online shopping experience that caters specifically to Bangladeshi consumers and businesses.
        </p>
      </div>
    </div>
  );
};
