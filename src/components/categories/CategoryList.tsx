
import React, { useState } from 'react';
import { categoriesData } from '@/data/categoriesData';
import { CategoryItem } from './categoryList/CategoryItem';
import { CategoryListProps } from './categoryList/types';

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

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
  };

  return (
    <div className="space-y-2">
      {categoriesData.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isExpanded={expandedCategories.has(category.id)}
          isSelected={selectedCategory === category.id}
          onCategoryClick={handleCategoryClick}
          onToggleExpand={toggleCategory}
          onCategorySelect={onCategorySelect}
          selectedSubcategory={selectedSubcategory}
          selectedSubSubcategory={selectedSubSubcategory}
          expandedSubcategories={expandedSubcategories}
          onToggleSubcategory={toggleSubcategory}
        />
      ))}
    </div>
  );
};
