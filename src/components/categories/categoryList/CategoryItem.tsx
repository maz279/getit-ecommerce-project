
import React from 'react';
import { ChevronDown, ChevronRight, Star } from 'lucide-react';
import { MainCategory } from '@/data/categoriesData';
import { SubcategoryList } from './SubcategoryList';

interface CategoryItemProps {
  category: MainCategory;
  isExpanded: boolean;
  isSelected: boolean;
  onCategoryClick: (categoryId: string) => void;
  onToggleExpand: (categoryId: string) => void;
  onCategorySelect: (categoryId: string, subcategoryId?: string, subSubcategoryId?: string) => void;
  selectedSubcategory?: string | null;
  selectedSubSubcategory?: string | null;
  expandedSubcategories: Set<string>;
  onToggleSubcategory: (subcategoryId: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isExpanded,
  isSelected,
  onCategoryClick,
  onToggleExpand,
  onCategorySelect,
  selectedSubcategory,
  selectedSubSubcategory,
  expandedSubcategories,
  onToggleSubcategory
}) => {
  const handleCategoryClick = () => {
    onCategoryClick(category.id);
    onToggleExpand(category.id);
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Main Category */}
      <div
        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
          isSelected ? 'bg-blue-50 border-blue-200' : ''
        }`}
        onClick={handleCategoryClick}
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
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Subcategories */}
      {isExpanded && (
        <div className="ml-6 mt-2 space-y-1">
          <SubcategoryList
            category={category}
            onCategorySelect={onCategorySelect}
            selectedSubcategory={selectedSubcategory}
            selectedSubSubcategory={selectedSubSubcategory}
            expandedSubcategories={expandedSubcategories}
            onToggleSubcategory={onToggleSubcategory}
          />
        </div>
      )}
    </div>
  );
};
