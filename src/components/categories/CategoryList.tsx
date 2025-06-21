
import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Sparkles, Crown, Shirt, Users, Baby, Heart, 
  Zap, Star, ShoppingBag, Footprints, Package, Plus, Dumbbell, Watch,
  Monitor, Camera, Headphones, Gamepad2, Cpu, HardDrive, Keyboard,
  Mouse, Printer, Wifi, Speaker, Tv, Smartphone, Tablet, Home,
  Sofa, Bed, Lamp, UtensilsCrossed, Coffee, Scissors, Thermometer,
  Bath, Flower, TreePine, Hammer, Wrench, Archive, FolderOpen
} from 'lucide-react';
import { categoriesData, MainCategory, SubCategory } from '@/data/categoriesData';

interface CategoryListProps {
  onCategorySelect: (categoryId: string, subcategoryId?: string, subSubcategoryId?: string) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedSubSubcategory?: string;
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
  'storage-organization': <Archive className="w-4 h-4 text-gray-500" />
};

// Icon mappings for sub-subcategories
const subSubcategoryIcons: { [key: string]: React.ReactNode } = {
  // Women's Fashion
  'Traditional Wear': <Sparkles className="w-3 h-3 text-red-400" />,
  'Salwar Kameez': <Heart className="w-3 h-3 text-pink-400" />,
  'Kurti & Tops': <Star className="w-3 h-3 text-purple-400" />,
  'Western Wear': <Crown className="w-3 h-3 text-blue-400" />,
  'Islamic Wear': <Users className="w-3 h-3 text-green-400" />,
  'Innerwear & Sleepwear': <Baby className="w-3 h-3 text-orange-400" />,
  'Maternity Wear': <Heart className="w-3 h-3 text-teal-400" />,
  'Accessories': <Watch className="w-3 h-3 text-yellow-400" />,
  'Plus Size': <Plus className="w-3 h-3 text-red-400" />,
  
  // Men's Fashion
  'Ethnic & Fusion': <Sparkles className="w-3 h-3 text-indigo-400" />,
  'Activewear & Sports': <Dumbbell className="w-3 h-3 text-green-400" />,
  
  // Kids Fashion
  'Boys Clothing': <Shirt className="w-3 h-3 text-blue-400" />,
  'Girls Clothing': <Crown className="w-3 h-3 text-pink-400" />,
  'Baby Clothing': <Baby className="w-3 h-3 text-yellow-400" />,
  'Kids Footwear': <Footprints className="w-3 h-3 text-purple-400" />,
  
  // Footwear
  'Mens Footwear': <Footprints className="w-3 h-3 text-blue-400" />,
  'Womens Footwear': <Footprints className="w-3 h-3 text-pink-400" />,
  
  // Bags & Luggage
  'Handbags': <ShoppingBag className="w-3 h-3 text-pink-400" />,
  'Backpacks': <Package className="w-3 h-3 text-blue-400" />,
  'Luggage': <Package className="w-3 h-3 text-gray-400" />,
  'Wallets & Accessories': <Watch className="w-3 h-3 text-brown-400" />,
  
  // Electronics - Mobile & Tablets
  'Smartphones': <Smartphone className="w-3 h-3 text-blue-400" />,
  'Tablets': <Tablet className="w-3 h-3 text-purple-400" />,
  'Mobile Accessories': <Package className="w-3 h-3 text-green-400" />,
  'Smartwatches & Wearables': <Watch className="w-3 h-3 text-red-400" />,
  
  // Electronics - Computers
  'Laptops': <Monitor className="w-3 h-3 text-gray-400" />,
  'Desktop Computers': <Cpu className="w-3 h-3 text-blue-400" />,
  'Computer Components': <HardDrive className="w-3 h-3 text-red-400" />,
  'Computer Accessories': <Keyboard className="w-3 h-3 text-green-400" />,
  
  // Electronics - Audio & Video
  'Headphones & Earphones': <Headphones className="w-3 h-3 text-purple-400" />,
  'Speakers & Sound Systems': <Speaker className="w-3 h-3 text-blue-400" />,
  'Cameras & Photography': <Camera className="w-3 h-3 text-green-400" />,
  'TVs & Displays': <Tv className="w-3 h-3 text-red-400" />,
  
  // Electronics - Gaming
  'Gaming Consoles': <Gamepad2 className="w-3 h-3 text-red-400" />,
  'Gaming Accessories': <Mouse className="w-3 h-3 text-blue-400" />,
  'PC Gaming': <Monitor className="w-3 h-3 text-green-400" />,
  
  // Electronics - Appliances
  'Kitchen Appliances': <Coffee className="w-3 h-3 text-brown-400" />,
  'Cleaning Appliances': <Zap className="w-3 h-3 text-blue-400" />,
  'Personal Care Appliances': <Scissors className="w-3 h-3 text-pink-400" />,
  
  // Home & Garden - Furniture
  'Living Room Furniture': <Sofa className="w-3 h-3 text-brown-400" />,
  'Bedroom Furniture': <Bed className="w-3 h-3 text-blue-400" />,
  'Dining Room Furniture': <UtensilsCrossed className="w-3 h-3 text-red-400" />,
  'Office Furniture': <Monitor className="w-3 h-3 text-gray-400" />,
  'Outdoor Furniture': <TreePine className="w-3 h-3 text-green-400" />,
  
  // Home & Garden - Home Decor
  'Wall Decor': <Star className="w-3 h-3 text-yellow-400" />,
  'Decorative Accessories': <Heart className="w-3 h-3 text-pink-400" />,
  'Lighting': <Lamp className="w-3 h-3 text-orange-400" />,
  'Window Treatments': <Home className="w-3 h-3 text-blue-400" />,
  
  // Home & Garden - Kitchen & Dining
  'Cookware': <UtensilsCrossed className="w-3 h-3 text-red-400" />,
  'Kitchen Tools & Gadgets': <Scissors className="w-3 h-3 text-blue-400" />,
  'Dinnerware': <Coffee className="w-3 h-3 text-brown-400" />,
  'Food Storage': <Package className="w-3 h-3 text-green-400" />,
  
  // Home & Garden - Bedding & Bath
  'Bedding': <Bed className="w-3 h-3 text-blue-400" />,
  'Bath Towels & Linens': <Bath className="w-3 h-3 text-teal-400" />,
  'Bathroom Accessories': <Thermometer className="w-3 h-3 text-purple-400" />,
  
  // Home & Garden - Garden & Outdoor
  'Gardening Tools': <Hammer className="w-3 h-3 text-brown-400" />,
  'Plants & Seeds': <Flower className="w-3 h-3 text-green-400" />,
  'Planters & Pots': <TreePine className="w-3 h-3 text-orange-400" />,
  'Outdoor Decor': <Star className="w-3 h-3 text-yellow-400" />,
  
  // Home & Garden - Storage & Organization
  'Closet Organization': <Archive className="w-3 h-3 text-gray-400" />,
  'Storage Furniture': <Package className="w-3 h-3 text-blue-400" />,
  'Garage & Utility': <Wrench className="w-3 h-3 text-red-400" />
};

export const CategoryList: React.FC<CategoryListProps> = ({
  onCategorySelect,
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
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
                <div className={category.color}>
                  {category.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{category.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">({category.count})</span>
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
                          ({subcategory.subcategories.reduce((sum, sub) => sum + sub.count, 0)})
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
                                {subSubcategoryIcons[subSubcat.name] || <Sparkles className="w-3 h-3 text-gray-400" />}
                                <div className="font-medium text-sm text-gray-600">{subSubcat.name}</div>
                              </div>
                              <span className="text-xs text-gray-400">({subSubcat.count})</span>
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
    </div>
  );
};
