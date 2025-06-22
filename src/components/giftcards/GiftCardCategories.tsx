
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const GiftCardCategories: React.FC = () => {
  const categories = [
    { name: 'Food & Dining', icon: '🍽️', count: 120, description: 'Restaurants, cafes, food delivery' },
    { name: 'Fashion & Beauty', icon: '👗', count: 85, description: 'Clothing, cosmetics, accessories' },
    { name: 'Electronics', icon: '📱', count: 95, description: 'Phones, gadgets, appliances' },
    { name: 'Entertainment', icon: '🎬', count: 45, description: 'Movies, games, streaming' },
    { name: 'Travel & Transport', icon: '✈️', count: 30, description: 'Flights, hotels, ride-sharing' },
    { name: 'Health & Wellness', icon: '💊', count: 40, description: 'Pharmacy, fitness, spa' },
    { name: 'Education', icon: '📚', count: 25, description: 'Courses, books, tutorials' },
    { name: 'Home & Garden', icon: '🏠', count: 60, description: 'Furniture, decor, appliances' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect gift card for any interest or hobby
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                <p className="text-purple-600 font-semibold mb-4">{category.count} brands</p>
                <Button variant="outline" className="w-full group-hover:bg-purple-50">
                  Browse Category
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
