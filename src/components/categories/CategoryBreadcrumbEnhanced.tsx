
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { categoriesData } from '@/data/categoriesData';

interface CategoryBreadcrumbEnhancedProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedSubSubcategory?: string;
  onNavigate: (categoryId?: string, subcategoryId?: string, subSubcategoryId?: string) => void;
}

export const CategoryBreadcrumbEnhanced: React.FC<CategoryBreadcrumbEnhancedProps> = ({
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  onNavigate
}) => {
  const category = selectedCategory ? categoriesData.find(cat => cat.id === selectedCategory) : null;
  const subcategory = category && selectedSubcategory ? category.subcategories[selectedSubcategory] : null;

  return (
    <div className="bg-white rounded-lg shadow-sm px-6 py-4 mb-6">
      <nav className="flex items-center space-x-2 text-sm">
        <button 
          onClick={() => onNavigate()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Home className="w-4 h-4 mr-1" />
          Home
        </button>
        
        <ChevronRight className="w-4 h-4 text-gray-400" />
        
        <button 
          onClick={() => onNavigate()}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          All Categories
        </button>

        {category && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button 
              onClick={() => onNavigate(category.id)}
              className={`transition-colors ${selectedSubcategory ? 'text-blue-600 hover:text-blue-800' : 'text-gray-800 font-medium'}`}
            >
              {category.name}
            </button>
          </>
        )}

        {subcategory && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button 
              onClick={() => onNavigate(selectedCategory, selectedSubcategory)}
              className={`transition-colors ${selectedSubSubcategory ? 'text-blue-600 hover:text-blue-800' : 'text-gray-800 font-medium'}`}
            >
              {subcategory.name}
            </button>
          </>
        )}

        {selectedSubSubcategory && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-medium">{selectedSubSubcategory}</span>
          </>
        )}
      </nav>
    </div>
  );
};
