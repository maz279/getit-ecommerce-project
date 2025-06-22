
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const CategoryGroupsSection: React.FC = () => {
  const categories = [
    {
      name: "Electronics",
      icon: "📱",
      activeGroups: 245,
      color: "bg-blue-500",
      description: "Phones, laptops, gadgets"
    },
    {
      name: "Fashion",
      icon: "👗",
      activeGroups: 189,
      color: "bg-pink-500",
      description: "Clothing, shoes, accessories"
    },
    {
      name: "Home & Garden",
      icon: "🏠",
      activeGroups: 156,
      color: "bg-green-500",
      description: "Furniture, appliances, decor"
    },
    {
      name: "Health & Beauty",
      icon: "💄",
      activeGroups: 134,
      color: "bg-purple-500",
      description: "Skincare, makeup, wellness"
    },
    {
      name: "Sports & Outdoor",
      icon: "⚽",
      activeGroups: 98,
      color: "bg-orange-500",
      description: "Equipment, gear, fitness"
    },
    {
      name: "Baby & Kids",
      icon: "🧸",
      activeGroups: 87,
      color: "bg-yellow-500",
      description: "Toys, clothes, essentials"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🛍️ Browse by Category</h2>
          <p className="text-xl text-gray-600">Find group deals in your favorite categories</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className={`${category.color} text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  {category.activeGroups} active groups
                </div>
                <Button variant="outline" className="w-full group-hover:bg-gray-50">
                  Browse Groups
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
