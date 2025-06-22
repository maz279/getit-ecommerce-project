
import React, { useState } from 'react';
import { Heart, Clock, TrendingDown, Package, Star, Gift, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryData {
  id: string;
  name: string;
  nameBn: string;
  icon: React.ComponentType<any>;
  count: number;
  color: string;
  bgColor: string;
  description: string;
  isDefault: boolean;
}

interface WishlistCategoriesProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const WishlistCategories: React.FC<WishlistCategoriesProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  const [showCustomCategories, setShowCustomCategories] = useState(false);

  const defaultCategories: CategoryData[] = [
    {
      id: 'all',
      name: 'All Items',
      nameBn: 'সব পণ্য',
      icon: Heart,
      count: 23,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'All your saved items',
      isDefault: true
    },
    {
      id: 'recent',
      name: 'Recently Added',
      nameBn: 'সম্প্রতি যোগ করা',
      icon: Clock,
      count: 8,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Items added in last 7 days',
      isDefault: true
    },
    {
      id: 'price_drops',
      name: 'Price Drops',
      nameBn: 'দাম কমেছে',
      icon: TrendingDown,
      count: 5,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Items with recent price reductions',
      isDefault: true
    },
    {
      id: 'back_in_stock',
      name: 'Back in Stock',
      nameBn: 'আবার এসেছে',
      icon: Package,
      count: 3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Previously out-of-stock items',
      isDefault: true
    }
  ];

  const customCategories: CategoryData[] = [
    {
      id: 'eid_shopping',
      name: 'Eid Shopping',
      nameBn: 'ঈদ কেনাকাটা',
      icon: Star,
      count: 12,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Special items for Eid celebration',
      isDefault: false
    },
    {
      id: 'wedding_items',
      name: 'Wedding Items',
      nameBn: 'বিয়ের পণ্য',
      icon: Gift,
      count: 7,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Wedding and ceremony items',
      isDefault: false
    }
  ];

  const festivalCollections: CategoryData[] = [
    {
      id: 'eid_collection',
      name: 'Eid Collection',
      nameBn: 'ঈদ কালেকশন',
      icon: Star,
      count: 15,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Curated Eid special items',
      isDefault: false
    },
    {
      id: 'pahela_baishakh',
      name: 'Pahela Baishakh',
      nameBn: 'পহেলা বৈশাখ',
      icon: Calendar,
      count: 4,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Bengali New Year celebration',
      isDefault: false
    },
    {
      id: 'durga_puja',
      name: 'Durga Puja Collection',
      nameBn: 'দুর্গা পূজা কালেকশন',
      icon: Sparkles,
      count: 6,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Durga Puja special items',
      isDefault: false
    }
  ];

  const CategoryCard: React.FC<{ category: CategoryData }> = ({ category }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        activeCategory === category.id 
          ? 'ring-2 ring-blue-500 shadow-lg' 
          : 'hover:shadow-lg'
      }`}
      onClick={() => onCategoryChange(category.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${category.bgColor}`}>
            <category.icon className={`w-5 h-5 ${category.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.nameBn}</p>
            <p className="text-xs text-gray-400 mt-1">{category.description}</p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="text-sm">
              {category.count}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Wishlist Categories</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowCustomCategories(!showCustomCategories)}
        >
          {showCustomCategories ? 'Show Less' : 'Show More'}
        </Button>
      </div>

      {/* Default Categories */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Default Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Custom Categories */}
      {showCustomCategories && (
        <>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">My Custom Categories</h3>
              <Button variant="outline" size="sm">
                + Create New
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* Festival Collections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Festival Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {festivalCollections.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
