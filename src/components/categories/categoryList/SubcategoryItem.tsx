
import React from 'react';
import { ChevronDown, ChevronRight, Star, Sparkles } from 'lucide-react';
import { SubCategory } from '@/data/categoriesData';
import { subcategoryIcons } from './subcategoryIcons';

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

      {/* Sub-subcategories */}
      {isExpanded && (
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
