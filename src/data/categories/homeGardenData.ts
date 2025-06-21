
import React from 'react';
import { Home } from 'lucide-react';
import { MainCategory } from '../categoriesData';
import { furnitureData } from './homeGarden/furnitureData';
import { homeDecorData } from './homeGarden/homeDecorData';
import { kitchenDiningData } from './homeGarden/kitchenDiningData';
import { beddingBathData } from './homeGarden/beddingBathData';
import { cleaningLaundryData } from './homeGarden/cleaningLaundryData';
import { gardenOutdoorData } from './homeGarden/gardenOutdoorData';
import { storageOrganizationData } from './homeGarden/storageOrganizationData';

export const homeGardenData: MainCategory = {
  id: 'home-garden',
  name: 'Home & Garden',
  icon: React.createElement(Home, { className: "w-8 h-8" }),
  color: 'text-green-500',
  count: 8456,
  featured: true,
  subcategories: {
    'furniture': furnitureData,
    'home-decor': homeDecorData,
    'kitchen-dining': kitchenDiningData,
    'bedding-bath': beddingBathData,
    'cleaning-laundry': cleaningLaundryData,
    'garden-outdoor': gardenOutdoorData,
    'storage-organization': storageOrganizationData
  }
};
