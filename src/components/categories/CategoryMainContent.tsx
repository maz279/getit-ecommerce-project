import React from 'react';
import { CategoryBreadcrumb } from './CategoryBreadcrumb';
import { ProductGrid } from './ProductGrid';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoriesData, MainCategory } from '@/data/categoriesData';

interface SubmenuItem {
  name: string;
  subcategories: Array<{
    name: string;
    count: number;
  }>;
}

interface CategoryMainContentProps {
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  selectedSubSubcategory?: string | null;
  currentCategory?: MainCategory | null;
  currentSubmenu?: SubmenuItem | null;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

const getSubcategoryDetails = (subcategoryName: string) => {
  const details: { [key: string]: any } = {
    'Cotton Saree': {
      title: 'Cotton Sarees',
      description: 'Comfortable and breathable cotton sarees perfect for daily wear and casual occasions.',
      features: ['100% Pure Cotton', 'Machine Washable', 'Lightweight', 'Breathable Fabric'],
      occasions: ['Daily Wear', 'Office', 'Casual Events', 'Summer Festivals'],
      priceRange: '৳800 - ৳3,500',
      popular: ['Block Print Cotton Saree', 'Handloom Cotton Saree', 'Khadi Cotton Saree']
    },
    'Silk Saree': {
      title: 'Silk Sarees',
      description: 'Luxurious silk sarees that add elegance and grace to any special occasion.',
      features: ['Premium Silk Fabric', 'Rich Texture', 'Traditional Weaving', 'Elegant Drape'],
      occasions: ['Weddings', 'Festivals', 'Party', 'Special Events'],
      priceRange: '৳2,500 - ৳15,000',
      popular: ['Banarasi Silk Saree', 'Katan Silk Saree', 'Pure Silk Saree']
    },
    'Jamdani Saree': {
      title: 'Jamdani Sarees',
      description: 'Traditional Bengali handwoven sarees with intricate patterns and cultural heritage.',
      features: ['Handwoven', 'Traditional Patterns', 'Cultural Heritage', 'Unique Designs'],
      occasions: ['Pohela Boishakh', 'Cultural Events', 'Traditional Ceremonies', 'Special Occasions'],
      priceRange: '৳3,000 - ৳25,000',
      popular: ['Dhakai Jamdani', 'Tangail Jamdani', 'Modern Jamdani']
    },
    'Cotton Salwar Kameez': {
      title: 'Cotton Salwar Kameez',
      description: 'Comfortable cotton salwar kameez sets perfect for everyday wear and office.',
      features: ['Soft Cotton Fabric', 'Comfortable Fit', 'Easy Care', 'Versatile Styling'],
      occasions: ['Daily Wear', 'Office', 'College', 'Casual Outings'],
      priceRange: '৳1,200 - ৳4,000',
      popular: ['Straight Cut Cotton Suits', 'Printed Cotton Sets', 'Embroidered Cotton Suits']
    },
    'Anarkali Suits': {
      title: 'Anarkali Suits',
      description: 'Flowy and elegant Anarkali suits that create a graceful silhouette.',
      features: ['Flowy Design', 'Elegant Silhouette', 'Comfortable Fit', 'Traditional Style'],
      occasions: ['Parties', 'Weddings', 'Festivals', 'Special Events'],
      priceRange: '৳2,000 - ৳8,000',
      popular: ['Long Anarkali', 'Short Anarkali', 'Designer Anarkali']
    },
    'Cotton Kurtis': {
      title: 'Cotton Kurtis',
      description: 'Stylish and comfortable cotton kurtis perfect for modern women.',
      features: ['Breathable Cotton', 'Modern Designs', 'Easy to Wear', 'Versatile Pairing'],
      occasions: ['Casual Wear', 'Office', 'College', 'Shopping'],
      priceRange: '৳600 - ৳2,500',
      popular: ['A-line Kurtis', 'Straight Kurtis', 'High-Low Kurtis']
    }
  };

  return details[subcategoryName] || {
    title: subcategoryName,
    description: `Premium ${subcategoryName.toLowerCase()} collection with various styles and designs.`,
    features: ['High Quality', 'Latest Designs', 'Comfortable Fit', 'Great Value'],
    occasions: ['Various Occasions', 'Daily Wear', 'Special Events'],
    priceRange: '৳500 - ৳5,000',
    popular: [`Designer ${subcategoryName}`, `Traditional ${subcategoryName}`, `Modern ${subcategoryName}`]
  };
};

export const CategoryMainContent: React.FC<CategoryMainContentProps> = ({
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  currentCategory,
  currentSubmenu,
  activeTab,
  onActiveTabChange
}) => {
  if (!selectedCategory) {
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

        {/* Featured Categories */}
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
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <CategoryBreadcrumb
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedSubSubcategory={selectedSubSubcategory}
        currentCategory={currentCategory}
        currentSubmenu={currentSubmenu}
      />

      {/* Main Content with Sidebar */}
      <div className="flex gap-6">
        {/* Left Side - Product Grid */}
        <div className="flex-1">
          <Card className="shadow-sm rounded-lg overflow-hidden">
            <ProductGrid
              category={selectedCategory}
              submenu={selectedSubcategory}
              tab={selectedSubSubcategory}
              activeTab={activeTab}
            />
          </Card>
        </div>

        {/* Right Side - Subcategory Details */}
        {selectedSubSubcategory && (
          <div className="w-80 flex-shrink-0">
            <Card className="p-6 sticky top-6">
              {(() => {
                const details = getSubcategoryDetails(selectedSubSubcategory);
                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {details.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {details.description}
                      </p>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Price Range</h4>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {details.priceRange}
                      </Badge>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Key Features</h4>
                      <div className="space-y-2">
                        {details.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Perfect For */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Perfect For</h4>
                      <div className="flex flex-wrap gap-2">
                        {details.occasions.map((occasion: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {occasion}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Popular Items */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Popular Items</h4>
                      <div className="space-y-2">
                        {details.popular.map((item: string, index: number) => (
                          <div key={index} className="p-2 bg-gray-50 rounded-md">
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Shopping Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Check size chart before ordering</li>
                        <li>• Read customer reviews</li>
                        <li>• Compare prices from different vendors</li>
                        <li>• Look for free shipping offers</li>
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
