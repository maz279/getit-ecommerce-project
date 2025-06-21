
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { categoriesData } from '@/data/categoriesData';

interface CategoryBreadcrumbProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedSubSubcategory?: string;
  onNavigate: (categoryId?: string, subcategoryId?: string, subSubcategoryId?: string) => void;
}

export const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  onNavigate
}) => {
  const category = categoriesData.find(cat => cat.id === selectedCategory);
  const subcategory = category?.subcategories[selectedSubcategory || ''];

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <button 
        onClick={() => onNavigate()}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <button 
        onClick={() => onNavigate()}
        className="hover:text-blue-600 transition-colors"
      >
        Categories
      </button>

      {category && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button 
            onClick={() => onNavigate(category.id)}
            className="hover:text-blue-600 transition-colors"
          >
            <span>{category.name}</span>
          </button>
        </>
      )}

      {subcategory && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button 
            onClick={() => onNavigate(selectedCategory, selectedSubcategory)}
            className="hover:text-blue-600 transition-colors"
          >
            <span>{subcategory.name}</span>
          </button>
        </>
      )}

      {selectedSubSubcategory && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-medium">{selectedSubSubcategory}</span>
        </>
      )}
    </nav>
  );
};
