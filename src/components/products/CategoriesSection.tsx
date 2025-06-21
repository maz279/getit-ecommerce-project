
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle } from 'lucide-react';
import { categories } from '@/data/productsData';

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🛍️ EID Special Collections
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View All Categories
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className={`${category.color} text-white transform hover:scale-105 transition-all duration-300 border-none shadow-xl`}>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-bold mt-2">
                    {category.discount}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {category.subcategories.map((sub, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="w-3 h-3 mt-0.5" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-white bg-white bg-opacity-20 p-2 rounded mb-4">
                  🎯 {category.topPicks}
                </div>
                <Button variant="secondary" className="w-full text-gray-800 font-bold">
                  Shop Collection
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
