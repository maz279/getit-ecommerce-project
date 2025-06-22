
import React from 'react';

interface SubCategory {
  name: string;
  count: number;
  items?: string[];
}

interface CategorySubcategoryGridProps {
  subSubcategories: SubCategory[];
  selectedCategory: string;
  selectedSubcategory: string;
  onCategorySelect: (categoryId?: string, subcategoryId?: string, subSubcategoryId?: string) => void;
}

export const CategorySubcategoryGrid: React.FC<CategorySubcategoryGridProps> = ({
  subSubcategories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect
}) => {
  if (subSubcategories.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Browse by Subcategory</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subSubcategories.map((subSub: SubCategory) => (
          <div 
            key={subSub.name}
            onClick={() => onCategorySelect(selectedCategory, selectedSubcategory, subSub.name)}
            className="border rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
              {subSub.name}
            </h4>
            <p className="text-sm text-gray-500">{subSub.count} products</p>
          </div>
        ))}
      </div>
    </div>
  );
};
