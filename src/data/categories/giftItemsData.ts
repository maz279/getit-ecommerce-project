
import { MainCategory } from '../categoriesData';
import { createElement } from 'react';
import { Gift } from 'lucide-react';
import { giftCollectionsData } from './giftItems/giftCollectionsData';
import { corporateGiftsData } from './giftItems/corporateGiftsData';

export const giftItemsData: MainCategory = {
  id: 'gift-items-novelties',
  name: 'Gift Items & Novelties',
  icon: createElement(Gift, { className: 'w-6 h-6' }),
  color: 'text-pink-500',
  count: 3456,
  featured: true,
  subcategories: {
    'gift-collections': giftCollectionsData,
    'corporate-gifts': corporateGiftsData
  }
};
