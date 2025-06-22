
export interface CategoryListProps {
  onCategorySelect: (categoryId: string, subcategoryId?: string, subSubcategoryId?: string) => void;
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  selectedSubSubcategory?: string | null;
}
