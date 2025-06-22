
import React from 'react';
import { ProductList } from './ProductList';

interface VendorInfo {
  id: string;
  name: string;
  rating: number;
  location: string;
  products: number;
  verified: boolean;
}

interface ProductInfo {
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

interface CategoryProductsSectionProps {
  products: ProductInfo[];
  viewMode: 'grid' | 'list';
  title?: string;
}

export const CategoryProductsSection: React.FC<CategoryProductsSectionProps> = ({
  products,
  viewMode,
  title = "All Products"
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">{products.length} items</span>
      </div>
      <ProductList products={products} viewMode={viewMode} gridSize="small" />
    </div>
  );
};
