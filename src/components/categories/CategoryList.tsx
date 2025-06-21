
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { categoriesData, MainCategory, SubCategory } from '@/data/categoriesData';

interface CategoryListProps {
  onCategorySelect: (categoryId: string, subcategoryId?: string, subSubcategoryId?: string) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  onCategorySelect,
  selectedCategory,
  selectedSubcategory
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
                      <div>
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
                            className="p-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => onCategorySelect(category.id, subcatId, subSubcat.name)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm text-gray-600">{subSubcat.name}</div>
                              </div>
                              <span className="text-xs text-gray-400">({subSubcat.count})</span>
                            </div>
                            {/* Items preview */}
                            <div className="mt-1 text-xs text-gray-400">
                              {subSubcat.items.slice(0, 3).join(', ')}
                              {subSubcat.items.length > 3 && '...'}
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
