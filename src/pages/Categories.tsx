
import React from 'react';
import { CategoryDataProvider } from '../components/categories/CategoryDataProvider';
import { CategoryPageLayout } from '../components/categories/CategoryPageLayout';
import { ProductInfo } from '../components/categories/CategoryPageTypes';

// Sample product data for demonstration
const sampleProducts: ProductInfo[] = [
  {
    id: '1',
    name: 'Cotton Saree - Traditional Design',
    price: 2500,
    originalPrice: 3000,
    rating: 4.5,
    reviews: 156,
    vendor: { id: '1', name: 'Fashion House BD', rating: 4.8, location: 'Dhaka', products: 250, verified: true },
    image: '/placeholder.svg',
    discount: 17,
    freeShipping: true
  },
  {
    id: '2',
    name: 'Embroidered Salwar Kameez',
    price: 1800,
    rating: 4.2,
    reviews: 89,
    vendor: { id: '2', name: 'Ethnic Wear', rating: 4.6, location: 'Chittagong', products: 180, verified: true },
    image: '/placeholder.svg',
    freeShipping: false
  }
];

const Categories: React.FC = () => {
  return (
    <CategoryDataProvider sampleProducts={sampleProducts}>
      <CategoryPageLayout />
    </CategoryDataProvider>
  );
};

export default Categories;
