
export interface SubCategory {
  name: string;
  items: string[];
  count: number;
}

export interface MainCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  featured: boolean;
  subcategories: {
    [key: string]: {
      name: string;
      subcategories: SubCategory[];
    };
  };
}

import { fashionData } from './categories/fashionData';
import { electronicsData } from './categories/electronicsData';
import { homeGardenData } from './categories/homeGardenData';
import { healthBeautyData } from './categories/healthBeautyData';
import { foodGroceriesData } from './categories/foodGroceriesData';
import { booksEducationData } from './categories/booksEducationData';
import { sportsOutdoorData } from './categories/sportsOutdoorData';
import { automobilesData } from './categories/automobilesData';
import { babyKidsData } from './categories/babyKidsData';

export const categoriesData: MainCategory[] = [
  fashionData,
  electronicsData,
  homeGardenData,
  healthBeautyData,
  foodGroceriesData,
  booksEducationData,
  sportsOutdoorData,
  automobilesData,
  babyKidsData
];
