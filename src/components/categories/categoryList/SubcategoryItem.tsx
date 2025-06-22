
import React from 'react';
import { ChevronDown, ChevronRight, Star, Sparkles } from 'lucide-react';
import { SubCategory } from '@/data/categoriesData';
import { subcategoryIcons } from './subcategoryIcons';
import { womensFashionHierarchical } from '@/data/categories/fashion/womensFashionHierarchical';

interface SubcategoryItemProps {
  subcategoryId: string;
  subcategory: SubCategory;
  categoryId: string;
  onCategorySelect: (categoryId: string, subcategoryId?: string, subSubcategoryId?: string) => void;
  selectedSubcategory?: string | null;
  selectedSubSubcategory?: string | null;
  isExpanded: boolean;
  onToggleSubcategory: (subcategoryId: string) => void;
}

export const SubcategoryItem: React.FC<SubcategoryItemProps> = ({
  subcategoryId,
  subcategory,
  categoryId,
  onCategorySelect,
  selectedSubcategory,
  selectedSubSubcategory,
  isExpanded,
  onToggleSubcategory
}) => {
  const handleSubcategoryClick = () => {
    onCategorySelect(categoryId, subcategoryId);
    onToggleSubcategory(subcategoryId);
  };

  // Get hierarchical data for women's fashion
  const getHierarchicalSubcategories = () => {
    if (categoryId === 'fashion' && subcategoryId === 'womens-fashion') {
      return womensFashionHierarchical.subcategories;
    }
    return null;
  };

  const hierarchicalData = getHierarchicalSubcategories();

  return (
    <div>
      {/* Subcategory Header */}
      <div
        className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors ${
          selectedSubcategory === subcategoryId ? 'bg-blue-50' : ''
        }`}
        onClick={handleSubcategoryClick}
      >
        <div className="flex items-center gap-2">
          {subcategoryIcons[subcategoryId] || <Star className="w-4 h-4 text-gray-400" />}
          <div className="font-medium text-sm text-gray-700">{subcategory.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            ({subcategory.subcategories.reduce((sum, sub) => sum + sub.count, 0).toLocaleString()})
          </span>
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          )}
        </div>
      </div>

      {/* Hierarchical subcategories for women's fashion */}
      {isExpanded && hierarchicalData && (
        <div className="ml-4 mt-1 space-y-1">
          {Object.entries(hierarchicalData).map(([mainCatKey, mainCategory]) => (
            <div key={mainCatKey} className="space-y-1">
              {/* Main Category Header */}
              <div className="p-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <div className="font-medium text-sm text-gray-700">{mainCategory.name}</div>
                </div>
              </div>
              
              {/* Sub Categories */}
              <div className="ml-4 space-y-1">
                {Object.entries(mainCategory.subcategories).map(([subCatKey, subCategory]) => (
                  <div key={subCatKey} className="space-y-1">
                    {/* Sub Category Header */}
                    <div className="p-1 bg-gray-25 rounded-sm">
                      <div className="font-medium text-xs text-gray-600">{subCategory.name}</div>
                    </div>
                    
                    {/* Sub-Sub Categories and Items */}
                    <div className="ml-3 space-y-1">
                      {Object.entries(subCategory.subcategories).map(([subSubCatKey, subSubCategory]) => (
                        <div key={subSubCatKey} className="space-y-1">
                          {/* Sub-Sub Category Header */}
                          <div className="p-1">
                            <div className="font-medium text-xs text-gray-600">{subSubCategory.name}</div>
                          </div>
                          
                          {/* Items */}
                          <div className="ml-2 space-y-0.5">
                            {subSubCategory.items.map((item, index) => (
                              <div
                                key={index}
                                className={`p-1 cursor-pointer hover:bg-blue-50 rounded-sm transition-colors text-xs ${
                                  selectedSubSubcategory === item.name ? 'bg-blue-100 font-medium' : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCategorySelect(categoryId, subcategoryId, item.name);
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">{item.name}</span>
                                  <span className="text-gray-400">({item.count.toLocaleString()})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fallback for non-hierarchical subcategories */}
      {isExpanded && !hierarchicalData && (
        <div className="ml-4 mt-1 space-y-1">
          {subcategory.subcategories.map((subSubcat, index) => (
            <div
              key={index}
              className={`p-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors ${
                selectedSubSubcategory === subSubcat.name ? 'bg-blue-100' : ''
              }`}
              onClick={() => onCategorySelect(categoryId, subcategoryId, subSubcat.name)}
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
  );
};
