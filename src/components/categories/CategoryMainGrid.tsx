
import React from 'react';

interface SubCategory {
  name: string;
  count: number;
  items?: string[];
}

interface CategoryData {
  name: string;
  subcategories: SubCategory[];
}

interface MainCategoryData {
  id: string;
  name: string;
  subcategories: {
    [key: string]: CategoryData;
  };
}

interface CategoryMainGridProps {
  categoryData: MainCategoryData;
  selectedCategory: string;
  onCategorySelect: (categoryId?: string, subcategoryId?: string, subSubcategoryId?: string) => void;
}

export const CategoryMainGrid: React.FC<CategoryMainGridProps> = ({
  categoryData,
  selectedCategory,
  onCategorySelect
}) => {
  const subcategories = Object.values(categoryData.subcategories) as CategoryData[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{categoryData.name}</h2>
        <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
          {subcategories.reduce((total, sub) => total + (sub.subcategories?.reduce((subTotal, subSub) => subTotal + subSub.count, 0) || 0), 0)} total products
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategories.map((sub: CategoryData, index) => (
          <div 
            key={sub.name}
            onClick={() => onCategorySelect(selectedCategory, Object.keys(categoryData.subcategories)[index])}
            className="border rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group bg-gradient-to-br from-white to-gray-50"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                {sub.name}
              </h3>
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                {sub.subcategories?.reduce((total: number, subSub: SubCategory) => total + subSub.count, 0) || 0}
              </div>
            </div>
            
            {sub.subcategories && sub.subcategories.length > 0 ? (
              <div className="space-y-2">
                {sub.subcategories.slice(0, 4).map((subSub: SubCategory) => (
                  <div key={subSub.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 group-hover:text-gray-700">{subSub.name}</span>
                    <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded">({subSub.count})</span>
                  </div>
                ))}
                {sub.subcategories.length > 4 && (
                  <div className="text-xs text-blue-600 font-medium">
                    +{sub.subcategories.length - 4} more categories
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No subcategories available</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
