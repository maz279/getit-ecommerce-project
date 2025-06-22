
import React from 'react';
import { Card } from '@/components/ui/card';
import { categoriesData } from '@/data/categoriesData';

export const CategoryOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Category Overview */}
      <Card className="p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover millions of products across hundreds of categories from trusted vendors
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoriesData.slice(0, 12).map((category) => (
            <div
              key={category.id}
              className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color} text-white mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="font-medium text-sm text-center text-gray-800">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                {category.count.toLocaleString()} items
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
