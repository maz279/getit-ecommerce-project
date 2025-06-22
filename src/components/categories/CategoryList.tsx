
import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Sparkles, Crown, Shirt, Users, Baby, Heart, 
  Zap, Star, ShoppingBag, Footprints, Package, Plus, Dumbbell, Watch,
  Monitor, Camera, Headphones, Gamepad2, Cpu, HardDrive, Keyboard,
  Mouse, Printer, Wifi, Speaker, Tv, Smartphone, Tablet, Home,
  Sofa, Bed, Lamp, UtensilsCrossed, Coffee, Scissors, Thermometer,
  Bath, Flower, TreePine, Hammer, Wrench, Archive, FolderOpen,
  Diamond, Book, Car, Stethoscope
} from 'lucide-react';
import { categoriesData, MainCategory, SubCategory } from '@/data/categoriesData';

interface CategoryListProps {
  onCategorySelect: (categoryId: string, subcategoryId?: string, subSubcategoryId?: string) => void;
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  selectedSubSubcategory?: string | null;
}

// Icon mappings for subcategories
const subcategoryIcons: { [key: string]: React.ReactNode } = {
  // Fashion & Apparel
  'womens-fashion': <Crown className="w-4 h-4 text-pink-500" />,
  'mens-fashion': <Shirt className="w-4 h-4 text-blue-500" />,
  'kids-fashion': <Baby className="w-4 h-4 text-purple-500" />,
  'footwear': <Footprints className="w-4 h-4 text-brown-500" />,
  'bags-luggage': <ShoppingBag className="w-4 h-4 text-indigo-500" />,
  
  // Electronics
  'mobile-tablets': <Smartphone className="w-4 h-4 text-blue-500" />,
  'computers': <Monitor className="w-4 h-4 text-gray-600" />,
  'audio-video': <Headphones className="w-4 h-4 text-purple-500" />,
  'gaming': <Gamepad2 className="w-4 h-4 text-red-500" />,
  'appliances': <Zap className="w-4 h-4 text-yellow-500" />,
  
  // Home & Garden
  'furniture': <Sofa className="w-4 h-4 text-brown-500" />,
  'home-decor': <Lamp className="w-4 h-4 text-orange-500" />,
  'kitchen-dining': <UtensilsCrossed className="w-4 h-4 text-red-500" />,
  'bedding-bath': <Bath className="w-4 h-4 text-blue-500" />,
  'garden-outdoor': <Flower className="w-4 h-4 text-green-500" />,
  'storage-organization': <Archive className="w-4 h-4 text-gray-500" />,

  // Health & Beauty
  'skincare': <Heart className="w-4 h-4 text-pink-500" />,
  'makeup': <Sparkles className="w-4 h-4 text-purple-500" />,
  'hair-care': <Scissors className="w-4 h-4 text-blue-500" />,
  'personal-care': <Users className="w-4 h-4 text-green-500" />,
  'health-wellness': <Stethoscope className="w-4 h-4 text-red-500" />,

  // Baby & Kids
  'baby-essentials': <Baby className="w-4 h-4 text-yellow-500" />,
  'toys-games': <Package className="w-4 h-4 text-purple-500" />,
  'kids-furniture': <Sofa className="w-4 h-4 text-blue-500" />,

  // Books & Education
  'academic-books': <Book className="w-4 h-4 text-blue-500" />,
  'general-books': <Book className="w-4 h-4 text-green-500" />,
  'stationery': <Printer className="w-4 h-4 text-gray-500" />,

  // Automobiles
  'cars-motorcycles': <Car className="w-4 h-4 text-red-500" />,
  'auto-parts': <Wrench className="w-4 h-4 text-gray-600" />,

  // Sports & Outdoor
  'sports-equipment': <Dumbbell className="w-4 h-4 text-blue-500" />,
  'fitness-gym': <Dumbbell className="w-4 h-4 text-green-500" />,
  'outdoor-activities': <TreePine className="w-4 h-4 text-green-600" />,

  // Food & Groceries
  'fresh-food': <Coffee className="w-4 h-4 text-green-500" />,
  'packaged-foods': <Package className="w-4 h-4 text-brown-500" />,

  // Jewelry
  'traditional-jewelry': <Diamond className="w-4 h-4 text-yellow-500" />,
  'fashion-jewelry': <Watch className="w-4 h-4 text-purple-500" />
};

export const CategoryList: React.FC<CategoryListProps> = ({
  onCategorySelect,
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([selectedCategory].filter(Boolean)));
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set([selectedSubcategory].filter(Boolean)));

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  return (
    <div className="space-y-2">
      {categoriesData.map((category) => (
        <div key={category.id} className="border-b border-gray-100 last:border-b-0">
          {/* Main Category */}
          <div
            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
              selectedCategory === category.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => {
              onCategorySelect(category.id);
              toggleCategory(category.id);
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                {category.icon}
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">{category.name}</div>
                <div className="text-xs text-gray-500">({category.count.toLocaleString()})</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {category.featured && (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              )}
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Subcategories */}
          {expandedCategories.has(category.id) && (
            <div className="ml-6 mt-2 space-y-1">
              {Object.entries(category.subcategories).map(([subcatId, subcategory]) => (
                <div key={subcatId}>
                  {/* Subcategory Header */}
                  <div
                    className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors ${
                      selectedSubcategory === subcatId ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      onCategorySelect(category.id, subcatId);
                      toggleSubcategory(subcatId);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {subcategoryIcons[subcatId] || <Star className="w-4 h-4 text-gray-400" />}
                      <div className="font-medium text-sm text-gray-700">{subcategory.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        ({subcategory.subcategories.reduce((sum, sub) => sum + sub.count, 0).toLocaleString()})
                      </span>
                      {expandedSubcategories.has(subcatId) ? (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Sub-subcategories */}
                  {expandedSubcategories.has(subcatId) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {subcategory.subcategories.map((subSubcat, index) => (
                        <div
                          key={index}
                          className={`p-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors ${
                            selectedSubSubcategory === subSubcat.name ? 'bg-blue-100' : ''
                          }`}
                          onClick={() => onCategorySelect(category.id, subcatId, subSubcat.name)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-3 h-3 text-gray-400" />
                              <div className="font-medium text-sm text-gray-600">{subSubcat.name}</div>
                            </div>
                            <span className="text-xs text-gray-400">({subSubcat.count.toLocaleString()})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
