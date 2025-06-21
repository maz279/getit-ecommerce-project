
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, Laptop, Home, Gamepad2, 
  Shirt, ShoppingBag, Baby, Crown,
  Sofa, ChefHat, Bed, TreePine,
  Heart, Sparkles, Pill, Dumbbell,
  ChevronRight, Star
} from 'lucide-react';

interface SubCategory {
  name: string;
  icon: React.ReactNode;
  featured?: string[];
}

interface Category {
  name: string;
  color: string;
  bgGradient: string;
  subCategories: SubCategory[];
}

const categories: Category[] = [
  {
    name: "Electronics & Technology",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
    subCategories: [
      { 
        name: "Smartphones & Accessories", 
        icon: <Smartphone className="w-6 h-6" />,
        featured: ["Samsung Galaxy", "iPhone", "OnePlus"]
      },
      { 
        name: "Laptops & Computers", 
        icon: <Laptop className="w-6 h-6" />
      },
      { 
        name: "Home Appliances", 
        icon: <Home className="w-6 h-6" />
      },
      { 
        name: "Gaming & Entertainment", 
        icon: <Gamepad2 className="w-6 h-6" />
      }
    ]
  },
  {
    name: "Fashion & Lifestyle",
    color: "text-pink-600",
    bgGradient: "from-pink-50 to-pink-100",
    subCategories: [
      { 
        name: "Men's Fashion", 
        icon: <Shirt className="w-6 h-6" />
      },
      { 
        name: "Women's Fashion", 
        icon: <Crown className="w-6 h-6" />
      },
      { 
        name: "Kids & Baby", 
        icon: <Baby className="w-6 h-6" />
      },
      { 
        name: "Shoes & Bags", 
        icon: <ShoppingBag className="w-6 h-6" />,
        featured: ["Traditional Wear", "Western Wear"]
      }
    ]
  },
  {
    name: "Home & Garden",
    color: "text-green-600",
    bgGradient: "from-green-50 to-green-100",
    subCategories: [
      { 
        name: "Furniture & Decor", 
        icon: <Sofa className="w-6 h-6" />,
        featured: ["Dining Sets", "Sofas"]
      },
      { 
        name: "Kitchen & Dining", 
        icon: <ChefHat className="w-6 h-6" />,
        featured: ["Kitchen Appliances"]
      },
      { 
        name: "Bed & Bath", 
        icon: <Bed className="w-6 h-6" />
      },
      { 
        name: "Garden & Outdoor", 
        icon: <TreePine className="w-6 h-6" />
      }
    ]
  },
  {
    name: "Health & Beauty",
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    subCategories: [
      { 
        name: "Personal Care", 
        icon: <Heart className="w-6 h-6" />
      },
      { 
        name: "Makeup & Cosmetics", 
        icon: <Sparkles className="w-6 h-6" />,
        featured: ["Skincare", "Haircare"]
      },
      { 
        name: "Health Supplements", 
        icon: <Pill className="w-6 h-6" />
      },
      { 
        name: "Fitness Equipment", 
        icon: <Dumbbell className="w-6 h-6" />,
        featured: ["Wellness"]
      }
    ]
  }
];

export const CategoryHighlights: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/categories?category=${slug}`);
  };

  const handleSubCategoryClick = (subCategoryName: string) => {
    const slug = subCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/products?subcategory=${slug}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Category Highlights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular categories and explore thousands of products across different segments
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className={`bg-gradient-to-br ${category.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {/* Category Header */}
              <div 
                className="flex items-center justify-between mb-6 cursor-pointer group"
                onClick={() => handleCategoryClick(category.name)}
              >
                <h3 className={`text-2xl font-bold ${category.color} group-hover:text-opacity-80 transition-colors`}>
                  {category.name}
                </h3>
                <ChevronRight className={`w-6 h-6 ${category.color} group-hover:translate-x-1 transition-transform`} />
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-2 gap-4">
                {category.subCategories.map((subCategory, subIndex) => (
                  <div 
                    key={subIndex}
                    onClick={() => handleSubCategoryClick(subCategory.name)}
                    className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-90 transition-all cursor-pointer group"
                  >
                    {/* Subcategory Icon and Name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${category.color} group-hover:scale-110 transition-transform`}>
                        {subCategory.icon}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm group-hover:text-gray-900">
                        {subCategory.name}
                      </span>
                    </div>

                    {/* Featured Items */}
                    {subCategory.featured && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs font-medium text-gray-600">Featured:</span>
                        </div>
                        {subCategory.featured.map((item, itemIndex) => (
                          <div 
                            key={itemIndex}
                            className="text-xs text-gray-600 bg-white bg-opacity-50 rounded-md px-2 py-1 inline-block mr-1 mb-1"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <button 
                onClick={() => handleCategoryClick(category.name)}
                className={`w-full mt-4 py-3 px-4 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-xl ${category.color} font-semibold hover:bg-opacity-30 transition-all`}
              >
                View All in {category.name}
              </button>
            </div>
          ))}
        </div>

        {/* Quick Access Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Electronics</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">35K+</div>
            <div className="text-gray-600">Fashion Items</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">25K+</div>
            <div className="text-gray-600">Home Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15K+</div>
            <div className="text-gray-600">Beauty Items</div>
          </div>
        </div>
      </div>
    </section>
  );
};
