
import { MainCategory } from '../categoriesData';
import { createElement } from 'react';
import { Medkit } from 'lucide-react';
import { medicalEquipmentData } from './medicalHealthcare/medicalEquipmentData';
import { medicinesSupplementsData } from './medicalHealthcare/medicinesSupplementsData';

export const medicalHealthcareData: MainCategory = {
  id: 'medical-healthcare',
  name: 'Medical & Healthcare',
  icon: createElement(Medkit, { className: 'w-6 h-6' }),
  color: 'text-red-600',
  count: 3210,
  featured: false,
  subcategories: {
    'medical-equipment': medicalEquipmentData,
    'medicines-supplements': medicinesSupplementsData
  }
};
