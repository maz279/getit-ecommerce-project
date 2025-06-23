
import { womensFashionHierarchical } from '@/data/categories/fashion/womensFashionHierarchical';

export const useHierarchicalData = (selectedCategory?: string | null, selectedSubcategory?: string | null) => {
  const getHierarchicalData = () => {
    if (selectedCategory === 'fashion' && selectedSubcategory === 'womens-fashion') {
      return womensFashionHierarchical;
    }
    return null;
  };

  return { getHierarchicalData };
};

export const useSubcategoryValidation = (hierarchicalData: any, actualSubSubcategory?: string | null) => {
  const shouldShowSubcategoryDetails = () => {
    if (!hierarchicalData || !actualSubSubcategory) return false;

    // Check if the actualSubSubcategory exists in any of the hierarchical categories
    for (const mainCat of Object.values(hierarchicalData.subcategories)) {
      for (const subCat of Object.values(mainCat.subcategories)) {
        for (const subSubCat of Object.values(subCat.subcategories)) {
          const hasItem = subSubCat.items.some(item => item.name === actualSubSubcategory);
          if (hasItem) return true;
        }
      }
    }
    return false;
  };

  return { shouldShowSubcategoryDetails };
};
