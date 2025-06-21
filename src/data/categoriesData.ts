
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
import { handicraftsData } from './categories/handicraftsData';
import { toysHobbiesData } from './categories/toysHobbiesData';
import { jewelryData } from './categories/jewelryData';
import { musicalInstrumentsData } from './categories/musicalInstrumentsData';
import { digitalProductsData } from './categories/digitalProductsData';
import { seasonalFestivalData } from './categories/seasonalFestivalData';
import { businessIndustrialData } from './categories/businessIndustrialData';
import { giftItemsData } from './categories/giftItemsData';
import { travelLuggageData } from './categories/travelLuggageData';
import { petSuppliesData } from './categories/petSuppliesData';
import { medicalHealthcareData } from './categories/medicalHealthcareData';
import { gardenOutdoorData } from './categories/gardenOutdoorData';
import { securitySafetyData } from './categories/securitySafetyData';
import { wholesaleBulkData } from './categories/wholesaleBulkData';
import { secondHandData } from './categories/secondHandData';
import { localSpecialtiesData } from './categories/localSpecialtiesData';

export const categoriesData: MainCategory[] = [
  fashionData,
  electronicsData,
  homeGardenData,
  healthBeautyData,
  foodGroceriesData,
  booksEducationData,
  sportsOutdoorData,
  automobilesData,
  babyKidsData,
  handicraftsData,
  toysHobbiesData,
  jewelryData,
  musicalInstrumentsData,
  digitalProductsData,
  seasonalFestivalData,
  businessIndustrialData,
  giftItemsData,
  travelLuggageData,
  petSuppliesData,
  medicalHealthcareData,
  gardenOutdoorData,
  securitySafetyData,
  wholesaleBulkData,
  secondHandData,
  localSpecialtiesData
];
