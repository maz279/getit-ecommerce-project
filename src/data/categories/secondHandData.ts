
import { MainCategory } from '../categoriesData';
import { createElement } from 'react';
import { Second-hand } from 'lucide-react';
import { usedProductsData } from './secondHand/usedProductsData';

export const secondHandData: MainCategory = {
  id: 'second-hand-refurbished',
  name: 'Second-hand & Refurbished',
  icon: createElement(Second-hand, { className: 'w-6 h-6' }),
  color: 'text-amber-600',
  count: 1987,
  featured: false,
  subcategories: {
    'used-products': usedProductsData
  }
};
