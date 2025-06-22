
import React from 'react';
import { Card } from '@/components/ui/card';
import { categoriesData } from '@/data/categoriesData';

export const FeaturedCategories: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesData.filter(cat => cat.featured).map((category) => (
          <div
            key={category.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg border hover:shadow-lg transition-all"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  {category.icon}
                </div>
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Hot
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-white/80 text-sm">
                  {category.count.toLocaleString()} products available
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
