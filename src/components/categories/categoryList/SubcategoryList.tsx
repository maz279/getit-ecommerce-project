
import React from 'react';
import { MainCategory } from '@/data/categoriesData';
import { SubcategoryItem } from './SubcategoryItem';

interface SubcategoryListProps {
  category: MainCategory;
  onCategorySelect: (categoryId: string, subcategoryId?: string, subSubcategoryId?: string) => void;
  selectedSubcategory?: string | null;
  selectedSubSubcategory?: string | null;
  expandedSubcategories: Set<string>;
  onToggleSubcategory: (subcategoryId: string) => void;
}

export const SubcategoryList: React.FC<SubcategoryListProps> = ({
  category,
  onCategorySelect,
  selectedSubcategory,
  selectedSubSubcategory,
  expandedSubcategories,
  onToggleSubcategory
}) => {
  return (
    <>
      {Object.entries(category.subcategories).map(([subcatId, subcategory]) => (
        <SubcategoryItem
          key={subcatId}
          subcategoryId={subcatId}
          subcategory={subcategory}
          categoryId={category.id}
          onCategorySelect={onCategorySelect}
          selectedSubcategory={selectedSubcategory}
          selectedSubSubcategory={selectedSubSubcategory}
          isExpanded={expandedSubcategories.has(subcatId)}
          onToggleSubcategory={onToggleSubcategory}
        />
      ))}
    </>
  );
};
