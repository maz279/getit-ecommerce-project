
export interface VendorInfo {
  id: string;
  name: string;
  rating: number;
  location: string;
  products: number;
  verified: boolean;
}

export interface ProductInfo {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  vendor: VendorInfo;
  image: string;
  discount?: number;
  freeShipping: boolean;
}

export interface CategoryPageState {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedSubSubcategory?: string;
  viewMode: 'grid' | 'list';
  sortBy: string;
  showFilters: boolean;
}

export interface CategoryPageActions {
  handleCategorySelect: (categoryId?: string, subcategoryId?: string, subSubcategoryId?: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: string) => void;
  setShowFilters: (show: boolean) => void;
}
