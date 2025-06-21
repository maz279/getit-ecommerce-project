
import { MainCategory } from '../categoriesData';
import { createElement } from 'react';
import { Car } from 'lucide-react';
import { carsMotorcyclesData } from './automobiles/carsMotorcyclesData';
import { autoPartsData } from './automobiles/autoPartsData';
import { automotiveServicesData } from './automobiles/automotiveServicesData';

export const automobilesData: MainCategory = {
  id: 'automobiles-vehicles',
  name: 'Automobiles & Vehicles',
  icon: createElement(Car, { className: 'w-6 h-6' }),
  color: 'text-gray-600',
  count: 8765,
  featured: false,
  subcategories: {
    'cars-motorcycles': carsMotorcyclesData,
    'auto-parts': autoPartsData,
    'automotive-services': automotiveServicesData
  }
};
