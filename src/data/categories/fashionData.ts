
import React from 'react';
import { Shirt } from 'lucide-react';
import { MainCategory } from '../categoriesData';
import { womensFashionData } from './fashion/womensFashionData';
import { mensFashionData } from './fashion/mensFashionData';
import { kidsFashionData } from './fashion/kidsFashionData';
import { footwearData } from './fashion/footwearData';
import { bagsAccessoriesData } from './fashion/bagsAccessoriesData';

export const fashionData: MainCategory = {
  id: 'fashion',
  name: 'Fashion & Apparel',
  icon: React.createElement(Shirt, { className: "w-8 h-8" }),
  color: 'text-red-500',
  count: 15847,
  featured: true,
  subcategories: {
    'womens-fashion': womensFashionData,
    'mens-fashion': mensFashionData,
    'kids-fashion': kidsFashionData,
    'footwear': footwearData,
    'bags-luggage': bagsAccessoriesData
  }
};
